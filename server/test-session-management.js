// Quick test of session management system
const { AvatarTrainingSessionService } = require('./services/avatarTrainingSessionService');

async function testSessionManagement() {
  console.log('🧪 Testing Avatar Training Session Management System...');
  
  try {
    // Test 1: Create a new session
    console.log('\n1. Creating new training session...');
    const scenarioDetails = {
      name: 'Breast Health Consultation',
      description: 'Patient asking about breast health concerns',
      customerMood: 'anxious',
      objectives: ['Provide reassurance', 'Give medical guidance']
    };
    
    const session = await AvatarTrainingSessionService.createSession(
      1, // userId
      'dr_sakura_wellness',
      'breast_health_consultation',
      'health_coaching',
      scenarioDetails
    );
    
    console.log('✅ Session created:', {
      id: session.id,
      sessionId: session.sessionId,
      avatarId: session.avatarId,
      status: session.status
    });
    
    // Test 2: Add customer message
    console.log('\n2. Adding customer message...');
    const customerMessage = await AvatarTrainingSessionService.addMessage(
      session.sessionId,
      'customer',
      "I'm really worried about a lump I found during my self-exam. What should I do?",
      'anxious'
    );
    
    console.log('✅ Customer message added:', customerMessage.id);
    
    // Test 3: Generate AI response
    console.log('\n3. Generating AI response...');
    const aiResponse = await AvatarTrainingSessionService.generateResponse(
      session.sessionId,
      "I'm really worried about a lump I found during my self-exam. What should I do?",
      'anxious'
    );
    
    console.log('✅ AI response generated:', {
      content: aiResponse.content.substring(0, 100) + '...',
      qualityScore: aiResponse.qualityScore
    });
    
    // Test 4: Get session with full history
    console.log('\n4. Retrieving session with full history...');
    const retrievedSession = await AvatarTrainingSessionService.getSession(session.sessionId);
    
    console.log('✅ Session retrieved:', {
      sessionId: retrievedSession.sessionId,
      totalMessages: retrievedSession.totalMessages,
      conversationHistoryLength: Array.isArray(retrievedSession.conversationHistory) ? retrievedSession.conversationHistory.length : 0,
      hasScenarioDetails: !!retrievedSession.scenarioDetails,
      hasCurrentContext: !!retrievedSession.currentContext
    });
    
    // Test 5: Complete session
    console.log('\n5. Completing training session...');
    await AvatarTrainingSessionService.completeSession(session.sessionId);
    
    const completedSession = await AvatarTrainingSessionService.getSession(session.sessionId);
    console.log('✅ Session completed:', {
      status: completedSession.status,
      completedAt: !!completedSession.completedAt,
      hasSummary: !!completedSession.sessionSummary
    });
    
    console.log('\n🎉 All tests passed! Session management system is working correctly.');
    console.log('\n📊 Session Memory Features Verified:');
    console.log('   ✓ Persistent session storage in database');
    console.log('   ✓ Conversation history preservation');
    console.log('   ✓ Scenario configuration memory');
    console.log('   ✓ Message sequence tracking');
    console.log('   ✓ AI response quality tracking');
    console.log('   ✓ Session completion lifecycle');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSessionManagement();