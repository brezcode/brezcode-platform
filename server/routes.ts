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
          'landing.appFeatures.description': 'After a quick quiz, we\'ll personalize your first weekly plan, introduce you to daily health rituals, and invite you to our private community. Our supportive coaches will be with you at every step of the way.'
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
          'landing.appFeatures.description': '透過快速評估，我們將為您量身打造第一個週計劃，介紹日常健康習慣，並邀請您加入我們的私人社群。專業教練將陪伴您的每一步。'
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