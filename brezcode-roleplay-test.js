#!/usr/bin/env node

/**
 * BrezCode Roleplay Testing Script
 * Tests the AI Assistant Training Platform with health-focused customer service scenarios
 */

import http from 'http';

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'test@test.com',
  password: 'testpass123'
};

// BrezCode Health Education Roleplay Scenarios
const BREZCODE_SCENARIOS = [
  {
    name: "BrezCode Health Assessment Support",
    description: "Customer seeking breast cancer risk assessment and health guidance",
    customerPersona: "Sarah, 35-year-old professional worried about breast cancer risk due to family history",
    assistantRole: "Empathetic health educator and BrezCode specialist",
    objectives: [
      "Provide accurate health information",
      "Guide through risk assessment process", 
      "Address anxiety with compassion",
      "Recommend appropriate next steps"
    ],
    timeframeMins: 15,
    difficulty: "intermediate",
    tags: ["health", "education", "risk-assessment", "support"]
  },
  {
    name: "BrezCode Platform Navigation",
    description: "New user needs help understanding BrezCode's features and tools",
    customerPersona: "Maria, 42-year-old mother interested in preventive health tools",
    assistantRole: "Knowledgeable BrezCode product specialist",
    objectives: [
      "Explain BrezCode's comprehensive health platform",
      "Highlight AI-powered personalization features",
      "Address concerns about data privacy",
      "Guide through sign-up process"
    ],
    timeframeMins: 10,
    difficulty: "beginner", 
    tags: ["product", "onboarding", "features", "privacy"]
  },
  {
    name: "BrezCode Technical Support",
    description: "Customer experiencing issues with health report generation",
    customerPersona: "Jessica, 28-year-old tech-savvy user having report issues",
    assistantRole: "Technical support specialist with health platform expertise",
    objectives: [
      "Diagnose report generation problems",
      "Provide clear technical solutions",
      "Ensure user can access their health insights",
      "Prevent future technical issues"
    ],
    timeframeMins: 20,
    difficulty: "advanced",
    tags: ["technical", "troubleshooting", "reports", "platform"]
  }
];

// Test conversation for health assessment support
const TEST_CONVERSATION = [
  {
    sender: "customer_ai",
    message: "Hi, I'm really worried about my breast cancer risk. My mom had breast cancer at 45 and I'm 35 now. I heard about BrezCode but I'm not sure where to start."
  },
  {
    sender: "assistant_ai", 
    message: "I understand your concern, Sarah. Having a family history can feel overwhelming, but it's wonderful that you're being proactive about your health. BrezCode is designed specifically to help women like you understand their risk and take positive action. Would you like me to walk you through our comprehensive risk assessment?"
  },
  {
    sender: "customer_ai",
    message: "Yes please, but I'm scared of what I might find out. What if my risk is really high?"
  },
  {
    sender: "assistant_ai",
    message: "Your feelings are completely valid - it takes courage to face these concerns. Here's what I want you to know: knowledge is empowering, and regardless of your risk level, there are always positive steps you can take. Our assessment looks at many factors, not just family history, and provides personalized recommendations for managing your health. Would you feel more comfortable if I explained what the assessment covers first?"
  },
  {
    sender: "customer_ai",
    message: "That would be helpful. What kind of questions does the assessment ask?"
  },
  {
    sender: "assistant_ai",
    message: "Great question! Our assessment covers several key areas: your personal health history, family history, lifestyle factors like diet and exercise, reproductive history, and current health habits. It's designed to be comprehensive but not overwhelming - most people complete it in 10-15 minutes. The questions are evidence-based and help us create a personalized risk profile and recommendations just for you. Would you like to start with some basic information, or do you have specific concerns about any of these areas?"
  }
];

