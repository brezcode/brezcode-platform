#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const TEST_USER = { email: 'leedennyps@gmail.com', password: '11111111' };

class DashboardAccessTest {
  constructor() {
    this.cookies = '';
    this.testResults = [];
  }

  log(message, status = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${status}: ${message}`;
    console.log(logMessage);
    this.testResults.push(logMessage);
  }

  async makeRequest(method, endpoint, data = null, includeCookies = true) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data) options.body = JSON.stringify(data);
    if (includeCookies && this.cookies) options.headers['Cookie'] = this.cookies;

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      
      if (response.headers.get('set-cookie')) {
        this.cookies = response.headers.get('set-cookie');
      }

      const responseData = await response.text();
      return {
        status: response.status,
        data: responseData,
        ok: response.ok
      };
    } catch (error) {
      return {
        status: 0,
        data: { error: error.message },
        ok: false
      };
    }
  }

  async testDashboardDirectAccess() {
    this.log('Testing direct dashboard access...');
    const response = await this.makeRequest('GET', '/', null, false);
    
    if (response.status === 200) {
      this.log('✓ Dashboard accessible at root path', 'PASS');
      return true;
    } else {
      this.log(`✗ Dashboard not accessible (status: ${response.status})`, 'FAIL');
      return false;
    }
  }

  async testLoginPageAccess() {
    this.log('Testing login page access...');
    const response = await this.makeRequest('GET', '/login', null, false);
    
    if (response.status === 200) {
      this.log('✓ Login page accessible at /login', 'PASS');
      return true;
    } else {
      this.log(`✗ Login page not accessible (status: ${response.status})`, 'FAIL');
      return false;
    }
  }

  async testLandingPageAccess() {
    this.log('Testing landing page access...');
    const response = await this.makeRequest('GET', '/landing', null, false);
    
    if (response.status === 200) {
      this.log('✓ Landing page accessible at /landing', 'PASS');
      return true;
    } else {
      this.log(`✗ Landing page not accessible (status: ${response.status})`, 'FAIL');
      return false;
    }
  }

  async testAuthenticationFlow() {
    this.log('Testing authentication flow...');
    
    // Test login
    const loginResponse = await this.makeRequest('POST', '/api/login', TEST_USER, false);
    if (!loginResponse.ok) {
      this.log('✗ Login failed', 'FAIL');
      return false;
    }

    // Test authenticated dashboard access
    const dashboardResponse = await this.makeRequest('GET', '/', null, true);
    if (dashboardResponse.status === 200) {
      this.log('✓ Authenticated dashboard access working', 'PASS');
      return true;
    } else {
      this.log('✗ Authenticated dashboard access failed', 'FAIL');
      return false;
    }
  }

  async runAllTests() {
    this.log('🔬 TESTING DASHBOARD DIRECT ACCESS SETUP');
    this.log('=========================================');
    
    const tests = [
      ['Dashboard Direct Access', () => this.testDashboardDirectAccess()],
      ['Login Page Access', () => this.testLoginPageAccess()],
      ['Landing Page Access', () => this.testLandingPageAccess()],
      ['Authentication Flow', () => this.testAuthenticationFlow()]
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const [testName, testFunction] of tests) {
      this.log(`\n=== Running Test: ${testName} ===`);
      try {
        const result = await testFunction();
        if (result) {
          passedTests++;
        }
      } catch (error) {
        this.log(`Test ${testName} threw error: ${error.message}`, 'ERROR');
      }
    }

    this.log(`\n=== TEST SUMMARY ===`);
    this.log(`Passed: ${passedTests}/${totalTests}`);
    this.log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
      this.log('🎉 ALL TESTS PASSED - Dashboard direct access working!', 'SUCCESS');
    } else {
      this.log('❌ SOME TESTS FAILED - Issues need to be addressed', 'FAILURE');
    }

    return passedTests === totalTests;
  }
}

const tester = new DashboardAccessTest();
tester.runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});