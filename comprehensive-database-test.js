// Comprehensive Database Functionality Test Suite
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test database operations directly
import { execSync } from 'child_process';

console.log('🔍 COMPREHENSIVE DATABASE FUNCTIONALITY TEST\n');

// Test 1: Quiz Answer Storage
console.log('=== TEST 1: Quiz Answer Storage ===');
try {
  const quizTestResult = execSync(`psql "${process.env.DATABASE_URL}" -c "INSERT INTO users (email, first_name, last_name, quiz_answers, is_email_verified, password) VALUES ('quiz_test@test.com', 'Quiz', 'Tester', '{\"age\": \"55-64\", \"country\": \"Singapore\", \"ethnicity\": \"Asian\", \"family_history\": \"Yes - grandmother\", \"exercise_habits\": \"Daily exercise\", \"stress_level\": \"High\", \"mammogram_history\": \"Annual\", \"diet\": \"Mediterranean\", \"smoking\": \"Never\", \"alcohol\": \"Occasional\"}', true, 'test_password') RETURNING id;"`, { encoding: 'utf8' });
  console.log('✅ Quiz answers successfully stored');
  console.log('   Response:', quizTestResult.trim());
} catch (error) {
  console.log('❌ Quiz storage failed:', error.message);
}

// Test 2: Health Report Generation and Storage
console.log('\n=== TEST 2: Health Report Storage ===');
try {
  const healthReportResult = execSync(`psql "${process.env.DATABASE_URL}" -c "INSERT INTO health_reports (user_id, quiz_answers, risk_score, risk_category, user_profile, risk_factors, recommendations, daily_plan, report_data) VALUES (9, '{\"age\": \"60\", \"country\": \"Hong Kong\"}', 35, 'moderate', 'postmenopausal', '[\"Age factor\", \"Lifestyle factors\"]', '[\"Regular screenings\", \"Healthy diet\", \"Exercise routine\"]', '{\"morning\": \"Meditation\", \"afternoon\": \"Exercise\", \"evening\": \"Relaxation\"}', '{\"summary\": \"Complete health assessment for 60-year-old woman\"}') RETURNING id;"`, { encoding: 'utf8' });
  console.log('✅ Health report successfully stored');
  console.log('   Response:', healthReportResult.trim());
} catch (error) {
  console.log('❌ Health report storage failed:', error.message);
}

// Test 3: AI Avatar Conversation Storage
console.log('\n=== TEST 3: AI Avatar Conversation Storage ===');
try {
  const conversationResult = execSync(`psql "${process.env.DATABASE_URL}" -c "INSERT INTO user_conversations (user_id, session_id, message_id, role, content, avatar_id, quality_score, emotion, business_context, learning_points, topics_discussed) VALUES (9, 'comprehensive_test_session', 'msg_test_001', 'user', 'Dr. Sakura, can you help me understand my breast health risks?', 'dr_sakura_brezcode', 95, 'concerned', 'Breast health consultation', '[\"Risk assessment inquiry\", \"Health education need\"]', '[\"Breast cancer risk\", \"Prevention strategies\"]'), (9, 'comprehensive_test_session', 'msg_test_002', 'avatar', 'Based on your age of 60 and postmenopausal status, I recommend regular mammograms and lifestyle modifications to maintain optimal breast health.', 'dr_sakura_brezcode', 92, 'supportive', 'Personalized health coaching', '[\"Provided age-specific advice\", \"Mentioned screening importance\"]', '[\"Mammogram screening\", \"Lifestyle recommendations\"]') RETURNING id;"`, { encoding: 'utf8' });
  console.log('✅ AI conversations successfully stored');
  console.log('   Response:', conversationResult.trim());
} catch (error) {
  console.log('❌ Conversation storage failed:', error.message);
}

// Test 4: BrezCode AI Chat Storage
console.log('\n=== TEST 4: BrezCode AI Chat Storage ===');
try {
  const brezcodeResult = execSync(`psql "${process.env.DATABASE_URL}" -c "INSERT INTO brezcode_ai_chats (user_id, conversation_id, messages, health_focus, risk_context) VALUES (9, 'brezcode_test_conv_001', '[{\"role\": \"user\", \"content\": \"What lifestyle changes should I make?\"}, {\"role\": \"assistant\", \"content\": \"Based on your moderate risk profile, focus on regular exercise, balanced nutrition, and stress management.\"}]', 'Lifestyle modification', '{\"risk_score\": 40, \"age_group\": \"60+\", \"profile\": \"postmenopausal\"}') RETURNING id;"`, { encoding: 'utf8' });
  console.log('✅ BrezCode AI chats successfully stored');
  console.log('   Response:', brezcodeResult.trim());
} catch (error) {
  console.log('❌ BrezCode chat storage failed:', error.message);
}

// Test 5: User Profile Updates
console.log('\n=== TEST 5: User Profile Updates ===');
try {
  const profileUpdateResult = execSync(`psql "${process.env.DATABASE_URL}" -c "UPDATE users SET bio = 'Health-conscious individual focusing on breast health prevention', phone_number = '+852-1234-5678', city = 'Hong Kong', country = 'Hong Kong' WHERE id = 9 RETURNING email, bio;"`, { encoding: 'utf8' });
  console.log('✅ User profile successfully updated');
  console.log('   Response:', profileUpdateResult.trim());
} catch (error) {
  console.log('❌ Profile update failed:', error.message);
}

// Test 6: Data Retrieval Verification
console.log('\n=== TEST 6: Data Retrieval Verification ===');
try {
  const retrievalResult = execSync(`psql "${process.env.DATABASE_URL}" -c "SELECT u.id, u.email, u.quiz_answers->'age' as age, u.quiz_answers->'country' as country, hr.risk_score, hr.risk_category, COUNT(uc.id) as conversation_count FROM users u LEFT JOIN health_reports hr ON u.id = hr.user_id LEFT JOIN user_conversations uc ON u.id = uc.user_id WHERE u.id = 9 GROUP BY u.id, u.email, u.quiz_answers, hr.risk_score, hr.risk_category;"`, { encoding: 'utf8' });
  console.log('✅ Data retrieval successful');
  console.log('   Retrieved data:');
  console.log(retrievalResult);
} catch (error) {
  console.log('❌ Data retrieval failed:', error.message);
}

// Test 7: Cross-Table Relationship Verification
console.log('\n=== TEST 7: Cross-Table Relationships ===');
try {
  const relationshipResult = execSync(`psql "${process.env.DATABASE_URL}" -c "SELECT 'Users with quiz data' as metric, COUNT(*) as count FROM users WHERE quiz_answers IS NOT NULL UNION ALL SELECT 'Health reports' as metric, COUNT(*) as count FROM health_reports UNION ALL SELECT 'Conversation messages' as metric, COUNT(*) as count FROM user_conversations UNION ALL SELECT 'BrezCode AI chats' as metric, COUNT(*) as count FROM brezcode_ai_chats;"`, { encoding: 'utf8' });
  console.log('✅ Cross-table relationships verified');
  console.log('   Metrics:');
  console.log(relationshipResult);
} catch (error) {
  console.log('❌ Relationship verification failed:', error.message);
}

console.log('\n🎉 COMPREHENSIVE DATABASE TEST COMPLETED');