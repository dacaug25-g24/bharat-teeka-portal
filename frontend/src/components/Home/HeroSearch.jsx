import { useEffect, useMemo, useState } from "react";
import SectionWrapper from "./SectionWrapper";
import Footer from "../Footer/Footer";
import "./HeroSearch.css";

import {
  getStates,
  getCitiesByState,
  getHospitalsByCity,
  getVaccinesByHospital,
  getSlotsAvailabilityRange,
  getAvailableSlots,
} from "../../services/patientService";

import { getApiErrorMessage } from "../../services/apiClients";

export default function HeroSearch({ showFooter = false }) {
  // show centers section only after user clicks Search
  const [showCenters, setShowCenters] = useState(false);

  // location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  // selections
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [selectedHospital, setSelectedHospital] = useState(null);

  // vaccine + availability
  const [vaccines, setVaccines] = useState([]);
  const [vaccineId, setVaccineId] = useState(""); // "" => all
  const [availability, setAvailability] = useState([]); // [{date,count}]
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);

  // UI
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // helpers
  const getStateKey = (s) => s.stateId ?? s.state_id;
  const getStateLabel = (s) => s.stateName ?? s.state_name;

  const getCityKey = (c) => c.cityId ?? c.city_id;
  const getCityLabel = (c) => c.cityName ?? c.city_name;

  const getHospitalKey = (h) => h.hospitalId ?? h.hospital_id;
  const getHospitalLabel = (h) => h.hospitalName ?? h.hospital_name;
  const getHospitalType = (h) => h.hospitalType ?? h.hospital_type;
  const getHospitalAddress = (h) =>
    h.address ?? h.hospitalAddress ?? h.hospital_address ?? "";

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const formatChipDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    } catch {
      return iso;
    }
  };

  // resets
  const resetAfterState = () => {
    setCities([]);
    setCityId("");
    resetAfterCity();
  };

  const resetAfterCity = () => {
    setHospitals([]);
    setSelectedHospital(null);
    resetAfterHospital();
  };

  const resetAfterHospital = () => {
    setVaccines([]);
    setVaccineId("");
    setAvailability([]);
    setDate("");
    setSlots([]);
    setInfo("");
  };

  // load states
  useEffect(() => {
    const loadStates = async () => {
      try {
        setLoadingStates(true);
        setError("");
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

  // state -> cities
  useEffect(() => {
    const loadCities = async () => {
      resetAfterState();
      setError("");
      setInfo("");
      setShowCenters(false);

      if (!stateId) return;

      try {
        setLoadingCities(true);
        const data = await getCitiesByState(stateId);
        setCities(Array.isArray(data) ? data : []);
      } catch (e) {
        setCities([]);
        setError(getApiErrorMessage(e) || "Failed to load cities");
      } finally {
        setLoadingCities(false);
      }
    };

    loadCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateId]);

  // city -> hospitals
  useEffect(() => {
    const loadHospitals = async () => {
      resetAfterCity();
      setError("");
      setInfo("");
      setShowCenters(false);

      if (!cityId) return;

      try {
        setLoadingHospitals(true);
        const data = await getHospitalsByCity({ cityId });
        setHospitals(Array.isArray(data) ? data : []);
      } catch (e) {
        setHospitals([]);
        setError(getApiErrorMessage(e) || "Failed to load hospitals");
      } finally {
        setLoadingHospitals(false);
      }
    };

    loadHospitals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // hospital -> vaccines
  useEffect(() => {
    const loadVaccines = async () => {
      setVaccines([]);
      setError("");

      if (!selectedHospital) return;

      const hospitalId = Number(getHospitalKey(selectedHospital));
      if (!hospitalId) return;

      try {
        setLoadingVaccines(true);
        const data = await getVaccinesByHospital({ hospitalId, date: null });
        setVaccines(Array.isArray(data) ? data : []);
      } catch {
        setVaccines([]);
      } finally {
        setLoadingVaccines(false);
      }
    };

    loadVaccines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHospital]);

  // availability chips (next 7 days)
  useEffect(() => {
    const loadAvailability = async () => {
      setAvailability([]);
      setError("");
      setInfo("");

      if (!selectedHospital) return;

      const hospitalId = Number(getHospitalKey(selectedHospital));
      if (!hospitalId) return;

      try {
        setLoadingAvailability(true);
        const summary = await getSlotsAvailabilityRange({
          hospitalId,
          vaccineId: vaccineId ? Number(vaccineId) : null,
          days: 7,
        });

        setAvailability(Array.isArray(summary) ? summary : []);
      } catch {
        setAvailability([]);
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [selectedHospital, vaccineId]);

  // slots table
  useEffect(() => {
    const loadSlots = async () => {
      setSlots([]);
      setError("");
      setInfo("");

      if (!selectedHospital || !date) return;

      const hospitalId = Number(getHospitalKey(selectedHospital));
      if (!hospitalId) return;

      try {
        setLoadingSlots(true);
        const data = await getAvailableSlots({
          hospitalId,
          date,
          vaccineId: vaccineId ? Number(vaccineId) : null,
        });
        setSlots(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(getApiErrorMessage(e) || "Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedHospital, date, vaccineId]);

  // Search button click
  const handleSearchCenters = () => {
    setError("");
    setInfo("");
    setShowCenters(true);

    // reset previous selection
    setSelectedHospital(null);
    resetAfterHospital();

    if (!stateId) return setError("Please select State");
    if (!cityId) return setError("Please select City");
  };

  const selectedCityName = useMemo(() => {
    const c = cities.find((x) => String(getCityKey(x)) === String(cityId));
    return c ? getCityLabel(c) : "";
  }, [cities, cityId]);

  return (
    <>
      <SectionWrapper>
        <div id="find-center" className="col-12">
          <div className="hero-search-card w-100 bg-white shadow-lg rounded-4 p-4 p-md-5">
            <h1 className="section-title2 mb-3 text-center fw-bold display-6">
              Search Your Nearest Vaccination Center
            </h1>

            <p className="text-muted mb-4 mx-auto text-center hero-subtitle">
              Get a preview list of nearest centers and check availability of
              vaccination slots.
            </p>

            {error && (
              <div className="alert alert-danger py-2 mb-3">
                {String(error)}
              </div>
            )}

            <div className="row g-3 align-items-center justify-content-center mt-1">
              {/* State */}
              <div className="col-lg-3 col-md-4 col-sm-6">
                <select
                  className="form-select form-select-lg rounded-3"
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
              <div className="col-lg-3 col-md-4 col-sm-6">
                <select
                  className="form-select form-select-lg rounded-3"
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

              {/* Search */}
              <div className="col-lg-3 col-md-4 col-sm-8">
                <button
                  type="button"
                  className="btn btn-landing-search btn-lg w-100 rounded-pill shadow-sm hero-search-btn"
                  onClick={handleSearchCenters}
                  disabled={loadingHospitals || loadingStates || loadingCities}
                >
                  {loadingHospitals ? "Searching..." : "Search Centers"}
                </button>
              </div>
            </div>

            {/* Centers section appears only after search */}
            {showCenters && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <h5 className="mb-0">
                    Centers {selectedCityName ? `in ${selectedCityName}` : ""}
                  </h5>
                  <div className="text-muted small">
                    {hospitals.length} found
                  </div>
                </div>

                <div className="table-responsive mt-2">
                  <table className="table table-sm align-middle">
                    <thead>
                      <tr>
                        <th>Center</th>
                        <th>Type</th>
                        <th>Address</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {hospitals.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-muted">
                            {cityId
                              ? loadingHospitals
                                ? "Loading centers..."
                                : "No centers found for selected city."
                              : "Select city first."}
                          </td>
                        </tr>
                      ) : (
                        hospitals.map((h) => {
                          const hid = getHospitalKey(h);
                          const active =
                            String(getHospitalKey(selectedHospital || {})) ===
                            String(hid);

                          return (
                            <tr key={hid} className={active ? "table-primary" : ""}>
                              <td className="fw-semibold">{getHospitalLabel(h)}</td>
                              <td>{getHospitalType(h) || "-"}</td>
                              <td className="text-muted">{getHospitalAddress(h) || "-"}</td>
                              <td className="text-end">
                                <button
                                  type="button"
                                  className={`btn btn-sm ${
                                    active ? "btn-primary" : "btn-outline-primary"
                                  }`}
                                  onClick={() => {
                                    // ✅ make View Slots work again:
                                    setSelectedHospital(h);
                                    setVaccineId("");
                                    setAvailability([]);
                                    setDate("");
                                    setSlots([]);
                                    setError("");
                                    setInfo("");
                                  }}
                                >
                                  {active ? "Selected" : "View Slots"}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ✅ Slots Preview panel (shows after clicking View Slots) */}
            {selectedHospital && (
              <div className="mt-4 p-3 border rounded-4 bg-light">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                  <div>
                    <div className="fw-bold">{getHospitalLabel(selectedHospital)}</div>
                    <div className="text-muted small">
                      {getHospitalType(selectedHospital) || "Hospital"}
                      {getHospitalAddress(selectedHospital)
                        ? ` • ${getHospitalAddress(selectedHospital)}`
                        : ""}
                    </div>
                  </div>
                  <div className="text-muted small">Preview only (Login to book)</div>
                </div>

                <div className="row g-3 mt-2">
                  {/* Vaccine */}
                  <div className="col-12 col-md-4">
                    <label className="form-label fw-semibold">Vaccine</label>
                    <select
                      className="form-select"
                      value={vaccineId}
                      onChange={(e) => {
                        setVaccineId(e.target.value);
                        setAvailability([]);
                        setDate("");
                        setSlots([]);
                        setError("");
                        setInfo("");
                      }}
                      disabled={loadingVaccines}
                    >
                      <option value="">
                        {loadingVaccines ? "Loading..." : "All Vaccines"}
                      </option>
                      {vaccines.map((v) => (
                        <option key={v.vaccineId} value={v.vaccineId}>
                          {v.vaccineName} {v.manufacturer ? `- ${v.manufacturer}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Availability chips */}
                  <div className="col-12 col-md-8">
                    <label className="form-label fw-semibold">
                      Next 7 Days Availability
                    </label>

                    {loadingAvailability ? (
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
                              onClick={() => {
                                setDate(a.date);
                                setSlots([]);
                                setError("");
                                setInfo("");
                              }}
                            >
                              {formatChipDate(a.date)}{" "}
                              <span className="badge text-bg-light ms-1">{a.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="form-text">
                      Tip: Click a date with slots to load table quickly.
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
                        if (val && val < todayStr) {
                          setError("You cannot select a past date.");
                          return;
                        }
                        setDate(val);
                        setSlots([]);
                        setError("");
                        setInfo("");
                      }}
                    />
                  </div>

                  {/* Slots table */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Available Slots {loadingSlots ? "(Loading...)" : ""}
                    </label>

                    <div className="table-responsive">
                      <table className="table table-bordered table-sm align-middle bg-white">
                        <thead>
                          <tr>
                            <th>Time</th>
                            <th>Vaccine</th>
                            <th>Available</th>
                          </tr>
                        </thead>

                        <tbody>
                          {!date ? (
                            <tr>
                              <td colSpan="3" className="text-muted">
                                Select a date to view slots.
                              </td>
                            </tr>
                          ) : loadingSlots ? (
                            <tr>
                              <td colSpan="3" className="text-muted">
                                Loading slots...
                              </td>
                            </tr>
                          ) : slots.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-muted">
                                No slots available for this date.
                              </td>
                            </tr>
                          ) : (
                            slots.map((s) => {
                              const available =
                                Number(s.capacity || 0) - Number(s.bookedCount || 0);

                              return (
                                <tr key={s.slotId}>
                                  <td>{s.startTime} - {s.endTime}</td>
                                  <td>{s.vaccine?.vaccineName || "Vaccine"}</td>
                                  <td className="fw-semibold">{available}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="text-muted small">
                      Want to book? Please login and go to <b>Book Appointment</b>.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionWrapper>

      {showFooter && <Footer />}
    </>
  );
}
