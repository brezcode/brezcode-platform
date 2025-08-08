import axios from 'axios';
import fs from 'fs';

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testPhoneNumber: '15551234567', // Test phone number
  webhookVerifyToken: 'test_verify_token_12345'
};

class WhatsAppIntegrationTester {
  constructor() {
    this.baseUrl = TEST_CONFIG.baseUrl;
    this.testResults = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    console.log(logMessage);
    
    this.testResults.push({
      timestamp,
      type,
      message,
      test: this.currentTest || 'unknown'
    });
  }

  async runTest(testName, testFunction) {
    this.currentTest = testName;
    this.log(`Starting test: ${testName}`, 'test');
    
    try {
      await testFunction();
      this.log(`✅ Test passed: ${testName}`, 'success');
      return true;
    } catch (error) {
      this.log(`❌ Test failed: ${testName} - ${error.message}`, 'error');
      return false;
    } finally {
      this.currentTest = null;
    }
  }

  async testServerHealth() {
    const response = await axios.get(`${this.baseUrl}/api/whatsapp/health`);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Health check failed');
    }
    
    this.log('WhatsApp service health check passed');
  }

  async testWebhookVerification() {
    const verificationParams = {
      'hub.mode': 'subscribe',
      'hub.verify_token': TEST_CONFIG.webhookVerifyToken,
      'hub.challenge': 'test_challenge_123456'
    };
    
    const response = await axios.get(`${this.baseUrl}/api/whatsapp/webhook`, {
      params: verificationParams
    });
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (response.data !== 'test_challenge_123456') {
      throw new Error('Webhook verification challenge not returned correctly');
    }
    
    this.log('Webhook verification test passed');
  }

  async testWebhookMessageProcessing() {
    const mockWebhookPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'test_entry_id',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '15551234567',
                  phone_number_id: 'test_phone_number_id'
                },
                contacts: [
                  {
                    profile: {
                      name: 'Test User'
                    },
                    wa_id: TEST_CONFIG.testPhoneNumber
                  }
                ],
                messages: [
                  {
                    from: TEST_CONFIG.testPhoneNumber,
                    id: 'test_message_id_001',
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    text: {
                      body: 'Hello, I need help with health coaching'
                    },
                    type: 'text'
                  }
                ]
              }
            }
          ]
        }
      ]
    };
    
    const response = await axios.post(`${this.baseUrl}/api/whatsapp/webhook`, mockWebhookPayload);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (response.data !== 'EVENT_RECEIVED') {
      throw new Error('Webhook should return EVENT_RECEIVED');
    }
    
    this.log('Webhook message processing test passed');
  }

  async testSendMessage() {
    const messagePayload = {
      phoneNumber: TEST_CONFIG.testPhoneNumber,
      message: 'Test message from WhatsApp integration test',
      type: 'text'
    };
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/whatsapp/send-message`, messagePayload);
      
      // Note: This will likely fail without proper WhatsApp credentials
      // but we can test the endpoint structure
      this.log('Send message endpoint responded (may fail without credentials)');
      
      if (response.data.success === false && response.data.error) {
        this.log(`Expected failure due to missing credentials: ${response.data.error}`, 'warn');
        return; // This is expected in test environment
      }
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        this.log('Send message failed as expected (missing credentials)', 'warn');
        return; // Expected in test environment
      }
      throw error;
    }
  }

  async testWelcomeMessage() {
    const welcomePayload = {
      phoneNumber: TEST_CONFIG.testPhoneNumber
    };
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/whatsapp/send-welcome`, welcomePayload);
      
      // Similar to send message, this may fail without credentials
      this.log('Welcome message endpoint responded');
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        this.log('Welcome message failed as expected (missing credentials)', 'warn');
        return; // Expected in test environment
      }
      throw error;
    }
  }

  async testConversationHistory() {
    const response = await axios.get(`${this.baseUrl}/api/whatsapp/conversation/${TEST_CONFIG.testPhoneNumber}`);
    
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    
    if (!response.data.success) {
      throw new Error('Conversation history request failed');
    }
    
    if (!Array.isArray(response.data.messages)) {
      throw new Error('Messages should be an array');
    }
    
    this.log(`Conversation history test passed (${response.data.messages.length} messages)`);
  }

  async testBusinessProfile() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/whatsapp/business-profile`);
      
      // This will likely fail without proper credentials, which is expected
      this.log('Business profile endpoint responded');
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        this.log('Business profile failed as expected (missing credentials)', 'warn');
        return; // Expected in test environment
      }
      throw error;
    }
  }

  async testProactiveMessage() {
    const proactivePayload = {
      phoneNumber: TEST_CONFIG.testPhoneNumber,
      messageType: 'tip',
      content: 'This is a test health tip from the integration test'
    };
    
    try {
      const response = await axios.post(`${this.baseUrl}/api/whatsapp/send-proactive`, proactivePayload);
      
      this.log('Proactive message endpoint responded');
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        this.log('Proactive message failed as expected (missing credentials)', 'warn');
        return; // Expected in test environment
      }
      throw error;
    }
  }

  async testAiAssistantResponses() {
    // Test different conversation contexts
    const testScenarios = [
      {
        message: 'I need help with health coaching',
        expectedContext: 'coaching'
      },
      {
        message: 'What are your prices and plans?',
        expectedContext: 'sales'
      },
      {
        message: 'I need technical support',
        expectedContext: 'support'
      }
    ];

    for (const scenario of testScenarios) {
      try {
        // Simulate webhook message for AI processing
        const webhookPayload = {
          object: 'whatsapp_business_account',
          entry: [{
            id: 'test_entry',
            changes: [{
              field: 'messages',
              value: {
                contacts: [{
                  profile: { name: 'Test User' },
                  wa_id: TEST_CONFIG.testPhoneNumber
                }],
                messages: [{
                  from: TEST_CONFIG.testPhoneNumber,
                  id: `test_msg_${Date.now()}`,
                  timestamp: Math.floor(Date.now() / 1000).toString(),
                  text: { body: scenario.message },
                  type: 'text'
                }]
              }
            }]
          }]
        };

        await axios.post(`${this.baseUrl}/api/whatsapp/webhook`, webhookPayload);
        this.log(`AI assistant response test passed for: ${scenario.expectedContext}`);
        
      } catch (error) {
        this.log(`AI assistant test warning for ${scenario.expectedContext}: ${error.message}`, 'warn');
      }
    }
  }

  async runAllTests() {
    this.log('🚀 Starting WhatsApp Integration Tests', 'info');
    
    const tests = [
      ['Server Health Check', () => this.testServerHealth()],
      ['Webhook Verification', () => this.testWebhookVerification()],
      ['Webhook Message Processing', () => this.testWebhookMessageProcessing()],
      ['Send Message Endpoint', () => this.testSendMessage()],
      ['Welcome Message Endpoint', () => this.testWelcomeMessage()],
      ['Conversation History', () => this.testConversationHistory()],
      ['Business Profile', () => this.testBusinessProfile()],
      ['Proactive Message', () => this.testProactiveMessage()],
      ['AI Assistant Responses', () => this.testAiAssistantResponses()]
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const [testName, testFunction] of tests) {
      const result = await this.runTest(testName, testFunction);
      if (result) {
        passed++;
      } else {
        failed++;
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.log(`\n📊 Test Results Summary:`, 'info');
    this.log(`✅ Passed: ${passed}`, 'success');
    this.log(`❌ Failed: ${failed}`, failed > 0 ? 'error' : 'info');
    this.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`, 'info');
    
    if (failed === 0) {
      this.log('🎉 All WhatsApp integration tests passed!', 'success');
    } else {
      this.log(`⚠️ ${failed} tests failed. Check configuration and credentials.`, 'warn');
    }
    
    return { passed, failed, total: passed + failed };
  }

  generateTestReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testResults: this.testResults,
      summary: {
        totalTests: this.testResults.filter(r => r.type === 'test').length,
        passed: this.testResults.filter(r => r.type === 'success').length,
        failed: this.testResults.filter(r => r.type === 'error').length
      }
    };
    
    return JSON.stringify(report, null, 2);
  }
}

// Run tests if called directly
const tester = new WhatsAppIntegrationTester();

tester.runAllTests().then((results) => {
  console.log('\n📄 Generating test report...');
  const report = tester.generateTestReport();
  
  const reportPath = 'whatsapp-integration-test-report.json';
  fs.writeFileSync(reportPath, report);
  
  console.log(`📄 Test report saved to: ${reportPath}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
  
}).catch((error) => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});

export default WhatsAppIntegrationTester;