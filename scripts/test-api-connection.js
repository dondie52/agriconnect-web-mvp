#!/usr/bin/env node

/**
 * API Connection Test Script for AgriConnect
 * Tests /health and /auth/register endpoints
 * Simulates different request origins including mobile (no origin)
 * 
 * Usage:
 *   node scripts/test-api-connection.js [API_URL]
 * 
 * Examples:
 *   node scripts/test-api-connection.js                                    # Uses localhost:5000
 *   node scripts/test-api-connection.js https://agriconnect-web-mvp.onrender.com
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE = process.argv[2] || 'http://localhost:5000';
const ENDPOINTS = {
  root: '/',
  health: '/health',
  apiHealth: '/api/health',
  register: '/api/auth/register'
};

// Test origins to simulate
const TEST_ORIGINS = [
  { name: 'No Origin (Mobile/Curl)', origin: null },
  { name: 'Vercel Production', origin: 'https://agriconnect-web-mvp.vercel.app' },
  { name: 'Localhost:3000', origin: 'http://localhost:3000' },
  { name: 'Localhost:5173', origin: 'http://localhost:5173' },
  { name: 'Unknown Origin', origin: 'https://malicious-site.com' }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AgriConnect-Test-Script/1.0',
        ...options.headers
      }
    };

    // Add origin header if specified
    if (options.origin) {
      requestOptions.headers['Origin'] = options.origin;
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: tryParseJSON(data)
        });
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    // Set timeout
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    // Send body for POST requests
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

async function testEndpoint(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const originName = options.originName || (options.origin || 'None');
  
  try {
    const response = await makeRequest(url, options);
    const corsHeader = response.headers['access-control-allow-origin'];
    
    return {
      success: response.status < 400,
      status: response.status,
      cors: corsHeader || 'Not set',
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testHealthEndpoints() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  HEALTH ENDPOINT TESTS', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  // Test root endpoint
  log('Testing: GET /', 'blue');
  const rootResult = await testEndpoint(ENDPOINTS.root);
  if (rootResult.success) {
    log(`  ✓ Status: ${rootResult.status}`, 'green');
    log(`  ✓ Response: ${JSON.stringify(rootResult.data).substring(0, 100)}...`, 'dim');
  } else {
    log(`  ✗ Failed: ${rootResult.error || rootResult.status}`, 'red');
  }

  // Test /health endpoint
  log('\nTesting: GET /health', 'blue');
  const healthResult = await testEndpoint(ENDPOINTS.health);
  if (healthResult.success) {
    log(`  ✓ Status: ${healthResult.status}`, 'green');
    log(`  ✓ Response: ${JSON.stringify(healthResult.data)}`, 'dim');
  } else {
    log(`  ✗ Failed: ${healthResult.error || healthResult.status}`, 'red');
  }

  // Test /api/health endpoint
  log('\nTesting: GET /api/health', 'blue');
  const apiHealthResult = await testEndpoint(ENDPOINTS.apiHealth);
  if (apiHealthResult.success) {
    log(`  ✓ Status: ${apiHealthResult.status}`, 'green');
    log(`  ✓ Response: ${JSON.stringify(apiHealthResult.data)}`, 'dim');
  } else {
    log(`  ✗ Failed: ${apiHealthResult.error || apiHealthResult.status}`, 'red');
  }
}

async function testCORSWithOrigins() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  CORS TESTS (Different Origins)', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  for (const testOrigin of TEST_ORIGINS) {
    log(`Testing origin: ${testOrigin.name}`, 'blue');
    
    const result = await testEndpoint(ENDPOINTS.apiHealth, {
      origin: testOrigin.origin,
      originName: testOrigin.name
    });

    if (result.success) {
      log(`  ✓ Status: ${result.status}`, 'green');
      log(`  ✓ CORS Header: ${result.cors}`, 'green');
    } else if (result.status === 403) {
      log(`  ✗ Status: ${result.status} - CORS Rejected`, 'yellow');
      log(`  ✗ Message: ${result.data?.message || 'Access denied'}`, 'dim');
    } else {
      log(`  ✗ Failed: ${result.error || result.status}`, 'red');
    }
    console.log('');
  }
}

async function testRegistration() {
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
  log('  REGISTRATION ENDPOINT TEST', 'cyan');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

  // Test with missing fields (should return validation error)
  log('Testing: POST /api/auth/register (validation test)', 'blue');
  
  const testUser = {
    name: `Test User ${Date.now()}`,
    phone: `267${Math.floor(Math.random() * 90000000) + 10000000}`,
    password: 'testpass123',
    role: 'farmer'
  };

  // Test 1: Missing fields
  log('\n  Test 1: Empty body (should fail validation)', 'dim');
  const emptyResult = await testEndpoint(ENDPOINTS.register, {
    method: 'POST',
    body: {},
    origin: 'https://agriconnect-web-mvp.vercel.app'
  });
  
  if (emptyResult.status === 400) {
    log(`    ✓ Correctly rejected with 400: ${emptyResult.data?.message}`, 'green');
  } else {
    log(`    ? Unexpected status: ${emptyResult.status}`, 'yellow');
  }

  // Test 2: Valid data (simulating mobile - no origin)
  log('\n  Test 2: Valid data from mobile (no origin)', 'dim');
  const mobileResult = await testEndpoint(ENDPOINTS.register, {
    method: 'POST',
    body: testUser,
    origin: null
  });
  
  if (mobileResult.success) {
    log(`    ✓ Registration succeeded (status ${mobileResult.status})`, 'green');
    log(`    ✓ User created: ${mobileResult.data?.user?.name || 'N/A'}`, 'dim');
  } else if (mobileResult.status === 400 && mobileResult.data?.message?.includes('already exists')) {
    log(`    ✓ User already exists (expected on repeat runs)`, 'green');
  } else if (mobileResult.status === 403) {
    log(`    ✗ CORS rejected - mobile requests should be allowed!`, 'red');
  } else {
    log(`    ? Status: ${mobileResult.status} - ${mobileResult.data?.message || mobileResult.error}`, 'yellow');
  }

  // Test 3: Valid data from Vercel origin
  const testUser2 = {
    ...testUser,
    phone: `267${Math.floor(Math.random() * 90000000) + 10000000}`
  };
  
  log('\n  Test 3: Valid data from Vercel origin', 'dim');
  const vercelResult = await testEndpoint(ENDPOINTS.register, {
    method: 'POST',
    body: testUser2,
    origin: 'https://agriconnect-web-mvp.vercel.app'
  });
  
  if (vercelResult.success) {
    log(`    ✓ Registration succeeded (status ${vercelResult.status})`, 'green');
  } else if (vercelResult.status === 403) {
    log(`    ✗ CORS rejected - Vercel origin should be allowed!`, 'red');
  } else {
    log(`    ? Status: ${vercelResult.status} - ${vercelResult.data?.message || vercelResult.error}`, 'yellow');
  }
}

async function runAllTests() {
  log('\n╔════════════════════════════════════════════════╗', 'cyan');
  log('║    AgriConnect API Connection Test Suite       ║', 'cyan');
  log('╚════════════════════════════════════════════════╝', 'cyan');
  log(`\nTarget API: ${API_BASE}`, 'dim');
  log(`Timestamp: ${new Date().toISOString()}`, 'dim');

  try {
    await testHealthEndpoints();
    await testCORSWithOrigins();
    await testRegistration();
    
    log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('  TEST SUMMARY', 'cyan');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');
    log('If all tests passed:', 'green');
    log('  - Health endpoints are accessible', 'dim');
    log('  - CORS is properly configured for Vercel', 'dim');
    log('  - Mobile requests (no origin) are allowed', 'dim');
    log('  - Registration endpoint validates correctly', 'dim');
    log('\nIf CORS tests failed:', 'yellow');
    log('  - Check FRONTEND_URL environment variable on Render', 'dim');
    log('  - Ensure it includes: https://agriconnect-web-mvp.vercel.app', 'dim');
    log('  - Redeploy backend after changing env vars', 'dim');
    
  } catch (error) {
    log(`\n✗ Test suite failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
