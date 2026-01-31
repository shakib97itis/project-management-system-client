import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  clearAccessToken,
  clearAuthUser,
  getAuthUser,
  setAuthUser,
} from '../utils/storage';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getAuthUser());

  useEffect(() => {
    if (user) {
      setAuthUser(user);
    }
  }, [user]);

  const logout = () => {
    clearAccessToken();
    clearAuthUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, logout, isAuthed: !!user }),
    [user],
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const value = useContext(AuthCtx);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
