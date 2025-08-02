
import fetch from 'node-fetch';

async function testEmailVerification() {
  console.log('🧪 Testing BrezCode Email Verification Flow...');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testUser = {
    firstName: "Test",
    lastName: "User", 
    email: testEmail,
    password: "password123",
    subscriptionTier: "basic"
  };
  
  try {
    // 1. Test signup
    console.log('1. Testing signup...');
    const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    const signupData = await signupResponse.json();
    console.log('📡 Signup response status:', signupResponse.status);
    console.log('📝 Signup response:', signupData);
    
    if (signupResponse.ok && signupData.requiresVerification) {
      console.log('✅ Signup successful, verification required');
      
      // 2. Test resend verification 
      console.log('2. Testing resend verification...');
      const resendResponse = await fetch('http://localhost:5000/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      });
      
      const resendData = await resendResponse.json();
      console.log('📡 Resend response status:', resendResponse.status);
      console.log('📝 Resend response:', resendData);
      
      // 3. Test verification with dummy code
      console.log('3. Testing verification (will fail with dummy code)...');
      const verifyResponse = await fetch('http://localhost:5000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail, code: "123456" })
      });
      
      const verifyData = await verifyResponse.json();
      console.log('📡 Verify response status:', verifyResponse.status);
      console.log('📝 Verify response:', verifyData);
      
      if (verifyResponse.status === 400) {
        console.log('✅ Verification correctly rejected invalid code');
      }
    } else {
      console.log('❌ Signup failed:', signupData.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
  
  console.log('🎉 Email verification test completed!');
}

testEmailVerification();
