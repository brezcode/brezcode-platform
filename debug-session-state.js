// Check session state to understand message counts
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

async function debugSessionState() {
  console.log('🔍 DEBUGGING SESSION STATE');
  console.log('==========================');
  
  // 1. Start session
  const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData = await startResponse.json();
  const session = sessionData.session;
  
  console.log('INITIAL SESSION STATE:');
  console.log(`Total messages: ${session.messages.length}`);
  console.log(`Avatar messages: ${session.messages.filter(m => m.role === 'avatar').length}`);
  console.log(`Customer messages: ${session.messages.filter(m => m.role === 'customer').length}`);
  
  console.log('\nMESSAGE BREAKDOWN:');
  session.messages.forEach((msg, i) => {
    console.log(`${i + 1}. ${msg.role}: "${msg.content.substring(0, 50)}..."`);
  });
  
  // 2. First continue
  console.log('\n' + '='.repeat(50));
  console.log('AFTER FIRST CONTINUE:');
  
  const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${session.id}/continue`);
  const continueData = await continueResponse.json();
  const updatedSession = continueData.session;
  
  console.log(`Total messages: ${updatedSession.messages.length}`);
  console.log(`Avatar messages: ${updatedSession.messages.filter(m => m.role === 'avatar').length}`);
  console.log(`Customer messages: ${updatedSession.messages.filter(m => m.role === 'customer').length}`);
  
  console.log('\nMESSAGE BREAKDOWN:');
  updatedSession.messages.forEach((msg, i) => {
    const hasChoices = msg.multiple_choice_options && msg.multiple_choice_options.length > 0;
    console.log(`${i + 1}. ${msg.role}: "${msg.content.substring(0, 50)}..." [Choices: ${hasChoices ? msg.multiple_choice_options.length : 0}]`);
  });
  
  // Check what the last avatar message has
  const lastAvatar = [...updatedSession.messages].reverse().find(m => m.role === 'avatar');
  console.log(`\nLAST AVATAR MESSAGE ANALYSIS:`);
  console.log(`Role: ${lastAvatar.role}`);
  console.log(`Has choices: ${!!(lastAvatar.multiple_choice_options && lastAvatar.multiple_choice_options.length > 0)}`);
  console.log(`Choice count: ${lastAvatar.multiple_choice_options?.length || 0}`);
  
  // Show the logic calculation
  const avatarCount = updatedSession.messages.filter(m => m.role === 'avatar').length;
  console.log(`\nLOGIC CHECK:`);
  console.log(`Avatar count: ${avatarCount}`);
  console.log(`shouldShowChoices (avatarCount === 1): ${avatarCount === 1}`);
  console.log(`shouldShowChoices (avatarCount === 2): ${avatarCount === 2}`);
  console.log(`shouldShowChoices (avatarCount <= 1): ${avatarCount <= 1}`);
}

debugSessionState()
  .catch(error => {
    console.error('Debug failed:', error);
  });