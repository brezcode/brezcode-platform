/**
 * Email Verification Module
 * Reusable email verification system for any application
 * 
 * Features:
 * - Generate and manage verification codes
 * - Session-based pending user storage
 * - Resend functionality
 * - Email verification endpoints
 * - Configurable code length and expiry
 */

export interface PendingUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier?: string;
  isEmailVerified: boolean;
  verificationCode: string;
  codeGeneratedAt: Date | string;
}

export interface EmailVerificationConfig {
  codeLength: number;
  codeExpiryMinutes: number;
  allowResend: boolean;
  resendCooldownSeconds: number;
}

export class EmailVerificationModule {
  private config: EmailVerificationConfig;

  constructor(config: Partial<EmailVerificationConfig> = {}) {
    this.config = {
      codeLength: 6,
      codeExpiryMinutes: 15,
      allowResend: true,
      resendCooldownSeconds: 60,
      ...config
    };
  }

  /**
   * Generate a random verification code
   */
  generateVerificationCode(): string {
    const min = Math.pow(10, this.config.codeLength - 1);
    const max = Math.pow(10, this.config.codeLength) - 1;
    return Math.floor(min + Math.random() * (max - min)).toString();
  }

  /**
   * Create a pending user for email verification
   */
  createPendingUser(userData: {
    email: string;
    firstName: string;
    lastName: string;
    subscriptionTier?: string;
  }): PendingUser {
    return {
      id: Date.now(),
      ...userData,
      isEmailVerified: false,
      verificationCode: this.generateVerificationCode(),
      codeGeneratedAt: new Date(),
      subscriptionTier: userData.subscriptionTier || 'basic'
    };
  }

  /**
   * Check if verification code is expired
   */
  isCodeExpired(codeGeneratedAt: Date | string): boolean {
    const now = new Date();
    const generatedTime = typeof codeGeneratedAt === 'string' ? new Date(codeGeneratedAt) : codeGeneratedAt;
    const expiryTime = new Date(generatedTime.getTime() + (this.config.codeExpiryMinutes * 60 * 1000));
    return now > expiryTime;
  }

  /**
   * Validate verification code
   */
  validateCode(pendingUser: PendingUser, inputCode: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!pendingUser) {
      return { isValid: false, error: "No pending verification found" };
    }

    if (this.isCodeExpired(pendingUser.codeGeneratedAt)) {
      return { isValid: false, error: "Verification code has expired" };
    }

    if (pendingUser.verificationCode !== inputCode) {
      return { isValid: false, error: "Invalid verification code" };
    }

