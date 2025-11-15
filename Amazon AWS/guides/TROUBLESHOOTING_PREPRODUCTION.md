# Troubleshooting Guide - Pre-Production API Access

This guide explains how to use the pre-production API endpoints for troubleshooting backend issues by bypassing Cognito authentication.

## Quick Setup for Pre-Production Mode

### Method 1: Environment Variable (Recommended)

1. **Create `.env.local` file** in your project root:

```bash
echo "VITE_USE_PRE_PRODUCTION=true" > .env.local
```

2. **Restart your development server**:

```bash
npm run dev
```

3. **Check the browser console** for confirmation:
   - Look for: `🔧 Mode: development, Pre-production: true`
   - Form submissions will show: `📡 Submitting to: https://...pre-production/error, Auth bypass: true`

### Method 2: Programmatic Override

```javascript
import {
  submitToPreProduction,
  getEnvironmentInfo,
} from "./lib/formDataSubmitter";

// Check current environment
console.log(getEnvironmentInfo());

// Direct submission to pre-production (always bypasses auth)
const result = await submitToPreProduction(
  {
    errorType: "test",
    description: "Testing pre-production endpoint",
    timestamp: new Date().toISOString(),
  },
  "error"
);
```

### Method 3: Component-Level Override

```javascript
import { useFormDataSubmitter } from "./lib/formDataSubmitter";

function TestForm() {
  const { submitData } = useFormDataSubmitter();

  const handleSubmit = async (formData) => {
    // Force bypass authentication for this submission
    const result = await submitData(formData, {
      bypassAuth: true,
      endpointType: "error",
    });
  };
}
```

## Available Pre-Production Endpoints

When `VITE_USE_PRE_PRODUCTION=true`, these endpoints are used:

- **Error Reporting**: `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error`
- **Advertising**: `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/advertise`
- **Subscription**: `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/subscribe`
- **Query**: `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/query`

## Environment Variables

### Core Configuration

```bash
# .env.local or .env.development
VITE_USE_PRE_PRODUCTION=true    # Enable pre-production mode
```

### Optional Overrides

```bash
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4
```

## Debugging Commands

### Check Environment Status

Add this to any component to debug:

```javascript
import { getEnvironmentInfo } from "./lib/formDataSubmitter";

console.log("Environment Info:", getEnvironmentInfo());
// Output:
// {
//   mode: "development",
//   isPreProduction: true,
//   endpoint: "https://...pre-production/error",
//   useAuthentication: false
// }
```

### Test Direct API Call

```javascript
import { submitToPreProduction } from "./lib/formDataSubmitter";

// Test error endpoint
const testError = await submitToPreProduction({
  errorType: "test",
  description: "Direct API test",
  timestamp: new Date().toISOString(),
});

console.log("Test result:", testError);
```

### Browser Console Logging

When pre-production mode is active, you'll see these logs:

```
🔧 Mode: development, Pre-production: true
📡 Submitting to: https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error, Auth bypass: true
```

## Troubleshooting Common Issues

### Issue: Still using production endpoints

**Check:**

1. Environment variable is set: `VITE_USE_PRE_PRODUCTION=true`
2. Development server was restarted after setting the variable
3. Browser console shows the correct mode

**Solution:**

```bash
# Verify environment variable
echo $VITE_USE_PRE_PRODUCTION

# Restart dev server
npm run dev
```

### Issue: CORS errors with pre-production

**Check:**

1. API Gateway CORS configuration for pre-production stage
2. Browser developer tools network tab for actual error

**Solution:**
Ensure your API Gateway pre-production stage has CORS enabled for your development domain.

### Issue: 403/401 errors with pre-production

This is normal - pre-production endpoints should NOT require authentication. If you're getting auth errors:

1. Verify you're actually hitting pre-production URLs
2. Check that `bypassAuth: true` is being used
3. Ensure the backend Lambda is configured to handle unauthenticated requests

### Issue: Environment variable not working

**Check Vite Environment Variable Rules:**

1. Variables must start with `VITE_`
2. Must restart dev server after changes
3. Use `.env.local` for local development (not committed to git)

## Network Debugging

### Check Actual Request in Browser

1. Open Developer Tools → Network tab
2. Submit a form
3. Look for the request to verify:
   - URL contains `pre-production`
   - No `Authorization` or `X-Amz-Security-Token` headers
   - Request body contains your form data

### Example Network Request (Pre-Production)

```
POST https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error
Headers:
  Content-Type: application/json
  Accept: application/json
  # NO Auth headers when bypassing

Body:
{
  "errorType": "ui-bug",
  "description": "Test error",
  "timestamp": "2025-11-15T10:30:00.000Z"
}
```

### Example Network Request (Production)

```
POST https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error
Headers:
  Content-Type: application/json
  Accept: application/json
  Authorization: AWS4-HMAC-SHA256 Credential=...
  X-Amz-Security-Token: ...

Body: (same)
```

## Switching Back to Production

1. **Remove environment variable:**

```bash
# Delete .env.local or set to false
echo "VITE_USE_PRE_PRODUCTION=false" > .env.local
```

2. **Restart development server:**

```bash
npm run dev
```

3. **Verify in console:**

```
🔧 Mode: development, Pre-production: false
📡 Submitting to: https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error, Auth bypass: false
```

## Production Deployment

**Important**: Never deploy with `VITE_USE_PRE_PRODUCTION=true` to production!

The environment variable only affects your local development environment when using Vite's development server.

## API Testing with curl

You can also test the pre-production endpoints directly:

```bash
# Test error endpoint
curl -X POST \
  https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error \
  -H "Content-Type: application/json" \
  -d '{
    "errorType": "test",
    "description": "Direct curl test",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'
```

This helps isolate whether issues are in the frontend code or the backend API.
