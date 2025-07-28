const BASE_URL = 'http://localhost:5000';

async function testBasicFunctionality() {
  console.log('🔬 SIMPLE AI TRAINING SYSTEM TEST');
  console.log('====================================');
  
  try {
    // Test 1: Test scenarios endpoint
    console.log('1. Testing scenarios endpoint...');
    const scenariosResponse = await fetch(`${BASE_URL}/api/avatar-training/scenarios`);
    const scenariosData = await scenariosResponse.json();
    
    if (scenariosData.scenarios && scenariosData.scenarios.length > 0) {
      console.log('✅ Scenarios loaded:', scenariosData.scenarios.length, 'scenarios');
      console.log('   Sample scenario:', scenariosData.scenarios[0].name);
    } else {
      console.log('❌ No scenarios found');
      return;
    }
    
    // Test 2: Test session creation  
    console.log('\n2. Testing session creation...');
    const sessionResponse = await fetch(`${BASE_URL}/api/avatar-training/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avatarType: 'dr_sakura',
        scenarioId: 'mammo_anxiety',
        businessContext: 'health_coaching',
        userId: 1
      })
    });
    
    const sessionData = await sessionResponse.json();
    if (sessionData.session && sessionData.session.sessionId) {
      console.log('✅ Session created:', sessionData.session.sessionId);
      console.log('   Avatar type:', sessionData.session.avatarType);
      
      const sessionId = sessionData.session.sessionId;
      
      // Test 3: Test manual message
      console.log('\n3. Testing manual message...');
      const messageResponse = await fetch(`${BASE_URL}/api/avatar-training/sessions/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "I'm worried about my upcoming mammogram. Can you help?",
          role: 'customer'
        })
      });
      
      const messageData = await messageResponse.json();
      if (messageData.response) {
        console.log('✅ Manual message processed');
        console.log('   Response preview:', messageData.response.substring(0, 80) + '...');
        console.log('   Quality score:', messageData.quality_score);
      } else {
        console.log('❌ Manual message failed:', messageData.error);
      }
      
      // Test 4: Test AI continue
      console.log('\n4. Testing AI continue conversation...');
      const continueResponse = await fetch(`${BASE_URL}/api/avatar-training/sessions/${sessionId}/continue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerMessage: 'auto'
        })
      });
      
      const continueData = await continueResponse.json();
      if (continueData.session && continueData.session.messages) {
        console.log('✅ AI continue processed');
        const messages = continueData.session.messages;
        console.log('   Total messages in session:', messages.length);
        
        if (messages.length > 0) {
          const lastMessage = messages[messages.length - 1];
          console.log('   Last message role:', lastMessage.role);
          console.log('   Last message preview:', lastMessage.content.substring(0, 60) + '...');
        }
      } else {
        console.log('❌ AI continue failed:', continueData.error);
      }
      
    } else {
      console.log('❌ Session creation failed:', sessionData.error);
    }
    
    console.log('\n====================================');
    console.log('🎉 Basic AI Training System Tests Complete!');
    
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

testBasicFunctionality();