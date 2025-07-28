
import fetch from 'node-fetch';

async function testSessionFlow() {
  console.log('🧪 Testing Avatar Training Session Flow...');
  
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Test 1: Start a new session
    console.log('\n1. Starting new training session...');
    const startResponse = await fetch(`${baseUrl}/api/avatar-training/sessions/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avatarId: 'brezcode_health_coach',
        scenarioId: '12',
        businessContext: 'brezcode'
      })
    });
    
    if (!startResponse.ok) {
      console.error('❌ Start session failed:', startResponse.status, await startResponse.text());
      return;
    }
    
    const startData = await startResponse.json();
    const sessionId = startData.session?.id;
    console.log('✅ Session started:', sessionId);
    
    if (!sessionId) {
      console.error('❌ No session ID returned');
      return;
    }
    
    // Test 2: Get session details
    console.log('\n2. Getting session details...');
    const getResponse = await fetch(`${baseUrl}/api/avatar-training/sessions/${sessionId}`, {
      method: 'GET'
    });
    
    if (getResponse.ok) {
      const sessionData = await getResponse.json();
      console.log('✅ Session retrieved:', {
        id: sessionData.session?.id,
        status: sessionData.session?.status,
        messagesCount: sessionData.session?.messages?.length || 0
      });
    } else {
      console.error('❌ Get session failed:', getResponse.status);
    }
    
    // Test 3: Continue conversation
    console.log('\n3. Testing continue conversation...');
    const continueResponse = await fetch(`${baseUrl}/api/avatar-training/sessions/${sessionId}/continue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerMessage: ''
      })
    });
    
    if (continueResponse.ok) {
      const continueData = await continueResponse.json();
      console.log('✅ Continue conversation success:', continueData.success);
      console.log('   Messages count:', continueData.session?.messages?.length || 0);
    } else {
      const errorText = await continueResponse.text();
      console.error('❌ Continue conversation failed:', continueResponse.status, errorText);
    }
    
    console.log('\n🎉 Test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testSessionFlow();
