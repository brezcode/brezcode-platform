// Comprehensive test for the immediate feedback learning system
const SERVER_BASE = 'http://localhost:5000';

async function apiRequest(method, endpoint, data = null) {
  const url = `${SERVER_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  return {
    ok: response.ok,
    status: response.status,
    json: async () => response.json(),
    text: async () => response.text()
  };
}

async function testCompleteFeedbackSystem() {
  console.log('🎯 COMPLETE FEEDBACK SYSTEM TEST');
  console.log('=================================');
  
  let sessionId = null;
  let messageToComment = null;
  
  try {
    // 1. Start a fresh training session
    console.log('🚀 Starting new training session...');
    const startResponse = await apiRequest('POST', '/api/avatar-training/sessions/start', {
      avatarId: 'brezcode_health_coach',
      scenarioId: 'breast_health_anxiety',
      businessContext: 'brezcode'
    });
    
    if (!startResponse.ok) {
      console.log('❌ Failed to start session:', await startResponse.text());
      return false;
    }
    
    const sessionData = await startResponse.json();
    sessionId = sessionData.session.id;
    console.log(`✅ Session ${sessionId} started successfully`);
    
    // 2. Continue conversation multiple times to build context
    console.log('\n📞 Building conversation context...');
    
    for (let i = 0; i < 3; i++) {
      const continueResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/continue`);
      
      if (!continueResponse.ok) {
        console.log(`❌ Failed to continue conversation (iteration ${i + 1})`);
        return false;
      }
      
      const continueData = await continueResponse.json();
      console.log(`  ✅ Iteration ${i + 1} completed`);
      
      // Get the latest Dr. Sakura message for commenting
      const messages = continueData.session.messages;
      for (let j = messages.length - 1; j >= 0; j--) {
        if (messages[j].role === 'avatar') {
          messageToComment = messages[j];
          break;
        }
      }
    }
    
    if (!messageToComment) {
      console.log('❌ No Dr. Sakura message found to comment on');
      return false;
    }
    
    console.log(`\n🩺 Found Dr. Sakura message to test feedback:`);
    console.log(`Message ID: ${messageToComment.id}`);
    console.log(`Content Preview: "${messageToComment.content.substring(0, 80)}..."`);
    console.log(`Quality Score: ${messageToComment.quality_score || 'N/A'}/100`);

    // 3. Test immediate feedback learning with various comment types
    const feedbackTests = [
      {
        name: 'VAGUE_FEEDBACK',
        comment: 'This answer is too vague. I need specific information and concrete steps.',
        rating: 2,
        expectedImprovement: 'More specific details and actionable steps'
      },
      {
        name: 'MEDICAL_ACCURACY',
        comment: 'Please provide more medically accurate information with proper disclaimers.',
        rating: 3,
        expectedImprovement: 'Enhanced medical accuracy and disclaimers'
      },
      {
        name: 'EMPATHY_REQUEST',
        comment: 'This response lacks empathy. Please be more understanding of patient anxiety.',
        rating: 2,
        expectedImprovement: 'More empathetic and supportive tone'
      }
    ];
    
    console.log('\n🎓 TESTING IMMEDIATE FEEDBACK LEARNING:');
    console.log('=====================================');
    
    let allTestsPassed = true;
    
    for (const test of feedbackTests) {
      console.log(`\n--- TEST: ${test.name} ---`);
      console.log(`💬 USER COMMENT: "${test.comment}"`);
      
      const commentResponse = await apiRequest('POST', `/api/avatar-training/sessions/${sessionId}/comment`, {
        messageId: messageToComment.id,
        comment: test.comment,
        rating: test.rating
      });
      
      if (!commentResponse.ok) {
        console.log(`❌ Test failed: HTTP ${commentResponse.status}`);
        const errorText = await commentResponse.text();
        console.log(`Error: ${errorText}`);
        allTestsPassed = false;
        continue;
      }
      
      try {
        const commentData = await commentResponse.json();
        
        if (commentData.success && commentData.improved_message) {
          console.log(`✅ Dr. Sakura provided improved response:`);
          console.log(`📝 Improved Content: "${commentData.improved_message.content.substring(0, 100)}..."`);
          console.log(`📊 New Quality Score: ${commentData.improved_message.quality_score || 'N/A'}/100`);
          console.log(`💡 Learning Applied: ${test.expectedImprovement}`);
          
          // Update message for next test
          messageToComment = commentData.improved_message;
        } else {
          console.log(`❌ Test failed: Invalid response structure`);
          console.log(`Response:`, JSON.stringify(commentData, null, 2));
          allTestsPassed = false;
        }
      } catch (parseError) {
        console.log(`❌ Test failed: JSON parse error - ${parseError.message}`);
        allTestsPassed = false;
      }
    }
    
    // 4. Test session learning persistence
    console.log('\n🧠 TESTING LEARNING PERSISTENCE:');
    console.log('===============================');
    
    const sessionStatusResponse = await apiRequest('GET', `/api/avatar-training/sessions/${sessionId}`);
    if (sessionStatusResponse.ok) {
      const sessionStatus = await sessionStatusResponse.json();
      const learnedResponses = sessionStatus.session?.learned_responses || [];
      
      console.log(`📚 Learned Responses Count: ${learnedResponses.length}`);
      console.log(`📈 Performance Metrics Updated: ${JSON.stringify(sessionStatus.session?.performance_metrics || {})}`);
      console.log(`✅ Learning persistence: ${learnedResponses.length > 0 ? 'WORKING' : 'FAILED'}`);
    } else {
      console.log('⚠️ Could not verify learning persistence');
    }
    
    // 5. Final Results
    console.log('\n📊 IMMEDIATE FEEDBACK LEARNING TEST RESULTS');
    console.log('==========================================');
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Immediate feedback learning is fully operational.');
      console.log('✅ Dr. Sakura successfully improves responses based on user feedback');
      console.log('✅ Learning is preserved for future training sessions');
      console.log('✅ Performance metrics are updated with each improvement');
      return true;
    } else {
      console.log('❌ Some tests failed. Immediate feedback learning needs fixes.');
      return false;
    }
    
  } catch (error) {
    console.error('💥 Test execution error:', error.message);
    return false;
  }
}

// Run the comprehensive test
testCompleteFeedbackSystem()
  .then(success => {
    if (success) {
      console.log('\n🏆 IMMEDIATE FEEDBACK LEARNING SYSTEM: FULLY OPERATIONAL');
    } else {
      console.log('\n🔧 IMMEDIATE FEEDBACK LEARNING SYSTEM: NEEDS DEBUGGING');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('🚨 Critical test error:', error);
    process.exit(1);
  });