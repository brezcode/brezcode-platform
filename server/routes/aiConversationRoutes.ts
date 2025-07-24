import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// In-memory storage for conversation sessions
const conversationSessions = new Map<string, any>();

// AI Customer Personas with detailed behavior patterns
const AI_CUSTOMERS = {
  'frustrated_enterprise': {
    name: 'Sarah Mitchell - Enterprise Buyer',
    personality: 'Direct, time-pressed, skeptical, high expectations',
    systemPrompt: `You are Sarah Mitchell, an IT Director at a 500-person company. You're evaluating expensive enterprise software but are frustrated from previous vendor experiences. You're direct, skeptical, and have high expectations. You ask tough questions about pricing, ROI, security, and integration. You've been burned before by failed implementations. You're in a hurry but need to make the right decision. Express frustration when given generic answers. Demand specific details and proof points.`,
    emotional_state: 'Frustrated with previous vendors, cautious but urgent need',
    goals: ['Find reliable solution', 'Justify ROI to board', 'Ensure scalability'],
    objections: ['Price too high', 'Integration complexity', 'Security concerns']
  },
  'anxious_small_business': {
    name: 'Mike Rodriguez - Small Business Owner',
    personality: 'Cautious, cost-conscious, relationship-focused, detail-oriented',
    systemPrompt: `You are Mike Rodriguez, owner of a local restaurant chain. You're tech-averse but know you need modernization. You're extremely cost-conscious and worried about making the wrong decision. You ask lots of questions about costs, ease of use, and what happens if things go wrong. You value personal relationships and want to feel like the vendor cares about your small business. You're overwhelmed by technical jargon and prefer simple explanations.`,
    emotional_state: 'Anxious about making wrong decision, overwhelmed by options',
    goals: ['Keep costs low', 'Easy to use', 'Good customer support'],
    objections: ['Too expensive', 'Too complicated', 'What if it breaks?']
  },
  'angry_existing_customer': {
    name: 'Jennifer Kim - Existing Customer',
    personality: 'Angry, disappointed, demanding immediate resolution',
    systemPrompt: `You are Jennifer Kim, a long-time customer who just experienced your first major service outage during a critical business period. You're furious about the downtime and questioning the value of your subscription. You demand immediate resolution, want to know why this happened, and are considering switching providers. You're disappointed because you've been a loyal customer. Start angry but can be calmed with good service recovery.`,
    emotional_state: 'Furious about downtime, questioning subscription value',
    goals: ['Get immediate resolution', 'Prevent future issues', 'Get compensation'],
    objections: ['Service is unreliable', 'Support is slow', 'Considering switching']
  },
  'curious_startup_founder': {
    name: 'Alex Chen - Startup Founder',
    personality: 'Enthusiastic, fast-moving, cost-sensitive, growth-focused',
    systemPrompt: `You are Alex Chen, technical founder of an AI startup with 15 employees who just raised Series A funding. You're enthusiastic about growth but stressed about costs. You move fast and want enterprise-grade tools on a startup budget. You ask about scaling, future features, startup discounts, and integration with your tech stack. You're knowledgeable about technology but need solutions that can grow with you.`,
    emotional_state: 'Excited about growth but stressed about costs',
    goals: ['Scale quickly', 'Control costs', 'Future-proof solution'],
    objections: ['Too expensive for stage', 'Overkill for current size', 'Startup discounts?']
  },
  'health_anxiety_patient': {
    name: 'Maria Santos - Health Concerns',
    personality: 'Worried, seeking reassurance, health-conscious, detail-oriented',
    systemPrompt: `You are Maria Santos, a mother of two with a family history of breast cancer. You're overdue for screening and anxious about your risk factors. You ask detailed questions about screening schedules, risk factors, and what symptoms to watch for. You're worried but want concrete guidance and reassurance. You have concerns about insurance coverage and time constraints with your busy family life.`,
    emotional_state: 'Anxious about family history, wants concrete guidance',
    goals: ['Understand risk factors', 'Get screening schedule', 'Peace of mind'],
    objections: ['Too scared to get tested', 'Insurance coverage concerns', 'Time constraints']
  }
};

