/**
 * Comprehensive Avatar Training System Test Suite
 * Tests the avatar training issue where avatars respond identically
 */

import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
let testResults = [];

function logTest(testName, success, details = '') {
  const result = {
    test: testName,
    status: success ? 'PASS' : 'FAIL',
    details: details,
    timestamp: new Date().toISOString()
  };
  testResults.push(result);
  console.log(`${success ? '✅' : '❌'} ${testName}: ${details}`);
}

async function testAvatarUniqueness() {
  try {
    const avatars = ['sales_specialist_alex', 'customer_service_miko', 'tech_support_kai'];
    const responses = [];
    
    for (const avatarId of avatars) {
      const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
        avatarId: avatarId,
        customerId: 'frustrated_enterprise',
        scenario: 'pricing_objection'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        // Continue the conversation to get avatar response
        const continueResponse = await axios.post(`${BASE_URL}/api/ai-conversation/${response.data.id}/continue`, {}, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (continueResponse.data && continueResponse.data.messages) {
          const avatarMessage = continueResponse.data.messages.find(m => m.role === 'avatar');
          if (avatarMessage) {
            responses.push({
              avatar: avatarId,
              response: avatarMessage.content
            });
          }
        }
      }
      
      // Delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check if responses are unique
    const uniqueResponses = new Set(responses.map(r => r.response));
    
    if (uniqueResponses.size === responses.length && responses.length === avatars.length) {
      logTest('Avatar Response Uniqueness', true, `All ${avatars.length} avatars generated unique responses`);
      
      // Log sample responses for verification
      responses.forEach(r => {
        console.log(`   ${r.avatar}: "${r.response.substring(0, 100)}..."`);
      });
      
      return true;
    } else {
      logTest('Avatar Response Uniqueness', false, `Only ${uniqueResponses.size} unique responses from ${responses.length} avatars`);
      return false;
    }
  } catch (error) {
    logTest('Avatar Response Uniqueness', false, `Error: ${error.message}`);
    return false;
  }
}

async function testPersonalityConsistency() {
  try {
    // Test same avatar with different scenarios
    const scenarios = ['pricing_objection', 'initial_inquiry', 'technical_question'];
    const responses = [];
    
    for (const scenario of scenarios) {
      const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
        avatarId: 'sales_specialist_alex',
        customerId: 'frustrated_enterprise',
        scenario: scenario
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.messages) {
        const continueResponse = await axios.post(`${BASE_URL}/api/ai-conversation/${response.data.id}/continue`, {}, {
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (continueResponse.data && continueResponse.data.messages) {
          const avatarMessage = continueResponse.data.messages.find(m => m.role === 'avatar');
          if (avatarMessage) {
            responses.push({
              scenario: scenario,
              response: avatarMessage.content,
              hasSalesTerms: /\b(solution|value|ROI|investment|benefit)\b/i.test(avatarMessage.content)
            });
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check if Alex maintains sales personality across scenarios
    const salesConsistency = responses.filter(r => r.hasSalesTerms).length;
    
    if (salesConsistency >= responses.length * 0.7) { // 70% should show sales characteristics
      logTest('Personality Consistency', true, `Sales specialist maintained personality in ${salesConsistency}/${responses.length} scenarios`);
      return true;
    } else {
      logTest('Personality Consistency', false, `Sales personality only evident in ${salesConsistency}/${responses.length} scenarios`);
      return false;
    }
  } catch (error) {
    logTest('Personality Consistency', false, `Error: ${error.message}`);
    return false;
  }
}

async function testCustomerPersonalities() {
  try {
    const customers = ['frustrated_enterprise', 'anxious_small_business', 'angry_existing_customer'];
    const responses = [];
    
    for (const customerId of customers) {
      const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
        avatarId: 'sales_specialist_alex',
        customerId: customerId,
        scenario: 'initial_inquiry'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.messages && response.data.messages.length > 0) {
        const customerMessage = response.data.messages[0]; // First message is from customer
        responses.push({
          customer: customerId,
          message: customerMessage.content,
          emotion: customerMessage.emotion
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check emotional uniqueness
    const uniqueEmotions = new Set(responses.map(r => r.emotion));
    
    if (uniqueEmotions.size >= 2) { // At least 2 different emotions
      logTest('Customer Personality Uniqueness', true, `${uniqueEmotions.size} distinct customer emotions detected`);
      
      responses.forEach(r => {
        console.log(`   ${r.customer} (${r.emotion}): "${r.message.substring(0, 80)}..."`);
      });
      
      return true;
    } else {
      logTest('Customer Personality Uniqueness', false, `Only ${uniqueEmotions.size} distinct emotions from ${responses.length} customers`);
      return false;
    }
  } catch (error) {
    logTest('Customer Personality Uniqueness', false, `Error: ${error.message}`);
    return false;
  }
}

async function testConversationFlow() {
  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
      avatarId: 'sales_specialist_alex',
      customerId: 'frustrated_enterprise',
      scenario: 'pricing_objection'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    let session = response.data;
    const conversationSteps = [];
    
    // Continue conversation for several turns
    for (let i = 0; i < 3; i++) {
      const continueResponse = await axios.post(`${BASE_URL}/api/ai-conversation/${session.id}/continue`, {}, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      session = continueResponse.data;
      conversationSteps.push(session.messages.length);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Check if conversation is progressing
    const isProgressing = conversationSteps.every((step, index) => 
      index === 0 || step > conversationSteps[index - 1]
    );
    
    if (isProgressing && session.messages.length >= 4) {
      logTest('Conversation Flow', true, `Conversation progressed through ${session.messages.length} messages`);
      return true;
    } else {
      logTest('Conversation Flow', false, `Conversation stuck at ${session.messages.length} messages`);
      return false;
    }
  } catch (error) {
    logTest('Conversation Flow', false, `Error: ${error.message}`);
    return false;
  }
}

async function testPerformanceTracking() {
  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
      avatarId: 'sales_specialist_alex',
      customerId: 'frustrated_enterprise',
      scenario: 'pricing_objection'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const session = response.data;
    const metrics = session.performance_metrics;
    
    // Check if metrics are realistic (not all zeros or identical)
    const metricsArray = [
      metrics.response_quality,
      metrics.customer_satisfaction,
      metrics.goal_achievement
    ];
    
    const allPositive = metricsArray.every(m => m > 0);
    const notAllIdentical = new Set(metricsArray).size > 1;
    
    if (allPositive && notAllIdentical) {
      logTest('Performance Tracking', true, `Realistic metrics: Quality=${metrics.response_quality}%, Satisfaction=${metrics.customer_satisfaction}%`);
      return true;
    } else {
      logTest('Performance Tracking', false, `Unrealistic metrics: ${JSON.stringify(metrics)}`);
      return false;
    }
  } catch (error) {
    logTest('Performance Tracking', false, `Error: ${error.message}`);
    return false;
  }
}

async function runAvatarTrainingTests() {
  console.log('🎭 Starting Avatar Training System Test Suite\n');
  
  const tests = [
    testAvatarUniqueness,
    testPersonalityConsistency,
    testCustomerPersonalities,
    testConversationFlow,
    testPerformanceTracking
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) passedTests++;
    } catch (error) {
      console.error(`Test execution error: ${error.message}`);
    }
  }
  
  console.log('\n📊 Avatar Training Test Results');
  console.log('================================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${(passedTests / totalTests * 100).toFixed(1)}%`);
  
  const report = {
    summary: {
      totalTests,
      passedTests,
      failedTests: totalTests - passedTests,
      successRate: (passedTests / totalTests * 100).toFixed(1) + '%'
    },
    tests: testResults,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync('avatar-training-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Report saved to: avatar-training-test-report.json');
  
  return passedTests === totalTests;
}

runAvatarTrainingTests().catch(console.error);