#!/usr/bin/env node

const fs = require('fs');
const https = require('https');

const token = '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';
const repo = 'xynargyhk/leadgen-platform';

// Core files to upload first
const coreFiles = [
  'package.json',
  'vercel.json', 
  'tsconfig.json',
  '.gitignore',
  'tailwind.config.ts',
  'vite.config.ts',
  'drizzle.config.ts',
  'components.json'
];

async function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`Skipping ${filePath} - file not found`);
        resolve();
        return;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const base64Content = Buffer.from(content).toString('base64');
      
      const data = JSON.stringify({
        message: `Add ${filePath}`,
        content: base64Content,
      });

      const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/repos/${repo}/contents/${filePath}`,
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': data.length,
          'User-Agent': 'leadgen-upload'
        },
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ Uploaded: ${filePath}`);
          } else {
            console.log(`❌ Failed: ${filePath} - Status: ${res.statusCode}`);
            console.log(body);
          }
          resolve();
        });
      });

      req.on('error', (error) => {
        console.log(`❌ Error uploading ${filePath}: ${error.message}`);
        resolve();
      });

      req.write(data);
      req.end();
    } catch (error) {
      console.log(`❌ Error: ${filePath} - ${error.message}`);
      resolve();
    }
  });
}

async function uploadAll() {
  console.log('🚀 Starting GitHub upload to xynargyhk/leadgen-platform...');
  
  for (const file of coreFiles) {
    await uploadFile(file);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
  }
  
  console.log('📝 Core files uploaded. Ready for Vercel deployment!');
}

uploadAll();