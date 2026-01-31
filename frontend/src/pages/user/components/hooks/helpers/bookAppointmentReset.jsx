export const resetAfterHospital = (setters) => {
  const {
    setVaccines,
    setVaccineId,
    setDate,
    setSlots,
    setSlotId,
    setSlotsInfo,
    setAvailability,
    setEarliestInfo,
  } = setters;

  setVaccines([]);
  setVaccineId("");
  setDate("");
  setSlots([]);
  setSlotId("");
  setSlotsInfo("");
  setAvailability([]);
  setEarliestInfo("");
};

export const resetAfterCity = (setters) => {
  const { setHospitals, setHospitalId } = setters;

  setHospitals([]);
  setHospitalId("");

  resetAfterHospital(setters);
};

export const resetAfterState = (setters) => {
  const { setCities, setCityId } = setters;

  setCities([]);
  setCityId("");

  resetAfterCity(setters);
};

export const resetAll = (setters) => {
  const {
    setStateId,
    setDoseNumber,
    setRemarks,
    setError,
    setSuccessMsg,
    setSlotsInfo,
    setAvailability,
    setEarliestInfo,
  } = setters;

  setStateId("");
  resetAfterState(setters);

  setDoseNumber("1");
  setRemarks("");

  setError("");
  setSuccessMsg("");
  setSlotsInfo("");
  setAvailability([]);
  setEarliestInfo("");
};
