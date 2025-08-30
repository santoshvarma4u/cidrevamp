const http = require('http');

// Test authentication endpoints
async function testAuth() {
  console.log('🔐 Testing Authentication Endpoints...\n');

  const baseUrl = 'http://localhost:5000';
  
  // Test 1: Health check
  console.log('1. Testing health endpoint...');
  try {
    const healthResponse = await makeRequest(`${baseUrl}/api/health`);
    console.log('✅ Health check passed:', healthResponse.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }

  // Test 2: Try to login with admin credentials
  console.log('\n2. Testing admin login...');
  try {
    const loginData = {
      username: 'admin',
      password: 'admin', // You'll need to use the actual admin password
      captchaSessionId: 'dev-captcha',
      captchaInput: 'dev'
    };

    const loginResponse = await makeRequest(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    if (loginResponse.status === 200) {
      console.log('✅ Login successful!');
      console.log('Response:', loginResponse.data);
    } else {
      console.log('❌ Login failed:', loginResponse.status, loginResponse.data);
    }
  } catch (error) {
    console.log('❌ Login request failed:', error.message);
  }

  // Test 3: Check if user is authenticated
  console.log('\n3. Testing authentication check...');
  try {
    const authResponse = await makeRequest(`${baseUrl}/api/auth/user`);
    if (authResponse.status === 200) {
      console.log('✅ User is authenticated:', authResponse.data);
    } else {
      console.log('❌ User not authenticated:', authResponse.status);
    }
  } catch (error) {
    console.log('❌ Auth check failed:', error.message);
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Run the test
testAuth().catch(console.error);
