import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./simple-routes";
import { setupVite, serveStatic, log } from "./vite";
import { registerAvatarKnowledgeRoutes } from "./avatar-knowledge-routes";

const app = express();
// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Direct API routes for AI training (BEFORE any middleware to avoid conflicts)
app.get('/direct-api/test', (req, res) => {
  res.json({ success: true, message: 'Direct API routing works!' });
});

// Breast Health Platform route (must be BEFORE Vite middleware)
app.get('/brezcode', (req, res) => {
  // Check if user is authenticated
  console.log('BrezCode route - Session check:', {
    userId: req.session?.userId,
    isAuthenticated: req.session?.isAuthenticated,
    sessionID: req.sessionID
  });
  
  if (req.session?.userId && req.session?.isAuthenticated) {
    console.log('Redirecting authenticated user to BrezCode dashboard');
    // Redirect authenticated users to BrezCode dashboard
    return res.redirect('/business/brezcode/dashboard');
  }
  
  // Serve landing page for non-authenticated users
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Breast Health Assessment Platform</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      min-height: 100vh; 
    }
    .container { 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 20px; 
      background: white; 
      margin-top: 20px; 
      margin-bottom: 20px; 
      border-radius: 15px; 
      box-shadow: 0 15px 35px rgba(0,0,0,0.1); 
    }
    .header { 
      text-align: center; 
      padding: 40px 0; 
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
      margin: -20px -20px 40px -20px; 
      border-radius: 15px 15px 0 0; 
      color: white; 
    }
    .header h1 { 
      font-size: 2.5rem; 
      margin-bottom: 10px; 
      font-weight: 700; 
    }
    .header p { 
      font-size: 1.1rem; 
      opacity: 0.9; 
    }
    .statistic { 
      background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); 
      padding: 30px; 
      border-radius: 12px; 
      margin: 30px 0; 
      text-align: center; 
      border-left: 6px solid #ff6b6b; 
      box-shadow: 0 8px 25px rgba(255,107,107,0.2); 
    }
    .statistic h2 { 
      font-size: 1.8rem; 
      margin-bottom: 10px; 
      color: #2c3e50; 
      font-weight: 600; 
    }
    .statistic p { 
      font-size: 1.1rem; 
      color: #34495e; 
      font-style: italic; 
    }
    .cta-button { 
      background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); 
      color: #2c3e50; 
      padding: 18px 40px; 
      border: none; 
      border-radius: 30px; 
      font-size: 1.2rem; 
      font-weight: bold; 
      cursor: pointer; 
      margin: 25px 0; 
      transition: all 0.3s ease; 
      box-shadow: 0 8px 20px rgba(255,215,0,0.3); 
      display: block; 
      margin-left: auto; 
      margin-right: auto; 
    }
    .cta-button:hover { 
      transform: translateY(-2px); 
      box-shadow: 0 12px 25px rgba(255,215,0,0.4); 
    }
    .quiz-form { 
      background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%); 
      padding: 40px; 
      border-radius: 15px; 
      margin-top: 30px; 
      border: 2px solid #e3e8ff; 
    }
    .quiz-form h3 { 
      text-align: center; 
      margin-bottom: 30px; 
      color: #2c3e50; 
      font-size: 1.8rem; 
    }
    .form-group { 
      margin: 25px 0; 
    }
    .form-group label { 
      display: block; 
      margin-bottom: 8px; 
      font-weight: 600; 
      color: #34495e; 
      font-size: 1.1rem; 
    }
    .form-group input, .form-group select { 
      width: 100%; 
      padding: 15px; 
      border: 2px solid #e1e8f0; 
      border-radius: 8px; 
      font-size: 1rem; 
      transition: border-color 0.3s ease; 
    }
    .form-group input:focus, .form-group select:focus { 
      outline: none; 
      border-color: #667eea; 
      box-shadow: 0 0 0 3px rgba(102,126,234,0.1); 
    }
    .results { 
      background: linear-gradient(135deg, #e8f5e8 0%, #f0fdf0 100%); 
      padding: 40px; 
      border-radius: 15px; 
      margin-top: 30px; 
      border: 2px solid #bbf7d0; 
    }
    .results h3 { 
      color: #166534; 
      margin-bottom: 20px; 
      font-size: 1.8rem; 
    }
    .risk-score { 
      background: white; 
      padding: 20px; 
      border-radius: 10px; 
      margin: 20px 0; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
    }
    .recommendations { 
      background: white; 
      padding: 25px; 
      border-radius: 10px; 
      margin: 20px 0; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
    }
    .recommendations h4 { 
      color: #059669; 
      margin-bottom: 15px; 
      font-size: 1.3rem; 
    }
    .recommendations ul { 
      padding-left: 20px; 
    }
    .recommendations li { 
      margin: 10px 0; 
      font-size: 1rem; 
    }
    .daily-plan { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
      gap: 20px; 
      margin-top: 25px; 
    }
    .plan-item { 
      background: white; 
      padding: 20px; 
      border-radius: 10px; 
      box-shadow: 0 4px 15px rgba(0,0,0,0.1); 
    }
    .plan-item h5 { 
      color: #0f766e; 
      margin-bottom: 10px; 
      font-size: 1.2rem; 
    }
    @media (max-width: 768px) { 
      .container { margin: 10px; padding: 15px; } 
      .header h1 { font-size: 2rem; } 
      .quiz-form, .results { padding: 25px; } 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🩺 Breast Health Assessment</h1>
      <p>Evidence-Based Risk Analysis & Personalized Wellness</p>
    </div>
    
    <div class="statistic">
      <h2>"1 in 8 women in US will develop breast cancer in their lifetime"</h2>
      <p>— World Health Organization</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <p style="font-size: 1.2rem; color: #2c3e50; margin-bottom: 20px;">
        Take our comprehensive assessment to understand your personal risk factors and receive evidence-based recommendations for optimal breast health.
      </p>
      <button class="cta-button" onclick="showQuiz()">🔍 Start Your Assessment</button>
    </div>
    
    <div id="quiz" class="quiz-form" style="display: none;">
      <h3>📋 Comprehensive Health Assessment</h3>
      <form id="assessmentForm">
        <div class="form-group">
          <label>👤 Age:</label>
          <input type="number" name="age" required min="18" max="100" placeholder="Enter your age">
        </div>
        <div class="form-group">
          <label>👨‍👩‍👧‍👦 Family History of Breast Cancer:</label>
          <select name="family_history" required>
            <option value="">Please select...</option>
            <option value="Yes">Yes - immediate family member (mother, sister, daughter)</option>
            <option value="No">No known family history</option>
          </select>
        </div>
        <div class="form-group">
          <label>⚖️ Current Weight (kg):</label>
          <input type="number" name="weight" required min="30" max="200" placeholder="Enter weight in kilograms">
        </div>
        <div class="form-group">
          <label>📏 Height (meters):</label>
          <input type="number" name="height" step="0.01" required min="1.0" max="2.5" placeholder="e.g., 1.65">
        </div>
        <div class="form-group">
          <label>🏃‍♀️ Exercise Habits:</label>
          <select name="exercise" required>
            <option value="">Please select...</option>
            <option value="Yes, regular exercise">Yes - Regular exercise (3+ times per week)</option>
            <option value="No, little or no regular exercise">No - Little or no regular exercise</option>
          </select>
        </div>
        <button type="submit" class="cta-button">📊 Generate My Health Report</button>
      </form>
    </div>
    
    <div id="results" class="results" style="display: none;"></div>
  </div>
  
  <script>
    function showQuiz() {
      document.getElementById('quiz').style.display = 'block';
      document.getElementById('quiz').scrollIntoView({ behavior: 'smooth' });
    }
    
    document.getElementById('assessmentForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const answers = Object.fromEntries(formData.entries());
      
      const height = parseFloat(answers.height);
      const weight = parseFloat(answers.weight);
      answers.bmi = (weight / (height * height)).toFixed(1);
      
      try {
        const response = await fetch('/api/reports/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(answers)
        });
        
        const data = await response.json();
        
        if (data.success) {
          const report = data.report;
          const riskColor = report.riskCategory === 'high' ? '#dc2626' : 
                           report.riskCategory === 'moderate' ? '#d97706' : '#059669';
          
          document.getElementById('results').innerHTML = \`
            <h3>📋 Your Personalized Health Report</h3>
            
            <div class="risk-score">
              <h4 style="color: \${riskColor};">Risk Assessment</h4>
              <p style="font-size: 1.4rem; font-weight: bold; color: \${riskColor};">
                Risk Score: \${report.riskScore}/100 (\${report.riskCategory.toUpperCase()} risk)
              </p>
              <p><strong>BMI:</strong> \${answers.bmi} kg/m²</p>
            </div>
            
            \${report.riskFactors.length > 0 ? \`
            <div class="recommendations">
              <h4>⚠️ Identified Risk Factors:</h4>
              <ul>\${report.riskFactors.map(factor => '<li>' + factor + '</li>').join('')}</ul>
            </div>
            \` : ''}
            
            <div class="recommendations">
              <h4>💡 Personalized Recommendations:</h4>
              <ul>\${report.recommendations.map(rec => '<li>' + rec + '</li>').join('')}</ul>
            </div>
            
            <div class="recommendations">
              <h4>🌅 Daily Wellness Plan:</h4>
              <div class="daily-plan">
                <div class="plan-item">
                  <h5>🌅 Morning</h5>
                  <p>\${report.dailyPlan.morning}</p>
                </div>
                <div class="plan-item">
                  <h5>🌞 Afternoon</h5>
                  <p>\${report.dailyPlan.afternoon}</p>
                </div>
                <div class="plan-item">
                  <h5>🌙 Evening</h5>
                  <p>\${report.dailyPlan.evening}</p>
                </div>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 10px;">
              <p style="font-weight: bold; color: #92400e;">
                ⚠️ Important: This assessment is for educational purposes only. 
                Please consult with your healthcare provider for personalized medical advice.
              </p>
            </div>
          \`;
          document.getElementById('results').style.display = 'block';
          document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        alert('❌ Error generating report. Please try again.');
        console.error('Error:', error);
      }
    });
  </script>
</body>
</html>`);
});

// CRITICAL FIX: Direct avatar training routes to bypass Vite conflicts
// Get all scenarios endpoint with avatarType filtering
app.get('/api/avatar-training/scenarios', async (req, res) => {
  try {
    const { avatarType } = req.query;
    console.log(`🔍 DIRECT: Fetching training scenarios for avatarType: ${avatarType || 'all'}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    
    // Filter scenarios by avatarType if specified
    let filteredScenarios = TRAINING_SCENARIOS;
    if (avatarType) {
      filteredScenarios = TRAINING_SCENARIOS.filter(scenario => scenario.avatarType === avatarType);
      console.log(`✅ DIRECT: Found ${filteredScenarios.length} scenarios for ${avatarType}`);
    } else {
      console.log(`✅ DIRECT: Found ${TRAINING_SCENARIOS.length} total scenarios`);
    }
    
    res.json({
      success: true,
      scenarios: filteredScenarios
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single scenario endpoint
app.get('/api/avatar-training/scenarios/:scenarioId', async (req, res) => {
  try {
    const { scenarioId } = req.params;
    console.log(`🔍 DIRECT: Looking for scenario: ${scenarioId}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      console.log(`❌ DIRECT: Scenario not found: ${scenarioId}`);
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    console.log(`✅ DIRECT: Found scenario: ${scenario.name}`);
    res.json({
      success: true,
      scenario: scenario
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenario:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/avatar-training/sessions', async (req, res) => {
  try {
    const { avatarType, scenarioId, businessContext, userId } = req.body;
    
    console.log('🚀 DIRECT: Creating training session:', { avatarType, scenarioId, businessContext, userId });
    
    if (!avatarType || !scenarioId) {
      return res.status(400).json({ error: 'avatarType and scenarioId are required' });
    }
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.createSession(
      userId || 1,
      avatarType,
      scenarioId,
      businessContext || 'health_coaching',
      scenario
    );
    
    console.log(`✅ DIRECT: Session created successfully: ${session.sessionId}`);
    
    res.json({
      success: true,
      session: {
        sessionId: session.sessionId,
        avatarType: session.avatarType,
        scenarioId: session.scenarioId,
        businessContext: session.businessContext,
        status: session.status,
        startedAt: session.startedAt?.toISOString(),
        messages: []
      }
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Session creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual message endpoint (direct routing to bypass Vite conflicts)
app.post('/api/avatar-training/sessions/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message, role = 'customer' } = req.body;

    console.log(`🔄 DIRECT: Manual message received for session ${sessionId}: "${message.trim()}"`);

    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Add customer message to database
    const customerMessage = await AvatarTrainingSessionService.addMessage(
      sessionId,
      'customer',
      message.trim(),
      'neutral'
    );

    // Generate AI response 
    const aiResponse = await AvatarTrainingSessionService.generateResponse(
      sessionId,
      message.trim()
    );

    // Save the AI response to the database
    const avatarMessage = await AvatarTrainingSessionService.addMessage(
      sessionId,
      'avatar',
      aiResponse.content,
      'neutral',
      {
        qualityScore: aiResponse.qualityScore,
        responseTime: aiResponse.responseTime,
        aiModel: 'claude-sonnet-4'
      }
    );

    console.log(`✅ DIRECT: Manual message processed successfully for session ${sessionId}`);

    res.json({
      success: true,
      response: aiResponse.content,
      quality_score: aiResponse.qualityScore,
      userMessage: {
        id: customerMessage.messageId,
        role: 'customer',
        content: customerMessage.content,
        timestamp: customerMessage.createdAt
      },
      avatarMessage: {
        id: avatarMessage.messageId,
        role: 'avatar',
        content: avatarMessage.content,
        timestamp: avatarMessage.createdAt,
        quality_score: avatarMessage.qualityScore
      }
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Manual message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// AI Continue conversation endpoint (direct routing to bypass Vite conflicts)
app.post('/api/avatar-training/sessions/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { customerMessage } = req.body;

    console.log('🔍 DIRECT: AI Continue Request for session:', sessionId);

    const { AvatarTrainingSessionService } = await import('./services/avatarTrainingSessionService');
    const session = await AvatarTrainingSessionService.getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Continue the conversation with AI-generated patient question and Dr. Sakura response
    const updatedSession = await AvatarTrainingSessionService.continueConversation(sessionId);

    console.log(`✅ DIRECT: AI Continue processed successfully for session ${sessionId}`);

    res.json({
      success: true,
      session: updatedSession
    });
  } catch (error: any) {
    console.error('❌ DIRECT: AI Continue error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/direct-api/training/start', (req, res) => {
  try {
    const { avatarId, customerId, scenario } = req.body;

    if (!avatarId || !customerId || !scenario) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Validate avatar ID exists (basic validation for testing)
    const validAvatarIds = ['sales_specialist_alex', 'customer_service_miko', 'technical_kai', 'business_luna', 'health_sakura', 'education_sage'];
    if (!validAvatarIds.includes(avatarId)) {
      return res.status(400).json({ error: 'Invalid avatar ID' });
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = {
      id: sessionId,
      avatar_id: avatarId,
      customer_id: customerId,
      scenario: scenario,
      status: 'running',
      messages: [{
        id: `msg_${Date.now()}_1`,
        role: 'customer',
        content: `Hi, I'm interested in discussing ${scenario}. Can you help me with this?`,
        timestamp: new Date().toISOString(),
        emotion: 'curious',
        intent: 'inquire about service'
      }],
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65,
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      },
      started_at: new Date().toISOString(),
      duration: 0
    };

    res.json(session);
  } catch (error) {
    console.error('Error starting training session:', error);
    res.status(500).json({ error: 'Failed to start training session' });
  }
});

app.post('/direct-api/training/:sessionId/continue', (req, res) => {
  try {
    const { sessionId } = req.params;

    const avatarResponses = [
      "I understand your pricing concerns. Let me show you the specific value we provide.",
      "That's a great technical question. Based on your requirements, here's how we can help.",
      "I appreciate you bringing this to my attention. Let me resolve this for you.",
      "Compared to competitors, here are our three key advantages that clients value most.",
      "I hear your frustration. Here's what we can do to improve your experience immediately."
    ];

    const session = {
      id: sessionId,
      status: 'running',
      messages: [
        {
          id: `msg_${Date.now()}_1`,
          role: 'customer', 
          content: "I have some concerns about this solution.",
          timestamp: new Date(Date.now() - 60000).toISOString(),
          emotion: 'skeptical'
        },
        {
          id: `msg_${Date.now()}_2`,
          role: 'avatar',
          content: avatarResponses[Math.floor(Math.random() * avatarResponses.length)],
          timestamp: new Date().toISOString(),
          quality_score: Math.floor(Math.random() * 30) + 70
        }
      ],
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65,
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      }
    };

    res.json(session);
  } catch (error) {
    console.error('Error continuing training:', error);
    res.status(500).json({ error: 'Failed to continue training' });
  }
});

app.post('/direct-api/training/:sessionId/stop', (req, res) => {
  try {
    const { sessionId } = req.params;

    const finalSession = {
      id: sessionId,
      status: 'completed',
      duration: Math.floor(Math.random() * 300) + 180,
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 30) + 70,
        customer_satisfaction: Math.floor(Math.random() * 25) + 65, 
        goal_achievement: Math.floor(Math.random() * 20) + 60,
        conversation_flow: Math.floor(Math.random() * 15) + 75
      },
      messages: []
    };

    res.json(finalSession);
  } catch (error) {
    console.error('Error stopping training:', error);
    res.status(500).json({ error: 'Failed to stop training' });
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('Starting server...');

  // Comment out problematic initializations for now
  /*
  // Initialize knowledge base with evidence-based medical facts
  try {
    const { knowledgeBaseManager } = await import('./knowledgeBase');
    await knowledgeBaseManager.initializeKnowledgeBase();
    console.log('✅ Knowledge base initialized with evidence-based medical facts');
  } catch (error) {
    console.error('❌ Knowledge base initialization failed:', error);
  }

  // Initialize platform features
  try {
    const { seedFeatures } = await import('./seedFeatures');
    await seedFeatures();
  } catch (error) {
    console.error('Failed to seed platform features:', error);
  }

  // Initialize default brand
  try {
    const { seedDefaultBrand } = await import('./seedBrand');
    await seedDefaultBrand();
  } catch (error) {
    console.error('Failed to seed default brand:', error);
  }

  // Initialize brand knowledge bases
  try {
    const { initializeBrandKnowledge } = await import('./initializeBrandKnowledge');
    await initializeBrandKnowledge();
  } catch (error) {
    console.error('Failed to initialize brand knowledge:', error);
  }

  // Initialize business onboarding questions
  try {
    const { seedOnboardingQuestions } = await import('./seedBusinessQuestions');
    await seedOnboardingQuestions();
  } catch (error) {
    console.error('Failed to seed business questions:', error);
  }
  */

  // Use registerRoutes with error handling for main functionality
  let server;
  try {
    server = await registerRoutes(app);
    console.log('✅ Main routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering main routes:', error);
    // Create a simple HTTP server fallback
    server = createServer(app);
  }

  // Register Avatar Knowledge Base routes
  registerAvatarKnowledgeRoutes(app);

  // Register BrezCode Avatar routes
  try {
    console.log('🌸 Registering BrezCode avatar routes...');
    const brezcodeAvatarRoutes = await import('./routes/brezcodeAvatarRoutes');
    app.use('/api/brezcode/avatar', brezcodeAvatarRoutes.default);
    console.log('✅ BrezCode avatar routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering BrezCode avatar routes:', error);
  }

  // Register avatar performance routes for completed session display
  try {
    console.log('🎯 Registering avatar performance routes...');
    const { registerAvatarPerformanceRoutes } = await import('./avatar-performance-routes');
    registerAvatarPerformanceRoutes(app);
    console.log('✅ Avatar performance routes registered successfully');
  } catch (error) {
    console.error('❌ Error registering performance routes:', error);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();