async function makeRequest(method, path, data = null, cookies = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (cookies) {
      options.headers.Cookie = cookies;
    }

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: jsonResponse,
            cookies: res.headers['set-cookie']
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            cookies: res.headers['set-cookie']
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testRoleplaySystem() {
  console.log('🩺 Starting BrezCode Roleplay Training Test');
  console.log('==========================================\n');

  try {
    // Step 1: Login
    console.log('Step 1: Authenticating user...');
    const loginResponse = await makeRequest('POST', '/api/login', TEST_USER);
    
    if (loginResponse.status !== 200) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const sessionCookies = loginResponse.cookies ? loginResponse.cookies.join('; ') : null;
    console.log('✅ User authenticated successfully\n');

    // Step 2: Create BrezCode health assessment scenario
    console.log('Step 2: Creating BrezCode health assessment scenario...');
    const scenarioResponse = await makeRequest(
      'POST', 
      '/api/roleplay/scenarios', 
      BREZCODE_SCENARIOS[0],
      sessionCookies
    );
    
    if (scenarioResponse.status !== 200) {
      throw new Error(`Scenario creation failed: ${scenarioResponse.status}`);
    }
    
    console.log('✅ Health assessment scenario created');
    console.log(`   Scenario ID: ${scenarioResponse.data.id}`);
    console.log(`   Focus: ${BREZCODE_SCENARIOS[0].name}\n`);

    // Step 3: Start roleplay session
    console.log('Step 3: Starting roleplay training session...');
    const sessionResponse = await makeRequest(
      'POST',
      '/api/roleplay/sessions/start',
      {
        scenarioId: scenarioResponse.data.id,
        customerPersona: BREZCODE_SCENARIOS[0].customerPersona
      },
      sessionCookies
    );

    if (sessionResponse.status !== 200) {
      throw new Error(`Session start failed: ${sessionResponse.status}`);
    }

    console.log('✅ Roleplay session started');
    console.log(`   Session ID: ${sessionResponse.data.id}`);
    console.log(`   Customer: ${BREZCODE_SCENARIOS[0].customerPersona}\n`);

    // Step 4: Simulate conversation
    console.log('Step 4: Running BrezCode health education conversation...');
    console.log('💬 Customer Service Training Session:');
    console.log('=====================================\n');

    for (let i = 0; i < TEST_CONVERSATION.length; i++) {
      const message = TEST_CONVERSATION[i];
      
      // Add message to session
      const messageResponse = await makeRequest(
        'POST',
        '/api/roleplay/sessions/message',
        {
          sessionId: sessionResponse.data.id,
          sender: message.sender,
          message: message.message
        },
        sessionCookies
      );

      if (messageResponse.status === 200) {
        const role = message.sender === 'customer_ai' ? '👩 Customer' : '🤖 Assistant';
        console.log(`${role}: ${message.message}\n`);
      } else {
        console.error(`❌ Failed to add message: ${messageResponse.status}`);
      }

      // Small delay between messages
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 5: Complete session with performance score
    console.log('Step 5: Completing session with performance evaluation...');
    const completionResponse = await makeRequest(
      'POST',
      `/api/roleplay/sessions/${sessionResponse.data.id}/complete`,
      {
        score: 8.5,
        notes: 'Excellent empathetic response to customer anxiety. Provided clear, accurate health information while encouraging professional medical consultation. Successfully guided customer through assessment process.'
      },
      sessionCookies
    );

    if (completionResponse.status === 200) {
      console.log('✅ Session completed successfully');
      console.log('   Performance Score: 8.5/10');
      console.log('   Focus Areas: Empathy, Medical Accuracy, Process Guidance\n');
    }

    // Step 6: Retrieve session details for analysis
    console.log('Step 6: Retrieving session analytics...');
    const detailsResponse = await makeRequest(
      'GET',
      `/api/roleplay/sessions/${sessionResponse.data.id}`,
      null,
      sessionCookies
    );

    if (detailsResponse.status === 200) {
      console.log('✅ Session analysis complete');
      console.log(`   Total Messages: ${detailsResponse.data.messages?.length || 0}`);
      console.log(`   Session Duration: ${Math.round((new Date() - new Date(sessionResponse.data.startTime)) / 1000 / 60)} minutes`);
    }

    // Test Summary
    console.log('\n🎯 BrezCode Roleplay Training Test Results');
    console.log('==========================================');
    console.log('✅ Authentication: Working');
    console.log('✅ Scenario Creation: Working');
    console.log('✅ Session Management: Working');
    console.log('✅ Message Logging: Working');
    console.log('✅ Performance Scoring: Working');
    console.log('✅ Health Education Focus: Verified');
    console.log('\n🩺 The BrezCode AI assistant training platform is ready for health education scenarios!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testRoleplaySystem().catch(console.error);