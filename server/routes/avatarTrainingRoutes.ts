import { Router } from 'express';
import { AVATAR_TYPES, TRAINING_SCENARIOS } from '../avatarTrainingScenarios';

const router = Router();

// Mock training sessions storage (in production would be database)
let trainingSessions: any[] = [];
let sessionCounter = 1;

// Add a continue conversation endpoint for BrezCode training
router.post('/sessions/:sessionId/continue', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = trainingSessions.find(s => s.id === sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get Dr. Sakura's last response to generate drilling follow-up questions
    const lastDrSakuraResponse = session.messages[session.messages.length - 1]?.content || "";
    const messageCount = session.messages.length;
    
    // AI patient drilling questions that demand specific, actionable answers
    let customerQuestion = "";
    
    if (messageCount <= 2) {
      // Initial questions
      customerQuestion = "I'm concerned about breast health screening, but I need SPECIFIC information. Everyone gives me vague advice. What exactly should I do and when?";
    } else if (lastDrSakuraResponse.includes("important") || lastDrSakuraResponse.includes("recommend")) {
      customerQuestion = `You said it's "important" but that doesn't help me. What EXACTLY happens if I don't get screened this year? Give me specific risks, not general statements.`;
    } else if (lastDrSakuraResponse.includes("routine") || lastDrSakuraResponse.includes("screening")) {
      customerQuestion = `You mentioned screening but didn't tell me HOW OFTEN exactly. Every year? Every two years? At what age do I start? I need the specific timeline.`;
    } else if (lastDrSakuraResponse.includes("self-exam") || lastDrSakuraResponse.includes("check")) {
      customerQuestion = `That's too vague about self-exams. What EXACTLY am I looking for? Describe what a concerning lump feels like versus normal breast tissue.`;
    } else if (lastDrSakuraResponse.includes("mammogram")) {
      customerQuestion = `You talked about mammograms but didn't explain the actual process. What happens when I get there? How long does it take? Will it really hurt?`;
    } else if (lastDrSakuraResponse.includes("plan") || lastDrSakuraResponse.includes("step")) {
      customerQuestion = `That "plan" you mentioned is still too general. I need step-by-step instructions. What do I do first? When do I schedule what?`;
    } else if (messageCount > 6) {
      customerQuestion = `I'm still not getting clear answers. Stop giving me general healthcare advice. I need YOU to tell me exactly what I should do for MY specific situation.`;
    } else {
      // Default drilling questions for persistent training
      const drillingQuestions = [
        "That doesn't answer my specific question. I asked about timing and you gave me general advice. When EXACTLY should I schedule my mammogram?",
        "You're being too vague again. I need concrete steps, not reassuring words. What are the exact warning signs I should look for?",
        "I still don't understand what you mean by 'routine screening.' How often is routine? What specific tests do I need?",
        "That sounds like something you'd tell everyone. What about MY specific age and situation? What's different for someone like me?",
        "You didn't address my main concern. I asked about pain during mammograms and you talked about importance. Does it hurt or not?",
        "I need specifics, not general comfort. What exactly will the technician do? How long will I be there? What should I wear?"
      ];
      customerQuestion = drillingQuestions[Math.floor(Math.random() * drillingQuestions.length)];
    }
    
    // Generate specific Dr. Sakura responses based on patient's drilling questions
    let drSakuraResponse = "";
    
    if (customerQuestion.includes("SPECIFIC") || customerQuestion.includes("exactly") || customerQuestion.includes("vague")) {
      drSakuraResponse = "You're absolutely right to ask for specifics. For someone your age, mammograms should start at 40 (or 50 depending on risk factors). Schedule annually if you have family history, every 2 years if average risk. Self-exams monthly, 3-7 days after your period ends. Any lump that feels like a grape or marble, is immobile, or has irregular edges needs immediate evaluation within 1-2 weeks.";
    } else if (customerQuestion.includes("HOW OFTEN") || customerQuestion.includes("timeline")) {
      drSakuraResponse = "Here's the exact timeline: Clinical breast exams every 1-3 years from age 25-39, then annually. Mammograms annually starting at age 40 (high risk) or age 50 (average risk). Self-exams monthly. If you find anything concerning, see your doctor within 2 weeks. Schedule mammograms for the week after your period when breasts are least tender.";
    } else if (customerQuestion.includes("process") || customerQuestion.includes("what happens")) {
      drSakuraResponse = "Here's exactly what happens: You'll undress from the waist up, put on a hospital gown that opens in front. The technologist positions your breast on a plastic plate, then a paddle compresses it for 10-15 seconds while the X-ray is taken. Two views per breast - one from top to bottom, one side to side. Total time: 20 minutes. Pain level: 2-7 out of 10, brief compression discomfort only.";
    } else if (customerQuestion.includes("feel like") || customerQuestion.includes("warning signs")) {
      drSakuraResponse = "Concerning lumps feel like: hard, immobile mass (like a marble); irregular, not round; painless initially; different from surrounding tissue. Normal breast tissue feels like small peas or gravel. Red flags: new lump that doesn't move, skin dimpling, nipple discharge (bloody or clear), breast size changes, persistent pain in one spot. Any of these warrant a doctor visit within 1-2 weeks.";
    } else if (customerQuestion.includes("step-by-step") || customerQuestion.includes("instructions")) {
      drSakuraResponse = "Step 1: Call your doctor's office, request 'clinical breast exam and mammogram referral'. Step 2: Schedule mammogram for 1 week after your period. Step 3: Don't wear deodorant/lotion that day. Step 4: Bring previous mammogram films if available. Step 5: Arrive 15 minutes early for paperwork. Step 6: Results typically available within 48-72 hours via phone call or patient portal.";
    } else {
      // Default more specific responses when patients are being persistent
      const specificResponses = [
        "I understand you need concrete information. Mammograms detect cancer 1-2 years before you can feel a lump. They reduce breast cancer death rates by 20-40%. For a 50-year-old woman, annual screening prevents 1 death per 1000 women screened over 10 years. The compression lasts 10-15 seconds and feels like firm pressure, not cutting pain.",
        "Let me give you exact numbers: 1 in 8 women develop breast cancer. 85% have no family history. Mammograms find 80-90% of breast cancers in women over 50. Self-exams help you know what's normal for you. Schedule your mammogram between days 1-7 of your cycle when breasts are least dense and tender.",
        "Here are the specific ages and actions: 20s-30s: monthly self-exams, clinical exam every 3 years. 40s+: annual mammograms and clinical exams, monthly self-exams. High risk (family history): start mammograms 10 years before affected relative's age or age 40, whichever is earlier. MRI may be recommended for BRCA carriers."
      ];
      drSakuraResponse = specificResponses[Math.floor(Math.random() * specificResponses.length)];
    }
    
    // Add new customer message
    const newCustomerMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 1}`,
      role: 'customer',
      content: customerQuestion,
      timestamp: new Date(Date.now() - 30000).toISOString(),
      emotion: customerQuestion.includes('EXACTLY') || customerQuestion.includes('vague') ? 'demanding' : 'concerned'
    };
    
    // Add Dr. Sakura's response
    const newAvatarMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 2}`,
      role: 'avatar', 
      content: drSakuraResponse,
      timestamp: new Date().toISOString(),
      quality_score: Math.floor(Math.random() * 20) + 80
    };
    
    session.messages.push(newCustomerMessage, newAvatarMessage);
    
    // Update performance metrics
    session.performance_metrics = {
      response_quality: Math.floor(Math.random() * 20) + 80,
      customer_satisfaction: Math.floor(Math.random() * 15) + 75,
      goal_achievement: Math.floor(Math.random() * 20) + 70,
      conversation_flow: Math.floor(Math.random() * 15) + 80
    };
    
    res.json({
      success: true,
      session: session
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get avatar types for training selection
router.get('/avatar-types', (req, res) => {
  try {
    res.json({
      success: true,
      avatarTypes: AVATAR_TYPES
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get training scenarios by avatar type
router.get('/scenarios', (req, res) => {
  try {
    const { avatarType } = req.query;
    
    let scenarios = TRAINING_SCENARIOS;
    if (avatarType) {
      scenarios = TRAINING_SCENARIOS.filter(s => s.avatarType === avatarType);
    }
    
    res.json({
      success: true,
      scenarios: scenarios
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get training recommendations
router.get('/recommendations/:avatarType', (req, res) => {
  try {
    const { avatarType } = req.params;
    
    // Generate recommendations based on avatar type
    const recommendations = {
      beginner: ['Start with basic customer service scenarios', 'Focus on active listening skills'],
      intermediate: ['Practice objection handling', 'Work on product knowledge'],
      advanced: ['Master complex problem resolution', 'Lead difficult conversations']
    };
    
    res.json({
      success: true,
      recommendations: recommendations
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all training sessions
router.get('/sessions', (req, res) => {
  try {
    res.json({
      success: true,
      sessions: trainingSessions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start a new training session with automatic AI conversation
router.post('/sessions/start', (req, res) => {
  try {
    const { avatarId, scenarioId, businessContext } = req.body;
    
    // Generate automatic conversation for Dr. Sakura
    const initialMessages = [];
    if (avatarId === 'health_sakura' || avatarId === 'brezcode_health_coach') {
      initialMessages.push({
        id: `msg_${Date.now()}_1`,
        role: 'customer',
        content: "Hi Dr. Sakura, I'm concerned about breast health screening. I've been putting off my mammogram and I'm not sure about self-exams. Can you help guide me?",
        timestamp: new Date().toISOString(),
        emotion: 'anxious',
        intent: 'seeking health guidance'
      });
      
      initialMessages.push({
        id: `msg_${Date.now()}_2`, 
        role: 'avatar',
        content: "I completely understand your concerns, and it's wonderful that you're taking proactive steps for your breast health. Let me help you feel more confident about both screening options. First, regarding mammograms - they're our best tool for early detection. What specific concerns do you have about scheduling yours?",
        timestamp: new Date().toISOString(),
        quality_score: 95
      });
    }
    
    const session = {
      id: `session_${sessionCounter++}`,
      avatarId,
      scenarioId,
      status: 'active',
      startTime: new Date().toISOString(),
      messages: initialMessages,
      performance_metrics: {
        response_quality: Math.floor(Math.random() * 20) + 80,
        customer_satisfaction: Math.floor(Math.random() * 15) + 75,
        goal_achievement: Math.floor(Math.random() * 20) + 70,
        conversation_flow: Math.floor(Math.random() * 15) + 80
      }
    };
    
    trainingSessions.push(session);
    
    res.json({
      success: true,
      session: session
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message in training session
router.post('/sessions/message', async (req, res) => {
  try {
    const { sessionId, message, role } = req.body;
    
    const session = trainingSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Generate AI response based on avatar and scenario
    const avatarResponse = await generateAvatarResponse(session.avatarId, session.scenarioId, message);
    
    session.messages.push({
      role: 'assistant',
      content: avatarResponse,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      response: avatarResponse,
      session: session
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// End training session
router.post('/sessions/:sessionId/end', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = trainingSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    session.status = 'completed';
    session.endTime = new Date().toISOString();
    
    // Calculate score based on session performance
    const score = calculateSessionScore(session);
    session.score = score;
    session.feedback = generateSessionFeedback(score);
    
    res.json({
      success: true,
      score: score,
      feedback: session.feedback,
      session: session
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate avatar responses
async function generateAvatarResponse(avatarId: string, scenarioId: string, userMessage: string): Promise<string> {
  // Find scenario details
  const scenario = TRAINING_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) {
    return "I'm sorry, I couldn't find the scenario details. Let me help you anyway.";
  }
  
  // Generate contextual response based on scenario
  const responses = {
    'angry_customer_service': [
      "I understand you're frustrating and I want to help resolve this issue for you. Can you tell me more about what happened?",
      "I apologize for the inconvenience. Let me look into this right away and find a solution.",
      "I hear your concerns and I'm committed to making this right. What would be the best outcome for you?"
    ],
    'price_objection_sales': [
      "I understand price is an important consideration. Let me show you the value this brings to your business.",
      "That's a fair concern. Many of our clients initially had similar thoughts. What specific budget range works best for you?",
      "I appreciate your directness about pricing. Let's discuss what's most important to you so I can show you the ROI."
    ],
    'technical_api_support': [
      "Let me help you troubleshoot this API integration issue. Can you share the error message you're seeing?",
      "I'll walk you through the authentication process step by step. First, let's verify your API keys are configured correctly.",
      "This is a common integration challenge. Let me provide you with the exact code snippet and configuration you need."
    ],
    'breast_health_coaching': [
      "I understand this can feel overwhelming. Breast health is very personal, and I'm here to support you through this journey.",
      "Thank you for trusting me with your health questions. Let me provide you with evidence-based information to help guide your decisions.",
      "It's completely normal to have concerns about breast health. Would you like me to explain the assessment process in simple terms?"
    ]
  };
  
  // Select appropriate response based on scenario
  const scenarioResponses = responses[scenario.id as keyof typeof responses] || [
    "Thank you for that information. How can I best assist you today?",
    "I'm here to help. Let me understand your needs better so I can provide the right solution.",
    "I appreciate you reaching out. What's the most important thing I can help you with right now?"
  ];
  
  // Return random appropriate response
  return scenarioResponses[Math.floor(Math.random() * scenarioResponses.length)];
}

// Helper function to calculate session score
function calculateSessionScore(session: any): number {
  const messageCount = session.messages.filter((m: any) => m.role === 'user').length;
  const duration = new Date().getTime() - new Date(session.startTime).getTime();
  const durationMinutes = duration / (1000 * 60);
  
  // Base score factors
  let score = 70; // Base score
  
  // Add points for engagement (more messages = better interaction)
  score += Math.min(messageCount * 5, 20);
  
  // Add points for appropriate session length (5-15 minutes ideal)
  if (durationMinutes >= 3 && durationMinutes <= 20) {
    score += 10;
  }
  
  // Random variation to simulate realistic scoring
  score += Math.floor(Math.random() * 10) - 5;
  
  return Math.min(Math.max(score, 60), 100); // Clamp between 60-100
}

// Helper function to generate session feedback
function generateSessionFeedback(score: number): string {
  if (score >= 90) {
    return "Excellent performance! Your responses showed great empathy and problem-solving skills.";
  } else if (score >= 80) {
    return "Good job! You handled the scenario well with room for minor improvements.";
  } else if (score >= 70) {
    return "Solid performance. Focus on active listening and asking clarifying questions.";
  } else {
    return "Keep practicing! Remember to stay calm and focus on understanding the customer's needs.";
  }
}

export default router;