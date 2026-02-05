import axios from 'axios';
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../utils/accessToken';
import {clearAuthUser} from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL,
  withCredentials: true,
});

// Single-flight refresh so concurrent 401s share one refresh request.
let refreshPromise = null;

export const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then(({data}) => {
        const accessToken = data?.accessToken;
        if (!accessToken) {
          throw new Error('No access token returned');
        }
        setAccessToken(accessToken);
        return {accessToken, user: data?.user};
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const logoutAndRedirect = async () => {
  clearAccessToken();
  clearAuthUser();
  try {
    await refreshClient.post('/auth/logout');
  } catch {
    // Ignore logout errors and still redirect.
  }
  if (window.location.pathname !== '/login') {
    window.location.assign('/login');
  }
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    if (status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Avoid infinite refresh loops or calls that opt out of refresh.
    if (originalRequest.skipAuthRefresh || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      const {accessToken} = await refreshAccessToken();
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch {
      await logoutAndRedirect();
      return Promise.reject(error);
    }
  },
);
