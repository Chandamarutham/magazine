import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Dummy protected route — checks sessionStorage flag set by the dummy login
export default function ProtectedRoute({ children }) {
    const isAuthenticated = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';
    const location = useLocation();

    if (!isAuthenticated) {
        // Preserve the attempted location so the login page can return the user
        return <Navigate to="/admin" replace state={{ from: location }} />;
    }

    return children;
}
