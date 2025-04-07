// Simple non-interactive test script for storage features
// Run with: node test-storage-non-interactive.js

// Using ES modules for compatibility with project
import fetch from 'node-fetch';

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
    
    // Get the cookie from the response
    const cookies = response.headers.get('set-cookie');
    if (!cookies) {
      console.warn('Warning: No cookies returned from login');
    } else {
      console.log('Got session cookie');
      authToken = cookies;
    }
    
    // Try to parse response as JSON but be prepared to handle non-JSON
    try {
      const data = await response.json();
      console.log('Login successful:', data.user?.username || 'unknown');
      return data.user;
    } catch (jsonError) {
      console.log('Login appeared successful but response was not JSON');
      // Continue anyway since we have the cookie
      return { id: 1, role: 'admin' }; // Minimal user object
    }
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
        'Cookie': authToken,
        'X-API-Key': 'test-admin-key'
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

async function runAllTests() {
  try {
    await ensureAdminExists();
    await login();
    
    console.log('\n=== Testing All Features ===');
    
    // Test coupons
    await testFeature('coupons');
    
    // Test subscriptions
    await testFeature('subscriptions');
    
    // Test audit logs
    await testFeature('audit');
    
    // Test forum
    await testFeature('forum');
    
    console.log('\n=== All tests completed ===');
  } catch (error) {
    console.error('Error running tests:', error.message);
  }
}

// Run all tests automatically
runAllTests();