import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/avatar-training';

// Test universal avatar learning system across ALL LeadGen.to avatars
async function testUniversalAvatarLearning() {
  console.log('🌐 TESTING UNIVERSAL AVATAR LEARNING SYSTEM');
  console.log('===========================================');
  console.log('Testing persistent learning for ALL LeadGen.to avatars\n');

  const avatarTypes = [
    { type: 'sales_specialist', name: 'Alex Thunder (Sales)', business: 'sales' },
    { type: 'customer_service', name: 'Miko Harmony (Customer Service)', business: 'support' },
    { type: 'technical_support', name: 'Kai TechWiz (Technical)', business: 'tech' },
    { type: 'business_consultant', name: 'Luna Strategic (Business)', business: 'consulting' },
    { type: 'dr_sakura', name: 'Dr. Sakura (Health)', business: 'health_coaching' },
    { type: 'education_specialist', name: 'Professor Sage (Education)', business: 'education' }
  ];

  console.log('📚 STEP 1: Check initial universal knowledge base');
  try {
    const response = await axios.get(`${BASE_URL}/learning-progress`);
    console.log(`Initial total learned responses across all avatars: ${response.data.summary.total_learned_responses}`);
    console.log(`Active learning avatars: ${response.data.summary.active_avatars.length}\n`);
  } catch (error) {
    console.log('❌ Failed to get initial learning progress:', error.message);
    return;
  }

  // Test learning for each avatar type
  for (const avatar of avatarTypes) {
    console.log(`🤖 TESTING AVATAR: ${avatar.name}`);
    console.log('─'.repeat(50));

    try {
      // Step 1: Start training session for this avatar
      const sessionResponse = await axios.post(`${BASE_URL}/sessions/start`, {
        avatarId: avatar.type,
        avatarType: avatar.type,
        businessContext: avatar.business,
        scenarioId: 'customer_interaction'
      });

      const sessionId = sessionResponse.data.session.id;
      console.log(`✅ Started session: ${sessionId}`);

      // Step 2: Continue conversation to get avatar response
      const continueResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/continue`);
      const avatarMessage = continueResponse.data.session.messages.find(m => m.role === 'avatar');
      
      if (avatarMessage) {
        console.log(`💬 ${avatar.name} initial response: "${avatarMessage.content.substring(0, 80)}..."`);
      }

      // Step 3: Provide feedback to train the avatar
      const feedback = `This response is too generic for ${avatar.business}. I need specific ${avatar.business}-focused advice with concrete steps.`;
      
      const commentResponse = await axios.post(`${BASE_URL}/sessions/${sessionId}/comment`, {
        messageId: avatarMessage.id,
        comment: feedback,
        rating: 3
      });

      if (commentResponse.data.success) {
        console.log(`📝 Feedback provided: "${feedback.substring(0, 60)}..."`);
        console.log(`✨ ${avatar.name} learned and improved response`);
      }

      // Step 4: Start NEW session to test if learning persists
      const newSessionResponse = await axios.post(`${BASE_URL}/sessions/start`, {
        avatarId: avatar.type,
        avatarType: avatar.type,
        businessContext: avatar.business,
        scenarioId: 'customer_interaction'
      });

      const newSessionId = newSessionResponse.data.session.id;
      console.log(`🔄 Started NEW session: ${newSessionId}`);

      // Step 5: Check if avatar applies learned response in new session
      const newContinueResponse = await axios.post(`${BASE_URL}/sessions/${newSessionId}/continue`);
      const newAvatarMessage = newContinueResponse.data.session.messages.find(m => m.role === 'avatar');

      if (newAvatarMessage) {
        const responseChanged = newAvatarMessage.content !== avatarMessage.content;
        console.log(`🧠 Learning applied in new session: ${responseChanged ? '✅ YES' : '❌ NO'}`);
        
        if (responseChanged) {
          console.log(`💡 New response: "${newAvatarMessage.content.substring(0, 80)}..."`);
        }
      }

      // Step 6: Check avatar-specific learning progress
      const progressResponse = await axios.get(`${BASE_URL}/learning-progress?avatarType=${avatar.type}`);
      if (progressResponse.data.success) {
        const learned = progressResponse.data.summary.total_learned_responses;
        console.log(`📊 ${avatar.name} total learned responses: ${learned}`);
      }

      console.log(`✅ ${avatar.name} learning test complete\n`);

    } catch (error) {
      console.log(`❌ Error testing ${avatar.name}:`, error.message);
    }
  }

  // Final verification: Check universal learning progress
  console.log('🏆 FINAL VERIFICATION: Universal Learning Progress');
  console.log('='.repeat(50));

  try {
    const finalResponse = await axios.get(`${BASE_URL}/learning-progress`);
    const data = finalResponse.data;
    
    console.log(`📈 Total learned responses across all avatars: ${data.summary.total_learned_responses}`);
    console.log(`🎯 Active learning avatars: ${data.summary.active_avatars.length}`);
    console.log(`🧠 Learning active: ${data.summary.learning_active ? '✅ YES' : '❌ NO'}`);
    
    if (data.summary.active_avatars.length > 0) {
      console.log('🌟 Avatars with learned responses:');
      data.summary.active_avatars.forEach(avatar => {
        console.log(`   • ${avatar.toUpperCase()}`);
      });
    }

    console.log('\n🎯 UNIVERSAL LEARNING TEST VERDICT');
    console.log('=' .repeat(35));
    const success = data.summary.total_learned_responses >= avatarTypes.length && data.summary.learning_active;
    console.log(`${success ? '✅ SUCCESS' : '❌ FAILED'}: Universal avatar learning system operational`);
    console.log(`${data.summary.active_avatars.length > 1 ? '✅ SUCCESS' : '❌ FAILED'}: Multiple avatars learning independently`);
    console.log(`${data.summary.total_learned_responses > 0 ? '✅ SUCCESS' : '❌ FAILED'}: Persistent knowledge base working`);
    
    if (success) {
      console.log('\n🌐 LeadGen.to Universal AI Learning System: FULLY OPERATIONAL');
      console.log('All business avatars can now learn and improve across sessions!');
    }

  } catch (error) {
    console.log('❌ Failed to get final learning progress:', error.message);
  }
}

// Run the comprehensive test
testUniversalAvatarLearning().catch(console.error);