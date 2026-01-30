// Format date shown in availability buttons
// Example: 2026-01-30 -> 30 Jan
export const formatChipDate = (isoDate) => {
  try {
    const dateObj = new Date(isoDate);
    return dateObj.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return isoDate;
  }
};

// State helpers
export const getStateKey = (state) => {
  return state.stateId ?? state.state_id;
};

export const getStateLabel = (state) => {
  return state.stateName ?? state.state_name;
};

// City helpers
export const getCityKey = (city) => {
  return city.cityId ?? city.city_id;
};

export const getCityLabel = (city) => {
  return city.cityName ?? city.city_name;
};

// Hospital helpers
export const getHospitalKey = (hospital) => {
  return hospital.hospitalId ?? hospital.hospital_id;
};

export const getHospitalLabel = (hospital) => {
  return hospital.hospitalName ?? hospital.hospital_name;
};

export const getHospitalType = (hospital) => {
  return hospital.hospitalType ?? hospital.hospital_type;
};

// Create display label for beneficiary dropdown
export const beneficiaryLabel = (beneficiary) => {
  const fullName = [beneficiary.firstName, beneficiary.lastName]
    .filter(Boolean)
    .join(" ");

  if (fullName) {
    return fullName;
  }

  return `PatientId: ${beneficiary.patientId}`;
};

// Returns today's date in YYYY-MM-DD format
export const todayISO = () => {
  return new Date().toISOString().split("T")[0];
};
