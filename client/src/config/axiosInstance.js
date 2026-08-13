import axios from "axios";

const DEFAULT_API_URL = "/api/";
const BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const ACCESS_TOKEN_KEY = "pastebox_access_token";
const REFRESH_TOKEN_KEY = "pastebox_refresh_token";

const storageAvailable = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getStoredToken = (key) => (storageAvailable() ? window.localStorage.getItem(key) : null);

export const storeAuthTokens = ({ accessToken, refreshToken }) => {
  if (!storageAvailable()) {
    return;
  }

  if (accessToken) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearAuthTokens = () => {
  if (!storageAvailable()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

let refreshPromise = null;

axiosInstance.interceptors.request.use((config) => {
  const accessToken = getStoredToken(ACCESS_TOKEN_KEY);

  if (accessToken) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/login")
      || originalRequest?.url?.includes("/auth/signup")
      || originalRequest?.url?.includes("/auth/refresh")
      || originalRequest?.url?.includes("/users/login")
      || originalRequest?.url?.includes("/users/register");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      refreshPromise = refreshPromise || axiosInstance
        .post("/auth/refresh", {
          refreshToken: getStoredToken(REFRESH_TOKEN_KEY),
        })
        .then((response) => {
          storeAuthTokens(response.data || {});
          return response;
        })
        .catch((refreshError) => {
          clearAuthTokens();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });

      await refreshPromise;
      return axiosInstance(originalRequest);
    }

    if (status === 401 && isAuthEndpoint) {
      clearAuthTokens();
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
