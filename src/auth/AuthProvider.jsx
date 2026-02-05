import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {logoutApi} from '../api/auth.api';
import {refreshAccessToken} from '../api/axios';
import {clearAccessToken} from '../utils/accessToken';
import {clearAuthUser, getAuthUser, setAuthUser} from '../utils/storage';

const AuthCtx = createContext(null);

export function AuthProvider({children}) {
  const [user, setUser] = useState(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setAuthUser(user);
    } else {
      clearAuthUser();
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Refresh on boot to hydrate access token; logout clears stale local state.
      try {
        await refreshAccessToken();
      } catch (error) {
        if (isMounted) {
          try {
            await logoutApi();
          } catch (logoutError) {
            // Ignore logout errors during init.
          }
          clearAccessToken();
          clearAuthUser();
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, [
    refreshAccessToken,
    logoutApi,
    clearAccessToken,
    clearAuthUser,
    setUser,
    setIsLoading,
  ]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch (error) {
      // Ignore logout errors and still clear local state.
    }
    clearAccessToken();
    clearAuthUser();
    setUser(null);
  }, [logoutApi, clearAccessToken, clearAuthUser, setUser]);

  const value = useMemo(
    () => ({user, setUser, logout, isAuthed: !!user, isLoading}),
    [user, setUser, logout, isLoading],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const value = useContext(AuthCtx);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
