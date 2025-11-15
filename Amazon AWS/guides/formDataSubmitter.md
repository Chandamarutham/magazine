# Form Data Submitter

A React component for submitting form data to AWS API Gateway endpoints protected by AWS Cognito for unauthenticated users.

## Features

- ✅ AWS Amplify integration for Cognito authentication
- ✅ Automatic credential management for unauthenticated users
- ✅ React hook for state management
- ✅ Higher-order component (HOC) pattern support
- ✅ Error handling and response parsing
- ✅ TypeScript-friendly design

## Setup

### 1. Configure AWS Amplify

Before using the component, you need to configure your AWS settings. Update the configuration in `formDataSubmitter.js`:

```javascript
const amplifyConfig = {
  Auth: {
    Cognito: {
      region: "ap-south-1",
      identityPoolId: "your-actual-identity-pool-id", // Replace this!
      allowGuestAccess: true,
    },
  },
};
```

### 2. Alternative Configuration

You can also configure the settings at runtime:

```javascript
import { configureFormDataSubmitter } from "./lib/formDataSubmitter";

configureFormDataSubmitter({
  Auth: {
    Cognito: {
      region: "ap-south-1",
      identityPoolId: "us-east-1:12345678-1234-1234-1234-123456789012",
      allowGuestAccess: true,
    },
  },
});
```

## Usage

### Basic Function Usage

```javascript
import { submitFormData } from "./lib/formDataSubmitter";

const handleSubmit = async () => {
  const formData = {
    errorType: "ui-bug",
    description: "Button not working",
    timestamp: new Date().toISOString(),
  };

  const result = await submitFormData(formData);

  if (result.success) {
    console.log("Success:", result.data);
  } else {
    console.error("Error:", result.error);
  }
};
```

### React Hook Usage

```javascript
import { useFormDataSubmitter } from "./lib/formDataSubmitter";

function ErrorReportForm() {
  const { submitData, isSubmitting, lastResult, clearResult } =
    useFormDataSubmitter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      errorType: "ui-bug",
      description: "Button not working",
      timestamp: new Date().toISOString(),
    };

    const result = await submitData(formData);

    if (result.success) {
      // Handle success
      console.log("Form submitted successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {lastResult && !lastResult.success && (
        <div className="error">Error: {lastResult.error}</div>
      )}
    </form>
  );
}
```

### Higher-Order Component Usage

```javascript
import { withFormDataSubmitter } from "./lib/formDataSubmitter";

function ErrorReportForm({ formSubmitter }) {
  const { submitData, isSubmitting, lastResult } = formSubmitter;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      errorType: "ui-bug",
      description: "Button not working",
    };

    await submitData(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form */}
      <button disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default withFormDataSubmitter(ErrorReportForm);
```

## API Reference

### `submitFormData(formData, options)`

**Parameters:**

- `formData` (Object): The data to submit
- `options` (Object, optional):
  - `method` (string): HTTP method (default: 'POST')
  - `headers` (Object): Additional headers

**Returns:** Promise resolving to:

```javascript
{
  success: boolean,
  data: any,          // Response data (if success)
  error: string,      // Error message (if failure)
  status: number,     // HTTP status code
  details: Error      // Full error object (if failure)
}
```

### `useFormDataSubmitter()`

**Returns:**

```javascript
{
  submitData: (formData, options) => Promise,
  isSubmitting: boolean,
  lastResult: Object|null,
  clearResult: () => void
}
```

## AWS Configuration Requirements

### 1. Cognito Identity Pool

You need an AWS Cognito Identity Pool with:

- ✅ Unauthenticated access enabled
- ✅ Proper IAM roles for unauthenticated users
- ✅ API Gateway invoke permissions

### 2. IAM Role for Unauthenticated Users

The IAM role should include:

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

### 3. API Gateway CORS

Ensure your API Gateway has proper CORS configuration for your domain.

## Error Handling

The component handles various error scenarios:

- AWS credential failures
- Network connectivity issues
- API Gateway errors
- Invalid response formats

All errors are captured and returned in a consistent format for easy handling in your UI components.

## Security Considerations

- Uses AWS Cognito for secure, temporary credentials
- Credentials are automatically managed by AWS Amplify
- No API keys or secrets stored in client code
- Supports AWS IAM policies for fine-grained access control

## Dependencies

- `aws-amplify` - AWS SDK for browser applications
- `react` - For React hooks and components (if using React features)
