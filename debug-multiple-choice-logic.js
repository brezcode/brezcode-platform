// Debug why multiple choice logic isn't working as expected
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

async function debugMultipleChoiceLogic() {
  console.log('🔍 DEBUGGING MULTIPLE CHOICE LOGIC');
  console.log('==================================');
  
  // 1. Start session
  console.log('1. Starting session...');
  const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData = await startResponse.json();
  const sessionId = sessionData.session.id;
  console.log(`   Session ID: ${sessionId}`);
  console.log(`   Initial messages count: ${sessionData.session.messages.length}`);
  
  // 2. First continue - should have choices
  console.log('\n2. First continue call (should have choices)...');
  const continueResponse1 = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
  const continueData1 = await continueResponse1.json();
  
  const messages1 = continueData1.session.messages;
  const avatarCount1 = messages1.filter(m => m.role === 'avatar').length;
  const lastAvatar1 = messages1.reverse().find(m => m.role === 'avatar');
  
  console.log(`   Total messages: ${messages1.length}`);
  console.log(`   Avatar messages: ${avatarCount1}`);
  console.log(`   Last avatar has choices: ${!!(lastAvatar1 && lastAvatar1.multiple_choice_options && lastAvatar1.multiple_choice_options.length > 0)}`);
  console.log(`   Choice count: ${lastAvatar1?.multiple_choice_options?.length || 0}`);
  
  // 3. Second continue - should NOT have choices
  console.log('\n3. Second continue call (should NOT have choices)...');
  const continueResponse2 = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
  const continueData2 = await continueResponse2.json();
  
  const messages2 = continueData2.session.messages;
  const avatarCount2 = messages2.filter(m => m.role === 'avatar').length;
  const lastAvatar2 = [...messages2].reverse().find(m => m.role === 'avatar');
  
  console.log(`   Total messages: ${messages2.length}`);
  console.log(`   Avatar messages: ${avatarCount2}`);
  console.log(`   Last avatar has choices: ${!!(lastAvatar2 && lastAvatar2.multiple_choice_options && lastAvatar2.multiple_choice_options.length > 0)}`);
  console.log(`   Choice count: ${lastAvatar2?.multiple_choice_options?.length || 0}`);
  
  // 4. Test comment scenario
  console.log('\n4. Testing comment scenario...');
  
  // Start fresh session
  const startResponse3 = await apiRequest('POST', '/api/avatar-training/sessions/start', {
    avatarId: 'brezcode_health_coach',
    scenarioId: 'breast_health_anxiety',
    businessContext: 'brezcode'
  });
  
  const sessionData3 = await startResponse3.json();
  const sessionId3 = sessionData3.session.id;
  
  // Get first response with choices
  const continueResponse3 = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId3}/continue`);
  const continueData3 = await continueResponse3.json();
  
  const messages3 = continueData3.session.messages;
  const drSakuraMessage = [...messages3].reverse().find(m => m.role === 'avatar');
  
  console.log(`   Initial message choices: ${drSakuraMessage?.multiple_choice_options?.length || 0}`);
  
  // Add comment
  const commentResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId3}/comment`, {
    messageId: drSakuraMessage.id,
    comment: "This is too vague",
    rating: 2
  });
  
  // Check session after comment
  const sessionsResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
  const sessionsData = await sessionsResponse.json();
  const currentSession = sessionsData.sessions.find(s => s.id === sessionId3);
  
  if (currentSession) {
    const updatedMessage = currentSession.messages.find(m => m.id === drSakuraMessage.id);
    console.log(`   After comment - message has choices: ${!!(updatedMessage && updatedMessage.multiple_choice_options && updatedMessage.multiple_choice_options.length > 0)}`);
    console.log(`   After comment - choice count: ${updatedMessage?.multiple_choice_options?.length || 0}`);
    console.log(`   After comment - has user_comment: ${!!(updatedMessage && updatedMessage.user_comment)}`);
    console.log(`   After comment - has improved_response: ${!!(updatedMessage && updatedMessage.improved_response)}`);
  }
  
  console.log('\n🎯 ANALYSIS:');
  
  if (lastAvatar1?.multiple_choice_options?.length > 0) {
    console.log('✅ First response correctly has choices');
  } else {
    console.log('❌ First response missing choices');
  }
  
  if (lastAvatar2?.multiple_choice_options?.length === 0) {
    console.log('✅ Second response correctly has no choices');
  } else {
    console.log('❌ Second response still has choices when it shouldn\'t');
  }
  
  const commentMessage = currentSession?.messages.find(m => m.id === drSakuraMessage.id);
  if (commentMessage?.multiple_choice_options?.length === 0) {
    console.log('✅ Message with comment correctly has no choices');
  } else {
    console.log('❌ Message with comment still has choices when it shouldn\'t');
  }
}

debugMultipleChoiceLogic()
  .catch(error => {
    console.error('Debug failed:', error);
  });