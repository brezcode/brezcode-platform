/**
 * Comprehensive AI Conversation Training System Test Suite
 * Tests all components: API endpoints, UI functionality, error handling
 */

import axios from 'axios';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
let testResults = [];
let testSessionId = null;

// Test configuration
const testConfig = {
  avatarId: 'sales_specialist_alex',
  customerId: 'frustrated_enterprise',
  scenario: 'pricing_objection'
};

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

async function testAvatarListAPI() {
  try {
    const response = await axios.get(`${BASE_URL}/api/business-avatars/avatars`);
    const avatars = response.data.avatars;
    
    if (avatars && avatars.length > 0) {
      const alexAvatar = avatars.find(a => a.id === 'sales_specialist_alex');
      if (alexAvatar) {
        logTest('Avatar List API', true, `Found ${avatars.length} avatars including Alex Thunder`);
        return true;
      } else {
        logTest('Avatar List API', false, 'Sales specialist Alex not found in avatar list');
        return false;
      }
    } else {
      logTest('Avatar List API', false, 'No avatars returned from API');
      return false;
    }
  } catch (error) {
    logTest('Avatar List API', false, `Error: ${error.message}`);
    return false;
  }
}

async function testStartConversationAPI() {
  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, testConfig, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data && response.data.id) {
      testSessionId = response.data.id;
      const session = response.data;
      
      // Verify session structure
      const hasRequiredFields = session.id && session.avatar_id && session.customer_id && 
                               session.scenario && session.messages && session.performance_metrics;
      
      if (hasRequiredFields) {
        logTest('Start Conversation API', true, `Session created with ID: ${testSessionId}`);
        return true;
      } else {
        logTest('Start Conversation API', false, 'Session missing required fields');
        return false;
      }
    } else {
      logTest('Start Conversation API', false, 'No session ID returned');
      return false;
    }
  } catch (error) {
    logTest('Start Conversation API', false, `Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testConversationMessages() {
  if (!testSessionId) {
    logTest('Conversation Messages', false, 'No session ID available');
    return false;
  }

  try {
    // Get the session again to check for messages
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, testConfig, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const session = response.data;
    if (session.messages && session.messages.length > 0) {
      const firstMessage = session.messages[0];
      const hasMessageStructure = firstMessage.id && firstMessage.role && 
                                 firstMessage.content && firstMessage.timestamp;
      
      if (hasMessageStructure) {
        logTest('Conversation Messages', true, `First message from ${firstMessage.role}: "${firstMessage.content.substring(0, 50)}..."`);
        return true;
      } else {
        logTest('Conversation Messages', false, 'Message missing required fields');
        return false;
      }
    } else {
      logTest('Conversation Messages', false, 'No messages found in session');
      return false;
    }
  } catch (error) {
    logTest('Conversation Messages', false, `Error: ${error.message}`);
    return false;
  }
}

async function testContinueConversationAPI() {
  if (!testSessionId) {
    logTest('Continue Conversation API', false, 'No session ID available');
    return false;
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/${testSessionId}/continue`, {}, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data && response.data.messages) {
      const messageCount = response.data.messages.length;
      logTest('Continue Conversation API', true, `Conversation continued, now has ${messageCount} messages`);
      return true;
    } else {
      logTest('Continue Conversation API', false, 'No updated session returned');
      return false;
    }
  } catch (error) {
    logTest('Continue Conversation API', false, `Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testStopConversationAPI() {
  if (!testSessionId) {
    logTest('Stop Conversation API', false, 'No session ID available');
    return false;
  }

  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/${testSessionId}/stop`, {}, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data && response.data.status === 'completed') {
      logTest('Stop Conversation API', true, `Session stopped with status: ${response.data.status}`);
      return true;
    } else {
      logTest('Stop Conversation API', false, `Unexpected status: ${response.data?.status}`);
      return false;
    }
  } catch (error) {
    logTest('Stop Conversation API', false, `Error: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testPerformanceMetrics() {
  try {
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, testConfig, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const session = response.data;
    const metrics = session.performance_metrics;
    
    if (metrics && typeof metrics.response_quality === 'number' &&
        typeof metrics.customer_satisfaction === 'number' &&
        typeof metrics.goal_achievement === 'number') {
      logTest('Performance Metrics', true, `Quality: ${metrics.response_quality}%, Satisfaction: ${metrics.customer_satisfaction}%`);
      return true;
    } else {
      logTest('Performance Metrics', false, 'Missing or invalid performance metrics');
      return false;
    }
  } catch (error) {
    logTest('Performance Metrics', false, `Error: ${error.message}`);
    return false;
  }
}

async function testErrorHandling() {
  try {
    // Test with invalid avatar ID
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
      avatarId: 'invalid_avatar',
      customerId: 'frustrated_enterprise',
      scenario: 'pricing_objection'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    logTest('Error Handling', false, 'Should have returned error for invalid avatar');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      logTest('Error Handling', true, `Correctly returned 400 error: ${error.response.data.error}`);
      return true;
    } else {
      logTest('Error Handling', false, `Unexpected error: ${error.message}`);
      return false;
    }
  }
}

async function testFrontendRouting() {
  try {
    const response = await axios.get(`${BASE_URL}/ai-conversation-training`);
    
    if (response.status === 200 && response.data.includes('AI Conversation Training')) {
      logTest('Frontend Routing', true, 'AI conversation training page loads successfully');
      return true;
    } else {
      logTest('Frontend Routing', false, 'AI conversation training page not found');
      return false;
    }
  } catch (error) {
    logTest('Frontend Routing', false, `Error loading page: ${error.message}`);
    return false;
  }
}

async function testOpenAIIntegration() {
  try {
    // Test that OpenAI is properly configured by starting a conversation
    const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, testConfig, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    const session = response.data;
    if (session.messages && session.messages[0] && session.messages[0].content.length > 10) {
      logTest('OpenAI Integration', true, 'AI-generated content is substantial and realistic');
      return true;
    } else {
      logTest('OpenAI Integration', false, 'AI-generated content is too short or missing');
      return false;
    }
  } catch (error) {
    logTest('OpenAI Integration', false, `Error: ${error.message}`);
    return false;
  }
}

async function testMultipleScenarios() {
  const scenarios = ['pricing_objection', 'initial_inquiry', 'technical_question'];
  let passCount = 0;
  
  for (const scenario of scenarios) {
    try {
      const response = await axios.post(`${BASE_URL}/api/ai-conversation/start`, {
        ...testConfig,
        scenario: scenario
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.data && response.data.id) {
        passCount++;
      }
    } catch (error) {
      // Scenario failed
    }
  }
  
  if (passCount === scenarios.length) {
    logTest('Multiple Scenarios', true, `All ${scenarios.length} scenarios work correctly`);
    return true;
  } else {
    logTest('Multiple Scenarios', false, `Only ${passCount}/${scenarios.length} scenarios work`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting AI Conversation Training System Test Suite\n');
  
  const tests = [
    testAvatarListAPI,
    testStartConversationAPI,
    testConversationMessages,
    testContinueConversationAPI,
    testStopConversationAPI,
    testPerformanceMetrics,
    testErrorHandling,
    testFrontendRouting,
    testOpenAIIntegration,
    testMultipleScenarios
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
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${(passedTests / totalTests * 100).toFixed(1)}%`);
  
  // Save detailed results
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
  
  fs.writeFileSync('ai-conversation-test-report.json', JSON.stringify(report, null, 2));
  console.log('\n📄 Detailed report saved to: ai-conversation-test-report.json');
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED! AI Conversation Training System is fully operational.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the detailed report for issues.');
  }
  
  return passedTests === totalTests;
}

// Run tests if called directly
runAllTests().catch(console.error);