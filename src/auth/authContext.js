import {createContext, useContext} from 'react';

export const AuthCtx = createContext(null);

export function useAuth() {
  const value = useContext(AuthCtx);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
