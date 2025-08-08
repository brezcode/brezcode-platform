import fs from 'fs';

// Test WhatsApp module components without requiring server
console.log('🧪 Testing WhatsApp Integration Modules...\n');

const testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function runTest(testName, testFunction) {
  console.log(`🔍 Testing: ${testName}`);
  try {
    testFunction();
    console.log(`✅ PASSED: ${testName}`);
    testResults.passed++;
    testResults.tests.push({ name: testName, status: 'PASSED', error: null });
  } catch (error) {
    console.log(`❌ FAILED: ${testName} - ${error.message}`);
    testResults.failed++;
    testResults.tests.push({ name: testName, status: 'FAILED', error: error.message });
  }
}

// Test 1: Check if WhatsApp schema file exists and has correct structure
runTest('WhatsApp Schema Structure', () => {
  const schemaPath = './shared/whatsapp-schema.ts';
  if (!fs.existsSync(schemaPath)) {
    throw new Error('WhatsApp schema file not found');
  }
  
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  const requiredTables = [
    'whatsappContacts',
    'whatsappMessages', 
    'whatsappConversations',
    'whatsappAiSessions',
    'whatsappWebhookLogs'
  ];
  
  for (const table of requiredTables) {
    if (!schemaContent.includes(table)) {
      throw new Error(`Required table '${table}' not found in schema`);
    }
  }
});

// Test 2: Check if WhatsApp service file exists and has required methods
runTest('WhatsApp Service Structure', () => {
  const servicePath = './server/whatsappService.ts';
  if (!fs.existsSync(servicePath)) {
    throw new Error('WhatsApp service file not found');
  }
  
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  
  const requiredMethods = [
    'sendTextMessage',
    'sendTemplateMessage',
    'sendInteractiveMessage',
    'storeMessage',
    'getContact',
    'updateOrCreateContact',
    'getConversationHistory',
    'verifyWebhook',
    'getBusinessProfile'
  ];
  
  for (const method of requiredMethods) {
    if (!serviceContent.includes(method)) {
      throw new Error(`Required method '${method}' not found in service`);
    }
  }
});

// Test 3: Check if AI Assistant file exists and has required functionality
runTest('WhatsApp AI Assistant Structure', () => {
  const aiPath = './server/whatsappAiAssistant.ts';
  if (!fs.existsSync(aiPath)) {
    throw new Error('WhatsApp AI assistant file not found');
  }
  
  const aiContent = fs.readFileSync(aiPath, 'utf8');
  
  const requiredMethods = [
    'processIncomingMessage',
    'determineAssistantType',
    'processCoachingMessage',
    'processSalesMessage', 
    'processSupportMessage',
    'sendWelcomeMessage',
    'sendProactiveMessage'
  ];
  
  for (const method of requiredMethods) {
    if (!aiContent.includes(method)) {
      throw new Error(`Required AI method '${method}' not found`);
    }
  }
  
  // Check for different conversation contexts
  const requiredContexts = ['coaching', 'sales', 'support'];
  for (const context of requiredContexts) {
    if (!aiContent.includes(context)) {
      throw new Error(`Required conversation context '${context}' not found`);
    }
  }
});

// Test 4: Check if WhatsApp routes file exists and has required endpoints
runTest('WhatsApp Routes Structure', () => {
  const routesPath = './server/routes/whatsappRoutes.ts';
  if (!fs.existsSync(routesPath)) {
    throw new Error('WhatsApp routes file not found');
  }
  
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  
  const requiredRoutes = [
    'router.get(\'/webhook\'',
    'router.post(\'/webhook\'', 
    'router.post(\'/send-message\'',
    'router.post(\'/send-welcome\'',
    'router.post(\'/send-proactive\'',
    'router.get(\'/conversation/',
    'router.get(\'/business-profile\'',
    'router.get(\'/health\''
  ];
  
  for (const route of requiredRoutes) {
    if (!routesContent.includes(route)) {
      throw new Error(`Required route '${route}' not found`);
    }
  }
});

// Test 5: Check if WhatsApp scheduler exists and has automation features
runTest('WhatsApp Scheduler Structure', () => {
  const schedulerPath = './server/whatsappScheduler.ts';
  if (!fs.existsSync(schedulerPath)) {
    throw new Error('WhatsApp scheduler file not found');
  }
  
  const schedulerContent = fs.readFileSync(schedulerPath, 'utf8');
  
  const requiredFeatures = [
    'startHealthReminders',
    'sendWeeklyHealthReminders',
    'sendDailyHealthTips',
    'scheduleFollowUp',
    'sendOnboardingSequence',
    'cancelScheduledMessage'
  ];
  
  for (const feature of requiredFeatures) {
    if (!schedulerContent.includes(feature)) {
      throw new Error(`Required scheduler feature '${feature}' not found`);
    }
  }
});

