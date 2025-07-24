// Test Dr. Sakura's persistent learning across sessions
async function testDrSakuraLearning() {
  console.log('🧠 TESTING DR. SAKURA PERSISTENT LEARNING');
  console.log('==========================================');
  
  const apiRequest = async (method, endpoint, data = null) => {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : null
    });
    return response.json();
  };

  try {
    // Step 1: Check initial knowledge base
    console.log('\n📚 STEP 1: Check initial knowledge base');
    const initialLearning = await apiRequest('GET', '/api/avatar-training/learning-progress');
    console.log(`Initial learned responses: ${initialLearning.summary.total_learned_responses}`);
    
    // Step 2: Start first training session
    console.log('\n🎯 STEP 2: First training session');
    const session1 = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionId1 = session1.session.id;
    console.log(`Started session 1: ${sessionId1}`);
    
    // Continue to get Dr. Sakura's response
    const continue1 = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId1}/continue`);
    const drSakuraMessage1 = [...continue1.session.messages].reverse().find(m => m.role === 'avatar');
    
    console.log('Dr. Sakura initial response:');
    console.log(`"${drSakuraMessage1.content.substring(0, 100)}..."`);
    
    // Step 3: Provide feedback to teach Dr. Sakura
    console.log('\n💬 STEP 3: Teaching Dr. Sakura with feedback');
    const feedback = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId1}/comment`, {
      messageId: drSakuraMessage1.id,
      comment: 'This response is too vague. I need specific timeline information.',
      rating: 3
    });
    
    console.log('Feedback provided: "This response is too vague. I need specific timeline information."');
    console.log('Dr. Sakura improved response:');
    console.log(`"${feedback.improved_message.content.substring(0, 100)}..."`);
    
    // Step 4: Check learning progress
    console.log('\n📈 STEP 4: Check learning progress after feedback');
    const learningAfterFeedback = await apiRequest('GET', '/api/avatar-training/learning-progress');
    console.log(`Learned responses after feedback: ${learningAfterFeedback.summary.total_learned_responses}`);
    console.log(`Learning topics: ${learningAfterFeedback.summary.most_common_improvements.join(', ')}`);
    
    // Step 5: Start NEW session to test persistent learning
    console.log('\n🔄 STEP 5: NEW session to test if Dr. Sakura remembers learning');
    const session2 = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    const sessionId2 = session2.session.id;
    console.log(`Started NEW session 2: ${sessionId2}`);
    
    // Continue to get Dr. Sakura's response in new session
    const continue2 = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId2}/continue`);
    const drSakuraMessage2 = [...continue2.session.messages].reverse().find(m => m.role === 'avatar');
    
    console.log('\n🧠 Dr. Sakura response in NEW session:');
    console.log(`"${drSakuraMessage2.content.substring(0, 150)}..."`);
    
    // Step 6: Compare responses
    console.log('\n🔍 STEP 6: LEARNING COMPARISON');
    console.log('────────────────────────────────────────');
    
    const firstResponseWords = drSakuraMessage1.content.toLowerCase();
    const secondResponseWords = drSakuraMessage2.content.toLowerCase();
    
    const hasImproved = secondResponseWords !== firstResponseWords;
    const hasSpecificTerms = secondResponseWords.includes('exact') || 
                            secondResponseWords.includes('specific') || 
                            secondResponseWords.includes('timeline') ||
                            secondResponseWords.includes('ages') ||
                            secondResponseWords.includes('annually');
    
    console.log(`Response changed: ${hasImproved ? '✅ YES' : '❌ NO'}`);
    console.log(`Contains specific terms: ${hasSpecificTerms ? '✅ YES' : '❌ NO'}`);
    console.log(`Learning applied: ${hasImproved && hasSpecificTerms ? '✅ SUCCESS' : '❌ FAILED'}`);
    
    // Step 7: Final learning progress
    console.log('\n📊 STEP 7: Final learning progress');
    const finalLearning = await apiRequest('GET', '/api/avatar-training/learning-progress');
    console.log(`Total learned responses: ${finalLearning.summary.total_learned_responses}`);
    console.log(`Learning active: ${finalLearning.summary.learning_active ? '✅ YES' : '❌ NO'}`);
    
    // Overall verdict
    console.log('\n🎯 LEARNING TEST VERDICT');
    console.log('========================');
    
    if (hasImproved && hasSpecificTerms && finalLearning.summary.learning_active) {
      console.log('✅ SUCCESS: Dr. Sakura successfully learns and applies improvements across sessions');
      console.log('✅ Persistent memory working');
      console.log('✅ Response quality improved');
      console.log('✅ Knowledge base operational');
    } else {
      console.log('❌ FAILURE: Dr. Sakura learning system not working properly');
      console.log(`   - Response improved: ${hasImproved}`);
      console.log(`   - Specific content: ${hasSpecificTerms}`);
      console.log(`   - Learning active: ${finalLearning.summary.learning_active}`);
    }
    
  } catch (error) {
    console.error('Learning test failed:', error.message);
  }
}

testDrSakuraLearning();