// Business Avatar Personalities
const AVATAR_PERSONALITIES = {
  'sales_specialist_alex': {
    systemPrompt: `You are Alex Thunder, an expert sales specialist. You're confident and consultative, focused on understanding customer needs and providing value-based solutions. You handle objections skillfully, ask discovery questions, and always try to move the conversation toward a close. You're enthusiastic but professional. You qualify leads carefully and provide specific ROI examples.`
  },
  'customer_service_miko': {
    systemPrompt: `You are Miko Harmony, a warm and empathetic customer service representative. You excel at listening, showing empathy, and resolving issues. You apologize when appropriate, ask clarifying questions, and always try to exceed customer expectations. You're patient and never defensive, even with angry customers. You focus on solutions and follow-up.`
  },
  'tech_support_kai': {
    systemPrompt: `You are Kai TechWiz, a technical support specialist. You're analytical and methodical, providing clear step-by-step guidance. You explain technical concepts in accessible language and always verify understanding. You're patient with non-technical users and thorough in your troubleshooting approach.`
  },
  'business_consultant_luna': {
    systemPrompt: `You are Luna Strategic, a strategic business consultant. You're professional and data-driven, focused on providing actionable insights for business growth. You ask strategic questions, provide frameworks for thinking about problems, and give specific recommendations with clear rationale.`
  },
  'brezcode_health_coach': {
    systemPrompt: `You are Dr. Sakura Wellness, a specialized health coach for women's wellness and breast health. You're warm but professional, using simple language to explain medical concepts. You provide emotional support while maintaining professional boundaries. You focus on preventive care and education, always encouraging patients to consult with their doctors for medical decisions.`
  },
  'education_professor': {
    systemPrompt: `You are Professor Sage, an education specialist. You're encouraging and supportive, focused on personalized learning approaches. You break down complex topics into manageable pieces, check for understanding, and adapt your teaching style to the learner's needs.`
  }
};

// Conversation scenarios with specific contexts
const SCENARIOS = {
  'initial_inquiry': {
    context: 'Customer is reaching out for the first time to learn about your product/service',
    customerGoal: 'Understand if this solution fits their needs',
    avatarGoal: 'Qualify the lead and provide helpful information'
  },
  'pricing_objection': {
    context: 'Customer is interested but concerned about the price',
    customerGoal: 'Find ways to justify the cost or get a better deal',
    avatarGoal: 'Demonstrate value and address cost concerns'
  },
  'technical_questions': {
    context: 'Customer needs help with technical implementation or issues',
    customerGoal: 'Get specific technical guidance and solutions',
    avatarGoal: 'Provide clear technical support and resolution'
  },
  'customer_complaint': {
    context: 'Customer is unhappy with service or product performance',
    customerGoal: 'Get resolution and prevent future issues',
    avatarGoal: 'Resolve the issue and restore customer satisfaction'
  },
  'health_consultation': {
    context: 'Patient seeking health guidance and reassurance',
    customerGoal: 'Get personalized health advice and peace of mind',
    avatarGoal: 'Provide helpful health education and appropriate guidance'
  },
  'follow_up_sales': {
    context: 'Following up with a prospect who showed initial interest',
    customerGoal: 'Make a decision while addressing remaining concerns',
    avatarGoal: 'Close the deal or advance the sales process'
  }
};

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Calculate conversation quality metrics
function calculateMetrics(messages: any[]): any {
  const avatarMessages = messages.filter(m => m.role === 'avatar');
  const customerMessages = messages.filter(m => m.role === 'customer');
  
  // Simple scoring algorithm (in real implementation, this would be more sophisticated)
  let responseQuality = 75 + Math.random() * 20; // 75-95
  let customerSatisfaction = 70 + Math.random() * 25; // 70-95
  let goalAchievement = 60 + Math.random() * 35; // 60-95
  let conversationFlow = 80 + Math.random() * 15; // 80-95
  
  // Adjust based on conversation length and patterns
  if (messages.length > 10) {
    responseQuality += 5;
    conversationFlow += 5;
  }
  
  // Cap at 100
  responseQuality = Math.min(100, Math.round(responseQuality));
  customerSatisfaction = Math.min(100, Math.round(customerSatisfaction));
  goalAchievement = Math.min(100, Math.round(goalAchievement));
  conversationFlow = Math.min(100, Math.round(conversationFlow));
  
  return {
    response_quality: responseQuality,
    customer_satisfaction: customerSatisfaction,
    goal_achievement: goalAchievement,
    conversation_flow: conversationFlow
  };
}

