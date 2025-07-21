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
  codeGeneratedAt: Date;
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
  isCodeExpired(codeGeneratedAt: Date): boolean {
    const now = new Date();
    const expiryTime = new Date(codeGeneratedAt.getTime() + (this.config.codeExpiryMinutes * 60 * 1000));
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
    return {
      ...pendingUser,
      isEmailVerified: true,
      verificationCode: undefined, // Clear the code
      codeGeneratedAt: undefined
    };
  }

  /**
   * Send verification code (override this method for actual email sending)
   */
  async sendVerificationCode(email: string, code: string): Promise<void> {
    // Default implementation - log to console
    console.log(`Verification code for ${email}: ${code}`);
    
    // In production, replace with actual email service:
    // await emailService.send({
    //   to: email,
    //   subject: "Verify your email address",
    //   template: "verification-code",
    //   data: { code }
    // });
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
        return res.status(400).json({ error: "All fields are required" });
      }
      
      try {
        // Create pending user
        const pendingUser = emailModule.createPendingUser({
          email,
          firstName,
          lastName,
          subscriptionTier
        });
        
        // Store in session
        req.session.pendingUser = pendingUser;
        
        // Send verification code
        await emailModule.sendVerificationCode(email, pendingUser.verificationCode);
        
        res.json({
          message: "Account created successfully. Please verify your email.",
          requiresVerification: true,
          email: email
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message || "Registration failed" });
      }
    },

    // Verify email endpoint
    verifyEmail: (req: any, res: any) => {
      const { email, code } = req.body;
      
      if (!email || !code) {
        return res.status(400).json({ error: "Email and verification code are required" });
      }
      
      const pendingUser = req.session.pendingUser;
      
      if (!pendingUser || pendingUser.email !== email) {
        return res.status(400).json({ error: "No pending verification found for this email" });
      }
      
      const validation = emailModule.validateCode(pendingUser, code);
      
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.error });
      }
      
      // Complete verification
      const verifiedUser = emailModule.completeVerification(pendingUser);
      
      // Set authenticated session
      req.session.userId = verifiedUser.id;
      req.session.isAuthenticated = true;
      req.session.pendingUser = null;
      
      res.json({
        user: verifiedUser,
        message: "Email verified successfully"
      });
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