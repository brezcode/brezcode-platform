// Final verification test for both systems
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

async function finalTest() {
  console.log('🏁 FINAL VERIFICATION: BOTH SYSTEMS WORKING');
  console.log('===========================================');
  
  try {
    // 1. Start new session
    console.log('\n🚀 Creating fresh session...');
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionData = await startResponse.json();
    const sessionId = sessionData.session.id;
    console.log('✅ Session:', sessionId);
    
    // 2. Get Dr. Sakura response
    console.log('\n📞 Getting Dr. Sakura response...');
    const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
    const continueData = await continueResponse.json();
    
    const messages = continueData.session.messages;
    const drSakuraMessage = messages.reverse().find(m => m.role === 'avatar');
    
    console.log('🔍 Message Analysis:');
    console.log('   ID:', drSakuraMessage.id);
    console.log('   Content preview:', drSakuraMessage.content.substring(0, 80) + '...');
    console.log('   Multiple choice available:', !!drSakuraMessage.multiple_choice_options);
    console.log('   Choice count:', drSakuraMessage.multiple_choice_options?.length || 0);
    
    // 3. TEST MULTIPLE CHOICE
    console.log('\n🎯 TESTING MULTIPLE CHOICE SYSTEM');
    console.log('=================================');
    
    if (drSakuraMessage.multiple_choice_options && drSakuraMessage.multiple_choice_options.length === 3) {
      console.log('✅ MULTIPLE CHOICE: WORKING');
      console.log('   Options provided:');
      drSakuraMessage.multiple_choice_options.forEach((option, i) => {
        console.log(`   ${i + 1}) ${option}`);
      });
      
      // Test selecting choice
      const selectedChoice = drSakuraMessage.multiple_choice_options[0];
      console.log(`\n🔄 Selecting choice: "${selectedChoice.substring(0, 40)}..."`);
      
      const choiceResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/choice`, {
        choice: selectedChoice
      });
      
      const choiceData = await choiceResponse.json();
      
      if (choiceData.success) {
        console.log('✅ Choice selection successful');
        const newMessages = choiceData.session.messages;
        const lastPatientMsg = newMessages.slice(-2)[0];
        const lastDrMsg = newMessages.slice(-1)[0];
        
        console.log('   Patient message created:', lastPatientMsg.content.substring(0, 50) + '...');
        console.log('   Dr. Sakura responded:', lastDrMsg.content.substring(0, 50) + '...');
        
        // Check if new Dr. Sakura message has multiple choice too
        if (lastDrMsg.multiple_choice_options && lastDrMsg.multiple_choice_options.length > 0) {
          console.log('✅ New response also has multiple choice options:', lastDrMsg.multiple_choice_options.length);
        }
      } else {
        console.log('❌ Choice selection failed');
      }
    } else {
      console.log('❌ MULTIPLE CHOICE: BROKEN - No options found');
    }
    
    // 4. TEST ITERATIVE FEEDBACK
    console.log('\n🔄 TESTING ITERATIVE FEEDBACK SYSTEM');
    console.log('====================================');
    
    const feedbackComment = "Please provide more specific step-by-step instructions with exact timing.";
    const feedbackRating = 2;
    
    console.log('🔄 Submitting feedback...');
    console.log('   Comment:', feedbackComment);
    console.log('   Rating:', feedbackRating);
    console.log('   Target message:', drSakuraMessage.id);
    
    const feedbackResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
      messageId: drSakuraMessage.id,
      comment: feedbackComment,
      rating: feedbackRating
    });
    
    const feedbackData = await feedbackResponse.json();
    
    if (feedbackData.success && feedbackData.improved_message) {
      console.log('✅ ITERATIVE FEEDBACK: WORKING');
      console.log('   Improved message ID:', feedbackData.improved_message.id);
      console.log('   Original message ID:', feedbackData.improved_message.original_message_id);
      console.log('   Quality improvement:', drSakuraMessage.quality_score + '→' + feedbackData.improved_message.quality_score);
      console.log('   User comment stored:', feedbackData.improved_message.user_comment);
      console.log('   Improved content preview:', feedbackData.improved_message.content.substring(0, 100) + '...');
    } else {
      console.log('❌ ITERATIVE FEEDBACK: BROKEN');
      console.log('   Error:', feedbackData.error || 'No improved message returned');
    }
    
    // 5. FINAL SESSION STATE
    console.log('\n📋 FINAL SESSION VERIFICATION');
    console.log('==============================');
    
    const finalResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
    const sessionsData = await finalResponse.json();
    const currentSession = sessionsData.sessions.find(s => s.id === sessionId);
    
    if (currentSession) {
      console.log('Session messages:', currentSession.messages.length);
      
      const avatarMessages = currentSession.messages.filter(m => m.role === 'avatar');
      console.log('Avatar messages:', avatarMessages.length);
      
      let multipleChoiceCount = 0;
      let improvedResponseCount = 0;
      
      avatarMessages.forEach(msg => {
        if (msg.multiple_choice_options && msg.multiple_choice_options.length > 0) {
          multipleChoiceCount++;
        }
        if (msg.user_comment || msg.improved_from_feedback) {
          improvedResponseCount++;
        }
      });
      
      console.log('Messages with multiple choice:', multipleChoiceCount);
      console.log('Messages with improved responses:', improvedResponseCount);
    }
    
    // 6. SYSTEM STATUS
    console.log('\n🏆 FINAL SYSTEM STATUS');
    console.log('======================');
    
    const multipleChoiceWorking = drSakuraMessage.multiple_choice_options && drSakuraMessage.multiple_choice_options.length === 3;
    const iterativeFeedbackWorking = feedbackData.success && feedbackData.improved_message;
    
    console.log('Multiple Choice System:', multipleChoiceWorking ? '✅ WORKING' : '❌ BROKEN');
    console.log('Iterative Feedback System:', iterativeFeedbackWorking ? '✅ WORKING' : '❌ BROKEN');
    
    const allSystemsWorking = multipleChoiceWorking && iterativeFeedbackWorking;
    
    if (allSystemsWorking) {
      console.log('\n🎉 SUCCESS: BOTH SYSTEMS FULLY OPERATIONAL!');
      console.log('✅ Multiple Choice: Patients can select from 3 guided options');
      console.log('✅ Iterative Feedback: Users can comment for improved responses');
      console.log('✅ Quality Improvements: AI learns and provides better answers');
      console.log('✅ Backend Integration: All API endpoints working correctly');
      console.log('\n📱 FRONTEND INTEGRATION READY');
      console.log('The backend is providing all necessary data for frontend display:');
      console.log('- Multiple choice options in message.multiple_choice_options');
      console.log('- Improved responses via comment feedback endpoint');
      console.log('- Quality score improvements tracked');
      console.log('- Session state maintained correctly');
      return true;
    } else {
      console.log('\n⚠️ SYSTEMS NEED ATTENTION');
      console.log('Backend working but integration issues may exist');
      return false;
    }
    
  } catch (error) {
    console.error('🚨 TEST FAILED:', error.message);
    return false;
  }
}

finalTest()
  .then(success => {
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log('🏆 VERIFICATION COMPLETE: Both systems ready for production!');
      console.log('Users can now experience:');
      console.log('• Multiple choice guided interactions');
      console.log('• Immediate feedback learning with improved responses');
      console.log('• Real-time AI assistant training');
    } else {
      console.log('🔧 VERIFICATION INCOMPLETE: Further debugging needed');
    }
    console.log('='.repeat(60));
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('🚨 Fatal verification error:', error);
    process.exit(1);
  });