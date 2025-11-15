# GitHub Pages Configuration Guide

This guide explains how to configure and validate environment variables for GitHub Pages deployment.

## 🚀 Overview

Since GitHub Pages is a static hosting service, environment configuration works differently than local development:

- **Local Development**: Uses `.env` files
- **GitHub Pages**: Uses GitHub Secrets and build-time injection

## 🔐 Setting Up GitHub Secrets

### 1. Navigate to Repository Settings

1. Go to your repository: `https://github.com/Chandamarutham/magazine`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**

### 2. Add Required Secrets

Add these secrets (click **New repository secret**):

#### AWS Configuration

| Secret Name                     | Value                 | Example                                           |
| ------------------------------- | --------------------- | ------------------------------------------------- |
| `VITE_AWS_REGION`               | Your AWS region       | `ap-south-1`                                      |
| `VITE_COGNITO_IDENTITY_POOL_ID` | Your Identity Pool ID | `ap-south-1:89430077-850f-47bd-8d94-ed59223c2ed4` |

#### Production API Endpoints

| Secret Name                   | Value                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------ |
| `VITE_API_BASE_URL`           | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production`           |
| `VITE_API_ERROR_ENDPOINT`     | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error`     |
| `VITE_API_ADVERTISE_ENDPOINT` | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/advertise` |
| `VITE_API_SUBSCRIBE_ENDPOINT` | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/subscribe` |
| `VITE_API_QUERY_ENDPOINT`     | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/query`     |

#### Pre-Production API Endpoints (Optional)

| Secret Name                            | Value                                                                              |
| -------------------------------------- | ---------------------------------------------------------------------------------- |
| `VITE_API_PRE_PROD_BASE_URL`           | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production`           |
| `VITE_API_PRE_PROD_ERROR_ENDPOINT`     | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/error`     |
| `VITE_API_PRE_PROD_ADVERTISE_ENDPOINT` | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/advertise` |
| `VITE_API_PRE_PROD_SUBSCRIBE_ENDPOINT` | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/subscribe` |
| `VITE_API_PRE_PROD_QUERY_ENDPOINT`     | `https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/pre-production/query`     |

## 🔄 Deployment Process

### Automated Deployment (Recommended)

The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. **Validates configuration** before building
2. **Creates environment file** from GitHub Secrets
3. **Builds the project** with proper environment variables
4. **Deploys to GitHub Pages**

### Manual Deployment

If you prefer manual deployment:

```bash
# 1. Set up local environment for production build
cp .env.example .env.production

# 2. Edit .env.production with production values
vim .env.production

# 3. Build with production config
VITE_MODE=production npm run build

# 4. Deploy
npm run deploy
```

## 🔍 Validation Methods

### 1. Build-Time Validation (GitHub Actions)

The workflow automatically validates configuration before deployment:

```yaml
- name: Validate configuration
  run: npm run validate-env
```

If validation fails, the deployment stops with clear error messages.

### 2. Runtime Validation (Browser)

After deployment, check the browser console at `https://chandamarutham.github.io/magazine/`:

```javascript
// Look for these messages:
✅ Configuration validated successfully
// OR
⚠️ Configuration Issues Detected
```

### 3. Manual Testing

Test specific functionality:

```bash
# Visit the error report form
https://chandamarutham.github.io/magazine/report-error

# Submit a test report and check browser console for:
📡 Submitting to: https://6vzjagr1kh.execute-api.ap-south-1.amazonaws.com/production/error, Auth bypass: false
```

## 📊 Monitoring Configuration Status

### GitHub Actions Logs

Check deployment logs:

1. Go to **Actions** tab in your repository
2. Click on the latest workflow run
3. Expand **Validate configuration** step

### Browser Developer Tools

In production:

1. Open browser developer tools (F12)
2. Check **Console** tab for validation messages
3. Check **Network** tab for API call URLs

### Configuration Debug Commands

Add these to browser console for debugging:

```javascript
// Check current environment info
import("./src/lib/formDataSubmitter.js").then((m) =>
  console.log(m.getEnvironmentInfo())
);

// Run full configuration validation
import("./src/lib/configValidator.js").then((m) =>
  m.printConfigurationReport()
);
```

## 🚨 Troubleshooting

### Issue: "Missing required environment variables"

**In GitHub Actions:**

1. Check that all required secrets are set in repository settings
2. Verify secret names match exactly (case-sensitive)
3. Check workflow file uses correct secret names

**Solution:**

```bash
# Add missing secrets in GitHub repository settings
# Secrets → Actions → New repository secret
```

### Issue: "Configuration validation failed" in production

**Check:**

1. GitHub Secrets are properly set
2. Secret values don't have extra spaces or quotes
3. URLs are valid and accessible

**Debug:**

```javascript
// In browser console on your GitHub Pages site
console.log(import.meta.env); // Check what variables are available
```

### Issue: API calls failing in production

**Check:**

1. CORS settings on your API Gateway
2. API Gateway allows requests from `https://chandamarutham.github.io`
3. Network tab shows correct API URLs

**Solution:**
Update API Gateway CORS settings:

```
Access-Control-Allow-Origin: https://chandamarutham.github.io
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Amz-Security-Token
```

## 🔄 Updating Configuration

### For Immediate Changes

1. **Update GitHub Secrets**
2. **Trigger new deployment:**
   ```bash
   # Push any change to trigger workflow
   git commit --allow-empty -m "Trigger deployment"
   git push
   ```

### For New Environment Variables

1. **Add new secret** in GitHub repository settings
2. **Update workflow file** (`.github/workflows/deploy.yml`)
3. **Add to validation** in `configValidator.js` if required

## 📈 Best Practices

### 1. Environment Separation

- Use different AWS accounts/regions for different environments
- Keep production secrets secure and limited access
- Test changes in staging before production

### 2. Monitoring

- Set up CloudWatch alerts for API Gateway errors
- Monitor GitHub Actions for failed deployments
- Check browser console regularly in production

### 3. Security

- Rotate secrets regularly
- Use least privilege IAM policies
- Monitor API usage for unusual activity

## 🎯 Quick Checklist

Before deploying to GitHub Pages:

- [ ] All required GitHub Secrets are set
- [ ] GitHub Actions workflow exists (`.github/workflows/deploy.yml`)
- [ ] Local validation passes (`npm run validate-config`)
- [ ] API Gateway CORS configured for GitHub Pages domain
- [ ] Identity Pool allows unauthenticated access
- [ ] Test form submission locally

After deployment:

- [ ] GitHub Actions workflow completed successfully
- [ ] Browser console shows configuration validation success
- [ ] Error form submission works on GitHub Pages
- [ ] API calls reach correct endpoints
- [ ] No CORS errors in browser console

This setup ensures your GitHub Pages deployment has proper configuration validation both at build time and runtime! 🚀
