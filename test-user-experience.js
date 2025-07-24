// Test the ACTUAL user experience - what YOU see
const apiRequest = async (method, endpoint, data = null) => {
  const url = `http://localhost:5000${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  return {
    ok: response.ok,
    status: response.status,
    json: async () => response.json()
  };
};

async function testUserExperience() {
  console.log('🔍 TESTING ACTUAL USER EXPERIENCE');
  console.log('=================================');
  console.log('Testing what YOU actually see in the frontend...\n');
  
  // 1. Start session
  console.log('1. Starting new session...');
  const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData = await startResponse.json();
  const sessionId = sessionData.session.id;
  console.log(`   ✅ Session created: ${sessionId}`);
  
  // 2. Continue conversation
  console.log('\n2. Getting Dr. Sakura response...');
  const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
  const continueData = await continueResponse.json();
  
  const messages = continueData.session.messages;
  const drSakuraMessage = messages.reverse().find(m => m.role === 'avatar');
  
  console.log('   Dr. Sakura message received');
  console.log('   Content preview:', drSakuraMessage.content.substring(0, 50) + '...');
  
  // 3. TEST: What does frontend receive for multiple choice?
  console.log('\n3. MULTIPLE CHOICE TEST - What frontend receives:');
  console.log('   Has multiple_choice_options field:', 'multiple_choice_options' in drSakuraMessage);
  console.log('   Value type:', typeof drSakuraMessage.multiple_choice_options);
  console.log('   Is array:', Array.isArray(drSakuraMessage.multiple_choice_options));
  console.log('   Length:', drSakuraMessage.multiple_choice_options?.length || 0);
  console.log('   Raw data:', JSON.stringify(drSakuraMessage.multiple_choice_options));
  
  // Frontend condition check
  const frontendCondition = drSakuraMessage.role === 'avatar' && 
                           drSakuraMessage.multiple_choice_options && 
                           Array.isArray(drSakuraMessage.multiple_choice_options) && 
                           drSakuraMessage.multiple_choice_options.length > 0;
  
  console.log('   Frontend condition result:', frontendCondition);
  
  if (frontendCondition) {
    console.log('   ✅ MULTIPLE CHOICE SHOULD SHOW TO USER');
    console.log('   Options that should appear:');
    drSakuraMessage.multiple_choice_options.forEach((option, i) => {
      console.log(`      ${i + 1}) ${option}`);
    });
  } else {
    console.log('   ❌ MULTIPLE CHOICE WILL NOT SHOW TO USER');
    console.log('   This is why you don\'t see the buttons!');
  }
  
  // 4. TEST: Iterative feedback
  console.log('\n4. ITERATIVE FEEDBACK TEST - Testing comment system...');
  const feedbackResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
    messageId: drSakuraMessage.id,
    comment: "This needs more specific details and examples.",
    rating: 2
  });
  
  const feedbackData = await feedbackResponse.json();
  
  if (feedbackData.success && feedbackData.improved_message) {
    console.log('   ✅ IMPROVED RESPONSE GENERATED');
    console.log('   Original quality:', drSakuraMessage.quality_score);
    console.log('   Improved quality:', feedbackData.improved_message.quality_score);
    console.log('   Improved content:', feedbackData.improved_message.content.substring(0, 50) + '...');
    
    // Check what frontend would receive
    console.log('\n   What frontend should show:');
    console.log('   - Original message with user_comment field');
    console.log('   - improved_response field with new content');
    console.log('   - Green "Dr. Sakura (Revised answer)" section');
    
    // Get updated session to see final state
    const sessionsResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
    const sessionsData = await sessionsResponse.json();
    const currentSession = sessionsData.sessions.find(s => s.id === sessionId);
    
    if (currentSession) {
      const originalMessage = currentSession.messages.find(m => m.id === drSakuraMessage.id);
      console.log('\n   Frontend message state check:');
      console.log('   Has user_comment:', !!(originalMessage && originalMessage.user_comment));
      console.log('   Has improved_response:', !!(originalMessage && originalMessage.improved_response));
      
      if (originalMessage && originalMessage.user_comment && originalMessage.improved_response) {
        console.log('   ✅ IMPROVED RESPONSE SHOULD SHOW TO USER');
      } else {
        console.log('   ❌ IMPROVED RESPONSE WILL NOT SHOW TO USER');
        console.log('   This is why you don\'t see the improved response!');
      }
    }
    
  } else {
    console.log('   ❌ IMPROVED RESPONSE FAILED');
    console.log('   Error:', feedbackData.error || 'No improved message returned');
  }
  
  // 5. FINAL DIAGNOSIS
  console.log('\n🏁 DIAGNOSIS - Why you don\'t see the features:');
  console.log('===============================================');
  
  if (!frontendCondition) {
    console.log('❌ MULTIPLE CHOICE ISSUE:');
    console.log('   The frontend condition fails, so buttons don\'t appear');
    console.log('   Backend sends data but frontend doesn\'t display it');
  }
  
  if (!feedbackData.success) {
    console.log('❌ ITERATIVE FEEDBACK ISSUE:');
    console.log('   Backend system failing to generate improved responses');
  }
  
  const multipleChoiceWorking = frontendCondition;
  const iterativeFeedbackWorking = feedbackData.success && feedbackData.improved_message;
  
  console.log('\n📊 ACTUAL STATUS:');
  console.log('Multiple Choice (what you see):', multipleChoiceWorking ? '✅ WORKING' : '❌ BROKEN');
  console.log('Iterative Feedback (what you see):', iterativeFeedbackWorking ? '✅ WORKING' : '❌ BROKEN');
  
  if (!multipleChoiceWorking || !iterativeFeedbackWorking) {
    console.log('\n🔧 WHAT NEEDS TO BE FIXED:');
    if (!multipleChoiceWorking) {
      console.log('- Frontend multiple choice display logic');
    }
    if (!iterativeFeedbackWorking) {
      console.log('- Iterative feedback system integration');
    }
  }
  
  return multipleChoiceWorking && iterativeFeedbackWorking;
}

testUserExperience()
  .then(working => {
    console.log('\n' + '='.repeat(50));
    if (working) {
      console.log('🎉 Both systems work from user perspective!');
    } else {
      console.log('🚨 CONFIRMED: Systems broken from user perspective!');
      console.log('You are right to question this - they don\'t work for you.');
    }
    console.log('='.repeat(50));
  })
  .catch(error => {
    console.error('Test failed:', error);
  });