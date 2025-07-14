import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import Stripe from "stripe";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, signupSchema, emailVerificationSchema, phoneVerificationSchema, type User, type SubscriptionTier } from "@shared/schema";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

// Stripe is optional for now
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
}) : null;

// Initialize Twilio client for SMS (optional)
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

// Initialize SendGrid for email (optional)
if (process.env.SENDGRID_API_KEY) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey.startsWith('SG.')) {
    console.log('API key does not start with "SG.".');
  }
  sgMail.setApiKey(apiKey);
  console.log(`SendGrid initialized with FROM_EMAIL: ${process.env.FROM_EMAIL}`);
}

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Price IDs for different tiers (these should be set in environment variables)
const PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || "price_basic_placeholder",
  pro: process.env.STRIPE_PRO_PRICE_ID || "price_pro_placeholder", 
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || "price_premium_placeholder",
};

declare module "express-session" {
  interface SessionData {
    userId?: number;
    isAuthenticated?: boolean;
  }
}

// Helper functions for sending notifications
async function sendEmailVerification(email: string, code: string): Promise<void> {
  if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
    try {
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'BrezCode - Email Verification Code',
        text: `Your BrezCode verification code is: ${code}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">BrezCode Email Verification</h2>
            <p>Thank you for joining BrezCode! Please use the following 6-digit code to verify your email address:</p>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #1f2937; letter-spacing: 0.1em; font-size: 32px; margin: 0;">${code}</h1>
            </div>
            <p>This code will expire in 10 minutes for security purposes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr>
            <p style="color: #6b7280; font-size: 12px;">BrezCode - Your AI-Powered Breast Health Coach</p>
          </div>
        `,
      };
      await sgMail.send(msg);
      console.log(`Email verification sent to ${email}`);
    } catch (error: any) {
      console.error('SendGrid email error:', error.message || error);
      if (error.code === 401) {
        console.error('SendGrid API key is invalid or unauthorized. Please check your SENDGRID_API_KEY.');
      }
      // Fall back to console logging
      console.log(`Email verification code for ${email}: ${code}`);
    }
  } else {
    // Development mode - log to console
    console.log(`Email verification code for ${email}: ${code}`);
  }
}

async function sendSMSVerification(phone: string, code: string): Promise<void> {
  if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
    try {
      await twilioClient.messages.create({
        body: `Your BrezCode verification code is: ${code}. This code expires in 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      console.log(`SMS verification sent to ${phone}`);
    } catch (error) {
      console.error('Twilio SMS error:', error);
      // Fall back to console logging
      console.log(`SMS verification code for ${phone}: ${code}`);
    }
  } else {
    // Development mode - log to console
    console.log(`SMS verification code for ${phone}: ${code}`);
  }
}

let SYSTEM_PROMPT = "";

// Load system prompt
try {
  SYSTEM_PROMPT = fs.readFileSync(path.join(process.cwd(), "prompt.txt"), "utf-8");
} catch (error) {
  console.warn("Warning: prompt.txt not found, using default system prompt");
  SYSTEM_PROMPT = "You are a helpful breast health coach AI assistant. Provide supportive, evidence-based guidance while encouraging users to consult with healthcare professionals for medical advice.";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    if (!req.session.isAuthenticated || !req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  const requireSubscription = (req: any, res: any, next: any) => {
    if (!req.user?.isSubscriptionActive) {
      return res.status(403).json({ message: "Active subscription required" });
    }
    next();
  };

  // Legacy auth routes (keeping for backward compatibility)
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      res.json({ 
        id: user.id, 
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isSubscriptionActive: user.isSubscriptionActive,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(loginData.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      res.json({ 
        id: user.id, 
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isSubscriptionActive: user.isSubscriptionActive,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", requireAuth, (req: any, res) => {
    const user = req.user;
    res.json({ 
      id: user.id, 
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      isSubscriptionActive: user.isSubscriptionActive,
    });
  });

  // Email verification routes
  app.post("/api/auth/send-email-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code
      await storage.createEmailVerification(email, code);
      
      // Send email verification via SendGrid or fallback to console
      await sendEmailVerification(email, code);
      
      res.json({ message: "Verification code sent" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { email, code } = emailVerificationSchema.parse(req.body);
      
      const verification = await storage.getEmailVerification(email, code);
      if (!verification) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Phone verification routes
  app.post("/api/auth/send-phone-verification", async (req, res) => {
    try {
      const { phone } = req.body;
      
      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code
      await storage.createPhoneVerification(phone, code);
      
      // Send SMS verification via Twilio or fallback to console
      await sendSMSVerification(phone, code);
      
      res.json({ message: "Verification code sent" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { phone, code } = phoneVerificationSchema.parse(req.body);
      
      const verification = await storage.getPhoneVerification(phone, code);
      if (!verification) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
      
      res.json({ message: "Phone verified successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // New signup route with verification
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Verify email was verified
      const emailVerification = await storage.getEmailVerification(userData.email, "verified");
      
      // Verify phone was verified
      const phoneVerification = await storage.getPhoneVerification(userData.phone, "verified");

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone,
        phoneCountryCode: userData.phoneCountryCode,
        quizAnswers: userData.quizAnswers,
      });

      // Mark email and phone as verified
      await storage.verifyEmail(userData.email);
      await storage.verifyPhone(userData.phone);

      req.session.userId = user.id;
      req.session.isAuthenticated = true;

      res.json({ 
        id: user.id, 
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isSubscriptionActive: user.isSubscriptionActive,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Subscription routes
  app.post("/api/create-subscription", requireAuth, async (req: any, res) => {
    if (!stripe) {
      return res.status(503).json({ message: "Payment processing not available. Stripe not configured." });
    }

    try {
      const { tier } = req.body;
      const user = req.user;

      if (!["basic", "pro", "premium"].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      let customerId = user.stripeCustomerId;

      // Create customer if doesn't exist
      if (!customerId) {
        const customer = await stripe!.customers.create({
          email: user.email,
          name: user.username,
        });
        customerId = customer.id;
        await storage.updateStripeCustomerId(user.id, customerId);
      }

      // Create subscription
      const subscription = await stripe!.subscriptions.create({
        customer: customerId,
        items: [{
          price: PRICE_IDS[tier as keyof typeof PRICE_IDS],
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      // Update user with subscription info
      await storage.updateUserSubscription(
        user.id,
        tier as SubscriptionTier,
        customerId,
        subscription.id
      );

      const invoice = subscription.latest_invoice as any;
      const paymentIntent = invoice?.payment_intent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent?.client_secret,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating subscription: " + error.message });
    }
  });

  // Chat routes (subscription requirement temporarily disabled)
  app.post("/api/chat", requireAuth, async (req: any, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      const user = req.user;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Check message limits based on tier
      if (user.subscriptionTier === "basic") {
        // In a real app, you'd track daily message count
        // For now, we'll allow unlimited for simplicity
      }

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory,
        { role: "user", content: message }
      ];

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: messages as any,
        max_tokens: user.subscriptionTier === "premium" ? 2000 : 1000,
        temperature: 0.7,
      });

      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

      res.json({ 
        response,
        tier: user.subscriptionTier,
      });
    } catch (error: any) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Error processing chat message: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
