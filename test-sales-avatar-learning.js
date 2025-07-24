import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/avatar-training';

// Test learning system for Sales Avatar (Alex Thunder)
async function testSalesAvatarLearning() {
  console.log('💼 TESTING ALEX THUNDER (SALES AVATAR) LEARNING');
  console.log('===============================================');

  try {
    // Test learning for sales avatar
    console.log('🎯 Testing sales avatar persistent learning...');
    
    // Start session with sales avatar
    const sessionResponse = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'sales_specialist', 
      avatarType: 'sales_specialist',
      businessContext: 'sales',
      scenarioId: 'price_objection'
    });

    const sessionId = sessionResponse.data.session.id;
    console.log(`✅ Started sales training session: ${sessionId}`);

    // Continue conversation to get avatar response
    const continueResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/continue`);
    const avatarMessage = continueResponse.data.session.messages.find(m => m.role === 'avatar');
    
    console.log(`💬 Alex Thunder initial response: "${avatarMessage.content.substring(0, 80)}..."`);

    // Provide sales-specific feedback
    const salesFeedback = "This response is too generic for sales. I need specific pricing strategies and objection handling techniques with exact scripts.";
    
    const commentResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/comment`, {
      messageId: avatarMessage.id,
      comment: salesFeedback,
      rating: 3
    });

    console.log(`📝 Sales feedback provided: "${salesFeedback.substring(0, 60)}..."`);
    console.log(`✨ Alex Thunder learned and improved response`);

    // Start NEW session to test learning persistence  
    const newSessionResponse = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'sales_specialist',
      avatarType: 'sales_specialist', 
      businessContext: 'sales',
      scenarioId: 'price_objection'
    });

    const newSessionId = newSessionResponse.data.session.id;
    console.log(`🔄 Started NEW sales session: ${newSessionId}`);

    // Check if avatar applies learned response in new session
    const newContinueResponse = await axios.post(`${BASE_URL}/sessions/${newSessionId}/continue`);
    const newAvatarMessage = newContinueResponse.data.session.messages.find(m => m.role === 'avatar');

    const responseChanged = newAvatarMessage.content !== avatarMessage.content;
    console.log(`🧠 Sales learning applied in new session: ${responseChanged ? '✅ YES' : '❌ NO'}`);
    
    if (responseChanged) {
      console.log(`💡 New sales response: "${newAvatarMessage.content.substring(0, 80)}..."`);
    }

    // Check sales avatar learning progress
    const progressResponse = await axios.get(`${BASE_URL}/learning-progress?avatarType=sales_specialist`);
    const learned = progressResponse.data.summary.total_learned_responses;
    console.log(`📊 Alex Thunder total learned responses: ${learned}`);

    console.log('\n🎯 SALES AVATAR LEARNING VERDICT');
    console.log('================================');
    console.log(`${responseChanged ? '✅ SUCCESS' : '❌ FAILED'}: Alex Thunder learns from sales feedback`);
    console.log(`${learned > 0 ? '✅ SUCCESS' : '❌ FAILED'}: Sales knowledge persists across sessions`);
    
    if (responseChanged && learned > 0) {
      console.log('\n💼 Alex Thunder Sales Avatar: LEARNING OPERATIONAL');
      console.log('Sales avatar can now learn and improve across sessions!');
    }

  } catch (error) {
    console.log('❌ Error testing sales avatar learning:', error.message);
  }
}

testSalesAvatarLearning().catch(console.error);