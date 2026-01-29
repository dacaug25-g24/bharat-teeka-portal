import { patientApi } from "./apiClients";

export const getTestPatients = async () => {
  const res = await patientApi.get("/test/patients");
  return res.data;
};

export const getPatientIdByUserId = async (userId) => {
  const res = await patientApi.get("/patients/by-user", { params: { userId } });
  return res.data?.patientId || null;
};


export const getTestParentChild = async () => {
  const res = await patientApi.get("/test/parent-child");
  return res.data;
};

export const getProfile = async (userId) => {
  const res = await patientApi.get("/profile", { params: { userId } });
  return res.data;
};

export const updateProfile = async ({ userId, phone, address, remarks }) => {
  const res = await patientApi.put("/profile", {
    userId,
    phone,
    address,
    remarks,
  });
  return res.data;
};

export const getParentChildren = async (parentUserId) => {
  const res = await patientApi.get("/parent/children", {
    params: { parentUserId },
  });
  return res.data;
};

export const addChild = async ({ parentUserId, payload }) => {
  const res = await patientApi.post("/parent/children", payload, {
    params: { parentUserId },
  });
  return res.data;
};


export const getStates = async () => {
  const res = await patientApi.get("/locations/states");
  return res.data;
};

export const getCitiesByState = async (stateId) => {
  const res = await patientApi.get("/locations/cities", { params: { stateId } });
  return res.data;
};

export const getHospitalsByCity = async ({ cityId, hospitalType }) => {
  const res = await patientApi.get("/locations/hospitals", {
    params: { cityId, hospitalType },
  });
  return res.data;
};

export const getAvailableSlots = async ({ hospitalId, date, vaccineId }) => {
  const res = await patientApi.get("/slots/available", {
    params: { hospitalId, date, vaccineId },
  });
  return res.data;
};


export const getSlotById = async (slotId) => {
  const res = await patientApi.get(`/slots/${slotId}`);
  return res.data;
};

export const getVaccinesByHospital = async ({ hospitalId, date }) => {
  const res = await patientApi.get("/vaccines/by-hospital", {
    params: { hospitalId, date },
  });
  return res.data;
};


export const getAppointmentDetails = async ({ patientId, parentUserId }) => {
  const res = await patientApi.get("/appointments/details", {
    params: { patientId, parentUserId },
  });
  return res.data;
};

export const getAppointmentHistory = async ({ patientId, parentUserId }) => {
  return getAppointmentDetails({ patientId, parentUserId });
};

export const bookAppointment = async (payload) => {
  const res = await patientApi.post("/appointments", payload);
  return res.data;
};

export const cancelAppointment = async (appointmentId, parentUserId = null) => {
  const params = {};
  if (parentUserId) params.parentUserId = parentUserId;

  const res = await patientApi.put(
    `/appointments/${appointmentId}/cancel`,
    null,
    { params }
  );

  return res.data;
};

export const deleteChild = async ({ parentUserId, patientId }) => {
  const res = await patientApi.delete(`/parent/children/${patientId}`, {
    params: { parentUserId },
  });
  return res.data;
};


