# Environment Configuration Guide

This guide explains how to configure all API URLs and AWS settings using environment variables for the Magazine project.

## Overview

All configuration is now managed through environment variables, making it easy to:

- Switch between different environments (development, staging, production)
- Configure different API Gateway stages
- Override settings without code changes
- Keep sensitive information out of the codebase

## Environment Variables Reference

### AWS Configuration

| Variable                        | Description              | Example                   | Required |
| ------------------------------- | ------------------------ | ------------------------- | -------- |
| `VITE_AWS_REGION`               | AWS region for Cognito   | `ap-south-1`              | ✅       |
| `VITE_COGNITO_IDENTITY_POOL_ID` | Cognito Identity Pool ID | `ap-south-1:12345678-...` | ✅       |

### Production API Endpoints

| Variable                      | Description              | Default                                                              |
| ----------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `VITE_API_BASE_URL`           | Production base URL      | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production` |
| `VITE_API_ERROR_ENDPOINT`     | Error reporting endpoint | `${BASE_URL}/error`                                                  |
| `VITE_API_ADVERTISE_ENDPOINT` | Advertisement endpoint   | `${BASE_URL}/advertise`                                              |
| `VITE_API_SUBSCRIBE_ENDPOINT` | Subscription endpoint    | `${BASE_URL}/subscribe`                                              |
| `VITE_API_QUERY_ENDPOINT`     | Query endpoint           | `${BASE_URL}/query`                                                  |

### Pre-Production API Endpoints

| Variable                               | Description                 | Default                                                                  |
| -------------------------------------- | --------------------------- | ------------------------------------------------------------------------ |
| `VITE_API_PRE_PROD_BASE_URL`           | Pre-production base URL     | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production` |
| `VITE_API_PRE_PROD_ERROR_ENDPOINT`     | Pre-prod error endpoint     | `${PRE_PROD_BASE_URL}/error`                                             |
| `VITE_API_PRE_PROD_ADVERTISE_ENDPOINT` | Pre-prod advertise endpoint | `${PRE_PROD_BASE_URL}/advertise`                                         |
| `VITE_API_PRE_PROD_SUBSCRIBE_ENDPOINT` | Pre-prod subscribe endpoint | `${PRE_PROD_BASE_URL}/subscribe`                                         |
| `VITE_API_PRE_PROD_QUERY_ENDPOINT`     | Pre-prod query endpoint     | `${PRE_PROD_BASE_URL}/query`                                             |

### Mode Control

| Variable                  | Description                  | Values         | Default |
| ------------------------- | ---------------------------- | -------------- | ------- |
| `VITE_USE_PRE_PRODUCTION` | Use pre-production endpoints | `true`/`false` | `false` |

## Configuration Files

### 1. `.env` (Current Environment)

Your current active environment configuration:

```bash
# AWS Configuration
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4

# Production API URLs
VITE_API_ERROR_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error
VITE_API_ADVERTISE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/advertise
VITE_API_SUBSCRIBE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/subscribe
VITE_API_QUERY_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/query

# Pre-production API URLs
VITE_API_PRE_PROD_ERROR_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error
VITE_API_PRE_PROD_ADVERTISE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/advertise

# Mode control
VITE_USE_PRE_PRODUCTION=false
```

### 2. `.env.local` (Local Development Overrides)

Create this file for local development settings (not committed to git):

```bash
# Temporarily use pre-production for debugging
VITE_USE_PRE_PRODUCTION=true

# Override specific endpoints for local testing
VITE_API_ERROR_ENDPOINT=https://my-test-api.execute-api.region.amazonaws.com/dev/error
```

### 3. `.env.development` (Development Defaults)

```bash
VITE_USE_PRE_PRODUCTION=true
VITE_VALIDATE_CONFIG=true
```

### 4. `.env.production` (Production Defaults)

```bash
VITE_USE_PRE_PRODUCTION=false
VITE_VALIDATE_CONFIG=false
```

## Configuration Examples

### Example 1: Different API Gateway Stages

```bash
# Development environment (.env.development)
VITE_API_BASE_URL=https://your-api.execute-api.region.amazonaws.com/dev
VITE_API_ERROR_ENDPOINT=https://your-api.execute-api.region.amazonaws.com/dev/error

# Staging environment (.env.staging)
VITE_API_BASE_URL=https://your-api.execute-api.region.amazonaws.com/staging
VITE_API_ERROR_ENDPOINT=https://your-api.execute-api.region.amazonaws.com/staging/error

# Production environment (.env.production)
VITE_API_BASE_URL=https://your-api.execute-api.region.amazonaws.com/prod
VITE_API_ERROR_ENDPOINT=https://your-api.execute-api.region.amazonaws.com/prod/error
```

### Example 2: Multiple AWS Accounts

