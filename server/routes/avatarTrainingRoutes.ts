import { Router } from 'express';
import { AVATAR_TYPES, TRAINING_SCENARIOS } from '../avatarTrainingScenarios';

const router = Router();

// Mock training sessions storage (in production would be database)
let trainingSessions: any[] = [];
let sessionCounter = 1;

// Global Dr. Sakura learning database - persists across all sessions
let drSakuraKnowledgeBase: {
  improvedResponses: Array<{
    originalTopic: string;
    userFeedback: string;
    improvedResponse: string;
    timestamp: string;
    usage_count: number;
  }>;
  commonQuestions: Array<{
    question: string;
    bestResponse: string;
    quality_score: number;
    updated: string;
  }>;
  learningStats: {
    total_feedback_received: number;
    improvement_trends: string[];
    last_updated: string;
  };
} = {
  improvedResponses: [],
  commonQuestions: [],
  learningStats: {
    total_feedback_received: 0,
    improvement_trends: [],
    last_updated: new Date().toISOString()
  }
};

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
    
    // Check knowledge base for improved responses based on previous learning
    const getImprovedResponse = (questionType: string): string | null => {
      const relevantLearning = drSakuraKnowledgeBase.improvedResponses.find(learning => 
        questionType.toLowerCase().includes(learning.originalTopic.toLowerCase()) ||
        learning.originalTopic.toLowerCase().includes(questionType.toLowerCase())
      );
      
      if (relevantLearning) {
        relevantLearning.usage_count++;
        console.log(`📚 Dr. Sakura applying learned response for: ${relevantLearning.originalTopic}`);
        return relevantLearning.improvedResponse;
      }
      
      return null;
    };

    // Generate specific Dr. Sakura responses with multiple choice options
    let drSakuraResponse = "";
    let multipleChoiceOptions: string[] = [];
    let usedLearning = false;
    
    if (customerQuestion.includes("SPECIFIC") || customerQuestion.includes("exactly") || customerQuestion.includes("vague")) {
      // Check for learned responses first
      const learnedResponse = getImprovedResponse("specific guidance");
      if (learnedResponse) {
        drSakuraResponse = learnedResponse;
        usedLearning = true;
      } else {
        drSakuraResponse = "I appreciate your feedback - it helps me provide better guidance. Let me be more direct: Breast health screening involves three components working together: 1) Monthly self-exams to know your normal, 2) Clinical exams by healthcare providers for professional assessment, 3) Mammograms for early detection before lumps are felt. The key is consistency and knowing when each component should start based on your age and risk factors.";
      }
      
      multipleChoiceOptions = [
        "Do you want me to guide you through monthly self-exams?",
        "Do you want to know more about how healthcare providers perform clinical exams?",
        "Do you want to know more about mammogram screening?"
      ];
    } else if (customerQuestion.includes("HOW OFTEN") || customerQuestion.includes("timeline")) {
      drSakuraResponse = "Here's the exact timeline: Clinical breast exams every 1-3 years from age 25-39, then annually. Mammograms annually starting at age 40 (high risk) or age 50 (average risk). Self-exams monthly. If you find anything concerning, see your doctor within 2 weeks. Schedule mammograms for the week after your period when breasts are least tender.";
      multipleChoiceOptions = [
        "Can you explain what happens during a clinical breast exam?",
        "What should I do if I find something concerning during self-exam?",
        "How do I know if I'm high risk and need earlier screening?"
      ];
    } else if (customerQuestion.includes("process") || customerQuestion.includes("what happens")) {
      drSakuraResponse = "Here's exactly what happens: You'll undress from the waist up, put on a hospital gown that opens in front. The technologist positions your breast on a plastic plate, then a paddle compresses it for 10-15 seconds while the X-ray is taken. Two views per breast - one from top to bottom, one side to side. Total time: 20 minutes. Pain level: 2-7 out of 10, brief compression discomfort only.";
      multipleChoiceOptions = [
        "How can I reduce discomfort during mammogram?",
        "What do the mammogram results mean?",
        "What happens if they find something abnormal?"
      ];
    } else if (customerQuestion.includes("feel like") || customerQuestion.includes("warning signs")) {
      drSakuraResponse = "Concerning lumps feel like: hard, immobile mass (like a marble); irregular, not round; painless initially; different from surrounding tissue. Normal breast tissue feels like small peas or gravel. Red flags: new lump that doesn't move, skin dimpling, nipple discharge (bloody or clear), breast size changes, persistent pain in one spot. Any of these warrant a doctor visit within 1-2 weeks.";
      multipleChoiceOptions = [
        "Can you teach me the proper self-exam technique?",
        "What questions should I ask my doctor if I find a lump?",
        "Are there other symptoms besides lumps I should watch for?"
      ];
    } else if (customerQuestion.includes("step-by-step") || customerQuestion.includes("instructions")) {
      drSakuraResponse = "Step 1: Call your doctor's office, request 'clinical breast exam and mammogram referral'. Step 2: Schedule mammogram for 1 week after your period. Step 3: Don't wear deodorant/lotion that day. Step 4: Bring previous mammogram films if available. Step 5: Arrive 15 minutes early for paperwork. Step 6: Results typically available within 48-72 hours via phone call or patient portal.";
      multipleChoiceOptions = [
        "What should I expect when I get my results?",
        "Do I need a referral or can I schedule directly?",
        "What if I don't have previous mammogram films?"
      ];
    } else {
      // Default: ALWAYS provide multiple choice options to ensure guided interaction
      drSakuraResponse = "I appreciate your feedback - it helps me provide better guidance. Let me be more direct: Breast health screening involves three components working together: 1) Monthly self-exams to know your normal, 2) Clinical exams by healthcare providers for professional assessment, 3) Mammograms for early detection before lumps are felt. The key is consistency and knowing when each component should start based on your age and risk factors.";
      multipleChoiceOptions = [
        "Do you want me to guide you through monthly self-exams?",
        "Do you want to know more about how healthcare providers perform clinical exams?",
        "Do you want to know more about mammogram screening?"
      ];
    }
    
    // Add new customer message
    const newCustomerMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 1}`,
      role: 'customer',
      content: customerQuestion,
      timestamp: new Date(Date.now() - 30000).toISOString(),
      emotion: customerQuestion.includes('EXACTLY') || customerQuestion.includes('vague') ? 'demanding' : 'concerned'
    };
    
    // Determine when to show multiple choice options
    // RULE: Show choices only on first continue call (when session has exactly 1 avatar message before adding new one)
    const avatarMessageCount = session.messages.filter(m => m.role === 'avatar').length;
    const shouldShowChoices = avatarMessageCount === 1;

    // Add Dr. Sakura's response with conditional multiple choice options
    const newAvatarMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 2}`,
      role: 'avatar', 
      content: drSakuraResponse,
      timestamp: new Date().toISOString(),
      quality_score: Math.floor(Math.random() * 20) + 80,
      multiple_choice_options: shouldShowChoices ? multipleChoiceOptions : []
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

