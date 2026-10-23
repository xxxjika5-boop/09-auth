
'use client';

import { useEffect } from 'react';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession();

        if (!session) {
          clearIsAuthenticated();
          return;
        }

        const user = await getMe();

        if (!user) {
          clearIsAuthenticated();
          return;
        }

        setUser(user);
      } catch (error) {
        console.error('Failed to verify session:', error);
        clearIsAuthenticated();
      }
    };

    verifySession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}