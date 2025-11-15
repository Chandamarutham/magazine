import React from 'react';
import { useConfigurationValidation } from '../lib/productionConfigValidator';

/**
 * Configuration Status Component
 * Shows configuration validation status in the UI (development only)
 */
export default function ConfigurationStatus() {
    const { validation, isValidating, isValid } = useConfigurationValidation();

    // Only show in development mode
    if (import.meta.env.PROD) {
        return null;
    }

    if (isValidating) {
        return (
            <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm text-blue-800 shadow-lg z-50">
                <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent mr-2"></div>
                    Validating configuration...
                </div>
            </div>
        );
    }

    if (isValid === null || isValid) {
        return null; // Don't show anything if validation passed
    }

    return (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-300 rounded-lg p-4 text-sm shadow-lg z-50 max-w-sm">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Configuration Issues</h3>
                    <div className="mt-1">
                        {validation?.errors?.map((error, index) => (
                            <p key={index} className="text-xs text-red-700">• {error}</p>
                        ))}
                        {validation?.warnings?.map((warning, index) => (
                            <p key={index} className="text-xs text-orange-700">⚠ {warning}</p>
                        ))}
                    </div>
                    <div className="mt-2">
                        <div className="mt-2">
                            <button
                                onClick={() => window.open('/Amazon AWS/guides/ENVIRONMENT_CONFIGURATION_GUIDE.md', '_blank')}
                                className="text-xs text-red-600 underline hover:text-red-800"
                            >
                                View setup guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}