```bash
# Development AWS Account
VITE_AWS_REGION=us-east-1
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:dev-identity-pool-id
VITE_API_BASE_URL=https://dev-api.execute-api.us-east-1.amazonaws.com/dev

# Production AWS Account
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:prod-identity-pool-id
VITE_API_BASE_URL=https://prod-api.execute-api.ap-south-1.amazonaws.com/prod
```

### Example 3: Local Backend Testing

```bash
# For testing with local backend
VITE_API_ERROR_ENDPOINT=http://localhost:8000/error
VITE_API_ADVERTISE_ENDPOINT=http://localhost:8000/advertise
VITE_USE_PRE_PRODUCTION=true  # Bypass authentication
```

## Usage in Code

### 1. Automatic Configuration

The configuration is automatically loaded when importing the formDataSubmitter:

```javascript
import { useFormDataSubmitter } from "./lib/formDataSubmitter";

// Configuration is automatically applied based on environment variables
const { submitData } = useFormDataSubmitter();
```

### 2. Manual Configuration Check

```javascript
import {
  getEnvironmentInfo,
  debugConfiguration,
} from "./lib/formDataSubmitter";

// Check current configuration
console.log(getEnvironmentInfo());

// Debug configuration issues
debugConfiguration();
```

### 3. Override at Runtime

```javascript
import { submitFormData } from "./lib/formDataSubmitter";

// Override endpoint for specific request
await submitFormData(data, {
  endpointType: "error",
  bypassAuth: true,
  // Could add custom endpoint override here if needed
});
```

## Validation and Debugging

### Automatic Validation

The system automatically validates your configuration in development mode and shows warnings for:

- Missing required environment variables
- Invalid Cognito Identity Pool ID format
- Placeholder values still in use
- Insecure (non-HTTPS) endpoints

### Manual Validation

```javascript
import { validateConfiguration } from "./lib/configValidator";

const validation = validateConfiguration();
console.log("Is valid:", validation.isValid);
console.log("Errors:", validation.errors);
console.log("Warnings:", validation.warnings);
```

### Browser Console Debugging

In development mode, check the browser console for:

- Configuration validation results
- Current environment information
- API request logs with actual endpoints

## Best Practices

### 1. Environment File Hierarchy

1. `.env.local` - Local development (highest priority, not committed)
2. `.env.development` - Development defaults
3. `.env.production` - Production defaults
4. `.env` - Base configuration (lowest priority)

### 2. Security Guidelines

- ✅ **DO**: Use environment variables for all URLs and configuration
- ✅ **DO**: Commit `.env.example` with placeholder values
- ✅ **DO**: Use different Identity Pools for different environments
- ❌ **DON'T**: Commit `.env.local` files
- ❌ **DON'T**: Put secrets in environment variables (use AWS Secrets Manager)
- ❌ **DON'T**: Use pre-production mode in production builds

### 3. Development Workflow

1. Copy `.env.example` to `.env`
2. Update placeholder values with real configuration
3. Create `.env.local` for local overrides
4. Use `VITE_USE_PRE_PRODUCTION=true` for backend debugging
5. Validate configuration with `debugConfiguration()`

### 4. Deployment

- Ensure environment variables are set in your deployment platform
- Verify `VITE_USE_PRE_PRODUCTION=false` in production
- Test configuration after deployment

## Troubleshooting

### Issue: Environment variables not loading

- Restart development server after changing `.env` files
- Ensure variable names start with `VITE_`
- Check file is in project root

### Issue: Configuration validation errors

```javascript
import { debugConfiguration } from "./lib/formDataSubmitter";
debugConfiguration(); // Shows detailed configuration report
```

### Issue: Wrong endpoints being used

- Check `VITE_USE_PRE_PRODUCTION` setting
- Verify environment variable values
- Clear browser cache and restart dev server

### Issue: Authentication errors

- Verify Cognito Identity Pool ID format
- Check AWS region matches Identity Pool region
- Ensure Identity Pool allows unauthenticated access

## Migration from Hardcoded URLs

If you have existing hardcoded URLs, here's how to migrate:

### 1. Identify Current URLs

```bash
# Find hardcoded URLs in your codebase
grep -r "https://.*execute-api" src/
```

### 2. Add to Environment Variables

```bash
# Add to .env
VITE_API_CUSTOM_ENDPOINT=https://your-existing-url.execute-api.region.amazonaws.com/stage/path
```

### 3. Update Code

```javascript
// Before
const url =
  "https://hardcoded-url.execute-api.region.amazonaws.com/prod/endpoint";

// After
import { getApiEndpoint, buildEndpointUrl } from "./lib/awsConfig";
const url = getApiEndpoint("custom"); // or buildEndpointUrl('custom/path')
```

This configuration approach provides maximum flexibility while maintaining security and ease of management across different environments.