// Add endpoint for handling multiple choice selections
router.post('/sessions/:sessionId/choice', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { choice } = req.body;
    
    const session = trainingSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Generate Dr. Sakura's response based on the selected choice
    let drSakuraResponse = "";
    
    if (choice.includes("guide you through monthly self-exams")) {
      drSakuraResponse = "Absolutely! Here's the proper self-exam technique: 1) Do it monthly, 3-7 days after your period when breasts are least tender. 2) Lie down with a pillow under your right shoulder, right arm behind your head. 3) Use your left hand's flat fingertips (not fingernails) to examine your right breast in small circular motions. 4) Check the entire breast area from collarbone to bra line, armpit to breastbone. 5) Use three levels of pressure: light (skin surface), medium (tissue), firm (down to ribs). 6) Repeat on left breast. 7) Also check while standing in shower with soapy hands.";
    } else if (choice.includes("clinical exams")) {
      drSakuraResponse = "During a clinical breast exam, your healthcare provider will: 1) Have you undress from the waist up and put on a gown. 2) Visually inspect your breasts for size/shape changes, skin dimpling, nipple discharge. 3) You'll lie down and they'll systematically feel each breast using fingertips in circular motions. 4) They'll check lymph nodes under arms, above/below collarbone. 5) They'll also examine while you're sitting up with arms in different positions. 6) The exam takes 5-10 minutes and should not be painful. This professional assessment can detect changes you might miss during self-exams.";
    } else if (choice.includes("mammogram screening")) {
      drSakuraResponse = "Mammogram screening details: 1) Schedule annually starting at age 40 (high risk) or 50 (average risk). 2) Schedule for 1 week after your period when breasts are least tender. 3) Don't wear deodorant, perfume, or powder on exam day. 4) Wear a two-piece outfit for easy undressing. 5) Bring previous mammogram films if available. 6) The technologist will position and compress your breast for 10-15 seconds per view. 7) Two views per breast: top-to-bottom and side-to-side. 8) Results typically available within 48-72 hours. Most mammograms (90%+) are normal. If abnormal, additional imaging or biopsy may be needed.";
    } else if (choice.includes("reduce discomfort")) {
      drSakuraResponse = "To reduce mammogram discomfort: 1) Schedule for the week after your period when breasts are least tender. 2) Avoid caffeine the day before (can increase breast sensitivity). 3) Take an over-the-counter pain reliever 1 hour before your appointment. 4) Practice deep breathing during compression. 5) Ask the technologist to warn you before compression starts. 6) Remember compression only lasts 10-15 seconds. 7) If you have fibrocystic breasts, discuss timing with your doctor. The discomfort is brief but necessary for clear images that could save your life.";
    } else if (choice.includes("results mean")) {
      drSakuraResponse = "Mammogram results explained: 1) Normal/Negative: No signs of cancer, continue routine screening. 2) Benign findings: Non-cancerous changes like cysts or calcifications, may need monitoring. 3) Probably benign: 98% chance of being normal, usually requires 6-month follow-up. 4) Suspicious abnormality: Needs biopsy to determine if cancerous. 5) Highly suggestive of malignancy: Very likely cancer, immediate biopsy needed. Results are categorized as BI-RADS 0-6. Most abnormal findings (80%) turn out to be benign. If called back for additional imaging, don't panic - it's often just to get clearer pictures.";
    } else if (choice.includes("something abnormal")) {
      drSakuraResponse = "If mammogram finds something abnormal: 1) You'll be called back for additional imaging (diagnostic mammogram or ultrasound). 2) If still abnormal, a biopsy will be recommended. 3) Core needle biopsy is most common - takes tissue sample with a needle. 4) Results available in 3-5 days. 5) If benign, return to routine screening. 6) If malignant, you'll be referred to oncology within 1-2 weeks. 7) Remember: Being called back doesn't mean cancer - only 2-4% of callbacks result in cancer diagnosis. Early detection greatly improves treatment outcomes.";
    } else {
      // Default response for other choices
      drSakuraResponse = "That's an excellent question. Let me provide you with specific, actionable information about that topic. Based on current medical guidelines and best practices, here's what you need to know...";
    }
    
    // Convert doctor's question to natural patient response
    const convertToPatientResponse = (doctorQuestion: string): string => {
      const question = doctorQuestion.toLowerCase();
      
      if (question.includes('guide you through monthly self-exams')) {
        return "Yes, please guide me through monthly self-exams.";
      } else if (question.includes('clinical exams')) {
        return "Yes, I'd like to know more about how healthcare providers perform clinical exams.";
      } else if (question.includes('mammogram screening')) {
        return "Yes, I want to know more about mammogram screening.";
      } else if (question.includes('risk factors')) {
        return "Yes, I'd like to understand my risk factors better.";
      } else if (question.includes('symptoms')) {
        return "Yes, please tell me what symptoms I should watch for.";
      } else if (question.includes('family history')) {
        return "Yes, I want to understand how family history affects my risk.";
      } else if (question.includes('diet') || question.includes('lifestyle')) {
        return "Yes, I'm interested in lifestyle changes that can help.";
      } else if (question.includes('when to see') || question.includes('doctor')) {
        return "Yes, I want to know when I should see a doctor.";
      } else if (question.startsWith('do you want')) {
        // Generic "do you want" -> "Yes, I would like..."
        const topic = question.replace('do you want me to', '').replace('do you want to', '').trim();
        return `Yes, I would like ${topic}.`;
      } else if (question.startsWith('would you like')) {
        // "would you like" -> "Yes, I would like..."
        const topic = question.replace('would you like me to', '').replace('would you like to', '').trim();
        return `Yes, I would like ${topic}.`;
      } else {
        // Fallback: convert question to affirmative response
        return `Yes, ${choice.toLowerCase().replace(/\?$/, '').replace(/^(do you want|would you like) (me to )?/, 'I would like ')}.`;
      }
    };

    // Add patient's choice as a message with natural response
    const choiceMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 1}`,
      role: 'customer',
      content: convertToPatientResponse(choice),
      timestamp: new Date().toISOString(),
      emotion: 'curious',
      is_choice_selection: true
    };
    
    // Add Dr. Sakura's response (choice responses should not have multiple choice options)
    const responseMessage = {
      id: `msg_${Date.now()}_${session.messages.length + 2}`,
      role: 'avatar',
      content: drSakuraResponse,
      timestamp: new Date().toISOString(),
      quality_score: Math.floor(Math.random() * 10) + 90,
      multiple_choice_options: [] // Choice responses don't get additional choices
    };
    
    session.messages.push(choiceMessage, responseMessage);
    
    res.json({
      success: true,
      session: session,
      message: "Choice processed successfully"
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment feedback endpoint for immediate learning
router.post('/sessions/:sessionId/comment', (req, res) => {
  try {
    const { sessionId } = req.params;
    const { messageId, comment, rating } = req.body;
    
    const session = trainingSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Find the message that was commented on
    const messageIndex = session.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const commentedMessage = session.messages[messageIndex];
    
    // Generate Dr. Sakura's improved response based on user feedback
    let improvedResponse = "";
    
    if (comment.toLowerCase().includes('vague') || comment.toLowerCase().includes('general')) {
      improvedResponse = "You're absolutely right - let me be more specific. For breast self-exams: Do them monthly, 3-7 days after your period. Feel for lumps using flat fingertips in circular motions. Look for hard, immobile masses (like marbles), skin dimpling, nipple discharge, or size changes. Schedule mammograms annually starting at age 40 if high-risk, age 50 if average risk. Any concerning findings should be evaluated within 1-2 weeks.";
    } else if (comment.toLowerCase().includes('timeline') || comment.toLowerCase().includes('when')) {
      improvedResponse = "Here's the exact schedule: Ages 20-39: Monthly self-exams, clinical breast exam every 1-3 years. Ages 40-49: Annual mammograms (high risk) or every 2 years (average risk), annual clinical exams, monthly self-exams. Ages 50+: Annual mammograms and clinical exams, monthly self-exams. If you find anything concerning, see your doctor within 2 weeks maximum.";
    } else if (comment.toLowerCase().includes('process') || comment.toLowerCase().includes('what happens')) {
      improvedResponse = "Here's exactly what happens during a mammogram: 1) You undress from waist up, wear a hospital gown opening in front. 2) Technologist positions your breast on a clear plastic plate. 3) A paddle compresses your breast for 10-15 seconds while X-ray is taken. 4) Two views per breast: top-to-bottom and side-to-side. 5) Total time: 20 minutes. 6) Results available in 48-72 hours. Pain level: 2-7/10, brief pressure only during compression.";
    } else if (comment.toLowerCase().includes('specific') || comment.toLowerCase().includes('concrete')) {
      improvedResponse = "Let me give you concrete numbers: 1 in 8 women develop breast cancer. 85% have no family history. Mammograms reduce death rates by 20-40%. For self-exams, normal tissue feels like small peas or gravel. Concerning lumps feel like hard marbles, don't move when pushed, have irregular edges. Any lump larger than a pea that persists through one menstrual cycle needs medical evaluation within 2 weeks.";
    } else if (comment.toLowerCase().includes('better') || comment.toLowerCase().includes('improve')) {
      improvedResponse = "Thank you for that feedback - you're helping me provide better care. Based on your concern, here's what I recommend: Start with monthly self-exams using the systematic approach (lying down, arm behind head, use flat fingertips in small circles). Schedule your first mammogram based on your risk level and family history. If you're unsure about timing, a clinical breast exam with your doctor can help determine the best screening schedule for your specific situation.";
    } else {
      // Default improved response for any feedback
      improvedResponse = "I appreciate your feedback - it helps me provide better guidance. Let me be more direct: Breast health screening involves three components working together: 1) Monthly self-exams to know your normal, 2) Clinical exams by healthcare providers for professional assessment, 3) Mammograms for early detection before lumps are felt. The key is consistency and knowing when each component should start based on your age and risk factors.";
    }
    
    // Create improved response message
    const improvedMessage = {
      id: `msg_${Date.now()}_improved`,
      role: 'avatar',
      content: improvedResponse,
      timestamp: new Date().toISOString(),
      quality_score: Math.min(100, (commentedMessage.quality_score || 80) + 10),
      improved_from_feedback: true,
      original_message_id: messageId,
      user_comment: comment,
      user_rating: rating
    };
    
    // Update the original message with improved response fields (inline display)
    // Remove multiple choice options when user provides feedback
    session.messages[messageIndex] = {
      ...commentedMessage,
      user_comment: comment,
      improved_response: improvedResponse,
      improved_quality_score: Math.min(100, (commentedMessage.quality_score || 80) + 10),
      improved_message_id: `msg_${Date.now()}_improved`,
      has_improved_response: true,
      multiple_choice_options: [] // Remove choices after feedback
    };
    
    // Store the learning for future responses
    if (!session.learned_responses) {
      session.learned_responses = [];
    }
    
    session.learned_responses.push({
      original_response: commentedMessage.content,
      user_feedback: comment,
      improved_response: improvedResponse,
      timestamp: new Date().toISOString(),
      context: 'user_feedback_training'
    });

    // Add to global knowledge base for persistent learning across all sessions
    const topicType = comment.toLowerCase().includes('vague') ? 'specific guidance' :
                     comment.toLowerCase().includes('timeline') ? 'timeline guidance' :
                     comment.toLowerCase().includes('process') ? 'process explanation' :
                     comment.toLowerCase().includes('specific') ? 'concrete details' :
                     'general improvement';

    // Store in global knowledge base
    drSakuraKnowledgeBase.improvedResponses.push({
      originalTopic: topicType,
      userFeedback: comment,
      improvedResponse: improvedResponse,
      timestamp: new Date().toISOString(),
      usage_count: 0
    });

    // Update learning stats
    drSakuraKnowledgeBase.learningStats.total_feedback_received++;
    drSakuraKnowledgeBase.learningStats.improvement_trends.push(topicType);
    drSakuraKnowledgeBase.learningStats.last_updated = new Date().toISOString();

    console.log(`📚 Dr. Sakura learned new response for: ${topicType} (Total learned: ${drSakuraKnowledgeBase.improvedResponses.length})`);
    
    // Update performance metrics to reflect improvement
    session.performance_metrics = {
      response_quality: Math.min(100, (session.performance_metrics?.response_quality || 80) + 5),
      customer_satisfaction: Math.min(100, (session.performance_metrics?.customer_satisfaction || 75) + 8),
      goal_achievement: Math.min(100, (session.performance_metrics?.goal_achievement || 70) + 7),
      conversation_flow: Math.min(100, (session.performance_metrics?.conversation_flow || 80) + 3)
    };
    
    res.json({
      success: true,
      session: session,
      improved_message: {
        id: `msg_${Date.now()}_improved`,
        role: 'avatar',
        content: improvedResponse,
        timestamp: new Date().toISOString(),
        quality_score: Math.min(100, (commentedMessage.quality_score || 80) + 10),
        improved_from_feedback: true,
        original_message_id: messageId,
        user_comment: comment,
        user_rating: rating
      },
      message: 'Dr. Sakura has provided an improved response based on your feedback'
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

// Get Dr. Sakura's learning progress endpoint
router.get('/learning-progress', (req, res) => {
  try {
    res.json({
      success: true,
      knowledgeBase: drSakuraKnowledgeBase,
      summary: {
        total_learned_responses: drSakuraKnowledgeBase.improvedResponses.length,
        most_common_improvements: drSakuraKnowledgeBase.learningStats.improvement_trends.slice(-5),
        learning_active: drSakuraKnowledgeBase.improvedResponses.length > 0
      }
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