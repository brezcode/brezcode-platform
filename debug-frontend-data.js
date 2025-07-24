// Debug what data the frontend actually receives
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

async function debugFrontendData() {
  console.log('🔍 DEBUGGING FRONTEND DATA FLOW');
  console.log('================================');
  
  // 1. Start session
  const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData = await startResponse.json();
  const sessionId = sessionData.session.id;
  
  console.log('INITIAL SESSION:');
  console.log(`Session ID: ${sessionId}`);
  console.log(`Total messages: ${sessionData.session.messages.length}`);
  
  // 2. Get first continue response
  const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
  const continueData = await continueResponse.json();
  
  console.log('\nAFTER CONTINUE:');
  console.log(`Total messages: ${continueData.session.messages.length}`);
  
  // 3. Find the last avatar message
  const lastAvatarMessage = [...continueData.session.messages].reverse().find(m => m.role === 'avatar');
  
  console.log('\nLAST AVATAR MESSAGE ANALYSIS:');
  console.log(`Message ID: ${lastAvatarMessage.id}`);
  console.log(`Role: ${lastAvatarMessage.role}`);
  console.log(`Content: ${lastAvatarMessage.content.substring(0, 100)}...`);
  console.log(`Has multiple_choice_options property: ${lastAvatarMessage.hasOwnProperty('multiple_choice_options')}`);
  console.log(`multiple_choice_options value: ${JSON.stringify(lastAvatarMessage.multiple_choice_options)}`);
  console.log(`Array check: ${Array.isArray(lastAvatarMessage.multiple_choice_options)}`);
  console.log(`Length: ${lastAvatarMessage.multiple_choice_options?.length || 'undefined'}`);
  
  // 4. Check frontend display logic
  const hasMultipleChoice = lastAvatarMessage.multiple_choice_options && 
                           Array.isArray(lastAvatarMessage.multiple_choice_options) && 
                           lastAvatarMessage.multiple_choice_options.length > 0;
  
  const frontendCondition = lastAvatarMessage.role === 'avatar' && hasMultipleChoice;
  
  console.log('\nFRONTEND DISPLAY LOGIC:');
  console.log(`hasMultipleChoice: ${hasMultipleChoice}`);
  console.log(`frontendCondition (role === 'avatar' && hasMultipleChoice): ${frontendCondition}`);
  console.log(`Should display buttons: ${frontendCondition}`);
  
  if (frontendCondition) {
    console.log('\n✅ MULTIPLE CHOICE BUTTONS SHOULD APPEAR');
    console.log('Options:');
    lastAvatarMessage.multiple_choice_options.forEach((option, i) => {
      console.log(`  ${i + 1}. ${option}`);
    });
  } else {
    console.log('\n❌ MULTIPLE CHOICE BUTTONS WILL NOT APPEAR');
    console.log('Troubleshooting:');
    console.log(`- Is avatar message? ${lastAvatarMessage.role === 'avatar'}`);
    console.log(`- Has options property? ${lastAvatarMessage.hasOwnProperty('multiple_choice_options')}`);
    console.log(`- Is array? ${Array.isArray(lastAvatarMessage.multiple_choice_options)}`);
    console.log(`- Has length > 0? ${(lastAvatarMessage.multiple_choice_options?.length || 0) > 0}`);
  }
}

debugFrontendData()
  .catch(error => {
    console.error('Debug failed:', error);
  });