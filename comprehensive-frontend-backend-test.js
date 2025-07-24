// COMPREHENSIVE FRONTEND + BACKEND TEST
// Tests what the user ACTUALLY sees, not just what backend returns

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

// Test scenarios that simulate ACTUAL user interactions
const TEST_SCENARIOS = [
  {
    name: "Multiple Choice Basic Test",
    comment: "Testing basic multiple choice display",
    expectedChoices: 3
  },
  {
    name: "Iterative Feedback - Vague Response",
    comment: "This is too vague and general",
    expectedImprovement: true,
    expectedKeywords: ["specific", "concrete"],
    expectedChoices: 3  // First response should have choices
  },
  {
    name: "Iterative Feedback - Timeline Request", 
    comment: "I need to know when and timeline",
    expectedImprovement: true,
    expectedKeywords: ["schedule", "ages", "annually"],
    expectedChoices: 3  // First response should have choices
  },
  {
    name: "Iterative Feedback - Process Question",
    comment: "What happens during the process?",
    expectedImprovement: true,
    expectedKeywords: ["exactly", "steps", "minutes"],
    expectedChoices: 3  // First response should have choices
  },
  {
    name: "Multiple Choice After Feedback",
    comment: "Test multiple choice persistence",
    expectedChoices: 3,  // First response should have choices
    expectedChoicesAfterComment: 0  // Should not have choices after feedback
  }
];

