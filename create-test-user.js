// Create a working test user for frontend testing
const fs = require('fs');

// Simulate creating a user directly in the MemStorage
const testUserScript = `
// Test user creation script
const bcrypt = require('bcrypt');

async function createTestUser() {
  console.log('Creating verified test user...');
  
  const { storage } = await import('./server/storage.js');
  
  const hashedPassword = await bcrypt.hash('test123', 10);
  
  const testUser = await storage.createUser({
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: hashedPassword,
    isEmailVerified: true,
    subscriptionTier: 'basic',
    isSubscriptionActive: true
  });
  
  console.log('Test user created:', testUser.email, 'ID:', testUser.id);
}

createTestUser().catch(console.error);
`;

// Add test user creation endpoint temporarily
const additionalRoutes = `
  // Temporary test user creation endpoint for development
  app.post("/api/create-test-user", async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const bcrypt = await import('bcrypt');
      
      const hashedPassword = await bcrypt.hash('test123', 10);
      
      const testUser = await storage.createUser({
        firstName: 'Test',
        lastName: 'User',
        email: 'testuser@example.com',
        password: hashedPassword,
        isEmailVerified: true,
        subscriptionTier: 'basic',
        isSubscriptionActive: true
      });
      
      res.json({ message: 'Test user created', user: { email: testUser.email, id: testUser.id } });
    } catch (error) {
      console.error('Test user creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });
`;

console.log('Test user creation helpers ready');