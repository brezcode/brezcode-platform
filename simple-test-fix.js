import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testDirectAPI() {
  try {
    console.log('Testing direct API...');
    
    // Test the direct test endpoint
    const testResponse = await axios.get(`${BASE_URL}/direct-api/test`);
    console.log('✅ Direct API test:', testResponse.data);
    
    // Test AI training start
    const trainingResponse = await axios.post(`${BASE_URL}/direct-api/training/start`, {
      avatarId: 'sales_specialist_alex',
      customerId: 'frustrated_enterprise', 
      scenario: 'pricing_objection'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('✅ Training start response:', trainingResponse.data);
    
    if (trainingResponse.data && trainingResponse.data.id) {
      const sessionId = trainingResponse.data.id;
      
      // Test continue
      const continueResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/continue`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Training continue response:', continueResponse.data);
      
      // Test stop
      const stopResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/stop`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('✅ Training stop response:', stopResponse.data);
      
      console.log('\n🎉 ALL TESTS PASSED! AI Conversation Training API is working!');
    } else {
      console.log('❌ No session ID returned from start endpoint');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.response?.data || error.message);
  }
}

testDirectAPI();