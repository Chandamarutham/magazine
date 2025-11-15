// Auth stub for dummy login mode. Exports a useAuth hook with simple no-op behavior.
import { useState } from 'react';

export function useAuth() {
  // Always return not-authenticated in stub mode. Components should use sessionStorage instead.
  const [user] = useState(null);
  return {
    user,
    isAuthenticated: false,
    signIn: async () => {
      throw new Error('Auth not available in dummy mode');
    },
    signOut: async () => {},
  };
}

export const Auth = null;
