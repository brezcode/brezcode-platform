
const axios = require('axios');

console.log('🧪 Testing Avatar Message Fix');
console.log('=============================');

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

    console.log('\n2. Testing specific user question...');
    const messageResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/message`, {
      message: "Do you remember how old I am?",
      role: 'customer'
    });

    const avatarResponse = messageResponse.data.avatarMessage.content;
    console.log(`Avatar response: "${avatarResponse}"`);

    // Check if response addresses the question about age/memory
    const isRelevant = avatarResponse.toLowerCase().includes('age') || 
                      avatarResponse.toLowerCase().includes('old') ||
                      avatarResponse.toLowerCase().includes('remember') ||
                      avatarResponse.toLowerCase().includes('information') ||
                      avatarResponse.toLowerCase().includes('tell me');

    console.log(`\n3. Relevance check: ${isRelevant ? '✅ RELEVANT' : '❌ NOT RELEVANT'}`);
    
    if (isRelevant) {
      console.log('🎉 SUCCESS: Avatar is responding to actual user questions!');
      console.log('✅ The avatar correctly addresses what the user asked');
      return true;
    } else {
      console.log('❌ FAILURE: Avatar not responding to user question');
      console.log('   Expected: Response about age/memory');
      console.log(`   Got: "${avatarResponse}"`);
      return false;
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    return false;
  }
}

testMessageFix()
  .then(success => {
    console.log('\n' + '='.repeat(50));
    console.log(success ? '🎉 TEST CONFIRMED: SYSTEM IS WORKING' : '❌ TEST FAILED: NEEDS FIXES');
    console.log('='.repeat(50));
    process.exit(success ? 0 : 1);
  });
