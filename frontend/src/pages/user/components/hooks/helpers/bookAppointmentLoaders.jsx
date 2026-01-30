import {
  getStates,
  getCitiesByState,
  getHospitalsByCity,
  getVaccinesByHospital,
  getAvailableSlots,
  getParentChildren,
  getProfile,
  getSlotsAvailabilityRange,
} from "../../../../../services/patientService";

export const loadStatesApi = async () => {
  const data = await getStates();
  return Array.isArray(data) ? data : [];
};

export const loadProfileApi = async (userId) => {
  const data = await getProfile(userId);
  return data?.patientId ?? null;
};

export const loadBeneficiariesApi = async (userId) => {
  const data = await getParentChildren(userId);
  return Array.isArray(data) ? data : [];
};

export const loadCitiesApi = async (stateId) => {
  const data = await getCitiesByState(stateId);
  return Array.isArray(data) ? data : [];
};

export const loadHospitalsApi = async (cityId) => {
  const data = await getHospitalsByCity({ cityId });
  return Array.isArray(data) ? data : [];
};

export const loadVaccinesApi = async (hospitalId) => {
  const data = await getVaccinesByHospital({
    hospitalId: Number(hospitalId),
    date: null,
  });
  return Array.isArray(data) ? data : [];
};

export const loadAvailabilityApi = async ({ hospitalId, vaccineId, days }) => {
  const summary = await getSlotsAvailabilityRange({
    hospitalId: Number(hospitalId),
    vaccineId: vaccineId ? Number(vaccineId) : null,
    days: days,
  });

  return Array.isArray(summary) ? summary : [];
};

export const loadSlotsApi = async ({ hospitalId, date, vaccineId }) => {
  const data = await getAvailableSlots({
    hospitalId: Number(hospitalId),
    date: date,
    vaccineId: vaccineId ? Number(vaccineId) : null,
  });

  return Array.isArray(data) ? data : [];
};
