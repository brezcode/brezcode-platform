// Test authenticated redirect for BrezCode
import fetch from 'node-fetch';

const testAuthRedirect = async () => {
  console.log('🔐 Testing BrezCode Authentication Redirect');
  
  try {
    // Step 1: Login first
    console.log('\n1. Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'leedennyps@gmail.com',
        password: '11111111'
      })
    });
    
    const loginData = await loginResponse.json();
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('✅ Login success:', loginData.message);
    console.log('📄 Session cookie:', cookies);
    
    // Step 2: Test authenticated /brezcode route
    console.log('\n2. Testing /brezcode route with authentication...');
    const brezcodeResponse = await fetch('http://localhost:5000/brezcode', {
      method: 'GET',
      headers: {
        'Cookie': cookies
      },
      redirect: 'manual' // Don't follow redirects automatically
    });
    
    console.log('🌐 Response status:', brezcodeResponse.status);
    console.log('🔄 Response headers:', brezcodeResponse.headers.get('location'));
    
    if (brezcodeResponse.status === 302) {
      console.log('✅ SUCCESS: Authenticated user redirected to dashboard');
      console.log('📍 Redirect location:', brezcodeResponse.headers.get('location'));
    } else if (brezcodeResponse.status === 200) {
      console.log('❌ ISSUE: User shown landing page instead of redirect');
      const htmlPreview = (await brezcodeResponse.text()).substring(0, 200);
      console.log('📄 Content preview:', htmlPreview + '...');
    }
    
    // Step 3: Test unauthenticated /brezcode route
    console.log('\n3. Testing /brezcode route WITHOUT authentication...');
    const unauthResponse = await fetch('http://localhost:5000/brezcode', {
      method: 'GET'
    });
    
    console.log('🌐 Unauth response status:', unauthResponse.status);
    if (unauthResponse.status === 200) {
      console.log('✅ SUCCESS: Unauthenticated user shown landing page');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAuthRedirect();