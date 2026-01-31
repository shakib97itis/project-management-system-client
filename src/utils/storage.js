const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

export const setAccessToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_KEY);

export const setAuthUser = (u) =>
  localStorage.setItem(USER_KEY, JSON.stringify(u));
export const getAuthUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};
export const clearAuthUser = () => localStorage.removeItem(USER_KEY);
