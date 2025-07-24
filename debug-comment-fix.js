// Debug the comment system to see what's actually happening
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

async function debugCommentFix() {
  console.log('🔧 DEBUGGING COMMENT FIX');
  console.log('=======================');
  
  // 1. Start session
  console.log('1. Starting fresh session...');
  const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData = await startResponse.json();
  const sessionId = sessionData.session.id;
  console.log(`   Session: ${sessionId}`);
  
  // 2. Continue conversation to get Dr. Sakura response
  console.log('\n2. Getting Dr. Sakura response...');
  const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
  const continueData = await continueResponse.json();
  
  const messages = continueData.session.messages;
  const drSakuraMessage = messages.reverse().find(m => m.role === 'avatar');
  
  console.log(`   Message ID: ${drSakuraMessage.id}`);
  console.log(`   Content preview: ${drSakuraMessage.content.substring(0, 50)}...`);
  console.log(`   Has user_comment BEFORE: ${!!(drSakuraMessage.user_comment)}`);
  console.log(`   Has improved_response BEFORE: ${!!(drSakuraMessage.improved_response)}`);
  
  // 3. Add comment and check what happens
  console.log('\n3. Adding comment...');
  const commentResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
    messageId: drSakuraMessage.id,
    comment: "This needs more specific details.",
    rating: 2
  });
  
  const commentData = await commentResponse.json();
  console.log(`   Comment response success: ${commentData.success}`);
  console.log(`   Backend says improved message created: ${!!(commentData.improved_message)}`);
  
  if (commentData.improved_message) {
    console.log(`   Improved content: ${commentData.improved_message.content.substring(0, 50)}...`);
  }
  
  // 4. Get session again to see the actual state
  console.log('\n4. Checking updated session state...');
  const sessionsResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
  const sessionsData = await sessionsResponse.json();
  const currentSession = sessionsData.sessions.find(s => s.id === sessionId);
  
  if (currentSession) {
    const updatedMessage = currentSession.messages.find(m => m.id === drSakuraMessage.id);
    
    if (updatedMessage) {
      console.log('\n   UPDATED MESSAGE STATE:');
      console.log(`   Message ID: ${updatedMessage.id}`);
      console.log(`   Has user_comment: ${!!(updatedMessage.user_comment)}`);
      console.log(`   Has improved_response: ${!!(updatedMessage.improved_response)}`);
      console.log(`   Has has_improved_response: ${!!(updatedMessage.has_improved_response)}`);
      
      if (updatedMessage.user_comment) {
        console.log(`   ✅ User comment: "${updatedMessage.user_comment}"`);
      }
      
      if (updatedMessage.improved_response) {
        console.log(`   ✅ Improved response: "${updatedMessage.improved_response.substring(0, 50)}..."`);
      }
      
      if (!updatedMessage.user_comment || !updatedMessage.improved_response) {
        console.log('   ❌ BACKEND FIX FAILED - Fields not properly set');
        
        // Show full message object for debugging
        console.log('\n   FULL MESSAGE OBJECT:');
        console.log(JSON.stringify(updatedMessage, null, 2));
      } else {
        console.log('   ✅ BACKEND FIX WORKING - Message properly updated');
      }
    } else {
      console.log('   ❌ Message not found in updated session');
    }
  } else {
    console.log('   ❌ Session not found');
  }
  
  // 5. Test frontend condition
  if (currentSession) {
    const updatedMessage = currentSession.messages.find(m => m.id === drSakuraMessage.id);
    if (updatedMessage) {
      const frontendCondition = updatedMessage.user_comment && updatedMessage.improved_response;
      console.log(`\n5. FRONTEND CONDITION TEST: ${frontendCondition ? '✅ PASS' : '❌ FAIL'}`);
      
      if (frontendCondition) {
        console.log('   The improved response SHOULD show to user');
      } else {
        console.log('   The improved response WILL NOT show to user');
        console.log('   This is the root cause of your issue!');
      }
    }
  }
}

debugCommentFix()
  .then(() => {
    console.log('\n' + '='.repeat(50));
    console.log('🎯 Debug complete - now we know exactly what\'s wrong');
    console.log('='.repeat(50));
  })
  .catch(error => {
    console.error('Debug failed:', error);
  });