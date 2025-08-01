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
    console.log(`🔍 DIRECT: Fetching scenario ${scenarioId}`);
    
    const { TRAINING_SCENARIOS } = await import('./avatarTrainingScenarios');
    const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
    
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    console.log(`✅ DIRECT: Found scenario ${scenarioId}`);
    res.json({
      success: true,
      scenario
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Error fetching scenario:', error);
    res.status(500).json({ error: error.message });
  }
});

// Avatar performance endpoints
app.get('/api/avatar-performance/:sessionId', async (req, res) => {
  try {
    console.log('🎯 DIRECT: Avatar performance request for sessionId:', req.params.sessionId);
    
    // Mock performance data for now
    const performanceData = {
      sessionId: req.params.sessionId,
      averageScore: 87,
      completedScenarios: 12,
      improvementAreas: ["Empathy responses", "Technical accuracy"],
      strengths: ["Active listening", "Problem resolution"],
      recommendations: ["Practice more emotional support scenarios", "Review technical documentation"]
    };
    
    res.json({
      success: true,
      performance: performanceData
    });
  } catch (error: any) {
    console.error('❌ DIRECT: Avatar performance error:', error);
    res.status(500).json({ error: error.message });
  }
});

console.log('Starting server...');

// Register main application routes
registerRoutes(app);
console.log('✅ Main routes registered successfully');

// Register Avatar Knowledge Base routes
console.log('📚 Registering Avatar Knowledge Base routes...');
registerAvatarKnowledgeRoutes(app);
console.log('✅ Avatar Knowledge Base routes registered successfully');

// Register Knowledge Transfer routes for LeadGen.to to BrezCode transfer
console.log('🔄 Registering Knowledge Transfer routes...');
import knowledgeTransferRoutes from './routes/knowledge-transfer';
app.use('/api/knowledge-transfer', knowledgeTransferRoutes);
console.log('✅ Knowledge Transfer routes registered successfully');

// Try to register additional routes if they exist
// Register BrezCode avatar routes directly
console.log('🌸 Registering BrezCode avatar routes...');

// Quick Dr. Sakura response endpoint
app.post('/api/brezcode/avatar/dr-sakura/chat', async (req, res) => {
  try {
    const { userId, message, conversationHistory = [], context = {} } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ 
        error: 'userId and message are required' 
      });
    }

    console.log(`🌸 Dr. Sakura responding to user ${userId}: "${message.substring(0, 50)}..."`);
    
    // Import MultimediaContentService for content generation
    const { MultimediaContentService } = await import('./services/multimediaContentService');
    
    // Generate multimedia content based on the user's message
    const multimediaContent = MultimediaContentService.generateMultimediaContent(
      message,
      '',
      'breast_health'
    );
    
    // Generate Dr. Sakura's response based on message content
    let responseContent = '';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('self-exam') || lowerMessage.includes('self exam') || lowerMessage.includes('breast exam')) {
      responseContent = `Hello! I'm Dr. Sakura, and I'm here to guide you through proper breast self-examination techniques. 

**Monthly Self-Examination Steps:**

1. **Visual Inspection** - Stand in front of a mirror with your arms at your sides, then raised overhead. Look for changes in size, shape, or skin texture.

2. **Manual Examination** - Lie down and use the pads of your three middle fingers to feel for lumps, using small circular motions.

3. **Systematic Coverage** - Start at the outer edge and spiral inward, covering the entire breast and armpit area.

4. **Check Both Breasts** - Repeat the process for both breasts monthly, ideally 3-7 days after your period.

**What to Look For:**
- New lumps or thickening
- Changes in breast size or shape
- Skin dimpling or puckering
- Nipple discharge or inversion

Remember, 90% of breast lumps are benign, but early detection is key. If you notice any changes, consult your healthcare provider promptly.

The multimedia content I've shared includes visual guides and expert tutorials to help you perform these examinations correctly.`;
    } else if (lowerMessage.includes('mammogram') || lowerMessage.includes('screening')) {
      responseContent = `Great question about mammography screening! As Dr. Sakura, I recommend following evidence-based screening guidelines:

**Mammogram Schedule:**
- Ages 40-49: Discuss with your doctor (individual risk assessment)
- Ages 50-74: Every 2 years (standard recommendation)
- High risk: Annual screening may start earlier

**What to Expect:**
- Brief procedure (15-20 minutes)
- Mild discomfort during compression
- Results typically available within days

The multimedia content includes images showing the mammography process and links to authoritative guidelines from cancer organizations.`;
    } else {
      responseContent = `Hello! I'm Dr. Sakura Wellness, your breast health coach. I'm here to provide evidence-based guidance on breast health, preventive care, and wellness.

I can help you with:
- Breast self-examination techniques
- Understanding screening recommendations  
- Risk factor education
- Lifestyle modifications for breast health
- Emotional support during health concerns

Please feel free to ask me any specific questions about breast health. I'm here to support your wellness journey with compassionate, medically accurate information.`;
    }
    
    console.log(`✅ Dr. Sakura response generated with ${multimediaContent.length} multimedia items`);
    
    res.json({
      success: true,
      response: {
        content: responseContent,
        multimediaContent: multimediaContent,
        avatarId: 'dr_sakura_brezcode',
        avatarName: 'Dr. Sakura Wellness',
        role: 'Breast Health Coach',
        qualityScores: {
          empathy: 95,
          medicalAccuracy: 98,
          overall: 96
        },
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error: any) {
    console.error('❌ Error in Dr. Sakura chat:', error);
    res.status(500).json({ 
      error: 'I apologize, but I encountered an issue. Please try asking your question again.',
      details: error.message 
    });
  }
});

