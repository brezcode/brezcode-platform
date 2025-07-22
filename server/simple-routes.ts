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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax' // Allow cross-origin cookies for development
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
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for:', email);
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Import storage and bcrypt
      const { storage } = await import('./storage');
      const bcrypt = await import('bcrypt');
      
      // Check if user exists in database
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Password mismatch for:', email);
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({ error: "Please verify your email before logging in" });
      }
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.isAuthenticated = true;
      console.log('Login successful, session set for user:', user.id);
      
      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "Login successful" });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Frontend expects /api/login endpoint
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Basic validation
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      // Import storage and bcrypt
      const { storage } = await import('./storage');
      const bcrypt = await import('bcrypt');
      
      // Check if user exists in database
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({ error: "Please verify your email before logging in" });
      }
      
      // Set session
      (req as any).session.userId = user.id;
      (req as any).session.isAuthenticated = true;
      
      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, message: "Login successful" });
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
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

  // Get current user endpoint
  app.get("/api/me", async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      
      // Debug session info
      console.log('Session debug - userId:', userId, 'sessionID:', (req as any).sessionID);
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { storage } = await import('./storage');
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Return user without sensitive data
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get user profile endpoint
  app.get("/api/user/profile", async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { storage } = await import('./storage');
      const profile = await storage.getUserProfile(userId);
      
      res.json(profile || {});
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Update user profile endpoint
  app.post("/api/user/profile", async (req, res) => {
    try {
      const userId = (req as any).session.userId;
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const { storage } = await import('./storage');
      const updatedProfile = await storage.updateUserProfile(userId, req.body);
      
      res.json(updatedProfile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: "Failed to update profile" });
    }
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

  // Knowledge Centre API Routes
  app.get("/api/knowledge/entries", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const brandId = req.query.brandId as string;
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      const entries = await KnowledgeCentreService.getKnowledgeEntries(userId, brandId);
      
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/knowledge/entries", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const entry = { ...req.body, userId };
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      const newEntry = await KnowledgeCentreService.createKnowledgeEntry(entry);
      
      res.json(newEntry);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/knowledge/assistants", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const brandId = req.query.brandId as string;
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      const assistants = await KnowledgeCentreService.getAiAssistants(userId, brandId);
      
      res.json(assistants);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/knowledge/assistants", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const assistant = { ...req.body, userId };
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      const newAssistant = await KnowledgeCentreService.createAiAssistant(assistant);
      
      res.json(newAssistant);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/knowledge/chat", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const { message, assistantId, includeKnowledge = true } = req.body;
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      
      let context = {};
      if (includeKnowledge) {
        const entries = await KnowledgeCentreService.getKnowledgeEntries(userId);
        context = { knowledgeEntries: entries };
      }
      
      const response = await KnowledgeCentreService.generateResponse(
        message, 
        assistantId, 
        userId, 
        context
      );
      
      res.json({ 
        response,
        assistantId,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/knowledge/analytics", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const assistantId = req.query.assistantId ? parseInt(req.query.assistantId as string) : undefined;
      
      const { KnowledgeCentreService } = await import('./knowledgeCentreService');
      const analytics = await KnowledgeCentreService.getTrainingAnalytics(userId, assistantId);
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Business management API routes
  app.get("/api/user/businesses", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      
      const { BusinessService } = await import('./businessService');
      const businesses = await BusinessService.getUserBusinesses(userId);
      
      res.json(businesses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user/businesses", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const business = { ...req.body, userId };
      
      const { BusinessService } = await import('./businessService');
      const newBusiness = await BusinessService.createBusiness(business);
      
      res.json(newBusiness);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/business/:businessId/stats", async (req, res) => {
    try {
      const businessId = parseInt(req.params.businessId);
      
      const { BusinessService } = await import('./businessService');
      const stats = await BusinessService.getBusinessStats(businessId);
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/industries", async (req, res) => {
    try {
      const { BusinessService } = await import('./businessService');
      const industries = BusinessService.getIndustries();
      
      res.json(industries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Trainer API Routes
  app.get("/api/ai-trainer/strategies", async (req, res) => {
    try {
      const assistantId = parseInt(req.query.assistantId as string) || 1;
      
      // Mock training strategies for demo
      const strategies = [
        {
          id: `strategy_${assistantId}_1`,
          assistantId,
          strategyType: 'response_pattern',
          priority: 'high',
          title: 'Improve Response Conciseness',
          description: 'Recent conversations show responses are too lengthy, affecting user engagement',
          implementation: [
            'Add bullet point formatting guidelines',
            'Set maximum response length targets',
            'Train with concise response examples',
            'Implement response structure templates'
          ],
          expectedImprovement: 'Increase user engagement by 25% and reduce response time',
          timeline: '1-2 weeks',
          metrics: ['Response length', 'User engagement', 'Completion rates'],
          isImplemented: false,
          progress: 0
        },
        {
          id: `strategy_${assistantId}_2`,
          assistantId,
          strategyType: 'knowledge_gap',
          priority: 'medium',
          title: 'Expand Technical Knowledge Base',
          description: 'Users frequently ask technical questions that require more specialized knowledge',
          implementation: [
            'Upload technical documentation',
            'Create FAQ sections for common technical issues',
            'Add industry-specific terminology',
            'Include troubleshooting procedures'
          ],
          expectedImprovement: 'Improve accuracy on technical queries by 40%',
          timeline: '2-3 weeks',
          metrics: ['Technical accuracy', 'User satisfaction', 'Escalation rate'],
          isImplemented: true,
          progress: 100
        }
      ];
      
      res.json(strategies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/ai-trainer/analytics", async (req, res) => {
    try {
      const assistantId = parseInt(req.query.assistantId as string) || 1;
      
      // Mock analytics data
      const analytics = {
        overallScore: 87,
        improvementRate: 15,
        trainingSessions: 34,
        avgSatisfaction: 4.3,
        responseQuality: 89,
        accuracy: 92,
        helpfulness: 86,
        strongAreas: [
          'Professional communication style',
          'Quick response time',
          'Accurate factual information',
          'Helpful problem-solving approach'
        ],
        weakAreas: [
          'Complex multi-step processes',
          'Emotional support scenarios',
          'Advanced technical troubleshooting',
          'Handling ambiguous requests'
        ]
      };
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai-trainer/generate-strategy", async (req, res) => {
    try {
      const { assistantId, focus } = req.body;
      
      const { AITrainerService } = await import('./aiTrainerService');
      
      // Mock performance data for strategy generation
      const performanceData = {
        averageRating: 3.8,
        commonIssues: ['long responses', 'technical accuracy'],
        conversationAnalyses: [],
        assistantConfig: {
          personality: 'professional',
          expertise: ['customer service', 'general knowledge']
        }
      };
      
      const strategies = await AITrainerService.generateTrainingStrategies(
        assistantId,
        performanceData
      );
      
      res.json({ success: true, strategies });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai-trainer/implement/:strategyId", async (req, res) => {
    try {
      const strategyId = req.params.strategyId;
      const assistantId = parseInt(req.query.assistantId as string) || 1;
      
      const { AITrainerService } = await import('./aiTrainerService');
      const result = await AITrainerService.implementTrainingStrategy(strategyId, assistantId);
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/ai-trainer/auto-train", async (req, res) => {
    try {
      const { assistantId } = req.body;
      
      // Mock auto-training process
      const result = {
        success: true,
        strategiesImplemented: 2,
        improvementsFound: [
          'Updated response templates for better clarity',
          'Enhanced knowledge base with recent FAQ updates',
          'Improved conversation flow for technical support'
        ],
        nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        performance: {
          before: 82,
          after: 89,
          improvement: 7
        }
      };
      
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ROLEPLAY TRAINING API ROUTES =====
  
  // Get roleplay scenarios
  app.get("/api/roleplay/scenarios", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const assistantId = req.query.assistantId ? parseInt(req.query.assistantId as string) : undefined;
      
      const { RoleplayService } = await import('./roleplayService');
      const scenarios = await RoleplayService.getScenarios(userId, assistantId);
      
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create roleplay scenario
  app.post("/api/roleplay/scenarios", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const scenarioData = { ...req.body, userId };
      
      const { RoleplayService } = await import('./roleplayService');
      const scenario = await RoleplayService.createScenario(scenarioData);
      
      res.json(scenario);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete roleplay scenario
  app.delete("/api/roleplay/scenarios/:scenarioId", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const scenarioId = parseInt(req.params.scenarioId);
      
      const { RoleplayService } = await import('./roleplayService');
      await RoleplayService.deleteScenario(scenarioId, userId);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get roleplay sessions
  app.get("/api/roleplay/sessions", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const scenarioId = req.query.scenarioId ? parseInt(req.query.scenarioId as string) : undefined;
      
      const { RoleplayService } = await import('./roleplayService');
      const sessions = await RoleplayService.getSessions(userId, scenarioId);
      
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Start roleplay session
  app.post("/api/roleplay/sessions/start", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const sessionData = { ...req.body, userId };
      
      const { RoleplayService } = await import('./roleplayService');
      const session = await RoleplayService.startSession(sessionData);
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get session details with messages
  app.get("/api/roleplay/sessions/:sessionId", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const sessionId = parseInt(req.params.sessionId);
      
      const { RoleplayService } = await import('./roleplayService');
      const sessionDetails = await RoleplayService.getSessionWithMessages(sessionId, userId);
      
      res.json(sessionDetails);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add message to session
  app.post("/api/roleplay/sessions/message", async (req, res) => {
    try {
      const messageData = req.body;
      
      const { RoleplayService } = await import('./roleplayService');
      const message = await RoleplayService.addMessage(messageData);
      
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Complete roleplay session
  app.post("/api/roleplay/sessions/:sessionId/complete", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { score, notes } = req.body;
      
      const { RoleplayService } = await import('./roleplayService');
      const session = await RoleplayService.completeSession(sessionId, score, notes);
      
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Add feedback to message
  app.post("/api/roleplay/feedback", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const feedbackData = { ...req.body, userId };
      
      const { RoleplayService } = await import('./roleplayService');
      const feedback = await RoleplayService.addFeedback(feedbackData);
      
      res.json(feedback);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate customer AI response
  app.post("/api/roleplay/generate-customer", async (req, res) => {
    try {
      const { customerPersona, scenario, conversationHistory, objectives } = req.body;
      
      const { RoleplayService } = await import('./roleplayService');
      const response = await RoleplayService.generateCustomerResponse(
        customerPersona, 
        scenario, 
        conversationHistory, 
        objectives
      );
      
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate assistant AI response
  app.post("/api/roleplay/generate-assistant", async (req, res) => {
    try {
      const { assistantId, customerMessage, conversationHistory } = req.body;
      
      const { RoleplayService } = await import('./roleplayService');
      const response = await RoleplayService.generateAssistantResponse(
        assistantId, 
        customerMessage, 
        conversationHistory
      );
      
      res.json({ response });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get session statistics
  app.get("/api/roleplay/stats", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      
      const { RoleplayService } = await import('./roleplayService');
      const stats = await RoleplayService.getSessionStats(userId);
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get default scenarios
  app.get("/api/roleplay/default-scenarios", async (req, res) => {
    try {
      const { RoleplayService } = await import('./roleplayService');
      const scenarios = RoleplayService.getDefaultScenarios();
      
      res.json(scenarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ADVANCED AI TRAINER API ROUTES =====

  // Get performance analysis
  app.get("/api/ai-trainer/performance/:assistantId", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const assistantId = parseInt(req.params.assistantId);
      
      const { AITrainerAdvanced } = await import('./aiTrainerAdvanced');
      const analysis = await AITrainerAdvanced.analyzePerformance(assistantId, userId);
      
      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get comprehensive training analytics
  app.get("/api/ai-trainer/analytics/:assistantId", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const assistantId = parseInt(req.params.assistantId);
      const timeRange = (req.query.timeRange as string) || '30d';
      
      const { AITrainerAdvanced } = await import('./aiTrainerAdvanced');
      const analytics = await AITrainerAdvanced.getTrainingAnalytics(assistantId, userId, timeRange);
      
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create custom training scenarios
  app.post("/api/ai-trainer/custom-scenarios", async (req, res) => {
    try {
      const userId = (req as any).session.userId || 1;
      const { assistantId, improvementAreas } = req.body;
      
      const { AITrainerAdvanced } = await import('./aiTrainerAdvanced');
      const scenarios = await AITrainerAdvanced.createCustomTrainingScenarios(assistantId, userId, improvementAreas);
      
      res.json({ scenarios, count: scenarios.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create HTTP server
  const server = createServer(app);

  return server;
}