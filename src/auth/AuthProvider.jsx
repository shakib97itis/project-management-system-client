import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {logoutApi, meApi} from '../api/auth.api';
import {refreshAccessToken} from '../api/axios';
import {clearAccessToken} from '../utils/accessToken';
import {clearAuthUser, getAuthUser, setAuthUser} from '../utils/storage';
import {AuthCtx} from './authContext';

export function AuthProvider({children}) {
  const [user, setUser] = useState(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(true);
  const lastRefreshAtRef = useRef(0);
  const refreshInFlightRef = useRef(null);

  useEffect(() => {
    if (user) {
      setAuthUser(user);
    } else {
      clearAuthUser();
    }
  }, [user]);

  const clearLocalAuthState = useCallback(() => {
    clearAccessToken();
    clearAuthUser();
    setUser(null);
  }, [setUser]);

  const refreshUser = useCallback(
    async ({force = false} = {}) => {
      const now = Date.now();
      if (!force && now - lastRefreshAtRef.current < 10_000) {
        return null;
      }

      if (refreshInFlightRef.current) {
        return refreshInFlightRef.current;
      }

      lastRefreshAtRef.current = now;

      refreshInFlightRef.current = (async () => {
        try {
          const data = await meApi();
          if (data?.user) {
            setUser(data.user);
          }
          return data?.user || null;
        } catch (error) {
          const status = error?.response?.status;
          if (status === 401 || status === 403) {
            try {
              await logoutApi();
            } catch {
              // Ignore logout errors and still clear local state.
            }
            clearLocalAuthState();
            return null;
          }

          // Non-auth errors shouldn't force a logout; keep existing cached user.
          return null;
        } finally {
          refreshInFlightRef.current = null;
        }
      })();

      return refreshInFlightRef.current;
    },
    [clearLocalAuthState, setUser],
  );

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      // Refresh on boot to hydrate access token; logout clears stale local state.
      try {
        const refreshResult = await refreshAccessToken();
        if (isMounted && refreshResult?.user) {
          setUser(refreshResult.user);
        }
        await refreshUser({force: true});
      } catch {
        if (isMounted) {
          try {
            await logoutApi();
          } catch {
            // Ignore logout errors during init.
          }
          clearLocalAuthState();
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
    clearLocalAuthState,
    refreshUser,
  ]);

  useEffect(() => {
    if (!user) return undefined;

    const handleFocus = () => {
      refreshUser();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, refreshUser]);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore logout errors and still clear local state.
    }
    clearLocalAuthState();
  }, [clearLocalAuthState]);

  const value = useMemo(
    () => ({user, setUser, refreshUser, logout, isAuthed: !!user, isLoading}),
    [user, setUser, refreshUser, logout, isLoading],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
