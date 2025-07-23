import fetch from 'node-fetch';

// Test configuration
const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'leedennyps@gmail.com',
  password: '11111111'
};

// Test results tracking
let testResults = [];
let sessionCookie = '';

function logResult(testName, success, details = '') {
  const result = { testName, success, details, timestamp: new Date().toISOString() };
  testResults.push(result);
  console.log(`${success ? '✅' : '❌'} ${testName}: ${details}`);
}

async function authenticateUser() {
  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(TEST_USER)
    });
    
    if (response.ok) {
      const cookies = response.headers.get('set-cookie');
      sessionCookie = cookies || '';
      logResult('User Authentication', true, 'Successfully logged in');
      return true;
    } else {
      logResult('User Authentication', false, `Login failed: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('User Authentication', false, `Authentication error: ${error.message}`);
    return false;
  }
}

async function testBrezCodeBusinessProfileSubmission() {
  const businessProfileData = {
    businessName: "BrezCode Health Solutions",
    businessDescription: "AI-powered breast health assessment platform providing comprehensive health coaching and educational resources for women's wellness and preventive care.",
    targetAudience: "Women aged 20-65 interested in breast health awareness, preventive care, and health education",
    serviceOfferings: "Comprehensive breast health assessments, AI-powered health coaching, personalized wellness plans, educational content library, health tracking tools, medical reference materials",
    businessGoals: "Increase breast health awareness, improve early detection rates, provide accessible health education, build trusted health community, reduce healthcare disparities",
    marketingChannels: "Social media campaigns, health blogs, medical partnerships, wellness events, SEO content marketing, healthcare provider referrals",
    competitiveAdvantage: "AI-powered personalized assessments, evidence-based medical content, comprehensive health coaching, user-friendly platform, medical accuracy validation",
    businessStage: "growth",
    monthlyRevenue: "10k-25k",  
    teamSize: "5-10",
    primaryChallenges: "User acquisition in sensitive health market, maintaining medical content accuracy, building trust with health topics, regulatory compliance, competition with established health platforms",
    successMetrics: "User engagement rates, assessment completion rates, health outcome improvements, customer satisfaction scores, repeat usage, referral rates",
    businessType: "brezcode"
  };

  try {
    const response = await fetch(`${BASE_URL}/api/business/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify(businessProfileData)
    });

    if (response.ok) {
      const result = await response.json();
      logResult('BrezCode Business Profile Submission', true, `Profile saved with ID: ${result.profileId}`);
      return true;
    } else {
      const error = await response.text();
      logResult('BrezCode Business Profile Submission', false, `Failed: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    logResult('BrezCode Business Profile Submission', false, `Error: ${error.message}`);
    return false;
  }
}

async function testBrezCodeStrategyGeneration() {
  try {
    const response = await fetch(`${BASE_URL}/api/business/generate-strategies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({ profileId: 'brezcode-test-profile' })
    });

    if (response.ok) {
      const result = await response.json();
      const hasStrategies = result.strategies && result.strategies.length > 0;
      logResult('BrezCode Strategy Generation', hasStrategies, 
        `Generated ${result.strategiesCount} strategies: ${result.strategies.map(s => s.title).join(', ')}`);
      return hasStrategies;
    } else {
      const error = await response.text();
      logResult('BrezCode Strategy Generation', false, `Failed: ${response.status} - ${error}`);
      return false;
    }
  } catch (error) {
    logResult('BrezCode Strategy Generation', false, `Error: ${error.message}`);
    return false;
  }
}

async function testBrezCodeDashboardNavigation() {
  try {
    // Test if BrezCode dashboard is accessible
    const response = await fetch(`${BASE_URL}/business/brezcode/dashboard`, {
      method: 'GET',
      headers: { 'Cookie': sessionCookie }
    });

    if (response.status === 200 || response.status === 304) {
      logResult('BrezCode Dashboard Access', true, 'Dashboard page accessible');
      return true;
    } else {
      logResult('BrezCode Dashboard Access', false, `Dashboard not accessible: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('BrezCode Dashboard Access', false, `Error: ${error.message}`);
    return false;
  }
}

async function testBrezCodeProfileNavigation() {
  try {
    // Test if BrezCode business profile page is accessible
    const response = await fetch(`${BASE_URL}/business/brezcode/profile`, {
      method: 'GET',
      headers: { 'Cookie': sessionCookie }
    });

    if (response.status === 200 || response.status === 304) {
      logResult('BrezCode Profile Page Access', true, 'Business profile page accessible');
      return true;
    } else {
      logResult('BrezCode Profile Page Access', false, `Profile page not accessible: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('BrezCode Profile Page Access', false, `Error: ${error.message}`);
    return false;
  }
}

async function testFormValidation() {
  // Test with incomplete data to verify validation
  const incompleteData = {
    businessName: "",  // Missing required field
    businessDescription: "Test"  // Too short
  };

  try {
    const response = await fetch(`${BASE_URL}/api/business/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify(incompleteData)
    });

    // Should return error for incomplete data
    if (!response.ok) {
      logResult('Form Validation', true, 'Properly rejected incomplete business profile data');
      return true;
    } else {
      logResult('Form Validation', false, 'Should have rejected incomplete data');
      return false;
    }
  } catch (error) {
    logResult('Form Validation', false, `Error: ${error.message}`);
    return false;
  }
}

async function runBrezCodeBusinessProfileTests() {
  console.log('🧪 Starting BrezCode Business Profile Tests...\n');
  
  // Step 1: Authenticate
  const authSuccess = await authenticateUser();
  if (!authSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  // Step 2: Test business profile submission
  await testBrezCodeBusinessProfileSubmission();
  
  // Step 3: Test strategy generation
  await testBrezCodeStrategyGeneration();
  
  // Step 4: Test dashboard navigation
  await testBrezCodeDashboardNavigation();
  
  // Step 5: Test profile page navigation
  await testBrezCodeProfileNavigation();
  
  // Step 6: Test form validation
  await testFormValidation();

  // Summary
  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.success).length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(2);
  
  console.log('\n📊 BrezCode Business Profile Test Summary:');
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${totalTests - passedTests}`);
  console.log(`Success Rate: ${successRate}%`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All BrezCode business profile tests passed!');
  } else {
    console.log('⚠️  Some tests failed. Review the details above.');
  }
  
  return {
    totalTests,
    passedTests,
    successRate: parseFloat(successRate),
    results: testResults
  };
}

// Run the tests
runBrezCodeBusinessProfileTests().catch(console.error);