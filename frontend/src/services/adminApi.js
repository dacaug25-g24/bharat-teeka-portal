import axios from "axios";

/**
 * Token key used across the app
 */
const TOKEN_KEY = "token";

/**
 * ============================
 * ADMIN API
 * ============================
 */
const ADMIN_BASE_URL =
  import.meta.env.VITE_ADMIN_API || "http://localhost:5225";

export const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
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

/**
 * ============================
 * PATIENT API
 * ============================
 */
const PATIENT_BASE_URL =
  import.meta.env.VITE_PATIENT_API || "http://localhost:8082/api";

export const patientApi = axios.create({
  baseURL: PATIENT_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * ✅ Attach JWT token for patient-service requests
 */
patientApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

patientApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);
