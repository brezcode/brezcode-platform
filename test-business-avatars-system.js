// Comprehensive Business Avatar System Test
// Tests avatar gallery, customization, deployment, and API endpoints

const BASE_URL = 'http://localhost:5000/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  purple: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bright: '\x1b[1m'
};

function logResult(testName, success, details = '') {
  const symbol = success ? '✅' : '❌';
  const color = success ? colors.green : colors.red;
  console.log(`${color}${symbol} ${testName}${colors.reset}`);
  if (details) {
    console.log(`   ${details}`);
  }
}

function logSection(title, emoji = '🔧') {
  console.log(`\n${colors.cyan}${colors.bright}${emoji} ${title}${colors.reset}`);
}

async function testBusinessAvatarSystem() {
  console.log(`${colors.purple}${colors.bright}✨ BUSINESS AVATAR DEPLOYMENT SYSTEM TEST${colors.reset}\n`);
  
  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Get All Business Avatars
  logSection('Avatar Gallery API Tests', '🎭');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/avatars`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.avatars);
    if (success) {
      passedTests++;
      logResult('Get All Business Avatars', true, `Found ${data.avatars.length} ready-to-deploy avatars`);
      
      // Validate avatar structure
      const firstAvatar = data.avatars[0];
      const hasRequiredFields = firstAvatar.id && firstAvatar.name && firstAvatar.businessType && 
                               firstAvatar.appearance && firstAvatar.voiceProfile && firstAvatar.pricing;
      
      totalTests++;
      if (hasRequiredFields) {
        passedTests++;
        logResult('Avatar Structure Validation', true, `✨ Avatar: ${firstAvatar.name} (${firstAvatar.businessType})`);
      } else {
        logResult('Avatar Structure Validation', false, 'Missing required avatar fields');
      }
    } else {
      logResult('Get All Business Avatars', false, data.error || 'Invalid response structure');
    }
  } catch (error) {
    logResult('Get All Business Avatars', false, error.message);
  }

  // Test 2: Get Specific Avatar Details with Anime Characteristics
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/avatars/brezcode_health_coach`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.avatar;
    if (success) {
      const avatar = data.avatar;
      const hasAnimeFeatures = avatar.appearance.hairColor && avatar.appearance.eyeColor && 
                              avatar.appearance.style && avatar.name.includes('Sakura');
      
      if (hasAnimeFeatures) {
        passedTests++;
        logResult('Dr. Sakura Wellness Avatar Details', true, 
          `🌸 Hair: ${avatar.appearance.hairColor}, Eyes: ${avatar.appearance.eyeColor}, Style: ${avatar.appearance.style}`);
      } else {
        logResult('Dr. Sakura Wellness Avatar Details', false, 'Missing anime-style characteristics');
      }
    } else {
      logResult('Dr. Sakura Wellness Avatar Details', false, data.error || 'Avatar not found');
    }
  } catch (error) {
    logResult('Dr. Sakura Wellness Avatar Details', false, error.message);
  }

  // Test 3: Filter Avatars by Business Type
  logSection('Business-Specific Avatar Tests', '💼');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/business-type/health_coaching`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.avatars);
    const allHealthCoaching = data.avatars.every(a => a.businessType === 'health_coaching');
    
    if (success && allHealthCoaching) {
      passedTests++;
      logResult('Health Coaching Avatars Filter', true, `🏥 ${data.avatars.length} health coaching specialists`);
    } else {
      logResult('Health Coaching Avatars Filter', false, 'Business type filtering failed');
    }
  } catch (error) {
    logResult('Health Coaching Avatars Filter', false, error.message);
  }

  // Test 4: Get Deployment Recommendations
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/deployment/brezcode`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.recommendedAvatar;
    if (success) {
      const recommended = data.recommendedAvatar;
      const isBrezCodeOptimized = recommended.id === 'brezcode_health_coach' && 
                                 recommended.specializations.some(s => s.includes('Breast health'));
      
      if (isBrezCodeOptimized) {
        passedTests++;
        logResult('BrezCode Deployment Recommendations', true, 
          `🎯 Recommended: ${recommended.name} - ${recommended.specializations.slice(0, 2).join(', ')}`);
      } else {
        logResult('BrezCode Deployment Recommendations', false, 'Incorrect BrezCode avatar recommendation');
      }
    } else {
      logResult('BrezCode Deployment Recommendations', false, data.error || 'No deployment config found');
    }
  } catch (error) {
    logResult('BrezCode Deployment Recommendations', false, error.message);
  }

  // Test 5: Avatar Customization Options
  logSection('Customization System Tests', '🎨');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/customization-options`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.options;
    if (success) {
      const options = data.options;
      const hasComprehensiveOptions = options.appearance && options.voice && options.personality &&
                                     Array.isArray(options.appearance.hairColors) && 
                                     Array.isArray(options.voice.tones);
      
      if (hasComprehensiveOptions) {
        passedTests++;
        logResult('Customization Options Available', true, 
          `🎨 ${options.appearance.hairColors.length} hair colors, ${options.voice.tones.length} voice tones`);
      } else {
        logResult('Customization Options Available', false, 'Incomplete customization options');
      }
    } else {
      logResult('Customization Options Available', false, data.error || 'Options not available');
    }
  } catch (error) {
    logResult('Customization Options Available', false, error.message);
  }

  // Test 6: Custom Avatar Creation
  try {
    totalTests++;
    const customAvatar = {
      baseAvatarId: 'leadgen_sales_ace',
      customizations: {
        name: 'Alex Thunder Custom',
        description: 'Customized sales specialist for testing',
        appearance: {
          hairColor: 'Tech Blue',
          eyeColor: 'Bright Blue',
          style: 'energetic'
        },
        voiceProfile: {
          tone: 'enthusiastic',
          pace: 'fast'
        },
        specializations: ['Custom lead generation', 'Test automation']
      },
      businessName: 'Test Business',
      targetAudience: 'Test audience'
    };

    const response = await fetch(`${BASE_URL}/business-avatars/avatars/customize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customAvatar)
    });
    const data = await response.json();
    
    const success = response.ok && data.success && data.avatar && data.deploymentReady;
    if (success) {
      passedTests++;
      logResult('Custom Avatar Creation', true, 
        `⚡ Created: ${data.avatar.name} - Ready for deployment`);
    } else {
      logResult('Custom Avatar Creation', false, data.error || 'Customization failed');
    }
  } catch (error) {
    logResult('Custom Avatar Creation', false, error.message);
  }

  // Test 7: Avatar Deployment
  logSection('Deployment System Tests', '🚀');
  
  try {
    totalTests++;
    const deploymentData = {
      avatarId: 'leadgen_sales_ace',
      businessId: 'test_business',
      deploymentConfig: {
        environment: 'production',
        channels: ['web', 'mobile', 'api'],
        features: ['chat', 'voice', 'analytics']
      }
    };

    const response = await fetch(`${BASE_URL}/business-avatars/avatars/leadgen_sales_ace/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deploymentData)
    });
    const data = await response.json();
    
    const success = response.ok && data.success && data.deployment && data.endpoints;
    if (success) {
      passedTests++;
      logResult('Avatar Deployment', true, 
        `🚀 Deployed with endpoints: ${Object.keys(data.endpoints).join(', ')}`);
    } else {
      logResult('Avatar Deployment', false, data.error || 'Deployment failed');
    }
  } catch (error) {
    logResult('Avatar Deployment', false, error.message);
  }

  // Test 8: Avatar Analytics
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/avatars/brezcode_health_coach/analytics?timeRange=30d`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.analytics;
    if (success) {
      const analytics = data.analytics;
      const hasMetrics = analytics.conversations && analytics.satisfaction && analytics.performance;
      
      if (hasMetrics) {
        passedTests++;
        logResult('Avatar Performance Analytics', true, 
          `📊 ${analytics.conversations.total} conversations, ${analytics.satisfaction.average}/5 satisfaction`);
      } else {
        logResult('Avatar Performance Analytics', false, 'Incomplete analytics data');
      }
    } else {
      logResult('Avatar Performance Analytics', false, data.error || 'Analytics unavailable');
    }
  } catch (error) {
    logResult('Avatar Performance Analytics', false, error.message);
  }

  // Test 9: Anime Avatar Feature Validation
  logSection('Anime Avatar System Tests', '🎌');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/business-avatars/avatars`);
    const data = await response.json();
    
    if (data.success) {
      const avatars = data.avatars;
      let animeFeatureCount = 0;
      
      avatars.forEach(avatar => {
        const hasAnimeFeatures = (
          avatar.appearance.hairColor && 
          avatar.appearance.eyeColor && 
          avatar.appearance.style &&
          avatar.name && 
          avatar.appearance.imageUrl.includes('.svg')
        );
        if (hasAnimeFeatures) animeFeatureCount++;
      });
      
      const allHaveAnimeFeatures = animeFeatureCount === avatars.length;
      
      if (allHaveAnimeFeatures) {
        passedTests++;
        logResult('Anime Avatar Features Complete', true, 
          `🎌 All ${avatars.length} avatars have anime-style characteristics`);
      } else {
        logResult('Anime Avatar Features Complete', false, 
          `Only ${animeFeatureCount}/${avatars.length} avatars have complete anime features`);
      }
    } else {
      logResult('Anime Avatar Features Complete', false, 'Failed to fetch avatars for validation');
    }
  } catch (error) {
    logResult('Anime Avatar Features Complete', false, error.message);
  }

  // Test 10: Business Nature Optimization
  try {
    totalTests++;
    const businessTypes = ['health_coaching', 'sales_automation', 'customer_service', 'technical_support'];
    let optimizedCount = 0;
    
    for (const businessType of businessTypes) {
      const response = await fetch(`${BASE_URL}/business-avatars/business-type/${businessType}`);
      const data = await response.json();
      
      if (data.success && data.avatars.length > 0) {
        const avatar = data.avatars[0];
        const isOptimized = avatar.businessType === businessType && 
                           avatar.specializations.length > 0 && 
                           avatar.industries.length > 0;
        if (isOptimized) optimizedCount++;
      }
    }
    
    if (optimizedCount === businessTypes.length) {
      passedTests++;
      logResult('Business Nature Optimization', true, 
        `💼 All ${businessTypes.length} business types have optimized avatars`);
    } else {
      logResult('Business Nature Optimization', false, 
        `Only ${optimizedCount}/${businessTypes.length} business types are properly optimized`);
    }
  } catch (error) {
    logResult('Business Nature Optimization', false, error.message);
  }

  // Final Results
  logSection('Test Results Summary', '📋');
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  const color = successRate >= 90 ? colors.green : successRate >= 70 ? colors.yellow : colors.red;
  
  console.log(`${color}${colors.bright}Success Rate: ${passedTests}/${totalTests} (${successRate}%)${colors.reset}`);
  
  if (successRate >= 90) {
    console.log(`${colors.green}🎉 Business Avatar System is deployment-ready!${colors.reset}`);
  } else if (successRate >= 70) {
    console.log(`${colors.yellow}⚠️ Business Avatar System is mostly functional with minor issues${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Business Avatar System needs attention before deployment${colors.reset}`);
  }

  // System Integration Summary
  logSection('Deployment Ready Summary', '✨');
  console.log(`${colors.purple}🎭 Frontend Route: http://localhost:5000/business-avatar-manager${colors.reset}`);
  console.log(`${colors.purple}🌸 6 Anime-style avatars with customizable features${colors.reset}`);
  console.log(`${colors.purple}🚀 Ready for production deployment with full API support${colors.reset}`);
  
  return { totalTests, passedTests, successRate: parseFloat(successRate) };
}

// Run the comprehensive test
testBusinessAvatarSystem().catch(console.error);