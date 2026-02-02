import axios from "axios";

const BASE_URL = import.meta.env.VITE_ADMIN_API || "http://localhost:5225";
const TOKEN_KEY = "token";

export const adminApi = axios.create({
  baseURL: BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: auto logout on 401
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);
