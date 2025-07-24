// Comprehensive test for BOTH iterative feedback AND multiple choice systems
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

async function testBothSystems() {
  console.log('🔧 COMPREHENSIVE TEST: ITERATIVE FEEDBACK + MULTIPLE CHOICE SYSTEMS');
  console.log('===================================================================');
  
  try {
    // 1. Start training session
    console.log('\n🚀 STEP 1: Starting fresh training session...');
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionData = await startResponse.json();
    const sessionId = sessionData.session.id;
    console.log('✅ Session created:', sessionId);
    
    // 2. Get Dr. Sakura's response with multiple choice
    console.log('\n📞 STEP 2: Getting Dr. Sakura response...');
    const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
    const continueData = await continueResponse.json();
    
    const messages = continueData.session.messages;
    const drSakuraMessage = messages.reverse().find(m => m.role === 'avatar');
    
    console.log('🔍 Dr. Sakura Message Analysis:');
    console.log('   Message ID:', drSakuraMessage.id);
    console.log('   Role:', drSakuraMessage.role);
    console.log('   Content length:', drSakuraMessage.content.length);
    console.log('   Has multiple_choice_options field:', 'multiple_choice_options' in drSakuraMessage);
    console.log('   Multiple choice options:', drSakuraMessage.multiple_choice_options);
    console.log('   Quality score:', drSakuraMessage.quality_score);
    
    // TEST 1: Multiple Choice System
    console.log('\n🎯 TEST 1: MULTIPLE CHOICE SYSTEM');
    console.log('================================');
    
    if (drSakuraMessage.multiple_choice_options && drSakuraMessage.multiple_choice_options.length > 0) {
      console.log('✅ Multiple choice options found:');
      drSakuraMessage.multiple_choice_options.forEach((option, index) => {
        console.log(`   ${index + 1}) ${option}`);
      });
      
      // Test selecting first choice
      const selectedChoice = drSakuraMessage.multiple_choice_options[0];
      console.log('\n🔄 Testing choice selection:', selectedChoice.substring(0, 50) + '...');
      
      const choiceResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/choice`, {
        choice: selectedChoice
      });
      
      const choiceData = await choiceResponse.json();
      
      if (choiceData.success) {
        console.log('✅ Choice selection successful');
        const newMessages = choiceData.session.messages;
        const lastTwo = newMessages.slice(-2);
        console.log('   Patient choice message added:', lastTwo[0]?.content.substring(0, 50) + '...');
        console.log('   Dr. Sakura response:', lastTwo[1]?.content.substring(0, 50) + '...');
      } else {
        console.log('❌ Choice selection failed:', choiceData.error);
      }
    } else {
      console.log('❌ MULTIPLE CHOICE SYSTEM BROKEN - No options found');
      console.log('   Expected: array of 3 strings');
      console.log('   Actual:', drSakuraMessage.multiple_choice_options);
    }
    
    // TEST 2: Iterative Feedback System
    console.log('\n🔄 TEST 2: ITERATIVE FEEDBACK SYSTEM');
    console.log('====================================');
    
    const testComment = "This response is too general. Please provide specific steps and concrete examples.";
    const testRating = 2;
    
    console.log('🔄 Submitting feedback comment...');
    console.log('   Comment:', testComment);
    console.log('   Rating:', testRating);
    console.log('   Target message ID:', drSakuraMessage.id);
    
    const feedbackResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
      messageId: drSakuraMessage.id,
      comment: testComment,
      rating: testRating
    });
    
    const feedbackData = await feedbackResponse.json();
    
    console.log('\n🔍 Feedback Response Analysis:');
    console.log('   Response OK:', feedbackResponse.ok);
    console.log('   Success:', feedbackData.success);
    console.log('   Has improved_message:', !!feedbackData.improved_message);
    
    if (feedbackData.success && feedbackData.improved_message) {
      console.log('✅ ITERATIVE FEEDBACK WORKING');
      const improved = feedbackData.improved_message;
      console.log('   Improved Message ID:', improved.id);
      console.log('   Original Message ID:', improved.original_message_id);
      console.log('   User Comment:', improved.user_comment);
      console.log('   Quality improvement:', drSakuraMessage.quality_score + '→' + improved.quality_score);
      console.log('   Improved content preview:', improved.content.substring(0, 100) + '...');
      
      // Test iterative feedback on improved response
      console.log('\n🔄 Testing second-level feedback...');
      const secondComment = "Better, but still needs more empathy and emotional support language.";
      
      const secondFeedbackResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
        messageId: improved.id,
        comment: secondComment,
        rating: 3
      });
      
      const secondFeedbackData = await secondFeedbackResponse.json();
      
      if (secondFeedbackData.success && secondFeedbackData.improved_message) {
        console.log('✅ MULTI-LEVEL ITERATIVE FEEDBACK WORKING');
        console.log('   Second improvement quality:', improved.quality_score + '→' + secondFeedbackData.improved_message.quality_score);
      } else {
        console.log('❌ Second-level feedback failed');
      }
      
    } else {
      console.log('❌ ITERATIVE FEEDBACK SYSTEM BROKEN');
      console.log('   Error:', feedbackData.error || 'No improved_message returned');
    }
    
    // TEST 3: Frontend Integration Test
    console.log('\n🖥️ TEST 3: FRONTEND INTEGRATION SIMULATION');
    console.log('==========================================');
    
    // Get final session state
    const finalResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
    const sessionsData = await finalResponse.json();
    const currentSession = sessionsData.sessions.find(s => s.id === sessionId);
    
    if (currentSession) {
      console.log('📋 Final Session State:');
      console.log('   Total messages:', currentSession.messages.length);
      
      const avatarMessages = currentSession.messages.filter(m => m.role === 'avatar');
      console.log('   Avatar messages:', avatarMessages.length);
      
      avatarMessages.forEach((msg, index) => {
        console.log(`\n   Avatar Message ${index + 1}:`);
        console.log('     ID:', msg.id);
        console.log('     Has multiple choice:', !!msg.multiple_choice_options);
        console.log('     Choice count:', msg.multiple_choice_options?.length || 0);
        console.log('     Has user comment:', !!(msg.user_comment));
        console.log('     Has improved response:', !!(msg.improved_response));
      });
    }
    
    // FINAL VERIFICATION
    console.log('\n🏁 FINAL SYSTEM VERIFICATION');
    console.log('============================');
    
    let multipleChoiceWorking = false;
    let iterativeFeedbackWorking = false;
    
    // Check if multiple choice is working
    const latestAvatarMsg = messages.filter(m => m.role === 'avatar').pop();
    if (latestAvatarMsg && latestAvatarMsg.multiple_choice_options && latestAvatarMsg.multiple_choice_options.length === 3) {
      multipleChoiceWorking = true;
      console.log('✅ Multiple Choice System: WORKING');
    } else {
      console.log('❌ Multiple Choice System: BROKEN');
    }
    
    // Check if iterative feedback is working
    if (feedbackData.success && feedbackData.improved_message) {
      iterativeFeedbackWorking = true;
      console.log('✅ Iterative Feedback System: WORKING');
    } else {
      console.log('❌ Iterative Feedback System: BROKEN');
    }
    
    const overallSuccess = multipleChoiceWorking && iterativeFeedbackWorking;
    
    console.log('\n🎯 FINAL RESULTS:');
    console.log('=================');
    console.log('Multiple Choice System:', multipleChoiceWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('Iterative Feedback System:', iterativeFeedbackWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('Overall Status:', overallSuccess ? '🎉 BOTH SYSTEMS OPERATIONAL' : '⚠️ SYSTEMS NEED FIXES');
    
    return overallSuccess;
    
  } catch (error) {
    console.error('🚨 COMPREHENSIVE TEST FAILED:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

testBothSystems()
  .then(success => {
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('🏆 SUCCESS: Both systems are fully operational!');
    } else {
      console.log('🔧 FAILURE: Systems need debugging and fixes!');
    }
    console.log('='.repeat(60));
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('🚨 Fatal test error:', error);
    process.exit(1);
  });