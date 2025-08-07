const fs = require('fs');
const path = require('path');

// Create a test image (simple colored square for testing)
function createTestImage() {
  // This creates a simple test image as base64
  // In practice, this would be a real face photo
  const canvas = require('canvas');
  const canvasLib = canvas.createCanvas(224, 224);
  const ctx = canvasLib.getContext('2d');
  
  // Create a simple face-like image for testing
  ctx.fillStyle = '#DDB892'; // Skin tone color
  ctx.fillRect(0, 0, 224, 224);
  
  // Add some variation to simulate skin features
  ctx.fillStyle = '#B8906B';
  ctx.fillRect(50, 50, 30, 30); // Dark spot
  ctx.fillRect(150, 100, 20, 20); // Another spot
  
  return canvasLib.toDataURL('image/jpeg', 0.8);
}

async function testSkynAnalysis() {
  const axios = require('axios');
  
  console.log('🧪 Testing Skyn Open Source Integration...');
  
  try {
    // Create test data
    const testImageBase64 = createTestImage();
    const quizData = {
      age: '26-35',
      gender: 'female',
      skinType: 'combination',
      concerns: ['acne', 'dark_spots'],
      goals: ['clear_skin'],
      routine: 'basic',
      sunExposure: 'moderate',
      lifestyle: ['stress'],
      budget: 'mid-range',
      previousTreatments: 'none',
      allergies: 'none',
      additionalNotes: 'Testing Skyn integration'
    };

    // Create form data for multipart upload
    const FormData = require('form-data');
    const form = new FormData();
    
    // Convert base64 to buffer for file upload
    const imageBuffer = Buffer.from(testImageBase64.split(',')[1], 'base64');
    form.append('image', imageBuffer, {
      filename: 'test-face.jpg',
      contentType: 'image/jpeg'
    });
    form.append('quizData', JSON.stringify(quizData));

    console.log('📤 Sending test image to skin analysis API...');
    
    const response = await axios.post('http://localhost:5000/api/skin-analysis/analyze', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000
    });

    console.log('✅ Analysis completed!');
    console.log('📊 Results:');
    console.log('====================');
    
    const result = response.data;
    
    // Check if it's using real AI
    console.log('🔍 Analysis Type:', result.analysis_type || 'not specified');
    console.log('🤖 Models Used:', result.models_used);
    console.log('⏱️ Processing Time:', result.processing_time);
    console.log('📈 Overall Score:', result.overall_score);
    
    console.log('\n📊 Skin Scores:');
    Object.entries(result.scores).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('\n🎯 Confidence Scores:');
    Object.entries(result.confidence_scores).forEach(([key, value]) => {
      console.log(`  ${key}: ${(value * 100).toFixed(1)}%`);
    });
    
    console.log('\n📍 Detected Issues:', result.concerns);
    
    if (result.analysis_metadata?.model_info) {
      console.log('\n🧠 Model Information:');
      console.log('  Name:', result.analysis_metadata.model_info.name);
      console.log('  Using Real Models:', result.analysis_metadata.model_info.using_real_models);
      console.log('  Processing Accuracy:', (result.analysis_metadata.processing_accuracy * 100).toFixed(1) + '%');
    }
    
    // Verify it's not using fake data
    if (result.analysis_type === 'real_ai_analysis') {
      console.log('\n✅ SUCCESS: Using real AI models from Skyn Open Source!');
    } else {
      console.log('\n⚠️  WARNING: May still be using fallback/simulation data');
    }
    
    // Test consistency by running multiple analyses
    console.log('\n🔄 Testing consistency with second analysis...');
    
    const response2 = await axios.post('http://localhost:5000/api/skin-analysis/analyze', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000
    });
    
    const result2 = response2.data;
    
    // Compare results to check for consistency (real AI should be more consistent than random)
    const scoreDifference = Math.abs(result.overall_score - result2.overall_score);
    console.log('📊 Score difference between runs:', scoreDifference);
    
    if (scoreDifference < 10) {
      console.log('✅ Results are consistent - likely using real AI models');
    } else {
      console.log('⚠️ Results vary significantly - may be using random generation');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('📄 Response:', error.response.data);
    }
  }
}

// Check if required modules are available
try {
  require('canvas');
  require('form-data');
  require('axios');
  testSkynAnalysis();
} catch (e) {
  console.error('❌ Missing required modules. Installing...');
  const { exec } = require('child_process');
  exec('npm install canvas form-data axios', (error) => {
    if (error) {
      console.error('Failed to install modules:', error);
      console.log('Please run: npm install canvas form-data axios');
      console.log('Then run: node test_skyn_real.js');
    } else {
      console.log('✅ Modules installed, running test...');
      testSkynAnalysis();
    }
  });
}