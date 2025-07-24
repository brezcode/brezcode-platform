// Test inline improved response functionality
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
  return {
    ok: response.ok,
    status: response.status,
    json: async () => response.json()
  };
};

async function testInlineImprovedResponse() {
  console.log('🎯 TESTING INLINE IMPROVED RESPONSE DISPLAY');
  console.log('==========================================');
  
  try {
    // Start session
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionData = await startResponse.json();
    const sessionId = sessionData.session.id;
    console.log('✅ Session started:', sessionId);
    
    // Continue conversation to get Dr. Sakura message
    const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
    const continueData = await continueResponse.json();
    const messages = continueData.session.messages;
    
    // Find Dr. Sakura's message  
    const drSakuraMsg = messages.reverse().find(m => m.role === 'avatar');
    console.log('🩺 Found Dr. Sakura message:', drSakuraMsg.id);
    console.log('📝 Original quality:', drSakuraMsg.quality_score + '/100');
    
    // Submit feedback comment
    const commentResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
      messageId: drSakuraMsg.id,
      comment: 'This response is too vague. Please provide specific steps and concrete information.',
      rating: 2
    });
    
    const feedbackData = await commentResponse.json();
    
    if (feedbackData.success && feedbackData.improved_message) {
      console.log('\n✅ IMPROVED RESPONSE GENERATED SUCCESSFULLY:');
      console.log('🎯 Original Message ID:', feedbackData.improved_message.original_message_id);
      console.log('📊 Quality improvement:', drSakuraMsg.quality_score + '→' + feedbackData.improved_message.quality_score);
      console.log('💬 User comment:', feedbackData.improved_message.user_comment);
      console.log('✨ Improved content preview:', feedbackData.improved_message.content.substring(0, 150) + '...');
      
      console.log('\n🎉 SUCCESS: Backend ready for inline display');
      console.log('💡 Frontend will show:');
      console.log('   1. Original Dr. Sakura response');
      console.log('   2. User comment below in pink highlight');
      console.log('   3. Improved response below in green highlight');
      console.log('   4. All within same expanded pink dialogue box');
      
      return true;
    } else {
      console.log('❌ Failed to get improved response');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testInlineImprovedResponse();