// Simple test to verify API functionality
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    console.log('Testing business avatars API...');
    const avatarsResponse = await axios.get(`${BASE_URL}/api/business-avatars/avatars`);
    console.log('✅ Avatars API works:', avatarsResponse.data.success);
    
    console.log('Testing AI conversation start...');
    const startResponse = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
      avatarId: 'sales_specialist_alex',
      customerId: 'frustrated_enterprise',
      scenario: 'pricing_objection'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
    
    console.log('Response status:', startResponse.status);
    console.log('Response headers:', startResponse.headers['content-type']);
    console.log('Response data type:', typeof startResponse.data);
    console.log('Response data:', JSON.stringify(startResponse.data, null, 2));
    
    if (startResponse.data && startResponse.data.id) {
      console.log('✅ AI conversation API works!');
      return true;
    } else {
      console.log('❌ AI conversation API failed - no session ID');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
    return false;
  }
}

testAPI();