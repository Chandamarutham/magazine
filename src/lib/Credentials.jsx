import { useState, useCallback } from 'react';

export function useCredentials() {
    const [credentials, setCredentials] = useState(null);
    const baseUrl = 'https://api.chandamarutham.org';
    const [error, setError] = useState(null);

    // Check if credentials are valid (exists and not expired)
    const isValidCredentials = useCallback(() => {
        if (!credentials) return false;
        return new Date(credentials.expiration).getTime() > Date.now();
    }, [credentials]);

    
    // Function to fetch credentials from backend
    const fetchCredentials = useCallback(async (relativeUrl = '/default') => {
        setError(null);
        try {
            const response = await fetch(`${baseUrl}${relativeUrl}`, { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch credentials');
            const data = await response.json();
            const body = JSON.parse(data.body);
            body.baseUrl = baseUrl; // Attach baseUrl to credentials
            setCredentials(body);
            return body;
        } catch (err) {
            setError(err);
            throw err;
        }
    }, [baseUrl]);

    // Ensure credentials are valid or fetch new ones
    const getValidCredentials = useCallback(async () => {
        if (isValidCredentials()) {
            return credentials;
        } else {
            return await fetchCredentials();
        }
    }, [credentials, isValidCredentials, fetchCredentials]);
    return {
        credentials,
        isValidCredentials,
        getValidCredentials,
        error,
    };
}
