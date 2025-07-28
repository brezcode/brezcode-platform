
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
let testCount = 0;
let sessionId = null;

async function createSession() {
  console.log('\n🚀 Creating new session...');
  const response = await fetch(`${BASE_URL}/api/avatar-training/sessions/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      avatarId: 'brezcode_health_coach',
      scenarioId: '12',
      businessContext: 'brezcode'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Session creation failed: ${response.status}`);
  }
  
  const data = await response.json();
  sessionId = data.session?.id;
  console.log('✅ Session created:', sessionId);
  return sessionId;
}

async function testContinue(sessionId, testNum) {
  console.log(`\n🔄 Test ${testNum}: Continue conversation...`);
  
  const response = await fetch(`${BASE_URL}/api/avatar-training/sessions/${sessionId}/continue`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerMessage: `Test message ${testNum}` })
  });
  
  console.log(`📡 Response status: ${response.status}`);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.log(`❌ Continue failed: ${response.status} - ${errorText}`);
    return false;
  }
  
  const data = await response.json();
  const success = data.success && data.session && data.session.messages;
  console.log(`${success ? '✅' : '❌'} Continue ${success ? 'SUCCESS' : 'FAILED'}`);
  
  if (success) {
    console.log(`   Messages count: ${data.session.messages.length}`);
  }
  
  return success;
}

async function continuousTest() {
  console.log('🔁 CONTINUOUS TESTING UNTIL FIXED');
  console.log('=================================');
  
  while (true) {
    testCount++;
    console.log(`\n🧪 TEST CYCLE ${testCount}`);
    console.log('='.repeat(20));
    
    try {
      // Create fresh session
      const currentSessionId = await createSession();
      
      // Test multiple continues in rapid succession
      let successCount = 0;
      const totalTests = 10;
      
      for (let i = 1; i <= totalTests; i++) {
        const success = await testContinue(currentSessionId, i);
        if (success) {
          successCount++;
        } else {
          console.log(`❌ FAILURE at test ${i}`);
          break;
        }
        
        // Add small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      const successRate = (successCount / totalTests) * 100;
      console.log(`\n📊 Cycle ${testCount} Results: ${successCount}/${totalTests} (${successRate}%)`);
      
      if (successRate === 100) {
        console.log('\n🎉 SUCCESS! All tests passed!');
        console.log('✅ System appears to be working correctly');
        
        // Do one final verification with longer delay
        console.log('\n🔍 Final verification with 5-second delay...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const finalSuccess = await testContinue(currentSessionId, 'FINAL');
        if (finalSuccess) {
          console.log('\n🏆 CONFIRMED: System is working reliably!');
          break;
        } else {
          console.log('\n⚠️ Final test failed, continuing cycles...');
        }
      }
      
      // Wait before next cycle
      console.log('\n⏳ Waiting 10 seconds before next cycle...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      console.error(`❌ Test cycle ${testCount} error:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Safety limit
    if (testCount >= 20) {
      console.log('\n🛑 Reached maximum test cycles (20)');
      console.log('System may need manual intervention');
      break;
    }
  }
}

continuousTest().catch(console.error);
