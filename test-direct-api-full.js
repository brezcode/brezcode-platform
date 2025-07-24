import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testDirectAPIFullScript() {
  console.log('⚡ TESTING DIRECT API FULL CONVERSATION SCRIPT');
  console.log('==============================================');
  
  try {
    // Test with direct API that we know works
    console.log('\n🎯 Starting Direct API training session...');
    const sessionResponse = await axios.post(`${BASE_URL}/direct-api/training/start`, {
      avatarId: 'health_sakura',
      customerId: 'anxious_small_business',
      scenario: 'breast_health_consultation'
    });
    
    const sessionId = sessionResponse.data.id;
    console.log(`✅ Session ${sessionId} started via Direct API`);
    
    // Display initial conversation
    console.log('\n🗣️  INITIAL DIRECT API CONVERSATION:');
    sessionResponse.data.messages.forEach(msg => {
      console.log(`${msg.role.toUpperCase()}: ${msg.content}`);
      console.log('---');
    });
    
    // Run full conversation using direct API
    console.log('\n🎬 FULL DIRECT API DIALOGUE (6 turns):');
    for (let turn = 1; turn <= 6; turn++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const continueResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/continue`);
      
      console.log(`\n--- DIRECT API TURN ${turn} ---`);
      continueResponse.data.messages.forEach(msg => {
        console.log(`${msg.role.toUpperCase()}: ${msg.content}`);
        if (msg.quality_score) console.log(`Quality: ${msg.quality_score}/100`);
      });
      
      const metrics = continueResponse.data.performance_metrics;
      console.log(`📊 Quality: ${metrics.response_quality}% | Satisfaction: ${metrics.customer_satisfaction}%`);
    }
    
    // Stop session
    const stopResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/stop`);
    console.log(`\n🏁 Session completed via Direct API`);
    console.log(`Duration: ${stopResponse.data.duration} seconds`);
    
    return true;
  } catch (error) {
    console.log('❌ Direct API test failed:', error.response?.data || error.message);
    return false;
  }
}

async function compareAPIs() {
  console.log('\n🔄 COMPARING BREZCODE API vs DIRECT API');
  console.log('=====================================');
  
  const results = {
    brezcode: { success: false, messages: 0, error: null },
    direct: { success: false, messages: 0, error: null }
  };
  
  // Test BrezCode API
  try {
    const brezResponse = await axios.post(`${BASE_URL}/api/avatar-training/sessions/start`, {
      avatarId: 'health_sakura',
      scenarioId: 'breast_health_consultation',
      businessContext: 'brezcode'
    });
    results.brezcode.success = true;
    results.brezcode.messages = brezResponse.data.session?.messages?.length || 0;
    console.log(`✅ BrezCode API: ${results.brezcode.messages} initial messages`);
  } catch (error) {
    results.brezcode.error = error.response?.data || error.message;
    console.log(`❌ BrezCode API failed: ${results.brezcode.error}`);
  }
  
  // Test Direct API
  try {
    const directResponse = await axios.post(`${BASE_URL}/direct-api/training/start`, {
      avatarId: 'health_sakura',
      customerId: 'anxious_small_business',
      scenario: 'breast_health_consultation'
    });
    results.direct.success = true;
    results.direct.messages = directResponse.data.messages?.length || 0;
    console.log(`✅ Direct API: ${results.direct.messages} initial messages`);
  } catch (error) {
    results.direct.error = error.response?.data || error.message;
    console.log(`❌ Direct API failed: ${results.direct.error}`);
  }
  
  console.log('\n📊 API COMPARISON RESULTS:');
  console.log(`BrezCode API: ${results.brezcode.success ? 'WORKING' : 'FAILED'} - ${results.brezcode.messages} messages`);
  console.log(`Direct API: ${results.direct.success ? 'WORKING' : 'FAILED'} - ${results.direct.messages} messages`);
  
  return results;
}

// Run both tests
testDirectAPIFullScript()
  .then(() => compareAPIs())
  .then(results => {
    console.log('\n🎯 RECOMMENDATION:');
    if (results.direct.success && results.brezcode.success) {
      console.log('Both APIs working - User can use either BrezCode training or Direct API');
    } else if (results.direct.success) {
      console.log('Use Direct API route (/direct-api/training) - more reliable');
    } else if (results.brezcode.success) {
      console.log('Use BrezCode API route (/api/avatar-training) - working correctly');
    } else {
      console.log('Both APIs have issues - investigation needed');
    }
  });