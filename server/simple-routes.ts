import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import MemoryStore from "memorystore";
import OpenAI from "openai";

// Create memory store for sessions
const MemStore = MemoryStore(session);

// Initialize OpenAI if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

// Rule-based health assessment function
function generateRuleBasedReport(quizAnswers: any) {
  let riskScore = 20; // Base risk score
  let riskFactors: string[] = [];
  let userProfile = "premenopausal";
  
  // Age-based risk assessment
  const age = parseInt(quizAnswers.age) || 25;
  if (age >= 50) {
    riskScore += 20;
    riskFactors.push("Age over 50 increases breast cancer risk");
    userProfile = "postmenopausal";
  } else if (age >= 40) {
    riskScore += 10;
    riskFactors.push("Age 40-49 has moderate increased risk");
  } else if (age < 20) {
    userProfile = "teenager";
    riskScore = 10;
  }
  
  // Family history assessment
  if (quizAnswers.family_history === "Yes") {
    riskScore += 25;
    riskFactors.push("Family history of breast cancer significantly increases risk");
  }
  
  // Current patient or survivor status
  if (quizAnswers.precancerous_condition?.includes("currently receiving treatment")) {
    userProfile = "current_patient";
    riskScore = 85;
    riskFactors.push("Currently undergoing cancer treatment");
  } else if (quizAnswers.precancerous_condition?.includes("survivor")) {
    userProfile = "survivor";
    riskScore = 70;
    riskFactors.push("Cancer survivor requires ongoing monitoring");
  }
  
  // BMI and lifestyle factors
  const bmi = parseFloat(quizAnswers.bmi) || 25;
  if (bmi > 30) {
    riskScore += 15;
    riskFactors.push("Obesity (BMI > 30) increases breast cancer risk");
  }
  
  // Determine risk category
  let riskCategory = "low";
  if (riskScore >= 70) riskCategory = "high";
  else if (riskScore >= 40) riskCategory = "moderate";
  
  // Generate recommendations based on risk profile
  const recommendations = [
    "Maintain a healthy weight through balanced diet and regular exercise",
    "Limit alcohol consumption to reduce breast cancer risk",
    "Perform monthly breast self-examinations",
    "Schedule regular clinical breast exams with your healthcare provider",
    "Follow mammogram screening guidelines for your age group"
  ];
  
  if (age >= 40) {
    recommendations.unshift("Schedule annual mammograms starting at age 40");
  }
  
  if (quizAnswers.family_history === "Yes") {
    recommendations.push("Discuss genetic counseling with your healthcare provider");
  }
  
  return {
    id: Date.now(),
    riskScore,
    riskCategory,
    userProfile,
    riskFactors,
    recommendations,
    dailyPlan: {
      morning: "Take vitamin D supplement and practice meditation",
      afternoon: "30 minutes of physical activity (walking, swimming, or yoga)",
      evening: "Practice stress reduction techniques and maintain healthy sleep schedule"
    },
    reportData: quizAnswers,
    createdAt: new Date().toISOString(),
    generatedBy: "rule-based"
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    store: new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Basic health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development"
    });
  });

  // Translations API - frontend expects this
  app.get("/api/translations/:language", (req, res) => {
    const { language } = req.params;
    
    // Return basic translations structure for now
    const translations = {
      "common.loading": "Loading...",
      "common.error": "An error occurred",
      "common.success": "Success",
      "nav.home": "Home",
      "nav.dashboard": "Dashboard",
      "nav.profile": "Profile"
    };
    
    res.json(translations);
  });

  // Brand configuration API - frontend expects this
  app.get("/api/brand/config", (req, res) => {
    // Return default brand configuration
    const brandConfig = {
      id: "default",
      name: "Health Platform",
      domain: "localhost",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logo: "/logo.png",
      description: "Your personalized health optimization platform",
      features: ["health_assessment", "ai_coaching", "personalized_reports"]
    };
    
    res.json(brandConfig);
  });

  // User authentication routes
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // For now, accept any login credentials for development
    const user = {
      id: 1,
      email,
      firstName: "Demo",
      lastName: "User",
      subscriptionTier: "basic"
    };
    
    // Set session
    (req as any).session.userId = user.id;
    (req as any).session.isAuthenticated = true;
    
    res.json({ user, message: "Login successful" });
  });

  // Frontend expects /api/login endpoint
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // For now, accept any login credentials for development
    const user = {
      id: 1,
      email,
      firstName: "Demo",
      lastName: "User",
      subscriptionTier: "basic"
    };
    
    // Set session
    (req as any).session.userId = user.id;
    (req as any).session.isAuthenticated = true;
    
    res.json({ user, message: "Login successful" });
  });

  // Import the email verification module
  const { defaultEmailVerification, createEmailVerificationRoutes } = await import('./emailVerificationModule');
  
  // Create email verification routes using the module
  const emailRoutes = createEmailVerificationRoutes(defaultEmailVerification);
  
  // Use the modular email verification endpoints
  app.post("/api/auth/signup", emailRoutes.signup);
  app.post("/api/auth/verify-email", emailRoutes.verifyEmail);
  app.post("/api/auth/resend-verification", emailRoutes.resendVerification);

  app.post("/api/auth/logout", (req, res) => {
    (req as any).session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Health reports endpoints
  app.get("/api/reports", (req, res) => {
    // Return empty array for now
    res.json([]);
  });

  app.post("/api/reports/generate", async (req, res) => {
    try {
      const { quizAnswers } = req.body;
      
      if (!quizAnswers) {
        return res.status(400).json({ error: "Quiz answers are required" });
      }
      
      let report;
      
      // Use AI if available, otherwise use rule-based assessment
      if (openai) {
        try {
          const analysisPrompt = `As a health risk assessment AI, analyze the following health information and provide a comprehensive breast health risk assessment. Be evidence-based and professional.

Quiz Answers:
${JSON.stringify(quizAnswers, null, 2)}

Please provide:
1. Risk score (0-100)
2. Risk category (low, moderate, high)
3. User profile (teenager, premenopausal, postmenopausal, current_patient, survivor)
4. Top 3-5 risk factors identified
5. Top 5-7 evidence-based recommendations
6. Daily health plan with morning, afternoon, and evening activities

Format your response as JSON with the exact structure:
{
  "riskScore": number,
  "riskCategory": "low|moderate|high",
  "userProfile": "teenager|premenopausal|postmenopausal|current_patient|survivor",
  "riskFactors": ["factor1", "factor2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "dailyPlan": {
    "morning": "activity",
    "afternoon": "activity",
    "evening": "activity"
  }
}`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: analysisPrompt }],
            temperature: 0.3,
            max_tokens: 1500
          });

          const aiResponse = completion.choices[0]?.message?.content;
          if (aiResponse) {
            const aiAnalysis = JSON.parse(aiResponse);
            report = {
              id: Date.now(),
              ...aiAnalysis,
              reportData: quizAnswers,
              createdAt: new Date().toISOString(),
              generatedBy: "ai"
            };
          } else {
            throw new Error("No AI response received");
          }
        } catch (aiError) {
          console.error("AI analysis failed, falling back to rule-based:", aiError);
          // Fall back to rule-based assessment
          report = generateRuleBasedReport(quizAnswers);
        }
      } else {
        report = generateRuleBasedReport(quizAnswers);
      }
      
      res.json({ report });
    } catch (error) {
      console.error("Report generation error:", error);
      res.status(500).json({ error: "Failed to generate health report" });
    }
  });

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      if (!openai) {
        // Provide helpful fallback responses without AI
        const fallbackResponses = {
          "breast cancer": "Breast cancer is the second most common cancer in women. Early detection through regular screening and self-exams is crucial. Please consult with your healthcare provider for personalized guidance.",
          "signs": "Early signs may include lumps, changes in breast size or shape, skin dimpling, or nipple discharge. Remember, many lumps are not cancerous, but it's important to have any changes checked by a healthcare professional.",
          "prevention": "While not all breast cancers can be prevented, maintaining a healthy lifestyle with regular exercise, limited alcohol, and healthy weight can help reduce risk.",
          "screening": "Mammogram guidelines vary by age and risk factors. Generally, women 40+ should discuss screening schedules with their healthcare provider.",
          "default": "I understand you have questions about breast health. While I'd love to provide detailed guidance, I recommend consulting with a qualified healthcare professional for personalized medical advice."
        };
        
        let response = fallbackResponses.default;
        const lowercaseMessage = message.toLowerCase();
        
        for (const [key, value] of Object.entries(fallbackResponses)) {
          if (lowercaseMessage.includes(key) && key !== "default") {
            response = value;
            break;
          }
        }
        
        return res.json({ 
          response,
          sessionId: sessionId || `session_${Date.now()}`,
          timestamp: new Date().toISOString(),
          mode: "fallback"
        });
      }
      
      try {
        const systemPrompt = `You are a knowledgeable health assistant specializing in breast health and wellness. Provide helpful, evidence-based information while being empathetic and supportive. Always remind users to consult healthcare professionals for medical advice. Keep responses concise and actionable.`;
        
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        
        const aiResponse = completion.choices[0]?.message?.content || "I apologize, but I couldn't process your request at the moment.";
        
        res.json({ 
          response: aiResponse,
          sessionId: sessionId || `session_${Date.now()}`,
          timestamp: new Date().toISOString(),
          mode: "ai"
        });
      } catch (aiError: any) {
        console.log("OpenAI failed, using fallback responses:", aiError.message);
        
        // Use fallback responses when AI fails
        const fallbackResponses = {
          "breast cancer": "Breast cancer is the second most common cancer in women. Early detection through regular screening and self-exams is crucial. Please consult with your healthcare provider for personalized guidance.",
          "signs": "Early signs may include lumps, changes in breast size or shape, skin dimpling, or nipple discharge. Remember, many lumps are not cancerous, but it's important to have any changes checked by a healthcare professional.",
          "prevention": "While not all breast cancers can be prevented, maintaining a healthy lifestyle with regular exercise, limited alcohol, and healthy weight can help reduce risk.",
          "screening": "Mammogram guidelines vary by age and risk factors. Generally, women 40+ should discuss screening schedules with their healthcare provider.",
          "risk": "Risk factors include age, family history, genetics, lifestyle factors, and reproductive history. However, having risk factors doesn't mean you will develop breast cancer.",
          "mammogram": "Mammograms are X-ray examinations of the breast used to detect breast cancer early. Discuss with your doctor when to start regular screenings based on your age and risk factors.",
          "self exam": "Monthly breast self-exams help you become familiar with how your breasts normally feel. Report any changes to your healthcare provider promptly.",
          "default": "I understand you have questions about breast health. While I'd love to provide detailed guidance, I recommend consulting with a qualified healthcare professional for personalized medical advice."
        };
        
        let response = fallbackResponses.default;
        const lowercaseMessage = message.toLowerCase();
        
        for (const [key, value] of Object.entries(fallbackResponses)) {
          if (lowercaseMessage.includes(key) && key !== "default") {
            response = value;
            break;
          }
        }
        
        res.json({ 
          response,
          sessionId: sessionId || `session_${Date.now()}`,
          timestamp: new Date().toISOString(),
          mode: "fallback"
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Simple API routes for testing
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working!" });
  });

  // Create HTTP server
  const server = createServer(app);

  return server;
}