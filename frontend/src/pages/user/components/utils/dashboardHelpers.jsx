/*
  Helper functions for dashboard.
  We keep these here so the main page file stays clean.
*/

export const safeStr = (v) => {
  if (v === null || v === undefined || v === "") return "-";
  return v;
};

export const toDateObj = (v) => {
  if (!v) return null;
  const d = new Date(v);
  if (Number.isFinite(d.getTime())) return d;
  return null;
};

export const formatDateDDMMYYYY = (v) => {
  const d = toDateObj(v);
  if (!d) return safeStr(v);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}-${mm}-${yy}`;
};

export const normalizeStatus = (a) => {
  const raw = String(a?.status || a?.appointmentStatus || a?.state || "")
    .trim()
    .toLowerCase();

  if (!raw) return "Unknown";
  if (raw.includes("cancel")) return "Cancelled";
  if (raw.includes("complete") || raw.includes("done")) return "Completed";
  if (raw.includes("book")) return "Booked";

  return a?.status || a?.appointmentStatus || a?.state || "Unknown";
};

export const statusBadgeClass = (status) => {
  if (status === "Booked") return "text-bg-primary";
  if (status === "Completed") return "text-bg-success";
  if (status === "Cancelled") return "text-bg-danger";
  return "text-bg-secondary";
};

export const getAppointmentSortTime = (x) => {
  const d = x?.appointmentDate || x?.date || x?.createdAt || x?.slotDate || null;
  const time = toDateObj(d)?.getTime();
  return Number.isFinite(time) ? time : 0;
};

export const findLatestAppointment = (appointments) => {
  if (!Array.isArray(appointments) || appointments.length === 0) return null;

  const sorted = [...appointments].sort(
    (a, b) => getAppointmentSortTime(b) - getAppointmentSortTime(a)
  );

  return sorted[0];
};

export const buildStats = (appointments) => {
  const list = Array.isArray(appointments) ? appointments : [];

  const total = list.length;
  const completed = list.filter((a) => normalizeStatus(a) === "Completed").length;
  const cancelled = list.filter((a) => normalizeStatus(a) === "Cancelled").length;

  return { total, completed, cancelled };
};
