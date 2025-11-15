# AWS Setup Guide for Form Data Submitter

This guide walks you through setting up AWS Cognito Identity Pool and API Gateway permissions for the Form Data Submitter component.

## Prerequisites

- AWS Account
- AWS CLI configured (optional but recommended)
- Basic understanding of AWS IAM, Cognito, and API Gateway

## Step 1: Create Cognito Identity Pool

### 1.1 Using AWS Console

1. **Navigate to Amazon Cognito**

   - Go to AWS Console → Services → Cognito
   - Click "Identity pools" (not User pools)

2. **Create Identity Pool**

   - Click "Create identity pool"
   - Give it a name: `magazine-error-reporting-pool`
   - Check "Enable access to unauthenticated identities"
   - Click "Create pool"

3. **Note the Identity Pool ID**
   - After creation, copy the Identity Pool ID
   - Format: `ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - Save this for later configuration

### 1.2 Using AWS CLI

```bash
# Create Identity Pool
aws cognito-identity create-identity-pool \
  --identity-pool-name "magazine-error-reporting-pool" \
  --allow-unauthenticated-identities \
  --region ap-south-1

# Note the IdentityPoolId from the response
```

## Step 2: Configure IAM Roles

### 2.1 Update Unauthenticated Role

1. **Find the Role**

   - Go to IAM Console → Roles
   - Look for role named like: `Cognito_magazine-error-reporting-poolUnauth_Role`

2. **Attach API Gateway Permissions**
   - Click on the role
   - Click "Add permissions" → "Create inline policy"
   - Use JSON editor and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:ap-south-1:*:6vzjagr1kh/production/POST/error"
    }
  ]
}
```

3. **Name and Save**
   - Name: `ErrorReportingAPIAccess`
   - Click "Create policy"

### 2.2 Using AWS CLI

```bash
# Get the role ARN (replace with your actual identity pool ID)
IDENTITY_POOL_ID="ap-south-1:your-id-here"
UNAUTH_ROLE=$(aws cognito-identity get-identity-pool-roles --identity-pool-id $IDENTITY_POOL_ID --query 'Roles.unauthenticated' --output text)

# Create the policy document
cat > error-reporting-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-south-1:*:6vzjagr1kh/production/POST/error"
        }
    ]
}
EOF

# Attach the policy
aws iam put-role-policy \
  --role-name $(basename $UNAUTH_ROLE) \
  --policy-name ErrorReportingAPIAccess \
  --policy-document file://error-reporting-policy.json
```

## Step 3: Configure API Gateway CORS

### 3.1 Enable CORS for Your Domain

1. **Navigate to API Gateway**

   - Go to AWS Console → API Gateway
   - Find your API: `6vzjagr1kh`

2. **Configure CORS**
   - Select the `/error` resource
   - Click "Actions" → "Enable CORS"
   - Add your domain to allowed origins:
     - For development: `http://localhost:5173`
     - For production: `https://chandamarutham.github.io`
   - Enable for OPTIONS and POST methods
   - Click "Deploy API"

### 3.2 CORS Headers

Ensure your API Gateway responds with these headers:

```
Access-Control-Allow-Origin: https://chandamarutham.github.io
Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
Access-Control-Allow-Methods: POST,OPTIONS
```

## Step 4: Update Configuration Files

### 4.1 Update `awsConfig.js`

Replace the placeholder in `/src/lib/awsConfig.js`:

```javascript
export const awsConfig = {
  Auth: {
    Cognito: {
      region: "ap-south-1",
      identityPoolId: "ap-south-1:YOUR-ACTUAL-ID-HERE", // Replace this!
      allowGuestAccess: true,
    },
  },
};
```

### 4.2 Verify Configuration

Test the configuration by:

1. Opening the error report form: `/report-error`
2. Submitting a test error
3. Checking browser developer tools for any errors
4. Verifying the submission in your API Gateway logs

## Step 5: Testing

### 5.1 Local Testing

```bash
# Start development server
npm run dev

# Navigate to: http://localhost:5173/report-error
# Fill out and submit the form
# Check browser console for any authentication errors
```

### 5.2 Production Testing

```bash
# Build and deploy
npm run build
npm run deploy

# Test on: https://chandamarutham.github.io/magazine/report-error
```

## Common Issues and Solutions

### Issue: "Access denied" errors

**Solution:**

1. Verify the Identity Pool allows unauthenticated access
2. Check IAM role has correct API Gateway permissions
3. Ensure API Gateway resource ARN is correct

### Issue: CORS errors

**Solution:**

1. Enable CORS on API Gateway for your domain
2. Ensure OPTIONS method is enabled
3. Deploy API after CORS changes

### Issue: "Credentials not found"

**Solution:**

1. Verify Amplify configuration is correct
2. Check Identity Pool ID format
3. Ensure browser has internet connectivity

### Issue: API Gateway 403 Forbidden

**Solution:**

1. Check IAM role permissions
2. Verify API Gateway resource policy
3. Ensure correct AWS region in configuration

## Security Considerations

1. **Principle of Least Privilege**

   - Grant only necessary permissions to API Gateway
   - Consider rate limiting on API Gateway

2. **Monitoring**

   - Enable CloudWatch logging for API Gateway
   - Monitor Cognito usage for unusual activity

3. **Data Validation**
   - Validate data on both client and server sides
   - Implement proper input sanitization

## Environment Variables (Optional)

For additional security, you can use environment variables:

```javascript
// In awsConfig.js
export const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || "ap-south-1",
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
      allowGuestAccess: true,
    },
  },
};
```

Create `.env.local`:

```
VITE_AWS_REGION=ap-south-1
VITE_COGNITO_IDENTITY_POOL_ID=ap-south-1:your-actual-id
```

## Support

If you encounter issues:

1. Check AWS CloudWatch logs
2. Verify browser developer console
3. Test with AWS CLI to isolate issues
4. Review AWS documentation for latest API changes
