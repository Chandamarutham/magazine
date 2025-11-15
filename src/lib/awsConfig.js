/**
 * AWS Amplify Configuration for Form Data Submission
 * All configuration is loaded from environment variables
 */

// Load AWS configuration from environment variables
export const awsConfig = {
  Auth: {
    Cognito: {
      // AWS Region where your Cognito Identity Pool is located
      region: import.meta.env.VITE_AWS_REGION,
      
      // Your Cognito Identity Pool ID
      identityPoolId: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID,
      
      // Allow unauthenticated users to get temporary AWS credentials
      allowGuestAccess: true
    }
  }
};

// Validate required environment variables
const validateRequiredEnvVars = () => {
  const required = [
    { name: 'VITE_AWS_REGION', value: import.meta.env.VITE_AWS_REGION },
    { name: 'VITE_COGNITO_IDENTITY_POOL_ID', value: import.meta.env.VITE_COGNITO_IDENTITY_POOL_ID }
  ];
  
  const missing = required.filter(env => !env.value);
  
  if (missing.length > 0) {
    const missingNames = missing.map(env => env.name).join(', ');
    throw new Error(`Missing required environment variables: ${missingNames}. Please check your .env file.`);
  }
};

// Validate on module load
validateRequiredEnvVars();

// Load API Gateway endpoint configuration from environment variables
export const apiConfig = {
  // Production endpoints
  production: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    error: import.meta.env.VITE_API_ERROR_ENDPOINT,
    advertise: import.meta.env.VITE_API_ADVERTISE_ENDPOINT,
    subscribe: import.meta.env.VITE_API_SUBSCRIBE_ENDPOINT,
    query: import.meta.env.VITE_API_QUERY_ENDPOINT,
  },
  // Pre-production endpoints
  preProduction: {
    baseUrl: import.meta.env.VITE_API_PRE_PROD_BASE_URL,
    error: import.meta.env.VITE_API_PRE_PROD_ERROR_ENDPOINT,
    advertise: import.meta.env.VITE_API_PRE_PROD_ADVERTISE_ENDPOINT,
    subscribe: import.meta.env.VITE_API_PRE_PROD_SUBSCRIBE_ENDPOINT,
    query: import.meta.env.VITE_API_PRE_PROD_QUERY_ENDPOINT,
  }
};

// Environment configuration
export const getConfig = () => {
  const mode = import.meta.env.MODE || 'production';
  const isPreProduction = import.meta.env.VITE_USE_PRE_PRODUCTION === 'true';
  
  console.log(`🔧 Mode: ${mode}, Pre-production: ${isPreProduction}`);
  
  return {
    ...awsConfig,
    // Override settings based on environment
    usePreProduction: isPreProduction,
    bypassAuth: isPreProduction, // Bypass Cognito auth in pre-production
  };
};

// Get the appropriate API endpoint based on environment
export const getApiEndpoint = (endpointType = 'error') => {
  const isPreProduction = import.meta.env.VITE_USE_PRE_PRODUCTION === 'true';
  const environmentEndpoints = isPreProduction ? apiConfig.preProduction : apiConfig.production;
  const envPrefix = isPreProduction ? 'VITE_API_PRE_PROD' : 'VITE_API';
  
  const endpoint = environmentEndpoints[endpointType];
  
  if (!endpoint) {
    const requiredVar = `${envPrefix}_${endpointType.toUpperCase()}_ENDPOINT`;
    throw new Error(`Missing API endpoint for '${endpointType}'. Please set ${requiredVar} in your .env file.`);
  }
  
  return endpoint;
};

// Helper function to get all endpoints for a specific environment
export const getAllEndpoints = (usePreProduction = false) => {
  return usePreProduction ? apiConfig.preProduction : apiConfig.production;
};

// Helper function to build endpoint URL for custom paths
export const buildEndpointUrl = (path = '', usePreProduction = false) => {
  const config = usePreProduction ? apiConfig.preProduction : apiConfig.production;
  const baseUrl = config.baseUrl;
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
};

export default awsConfig;