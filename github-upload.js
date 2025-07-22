#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const token = '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';
const repo = 'leedennyps/leadgen.to';

// Files to upload (excluding node_modules, .git, dist)
const filesToUpload = [
  'package.json',
  'package-lock.json',
  'README.md',
  'vercel.json',
  'tsconfig.json',
  'tailwind.config.ts',
  'vite.config.ts',
  'drizzle.config.ts',
  'components.json',
  '.gitignore'
];

// Function to upload a single file
async function uploadFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${filePath} - file not found`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const base64Content = Buffer.from(content).toString('base64');
    
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add ${filePath}`,
        content: base64Content,
      }),
    });

    if (response.ok) {
      console.log(`✅ Uploaded: ${filePath}`);
    } else {
      const error = await response.json();
      console.log(`❌ Failed: ${filePath} - ${error.message}`);
    }
  } catch (error) {
    console.log(`❌ Error uploading ${filePath}: ${error.message}`);
  }
}

// Upload core files
console.log('Starting GitHub upload...');
filesToUpload.forEach(file => {
  setTimeout(() => uploadFile(file), Math.random() * 1000);
});