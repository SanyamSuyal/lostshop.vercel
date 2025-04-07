// Simple test script for storage features
// Run with: node test-storage.js

// node-fetch v3 is ESM only, so we use the v2.x for compatibility
const fetch = require('node-fetch');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BASE_URL = 'http://localhost:5000';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'adminpass123'
};

let authToken = null;

async function login() {
  console.log('Logging in as admin...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Login successful:', data.user.username);
    
    // Store session cookie
    const cookies = response.headers.get('set-cookie');
    authToken = cookies;
    
    return data.user;
  } catch (error) {
    console.error('Error logging in:', error.message);
    process.exit(1);
  }
}

async function testFeature(feature) {
  console.log(`\nTesting feature: ${feature}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/test/storage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': authToken
      },
      body: JSON.stringify({ feature })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Test failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Test successful!');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error(`Error testing ${feature}:`, error.message);
    return null;
  }
}

async function ensureAdminExists() {
  try {
    console.log('Ensuring admin account exists...');
    const response = await fetch(`${BASE_URL}/api/create-admin-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Warning: Admin account creation failed: ${response.status} ${errorText}`);
      console.log('Continuing with login attempt...');
    } else {
      const data = await response.json();
      console.log('Admin account ready:', data.message);
    }
  } catch (error) {
    console.warn('Warning: Error ensuring admin exists:', error.message);
    console.log('Continuing with login attempt...');
  }
}

async function runTests() {
  await ensureAdminExists();
  const user = await login();
  
  console.log('\nWhich feature would you like to test?');
  console.log('1. Coupons');
  console.log('2. Subscriptions');
  console.log('3. Audit Logs');
  console.log('4. Forum');
  console.log('5. All Features');
  
  rl.question('\nEnter your choice (1-5): ', async (choice) => {
    switch (choice) {
      case '1':
        await testFeature('coupons');
        break;
      case '2':
        await testFeature('subscriptions');
        break;
      case '3':
        await testFeature('audit');
        break;
      case '4':
        await testFeature('forum');
        break;
      case '5':
        console.log('\n=== Testing All Features ===');
        await testFeature('coupons');
        await testFeature('subscriptions');
        await testFeature('audit');
        await testFeature('forum');
        break;
      default:
        console.log('Invalid choice. Exiting.');
    }
    
    rl.close();
  });
}

runTests();