    return { isValid: true };
  }

  /**
   * Generate new verification code for resend
   */
  regenerateCode(pendingUser: PendingUser): PendingUser {
    return {
      ...pendingUser,
      verificationCode: this.generateVerificationCode(),
      codeGeneratedAt: new Date()
    };
  }

  /**
   * Complete email verification and return verified user
   */
  completeVerification(pendingUser: PendingUser) {
    const { verificationCode, codeGeneratedAt, ...verifiedUser } = pendingUser;
    return {
      ...verifiedUser,
      isEmailVerified: true
    };
  }

  /**
   * Send verification code via email (with SendGrid integration)
   */
  async sendVerificationCode(email: string, code: string): Promise<void> {
    // Always log to console for development
    console.log(`Verification code for ${email}: ${code}`);
    
    // Try to send via email using SendGrid if configured
    try {
      const sgMail = await import('@sendgrid/mail');
      if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: email,
          from: process.env.FROM_EMAIL,
          subject: "Verify your email address",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Your verification code is:</p>
              <div style="font-size: 24px; font-weight: bold; color: #007bff; padding: 20px; background: #f8f9fa; border-radius: 5px; text-align: center; margin: 20px 0;">
                ${code}
              </div>
              <p>This code will expire in 15 minutes.</p>
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
          `
        };
        
        await sgMail.default.send(msg);
        console.log(`Verification email sent to ${email}`);
      }
    } catch (error: any) {
      console.log(`Email sending failed, using console logging: ${error.message}`);
    }
  }
}

/**
 * Express.js middleware integration
 */
export function createEmailVerificationRoutes(emailModule: EmailVerificationModule) {
  return {
    // Signup endpoint that creates pending user
    signup: async (req: any, res: any) => {
      const { firstName, lastName, email, password, subscriptionTier } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Please fill in all required fields" });
      }
      
      try {
        // CRITICAL: Check if user already exists before creating pending user
        const { storage } = await import('./storage');
        const existingUser = await storage.getUserByEmail(email);
        
        console.log('Signup duplicate check for:', email, 'Found existing user:', !!existingUser);
        
        if (existingUser) {
          console.log('Blocking duplicate signup for:', email);
          return res.status(409).json({ 
            error: "An account with this email address already exists. Please sign in instead." 
          });
        }
        
        // Create pending user only after confirming email is available
        const pendingUser = emailModule.createPendingUser({
          email,
          firstName,
          lastName,
          subscriptionTier
        });
        
        // Store in storage system instead of session for better persistence
        if ('storePendingUser' in storage) {
          await storage.storePendingUser(email, { ...pendingUser, password });
        }
        await storage.createEmailVerification(email, pendingUser.verificationCode);
        
        // Send verification code
        await emailModule.sendVerificationCode(email, pendingUser.verificationCode);
        
        res.json({
          message: "Account created successfully. Please verify your email.",
          requiresVerification: true,
          email: email
        });
      } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({ error: "Something went wrong during registration. Please try again." });
      }
    },

    // Verify email endpoint
    verifyEmail: async (req: any, res: any) => {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }
      
      try {
        // Get verification and pending user from storage
        const { storage } = await import('./storage');
        const verification = await storage.getEmailVerification(email, code);
        const pendingUser = 'getPendingUser' in storage ? await storage.getPendingUser(email) : null;
        
        if (!verification) {
          return res.status(400).json({ error: "Invalid or expired verification code." });
        }
        
        if (!pendingUser) {
          return res.status(400).json({ error: "No pending verification found. Please register again." });
        }
        
        if (pendingUser.email !== email) {
          return res.status(400).json({ error: "Email mismatch. Please use the email you registered with." });
        }
      
        // Hash password and create user in storage
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash(pendingUser.password, 10);
        
        const newUser = await storage.createUser({
          firstName: pendingUser.firstName,
          lastName: pendingUser.lastName,
          email: pendingUser.email,
          password: hashedPassword
        });
        
        // Update the user to be email verified
        const verifiedCompleteUser = await storage.updateUser(newUser.id, { isEmailVerified: true });
        
        // Set authenticated session with the actual user ID from storage
        req.session.userId = newUser.id;
        req.session.isAuthenticated = true;
        
        // Clean up verification data
        if ('deletePendingUser' in storage) {
          await storage.deletePendingUser(email);
        }
        
        // Return the actual user from storage without password
        const { password: _, ...userWithoutPassword } = verifiedCompleteUser || newUser;
        res.json({
          user: userWithoutPassword,
          message: "Email verified successfully"
        });
      } catch (storageError: any) {
        console.error('Failed to create user in storage:', storageError);
        res.status(500).json({ error: "Failed to complete account creation" });
      }
    },

    // Resend verification code
    resendVerification: async (req: any, res: any) => {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      const pendingUser = req.session.pendingUser;
      
      if (!pendingUser || pendingUser.email !== email) {
        return res.status(400).json({ error: "No pending verification found for this email" });
      }
      
      try {
        // Generate new code
        const updatedPendingUser = emailModule.regenerateCode(pendingUser);
        req.session.pendingUser = updatedPendingUser;
        
        // Send new code
        await emailModule.sendVerificationCode(email, updatedPendingUser.verificationCode);
        
        res.json({ message: "Verification code resent successfully" });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Failed to resend verification code" });
      }
    }
  };
}

// Export default instance
export const defaultEmailVerification = new EmailVerificationModule();