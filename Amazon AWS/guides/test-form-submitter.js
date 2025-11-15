/**
 * Test script for Form Data Submitter
 * 
 * This script tests both production and pre-production modes
 * Run this in browser console or as a Node.js script to test the API endpoints
 */

import { submitFormData, submitToPreProduction, getEnvironmentInfo } from './src/lib/formDataSubmitter.js';

// Test data
const testData = {
  errorType: 'test',
  description: 'Testing form data submitter functionality',
  userEmail: 'test@example.com',
  pageUrl: 'http://localhost:5173/test',
  browserInfo: 'Test Browser',
  timestamp: new Date().toISOString()
};

async function runTests() {
  console.log('🧪 Testing Form Data Submitter...\n');
  
  // Test 1: Check environment
  console.log('1. Environment Info:');
  const envInfo = getEnvironmentInfo();
  console.log(envInfo);
  console.log('');
  
  // Test 2: Normal submission (uses current environment settings)
  console.log('2. Normal Submission Test:');
  try {
    const result = await submitFormData(testData);
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Error:', error);
  }
  console.log('');
  
  // Test 3: Force pre-production submission
  console.log('3. Pre-Production Submission Test:');
  try {
    const result = await submitToPreProduction(testData);
    console.log('✅ Success:', result);
  } catch (error) {
    console.log('❌ Error:', error);
  }
  console.log('');
  
  // Test 4: Different endpoint types
  console.log('4. Testing Different Endpoints:');
  const endpoints = ['error', 'advertise', 'subscribe', 'query'];
  
  for (const endpoint of endpoints) {
    console.log(`Testing ${endpoint} endpoint...`);
    try {
      const result = await submitFormData(testData, { 
        endpointType: endpoint,
        bypassAuth: true // Use pre-production for testing
      });
      console.log(`✅ ${endpoint}:`, result.success ? 'Success' : 'Failed');
    } catch (error) {
      console.log(`❌ ${endpoint}:`, error.message);
    }
  }
  
  console.log('\n🏁 Tests completed!');
}

// Instructions for usage
console.log(`
📋 Form Data Submitter Test Instructions:

1. Manual Browser Test:
   - Open your browser developer console
   - Paste this script (or import it in a module)
   - Run: runTests()

2. Environment Variable Test:
   - Create .env.local with VITE_USE_PRE_PRODUCTION=true
   - Restart your dev server: npm run dev
   - Check console for: "🔧 Mode: development, Pre-production: true"

3. Form UI Test:
   - Go to: http://localhost:5173/report-error
   - Look for development environment indicator
   - Submit a test error report
   - Check browser console for submission logs

4. Direct API Test (curl):
   curl -X POST \\
     https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error \\
     -H "Content-Type: application/json" \\
     -d '{"errorType":"test","description":"Direct API test"}'

Environment Variables:
- VITE_USE_PRE_PRODUCTION=true   # Enable pre-production mode
- VITE_USE_PRE_PRODUCTION=false  # Use production mode (default)
`);

// Export the test function if using as a module
if (typeof window !== 'undefined') {
  window.testFormDataSubmitter = runTests;
}

export { runTests as testFormDataSubmitter };