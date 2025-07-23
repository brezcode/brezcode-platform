import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const TEST_CREDENTIALS = { email: 'leedennyps@gmail.com', password: '11111111' };

async function testDashboardFunctionality() {
    console.log('🔬 TESTING FINAL DASHBOARD FUNCTIONALITY');
    console.log('==========================================\n');

    try {
        // Test 1: Direct dashboard access (should show loading or auto-login)
        console.log('=== Test 1: Direct Dashboard Access ===');
        const dashboardResponse = await fetch(`${BASE_URL}/`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (dashboardResponse.ok) {
            const content = await dashboardResponse.text();
            if (content.includes('Loading your dashboard') || content.includes('Logging you in') || content.includes('Welcome back')) {
                console.log('✓ Dashboard loads with proper loading/auto-login state');
            } else {
                console.log('? Dashboard content unclear');
            }
        } else {
            console.log(`✗ Dashboard not accessible (${dashboardResponse.status})`);
        }

        // Test 2: Manual login then dashboard access
        console.log('\n=== Test 2: Manual Login → Dashboard ===');
        const loginResponse = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(TEST_CREDENTIALS)
        });

        if (loginResponse.ok) {
            console.log('✓ Login successful');
            
            // Now test /api/me with session
            const meResponse = await fetch(`${BASE_URL}/api/me`, {
                method: 'GET',
                credentials: 'include'
            });
            
            if (meResponse.ok) {
                const userData = await meResponse.json();
                console.log('✓ User data retrieved:', userData.firstName || 'No firstName', userData.email);
            } else {
                console.log('✗ Failed to get user data after login');
            }
        } else {
            console.log('✗ Login failed');
        }

        // Test 3: Login route accessibility
        console.log('\n=== Test 3: Login Route Access ===');
        const loginPageResponse = await fetch(`${BASE_URL}/login`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (loginPageResponse.ok) {
            console.log('✓ Login page accessible at /login');
        } else {
            console.log(`✗ Login page not accessible (${loginPageResponse.status})`);
        }

        console.log('\n🎉 DASHBOARD FUNCTIONALITY TESTS COMPLETE');
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testDashboardFunctionality();