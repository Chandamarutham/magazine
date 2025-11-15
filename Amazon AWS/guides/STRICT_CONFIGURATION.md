# Strict Environment Configuration

## Why No Default Values?

This project uses **strict environment configuration** without fallback defaults. This means:

### ❌ Instead of this (with defaults):

```javascript
region: import.meta.env.VITE_AWS_REGION || "ap-south-1";
```

### ✅ We use this (strict):

```javascript
region: import.meta.env.VITE_AWS_REGION;
```

## Benefits of Strict Configuration

### 1. **Explicit Configuration**

- You know exactly what values are being used
- No hidden defaults that might cause confusion
- Environment-specific values are clearly visible

### 2. **Fail-Fast Behavior**

- Missing configuration is caught immediately
- No silent failures with wrong default values
- Clear error messages guide you to fix issues

### 3. **Environment Isolation**

- Development, staging, and production environments are completely separate
- No accidental cross-environment contamination
- Each environment must be explicitly configured

### 4. **Security**

- No hardcoded sensitive values in source code
- All configuration comes from secure environment variables
- Easy to audit what values are being used

## Required Environment Variables

Your `.env` file **must** contain these variables:

```bash
# AWS Configuration (Required)
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4

# Production API Endpoints (Required)
VITE_API_ERROR_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error
VITE_API_ADVERTISE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/advertise
VITE_API_SUBSCRIBE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/subscribe
VITE_API_QUERY_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/query

# Pre-production API Endpoints (Required for troubleshooting)
VITE_API_PRE_PROD_ERROR_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error
VITE_API_PRE_PROD_ADVERTISE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/advertise
VITE_API_PRE_PROD_SUBSCRIBE_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/subscribe
VITE_API_PRE_PROD_QUERY_ENDPOINT=https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/query

# Mode Control
VITE_USE_PRE_PRODUCTION=false
```

## What Happens Without Proper Configuration?

### Missing AWS Region:

```
Error: Missing required environment variables: VITE_AWS_REGION.
Please check your .env file.
```

### Missing API Endpoint:

```
Error: Missing API endpoint for 'error'.
Please set VITE_API_ERROR_ENDPOINT in your .env file.
```

### Invalid Identity Pool ID:

```
Error: Invalid Cognito Identity Pool ID format.
Should be like: region:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

## Setup Process

### 1. Quick Setup

```bash
# Copy template and run setup script
cp .env.example .env
npm run setup-config
```

### 2. Manual Setup

```bash
# Copy template
cp .env.example .env

# Edit .env file with your actual values
vim .env

# Validate configuration
npm run validate-config
```

### 3. Validation

```bash
# Check if everything is configured correctly
npm run validate-config

# Or check in browser console after starting dev server
npm run dev
# Look for: "🔧 Mode: development, Pre-production: false"
```

## Development Workflow

### Starting a New Environment

```bash
# 1. Clone the repository
git clone https://github.com/Chandamarutham/magazine.git

# 2. Install dependencies
npm install

# 3. Set up configuration
npm run setup-config

# 4. Edit .env with your actual AWS values
vim .env

# 5. Validate and start
npm run validate-config
npm run dev
```

### Working with Multiple Environments

```bash
# Development environment
cp .env.example .env.development
# Edit .env.development with dev values

# Staging environment
cp .env.example .env.staging
# Edit .env.staging with staging values

# Load specific environment
cp .env.development .env  # Use dev config
npm run dev
```

### Troubleshooting Mode

```bash
# Switch to pre-production for backend debugging
echo "VITE_USE_PRE_PRODUCTION=true" > .env.local
npm run dev

# Switch back to production
echo "VITE_USE_PRE_PRODUCTION=false" > .env.local
npm run dev
```

## Error Examples and Solutions

### Error: "Configuration error: Missing required environment variables"

**Cause**: Required environment variables are not set

**Solution**:

```bash
# Check what's missing
npm run setup-config

# Add missing variables to .env
echo "VITE_AWS_REGION=ap-south-1" >> .env
```

### Error: "Missing API endpoint for 'advertise'"

**Cause**: Specific API endpoint not configured

**Solution**:

```bash
# Add the missing endpoint
echo "VITE_API_ADVERTISE_ENDPOINT=https://your-api.amazonaws.com/production/advertise" >> .env
```

### Warning: "Placeholder values found"

**Cause**: Still using template values from .env.example

**Solution**:

```bash
# Replace placeholder values with real ones
# Change: VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:YOUR-IDENTITY-POOL-ID-HERE
# To:     VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4
```

## Comparison: Before vs After

### Before (With Defaults) ❌

```javascript
// awsConfig.js
region: import.meta.env.VITE_AWS_REGION || 'ap-south-1',
identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID || 'ap-south-1:default-pool-id',

// Problems:
// ❌ Hidden defaults could be wrong for your environment
// ❌ Might work in dev but fail in production
// ❌ Hard to debug configuration issues
// ❌ Security risk with hardcoded values
```

### After (Strict Configuration) ✅

```javascript
// awsConfig.js
region: import.meta.env.VITE_AWS_REGION,
identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,

// Benefits:
// ✅ Explicit configuration required
// ✅ Environment-specific values enforced
// ✅ Clear error messages for missing config
// ✅ No hardcoded values in source code
// ✅ Easy to audit and debug
```

## Best Practices

### 1. Environment Files Organization

```
.env.example     # Template (committed to git)
.env            # Your current environment (not committed)
.env.local      # Local overrides (not committed)
.env.development # Development defaults
.env.production  # Production defaults
```

### 2. Validation Workflow

```bash
# Always validate after changes
npm run setup-config     # Initial setup
npm run validate-config  # Quick validation
npm run dev              # Check browser console
```

### 3. Team Collaboration

```bash
# Share configuration template
git add .env.example
git commit -m "Update environment template"

# Document required variables
# Update ENVIRONMENT_CONFIGURATION_GUIDE.md when adding new variables
```

This strict approach ensures your application configuration is explicit, secure, and environment-appropriate! 🛡️