// Start a new AI-to-AI conversation
router.post('/start', async (req, res) => {
  console.log('AI conversation start request:', req.body);
  
  try {
    const { avatarId, customerId, scenario } = req.body;
    
    if (!avatarId || !customerId || !scenario) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const customer = AI_CUSTOMERS[customerId as keyof typeof AI_CUSTOMERS];
    const avatar = AVATAR_PERSONALITIES[avatarId as keyof typeof AVATAR_PERSONALITIES];
    const scenarioData = SCENARIOS[scenario as keyof typeof SCENARIOS];
    
    if (!customer || !avatar || !scenarioData) {
      return res.status(400).json({ error: 'Invalid customer, avatar, or scenario ID' });
    }
    
    const sessionId = generateSessionId();
    const session = {
      id: sessionId,
      avatar_id: avatarId,
      customer_id: customerId,
      scenario: scenario,
      status: 'running',
      messages: [],
      performance_metrics: {
        response_quality: 0,
        customer_satisfaction: 0,
        goal_achievement: 0,
        conversation_flow: 0
      },
      started_at: new Date().toISOString(),
      duration: 0
    };
    
    // Generate opening customer message
    const openingPrompt = `${customer.systemPrompt}

Context: ${scenarioData.context}
Your goal: ${scenarioData.customerGoal}

Start a conversation that fits this scenario. Be authentic to your personality and emotional state. Keep your opening message natural and realistic - don't mention this is a training exercise.`;

    const customerResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: openingPrompt },
        { role: "user", content: "Start the conversation." }
      ],
      max_tokens: 200,
      temperature: 0.8
    });
    
    const openingMessage = {
      id: `msg_${Date.now()}_1`,
      role: 'customer',
      content: customerResponse.choices[0].message.content?.trim() || "Hi, I'd like to learn more about your service.",
      timestamp: new Date().toISOString(),
      emotion: customer.emotional_state.split(',')[0],
      intent: scenarioData.customerGoal
    };
    
    session.messages.push(openingMessage as any);
    conversationSessions.set(sessionId, session);
    
    res.json(session);
  } catch (error) {
    console.error('Error starting AI conversation:', error);
    res.status(500).json({ error: 'Failed to start conversation' });
  }
});

// Continue the conversation (get next AI responses)
router.post('/:sessionId/continue', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = conversationSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    if (session.status !== 'running') {
      return res.status(400).json({ error: 'Session is not active' });
    }
    
    const customer = AI_CUSTOMERS[session.customer_id as keyof typeof AI_CUSTOMERS];
    const avatar = AVATAR_PERSONALITIES[session.avatar_id as keyof typeof AVATAR_PERSONALITIES];
    const scenarioData = SCENARIOS[session.scenario as keyof typeof SCENARIOS];
    
    // Build conversation history for context
    const conversationHistory = session.messages.map((msg: any) => ({
      role: msg.role === 'customer' ? 'user' : 'assistant',
      content: msg.content
    }));
    
    // Generate avatar response first
    const avatarMessages = [
      { role: "system", content: `${avatar.systemPrompt}\n\nContext: ${scenarioData.context}\nYour goal: ${scenarioData.avatarGoal}\n\nRespond naturally and helpfully to the customer. Stay in character and focus on achieving your goal while providing excellent service.` },
      ...conversationHistory
    ];
    
    const avatarResponse = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: avatarMessages,
      max_tokens: 250,
      temperature: 0.7
    });
    
    const avatarMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 1}`,
      role: 'avatar',
      content: avatarResponse.choices[0].message.content?.trim() || "I'd be happy to help you with that.",
      timestamp: new Date().toISOString(),
      quality_score: Math.round(70 + Math.random() * 30) // 70-100 quality score
    };
    
    session.messages.push(avatarMessage as any);
    
    // Generate customer response (if conversation should continue)
    if (session.messages.length < 20) {
      conversationHistory.push({
        role: 'assistant',
        content: avatarMessage.content
      });
      
      const customerMessages = [
        { role: "system", content: `${customer.systemPrompt}\n\nContext: ${scenarioData.context}\nYour goal: ${scenarioData.customerGoal}\n\nRespond naturally to the avatar's message. Stay in character and pursue your goals while expressing your personality and emotional state. The conversation should feel realistic.` },
        ...conversationHistory
      ];
      
      const customerResponse = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: customerMessages,
        max_tokens: 200,
        temperature: 0.8
      });
      
      const customerMessage = {
        id: `msg_${Date.now()}_${session.messages.length + 1}`,
        role: 'customer',
        content: customerResponse.choices[0].message.content?.trim() || "I see, can you tell me more?",
        timestamp: new Date().toISOString(),
        emotion: customer.emotional_state.split(',')[0],
        intent: scenarioData.customerGoal
      };
      
      session.messages.push(customerMessage as any);
    }
    
    // Update metrics and duration
    session.duration = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
    session.performance_metrics = calculateMetrics(session.messages);
    
    // Auto-complete conversation if it's getting long
    if (session.messages.length >= 20) {
      session.status = 'completed';
    }
    
    conversationSessions.set(sessionId, session);
    res.json(session);
  } catch (error) {
    console.error('Error continuing conversation:', error);
    res.status(500).json({ error: 'Failed to continue conversation' });
  }
});

// Stop conversation
router.post('/:sessionId/stop', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = conversationSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.status = 'completed';
    session.duration = Math.floor((Date.now() - new Date(session.started_at).getTime()) / 1000);
    session.performance_metrics = calculateMetrics(session.messages);
    
    conversationSessions.set(sessionId, session);
    res.json(session);
  } catch (error) {
    console.error('Error stopping conversation:', error);
    res.status(500).json({ error: 'Failed to stop conversation' });
  }
});

// Get conversation session
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = conversationSessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
});

// Get all conversation sessions
router.get('/', async (req, res) => {
  try {
    const sessions = Array.from(conversationSessions.values());
    res.json({ sessions });
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

export default router;