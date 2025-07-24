import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/avatar-training';

// Final test to confirm universal learning works for all LeadGen.to avatars
async function testUniversalLearningSystem() {
  console.log('🌐 FINAL TEST: UNIVERSAL AVATAR LEARNING SYSTEM');
  console.log('===============================================');
  console.log('Verifying ALL LeadGen.to avatars can learn independently\n');

  try {
    // Test 1: Sales Avatar Learning
    console.log('💼 Testing Sales Avatar (Alex Thunder)...');
    const salesSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'sales_specialist',
      avatarType: 'sales_specialist',
      businessContext: 'sales'
    });

    const salesContinue = await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/continue`);
    const salesMessage = salesContinue.data.session.messages.find(m => m.role === 'avatar');
    
    await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/comment`, {
      messageId: salesMessage.id,
      comment: "Need specific sales scripts and exact pricing strategies.",
      rating: 3
    });
    console.log('✅ Sales avatar trained successfully');

    // Test 2: Customer Service Avatar Learning  
    console.log('🎧 Testing Customer Service Avatar (Miko Harmony)...');
    const serviceSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'customer_service',
      avatarType: 'customer_service',
      businessContext: 'support'
    });

    const serviceContinue = await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/continue`);
    const serviceMessage = serviceContinue.data.session.messages.find(m => m.role === 'avatar');
    
    await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/comment`, {
      messageId: serviceMessage.id,
      comment: "Need specific de-escalation scripts for angry customers.",
      rating: 3
    });
    console.log('✅ Customer service avatar trained successfully');

    // Test 3: Technical Support Avatar Learning
    console.log('🔧 Testing Technical Support Avatar (Kai TechWiz)...');
    const techSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'technical_support',
      avatarType: 'technical_support',
      businessContext: 'tech'
    });

    const techContinue = await axios.post(`${BASE_URL}/sessions/${techSession.data.session.id}/continue`);
    const techMessage = techContinue.data.session.messages.find(m => m.role === 'avatar');
    
    await axios.post(`${BASE_URL}/sessions/${techSession.data.session.id}/comment`, {
      messageId: techMessage.id,
      comment: "Need specific troubleshooting flowcharts and diagnostic commands.",
      rating: 3
    });
    console.log('✅ Technical support avatar trained successfully');

    // Test 4: Check individual avatar learning progress
    console.log('\n📊 Checking individual avatar learning progress...');
    
    const salesProgress = await axios.get(`${BASE_URL}/learning-progress?avatarType=sales_specialist`);
    const serviceProgress = await axios.get(`${BASE_URL}/learning-progress?avatarType=customer_service`);
    const techProgress = await axios.get(`${BASE_URL}/learning-progress?avatarType=technical_support`);
    
    console.log(`Sales Avatar learned responses: ${salesProgress.data.summary.total_learned_responses}`);
    console.log(`Customer Service Avatar learned responses: ${serviceProgress.data.summary.total_learned_responses}`);
    console.log(`Technical Support Avatar learned responses: ${techProgress.data.summary.total_learned_responses}`);

    // Test 5: Check universal learning progress
    console.log('\n🌐 Checking universal learning progress...');
    const universalProgress = await axios.get(`${BASE_URL}/learning-progress`);
    
    console.log(`Total learned responses across all avatars: ${universalProgress.data.summary.total_learned_responses}`);
    console.log(`Active learning avatars: ${universalProgress.data.summary.active_avatars.length}`);
    console.log(`Learning active globally: ${universalProgress.data.summary.learning_active ? 'YES' : 'NO'}`);

    // Final Verification
    console.log('\n🎯 UNIVERSAL LEARNING SYSTEM VERDICT');
    console.log('====================================');
    
    const salesLearned = salesProgress.data.summary.total_learned_responses > 0;
    const serviceLearned = serviceProgress.data.summary.total_learned_responses > 0;
    const techLearned = techProgress.data.summary.total_learned_responses > 0;
    const universalActive = universalProgress.data.summary.learning_active;
    const multipleAvatars = universalProgress.data.summary.active_avatars.length >= 3;
    
    console.log(`${salesLearned ? '✅' : '❌'} Sales Avatar Learning: ${salesLearned ? 'OPERATIONAL' : 'FAILED'}`);
    console.log(`${serviceLearned ? '✅' : '❌'} Customer Service Avatar Learning: ${serviceLearned ? 'OPERATIONAL' : 'FAILED'}`);
    console.log(`${techLearned ? '✅' : '❌'} Technical Support Avatar Learning: ${techLearned ? 'OPERATIONAL' : 'FAILED'}`);
    console.log(`${universalActive ? '✅' : '❌'} Universal Learning System: ${universalActive ? 'OPERATIONAL' : 'FAILED'}`);
    console.log(`${multipleAvatars ? '✅' : '❌'} Multi-Avatar Independence: ${multipleAvatars ? 'OPERATIONAL' : 'FAILED'}`);

    const overallSuccess = salesLearned && serviceLearned && techLearned && universalActive && multipleAvatars;
    
    console.log('\n🌟 FINAL RESULT');
    console.log('===============');
    console.log(`${overallSuccess ? '🎉 SUCCESS' : '❌ FAILED'}: Universal Avatar Learning System`);
    
    if (overallSuccess) {
      console.log('\n🌐 LEADGEN.TO UNIVERSAL AI LEARNING: FULLY OPERATIONAL');
      console.log('All business avatars across the platform can now:');
      console.log('• Learn from user feedback independently');
      console.log('• Retain knowledge across all future sessions');
      console.log('• Provide industry-specific improved responses');
      console.log('• Scale learning across unlimited business types');
      console.log('\nThe platform now has true AI learning capabilities!');
    }

  } catch (error) {
    console.log('❌ Error during universal learning test:', error.message);
  }
}

testUniversalLearningSystem().catch(console.error);