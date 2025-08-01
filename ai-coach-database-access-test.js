// Test AI Coach Database Access Functionality
import axios from 'axios';

const baseURL = 'http://localhost:5000';

async function testAICoachDatabaseAccess() {
  console.log('🤖 TESTING AI COACH DATABASE ACCESS\n');

  // Test users with known data
  const testUsers = [
    { id: 9, description: "60-year-old Hong Kong user with moderate risk" },
    { id: 10, description: "50-54 USA user with family history, high risk" }
  ];

  for (const user of testUsers) {
    console.log(`=== Testing User ${user.id}: ${user.description} ===`);
    
    try {
      // Test 1: Specific data retrieval
      console.log('Test 1: Asking for specific personal data...');
      const response1 = await axios.post(`${baseURL}/api/brezcode/avatar/dr-sakura/chat`, {
        userId: user.id,
        message: "Tell me my exact age, country, family history status, and risk score. Be very specific with numbers.",
        conversationHistory: []
      });
      
      console.log('✅ Response received');
      console.log('   Dr. Sakura said:', response1.data.response.content.substring(0, 200) + '...');
      console.log('   Quality scores:', response1.data.response.qualityScores);
      
      // Test 2: Personalized recommendations
      console.log('\nTest 2: Asking for personalized recommendations...');
      const response2 = await axios.post(`${baseURL}/api/brezcode/avatar/dr-sakura/chat`, {
        userId: user.id,
        message: "Based on my specific profile, what screening schedule should I follow?",
        conversationHistory: []
      });
      
      console.log('✅ Personalized recommendations received');
      console.log('   Recommendation preview:', response2.data.response.content.substring(0, 150) + '...');
      
      // Test 3: Risk factor analysis
      console.log('\nTest 3: Risk factor analysis...');
      const response3 = await axios.post(`${baseURL}/api/brezcode/avatar/dr-sakura/chat`, {
        userId: user.id,
        message: "Analyze my specific risk factors from my quiz answers and explain why I have this risk level.",
        conversationHistory: []
      });
      
      console.log('✅ Risk analysis received');
      console.log('   Analysis preview:', response3.data.response.content.substring(0, 150) + '...');
      
    } catch (error) {
      console.log('❌ Error testing user', user.id, ':', error.message);
    }
    
    console.log(''); // Empty line between users
  }
  
  console.log('🎉 AI COACH DATABASE ACCESS TEST COMPLETED');
}

// Run the test
testAICoachDatabaseAccess().catch(console.error);