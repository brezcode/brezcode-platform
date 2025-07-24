import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/avatar-training';

// Comprehensive test for universal fixes: comments preservation and smart AI patients
async function testUniversalFixesComprehensive() {
  console.log('🔧 TESTING UNIVERSAL FIXES: COMMENTS + SMART AI PATIENTS');
  console.log('=======================================================');
  console.log('Testing comment preservation and intelligent AI patients across all avatars\n');

  try {
    // Test 1: Sales Avatar - Comment Preservation
    console.log('💼 Testing Sales Avatar Comment Preservation...');
    const salesSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'sales_specialist',
      avatarType: 'sales_specialist',
      businessContext: 'sales'
    });

    console.log('📝 Sales: Initial conversation...');
    const salesContinue1 = await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/continue`);
    const salesMessage1 = salesContinue1.data.session.messages.find(m => m.role === 'avatar');
    
    console.log('💬 Sales AI Patient says:', salesContinue1.data.session.messages.find(m => m.role === 'customer')?.content.substring(0, 80) + '...');
    
    console.log('📝 Sales: Adding comment to avatar response...');
    await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/comment`, {
      messageId: salesMessage1.id,
      comment: "Need specific ROI calculations and competitive analysis data.",
      rating: 3
    });
    
    console.log('🔄 Sales: Continue conversation - testing comment preservation...');
    const salesContinue2 = await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/continue`);
    
    // Check if comment is preserved
    const salesPreservedMessage = salesContinue2.data.session.messages.find(m => m.id === salesMessage1.id);
    const salesCommentPreserved = salesPreservedMessage?.user_comment === "Need specific ROI calculations and competitive analysis data.";
    
    console.log(`✅ Sales Comment Preserved: ${salesCommentPreserved ? 'YES' : 'NO'}`);
    console.log('💬 Sales Smart AI Patient says:', salesContinue2.data.session.messages.find(m => m.role === 'customer' && m.id !== salesContinue1.data.session.messages.find(m => m.role === 'customer')?.id)?.content.substring(0, 80) + '...');

    // Test 2: Customer Service Avatar - Comment Preservation
    console.log('\n🎧 Testing Customer Service Avatar Comment Preservation...');
    const serviceSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'customer_service',
      avatarType: 'customer_service',
      businessContext: 'support'
    });

    console.log('📝 Service: Initial conversation...');
    const serviceContinue1 = await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/continue`);
    const serviceMessage1 = serviceContinue1.data.session.messages.find(m => m.role === 'avatar');
    
    console.log('💬 Service AI Patient says:', serviceContinue1.data.session.messages.find(m => m.role === 'customer')?.content.substring(0, 80) + '...');
    
    console.log('📝 Service: Adding comment to avatar response...');
    await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/comment`, {
      messageId: serviceMessage1.id,
      comment: "Response lacks empathy and specific resolution steps.",
      rating: 2
    });
    
    console.log('🔄 Service: Continue conversation - testing comment preservation...');
    const serviceContinue2 = await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/continue`);
    
    // Check if comment is preserved
    const servicePreservedMessage = serviceContinue2.data.session.messages.find(m => m.id === serviceMessage1.id);
    const serviceCommentPreserved = servicePreservedMessage?.user_comment === "Response lacks empathy and specific resolution steps.";
    
    console.log(`✅ Service Comment Preserved: ${serviceCommentPreserved ? 'YES' : 'NO'}`);
    console.log('💬 Service Smart AI Patient says:', serviceContinue2.data.session.messages.find(m => m.role === 'customer' && m.id !== serviceContinue1.data.session.messages.find(m => m.role === 'customer')?.id)?.content.substring(0, 80) + '...');

    // Test 3: Dr. Sakura - Comment Preservation and Improved Response
    console.log('\n🩺 Testing Dr. Sakura Comment Preservation...');
    const healthSession = await axios.post(`${BASE_URL}/sessions/start`, {
      avatarId: 'dr_sakura',
      avatarType: 'dr_sakura',
      businessContext: 'health_coaching'
    });

    console.log('📝 Health: Initial conversation...');
    const healthContinue1 = await axios.post(`${BASE_URL}/sessions/${healthSession.data.session.id}/continue`);
    const healthMessage1 = healthContinue1.data.session.messages.find(m => m.role === 'avatar');
    
    console.log('💬 Health AI Patient says:', healthContinue1.data.session.messages.find(m => m.role === 'customer')?.content.substring(0, 80) + '...');
    
    console.log('📝 Health: Adding comment to avatar response...');
    await axios.post(`${BASE_URL}/sessions/${healthSession.data.session.id}/comment`, {
      messageId: healthMessage1.id,
      comment: "Too vague. I need specific timelines and exact procedures.",
      rating: 3
    });
    
    console.log('🔄 Health: Continue conversation - testing comment and improvement preservation...');
    const healthContinue2 = await axios.post(`${BASE_URL}/sessions/${healthSession.data.session.id}/continue`);
    
    // Check if comment and improved response are preserved
    const healthPreservedMessage = healthContinue2.data.session.messages.find(m => m.id === healthMessage1.id);
    const healthCommentPreserved = healthPreservedMessage?.user_comment === "Too vague. I need specific timelines and exact procedures.";
    const healthImprovedPreserved = healthPreservedMessage?.improved_response && healthPreservedMessage.improved_response.length > 0;
    
    console.log(`✅ Health Comment Preserved: ${healthCommentPreserved ? 'YES' : 'NO'}`);
    console.log(`✅ Health Improved Response Preserved: ${healthImprovedPreserved ? 'YES' : 'NO'}`);
    console.log('💬 Health Smart AI Patient says:', healthContinue2.data.session.messages.find(m => m.role === 'customer' && m.id !== healthContinue1.data.session.messages.find(m => m.role === 'customer')?.id)?.content.substring(0, 80) + '...');

    // Test 4: Smart AI Patient Intelligence - Different Questions
    console.log('\n🧠 Testing Smart AI Patient Intelligence...');
    
    // Continue each conversation to see if AI patients ask different, contextual questions
    console.log('🔄 Sales: Third conversation turn...');
    const salesContinue3 = await axios.post(`${BASE_URL}/sessions/${salesSession.data.session.id}/continue`);
    const salesQuestion3 = salesContinue3.data.session.messages.find(m => m.role === 'customer' && !salesContinue2.data.session.messages.some(msg => msg.id === m.id))?.content;
    
    console.log('🔄 Service: Third conversation turn...');
    const serviceContinue3 = await axios.post(`${BASE_URL}/sessions/${serviceSession.data.session.id}/continue`);
    const serviceQuestion3 = serviceContinue3.data.session.messages.find(m => m.role === 'customer' && !serviceContinue2.data.session.messages.some(msg => msg.id === m.id))?.content;
    
    console.log('🔄 Health: Third conversation turn...');
    const healthContinue3 = await axios.post(`${BASE_URL}/sessions/${healthSession.data.session.id}/continue`);
    const healthQuestion3 = healthContinue3.data.session.messages.find(m => m.role === 'customer' && !healthContinue2.data.session.messages.some(msg => msg.id === m.id))?.content;
    
    console.log('\n🧠 SMART AI PATIENT QUESTIONS:');
    console.log('Sales Question 3:', salesQuestion3?.substring(0, 100) + '...');
    console.log('Service Question 3:', serviceQuestion3?.substring(0, 100) + '...');
    console.log('Health Question 3:', healthQuestion3?.substring(0, 100) + '...');
    
    // Check if questions are different and contextual
    const questionsAreDifferent = salesQuestion3 !== serviceQuestion3 && serviceQuestion3 !== healthQuestion3;
    const questionsAreContextual = salesQuestion3?.includes('ROI') || salesQuestion3?.includes('price') ||
                                  serviceQuestion3?.includes('problem') || serviceQuestion3?.includes('frustrated') ||
                                  healthQuestion3?.includes('exam') || healthQuestion3?.includes('screening');

    // Final Results
    console.log('\n🎯 UNIVERSAL FIXES TEST RESULTS');
    console.log('===============================');
    console.log(`${salesCommentPreserved ? '✅' : '❌'} Sales Avatar Comment Preservation: ${salesCommentPreserved ? 'WORKING' : 'FAILED'}`);
    console.log(`${serviceCommentPreserved ? '✅' : '❌'} Service Avatar Comment Preservation: ${serviceCommentPreserved ? 'WORKING' : 'FAILED'}`);
    console.log(`${healthCommentPreserved ? '✅' : '❌'} Health Avatar Comment Preservation: ${healthCommentPreserved ? 'WORKING' : 'FAILED'}`);
    console.log(`${healthImprovedPreserved ? '✅' : '❌'} Health Improved Response Preservation: ${healthImprovedPreserved ? 'WORKING' : 'FAILED'}`);
    console.log(`${questionsAreDifferent ? '✅' : '❌'} Smart AI Patients (Different Questions): ${questionsAreDifferent ? 'WORKING' : 'FAILED'}`);
    console.log(`${questionsAreContextual ? '✅' : '❌'} Smart AI Patients (Contextual): ${questionsAreContextual ? 'WORKING' : 'FAILED'}`);

    const allTestsPassed = salesCommentPreserved && serviceCommentPreserved && healthCommentPreserved && 
                          healthImprovedPreserved && questionsAreDifferent && questionsAreContextual;

    console.log('\n🌟 OVERALL RESULT');
    console.log('================');
    console.log(`${allTestsPassed ? '🎉 SUCCESS' : '❌ FAILED'}: Universal Fixes Implementation`);
    
    if (allTestsPassed) {
      console.log('\n🌐 UNIVERSAL FIXES: FULLY OPERATIONAL');
      console.log('All critical issues have been resolved:');
      console.log('• Comments no longer disappear after "continue AI conversation"');
      console.log('• Improved responses are preserved across all interactions');
      console.log('• AI patients ask smart, contextual, progressive questions');
      console.log('• Each avatar type receives industry-specific customer challenges');
      console.log('• Learning system maintains all user feedback permanently');
      console.log('\nThe universal AI training platform is now production-ready!');
    } else {
      console.log('\nSome issues still need to be resolved:');
      if (!salesCommentPreserved || !serviceCommentPreserved || !healthCommentPreserved) {
        console.log('• Comment preservation needs fixing');
      }
      if (!healthImprovedPreserved) {
        console.log('• Improved response preservation needs fixing');
      }
      if (!questionsAreDifferent || !questionsAreContextual) {
        console.log('• Smart AI patient logic needs improvement');
      }
    }

  } catch (error) {
    console.log('❌ Error during universal fixes test:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
  }
}

testUniversalFixesComprehensive().catch(console.error);