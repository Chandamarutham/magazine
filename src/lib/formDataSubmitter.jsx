import React, { useState } from 'react';
import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { awsConfig, getConfig, getApiEndpoint } from './awsConfig';
import { isConfigurationReady, printConfigurationReport } from './configValidator';

// Initialize Amplify (this should typically be done once in your app)
let amplifyConfigured = false;
let currentConfig = { ...awsConfig };

const configureAmplify = () => {
  if (!amplifyConfigured) {
    Amplify.configure(currentConfig);
    amplifyConfigured = true;
  }
};

/**
 * Submits form data to AWS API Gateway endpoint with optional Cognito authentication
 * @param {Object} formData - The data to submit
 * @param {Object} options - Optional configuration
 * @param {string} options.method - HTTP method (default: 'POST')
 * @param {Object} options.headers - Additional headers
 * @param {string} options.endpointType - API endpoint type ('error', 'advertise', 'subscribe', 'query')
 * @param {boolean} options.bypassAuth - Skip Cognito authentication (useful for pre-production)
 * @returns {Promise<Object>} - Response from the API
 */
export async function submitFormData(formData, options = {}) {
  try {
    const {
      method = 'POST',
      headers: additionalHeaders = {},
      endpointType = 'error',
      bypassAuth = false,
    } = options;

    const config = getConfig();
    const shouldBypassAuth = bypassAuth || config.bypassAuth;
    const apiEndpoint = getApiEndpoint(endpointType);

    console.log(`📡 Submitting to: ${apiEndpoint}, Auth bypass: ${shouldBypassAuth}`);

    // Prepare base headers
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...additionalHeaders,
    };

    // Only add authentication if not bypassing
    if (!shouldBypassAuth) {
      // Configure Amplify if not already done
      configureAmplify();

      // Get authentication session for unauthenticated user
      const session = await fetchAuthSession();
      
      if (!session.credentials) {
        throw new Error('Failed to obtain AWS credentials for unauthenticated access');
      }

      // Add AWS authentication headers
      if (session.credentials.accessKeyId) {
        headers['Authorization'] = `AWS4-HMAC-SHA256 Credential=${session.credentials.accessKeyId}`;
      }

      if (session.identityId) {
        headers['X-Amz-Security-Token'] = session.credentials.sessionToken;
      }
    }

    // Make the API request
    const response = await fetch(apiEndpoint, {
      method,
      headers,
      body: JSON.stringify(formData),
    });

    // Handle response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorText}`);
    }

    // Try to parse JSON response, fallback to text if not JSON
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return {
      success: true,
      data: responseData,
      status: response.status,
    };

  } catch (error) {
    console.error('Form submission error:', error);
    
    return {
      success: false,
      error: error.message,
      details: error,
    };
  }
}

/**
 * React hook for form data submission with state management
 * @returns {Object} - Hook state and submit function
 */
export function useFormDataSubmitter() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const submitData = async (formData, options) => {
    setIsSubmitting(true);
    setLastResult(null);

    try {
      const result = await submitFormData(formData, options);
      setLastResult(result);
      return result;
    } catch (error) {
      const errorResult = {
        success: false,
        error: error.message,
        details: error,
      };
      setLastResult(errorResult);
      return errorResult;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitData,
    isSubmitting,
    lastResult,
    clearResult: () => setLastResult(null),
  };
}

/**
 * Higher-order component that provides form submission capabilities
 * @param {React.Component} WrappedComponent - Component to wrap
 * @returns {React.Component} - Enhanced component with form submission props
 */
export function withFormDataSubmitter(WrappedComponent) {
  const FormDataSubmitterWrapper = (props) => {
    const formSubmitter = useFormDataSubmitter();
    
    return (
      <WrappedComponent
        {...props}
        formSubmitter={formSubmitter}
      />
    );
  };
  
  FormDataSubmitterWrapper.displayName = `withFormDataSubmitter(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return FormDataSubmitterWrapper;
}

// Export default configuration function for easy setup
export function configureFormDataSubmitter(config) {
  Object.assign(currentConfig, config);
  amplifyConfigured = false; // Force reconfiguration
}

/**
 * Direct submission to pre-production endpoint (bypasses authentication)
 * Useful for troubleshooting backend issues
 * @param {Object} formData - The data to submit
 * @param {string} endpointType - API endpoint type ('error', 'advertise', 'subscribe', 'query')
 * @returns {Promise<Object>} - Response from the API
 */
export async function submitToPreProduction(formData, endpointType = 'error') {
  return submitFormData(formData, {
    endpointType,
    bypassAuth: true,
    // Force pre-production endpoint regardless of environment
    // This will directly use the pre-production URL
  });
}

/**
 * Environment checker utility
 * @returns {Object} - Current environment information
 */
export function getEnvironmentInfo() {
  const config = getConfig();
  const configReady = isConfigurationReady();
  
  const info = {
    mode: import.meta.env.MODE || 'production',
    isPreProduction: config.bypassAuth,
    endpoint: getApiEndpoint('error'),
    useAuthentication: !config.bypassAuth,
    configurationReady: configReady,
  };
  
  // Add configuration report in development mode
  if (import.meta.env.MODE === 'development' && !configReady) {
    console.warn('⚠️ Configuration issues detected. Run printConfigurationReport() for details.');
  }
  
  return info;
}

/**
 * Debug utility to print configuration report
 * Useful for troubleshooting setup issues
 */
export function debugConfiguration() {
  return printConfigurationReport();
}