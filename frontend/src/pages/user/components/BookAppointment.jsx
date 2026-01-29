import { useEffect, useMemo, useState } from "react";
import {
  getStates,
  getCitiesByState,
  getHospitalsByCity,
  getAvailableSlots,
  getVaccinesByHospital,
  getParentChildren,
  getProfile,
  bookAppointment,
} from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function BookAppointment() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const [bookingFor, setBookingFor] = useState("self"); 
  const [selectedBeneficiary, setSelectedBeneficiary] = useState("");

  // self patient
  const [selfPatientId, setSelfPatientId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // location filters
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [hospitalId, setHospitalId] = useState("");

  // vaccines
  const [vaccines, setVaccines] = useState([]);
  const [vaccineId, setVaccineId] = useState("");
  const [loadingVaccines, setLoadingVaccines] = useState(false);

  // slot filters
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState("");

  // booking fields
  const [doseNumber, setDoseNumber] = useState("1");
  const [remarks, setRemarks] = useState("");

  // parent children
  const [beneficiaries, setBeneficiaries] = useState([]);

  // ui states
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  
  // for snake_case / camelCase
  
  const getStateKey = (s) => s.stateId ?? s.state_id;
  const getStateLabel = (s) => s.stateName ?? s.state_name;

  const getCityKey = (c) => c.cityId ?? c.city_id;
  const getCityLabel = (c) => c.cityName ?? c.city_name;

  const getHospitalKey = (h) => h.hospitalId ?? h.hospital_id;
  const getHospitalLabel = (h) => h.hospitalName ?? h.hospital_name;
  const getHospitalType = (h) => h.hospitalType ?? h.hospital_type;

  
  // Load States on mount

  useEffect(() => {
    const loadStates = async () => {
      try {
        setError("");
        setLoadingStates(true);
        const data = await getStates();
        setStates(Array.isArray(data) ? data : []);
      } catch (e) {
        setStates([]);
        setError(getApiErrorMessage(e) || "Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // Load Self PatientId (for ALL roles)
 
  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!user?.userId) return;
        setLoadingProfile(true);
        const data = await getProfile(user.userId);
        setSelfPatientId(data?.patientId ?? null);
      } catch {
        setSelfPatientId(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    loadProfile();
  }, [user?.userId]);

  // Load Beneficiaries (only if Parent)

  useEffect(() => {
    const loadChildren = async () => {
      try {
        if (!isParent || !user?.userId) return;
        const data = await getParentChildren(user.userId);
        setBeneficiaries(Array.isArray(data) ? data : []);
      } catch {
        setBeneficiaries([]);
      }
    };
    loadChildren();
  }, [isParent, user?.userId]);

  // When state changes -> load cities

  useEffect(() => {
    const loadCities = async () => {
      setCities([]);
      setCityId("");
      setHospitals([]);
      setHospitalId("");

      setVaccines([]);
      setVaccineId("");

      setSlots([]);
      setSlotId("");

      if (!stateId) return;

      try {
        setError("");
        setLoadingCities(true);
        const data = await getCitiesByState(stateId);
        setCities(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
  }, [stateId]);

  // When city changes -> load hospitals

  useEffect(() => {
    const loadHospitals = async () => {
      setHospitals([]);
      setHospitalId("");

      setVaccines([]);
      setVaccineId("");

      setSlots([]);
      setSlotId("");

      if (!cityId) return;

      try {
        setError("");
        setLoadingHospitals(true);
        const data = await getHospitalsByCity({ cityId });
        setHospitals(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load hospitals");
      } finally {
        setLoadingHospitals(false);
      }
    };

    loadHospitals();
  }, [cityId]);

  // Load Vaccines when hospital changes (date optional)

  useEffect(() => {
    const loadVaccines = async () => {
      setVaccines([]);
      setVaccineId("");
      setSlots([]);
      setSlotId("");

      if (!hospitalId) return;

      try {
        setLoadingVaccines(true);
        const data = await getVaccinesByHospital({
          hospitalId: Number(hospitalId),
          date: date || null,
        });
        setVaccines(Array.isArray(data) ? data : []);
      } catch {
        setVaccines([]);
      } finally {
        setLoadingVaccines(false);
      }
    };

    loadVaccines();
  }, [hospitalId, date]);

 
  // Auto-load slots when hospital/date/vaccine changes
 
  useEffect(() => {
    const loadSlots = async () => {
      setSlots([]);
      setSlotId("");

      // Don’t show error while user is selecting filters
      if (!hospitalId || !date) return;

      try {
        setLoadingSlots(true);
        setError("");
        setSuccessMsg("");

        const data = await getAvailableSlots({
          hospitalId: Number(hospitalId),
          date,
          vaccineId: vaccineId ? Number(vaccineId) : null,
        });

        setSlots(Array.isArray(data) ? data : []);
        if (!data || data.length === 0) {
          setError("No available slots found for selected filters");
        }
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [hospitalId, date, vaccineId]);

  const selectedSlot = useMemo(
    () => slots.find((s) => String(s.slotId) === String(slotId)),
    [slots, slotId]
  );

  const availableCount = useMemo(() => {
    if (!selectedSlot) return null;
    const cap = Number(selectedSlot.capacity || 0);
    const booked = Number(selectedSlot.bookedCount || 0);
    return cap - booked;
  }, [selectedSlot]);

  // Booking

  const getPatientIdForBooking = () => {
    if (bookingFor === "beneficiary") {
      return selectedBeneficiary ? Number(selectedBeneficiary) : null;
    }
    return selfPatientId;
  };

  const beneficiaryLabel = (b) => {
    const fullName = [b.firstName, b.lastName].filter(Boolean).join(" ");
    return fullName ? `${fullName} (Child)` : `Child PatientId: ${b.patientId}`;
  };

  const disableBook =
    booking ||
    !slotId ||
    (bookingFor === "self" && !selfPatientId) ||
    (bookingFor === "beneficiary" && !selectedBeneficiary);

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

  // UI

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-1">Book Appointment</h5>
              <div className="text-muted small">
                Select location → vaccine → slot → book.
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2">{String(error)}</div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2">{successMsg}</div>
          )}

          <div className="row g-3">
            {/* Booking For */}
            <div className="col-12 col-lg-6">
              <label className="form-label fw-semibold">Booking For</label>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className={`btn ${
                    bookingFor === "self"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setBookingFor("self");
                    setSelectedBeneficiary("");
                    setSuccessMsg("");
                    setError("");
                  }}
                >
                  Self
                </button>

                <button
                  type="button"
                  className={`btn ${
                    bookingFor === "beneficiary"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setBookingFor("beneficiary");
                    setSuccessMsg("");
                    setError("");
                  }}
                  disabled={!isParent}
                  title={!isParent ? "Only Parent can book for beneficiaries" : ""}
                >
                  Beneficiary
                </button>
              </div>

              {!isParent && (
                <div className="text-muted small mt-2">
                  Beneficiary booking is only available for Parent role.
                </div>
              )}

              {bookingFor === "self" && (
                <div className="text-muted small mt-2">
                  Your Patient ID:{" "}
                  <span className="fw-semibold">
                    {loadingProfile ? "Loading..." : selfPatientId ?? "-"}
                  </span>
                </div>
              )}
            </div>

            {/* Beneficiary select */}
            {isParent && bookingFor === "beneficiary" && (
              <div className="col-12 col-lg-6">
                <label className="form-label fw-semibold">
                  Select Beneficiary
                </label>
                <select
                  className="form-select"
                  value={selectedBeneficiary}
                  onChange={(e) => setSelectedBeneficiary(e.target.value)}
                >
                  <option value="">Select</option>
                  {beneficiaries.map((b) => (
                    <option key={b.patientId} value={b.patientId}>
                      {beneficiaryLabel(b)}
                    </option>
                  ))}
                </select>
                <div className="form-text">
                  Beneficiary booking sends parentUserId to backend.
                </div>
              </div>
            )}

            {/* State */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">State</label>
              <select
                className="form-select"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                disabled={loadingStates}
              >
                <option value="">
                  {loadingStates ? "Loading..." : "Select State"}
                </option>
                {states.map((s) => (
                  <option key={getStateKey(s)} value={getStateKey(s)}>
                    {getStateLabel(s)}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">City</label>
              <select
                className="form-select"
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                disabled={!stateId || loadingCities}
              >
                <option value="">
                  {!stateId
                    ? "Select state first"
                    : loadingCities
                    ? "Loading..."
                    : "Select City"}
                </option>
                {cities.map((c) => (
                  <option key={getCityKey(c)} value={getCityKey(c)}>
                    {getCityLabel(c)}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Hospital</label>
              <select
                className="form-select"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                disabled={!cityId || loadingHospitals}
              >
                <option value="">
                  {!cityId
                    ? "Select city first"
                    : loadingHospitals
                    ? "Loading..."
                    : "Select Hospital"}
                </option>
                {hospitals.map((h) => (
                  <option key={getHospitalKey(h)} value={getHospitalKey(h)}>
                    {getHospitalLabel(h)}{" "}
                    {getHospitalType(h) ? `(${getHospitalType(h)})` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Vaccine */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Vaccine</label>
              <select
                className="form-select"
                value={vaccineId}
                onChange={(e) => setVaccineId(e.target.value)}
                disabled={!hospitalId || loadingVaccines}
              >
                <option value="">
                  {!hospitalId
                    ? "Select hospital first"
                    : loadingVaccines
                    ? "Loading..."
                    : "All Vaccines"}
                </option>

                {vaccines.map((v) => (
                  <option key={v.vaccineId} value={v.vaccineId}>
                    {v.vaccineName} {v.manufacturer ? `- ${v.manufacturer}` : ""}
                  </option>
                ))}
              </select>
              <div className="form-text">
                Select vaccine to filter slots (optional).
              </div>
            </div>

            {/* Date */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Slots */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">
                Available Slots {loadingSlots ? "(Loading...)" : ""}
              </label>
              <select
                className="form-select"
                value={slotId}
                onChange={(e) => setSlotId(e.target.value)}
                disabled={!hospitalId || !date || slots.length === 0}
              >
                <option value="">
                  {!hospitalId
                    ? "Select hospital first"
                    : !date
                    ? "Select date first"
                    : slots.length === 0
                    ? "No slots available"
                    : "Select Slot"}
                </option>
                {slots.map((s) => {
                  const available =
                    Number(s.capacity || 0) - Number(s.bookedCount || 0);
                  return (
                    <option key={s.slotId} value={s.slotId}>
                      {s.startTime} - {s.endTime} |{" "}
                      {s.vaccine?.vaccineName || "Vaccine"} | Available:{" "}
                      {available}
                    </option>
                  );
                })}
              </select>

              {selectedSlot && (
                <div className="text-muted small mt-2">
                  Hospital:{" "}
                  <span className="fw-semibold">
                    {selectedSlot.hospital?.hospitalName}
                  </span>{" "}
                  | Vaccine:{" "}
                  <span className="fw-semibold">
                    {selectedSlot.vaccine?.vaccineName}
                  </span>{" "}
                  | Available:{" "}
                  <span className="fw-semibold">{availableCount}</span>
                </div>
              )}
            </div>

            {/* Dose */}
            <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Dose Number</label>
              <select
                className="form-select"
                value={doseNumber}
                onChange={(e) => setDoseNumber(e.target.value)}
              >
                <option value="1">Dose 1</option>
                <option value="2">Dose 2</option>
                <option value="3">Dose 3</option>
              </select>
            </div>

            {/* Remarks (optional) */}
            {/* <div className="col-12 col-md-6">
              <label className="form-label fw-semibold">Remarks (optional)</label>
              <input
                className="form-control"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Prefer morning slot"
              />
            </div> */}

            {/* Book */}
            <div className="col-12">
              <button
                className="btn btn-success"
                type="button"
                onClick={handleBook}
                disabled={disableBook}
              >
                {booking ? "Booking..." : "Book Appointment"}
              </button>

              {bookingFor === "beneficiary" &&
                isParent &&
                !selectedBeneficiary && (
                  <div className="text-muted small mt-2">
                    Select beneficiary to enable booking.
                  </div>
                )}

              {bookingFor === "self" && !selfPatientId && (
                <div className="text-muted small mt-2">
                  Waiting for your Patient ID…
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card border-0 shadow-sm mt-3">
        <div className="card-body">
          <h6 className="fw-semibold mb-2">Current Selection</h6>
          <div className="row g-2 small">
            <div className="col-md-3">
              <div className="text-muted">Booking For</div>
              <div className="fw-semibold">{bookingFor}</div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Patient ID</div>
              <div className="fw-semibold">
                {bookingFor === "beneficiary"
                  ? selectedBeneficiary || "-"
                  : selfPatientId ?? "-"}
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Hospital</div>
              <div className="fw-semibold">{hospitalId || "-"}</div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Slot</div>
              <div className="fw-semibold">{slotId || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
