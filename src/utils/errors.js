export const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;
