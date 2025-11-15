import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePage() {
    const navigate = useNavigate();

    const isAdmin = typeof window !== 'undefined' && sessionStorage.getItem('isAdmin') === 'true';

    function handleSignOut() {
        sessionStorage.removeItem('isAdmin');
        navigate('/');
    }

    if (!isAdmin) {
        return (
            <div style={{ padding: 20 }}>
                <h1>Not authorized</h1>
                <p>Please <a href="/admin">sign in</a> to access this page.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin — Manage (dummy)</h1>
            <p>Welcome, admin.</p>

            <p>This page is a placeholder for your management UI.</p>

            <button onClick={handleSignOut}>Sign out</button>
        </div>
    );
}
