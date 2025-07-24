// Test the natural patient response conversion

async function testNaturalResponses() {
  console.log('🗣️ TESTING NATURAL PATIENT RESPONSES');
  console.log('===================================');
  
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

  try {
    // 1. Start session
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionId = startResponse.session.id;
    console.log(`Started session: ${sessionId}`);
    
    // 2. Continue to get multiple choice options
    const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
    const session = continueResponse.session;
    
    // Find Dr. Sakura's response with multiple choice options
    const drSakuraMessage = [...session.messages].reverse().find(m => 
      m.role === 'avatar' && m.multiple_choice_options && m.multiple_choice_options.length > 0
    );
    
    if (!drSakuraMessage) {
      console.log('❌ No multiple choice options found');
      return;
    }
    
    console.log('\n📋 DR. SAKURA\'S MULTIPLE CHOICE OPTIONS:');
    drSakuraMessage.multiple_choice_options.forEach((option, i) => {
      console.log(`${i + 1}. ${option}`);
    });
    
    // 3. Test each choice conversion
    console.log('\n🗣️ TESTING PATIENT RESPONSE CONVERSION:');
    console.log('(Doctor Question → Natural Patient Response)');
    console.log('------------------------------------------------');
    
    for (let i = 0; i < drSakuraMessage.multiple_choice_options.length; i++) {
      const choice = drSakuraMessage.multiple_choice_options[i];
      
      // Make choice selection to see the converted response
      const choiceResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/choice`, {
        choice: choice
      });
      
      if (choiceResponse.success) {
        // Find the patient's converted response
        const updatedSession = choiceResponse.session;
        const patientMessage = [...updatedSession.messages].reverse().find(m => 
          m.role === 'customer' && m.is_choice_selection
        );
        
        console.log(`\nChoice ${i + 1}:`);
        console.log(`Doctor: "${choice}"`);
        console.log(`Patient: "${patientMessage.content}"`);
        
        // Check if response is natural (doesn't repeat the question)
        const isNatural = !patientMessage.content.toLowerCase().includes('do you want') && 
                         !patientMessage.content.toLowerCase().includes('would you like') &&
                         patientMessage.content.toLowerCase().includes('yes');
        
        console.log(`Natural: ${isNatural ? '✅ YES' : '❌ NO'}`);
      }
      
      // Start new session for next test to avoid interference
      if (i < drSakuraMessage.multiple_choice_options.length - 1) {
        const newStartResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
          avatarId: 'brezcode_health_coach',
          scenarioId: 'breast_health_anxiety',
          businessContext: 'brezcode'
        });
        
        const newSessionId = newStartResponse.session.id;
        await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
      }
    }
    
    console.log('\n🎯 NATURAL RESPONSE TEST COMPLETE');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testNaturalResponses();