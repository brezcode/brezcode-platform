#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
const TEST_USER = {
  email: 'leedennyps@gmail.com',
  password: '11111111'
};

class AuthProfileTester {
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
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    if (includeCookies && this.cookies) {
      options.headers['Cookie'] = this.cookies;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      
      // Extract cookies from response
      if (response.headers.get('set-cookie')) {
        this.cookies = response.headers.get('set-cookie');
      }

      const responseData = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }

      return {
        status: response.status,
        data: parsedData,
        ok: response.ok
      };
    } catch (error) {
      this.log(`Request failed: ${error.message}`, 'ERROR');
      return {
        status: 0,
        data: { error: error.message },
        ok: false
      };
    }
  }

  async testServerStatus() {
    this.log('Testing server connectivity...');
    const response = await this.makeRequest('GET', '/', null, false);
    
    if (response.status === 200 || response.status === 404) {
      this.log('✓ Server is running and accessible', 'PASS');
      return true;
    } else {
      this.log(`✗ Server not accessible (status: ${response.status})`, 'FAIL');
      return false;
    }
  }

  async testUnauthenticatedAccess() {
    this.log('Testing unauthenticated access to /api/me...');
    const response = await this.makeRequest('GET', '/api/me', null, false);
    
    if (response.status === 401) {
      this.log('✓ Correctly returns 401 for unauthenticated requests', 'PASS');
      return true;
    } else {
      this.log(`✗ Expected 401, got ${response.status}`, 'FAIL');
      return false;
    }
  }

  async testLogin() {
    this.log('Testing login with credentials...');
    const response = await this.makeRequest('POST', '/api/login', TEST_USER, false);
    
    if (response.ok && response.data.user) {
      this.log('✓ Login successful', 'PASS');
      this.log(`User ID: ${response.data.user.id}, Email: ${response.data.user.email}`);
      return true;
    } else {
      this.log(`✗ Login failed: ${JSON.stringify(response.data)}`, 'FAIL');
      return false;
    }
  }

  async testAuthenticatedMeEndpoint() {
    this.log('Testing authenticated /api/me endpoint...');
    const response = await this.makeRequest('GET', '/api/me');
    
    if (response.ok && response.data.id) {
      this.log('✓ Authenticated /api/me working correctly', 'PASS');
      this.log(`User data: ${JSON.stringify(response.data, null, 2)}`);
      return true;
    } else {
      this.log(`✗ /api/me failed: ${JSON.stringify(response.data)}`, 'FAIL');
      return false;
    }
  }

  async testProfileEndpoint() {
    this.log('Testing /api/user/profile endpoint...');
    const response = await this.makeRequest('GET', '/api/user/profile');
    
    if (response.ok) {
      this.log('✓ Profile endpoint accessible', 'PASS');
      this.log(`Profile data: ${JSON.stringify(response.data, null, 2)}`);
      
      // Check if profile has expected fields
      const expectedFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'postalCode', 'country', 'phoneNumber'];
      const missingFields = expectedFields.filter(field => !(field in response.data));
      
      if (missingFields.length === 0) {
        this.log('✓ All expected profile fields present', 'PASS');
        return true;
      } else {
        this.log(`✗ Missing profile fields: ${missingFields.join(', ')}`, 'FAIL');
        return false;
      }
    } else {
      this.log(`✗ Profile endpoint failed: ${JSON.stringify(response.data)}`, 'FAIL');
      return false;
    }
  }

  async testProfileUpdate() {
    this.log('Testing profile update functionality...');
    const updateData = {
      firstName: 'TestFirst',
      lastName: 'TestLast',
      streetAddress: '123 Test St',
      city: 'TestCity',
      state: 'TestState',
      postalCode: '12345',
      country: 'TestCountry',
      phoneNumber: '+1234567890'
    };

    const response = await this.makeRequest('POST', '/api/user/profile', updateData);
    
    if (response.ok) {
      this.log('✓ Profile update successful', 'PASS');
      this.log(`Updated profile: ${JSON.stringify(response.data, null, 2)}`);
      return true;
    } else {
      this.log(`✗ Profile update failed: ${JSON.stringify(response.data)}`, 'FAIL');
      return false;
    }
  }

  async testSessionPersistence() {
    this.log('Testing session persistence...');
    
    // Make another request with the same cookies
    const response = await this.makeRequest('GET', '/api/me');
    
    if (response.ok && response.data.id) {
      this.log('✓ Session persists correctly', 'PASS');
      return true;
    } else {
      this.log('✗ Session does not persist', 'FAIL');
      return false;
    }
  }

  async runAllTests() {
    this.log('Starting comprehensive authentication and profile testing...');
    
    const tests = [
      { name: 'Server Status', test: () => this.testServerStatus() },
      { name: 'Unauthenticated Access', test: () => this.testUnauthenticatedAccess() },
      { name: 'Login', test: () => this.testLogin() },
      { name: 'Authenticated /api/me', test: () => this.testAuthenticatedMeEndpoint() },
      { name: 'Profile Endpoint', test: () => this.testProfileEndpoint() },
      { name: 'Profile Update', test: () => this.testProfileUpdate() },
      { name: 'Session Persistence', test: () => this.testSessionPersistence() }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const { name, test } of tests) {
      this.log(`\n=== Running Test: ${name} ===`);
      try {
        const result = await test();
        if (result) {
          passedTests++;
        }
      } catch (error) {
        this.log(`Test ${name} threw error: ${error.message}`, 'ERROR');
      }
    }

    this.log(`\n=== TEST SUMMARY ===`);
    this.log(`Passed: ${passedTests}/${totalTests}`);
    this.log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
      this.log('🎉 ALL TESTS PASSED - Authentication and profile system is working correctly!', 'SUCCESS');
    } else {
      this.log('❌ SOME TESTS FAILED - Issues need to be addressed', 'FAILURE');
    }

    // Save detailed results to file
    fs.writeFileSync('test-results.log', this.testResults.join('\n'));
    this.log('Detailed test results saved to test-results.log');

    return passedTests === totalTests;
  }
}

// Run tests if called directly
const tester = new AuthProfileTester();
tester.runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});

export default AuthProfileTester;