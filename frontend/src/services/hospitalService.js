
// import { hospitalApi } from "./apiClients";
// export const getSlotById = async (slotId) => {
//   const res = await hospitalApi.get(`/hospital/slots/${slotId}`);
//   return res.data;
// };

// export const getHospitalVaccines = async () => {
//   const res = await hospitalApi.get(`/hospital/vaccines`);
//   return res.data;
// };

// export const getTodayHospitalAppointments = async (hospitalId) => {
//   const res = await hospitalApi.get(
//     `/hospital/appointments/hospital/${hospitalId}/today`,
//   );
//   return res.data;
// };
import { hospitalApi } from "./apiClients";

export const getSlotById = async (slotId) => {
  const res = await hospitalApi.get(`/hospital/slots/${slotId}`);
  return res.data;
};

export const getHospitalVaccines = async () => {
  const res = await hospitalApi.get(`/hospital/vaccines`);
  return res.data;
};

export const getTodayHospitalAppointments = async (hospitalId) => {
  const res = await hospitalApi.get(
    `/hospital/appointments/hospital/${hospitalId}/today`
  );
  return res.data;
};

// ✅ NEW: slots today using correct endpoint
export const getTodaySlots = async (hospitalId, dateISO) => {
  const res = await hospitalApi.get(`/hospital/slots/hospital/${hospitalId}`, {
    params: { date: dateISO },
  });
  return res.data;
};

// ✅ NEW: all slots using correct endpoint
export const getAllSlots = async (hospitalId) => {
  const res = await hospitalApi.get(`/hospital/slots/hospital/${hospitalId}`);
  return res.data;
};
