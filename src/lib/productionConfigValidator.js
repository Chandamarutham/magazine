/**
 * Production Configuration Monitor
 * Validates configuration at runtime and provides user-friendly feedback
 */

import { useState, useEffect } from 'react';
import { validateConfiguration } from './configValidator.js';

let validationResult = null;
let validationPromise = null;

/**
 * Asynchronously validate configuration (safe for production)
 * @returns {Promise<Object>} - Validation results
 */
export async function validateConfigurationAsync() {
  if (validationPromise) {
    return validationPromise;
  }

  validationPromise = new Promise((resolve) => {
    try {
      const result = validateConfiguration();
      validationResult = result;
      resolve(result);
    } catch (error) {
      const errorResult = {
        isValid: false,
        errors: [`Configuration validation failed: ${error.message}`],
        warnings: [],
        recommendations: ['Check browser console for details'],
        configuration: {}
      };
      validationResult = errorResult;
      resolve(errorResult);
    }
  });

  return validationPromise;
}

/**
 * Get cached validation results (synchronous)
 * @returns {Object|null} - Cached validation results
 */
export function getCachedValidation() {
  return validationResult;
}

/**
 * Display configuration status in production
 * Shows user-friendly messages for configuration issues
 */
export function displayConfigurationStatus() {
  const isProduction = import.meta.env.PROD;
  
  if (!isProduction) {
    // In development, use full validation
    import('./configValidator.js').then(module => {
      module.printConfigurationReport();
    });
    return;
  }

  // In production, validate asynchronously
  validateConfigurationAsync().then(result => {
    if (!result.isValid) {
      console.group('⚠️ Configuration Issues Detected');
      console.warn('Some configuration issues were found:');
      result.errors.forEach(error => console.error('❌', error));
      result.warnings.forEach(warning => console.warn('⚠️', warning));
      console.log('💡 This may affect form submission functionality');
      console.groupEnd();
    } else {
      console.log('✅ Configuration validated successfully');
    }
  });
}

/**
 * React hook for configuration validation
 * @returns {Object} - Validation state and results
 */
export function useConfigurationValidation() {
  const [validation, setValidation] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    validateConfigurationAsync().then(result => {
      setValidation(result);
      setIsValidating(false);
    });
  }, []);

  return {
    validation,
    isValidating,
    isValid: validation?.isValid ?? null
  };
}

// Auto-run validation in production
if (import.meta.env.PROD && typeof window !== 'undefined') {
  // Run validation after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayConfigurationStatus);
  } else {
    setTimeout(displayConfigurationStatus, 1000);
  }
}