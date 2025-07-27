
console.log('🧪 Testing Avatar Message Fix');
console.log('=============================');

const axios = require('axios');
const BASE_URL = 'http://localhost:5000/api/avatar-training';

async function testMessageFix() {
  try {
    console.log('1. Starting new session...');
    const sessionResponse = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'health_breast_screening',
      businessContext: 'brezcode'
    });

    const sessionId = sessionResponse.data.session.id;
    console.log(`✅ Session created: ${sessionId}`);

    console.log('\n2. Sending specific question...');
    const testQuestion = "Do you remember how old I am?";
    
    const messageResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/message`, {
      message: testQuestion,
      role: 'customer'
    });

    console.log(`\n3. Question sent: "${testQuestion}"`);
    console.log(`\n4. Avatar response:`);
    console.log(`"${messageResponse.data.avatarMessage.content}"`);

    // Check if response is relevant to the question
    const response = messageResponse.data.avatarMessage.content.toLowerCase();
    const isRelevant = response.includes('age') || response.includes('old') || response.includes('remember') || response.includes('information');
    
    console.log(`\n5. Response relevance check: ${isRelevant ? '✅ RELEVANT' : '❌ NOT RELEVANT'}`);
    
    if (isRelevant) {
      console.log('🎉 SUCCESS: Avatar is now responding to actual customer questions!');
    } else {
      console.log('❌ FAILURE: Avatar is still not using the customer question properly');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testMessageFix();
