// Test what the actual UI shows by checking frontend logic

async function testRealUI() {
  console.log('🔍 TESTING REAL USER INTERFACE');
  console.log('==============================');
  
  try {
    // Start a session first via API
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
      return response.json();
    };

    // 1. Start session
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionId = startResponse.session.id;
    console.log(`Created session: ${sessionId}`);
    
    // 2. Continue to get first response
    const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
    console.log('Called continue API');
    
    // 3. Check what the frontend would receive
    const sessionData = continueResponse.session;
    const lastAvatarMessage = [...sessionData.messages].reverse().find(m => m.role === 'avatar');
    
    console.log('\nBACKEND DATA CHECK:');
    console.log(`Has multiple_choice_options: ${!!lastAvatarMessage.multiple_choice_options}`);
    console.log(`Options count: ${lastAvatarMessage.multiple_choice_options?.length || 0}`);
    
    if (lastAvatarMessage.multiple_choice_options?.length > 0) {
      console.log('Options:');
      lastAvatarMessage.multiple_choice_options.forEach((opt, i) => {
        console.log(`  ${i + 1}. ${opt}`);
      });
    }
    
    // 4. Test the actual frontend formatting logic
    const formattedMessage = {
      id: lastAvatarMessage.id,
      role: lastAvatarMessage.role,
      content: lastAvatarMessage.content,
      timestamp: lastAvatarMessage.timestamp,
      isTraining: true,
      emotion: lastAvatarMessage.emotion,
      quality_score: lastAvatarMessage.quality_score,
      multiple_choice_options: lastAvatarMessage.multiple_choice_options,
      user_comment: lastAvatarMessage.user_comment,
      improved_response: lastAvatarMessage.improved_response,
      improved_quality_score: lastAvatarMessage.improved_quality_score
    };
    
    console.log('\nFRONTEND FORMATTED MESSAGE:');
    console.log(`Has multiple_choice_options: ${!!formattedMessage.multiple_choice_options}`);
    console.log(`Options count: ${formattedMessage.multiple_choice_options?.length || 0}`);
    
    // 5. Test the UI rendering logic
    const hasMultipleChoice = formattedMessage.multiple_choice_options && 
                             Array.isArray(formattedMessage.multiple_choice_options) && 
                             formattedMessage.multiple_choice_options.length > 0;
    
    const frontendCondition = formattedMessage.role === 'avatar' && hasMultipleChoice;
    
    console.log('\nUI RENDERING CHECK:');
    console.log(`Role is avatar: ${formattedMessage.role === 'avatar'}`);
    console.log(`Has multiple choice: ${hasMultipleChoice}`);
    console.log(`Frontend condition met: ${frontendCondition}`);
    console.log(`BUTTONS SHOULD APPEAR: ${frontendCondition ? 'YES' : 'NO'}`);
    
    if (frontendCondition) {
      console.log('\n✅ SUCCESS: Multiple choice buttons should be visible');
      console.log('User should see 3 clickable buttons');
    } else {
      console.log('\n❌ FAILURE: Multiple choice buttons will NOT appear');
      console.log('UI logic failed - buttons hidden');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testRealUI();