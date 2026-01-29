import axios from "axios";

const patientBase =
  import.meta.env.VITE_PATIENT_BASE_URL || "http://localhost:8082";
const hospitalBase =
  import.meta.env.VITE_HOSPITAL_BASE_URL || "http://localhost:8081";

export const patientApi = axios.create({
  baseURL: "http://localhost:8082/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

export const hospitalApi = axios.create({
  baseURL: `${hospitalBase}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
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
