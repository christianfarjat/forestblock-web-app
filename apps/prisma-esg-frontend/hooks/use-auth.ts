'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';

export function useAuth() {
  const {
    user,
    idToken,
    organizations,
    currentOrganization,
    currentRole,
    isLoading,
    error,
    setUser,
    setIdToken,
    setOrganizations,
    setLoading,
    setError,
    logout,
    selectOrganization,
  } = useAuthStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setLoading(true);

    let unsubscribe: (() => void) | null = null;

    const initAuth = async () => {
      try {
        const { auth: firebaseAuth } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');

        unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
          try {
            if (firebaseUser) {
              const token = await firebaseUser.getIdToken();
              setIdToken(token);
              localStorage.setItem('firebase-token', token);
              apiClient.setContext(token, currentOrganization?.id || '');

              try {
                const userData = await apiClient.getMe();
                setUser(userData);

                const orgs = await apiClient.getMyOrganizations();
                setOrganizations(orgs);

                if (orgs.length > 0 && !currentOrganization) {
                  selectOrganization(orgs[0].organization!, orgs[0].role);
                }
              } catch (err: unknown) {
                setError('Failed to load user data');
                console.error(err);
              }
            } else {
              setUser(null);
              setIdToken(null);
              localStorage.removeItem('firebase-token');
              apiClient.clearContext();
              logout();
            }
          } finally {
            setLoading(false);
          }
        });
      } catch (err: unknown) {
        setError('Failed to initialize auth');
        console.error(err);
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [setUser, setIdToken, setLoading, setError, setOrganizations, selectOrganization, currentOrganization]);

  const handleLogout = async () => {
    try {
      const { auth } = await import('@/lib/firebase');
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
      logout();
      apiClient.clearContext();
    } catch (err: unknown) {
      setError('Failed to sign out');
      console.error(err);
    }
  };

  return {
    user,
    idToken,
    organizations,
    currentOrganization,
    currentRole,
    isLoading,
    error,
    logout: handleLogout,
    selectOrganization,
    isAuthenticated: !!user && !!idToken,
  };
}
