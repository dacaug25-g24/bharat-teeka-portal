import axios from "axios";

const patientBase =
  import.meta.env.VITE_PATIENT_BASE_URL || "http://localhost:8082";
const hospitalBase =
  import.meta.env.VITE_HOSPITAL_BASE_URL || "http://localhost:8081";
const adminBase = import.meta.env.VITE_ADMIN_BASE_URL || "http://localhost:7233";
const authBase = import.meta.env.VITE_AUTH_API || "http://localhost:8080";

//  Patient backend routes: /api/...
export const patientApi = axios.create({
  baseURL: `${patientBase}/api`,
  headers: { "Content-Type": "application/json" },
});

//  Hospital backend routes: /hospital/...
export const hospitalApi = axios.create({
  baseURL: hospitalBase,
  headers: { "Content-Type": "application/json" },
});

// Admin backend routes: /api/admin/...
export const adminApi = axios.create({
  baseURL: adminBase,
  headers: { "Content-Type": "application/json" },
});

//  Auth backend routes: /api/auth/...
export const authApi = axios.create({
  baseURL: authBase,
  headers: { "Content-Type": "application/json" },
});


const attachToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

[patientApi, hospitalApi, adminApi, authApi].forEach((api) => {
  api.interceptors.request.use(attachToken);

  api.interceptors.response.use(
    (r) => r,
    (error) => {
      const status = error?.response?.status;

      //  Auto logout on 401 (token expired/invalid)
      if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    },
  );
});

export const getApiErrorMessage = (err) => {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    (typeof err?.response?.data === "string" ? err.response.data : null) ||
    err?.message ||
    "Something went wrong"
  );
};