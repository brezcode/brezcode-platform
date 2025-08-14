import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange } from '@/lib/firebase';

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChange((user) => {
        setUser(user);
        setLoading(false);
        setError(null);
      });

      return unsubscribe;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return () => {};
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user && !!user.emailVerified,
  };
}