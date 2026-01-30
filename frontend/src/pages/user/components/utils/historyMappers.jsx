/*
  This file converts backend response into simple table rows.
  Backend can return camelCase or snake_case, so we support both.
*/

export const normalizeHistoryRows = (rows) => {
  const list = Array.isArray(rows) ? rows : [];

  return list.map((r, index) => {
    const id =
      r?.appointmentId ?? r?.appointment_id ?? r?.id ?? `row-${index}`;

    const hospital =
      r?.hospitalName ??
      r?.hospital_name ??
      r?.hospital?.hospitalName ??
      r?.hospital?.hospital_name ??
      "-";

    const vaccine =
      r?.vaccineName ??
      r?.vaccine_name ??
      r?.vaccine?.vaccineName ??
      r?.vaccine?.vaccine_name ??
      "-";

    const date = r?.bookingDate ?? r?.booking_date ?? r?.date ?? "-";

    const start =
      r?.startTime ??
      r?.start_time ??
      r?.slot?.startTime ??
      r?.slot?.start_time ??
      "";

    const end =
      r?.endTime ??
      r?.end_time ??
      r?.slot?.endTime ??
      r?.slot?.end_time ??
      "";

    const time = start && end ? `${start} - ${end}` : "-";

    // Keep the original values, but show status in readable form
    const status = String(r?.status ?? "BOOKED").toUpperCase();

    return {
      key: id,
      id,
      hospital,
      vaccine,
      date,
      time,
      status,
    };
  });
};

// Badge color based on status
export const getStatusBadgeClass = (status) => {
  const s = String(status || "").toUpperCase();

  if (s === "COMPLETED") return "text-bg-success";
  if (s === "CANCELLED") return "text-bg-secondary";

  return "text-bg-warning";
};
