// Comprehensive Avatar Training System Test
// Tests all avatar types, scenarios, and API endpoints

const BASE_URL = 'http://localhost:5000/api';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

function logSection(title) {
  console.log(`\n${colors.blue}${colors.bright}=== ${title} ===${colors.reset}`);
}

async function testAvatarTrainingSystem() {
  console.log(`${colors.blue}${colors.bright}🤖 AI AVATAR TRAINING SYSTEM COMPREHENSIVE TEST${colors.reset}\n`);
  
  let totalTests = 0;
  let passedTests = 0;

  // Test 1: Get All Avatar Types
  logSection('Avatar Types API Tests');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/avatar-types`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.avatarTypes);
    if (success) {
      passedTests++;
      logResult('Get All Avatar Types', true, `Found ${data.avatarTypes.length} avatar types`);
      
      // Validate avatar type structure
      const firstAvatar = data.avatarTypes[0];
      const hasRequiredFields = firstAvatar.id && firstAvatar.name && firstAvatar.description && 
                               Array.isArray(firstAvatar.primarySkills) && Array.isArray(firstAvatar.industries);
      
      totalTests++;
      if (hasRequiredFields) {
        passedTests++;
        logResult('Avatar Type Structure Validation', true, `Valid fields: ${Object.keys(firstAvatar).join(', ')}`);
      } else {
        logResult('Avatar Type Structure Validation', false, 'Missing required fields');
      }
    } else {
      logResult('Get All Avatar Types', false, data.error || 'Invalid response structure');
    }
  } catch (error) {
    logResult('Get All Avatar Types', false, error.message);
  }

  // Test 2: Get Specific Avatar Type Details
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/avatar-types/sales_specialist`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.avatarType && Array.isArray(data.scenarios);
    if (success) {
      passedTests++;
      logResult('Get Specific Avatar Type', true, `Sales specialist with ${data.scenarios.length} scenarios`);
    } else {
      logResult('Get Specific Avatar Type', false, data.error || 'Invalid response');
    }
  } catch (error) {
    logResult('Get Specific Avatar Type', false, error.message);
  }

  // Test 3: Get All Training Scenarios
  logSection('Training Scenarios API Tests');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/scenarios`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.scenarios);
    if (success) {
      passedTests++;
      logResult('Get All Scenarios', true, `Found ${data.scenarios.length} training scenarios`);
      
      // Validate scenario structure
      const firstScenario = data.scenarios[0];
      const hasRequiredFields = firstScenario.id && firstScenario.name && firstScenario.avatarType && 
                               firstScenario.customerPersona && Array.isArray(firstScenario.objectives);
      
      totalTests++;
      if (hasRequiredFields) {
        passedTests++;
        logResult('Scenario Structure Validation', true, `Valid scenario fields present`);
      } else {
        logResult('Scenario Structure Validation', false, 'Missing required scenario fields');
      }
    } else {
      logResult('Get All Scenarios', false, data.error || 'Invalid response structure');
    }
  } catch (error) {
    logResult('Get All Scenarios', false, error.message);
  }

  // Test 4: Filter Scenarios by Avatar Type
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/scenarios?avatarType=customer_service`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.scenarios);
    const allCorrectType = data.scenarios.every(s => s.avatarType === 'customer_service');
    
    if (success && allCorrectType) {
      passedTests++;
      logResult('Filter Scenarios by Avatar Type', true, `${data.scenarios.length} customer service scenarios`);
    } else {
      logResult('Filter Scenarios by Avatar Type', false, 'Filtering not working correctly');
    }
  } catch (error) {
    logResult('Filter Scenarios by Avatar Type', false, error.message);
  }

  // Test 5: Filter Scenarios by Difficulty
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/scenarios?difficulty=beginner`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.scenarios);
    const allBeginner = data.scenarios.every(s => s.difficulty === 'beginner');
    
    if (success && allBeginner) {
      passedTests++;
      logResult('Filter Scenarios by Difficulty', true, `${data.scenarios.length} beginner scenarios`);
    } else {
      logResult('Filter Scenarios by Difficulty', false, 'Difficulty filtering not working');
    }
  } catch (error) {
    logResult('Filter Scenarios by Difficulty', false, error.message);
  }

  // Test 6: Get Training Recommendations
  logSection('Training Recommendation Tests');
  
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/recommendations/health_coach?skillLevel=intermediate`);
    const data = await response.json();
    
    const success = response.ok && data.success && data.trainingPath && 
                   Array.isArray(data.trainingPath.recommendedScenarios);
    
    if (success) {
      passedTests++;
      logResult('Get Training Recommendations', true, 
        `${data.trainingPath.recommendedScenarios.length} recommendations, ${data.trainingPath.estimatedTrainingTime} min total`);
    } else {
      logResult('Get Training Recommendations', false, data.error || 'Invalid training path');
    }
  } catch (error) {
    logResult('Get Training Recommendations', false, error.message);
  }

  // Test 7: Get Industry-Specific Training
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/industry-training/Healthcare`);
    const data = await response.json();
    
    const success = response.ok && data.success && Array.isArray(data.relevantAvatars) && 
                   Array.isArray(data.industryScenarios);
    
    if (success) {
      passedTests++;
      logResult('Get Industry Training Options', true, 
        `${data.relevantAvatars.length} relevant avatars, ${data.industryScenarios.length} scenarios for Healthcare`);
    } else {
      logResult('Get Industry Training Options', false, data.error || 'Invalid industry data');
    }
  } catch (error) {
    logResult('Get Industry Training Options', false, error.message);
  }

  // Test 8: Create Custom Scenario
  try {
    totalTests++;
    const customScenario = {
      avatarType: 'sales_specialist',
      name: 'Test Custom Scenario',
      description: 'A test scenario for validation',
      customerPersona: 'Test customer persona',
      customerMood: 'neutral',
      objectives: ['Test objective 1', 'Test objective 2'],
      timeframeMins: 15,
      difficulty: 'intermediate',
      industry: 'Technology'
    };

    const response = await fetch(`${BASE_URL}/avatar-training/scenarios/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customScenario)
    });
    const data = await response.json();
    
    const success = response.ok && data.success && data.scenario && data.scenario.id.startsWith('custom_');
    
    if (success) {
      passedTests++;
      logResult('Create Custom Scenario', true, `Custom scenario created with ID: ${data.scenario.id}`);
    } else {
      logResult('Create Custom Scenario', false, data.error || 'Failed to create custom scenario');
    }
  } catch (error) {
    logResult('Create Custom Scenario', false, error.message);
  }

  // Test 9: Avatar Type Coverage Test
  logSection('System Coverage Analysis');
  
  try {
    totalTests++;
    const avatarTypesResponse = await fetch(`${BASE_URL}/avatar-training/avatar-types`);
    const avatarData = await avatarTypesResponse.json();
    
    const scenariosResponse = await fetch(`${BASE_URL}/avatar-training/scenarios`);
    const scenarioData = await scenariosResponse.json();
    
    if (avatarData.success && scenarioData.success) {
      const avatarTypes = avatarData.avatarTypes.map(a => a.id);
      const scenarioAvatars = [...new Set(scenarioData.scenarios.map(s => s.avatarType))];
      
      const coverageComplete = avatarTypes.every(type => scenarioAvatars.includes(type));
      
      if (coverageComplete) {
        passedTests++;
        logResult('Avatar Type Coverage', true, `All ${avatarTypes.length} avatar types have training scenarios`);
      } else {
        const missing = avatarTypes.filter(type => !scenarioAvatars.includes(type));
        logResult('Avatar Type Coverage', false, `Missing scenarios for: ${missing.join(', ')}`);
      }
    } else {
      logResult('Avatar Type Coverage', false, 'Failed to fetch data for coverage analysis');
    }
  } catch (error) {
    logResult('Avatar Type Coverage', false, error.message);
  }

  // Test 10: Scenario Quality Validation
  try {
    totalTests++;
    const response = await fetch(`${BASE_URL}/avatar-training/scenarios`);
    const data = await response.json();
    
    if (data.success) {
      const scenarios = data.scenarios;
      let qualityIssues = [];
      
      scenarios.forEach(scenario => {
        if (!scenario.successCriteria || scenario.successCriteria.length === 0) {
          qualityIssues.push(`${scenario.name}: Missing success criteria`);
        }
        if (!scenario.keyLearningPoints || scenario.keyLearningPoints.length === 0) {
          qualityIssues.push(`${scenario.name}: Missing learning points`);
        }
        if (scenario.timeframeMins < 5 || scenario.timeframeMins > 60) {
          qualityIssues.push(`${scenario.name}: Unusual timeframe (${scenario.timeframeMins} min)`);
        }
      });
      
      if (qualityIssues.length === 0) {
        passedTests++;
        logResult('Scenario Quality Validation', true, `All ${scenarios.length} scenarios meet quality standards`);
      } else {
        logResult('Scenario Quality Validation', false, `${qualityIssues.length} quality issues found`);
        qualityIssues.slice(0, 3).forEach(issue => console.log(`   ⚠️ ${issue}`));
      }
    } else {
      logResult('Scenario Quality Validation', false, 'Failed to fetch scenarios for quality check');
    }
  } catch (error) {
    logResult('Scenario Quality Validation', false, error.message);
  }

  // Final Results
  logSection('Test Results Summary');
  
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  const color = successRate >= 90 ? colors.green : successRate >= 70 ? colors.yellow : colors.red;
  
  console.log(`${color}${colors.bright}Success Rate: ${passedTests}/${totalTests} (${successRate}%)${colors.reset}`);
  
  if (successRate >= 90) {
    console.log(`${colors.green}🎉 Avatar Training System is working excellently!${colors.reset}`);
  } else if (successRate >= 70) {
    console.log(`${colors.yellow}⚠️ Avatar Training System is mostly functional with some issues${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Avatar Training System has significant issues that need attention${colors.reset}`);
  }

  // Test System Integration
  logSection('Integration Test');
  console.log(`${colors.blue}🔗 Frontend Route: http://localhost:5000/avatar-training-setup${colors.reset}`);
  console.log(`${colors.blue}📱 Ready for roleplay training integration${colors.reset}`);
  
  return { totalTests, passedTests, successRate: parseFloat(successRate) };
}

// Run the comprehensive test
testAvatarTrainingSystem().catch(console.error);