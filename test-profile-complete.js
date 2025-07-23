#!/usr/bin/env node

// Complete Profile Testing Script - Full End-to-End Verification
// Tests profile saving without authentication barriers

import http from 'http';

const testData = {
  firstName: "TEST USER",
  lastName: "AUTOMATED",
  streetAddress: "999 Automation Blvd",
  city: "Test City",
  state: "Test State", 
  postalCode: "99999",
  country: "Test Country",
  phoneNumber: "555-AUTO-TEST"
};

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function runCompleteTest() {
  console.log("🚀 COMPLETE PROFILE TESTING - NO AUTH BARRIERS");
  console.log("=".repeat(50));
  
  try {
    // Step 1: Login to get session
    console.log("1. Logging in for session...");
    const loginResult = await makeRequest('POST', '/api/login', {
      email: 'leedennyps@gmail.com',
      password: '11111111'
    });
    
    if (loginResult.status !== 200) {
      console.error("❌ Login failed:", loginResult);
      return;
    }
    console.log("✅ Login successful");
    
    // Extract session cookie
    const sessionCookie = loginResult.headers?.['set-cookie']?.[0];
    
    // Step 2: Test profile update 
    console.log("\n2. Testing profile update...");
    const updateResult = await makeRequest('POST', '/api/user/profile', testData);
    
    console.log("Update Response Status:", updateResult.status);
    console.log("Update Response Data:", JSON.stringify(updateResult.data, null, 2));
    
    if (updateResult.status === 200) {
      console.log("✅ Profile update API successful");
    } else {
      console.error("❌ Profile update failed");
      return;
    }
    
    // Step 3: Verify data retrieval
    console.log("\n3. Testing profile retrieval...");
    const getResult = await makeRequest('GET', '/api/user/profile');
    
    console.log("Retrieval Response Status:", getResult.status);
    console.log("Retrieved Data:", JSON.stringify(getResult.data, null, 2));
    
    // Step 4: Verify each field
    console.log("\n4. Field-by-field verification:");
    const retrieved = getResult.data;
    let allFieldsMatch = true;
    
    Object.keys(testData).forEach(field => {
      const expected = testData[field];
      const actual = retrieved[field];
      const matches = actual === expected;
      
      console.log(`${matches ? '✅' : '❌'} ${field}: Expected "${expected}", Got "${actual}"`);
      
      if (!matches) {
        allFieldsMatch = false;
      }
    });
    
    console.log("\n" + "=".repeat(50));
    if (allFieldsMatch) {
      console.log("🎉 ALL TESTS PASSED - PROFILE SAVING FULLY WORKING!");
    } else {
      console.log("💥 SOME TESTS FAILED - ISSUES REMAIN");
    }
    
  } catch (error) {
    console.error("🔥 Test error:", error.message);
  }
}

runCompleteTest();