import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';

// Dummy login for local testing: sets sessionStorage flag and redirects to /manage
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        // very small validation
        if (!username || !password) {
            setError('Enter username and password');
            return;
        }

        // set a session flag to simulate authenticated admin
        try {
            sessionStorage.setItem('isAdmin', 'true');
            // If there is a stored `from` location (set by ProtectedRoute), navigate there.
            const dest = location?.state?.from?.pathname || '/manage';
            navigate(dest, { replace: true });
        } catch {
            setError('Unable to set session');
        }
    }

    const location = useLocation();

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.heading}>Admin login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <label className={styles.label}>
                    Username
                    <input
                        type="email"
                        className={styles.emailInput}
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </label>
                </div>
                <div>
                <label className={styles.label}>
                    Password
                    <input
                        type="password"
                        className={styles.passwordInput}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <button type="submit" className={styles.submitButton}>Sign in</button>
            </form>
        </div>
    );
}
