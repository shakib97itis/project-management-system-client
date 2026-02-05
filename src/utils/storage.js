const USER_KEY = 'auth_user';

export const setAuthUser = (u) =>
  localStorage.setItem(USER_KEY, JSON.stringify(u));

export const getAuthUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const clearAuthUser = () => localStorage.removeItem(USER_KEY);
