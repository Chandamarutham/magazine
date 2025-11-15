/**
 * Configuration Validation Utility
 * Helps ensure all required environment variables are properly set
 */

import { awsConfig, apiConfig } from './awsConfig.js';

/**
 * Validates the current configuration and provides helpful feedback
 * @returns {Object} - Validation results and recommendations
 */
export function validateConfiguration() {
  const validation = {
    isValid: true,
    warnings: [],
    errors: [],
    recommendations: [],
    configuration: {}
  };

  try {
    // Check AWS Configuration
    validation.configuration.aws = {
      region: awsConfig.Auth.Cognito.region,
      identityPoolId: awsConfig.Auth.Cognito.identityPoolId,
      hasValidIdentityPool: false
    };

    // Validate required AWS environment variables
    if (!validation.configuration.aws.region) {
      validation.errors.push('Missing VITE_AWS_REGION environment variable');
      validation.isValid = false;
    }

    if (!validation.configuration.aws.identityPoolId) {
      validation.errors.push('Missing VITE_COGNITO_IDENTITY_POOL_ID environment variable');
      validation.isValid = false;
    } else {
      // Validate Identity Pool ID format
      const identityPoolPattern = /^[a-zA-Z0-9-]+:[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
      if (!identityPoolPattern.test(validation.configuration.aws.identityPoolId)) {
        validation.errors.push('Invalid Cognito Identity Pool ID format. Should be like: region:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        validation.isValid = false;
      } else {
        validation.configuration.aws.hasValidIdentityPool = true;
      }

      // Check if using placeholder values
      if (validation.configuration.aws.identityPoolId.includes('YOUR-IDENTITY-POOL-ID-HERE')) {
        validation.errors.push('Cognito Identity Pool ID is still using placeholder value');
        validation.isValid = false;
      }
    }

  } catch (error) {
    validation.errors.push(`Configuration error: ${error.message}`);
    validation.isValid = false;
    return validation; // Return early if config can't be loaded
  }

  // Check API Endpoints
  try {
    validation.configuration.endpoints = {
      production: apiConfig.production,
      preProduction: apiConfig.preProduction,
      currentMode: import.meta.env.VITE_USE_PRE_PRODUCTION === 'true' ? 'pre-production' : 'production'
    };

    // Validate endpoint URLs
    const requiredEndpoints = ['error', 'advertise', 'subscribe', 'query'];
    
    for (const env of ['production', 'preProduction']) {
      const endpoints = apiConfig[env];
      
      for (const endpoint of requiredEndpoints) {
        if (!endpoints[endpoint]) {
          const envVar = env === 'production' 
            ? `VITE_API_${endpoint.toUpperCase()}_ENDPOINT`
            : `VITE_API_PRE_PROD_${endpoint.toUpperCase()}_ENDPOINT`;
          validation.warnings.push(`Missing ${env} ${endpoint} endpoint (${envVar})`);
        } else if (endpoints[endpoint].includes('your-api-id')) {
          validation.warnings.push(`${env} ${endpoint} endpoint is using placeholder value`);
        } else if (!endpoints[endpoint].startsWith('https://')) {
          validation.errors.push(`${env} ${endpoint} endpoint should use HTTPS`);
          validation.isValid = false;
        }
      }
    }
  } catch (error) {
    validation.warnings.push(`Could not validate API endpoints: ${error.message}`);
  }

  // Check environment variables
  const requiredEnvVars = [
    'VITE_AWS_REGION',
    'VITE_COGNITO_IDENTITY_POOL_ID',
    'VITE_API_ERROR_ENDPOINT',
    'VITE_USE_PRE_PRODUCTION'
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  if (missingEnvVars.length > 0) {
    validation.warnings.push(`Missing environment variables: ${missingEnvVars.join(', ')}`);
  }

  // Recommendations
  if (validation.configuration.endpoints.currentMode === 'pre-production') {
    validation.recommendations.push('Currently using pre-production endpoints (authentication bypassed)');
    validation.recommendations.push('Remember to set VITE_USE_PRE_PRODUCTION=false for production builds');
  }

  if (validation.isValid && validation.warnings.length === 0) {
    validation.recommendations.push('Configuration looks good! 🎉');
  }

  return validation;
}

/**
 * Prints a formatted configuration report to the console
 */
export function printConfigurationReport() {
  const validation = validateConfiguration();
  
  console.group('🔧 Configuration Validation Report');
  
  console.log(`Status: ${validation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  
  if (validation.errors.length > 0) {
    console.group('❌ Errors:');
    validation.errors.forEach(error => console.error(`  • ${error}`));
    console.groupEnd();
  }
  
  if (validation.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    validation.warnings.forEach(warning => console.warn(`  • ${warning}`));
    console.groupEnd();
  }
  
  if (validation.recommendations.length > 0) {
    console.group('💡 Recommendations:');
    validation.recommendations.forEach(rec => console.info(`  • ${rec}`));
    console.groupEnd();
  }
  
  console.group('📋 Current Configuration:');
  console.log('AWS Region:', validation.configuration.aws.region);
  console.log('Identity Pool ID:', validation.configuration.aws.identityPoolId);
  console.log('Current Mode:', validation.configuration.endpoints.currentMode);
  console.log('Error Endpoint:', validation.configuration.endpoints[validation.configuration.endpoints.currentMode].error);
  console.groupEnd();
  
  console.groupEnd();
  
  return validation;
}

/**
 * Quick health check for configuration
 * @returns {boolean} - True if configuration is ready for use
 */
export function isConfigurationReady() {
  const validation = validateConfiguration();
  return validation.isValid && validation.errors.length === 0;
}

/**
 * Get a summary of missing configuration
 * @returns {Array} - List of items that need to be configured
 */
export function getMissingConfiguration() {
  const validation = validateConfiguration();
  const missing = [];
  
  validation.errors.forEach(error => {
    if (error.includes('placeholder')) {
      missing.push('Update placeholder values in environment variables');
    }
    if (error.includes('Identity Pool ID')) {
      missing.push('Set valid Cognito Identity Pool ID');
    }
  });
  
  return [...new Set(missing)]; // Remove duplicates
}

// Auto-validate in development mode
if (import.meta.env.MODE === 'development' && import.meta.env.VITE_VALIDATE_CONFIG !== 'false') {
  // Run validation after a short delay to let the app initialize
  setTimeout(() => {
    printConfigurationReport();
  }, 1000);
}