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
  getSlotsAvailabilityRange,
} from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function BookAppointment() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const [bookingFor, setBookingFor] = useState("self"); // self | beneficiary
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
  const [slotsInfo, setSlotsInfo] = useState("");

  // availability summary state
  const [availability, setAvailability] = useState([]); // [{date, count}]
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [earliestInfo, setEarliestInfo] = useState(""); // info msg

  // helpers
  const todayStr = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const formatChipDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return iso;
    }
  };

  // for snake_case / camelCase
  const getStateKey = (s) => s.stateId ?? s.state_id;
  const getStateLabel = (s) => s.stateName ?? s.state_name;

  const getCityKey = (c) => c.cityId ?? c.city_id;
  const getCityLabel = (c) => c.cityName ?? c.city_name;

  const getHospitalKey = (h) => h.hospitalId ?? h.hospital_id;
  const getHospitalLabel = (h) => h.hospitalName ?? h.hospital_name;
  const getHospitalType = (h) => h.hospitalType ?? h.hospital_type;

  // -------- Reset helpers --------
  const resetAfterState = () => {
    setCities([]);
    setCityId("");
    resetAfterCity();
  };

  const resetAfterCity = () => {
    setHospitals([]);
    setHospitalId("");
    resetAfterHospital();
  };

  const resetAfterHospital = () => {
    setVaccines([]);
    setVaccineId("");
    setDate("");
    setSlots([]);
    setSlotId("");
    setSlotsInfo("");
    setAvailability([]);
    setEarliestInfo("");
  };

  const resetAll = () => {
    setStateId("");
    resetAfterState();
    setDoseNumber("1");
    setRemarks("");
    setError("");
    setSuccessMsg("");
    setSlotsInfo("");
    setAvailability([]);
    setEarliestInfo("");
  };

  // -------- Load States on mount --------
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

  // -------- Load Self PatientId --------
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

  // -------- Load Beneficiaries --------
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

  // -------- When state changes -> load cities --------
  useEffect(() => {
    const loadCities = async () => {
      resetAfterState();
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!stateId) return;

      try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  // -------- When city changes -> load hospitals --------
  useEffect(() => {
    const loadHospitals = async () => {
      resetAfterCity();
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!cityId) return;

      try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // Load Vaccines ONLY when hospital changes
  useEffect(() => {
    const loadVaccines = async () => {
      setVaccines([]);
      setSlots([]);
      setSlotId("");
      setSlotsInfo("");
      setError("");
      setSuccessMsg("");

      setDate("");
      setAvailability([]);
      setEarliestInfo("");

      if (!hospitalId) {
        setVaccineId("");
        return;
      }

      try {
        setLoadingVaccines(true);

        const data = await getVaccinesByHospital({
          hospitalId: Number(hospitalId),
          date: null,
        });

        const list = Array.isArray(data) ? data : [];
        setVaccines(list);

        if (
          vaccineId &&
          !list.some((v) => String(v.vaccineId) === String(vaccineId))
        ) {
          setVaccineId("");
        }
      } catch {
        setVaccines([]);
      } finally {
        setLoadingVaccines(false);
      }
    };

    loadVaccines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  //  NEW: Load next 7 days availability when hospital or vaccine changes
  useEffect(() => {
    const loadAvailability = async () => {
      setAvailability([]);
      setEarliestInfo("");

      if (!hospitalId) return;

      try {
        setLoadingAvailability(true);

        const summary = await getSlotsAvailabilityRange({
          hospitalId: Number(hospitalId),
          vaccineId: vaccineId ? Number(vaccineId) : null,
          days: 7,
        });

        setAvailability(Array.isArray(summary) ? summary : []);
      } catch (e) {
        // don't hard fail
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [hospitalId, vaccineId]);

  // -------- Load slots when hospital/date/vaccine changes --------
  useEffect(() => {
    const loadSlots = async () => {
      setSlots([]);
      setSlotId("");
      setError("");
      setSuccessMsg("");
      setSlotsInfo("");

      if (!hospitalId || !date) return;

      try {
        setLoadingSlots(true);

        const data = await getAvailableSlots({
          hospitalId: Number(hospitalId),
          date,
          vaccineId: vaccineId ? Number(vaccineId) : null,
        });

        const list = Array.isArray(data) ? data : [];
        setSlots(list);

        if (list.length === 0) {
          setSlotsInfo(
            "No slots found for the selected date/vaccine. Try another date or use the availability chips."
          );
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

  // booking patientId
  const getPatientIdForBooking = () => {
    if (bookingFor === "beneficiary") {
      return selectedBeneficiary ? Number(selectedBeneficiary) : null;
    }
    return selfPatientId;
  };

  const beneficiaryLabel = (b) => {
    const fullName = [b.firstName, b.lastName].filter(Boolean).join(" ");
    return fullName ? `${fullName} ` : `PatientId: ${b.patientId}`;
  };

  const disableBook =
    booking ||
    !slotId ||
    (bookingFor === "self" && !selfPatientId) ||
    (bookingFor === "beneficiary" && !selectedBeneficiary);

  //  NEW: Find earliest slot (within next 7 days)
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

      const summary = await getSlotsAvailabilityRange({
        hospitalId: Number(hospitalId),
        vaccineId: vaccineId ? Number(vaccineId) : null,
        days: 7,
      });

      setAvailability(Array.isArray(summary) ? summary : []);

      const first = (summary || []).find((x) => Number(x.count || 0) > 0);
      if (!first) {
        setSlotsInfo("No slots available in the next 7 days. Try another hospital.");
        return;
      }

      // set date -> slot loader effect will run
      setDate(first.date);

      // fetch slots for that date and auto-select first slot
      const data = await getAvailableSlots({
        hospitalId: Number(hospitalId),
        date: first.date,
        vaccineId: vaccineId ? Number(vaccineId) : null,
      });

      const list = Array.isArray(data) ? data : [];
      setSlots(list);

      if (list.length > 0) {
        setSlotId(String(list[0].slotId));
        const s0 = list[0];
        setEarliestInfo(
          `Earliest available: ${first.date} (${s0.startTime} - ${s0.endTime})`
        );
      }
    } catch (e) {
      setError(getApiErrorMessage(e) || "Failed to find earliest slot");
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleBook = async () => {
    setError("");
    setSuccessMsg("");

    if (!slotId) return setError("Please select a slot");
    if (bookingFor === "beneficiary" && !selectedBeneficiary)
      return setError("Please select Beneficiary");
    if (bookingFor === "self" && !selfPatientId)
      return setError("Your Patient ID is not loaded yet. Please wait.");

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

      setSuccessMsg(
        data?.appointmentId
          ? `Appointment booked successfully! Appointment ID: ${data.appointmentId}`
          : "Appointment booked successfully!"
      );
    } catch (e) {
      setError(getApiErrorMessage(e) || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  // labels for summary
  const selectedStateName = useMemo(() => {
    const s = states.find((x) => String(getStateKey(x)) === String(stateId));
    return s ? getStateLabel(s) : "-";
  }, [states, stateId]);

  const selectedCityName = useMemo(() => {
    const c = cities.find((x) => String(getCityKey(x)) === String(cityId));
    return c ? getCityLabel(c) : "-";
  }, [cities, cityId]);

  const selectedHospitalName = useMemo(() => {
    const h = hospitals.find(
      (x) => String(getHospitalKey(x)) === String(hospitalId)
    );
    return h ? getHospitalLabel(h) : "-";
  }, [hospitals, hospitalId]);

  const selectedVaccineName = useMemo(() => {
    const v = vaccines.find((x) => String(x.vaccineId) === String(vaccineId));
    return v ? v.vaccineName : "All";
  }, [vaccines, vaccineId]);

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-1">Book Appointment</h5>
              <div className="text-muted small">
                Step 1: Choose person • Step 2: Select location • Step 3: Select
                vaccine • Step 4: Pick date/slot • Book
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={resetAll}
              >
                Reset All
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 mb-3">{String(error)}</div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2 mb-3">{successMsg}</div>
          )}
          {slotsInfo && (
            <div className="alert alert-info py-2 mb-3">{slotsInfo}</div>
          )}
          {earliestInfo && (
            <div className="alert alert-success py-2 mb-3">{earliestInfo}</div>
          )}

          <div className="row g-3">
            {/* Booking For */}
            <div className="col-12 col-lg-6">
              <label className="form-label fw-semibold">Booking For</label>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className={`btn ${
                    bookingFor === "self" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={() => {
                    setBookingFor("self");
                    setSelectedBeneficiary("");
                    resetAll();
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
                    resetAll();
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
                  onChange={(e) => {
                    setSelectedBeneficiary(e.target.value);
                    setError("");
                    setSuccessMsg("");
                  }}
                >
                  <option value="">Select</option>
                  {beneficiaries.map((b) => (
                    <option key={b.patientId} value={b.patientId}>
                      {beneficiaryLabel(b)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <hr className="my-2" />

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
                onChange={(e) => {
                  setVaccineId(e.target.value);
                  setSlots([]);
                  setSlotId("");
                  setSlotsInfo("");
                  setDate("");
                  setEarliestInfo("");
                }}
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
            </div>

            {/*  Availability Chips */}
            <div className="col-12 col-md-8">
              <label className="form-label fw-semibold d-flex justify-content-between align-items-center">
                <span>Next 7 Days Availability</span>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleFindEarliest}
                  disabled={!hospitalId || loadingAvailability}
                >
                  {loadingAvailability ? "Finding..." : "Find Earliest Slot"}
                </button>
              </label>

              {!hospitalId ? (
                <div className="text-muted small">
                  Select hospital to see availability.
                </div>
              ) : loadingAvailability ? (
                <div className="text-muted small">Loading availability...</div>
              ) : availability.length === 0 ? (
                <div className="text-muted small">
                  No availability data. Select date manually.
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {availability.map((a) => {
                    const disabled = Number(a.count || 0) === 0;
                    const active = date === a.date;
                    return (
                      <button
                        key={a.date}
                        type="button"
                        className={`btn btn-sm ${
                          active
                            ? "btn-primary"
                            : disabled
                            ? "btn-outline-secondary"
                            : "btn-outline-primary"
                        }`}
                        disabled={disabled}
                        title={disabled ? "No slots" : "Click to select date"}
                        onClick={() => {
                          setDate(a.date);
                          setSlots([]);
                          setSlotId("");
                          setSlotsInfo("");
                          setError("");
                          setSuccessMsg("");
                          setEarliestInfo("");
                        }}
                      >
                        {formatChipDate(a.date)}{" "}
                        <span className="badge text-bg-light ms-1">
                          {a.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="form-text">
                Tip: Click a date with slots to avoid trial & error.
              </div>
            </div>

            {/* Date */}
            <div className="col-12 col-md-4">
              <label className="form-label fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                min={todayStr}
                onChange={(e) => {
                  const val = e.target.value;

                  // small guard for manual typing
                  if (val && val < todayStr) {
                    setError("You cannot select a past date.");
                    return;
                  }

                  setDate(val);
                  setSlots([]);
                  setSlotId("");
                  setSlotsInfo("");
                  setError("");
                  setSuccessMsg("");
                  setEarliestInfo("");
                }}
                disabled={!hospitalId}
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

            <hr className="my-2" />

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

              {bookingFor === "beneficiary" && isParent && !selectedBeneficiary && (
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
              <div className="text-muted">Location</div>
              <div className="fw-semibold">
                {selectedStateName} / {selectedCityName}
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Hospital</div>
              <div className="fw-semibold">{selectedHospitalName}</div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Vaccine</div>
              <div className="fw-semibold">{selectedVaccineName}</div>
            </div>

            <div className="col-md-3">
              <div className="text-muted">Date</div>
              <div className="fw-semibold">{date || "-"}</div>
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