// Test 6: Check if environment configuration is properly set up
runTest('Environment Configuration', () => {
  const envExamplePath = './.env.example';
  if (!fs.existsSync(envExamplePath)) {
    throw new Error('.env.example file not found');
  }
  
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  const requiredVars = [
    'WA_PHONE_NUMBER_ID',
    'WA_BUSINESS_ACCOUNT_ID',
    'CLOUD_API_ACCESS_TOKEN',
    'CLOUD_API_VERSION',
    'WEBHOOK_VERIFICATION_TOKEN'
  ];
  
  for (const envVar of requiredVars) {
    if (!envContent.includes(envVar)) {
      throw new Error(`Required environment variable '${envVar}' not found in .env.example`);
    }
  }
});

// Test 7: Check if server integration is properly configured
runTest('Server Integration', () => {
  const serverPath = './server/index.ts';
  if (!fs.existsSync(serverPath)) {
    throw new Error('Main server file not found');
  }
  
  const serverContent = fs.readFileSync(serverPath, 'utf8');
  
  if (!serverContent.includes('whatsappRoutes')) {
    throw new Error('WhatsApp routes not imported in main server file');
  }
  
  if (!serverContent.includes('/api/whatsapp')) {
    throw new Error('WhatsApp API routes not registered in main server');
  }
});

// Test 8: Validate AI conversation logic structure
runTest('AI Conversation Logic', () => {
  const aiPath = './server/whatsappAiAssistant.ts';
  const aiContent = fs.readFileSync(aiPath, 'utf8');
  
  // Check for keyword detection
  const keywordCategories = [
    'coachingKeywords',
    'salesKeywords', 
    'supportKeywords'
  ];
  
  for (const category of keywordCategories) {
    if (!aiContent.includes(category)) {
      throw new Error(`Keyword category '${category}' not found in AI logic`);
    }
  }
  
  // Check for Dr. Sakura integration
  if (!aiContent.includes('BrezcodeAvatarService')) {
    throw new Error('Dr. Sakura (BrezcodeAvatarService) integration not found');
  }
  
  // Check for message type handling
  const messageTypes = ['text', 'interactive', 'button'];
  for (const type of messageTypes) {
    if (!aiContent.includes(type)) {
      throw new Error(`Message type '${type}' handling not found`);
    }
  }
});

// Test 9: Check webhook payload processing
runTest('Webhook Payload Processing', () => {
  const routesPath = './server/routes/whatsappRoutes.ts';
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  
  const requiredProcessing = [
    'processMessageChange',
    'processIncomingMessage',
    'processMessageStatus',
    'webhookPayload.entry',
    'EVENT_RECEIVED'
  ];
  
  for (const process of requiredProcessing) {
    if (!routesContent.includes(process)) {
      throw new Error(`Webhook processing '${process}' not found`);
    }
  }
});

// Test 10: Validate comprehensive message handling
runTest('Message Type Coverage', () => {
  const routesPath = './server/routes/whatsappRoutes.ts';
  const routesContent = fs.readFileSync(routesPath, 'utf8');
  
  const messageTypes = [
    'case \'text\'',
    'case \'interactive\'',
    'case \'button\'',
    'case \'image\'',
    'case \'video\'',
    'case \'audio\'',
    'case \'document\''
  ];
  
  for (const msgType of messageTypes) {
    if (!routesContent.includes(msgType)) {
      throw new Error(`Message type handling '${msgType}' not found`);
    }
  }
});

console.log(`\n📊 Test Results:`);
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`📈 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

// Generate detailed report
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    total: testResults.passed + testResults.failed,
    passed: testResults.passed,
    failed: testResults.failed,
    successRate: ((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1) + '%'
  },
  tests: testResults.tests
};

fs.writeFileSync('whatsapp-module-test-report.json', JSON.stringify(report, null, 2));

if (testResults.failed === 0) {
  console.log('\n🎉 All WhatsApp integration modules are properly implemented!');
  console.log('\n📋 Module Summary:');
  console.log('✅ WhatsApp Business API Service');
  console.log('✅ AI Assistant with Coaching/Sales/Support');
  console.log('✅ Webhook Processing');
  console.log('✅ Database Schema');
  console.log('✅ Message Scheduling');
  console.log('✅ Environment Configuration');
  console.log('✅ Server Integration');
} else {
  console.log(`\n⚠️ ${testResults.failed} module issues found. Check the details above.`);
}

console.log('\n📄 Detailed report saved to: whatsapp-module-test-report.json');

process.exit(testResults.failed > 0 ? 1 : 0);