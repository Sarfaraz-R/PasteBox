import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:6600/api/";
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

let refreshPromise = null;

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
      refreshPromise = refreshPromise || axiosInstance.post("/auth/refresh").finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
