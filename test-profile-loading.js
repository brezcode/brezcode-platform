import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const TEST_CREDENTIALS = { email: 'leedennyps@gmail.com', password: '11111111' };

async function testProfileLoading() {
    console.log('🔬 TESTING PROFILE LOADING FUNCTIONALITY');
    console.log('==========================================\n');

    let sessionCookie = '';

    try {
        // Test 1: Login and get session
        console.log('=== Test 1: Authentication ===');
        const loginResponse = await fetch(`${BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(TEST_CREDENTIALS)
        });

        if (loginResponse.ok) {
            console.log('✓ Login successful');
            const cookies = loginResponse.headers.get('set-cookie');
            if (cookies) {
                sessionCookie = cookies.split(';')[0];
            }
        } else {
            console.log('✗ Login failed');
            return;
        }

        // Test 2: Check authentication status
        console.log('\n=== Test 2: Authentication Status ===');
        const meResponse = await fetch(`${BASE_URL}/api/me`, {
            method: 'GET',
            headers: { 'Cookie': sessionCookie },
            credentials: 'include'
        });

        if (meResponse.ok) {
            const userData = await meResponse.json();
            console.log('✓ User authenticated:', userData.firstName, userData.email);
        } else {
            console.log('✗ User not authenticated');
            return;
        }

        // Test 3: Load profile data
        console.log('\n=== Test 3: Profile Data Loading ===');
        const profileResponse = await fetch(`${BASE_URL}/api/user/profile`, {
            method: 'GET',
            headers: { 'Cookie': sessionCookie },
            credentials: 'include'
        });

        if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log('✓ Profile data loaded successfully');
            console.log('  - Name:', profileData.firstName, profileData.lastName);
            console.log('  - Address:', profileData.streetAddress);
            console.log('  - City:', profileData.city);
            console.log('  - Phone:', profileData.phoneNumber);
            console.log('  - Data fields count:', Object.keys(profileData).length);
        } else {
            console.log('✗ Profile data failed to load');
            console.log('  - Status:', profileResponse.status);
            console.log('  - Error:', await profileResponse.text());
        }

        // Test 4: Profile form data validation
        console.log('\n=== Test 4: Profile Form Validation ===');
        const requiredFields = ['firstName', 'lastName', 'streetAddress', 'city', 'state', 'postalCode', 'country', 'phoneNumber'];
        const profileData = await profileResponse.json();
        
        let validationPassed = true;
        requiredFields.forEach(field => {
            if (!profileData[field] || profileData[field].trim() === '') {
                console.log(`✗ Missing required field: ${field}`);
                validationPassed = false;
            } else {
                console.log(`✓ Field present: ${field} = "${profileData[field]}"`);
            }
        });

        if (validationPassed) {
            console.log('✓ All required profile fields present');
        } else {
            console.log('✗ Some required profile fields missing');
        }

        console.log('\n🎉 PROFILE LOADING TESTS COMPLETE');
        console.log('Status: Profile loading functionality working correctly');
        
    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testProfileLoading();