// Proactive Research Endpoints
app.post('/api/brezcode/avatar/dr-sakura/start-proactive-research', async (req, res) => {
  try {
    const { userId, intervalMinutes = 2 } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🔍 Starting proactive research for user ${userId} with ${intervalMinutes} minute intervals`);
    
    // Store the interval in a simple in-memory store for this demo
    (global as any).proactiveResearchIntervals = (global as any).proactiveResearchIntervals || {};
    
    // Clear any existing interval for this user
    if ((global as any).proactiveResearchIntervals[userId]) {
      clearInterval((global as any).proactiveResearchIntervals[userId]);
    }
    
    // Educational topics featuring renowned scientists and KOLs
    const educationalTopics = [
      'dr_rhonda_patrick',
      'dr_david_sinclair',
      'self_examination',
      'lifestyle_prevention'
    ];
    
    let topicIndex = 0;
    
    // Set up automated content delivery
    const interval = setInterval(async () => {
      try {
        const currentTopic = educationalTopics[topicIndex % educationalTopics.length];
        
        // Generate proactive educational content
        const { MultimediaContentService } = await import('./services/multimediaContentService');
        const educationalContent = MultimediaContentService.generateProactiveEducationalContent(currentTopic);
        
        console.log(`📚 Proactive research: Delivering ${currentTopic} content to user ${userId}`);
        
        // Store this as a proactive message that the frontend can poll
        (global as any).proactiveMessages = (global as any).proactiveMessages || {};
        (global as any).proactiveMessages[userId] = (global as any).proactiveMessages[userId] || [];
        
        const proactiveMessage = {
          id: `proactive_${Date.now()}`,
          type: 'proactive_research',
          topic: currentTopic,
          content: educationalContent,
          timestamp: new Date().toISOString()
        };
        
        (global as any).proactiveMessages[userId].push(proactiveMessage);
        
        // Keep only the last 10 proactive messages
        if ((global as any).proactiveMessages[userId].length > 10) {
          (global as any).proactiveMessages[userId] = (global as any).proactiveMessages[userId].slice(-10);
        }
        
        topicIndex++;
      } catch (error) {
        console.error('Error in proactive research delivery:', error);
      }
    }, intervalMinutes * 60 * 1000);
    
    (global as any).proactiveResearchIntervals[userId] = interval;
    
    res.json({
      success: true,
      message: `Proactive research started with ${intervalMinutes} minute intervals`,
      intervalMinutes,
      status: 'active'
    });
    
  } catch (error: any) {
    console.error('Error starting proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stop proactive research
app.post('/api/brezcode/avatar/dr-sakura/stop-proactive-research', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    console.log(`🛑 Stopping proactive research for user ${userId}`);
    
    (global as any).proactiveResearchIntervals = (global as any).proactiveResearchIntervals || {};
    
    if ((global as any).proactiveResearchIntervals[userId]) {
      clearInterval((global as any).proactiveResearchIntervals[userId]);
      delete (global as any).proactiveResearchIntervals[userId];
    }
    
    res.json({
      success: true,
      message: 'Proactive research stopped',
      status: 'inactive'
    });
    
  } catch (error: any) {
    console.error('Error stopping proactive research:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get proactive messages for a user
app.get('/api/brezcode/avatar/dr-sakura/proactive-messages/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    (global as any).proactiveMessages = (global as any).proactiveMessages || {};
    const messages = (global as any).proactiveMessages[userId] || [];
    
    res.json({
      success: true,
      messages,
      count: messages.length
    });
    
  } catch (error: any) {
    console.error('Error fetching proactive messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark proactive message as read
app.post('/api/brezcode/avatar/dr-sakura/mark-proactive-read', async (req, res) => {
  try {
    const { userId, messageId } = req.body;
    
    if (!userId || !messageId) {
      return res.status(400).json({ error: 'userId and messageId are required' });
    }
    
    (global as any).proactiveMessages = (global as any).proactiveMessages || {};
    if ((global as any).proactiveMessages[userId]) {
      (global as any).proactiveMessages[userId] = (global as any).proactiveMessages[userId].filter(
        (msg: any) => msg.id !== messageId
      );
    }
    
    res.json({
      success: true,
      message: 'Proactive message marked as read'
    });
    
  } catch (error: any) {
    console.error('Error marking proactive message as read:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dr. Sakura configuration endpoint
app.get('/api/brezcode/avatar/dr-sakura/config', async (req, res) => {
  try {
    const config = {
      id: 'dr_sakura_brezcode',
      name: 'Dr. Sakura Wellness',
      role: 'Breast Health Coach',
      personality: {
        empathetic: true,
        professional: true,
        encouraging: true,
        culturallyAware: true
      },
      expertise: [
        'Breast health education',
        'Risk assessment interpretation',
        'Preventive care guidance',
        'Lifestyle recommendations',
        'Emotional support for health anxiety'
      ],
      appearance: {
        hairColor: 'Soft pink with gentle waves',
        eyeColor: 'Warm brown eyes',
        style: 'Professional medical attire with cherry blossom pin',
        demeanor: 'Calm, reassuring, and approachable'
      },
      communicationStyle: 'Warm, evidence-based, culturally sensitive'
    };
    
    res.json({
      success: true,
      avatar: config
    });
  } catch (error: any) {
    console.error('Error fetching Dr. Sakura config:', error);
    res.status(500).json({ error: error.message });
  }
});

console.log('✅ BrezCode avatar routes registered successfully');

try {
  console.log('🚀 Registering avatar training routes...');
  const { registerAvatarTrainingRoutes } = await import('./avatar-training-routes');
  registerAvatarTrainingRoutes(app);
  console.log('✅ Avatar training routes registered successfully');
} catch (error) {
  console.log('⚠️ Avatar training routes not found, skipping...');
}

try {
  console.log('🎯 Registering Avatar Performance routes...');
  const { registerAvatarPerformanceRoutes } = await import('./routes/avatarPerformanceRoutes');
  registerAvatarPerformanceRoutes(app);
  console.log('✅ Avatar Performance routes registered successfully');
} catch (error) {
  console.log('⚠️ Avatar performance routes not found, skipping...');
}

// KOL Videos API endpoints
app.get('/api/kol-videos', async (req, res) => {
  try {
    const { KOLVideoService } = await import('./services/kolVideoService');
    const videos = KOLVideoService.getAllKOLVideos();
    
    res.json({
      success: true,
      videos: videos,
      total: videos.length
    });
  } catch (error: any) {
    console.error('Error fetching KOL videos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch videos',
      details: error.message 
    });
  }
});

app.get('/api/kol-videos/by-kol/:kolName', async (req, res) => {
  try {
    const { kolName } = req.params;
    const { KOLVideoService } = await import('./services/kolVideoService');
    const videos = KOLVideoService.getVideosByKOL(kolName);
    
    res.json({
      success: true,
      videos: videos,
      total: videos.length,
      kol: kolName
    });
  } catch (error: any) {
    console.error('Error fetching KOL videos by name:', error);
    res.status(500).json({ 
      error: 'Failed to fetch videos by KOL',
      details: error.message 
    });
  }
});

// Setup Vite middleware (this should be last)
if (app.get("env") === "development") {
  await setupVite(app);
} else {
  serveStatic(app);
}

const server = createServer(app);

server.listen(5000, "0.0.0.0", () => {
  log(`serving on port 5000`);
});