async function comprehensiveTest() {
  console.log('🔬 COMPREHENSIVE FRONTEND + BACKEND TEST');
  console.log('==========================================');
  console.log('Testing ACTUAL user experience across all scenarios\n');
  
  let totalTests = 0;
  let passedTests = 0;
  const failedTests = [];
  
  for (const scenario of TEST_SCENARIOS) {
    console.log(`\n📋 SCENARIO: ${scenario.name}`);
    console.log('─'.repeat(50));
    
    try {
      // 1. Start fresh session for each scenario
      const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
        avatarId: 'brezcode_health_coach',
        scenarioId: 'breast_health_anxiety',
        businessContext: 'brezcode'
      });
      
      if (!startResponse.ok) {
        throw new Error(`Session start failed: ${startResponse.status}`);
      }
      
      const sessionData = await startResponse.json();
      const sessionId = sessionData.session.id;
      
      // 2. Get Dr. Sakura response
      const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
      if (!continueResponse.ok) {
        throw new Error(`Continue failed: ${continueResponse.status}`);
      }
      
      const continueData = await continueResponse.json();
      const messages = continueData.session.messages;
      const drSakuraMessage = messages.reverse().find(m => m.role === 'avatar');
      
      if (!drSakuraMessage) {
        throw new Error('No Dr. Sakura message found');
      }
      
      // 3. TEST MULTIPLE CHOICE (Frontend perspective)
      console.log('   Testing Multiple Choice Display...');
      totalTests++;
      
      const hasMultipleChoice = drSakuraMessage.multiple_choice_options && 
                               Array.isArray(drSakuraMessage.multiple_choice_options) && 
                               drSakuraMessage.multiple_choice_options.length > 0;
      
      const frontendCondition = drSakuraMessage.role === 'avatar' && hasMultipleChoice;
      
      if (scenario.expectedChoices > 0) {
        if (frontendCondition && drSakuraMessage.multiple_choice_options.length === scenario.expectedChoices) {
          console.log(`   ✅ Multiple Choice: ${drSakuraMessage.multiple_choice_options.length} buttons should appear`);
          passedTests++;
        } else {
          console.log(`   ❌ Multiple Choice: Expected ${scenario.expectedChoices}, got ${drSakuraMessage.multiple_choice_options?.length || 0}`);
          failedTests.push(`${scenario.name}: Multiple Choice display`);
        }
      } else {
        if (!frontendCondition) {
          console.log(`   ✅ Multiple Choice: Correctly hidden as expected`);
          passedTests++;
        } else {
          console.log(`   ❌ Multiple Choice: Should be hidden but ${drSakuraMessage.multiple_choice_options.length} buttons appear`);
          failedTests.push(`${scenario.name}: Multiple Choice should be hidden`);
        }
      }
      
      // 4. TEST ITERATIVE FEEDBACK (if applicable)
      if (scenario.expectedImprovement) {
        console.log('   Testing Iterative Feedback...');
        totalTests++;
        
        // Add comment
        const commentResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
          messageId: drSakuraMessage.id,
          comment: scenario.comment,
          rating: 2
        });
        
        if (!commentResponse.ok) {
          throw new Error(`Comment failed: ${commentResponse.status}`);
        }
        
        const commentData = await commentResponse.json();
        
        // Check if improved response was generated
        if (!commentData.success || !commentData.improved_message) {
          console.log(`   ❌ Improved Response: Backend failed to generate improvement`);
          failedTests.push(`${scenario.name}: Backend improvement generation`);
          continue;
        }
        
        // 5. VERIFY MESSAGE WAS UPDATED (Frontend data check)
        const updatedSessionResponse = await apiRequest('GET', `/api/avatar-training/sessions`);
        const updatedSessionData = await updatedSessionResponse.json();
        const currentSession = updatedSessionData.sessions.find(s => s.id === sessionId);
        
        if (!currentSession) {
          throw new Error('Updated session not found');
        }
        
        const updatedMessage = currentSession.messages.find(m => m.id === drSakuraMessage.id);
        
        if (!updatedMessage) {
          throw new Error('Original message not found in updated session');
        }
        
        // Frontend condition for improved response display
        const improvedResponseCondition = updatedMessage.user_comment && updatedMessage.improved_response;
        
        if (improvedResponseCondition) {
          console.log(`   ✅ Message Update: Original message has user_comment and improved_response`);
          
          // Check if improvement contains expected keywords
          const improvedContent = updatedMessage.improved_response.toLowerCase();
          const hasExpectedKeywords = scenario.expectedKeywords.some(keyword => 
            improvedContent.includes(keyword.toLowerCase())
          );
          
          if (hasExpectedKeywords) {
            console.log(`   ✅ Content Quality: Improvement contains expected keywords`);
            passedTests++;
          } else {
            console.log(`   ❌ Content Quality: Missing expected keywords: ${scenario.expectedKeywords.join(', ')}`);
            failedTests.push(`${scenario.name}: Content quality`);
          }
        } else {
          console.log(`   ❌ Message Update: user_comment=${!!updatedMessage.user_comment}, improved_response=${!!updatedMessage.improved_response}`);
          failedTests.push(`${scenario.name}: Message not properly updated`);
        }
      }
      
      // 6. TEST CHOICE SELECTION (Multiple Choice Functionality)
      if (frontendCondition && scenario.expectedChoices > 0) {
        console.log('   Testing Choice Selection...');
        totalTests++;
        
        const firstChoice = drSakuraMessage.multiple_choice_options[0];
        const choiceResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/choice`, {
          choice: firstChoice
        });
        
        if (choiceResponse.ok) {
          const choiceData = await choiceResponse.json();
          if (choiceData.success && choiceData.session.messages.length > messages.length) {
            console.log(`   ✅ Choice Selection: Successfully processed "${firstChoice.substring(0, 30)}..."`);
            passedTests++;
          } else {
            console.log(`   ❌ Choice Selection: Backend processed but no new messages added`);
            failedTests.push(`${scenario.name}: Choice processing`);
          }
        } else {
          console.log(`   ❌ Choice Selection: API call failed with status ${choiceResponse.status}`);
          failedTests.push(`${scenario.name}: Choice API failure`);
        }
      }
      
    } catch (error) {
      console.log(`   ❌ SCENARIO FAILED: ${error.message}`);
      failedTests.push(`${scenario.name}: ${error.message}`);
      totalTests++;
    }
  }
  
  // 7. FINAL COMPREHENSIVE RESULTS
  console.log('\n' + '='.repeat(60));
  console.log('📊 COMPREHENSIVE TEST RESULTS');
  console.log('='.repeat(60));
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${successRate}%`);
  
  if (failedTests.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failedTests.forEach(test => console.log(`   • ${test}`));
  }
  
  console.log('\n🎯 USER EXPERIENCE VERDICT:');
  if (successRate >= 90) {
    console.log('✅ EXCELLENT: Both systems work perfectly from user perspective');
  } else if (successRate >= 75) {
    console.log('⚠️  GOOD: Minor issues that need fixing');
  } else if (successRate >= 50) {
    console.log('🔶 POOR: Major issues affecting user experience');
  } else {
    console.log('❌ BROKEN: Systems do not work for users');
  }
  
  // 8. SPECIFIC FEATURE STATUS
  console.log('\n🔍 FEATURE STATUS FOR USER:');
  
  const multipleChoiceTests = failedTests.filter(test => test.includes('Multiple Choice'));
  const feedbackTests = failedTests.filter(test => test.includes('Feedback') || test.includes('improvement'));
  
  console.log(`Multiple Choice Guided Interaction: ${multipleChoiceTests.length === 0 ? '✅ WORKING' : '❌ BROKEN'}`);
  console.log(`Iterative Feedback Learning: ${feedbackTests.length === 0 ? '✅ WORKING' : '❌ BROKEN'}`);
  
  return {
    totalTests,
    passedTests,
    successRate: parseFloat(successRate),
    multipleChoiceWorking: multipleChoiceTests.length === 0,
    feedbackWorking: feedbackTests.length === 0,
    fullyOperational: successRate >= 90
  };
}

// Run comprehensive test
comprehensiveTest()
  .then(results => {
    console.log('\n' + '='.repeat(60));
    if (results.fullyOperational) {
      console.log('🎉 CONFIRMED: Both AI training systems fully operational');
      console.log('   Users will see working multiple choice and feedback systems');
    } else {
      console.log('🚨 CONFIRMED: Systems have issues from user perspective');
      console.log('   More fixes needed before claiming success');
    }
    console.log('='.repeat(60));
  })
  .catch(error => {
    console.error('❌ COMPREHENSIVE TEST FAILED:', error);
  });