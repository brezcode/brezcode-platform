/**
 * Comprehensive Avatar Integration Testing Platform
 * Tests both business and personal avatar systems with proper dashboard integration
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AvatarIntegrationTester {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.serverUrl = 'http://localhost:5000';
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logMessage);
    
    this.results.push({
      timestamp,
      type,
      message,
      test: this.currentTest || 'setup'
    });
  }

  async runTest(testName, testFn) {
    this.currentTest = testName;
    this.totalTests++;
    
    try {
      await this.log(`Starting test: ${testName}`);
      await testFn();
      this.passedTests++;
      await this.log(`✅ PASSED: ${testName}`, 'success');
      return true;
    } catch (error) {
      await this.log(`❌ FAILED: ${testName} - ${error.message}`, 'error');
      return false;
    }
  }

  async testServerHealth() {
    const response = await fetch(`${this.serverUrl}/api/me`);
    if (response.status !== 401) {
      throw new Error(`Expected 401 status, got ${response.status}`);
    }
    await this.log('Server responding correctly with authentication required');
  }

  async testBusinessAvatarRoutes() {
    // Test business avatar API endpoints
    const endpoints = [
      '/api/business-avatars/avatars',
      '/api/business-avatars/customization-options'
    ];

    for (const endpoint of endpoints) {
      const response = await fetch(`${this.serverUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Business avatar endpoint ${endpoint} failed: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Business avatar endpoint ${endpoint} returned HTML instead of JSON`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Business avatar endpoint ${endpoint} returned unsuccessful response`);
      }
      await this.log(`Business avatar endpoint ${endpoint} working correctly`);
    }
  }

  async testPersonalAvatarRoutes() {
    // Test personal avatar API endpoints
    const endpoints = [
      '/api/personal-avatars/avatars',
      '/api/personal-avatars/customization-options'
    ];

    for (const endpoint of endpoints) {
      const response = await fetch(`${this.serverUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`Personal avatar endpoint ${endpoint} failed: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Personal avatar endpoint ${endpoint} returned HTML instead of JSON`);
      }
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Personal avatar endpoint ${endpoint} returned unsuccessful response`);
      }
      await this.log(`Personal avatar endpoint ${endpoint} working correctly`);
    }
  }

  async testBusinessAvatarData() {
    const response = await fetch(`${this.serverUrl}/api/business-avatars/avatars`);
    const data = await response.json();
    
    if (!data.avatars || !Array.isArray(data.avatars)) {
      throw new Error('Business avatars data not properly structured');
    }

    const expectedAvatars = [
      'sales_specialist_alex',
      'customer_service_miko', 
      'tech_support_kai',
      'business_consultant_luna',
      'brezcode_health_coach',
      'education_professor'
    ];

    for (const expectedId of expectedAvatars) {
      const avatar = data.avatars.find(a => a.id === expectedId);
      if (!avatar) {
        throw new Error(`Missing business avatar: ${expectedId}`);
      }
      
      // Check required fields
      const requiredFields = ['name', 'businessType', 'expertise', 'industries', 'pricing'];
      for (const field of requiredFields) {
        if (!avatar[field]) {
          throw new Error(`Business avatar ${expectedId} missing required field: ${field}`);
        }
      }
      
      await this.log(`Business avatar ${avatar.name} data structure validated`);
    }
  }

  async testPersonalAvatarData() {
    const response = await fetch(`${this.serverUrl}/api/personal-avatars/avatars`);
    const data = await response.json();
    
    if (!data.avatars || !Array.isArray(data.avatars)) {
      throw new Error('Personal avatars data not properly structured');
    }

    const expectedAvatars = [
      'travel_planner_maya',
      'wellness_coach_zen',
      'fitness_trainer_max',
      'nutritionist_sage',
      'counselor_harmony',
      'spiritual_guide_luna'
    ];

    for (const expectedId of expectedAvatars) {
      const avatar = data.avatars.find(a => a.id === expectedId);
      if (!avatar) {
        throw new Error(`Missing personal avatar: ${expectedId}`);
      }
      
      // Check required fields
      const requiredFields = ['name', 'avatarType', 'expertise', 'specializations', 'pricing'];
      for (const field of requiredFields) {
        if (!avatar[field]) {
          throw new Error(`Personal avatar ${expectedId} missing required field: ${field}`);
        }
      }
      
      await this.log(`Personal avatar ${avatar.name} data structure validated`);
    }
  }

  async testBusinessDashboardIntegration() {
    // Read BusinessDashboard.tsx file
    const dashboardPath = path.join(__dirname, 'client/src/pages/BusinessDashboard.tsx');
    const dashboardContent = await fs.readFile(dashboardPath, 'utf8');
    
    // Check if business avatars are integrated
    if (!dashboardContent.includes('business-avatars') && !dashboardContent.includes('BusinessAvatars')) {
      throw new Error('Business avatars not integrated into BusinessDashboard component');
    }
    
    // Check for proper tab structure or embedded component
    const hasTabStructure = dashboardContent.includes('TabsContent') && 
                           (dashboardContent.includes('business-avatars') || dashboardContent.includes('BusinessAvatars'));
    
    const hasDirectIntegration = dashboardContent.includes('businessAvatarRoutes') || 
                                dashboardContent.includes('BusinessAvatarManager');
    
    if (!hasTabStructure && !hasDirectIntegration) {
      throw new Error('Business avatars not properly integrated into dashboard UI');
    }
    
    await this.log('Business dashboard integration verified');
  }

  async testPersonalDashboardIntegration() {
    // Check if personal avatars are accessible from user dashboard
    const userHomepagePath = path.join(__dirname, 'client/src/pages/user-homepage.tsx');
    
    try {
      const userHomepageContent = await fs.readFile(userHomepagePath, 'utf8');
      
      // Check if personal avatars are referenced
      const hasPersonalAvatars = userHomepageContent.includes('personal-avatars') || 
                                 userHomepageContent.includes('PersonalAvatars') ||
                                 userHomepageContent.includes('Personal Avatars');
      
      if (!hasPersonalAvatars) {
        throw new Error('Personal avatars not integrated into personal dashboard');
      }
      
      await this.log('Personal dashboard integration verified');
    } catch (fileError) {
      await this.log('user-homepage.tsx not found, checking dashboard.tsx', 'warning');
      
      // Try alternative dashboard file
      const dashboardPath = path.join(__dirname, 'client/src/pages/dashboard.tsx');
      try {
        const dashboardContent = await fs.readFile(dashboardPath, 'utf8');
        
        const hasPersonalAvatars = dashboardContent.includes('personal-avatars') || 
                                   dashboardContent.includes('PersonalAvatars');
        
        if (!hasPersonalAvatars) {
          throw new Error('Personal avatars not found in any dashboard component');
        }
        
        await this.log('Personal dashboard integration found in dashboard.tsx');
      } catch (altError) {
        throw new Error('Could not find personal dashboard integration in any dashboard component');
      }
    }
  }

  async testAvatarCustomization() {
    // Test business avatar customization
    const businessCustomizeData = {
      baseAvatarId: 'alex_thunder_sales',
      customizations: {
        name: 'Custom Sales Bot',
        expertise: ['Advanced Sales', 'Customer Relations']
      },
      businessConfig: {
        industry: 'technology',
        targetAudience: 'B2B clients'
      }
    };

    const businessResponse = await fetch(`${this.serverUrl}/api/business-avatars/customize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessCustomizeData)
    });

    if (!businessResponse.ok) {
      throw new Error(`Business avatar customization failed: ${businessResponse.status}`);
    }

    // Test personal avatar customization
    const personalCustomizeData = {
      baseAvatarId: 'travel_planner_maya',
      customizations: {
        name: 'My Travel Guide',
        goals: 'Plan amazing solo adventures'
      },
      personalGoals: ['Adventure travel', 'Budget optimization'],
      preferences: {
        reminderFrequency: 'weekly',
        privacyLevel: 'personal'
      }
    };

    const personalResponse = await fetch(`${this.serverUrl}/api/personal-avatars/customize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personalCustomizeData)
    });

    if (!personalResponse.ok) {
      throw new Error(`Personal avatar customization failed: ${personalResponse.status}`);
    }

    await this.log('Avatar customization endpoints working correctly');
  }

  async testAvatarDeployment() {
    // Test business avatar deployment
    const businessDeployData = {
      avatarId: 'alex_thunder_sales',
      businessConfig: {
        channels: ['web', 'email', 'phone'],
        features: ['lead_qualification', 'appointment_booking', 'follow_up'],
        integrations: ['crm', 'calendar']
      }
    };

    const businessResponse = await fetch(`${this.serverUrl}/api/business-avatars/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(businessDeployData)
    });

    if (!businessResponse.ok) {
      throw new Error(`Business avatar deployment failed: ${businessResponse.status}`);
    }

    // Test personal avatar deployment
    const personalDeployData = {
      avatarId: 'travel_planner_maya',
      personalSettings: {
        goals: ['Plan trips', 'Find deals'],
        preferences: { reminderFrequency: 'daily' }
      },
      deploymentConfig: {
        channels: ['mobile', 'web'],
        features: ['chat', 'reminders', 'progress_tracking'],
        privacy: 'personal'
      }
    };

    const personalResponse = await fetch(`${this.serverUrl}/api/personal-avatars/deploy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personalDeployData)
    });

    if (!personalResponse.ok) {
      throw new Error(`Personal avatar deployment failed: ${personalResponse.status}`);
    }

    await this.log('Avatar deployment endpoints working correctly');
  }

  async testRuntimeErrors() {
    // Check for common runtime issues
    const componentsToCheck = [
      'client/src/pages/BusinessDashboard.tsx',
      'client/src/pages/PersonalAvatarManager.tsx',
      'client/src/pages/BusinessAvatarManager.tsx'
    ];

    for (const componentPath of componentsToCheck) {
      const fullPath = path.join(__dirname, componentPath);
      try {
        const content = await fs.readFile(fullPath, 'utf8');
        
        // Check for common errors
        const commonErrors = [
          { pattern: /\.slice\(\)/g, error: 'Potential .slice() on undefined array' },
          { pattern: /import.*Sparkles2/g, error: 'Invalid Sparkles2 import from lucide-react' },
          { pattern: /import.*TopNavigation.*from.*['"]@\/components\/TopNavigation['"];?\s*$/gm, error: 'Incorrect TopNavigation import (should be default)' },
          { pattern: /undefined\.map/g, error: 'Calling .map on undefined array' },
          { pattern: /undefined\.filter/g, error: 'Calling .filter on undefined array' }
        ];

        for (const { pattern, error } of commonErrors) {
          if (pattern.test(content)) {
            throw new Error(`Runtime error in ${componentPath}: ${error}`);
          }
        }
        
        await this.log(`Runtime error check passed for ${componentPath}`);
      } catch (fileError) {
        if (fileError.code === 'ENOENT') {
          await this.log(`Component ${componentPath} not found - may be expected`, 'warning');
        } else {
          throw fileError;
        }
      }
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.totalTests,
        passedTests: this.passedTests,
        failedTests: this.totalTests - this.passedTests,
        successRate: `${((this.passedTests / this.totalTests) * 100).toFixed(2)}%`
      },
      results: this.results
    };

    const reportPath = path.join(__dirname, 'avatar-integration-test-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    await this.log(`Test report generated: ${reportPath}`);
    return report;
  }

  async runAllTests() {
    await this.log('Starting Avatar Integration Test Suite');
    
    const tests = [
      ['Server Health Check', () => this.testServerHealth()],
      ['Business Avatar Routes', () => this.testBusinessAvatarRoutes()],
      ['Personal Avatar Routes', () => this.testPersonalAvatarRoutes()],
      ['Business Avatar Data Structure', () => this.testBusinessAvatarData()],
      ['Personal Avatar Data Structure', () => this.testPersonalAvatarData()],
      ['Business Dashboard Integration', () => this.testBusinessDashboardIntegration()],
      ['Personal Dashboard Integration', () => this.testPersonalDashboardIntegration()],
      ['Avatar Customization', () => this.testAvatarCustomization()],
      ['Avatar Deployment', () => this.testAvatarDeployment()],
      ['Runtime Error Check', () => this.testRuntimeErrors()]
    ];

    for (const [testName, testFn] of tests) {
      await this.runTest(testName, testFn);
    }

    const report = await this.generateReport();
    
    console.log('\n=== AVATAR INTEGRATION TEST RESULTS ===');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passedTests}`);
    console.log(`Failed: ${report.summary.failedTests}`);
    console.log(`Success Rate: ${report.summary.successRate}`);
    
    if (report.summary.failedTests > 0) {
      console.log('\n=== FAILED TESTS ===');
      this.results.filter(r => r.type === 'error').forEach(r => {
        console.log(`❌ ${r.test}: ${r.message}`);
      });
    }

    return report;
  }
}

// Run tests if this file is executed directly
const tester = new AvatarIntegrationTester();
tester.runAllTests().catch(console.error);

export default AvatarIntegrationTester;