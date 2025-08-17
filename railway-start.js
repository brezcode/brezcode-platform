// Simple Railway startup script
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Railway startup script initializing...');
console.log('📁 Current directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV || 'production');
console.log('🔌 Port:', process.env.PORT || 3000);

// Check if dist/index.js exists
const fs = require('fs');
const serverPath = path.join(process.cwd(), 'dist', 'index.js');

if (!fs.existsSync(serverPath)) {
  console.error('❌ Server file not found at:', serverPath);
  console.log('📋 Available files:');
  try {
    const files = fs.readdirSync(path.join(process.cwd(), 'dist'));
    console.log(files);
  } catch (e) {
    console.log('dist directory not found');
  }
  process.exit(1);
}

console.log('✅ Server file found, starting...');

// Start the server
const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: process.env.PORT || 3000
  }
});

server.on('error', (err) => {
  console.error('❌ Server failed to start:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`📴 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down...');
  server.kill('SIGINT');
});