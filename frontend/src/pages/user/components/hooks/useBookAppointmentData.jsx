import { useEffect, useMemo, useState } from "react";
import { bookAppointment } from "../../../../services/patientService";
import { getApiErrorMessage } from "../../../../services/apiClients";
import { todayISO } from "../utils/bookingMappers";

import {
  loadAvailabilityApi,
  loadBeneficiariesApi,
  loadCitiesApi,
  loadHospitalsApi,
  loadProfileApi,
  loadSlotsApi,
  loadStatesApi,
  loadVaccinesApi,
} from "./helpers/bookAppointmentLoaders";

import {
  resetAfterCity,
  resetAfterHospital,
  resetAfterState,
  resetAll as resetAllFn,
} from "./helpers/bookAppointmentReset";

export default function useBookAppointmentData() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  // Booking option
  const [bookingFor, setBookingFor] = useState("self");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  // Self patient id
  const [selfPatientId, setSelfPatientId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Location
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [hospitalId, setHospitalId] = useState("");

  // Vaccine
  const [vaccines, setVaccines] = useState([]);
  const [vaccineId, setVaccineId] = useState("");
  const [loadingVaccines, setLoadingVaccines] = useState(false);

  // Slot
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState("");

  // Booking fields
  const [doseNumber, setDoseNumber] = useState("1");
  const [remarks, setRemarks] = useState("");

  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState([]);

  // UI flags
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  // Messages
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [slotsInfo, setSlotsInfo] = useState("");

  // Availability (next 7 days)
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [earliestInfo, setEarliestInfo] = useState("");

  // Today date for date input min value
  const todayStr = useMemo(() => todayISO(), []);

  // Collect all setters in one object for reset helper functions
  const setters = {
    setStates,
    setCities,
    setHospitals,
    setStateId,
    setCityId,
    setHospitalId,

    setVaccines,
    setVaccineId,

    setDate,
    setSlots,
    setSlotId,

    setSlotsInfo,
    setAvailability,
    setEarliestInfo,

    setDoseNumber,
    setRemarks,

    setError,
    setSuccessMsg,
  };

  // Reset functions (using helper file)
  const resetHospital = () => resetAfterHospital(setters);
  const resetCity = () => resetAfterCity(setters);
  const resetState = () => resetAfterState(setters);
  const resetAll = () => resetAllFn(setters);

  // Load states once
  useEffect(() => {
    const run = async () => {
      try {
        setError("");
        setLoadingStates(true);

        const list = await loadStatesApi();
        setStates(list);
      } catch (e) {
        setStates([]);
        setError(getApiErrorMessage(e) || "Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };

    run();
  }, []);

  // Load self patient id
  useEffect(() => {
    const run = async () => {
      if (!user?.userId) return;

      try {
        setLoadingProfile(true);
        const patientId = await loadProfileApi(user.userId);
        setSelfPatientId(patientId);
      } catch {
        setSelfPatientId(null);
      } finally {
        setLoadingProfile(false);
      }
    };

    run();
  }, [user?.userId]);

  // Load beneficiaries for parent
  useEffect(() => {
    const run = async () => {
      if (!isParent || !user?.userId) return;

      try {
        const list = await loadBeneficiariesApi(user.userId);
        setBeneficiaries(list);
      } catch {
        setBeneficiaries([]);
      }
    };

    run();
  }, [isParent, user?.userId]);

  // Load cities when state changes
  useEffect(() => {
    const run = async () => {
      resetState();
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!stateId) return;

      try {
        setLoadingCities(true);
        const list = await loadCitiesApi(stateId);
        setCities(list);
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  // Load hospitals when city changes
  useEffect(() => {
    const run = async () => {
      resetCity();
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!cityId) return;

      try {
        setLoadingHospitals(true);
        const list = await loadHospitalsApi(cityId);
        setHospitals(list);
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load hospitals");
      } finally {
        setLoadingHospitals(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // Load vaccines when hospital changes
  useEffect(() => {
    const run = async () => {
      setError("");
      setSuccessMsg("");
      resetHospital();

      if (!hospitalId) {
        setVaccineId("");
        return;
      }

      try {
        setLoadingVaccines(true);
        const list = await loadVaccinesApi(hospitalId);
        setVaccines(list);

        // If previously selected vaccine is not available, clear it
        if (vaccineId && !list.some((v) => String(v.vaccineId) === String(vaccineId))) {
          setVaccineId("");
        }
      } catch {
        setVaccines([]);
      } finally {
        setLoadingVaccines(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  // Load availability when hospital or vaccine changes
  useEffect(() => {
    const run = async () => {
      setAvailability([]);
      setEarliestInfo("");

      if (!hospitalId) return;

      try {
        setLoadingAvailability(true);
        const summary = await loadAvailabilityApi({
          hospitalId,
          vaccineId,
          days: 7,
        });
        setAvailability(summary);
      } catch {
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    run();
  }, [hospitalId, vaccineId]);

  // Load slots when hospital/date/vaccine changes
  useEffect(() => {
    const run = async () => {
      setSlots([]);
      setSlotId("");
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!hospitalId || !date) return;

      try {
        setLoadingSlots(true);

        const list = await loadSlotsApi({
          hospitalId,
          date,
          vaccineId,
        });

        setSlots(list);

        if (list.length === 0) {
          setSlotsInfo(
            "No slots found for the selected date and vaccine. Try another date."
          );
        }
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    run();
  }, [hospitalId, date, vaccineId]);

  // Find selected slot details
  const selectedSlot = useMemo(() => {
    return slots.find((s) => String(s.slotId) === String(slotId));
  }, [slots, slotId]);

  // Calculate how many seats are left in slot
  const availableCount = useMemo(() => {
    if (!selectedSlot) return null;

    const capacity = Number(selectedSlot.capacity || 0);
    const bookedCount = Number(selectedSlot.bookedCount || 0);

    return capacity - bookedCount;
  }, [selectedSlot]);

  // Decide which patientId should be used for booking
  const getPatientIdForBooking = () => {
    if (bookingFor === "beneficiary") {
      return selectedBeneficiary ? Number(selectedBeneficiary) : null;
    }
    return selfPatientId;
  };

  // Disable booking button based on required fields
  const disableBook =
    booking ||
    !slotId ||
    (bookingFor === "self" && !selfPatientId) ||
    (bookingFor === "beneficiary" && !selectedBeneficiary);

  
  // Find earliest slot using availability data.
  
  const handleFindEarliest = async () => {
    if (!hospitalId) {
      setError("Please select hospital first.");
      return;
    }

    try {
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");
      setEarliestInfo("");
      setLoadingAvailability(true);

      const summary = await loadAvailabilityApi({
        hospitalId,
        vaccineId,
        days: 7,
      });

      setAvailability(summary);

      const firstDateWithSlots = summary.find((x) => Number(x.count || 0) > 0);

      if (!firstDateWithSlots) {
        setSlotsInfo("No slots available in the next 7 days. Try another hospital.");
        return;
      }

      setDate(firstDateWithSlots.date);

      const list = await loadSlotsApi({
        hospitalId,
        date: firstDateWithSlots.date,
        vaccineId,
      });

      setSlots(list);

      if (list.length > 0) {
        setSlotId(String(list[0].slotId));
        setEarliestInfo(
          `Earliest available: ${firstDateWithSlots.date} (${list[0].startTime} - ${list[0].endTime})`
        );
      }
    } catch (e) {
      setError(getApiErrorMessage(e) || "Failed to find earliest slot");
    } finally {
      setLoadingAvailability(false);
    }
  };

  // Book appointment API call
  const handleBook = async () => {
    setError("");
    setSuccessMsg("");

    if (!slotId) {
      setError("Please select a slot");
      return;
    }

    if (bookingFor === "beneficiary" && !selectedBeneficiary) {
      setError("Please select Beneficiary");
      return;
    }

    if (bookingFor === "self" && !selfPatientId) {
      setError("Your Patient ID is not loaded yet. Please wait.");
      return;
    }

    const patientId = getPatientIdForBooking();

    const payload = {
      patientId: Number(patientId),
      parentUserId: bookingFor === "beneficiary" ? Number(user.userId) : null,
      slotId: Number(slotId),
      doseNumber: Number(doseNumber),
      vaccineId: vaccineId ? Number(vaccineId) : null,
      remarks: remarks?.trim() || null,
    };

    try {
      setBooking(true);

      const data = await bookAppointment(payload);

      if (data?.appointmentId) {
        setSuccessMsg(
          `Appointment booked successfully! Appointment ID: ${data.appointmentId}`
        );
      } else {
        setSuccessMsg("Appointment booked successfully!");
      }
    } catch (e) {
      setError(getApiErrorMessage(e) || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  return {
    user,
    isParent,

    bookingFor,
    setBookingFor,
    selectedBeneficiary,
    setSelectedBeneficiary,

    selfPatientId,
    loadingProfile,

    states,
    cities,
    hospitals,
    stateId,
    setStateId,
    cityId,
    setCityId,
    hospitalId,
    setHospitalId,

    vaccines,
    vaccineId,
    setVaccineId,
    loadingVaccines,

    todayStr,
    date,
    setDate,
    slots,
    slotId,
    setSlotId,
    selectedSlot,
    availableCount,

    doseNumber,
    setDoseNumber,
    remarks,
    setRemarks,

    beneficiaries,

    loadingStates,
    loadingCities,
    loadingHospitals,
    loadingSlots,
    booking,
    disableBook,

    error,
    successMsg,
    slotsInfo,
    earliestInfo,

    availability,
    loadingAvailability,

    resetAll,
    handleFindEarliest,
    handleBook,

    // optional setters
    setError,
    setSuccessMsg,
    setSlotsInfo,
    setEarliestInfo,
  };
}
