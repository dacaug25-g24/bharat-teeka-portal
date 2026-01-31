/*
  This section handles state, city and hospital dropdowns.
*/

export default function LocationSection({
  states,
  cities,
  hospitals,
  stateId,
  setStateId,
  cityId,
  setCityId,
  hospitalId,
  setHospitalId,
  loadingStates,
  loadingCities,
  loadingHospitals,
  getStateKey,
  getStateLabel,
  getCityKey,
  getCityLabel,
  getHospitalKey,
  getHospitalLabel,
  getHospitalType,
}) {
  return (
    <>
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
    </>
  );
}
