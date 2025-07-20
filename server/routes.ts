import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import Stripe from "stripe";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, signupSchema, emailVerificationSchema, type User, type SubscriptionTier } from "@shared/schema";
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

// Authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session.userId && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Helper functions for sending notifications
async function sendEmailVerification(email: string, code: string): Promise<void> {
  if (process.env.SENDGRID_API_KEY && process.env.FROM_EMAIL) {
    try {
      const msg = {
        to: email,
        from: {
          email: process.env.FROM_EMAIL,
          name: 'BrezCode Support'
        },
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
      } else if (error.code === 403) {
        console.error('SendGrid Forbidden: The FROM_EMAIL address needs to be verified in SendGrid. Please verify brezcode2024@gmail.com in your SendGrid dashboard.');
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
    } catch (error: any) {
      console.error('Twilio SMS error:', error);
      if (error.code === 21266) {
        console.error('Twilio error: Cannot send SMS to the same number as the FROM number. Please test with a different phone number.');
      } else if (error.code === 21408) {
        console.error(`Twilio error: Permission to send SMS has not been enabled for the region indicated by the number: ${phone}. Please enable SMS for this region in your Twilio console.`);
      }
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
        // Special handling for test email - allow re-registration
        if (userData.email === "leedennyps@gmail.com") {
          console.log("Test email detected in legacy route - deleting existing user for re-registration");
          try {
            const deleteResult = await storage.deleteUser(userData.email);
            console.log("Legacy route delete result:", deleteResult);
            // Continue to create new user after successful deletion
          } catch (deleteError) {
            console.error("Error deleting test user:", deleteError);
            return res.status(500).json({ message: "Failed to reset test account" });
          }
        } else {
          return res.status(400).json({ 
            message: "This email address is already registered. Please use a different email address or try logging in instead.",
            type: "EMAIL_EXISTS"
          });
        }
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

  // Health Report Generation (Test Mode - No Auth Required)
  app.post('/api/reports/generate-test', async (req: any, res: Response) => {
    try {
      const { quizAnswers } = req.body;

      if (!quizAnswers) {
        return res.status(400).json({ message: 'Quiz answers are required' });
      }

      // Import the report generator
      const { reportGenerator } = await import('./reportGenerator');

      // Generate comprehensive report without requiring authentication
      const reportData = reportGenerator.generateComprehensiveReport(quizAnswers);
      reportData.userId = 999; // Test user ID

      res.json({
        success: true,
        report: reportData
      });
    } catch (error) {
      console.error('Error generating test health report:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Health Report Generation (Authenticated)
  app.post('/api/reports/generate', requireAuth, async (req: any, res: Response) => {
    try {
      const { quizAnswers } = req.body;

      if (!quizAnswers) {
        return res.status(400).json({ message: 'Quiz answers are required' });
      }

      // Import the report generator
      const { reportGenerator } = await import('./reportGenerator');

      // Generate comprehensive report
      const reportData = reportGenerator.generateComprehensiveReport(quizAnswers);
      reportData.userId = req.user.id;

      // Save to storage
      const savedReport = await storage.createHealthReport(reportData);

      res.json({
        success: true,
        report: savedReport
      });
    } catch (error) {
      console.error('Error generating health report:', error);
      res.status(500).json({ message: 'Failed to generate health report' });
    }
  });

  // Get user's health reports
  app.get('/api/reports', requireAuth, async (req: any, res: Response) => {
    try {
      const reports = await storage.getHealthReports(req.user.id);
      res.json(reports);
    } catch (error) {
      console.error('Error fetching health reports:', error);
      res.status(500).json({ message: 'Failed to fetch health reports' });
    }
  });

  // Get latest health report
  app.get('/api/reports/latest', requireAuth, async (req: any, res: Response) => {
    try {
      const report = await storage.getLatestHealthReport(req.user.id);
      if (!report) {
        return res.status(404).json({ message: 'No health reports found' });
      }
      res.json(report);
    } catch (error) {
      console.error('Error fetching latest health report:', error);
      res.status(500).json({ message: 'Failed to fetch latest health report' });
    }
  });

  // Email verification routes
  app.post("/api/auth/send-email-verification", async (req, res) => {
    try {
      const { email } = req.body;

      // Generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Store verification code (allow overwriting existing codes)
      await storage.createEmailVerification(email, code);

      // Send email verification via SendGrid or fallback to console
      await sendEmailVerification(email, code);

      res.json({ message: "Verification code sent" });
    } catch (error: any) {
      console.error("Email verification error:", error);
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

      // Actually verify the email in storage
      await storage.verifyEmail(email);

      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Phone verification routes removed - using Firebase Auth + email verification only

  // New signup route with verification
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const userData = signupSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        // Special handling for test email - allow re-registration
        if (userData.email === "leedennyps@gmail.com") {
          console.log("Test email detected - deleting existing user for re-registration");
          try {
            const deleteResult = await storage.deleteUser(userData.email);
            console.log("Delete result:", deleteResult);
            // Continue to create new user after successful deletion
          } catch (deleteError) {
            console.error("Error deleting test user:", deleteError);
            return res.status(500).json({ message: "Failed to reset test account" });
          }
        } else {
          return res.status(400).json({ 
            message: "This email address is already registered. Please use a different email address or try logging in instead.",
            type: "EMAIL_EXISTS"
          });
        }
      }

      // For simple signup, we'll verify email during the flow

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = await storage.createUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        quizAnswers: userData.quizAnswers,
      });

      // Email verification will be handled separately during the signup flow

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

  // Debug route to test report generation
  app.get('/debug-report', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../debug-report.html'));
  });

  // Generate report now route
  app.get('/generate-now', (req, res) => {
    res.sendFile(require('path').join(__dirname, '../generate-report-now.html'));
  });

  // Health Report Generation (Demo - No Auth Required)
  app.post('/api/reports/generate-demo', async (req: Request, res: Response) => {
    try {
      console.log('Demo report request received:', req.body);
      const { quizAnswers } = req.body;

      if (!quizAnswers) {
        console.error('No quiz answers provided in request');
        return res.status(400).json({ 
          success: false, 
          message: 'Quiz answers are required' 
        });
      }

      console.log('Quiz answers received:', Object.keys(quizAnswers));

      // Import the report generator
      const { reportGenerator } = await import('./reportGenerator');

      // Generate comprehensive report without requiring authentication
      console.log('Generating report...');
      const reportData = reportGenerator.generateComprehensiveReport(quizAnswers);
      reportData.userId = 999; // Test user ID
      reportData.createdAt = new Date().toISOString();
      
      // Add user information for display (will be replaced with real data after signup)
      reportData.userInfo = {
        firstName: "Demo",
        lastName: "User"
      };

      console.log('Report generated successfully');
      res.json({
        success: true,
        report: reportData
      });
    } catch (error) {
      console.error('Error generating demo health report:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  // User feedback API for continuous learning
  app.post('/api/feedback', requireAuth, async (req: any, res) => {
    try {
      const { submitUserFeedback } = await import('./userFeedback');
      const result = await submitUserFeedback(req.user.id, req.body);
      res.json(result);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ success: false, message: 'Failed to submit feedback' });
    }
  });

  // Internationalization API with AI translations
  app.get('/api/translations/:languageCode', async (req, res) => {
    try {
      const { languageCode } = req.params;
      
      // If English, return original text
      if (languageCode === 'en') {
        const englishTranslations = {
          'quiz.title': 'Breast Cancer Assessment Quiz',
          'quiz.age.title': 'What is your age?',
          'report.title': 'Your Health Report',
          'coaching.daily_tip': 'Daily Health Tip',
          'button.continue': 'Continue',
          'button.submit': 'Submit',
          // Hero section translations
          'hero.badge': 'Evidence-based AI coaching available 24/7',
          'hero.statistic': '"1 in 8 women in US will develop breast cancer in their lifetime"... According to WHO',
          'hero.title1': 'Good news! You can now',
          'hero.reverse': 'REVERSE',
          'hero.title2': 'the development',
          'hero.title3': 'and lower the risk by',
          'hero.percentage': '100% in 15 days.',
          'hero.subtitle1': 'The #1 evidence-based AI breast health coaching platform to help you',
          'hero.subtitle2': 'regain control of your wellness.',
          'hero.urgency': 'Don\'t wait until it is too late, your family depends on you.',
          'hero.cta': 'Take the quiz to start',
          'hero.freeText': 'Start for free. Cancel any time.',
          // App features section translations
          'landing.appFeatures.title': 'An app, community, and',
          'landing.appFeatures.subtitle': 'coach in your pocket',
          'landing.appFeatures.description': 'After a quick quiz, we\'ll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.',
          // Navigation translations
          'nav.brand': 'BrezCode',
          'nav.features': 'Features',
          'nav.pricing': 'Pricing',
          'nav.signIn': 'Sign In',
          'nav.signUp': 'Sign Up',
          'nav.logout': 'Sign Out',
          'nav.dashboard': 'Dashboard',
          // Features section translations
          'features.title': 'Evidence-based activities to reverse breast cancer development',
          'features.subtitle': 'All activities are scientifically proven to reduce breast cancer risk',
          'features.activity1.title': 'Daily 5mins breathing exercise',
          'features.activity1.description': 'Lower Chronic stress',
          'features.activity1.reduction': '-15% risk',
          'features.activity2.title': 'Daily 10mins mindfulness exercise',
          'features.activity2.description': 'Increase positivity',
          'features.activity2.reduction': '-5% risk',
          'features.activity3.title': '3x/weekly Self Breast Massage',
          'features.activity3.description': 'Lower Chronic inflammation',
          'features.activity3.reduction': '-20% risk',
          'features.activity4.title': 'Personalized dietary management',
          'features.activity4.description': 'Lower Carcinogen',
          'features.activity4.reduction': '-20% risk',
          'features.activity5.title': 'Daily Physical exercise tracking',
          'features.activity5.description': 'Lower oxidative stress',
          'features.activity5.reduction': '-40% risk',
          'features.activity6.title': 'Monthly Self Breast Exam',
          'features.activity6.description': 'Early Symptom Detection',
          'features.activity6.reduction': '-20% risk',
          'features.activity7.title': 'Daily educational content and tips',
          'features.activity7.description': 'Increase awareness',
          'features.activity7.reduction': '-5% risk',
          'features.activity8.title': 'AI-Risk Monitoring system',
          'features.activity8.description': 'Early detection',
          'features.activity8.reduction': '-50% risk',
          // Pricing section translations
          'pricing.title': 'Choose Your Health Journey',
          'pricing.subtitle': 'Start your transformation today with our evidence-based coaching',
          'pricing.basic.name': 'Basic',
          'pricing.basic.price': '$4.99',
          'pricing.basic.feature1': 'Basic risk assessment',
          'pricing.basic.feature2': 'Weekly health tips',
          'pricing.basic.feature3': 'Limited AI chat (10 messages/day)',
          'pricing.pro.name': 'Pro',
          'pricing.pro.price': '$9.99',
          'pricing.pro.popular': 'Most Popular',
          'pricing.pro.feature1': 'Comprehensive risk assessment',
          'pricing.pro.feature2': 'Daily personalized coaching',
          'pricing.pro.feature3': 'Unlimited AI chat support',
          'pricing.pro.feature4': 'Progress tracking & analytics',
          'pricing.premium.name': 'Premium',
          'pricing.premium.price': '$19.99',
          'pricing.premium.feature1': 'Advanced genetic risk analysis',
          'pricing.premium.feature2': 'Priority AI responses',
          'pricing.premium.feature3': 'Expert consultation scheduling',
          'pricing.premium.feature4': 'Family sharing (up to 4 members)',
          'pricing.button': 'Get Started',
          // App features cards
          'appFeatures.weeklyPlanning.title': 'Weekly planning',
          'appFeatures.weeklyPlanning.description': 'Every Sunday you\'ll get a personalized plan for the week ahead. Pre-commit to your week ahead to crush your goals.',
          'appFeatures.community.title': 'Community',
          'appFeatures.community.description': 'Give and get support in the vibrant BrezCode community, a place to cultivate a positive mindset every day.',
          'appFeatures.resources.title': 'Resources',
          'appFeatures.resources.description': 'Exercises, videos, and resources are available on-demand to help you stay motivated when you need it.',
          'appFeatures.coaching.title': 'Coaching',
          'appFeatures.coaching.description': 'Get personalized coaching from our AI health assistant trained on evidence-based breast health protocols.',
          'appFeatures.tracking.title': 'Progress Tracking',
          'appFeatures.tracking.description': 'Monitor your health improvements with our comprehensive tracking system and detailed analytics.',
          'appFeatures.alerts.title': 'Smart Alerts',
          'appFeatures.alerts.description': 'Receive intelligent reminders and health alerts customized to your schedule and preferences.',
          // Promise section translations
          'promise.title': 'Our Promise to You',
          'promise.description': 'We know this is a deeply personal journey for you, as it was for us. We follow a strict code of conduct and promise to always put your health and wellness above all else.',
          'promise.noShame.title': 'No shame or guilt ever',
          'promise.noShame.description': 'Mindful lifestyle is about celebrating our wins, not making you feel bad.',
          'promise.private.title': 'Always private and secure',
          'promise.private.description': 'This is a personal, private journey for you. We make privacy a top priority.',
          'promise.guarantee.title': 'Money back guarantee',
          'promise.guarantee.description': 'If you give it a fair shot and aren\'t happy after 30 days, just let us know!',
          // Testimonials section translations
          'testimonials.title': 'Results from real people like you',
          'testimonials.subtitle': 'These are real customer reviews, and we have hundreds more',
          'testimonials.customer1.name': 'Mia',
          'testimonials.customer1.quote': 'As a young woman, I ignored breast health. This app\'s fun, quick lessons taught me to listen to my body and act early!',
          'testimonials.customer2.name': 'Emily',
          'testimonials.customer2.quote': 'I found a lump and panicked. The app guided me through self-exams and screening info, helping me stay calm and get answers fast.',
          'testimonials.customer3.name': 'Aisha',
          'testimonials.customer3.quote': 'My sister had breast cancer, so I\'m high-risk. The app\'s risk scoring and check-in reminders help me feel in control of my health!',
          'testimonials.verified': 'Real BrezCode Customer',
          // Results section translations
          'results.title': 'With measurable impact',
          'results.subtitle': 'Results reported from a recent customer survey',
          'results.anxiety': '96% feel less anxiety',
          'results.diet': '90% improve diet quality',
          'results.sleep': '87% have better sleep',
          'results.accomplished': '80% feel accomplished',
          'results.mental': '75% improve mental health',
          'results.breast': '100% improve breast health',
          // Sign up section translations
          'signup.title': 'Start Your Journey Today',
          'signup.subtitle': 'Join thousands of women taking control of their breast health with personalized AI guidance and support.',
          'signup.button': 'Start Your Health Assessment',
          'signup.description': 'Complete our 23-question assessment to get personalized insights',
          // Hero chat bubbles and member stats
          'hero.chat1': 'Hey Sue, how\'d it go yesterday?',
          'hero.chat2': 'I am following the plan, and feeling great today!',
          'hero.chat3': 'Great work sticking to your plan!',
          'hero.members.title': 'of members report',
          'hero.members.subtitle': 'reduced anxiety after 90 days',
          'hero.members.study': 'In addition, BrezCode members feel accomplished by an average of 80% after 90 days, as verified in a third-party study.',
          // Risk chart translations
          'riskChart.total': 'Total Risk Reduction: 175% 🎯',
          'riskChart.maxProtection': 'Maximum protection achieved! 🛡️',
          // Additional pricing translations
          'pricing.extra.messaging': 'AI chatbot messaging interface',
          'pricing.extra.community': 'Supportive community',
          'pricing.extra.moderation': 'Focus on moderation',
          'pricing.extra.affordable': 'Affordable cost',
          'pricing.startQuiz': 'Take the quiz to start',
          'pricing.noCard': 'Start immediately • No credit card required • Cancel anytime',
          'pricing.guarantee': '30-day money-back guarantee',
          'pricing.cancel': 'Cancel anytime',
          'pricing.noFees': 'No hidden fees',
          // Features help section
          'features.help.title': 'Brezcode can help you',
          'features.help.benefit1.title': 'Reduce breast cancer risk',
          'features.help.benefit1.description': 'No matter where you are on your journey, Brezcode can help you reduce risk, with no pressure to be perfect.',
          'features.help.benefit2.title': 'Gain control over your wellness',
          'features.help.benefit2.description': 'We\'ll teach you the science-backed habits and techniques to gain control over your breast health.',
          'features.help.benefit3.title': 'Reduce anxiety and stress',
          'features.help.benefit3.description': 'The days of anxiety ruining your day or week are over. Learn to enjoy peace of mind with fewer negative effects.',
          'features.help.benefit4.title': 'Improve your well-being',
          'features.help.benefit4.description': 'Taking care of your health can have a big positive impact on your sleep, mental health, relationships, and more.',
          'features.help.button': 'Take the quiz to start',
          // Premium pricing section
          'pricing.header.trial': 'Free 15-day trial, then',
          'pricing.header.simple': 'simple pricing',
          'pricing.bestValue': 'BEST VALUE',
          'pricing.premium.title': 'BrezCode Premium',
          'pricing.premium.free': 'Free',
          'pricing.premium.price': '15 days, then $4.99/month',
          'pricing.premium.terms': 'Cancel anytime • No hidden fees',
          'pricing.premium.feature1': 'Easy Risk scoring and tracking',
          'pricing.premium.feature2': 'Weekly Planning',
          'pricing.premium.feature3': 'Analytics & dashboard',
          'pricing.premium.feature4': 'Personalized recommendations',
          // Risk chart activity names
          'riskChart.breathing': 'Breathing',
          'riskChart.mindfulness': 'Mindfulness', 
          'riskChart.massage': 'Massage',
          'riskChart.diet': 'Diet',
          'riskChart.exercise': 'Exercise',
          'riskChart.exam': 'Exam',
          'riskChart.education': 'Education',
          'riskChart.aiMonitor': 'AI Monitor',
          'riskChart.reach100': 'Reach Risk Reduction of 100%',
          'riskChart.combineAll': 'Combine all activities for maximum protection!',
          'riskChart.byActivity': 'Risk Reduction by Activity',
          // Footer translations
          'footer.description': 'Empowering women with AI-driven breast health insights and personalized coaching for proactive wellness management.',
          'footer.product': 'Product',
          'footer.features': 'Features',
          'footer.pricing': 'Pricing',
          'footer.faq': 'FAQ',
          'footer.support': 'Support',
          'footer.company': 'Company',
          'footer.about': 'About',
          'footer.privacy': 'Privacy',
          'footer.terms': 'Terms',
          'footer.contact': 'Contact',
          'footer.copyright': '© 2024 BrezCode. All rights reserved. This service is for informational purposes only and does not replace professional medical advice.'
        };
        return res.json(englishTranslations);
      }

      // For other languages, use high-quality hardcoded translations for now
      const translations: Record<string, Record<string, string>> = {
        'zh-TW': {
          'quiz.title': '乳癌風險評估',
          'quiz.age.title': '請問您的年齡是？',
          'report.title': '您的健康報告',
          'coaching.daily_tip': '每日健康小貼士',
          'button.continue': '繼續',
          'button.submit': '提交',
          // Hero section translations
          'hero.badge': '24/7 循證AI健康指導',
          'hero.statistic': '「美國每8名女性中就有1名會在一生中罹患乳癌」... 根據世界衛生組織',
          'hero.title1': '好消息！您現在可以',
          'hero.reverse': '逆轉',
          'hero.title2': '疾病發展',
          'hero.title3': '並在15天內降低風險',
          'hero.percentage': '高達100%。',
          'hero.subtitle1': '第一名循證AI乳房健康指導平台',
          'hero.subtitle2': '幫助您重新掌控健康。',
          'hero.urgency': '別等到為時已晚，您的家人需要您。',
          'hero.cta': '開始評估測驗',
          'hero.freeText': '免費開始・隨時取消',
          // App features section translations
          'landing.appFeatures.title': '結合應用程式、社群和',
          'landing.appFeatures.subtitle': '隨身健康教練',
          'landing.appFeatures.description': '透過快速評估，我們將為您量身打造第一個週計劃，介紹日常健康習慣，並邀請您加入我們的私人社群。專業教練將陪伴您的每一步。',
          // Navigation translations
          'nav.brand': 'BrezCode',
          'nav.features': '功能特色',
          'nav.pricing': '訂閱方案',
          'nav.signIn': '登入',
          'nav.signUp': '註冊',
          'nav.logout': '登出',
          'nav.dashboard': '控制台',
          // Features section translations
          'features.title': '循證活動逆轉乳癌發展',
          'features.subtitle': '所有活動均經科學證實可降低乳癌風險',
          'features.activity1.title': '每日5分鐘呼吸練習',
          'features.activity1.description': '降低慢性壓力',
          'features.activity1.reduction': '降低15%風險',
          'features.activity2.title': '每日10分鐘正念練習',
          'features.activity2.description': '增加正向情緒',
          'features.activity2.reduction': '降低5%風險',
          'features.activity3.title': '每週3次乳房自我按摩',
          'features.activity3.description': '降低慢性發炎',
          'features.activity3.reduction': '降低20%風險',
          'features.activity4.title': '個人化飲食管理',
          'features.activity4.description': '降低致癌物質',
          'features.activity4.reduction': '降低20%風險',
          'features.activity5.title': '每日運動追蹤',
          'features.activity5.description': '降低氧化壓力',
          'features.activity5.reduction': '降低40%風險',
          'features.activity6.title': '每月乳房自我檢查',
          'features.activity6.description': '早期症狀偵測',
          'features.activity6.reduction': '降低20%風險',
          'features.activity7.title': '每日健康教育內容',
          'features.activity7.description': '提升健康意識',
          'features.activity7.reduction': '降低5%風險',
          'features.activity8.title': 'AI風險監控系統',
          'features.activity8.description': '早期檢測',
          'features.activity8.reduction': '降低50%風險',
          // Pricing section translations
          'pricing.title': '選擇您的健康之路',
          'pricing.subtitle': '立即開始您的健康轉變，體驗循證指導',
          'pricing.basic.name': '基礎版',
          'pricing.basic.price': '$4.99',
          'pricing.basic.feature1': '基礎風險評估',
          'pricing.basic.feature2': '每週健康小貼士',
          'pricing.basic.feature3': '有限AI對話（每日10則訊息）',
          'pricing.pro.name': '專業版',
          'pricing.pro.price': '$9.99',
          'pricing.pro.popular': '最受歡迎',
          'pricing.pro.feature1': '全面風險評估',
          'pricing.pro.feature2': '每日個人化指導',
          'pricing.pro.feature3': '無限AI對話支援',
          'pricing.pro.feature4': '進度追蹤與分析',
          'pricing.premium.name': '頂級版',
          'pricing.premium.price': '$19.99',
          'pricing.premium.feature1': '進階基因風險分析',
          'pricing.premium.feature2': '優先AI回應',
          'pricing.premium.feature3': '專家諮詢預約',
          'pricing.premium.feature4': '家庭共享（最多4位成員）',
          'pricing.button': '開始使用',
          // App features cards
          'appFeatures.weeklyPlanning.title': '週計劃',
          'appFeatures.weeklyPlanning.description': '每個星期日您將收到個人化的週計劃。提前規劃您的一週來達成健康目標。',
          'appFeatures.community.title': '社群',
          'appFeatures.community.description': '在活躍的BrezCode社群中互相支持，每天培養正向心態的地方。',
          'appFeatures.resources.title': '資源',
          'appFeatures.resources.description': '練習、影片和資源隨時可用，在您需要時提供動力支持。',
          'appFeatures.coaching.title': '健康指導',
          'appFeatures.coaching.description': '獲得由循證乳房健康協議訓練的AI健康助理提供的個人化指導。',
          'appFeatures.tracking.title': '進度追蹤',
          'appFeatures.tracking.description': '通過我們的綜合追蹤系統和詳細分析監控您的健康改善。',
          'appFeatures.alerts.title': '智能提醒',
          'appFeatures.alerts.description': '接收根據您的時程和偏好客製化的智能提醒和健康警示。',
          // Promise section translations
          'promise.title': '我們對您的承諾',
          'promise.description': '我們知道這是您深具個人意義的健康之旅，正如我們的經歷一樣。我們遵循嚴格的行為準則，承諾始終將您的健康與福祉置於首位。',
          'promise.noShame.title': '絕不羞辱或內疚',
          'promise.noShame.description': '正念生活方式在於慶祝我們的成功，而非讓您感到不良。',
          'promise.private.title': '始終私密且安全',
          'promise.private.description': '這是您個人私密的健康旅程。我們將隱私保護視為首要任務。',
          'promise.guarantee.title': '退款保證',
          'promise.guarantee.description': '如果您認真嘗試後30天內仍不滿意，請告知我們！',
          // Testimonials section translations
          'testimonials.title': '真實用戶的成果見證',
          'testimonials.subtitle': '這些是真實的客戶評價，我們還有數百則更多見證',
          'testimonials.customer1.name': 'Mia',
          'testimonials.customer1.quote': '作為年輕女性，我忽視了乳房健康。這個應用程式有趣、快速的課程教會我聆聽身體並及早行動！',
          'testimonials.customer2.name': 'Emily',
          'testimonials.customer2.quote': '我發現腫塊時驚慌失措。應用程式指導我進行自我檢查和篩檢資訊，幫助我保持冷靜並快速獲得答案。',
          'testimonials.customer3.name': 'Aisha',
          'testimonials.customer3.quote': '我姊姊患有乳癌，所以我是高風險群。應用程式的風險評分和提醒檢查讓我感到能掌控自己的健康！',
          'testimonials.verified': '真實BrezCode客戶',
          // Results section translations
          'results.title': '具有可衡量的影響',
          'results.subtitle': '來自最近客戶調查的結果報告',
          'results.anxiety': '96% 減少焦慮感',
          'results.diet': '90% 改善飲食品質',
          'results.sleep': '87% 獲得更好睡眠',
          'results.accomplished': '80% 感到有成就感',
          'results.mental': '75% 改善心理健康',
          'results.breast': '100% 改善乳房健康',
          // Sign up section translations
          'signup.title': '立即開始您的健康之旅',
          'signup.subtitle': '加入數千名女性，透過個人化AI指導和支持掌控乳房健康。',
          'signup.button': '開始健康評估',
          'signup.description': '完成我們的23題評估以獲得個人化見解',
          // Hero chat bubbles and member stats
          'hero.chat1': '嘿蘇，昨天怎麼樣？',
          'hero.chat2': '我正在遵循計劃，今天感覺很棒！',
          'hero.chat3': '很棒，繼續堅持您的計劃！',
          'hero.members.title': '的會員報告',
          'hero.members.subtitle': '90天後焦慮減少',
          'hero.members.study': '此外，根據第三方研究驗證，BrezCode會員在90天後平均感到80%的成就感。',
          // Risk chart translations
          'riskChart.total': '總風險降低：175% 🎯',
          'riskChart.maxProtection': '達到最大保護！🛡️',
          // Additional pricing translations
          'pricing.extra.messaging': 'AI聊天機器人訊息介面',
          'pricing.extra.community': '支持性社群',
          'pricing.extra.moderation': '專注適度',
          'pricing.extra.affordable': '實惠價格',
          'pricing.startQuiz': '開始測驗',
          'pricing.noCard': '立即開始・無需信用卡・隨時取消',
          'pricing.guarantee': '30天退款保證',
          'pricing.cancel': '隨時取消',
          'pricing.noFees': '無隱藏費用',
          // Features help section
          'features.help.title': 'Brezcode可以幫助您',
          'features.help.benefit1.title': '降低乳癌風險',
          'features.help.benefit1.description': '無論您在健康旅程的哪個階段，Brezcode都能幫助您降低風險，沒有完美的壓力。',
          'features.help.benefit2.title': '掌控您的健康',
          'features.help.benefit2.description': '我們將教您科學支持的習慣和技巧，讓您掌控乳房健康。',
          'features.help.benefit3.title': '減少焦慮和壓力',
          'features.help.benefit3.description': '焦慮破壞您一天或一週的日子已經結束了。學會享受內心平靜，減少負面影響。',
          'features.help.benefit4.title': '改善您的整體健康',
          'features.help.benefit4.description': '照顧您的健康對睡眠、心理健康、人際關係等方面都有很大的正面影響。',
          'features.help.button': '開始測驗',
          // Premium pricing section
          'pricing.header.trial': '免費15天試用，然後',
          'pricing.header.simple': '簡單定價',
          'pricing.bestValue': '最佳價值',
          'pricing.premium.title': 'BrezCode高級版',
          'pricing.premium.free': '免費',
          'pricing.premium.price': '15天，然後每月$4.99',
          'pricing.premium.terms': '隨時取消・無隱藏費用',
          'pricing.premium.feature1': '簡易風險評分和追蹤',
          'pricing.premium.feature2': '每週規劃',
          'pricing.premium.feature3': '分析和儀表板',
          'pricing.premium.feature4': '個人化建議',
          // Risk chart activity names
          'riskChart.breathing': '呼吸練習',
          'riskChart.mindfulness': '正念冥想', 
          'riskChart.massage': '按摩',
          'riskChart.diet': '飲食管理',
          'riskChart.exercise': '運動',
          'riskChart.exam': '自我檢查',
          'riskChart.education': '健康教育',
          'riskChart.aiMonitor': 'AI監測',
          'riskChart.reach100': '達到100%風險降低',
          'riskChart.combineAll': '結合所有活動以獲得最大保護！',
          'riskChart.byActivity': '各活動風險降低程度',
          // Footer translations
          'footer.description': '透過AI驅動的乳房健康洞察和個人化指導，賦能女性進行主動的健康管理。',
          'footer.product': '產品',
          'footer.features': '功能特色',
          'footer.pricing': '價格方案',
          'footer.faq': '常見問題',
          'footer.support': '客戶支援',
          'footer.company': '公司',
          'footer.about': '關於我們',
          'footer.privacy': '隱私政策',
          'footer.terms': '服務條款',
          'footer.contact': '聯絡我們',
          'footer.copyright': '© 2024 BrezCode. 版權所有。本服務僅供參考用途，不能替代專業醫療建議。'
        },
        'zh-CN': {
          'quiz.title': '乳腺癌风险评估',
          'quiz.age.title': '请问您的年龄是？',
          'report.title': '您的健康报告',
          'coaching.daily_tip': '每日健康小贴士',
          'button.continue': '继续',
          'button.submit': '提交',
          // Hero section translations
          'hero.badge': '24/7 循证AI健康指导',
          'hero.statistic': '「美国每8名女性中就有1名会在一生中患乳腺癌」... 根据世界卫生组织',
          'hero.title1': '好消息！您现在可以',
          'hero.reverse': '逆转',
          'hero.title2': '疾病发展',
          'hero.title3': '并在15天内降低风险',
          'hero.percentage': '高达100%。',
          'hero.subtitle1': '第一名循证AI乳房健康指导平台',
          'hero.subtitle2': '帮助您重新掌控健康。',
          'hero.urgency': '别等到为时已晚，您的家人需要您。',
          'hero.cta': '开始评估测验',
          'hero.freeText': '免费开始・随时取消',
          // App features section translations
          'landing.appFeatures.title': '结合应用程序、社群和',
          'landing.appFeatures.subtitle': '随身健康教练',
          'landing.appFeatures.description': '通过快速评估，我们将为您量身打造第一个周计划，介绍日常健康习惯，并邀请您加入我们的私人社群。专业教练将陪伴您的每一步。'
        },
        'es': {
          'quiz.title': 'Evaluación de Riesgo de Cáncer de Mama',
          'quiz.age.title': '¿Cuál es su edad?',
          'report.title': 'Su Reporte de Salud',
          'coaching.daily_tip': 'Consejo de Salud Diario',
          'button.continue': 'Continuar',
          'button.submit': 'Enviar',
          // Hero section translations
          'hero.badge': 'Coaching con IA basado en evidencia 24/7',
          'hero.statistic': '«1 de cada 8 mujeres en EE.UU. desarrollará cáncer de mama en su vida»... Según la OMS',
          'hero.title1': '¡Buenas noticias! Ahora puedes',
          'hero.reverse': 'REVERTIR',
          'hero.title2': 'el desarrollo',
          'hero.title3': 'y reducir el riesgo hasta',
          'hero.percentage': '100% en 15 días.',
          'hero.subtitle1': 'La plataforma #1 de coaching de salud mamaria con IA basada en evidencia',
          'hero.subtitle2': 'para recuperar el control de tu bienestar.',
          'hero.urgency': 'No esperes hasta que sea demasiado tarde, tu familia te necesita.',
          'hero.cta': 'Comenzar evaluación',
          'hero.freeText': 'Gratis・Cancela cuando quieras',
          // App features section translations
          'landing.appFeatures.title': 'Una app, comunidad y',
          'landing.appFeatures.subtitle': 'coach en tu bolsillo',
          'landing.appFeatures.description': 'Después de una evaluación rápida, personalizaremos tu primer plan semanal, te introduciremos a rituales de salud diarios y te invitaremos a nuestra comunidad privada. Nuestros coaches te acompañarán en cada paso.'
        }
      };

      res.json(translations[languageCode] || {});
    } catch (error) {
      console.error('Error fetching translations:', error);
      res.status(500).json({ error: 'Failed to fetch translations' });
    }
  });

  // Set user language preference
  app.post('/api/user/language', requireAuth, async (req: any, res) => {
    try {
      const { i18nManager } = await import('./internationalization');
      const { languageCode } = req.body;
      
      await i18nManager.setUserLanguage(req.user.id, languageCode);
      res.json({ success: true });
    } catch (error) {
      console.error('Error setting user language:', error);
      res.status(500).json({ success: false, message: 'Failed to set language' });
    }
  });

  // Daily coaching API
  app.get('/api/coaching/daily', requireAuth, async (req: any, res) => {
    try {
      const { coachingEngine } = await import('./coachingEngine');
      const { i18nManager } = await import('./internationalization');
      
      const languageCode = await i18nManager.getUserLanguage(req.user.id);
      const coaching = await coachingEngine.getPersonalizedCoaching(
        req.user.id,
        req.user.profile || 'general',
        languageCode
      );
      
      res.json(coaching);
    } catch (error) {
      console.error('Error fetching daily coaching:', error);
      res.status(500).json({ error: 'Failed to fetch coaching content' });
    }
  });

  // Record daily interaction
  app.post('/api/coaching/interaction', requireAuth, async (req: any, res) => {
    try {
      const { coachingEngine } = await import('./coachingEngine');
      await coachingEngine.recordDailyInteraction(req.user.id, req.body);
      res.json({ success: true });
    } catch (error) {
      console.error('Error recording interaction:', error);
      res.status(500).json({ success: false, message: 'Failed to record interaction' });
    }
  });

  // Authenticated report generation (after signup)
  app.post('/api/reports/generate', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { quizAnswers } = req.body;
      const userId = req.session.userId;

      if (!quizAnswers) {
        return res.status(400).json({ 
          success: false, 
          message: 'Quiz answers are required' 
        });
      }

      // Get user information
      const user = await storage.getUser(userId!);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      // Import the report generator
      const { reportGenerator } = await import('./reportGenerator');

      // Generate comprehensive report with user information
      const reportData = reportGenerator.generateComprehensiveReport(quizAnswers);
      reportData.userId = userId;
      reportData.createdAt = new Date().toISOString();
      
      // Add real user information for display
      reportData.userInfo = {
        firstName: user.firstName,
        lastName: user.lastName
      };

      res.json({
        success: true,
        report: reportData
      });
    } catch (error) {
      console.error('Error generating authenticated health report:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}