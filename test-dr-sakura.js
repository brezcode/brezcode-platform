import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testDrSakuraSpecifically() {
  console.log('🩺 Testing Dr. Sakura Wellness Avatar Specifically');
  console.log('================================================');
  
  try {
    // Test 1: Verify Dr. Sakura avatar exists
    console.log('\n1. Testing avatar availability...');
    const avatarResponse = await axios.get(`${BASE_URL}/api/business-avatars/business-type/health_coaching`);
    
    if (avatarResponse.data && avatarResponse.data.avatars) {
      const drSakura = avatarResponse.data.avatars.find(avatar => 
        avatar.id === 'health_sakura' || avatar.name.includes('Sakura')
      );
      
      if (drSakura) {
        console.log('✅ Dr. Sakura found:', drSakura.name);
      } else {
        console.log('❌ Dr. Sakura not found in avatar list');
        console.log('Available avatars:', avatarResponse.data.avatars.map(a => a.name));
      }
    }
    
    // Test 2: Start session with Dr. Sakura using direct API
    console.log('\n2. Starting training session with Dr. Sakura...');
    const sessionResponse = await axios.post(`${BASE_URL}/direct-api/training/start`, {
      avatarId: 'health_sakura',
      customerId: 'anxious_small_business',
      scenario: 'initial_inquiry'
    });
    
    console.log('✅ Session started:', sessionResponse.data.id);
    console.log('Initial message:', sessionResponse.data.messages[0]?.content);
    
    const sessionId = sessionResponse.data.id;
    
    // Test 3: Continue conversation multiple times
    console.log('\n3. Testing conversation continuation...');
    for (let i = 1; i <= 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const continueResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/continue`);
      console.log(`Turn ${i}: ${continueResponse.data.messages?.length || 0} messages`);
      
      if (continueResponse.data.messages) {
        continueResponse.data.messages.forEach(msg => {
          console.log(`  ${msg.role}: ${msg.content.substring(0, 60)}...`);
        });
      }
    }
    
    // Test 4: Check performance metrics
    console.log('\n4. Performance metrics:');
    const finalResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/continue`);
    if (finalResponse.data.performance_metrics) {
      const metrics = finalResponse.data.performance_metrics;
      console.log(`  Response Quality: ${metrics.response_quality}%`);
      console.log(`  Customer Satisfaction: ${metrics.customer_satisfaction}%`);
      console.log(`  Goal Achievement: ${metrics.goal_achievement}%`);
      console.log(`  Conversation Flow: ${metrics.conversation_flow}%`);
    }
    
    // Test 5: Stop session
    console.log('\n5. Stopping training session...');
    const stopResponse = await axios.post(`${BASE_URL}/direct-api/training/${sessionId}/stop`);
    console.log('✅ Session stopped, duration:', stopResponse.data.duration, 'seconds');
    
    // Test 6: Test with BrezCode-specific API routes
    console.log('\n6. Testing BrezCode avatar training API...');
    try {
      const brezCodeResponse = await axios.post(`${BASE_URL}/api/avatar-training/sessions/start`, {
        avatarId: 'health_sakura',
        customerId: 'anxious_health_patient',
        scenario: 'breast_health_inquiry'
      });
      console.log('✅ BrezCode API session started:', brezCodeResponse.data);
    } catch (error) {
      console.log('❌ BrezCode API issue:', error.response?.data || error.message);
    }
    
    console.log('\n🎉 Dr. Sakura testing completed successfully!');
    
  } catch (error) {
    console.log('❌ Error testing Dr. Sakura:', error.response?.data || error.message);
    console.log('Full error:', error);
  }
}

// Test specifically with health scenarios
async function testHealthScenarios() {
  console.log('\n🏥 Testing Health-Specific Scenarios');
  console.log('====================================');
  
  const healthScenarios = [
    'breast_health_screening',
    'wellness_consultation', 
    'health_anxiety_support',
    'preventive_care_guidance',
    'nutrition_counseling'
  ];
  
  for (const scenario of healthScenarios) {
    try {
      console.log(`\nTesting scenario: ${scenario}`);
      const response = await axios.post(`${BASE_URL}/direct-api/training/start`, {
        avatarId: 'health_sakura',
        customerId: 'anxious_small_business',
        scenario: scenario
      });
      console.log('✅ Scenario works:', response.data.id);
    } catch (error) {
      console.log(`❌ Scenario failed: ${scenario}`, error.response?.data || error.message);
    }
  }
}

testDrSakuraSpecifically();
testHealthScenarios();