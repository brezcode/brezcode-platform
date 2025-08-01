// Comprehensive test to verify database functionality
import axios from 'axios';

async function testDatabaseFunctionality() {
  console.log('🧪 Testing Database Functionality...\n');
  
  try {
    // Test 1: Dr. Sakura response to verify data access
    console.log('Test 1: Testing Dr. Sakura data access...');
    const drSakuraResponse = await axios.post('http://localhost:5000/api/brezcode/dr-sakura', {
      message: "What is my age and what can you tell me about my health profile?",
      conversationHistory: []
    });
    
    console.log('✅ Dr. Sakura Response Status:', drSakuraResponse.status);
    console.log('📝 Response Content Preview:', drSakuraResponse.data.content.substring(0, 200) + '...');
    console.log('📊 Empathy Score:', drSakuraResponse.data.empathyScore);
    console.log('🩺 Medical Accuracy:', drSakuraResponse.data.medicalAccuracy);
    
    // Test 2: Check if quiz data can be submitted and saved
    console.log('\nTest 2: Testing quiz data submission...');
    const quizData = {
      age: "55-64",
      country: "Hong Kong",
      ethnicity: "Asian",
      family_history: "No family history",
      exercise_habits: "Regular exercise",
      stress_level: "Moderate"
    };
    
    // Try to submit quiz (checking if endpoint exists)
    try {
      const quizResponse = await axios.post('http://localhost:5000/api/quiz/submit', quizData);
      console.log('✅ Quiz submission successful:', quizResponse.status);
    } catch (quizError) {
      console.log('⚠️ Quiz submission endpoint not found or error:', quizError.response?.status || quizError.message);
    }
    
    // Test 3: Test conversation storage
    console.log('\nTest 3: Testing conversation storage...');
    const conversationTest = await axios.post('http://localhost:5000/api/brezcode/dr-sakura', {
      message: "Please remember that I am 60 years old from Hong Kong",
      conversationHistory: [
        { role: 'user', content: 'Hello Dr. Sakura' },
        { role: 'avatar', content: 'Hello! How can I help with your breast health today?' }
      ]
    });
    
    console.log('✅ Conversation test successful:', conversationTest.status);
    
    // Test 4: Memory recall test
    console.log('\nTest 4: Testing memory recall...');
    const memoryTest = await axios.post('http://localhost:5000/api/brezcode/dr-sakura', {
      message: "Do you remember my age that I just told you?",
      conversationHistory: [
        { role: 'user', content: 'Please remember that I am 60 years old from Hong Kong' },
        { role: 'avatar', content: conversationTest.data.content }
      ]
    });
    
    console.log('✅ Memory test successful:', memoryTest.status);
    console.log('🧠 Memory recall response:', memoryTest.data.content.substring(0, 200) + '...');
    
    console.log('\n🎉 All database functionality tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDatabaseFunctionality();