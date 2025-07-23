#!/usr/bin/env node

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const TEST_USER = { email: 'leedennyps@gmail.com', password: '11111111' };

class StressTest {
  constructor() {
    this.results = [];
  }

  async makeRequest(method, endpoint, data = null) {
    const startTime = Date.now();
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      };
      if (data) options.body = JSON.stringify(data);

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const responseTime = Date.now() - startTime;
      
      return {
        success: response.ok,
        status: response.status,
        responseTime,
        data: await response.json().catch(() => ({}))
      };
    } catch (error) {
      return {
        success: false,
        status: 0,
        responseTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  async stressTestLogin(concurrent = 50, iterations = 5) {
    console.log(`🔥 STRESS TEST: ${concurrent} concurrent login requests, ${iterations} iterations`);
    
    for (let iter = 0; iter < iterations; iter++) {
      console.log(`Iteration ${iter + 1}/${iterations}...`);
      
      const promises = Array(concurrent).fill().map(() => 
        this.makeRequest('POST', '/api/login', TEST_USER)
      );
      
      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      
      console.log(`✓ Success: ${successful}/${concurrent} (${((successful/concurrent)*100).toFixed(1)}%)`);
      console.log(`⏱ Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);
      
      this.results.push({
        test: 'login',
        iteration: iter + 1,
        concurrent,
        successful,
        total: concurrent,
        successRate: (successful/concurrent)*100,
        avgResponseTime
      });
    }
  }

  async stressTestProfile(concurrent = 30, iterations = 3) {
    console.log(`🔥 STRESS TEST: ${concurrent} concurrent profile requests, ${iterations} iterations`);
    
    // Login first
    await this.makeRequest('POST', '/api/login', TEST_USER);
    
    for (let iter = 0; iter < iterations; iter++) {
      console.log(`Profile test iteration ${iter + 1}/${iterations}...`);
      
      const promises = Array(concurrent).fill().map(() => 
        this.makeRequest('GET', '/api/user/profile')
      );
      
      const results = await Promise.all(promises);
      const successful = results.filter(r => r.success).length;
      const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;
      
      console.log(`✓ Success: ${successful}/${concurrent} (${((successful/concurrent)*100).toFixed(1)}%)`);
      console.log(`⏱ Avg Response Time: ${avgResponseTime.toFixed(0)}ms`);
    }
  }

  async runAllStressTests() {
    console.log('🚀 STARTING STRESS TESTING');
    console.log('==========================');
    
    await this.stressTestLogin(20, 3);
    await this.stressTestProfile(15, 3);
    
    console.log('\n📊 STRESS TEST SUMMARY');
    console.log('======================');
    
    const loginTests = this.results.filter(r => r.test === 'login');
    const avgSuccessRate = loginTests.reduce((sum, r) => sum + r.successRate, 0) / loginTests.length;
    const avgResponseTime = loginTests.reduce((sum, r) => sum + r.avgResponseTime, 0) / loginTests.length;
    
    console.log(`Average Success Rate: ${avgSuccessRate.toFixed(1)}%`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    
    if (avgSuccessRate > 95 && avgResponseTime < 3000) {
      console.log('🎉 STRESS TEST PASSED - System handles load well!');
      return true;
    } else {
      console.log('⚠️ STRESS TEST ISSUES - Performance or reliability problems detected');
      return false;
    }
  }
}

const stressTest = new StressTest();
stressTest.runAllStressTests().then(success => {
  process.exit(success ? 0 : 1);
});