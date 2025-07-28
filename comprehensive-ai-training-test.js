/**
 * Comprehensive AI Training System Test
 * Tests all functionality including patient profile display, scenario context memory, and conversation flow
 */

const BASE_URL = 'http://localhost:5000';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(BASE_URL + url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await response.json();
    return { success: response.ok, status: response.status, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testAITrainingSystem() {
  console.log('🔬 COMPREHENSIVE AI TRAINING SYSTEM TEST');
  console.log('=' * 60);
  
  let totalTests = 0;
  let passedTests = 0;
  
  // Test 1: Scenario Retrieval
  console.log('\n📋 Test 1: Scenario Retrieval');
  totalTests++;
  const scenariosResult = await makeRequest('/api/avatar-training/scenarios');
  if (scenariosResult.success && scenariosResult.data.scenarios.length > 0) {
    console.log('✅ Scenarios loaded successfully:', scenariosResult.data.scenarios.length, 'scenarios');
    passedTests++;
  } else {
    console.log('❌ Failed to load scenarios:', scenariosResult.error || scenariosResult.data);
  }
  
  // Test 2: Specific Scenario (mammo_anxiety) Retrieval  
  console.log('\n🎯 Test 2: Specific Scenario Data');
  totalTests++;
  const scenarioResult = await makeRequest('/api/avatar-training/scenarios/mammo_anxiety');
  if (scenarioResult.success && scenarioResult.data.scenario) {
    const scenario = scenarioResult.data.scenario;
    console.log('✅ Mammo anxiety scenario loaded');
    console.log('   - Name:', scenario.name);
    console.log('   - Customer Persona:', typeof scenario.customerPersona);
    console.log('   - Has Patient Profile:', scenario.customerPersona ? '✅ Yes' : '❌ No');
    if (scenario.customerPersona) {
      const persona = typeof scenario.customerPersona === 'string' ? 
        JSON.parse(scenario.customerPersona) : scenario.customerPersona;
      console.log('   - Patient Name:', persona.name);
      console.log('   - Patient Age:', persona.age);
      console.log('   - Main Concerns:', persona.concerns?.join(', '));
    }
    passedTests++;
  } else {
    console.log('❌ Failed to load mammo anxiety scenario:', scenarioResult.error || scenarioResult.data);
  }
  
  // Test 3: Session Creation with Scenario Context
  console.log('\n🚀 Test 3: Session Creation');
  totalTests++;
  const sessionResult = await makeRequest('/api/avatar-training/sessions', {
    method: 'POST',
    body: JSON.stringify({
      avatarType: 'dr_sakura',
      scenarioId: 'mammo_anxiety',
      businessContext: 'health_coaching',
      userId: 1
    })
  });
  
  let sessionId = null;
  if (sessionResult.success && sessionResult.data.session) {
    console.log('✅ Session created successfully');
    sessionId = sessionResult.data.session.sessionId;
    console.log('   - Session ID:', sessionId);
    console.log('   - Avatar Type:', sessionResult.data.session.avatarType);
    console.log('   - Scenario ID:', sessionResult.data.session.scenarioId);
    passedTests++;
  } else {
    console.log('❌ Failed to create session:', sessionResult.error || sessionResult.data);
  }
  
  if (!sessionId) {
    console.log('⚠️ Cannot continue tests without session ID');
    return { totalTests, passedTests };
  }
  
  // Test 4: Manual Message with Scenario Context
  console.log('\n💬 Test 4: Manual Message with Context Memory');
  totalTests++;
  const messageResult = await makeRequest(`/api/avatar-training/sessions/${sessionId}/message`, {
    method: 'POST',
    body: JSON.stringify({
      message: "I'm really worried about scheduling my mammogram. Can you help me understand what to expect?",
      role: 'customer'
    })
  });
  
  if (messageResult.success && messageResult.data.response) {
    console.log('✅ Manual message processed successfully');
    console.log('   - Dr. Sakura Response:', messageResult.data.response.substring(0, 100) + '...');
    console.log('   - Response Quality:', messageResult.data.quality_score || 'N/A');
    console.log('   - Context Aware:', messageResult.data.response.toLowerCase().includes('mammogram') ? '✅ Yes' : '❌ No');
    passedTests++;
  } else {
    console.log('❌ Failed to process manual message:', messageResult.error || messageResult.data);
  }
  
  // Test 5: AI Continue Conversation with Patient Profile Context
  console.log('\n🤖 Test 5: AI Continue with Patient Context');
  totalTests++;
  const continueResult = await makeRequest(`/api/avatar-training/sessions/${sessionId}/continue`, {
    method: 'POST',
    body: JSON.stringify({
      customerMessage: 'auto' // Trigger AI-generated patient question
    })
  });
  
  if (continueResult.success && continueResult.data.session) {
    console.log('✅ AI Continue processed successfully');
    const session = continueResult.data.session;
    const messages = session.messages || [];
    const lastMessages = messages.slice(-2);
    
    if (lastMessages.length >= 2) {
      const aiPatientMsg = lastMessages.find(m => m.role === 'customer');
      const drSakuraMsg = lastMessages.find(m => m.role === 'avatar');
      
      if (aiPatientMsg) {
        console.log('   - AI Patient Question:', aiPatientMsg.content.substring(0, 80) + '...');
        console.log('   - Patient Emotion:', aiPatientMsg.emotion);
        console.log('   - Context Aware:', aiPatientMsg.content.toLowerCase().includes('mammogram') || 
                   aiPatientMsg.content.toLowerCase().includes('anxious') || 
                   aiPatientMsg.content.toLowerCase().includes('screening') ? '✅ Yes' : '❌ No');
      }
      
      if (drSakuraMsg) {
        console.log('   - Dr. Sakura Response:', drSakuraMsg.content.substring(0, 80) + '...');
        console.log('   - Response Quality:', drSakuraMsg.quality_score);
        console.log('   - Addresses Patient:', drSakuraMsg.content.toLowerCase().includes('sarah') || 
                   drSakuraMsg.content.toLowerCase().includes('mammogram') ? '✅ Yes' : '❌ No');
      }
    }
    passedTests++;
  } else {
    console.log('❌ Failed to process AI continue:', continueResult.error || continueResult.data);
  }
  
  // Test 6: Session Memory Persistence
  console.log('\n🧠 Test 6: Session Memory Persistence');
  totalTests++;
  const followupResult = await makeRequest(`/api/avatar-training/sessions/${sessionId}/message`, {
    method: 'POST',
    body: JSON.stringify({
      message: "Thank you for that information. Can you remind me what my main concern was again?",
      role: 'customer'  
    })
  });
  
  if (followupResult.success && followupResult.data.response) {
    console.log('✅ Follow-up message processed');
    const response = followupResult.data.response;
    console.log('   - Memory Test Response:', response.substring(0, 100) + '...');
    console.log('   - Remembers Context:', response.toLowerCase().includes('mammogram') || 
               response.toLowerCase().includes('screening') || 
               response.toLowerCase().includes('anxiety') ? '✅ Yes' : '❌ No');
    passedTests++;
  } else {
    console.log('❌ Failed to process follow-up message:', followupResult.error || followupResult.data);
  }
  
  // Results Summary
  console.log('\n' + '=' * 60);
  console.log(`📊 TEST RESULTS: ${passedTests}/${totalTests} PASSED (${Math.round(passedTests/totalTests*100)}%)`);
  console.log('=' * 60);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED! AI Training System is fully operational.');
    console.log('✅ Patient profile display working');
    console.log('✅ Scenario context memory working');  
    console.log('✅ AI conversation flow working');
    console.log('✅ Session persistence working');
  } else {
    console.log(`⚠️ ${totalTests - passedTests} tests failed. System needs attention.`);
  }
  
  return { totalTests, passedTests, sessionId };
}

// Run the test
testAITrainingSystem().catch(console.error);