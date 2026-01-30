/*
  This section handles vaccine dropdown.
*/

export default function VaccineSection({
  hospitalId,
  vaccines,
  vaccineId,
  setVaccineId,
  loadingVaccines,
  setSlotsInfo,
  setDate,
  setEarliestInfo,
  setSlotId,
  setError,
  setSuccessMsg,
}) {
  return (
    <div className="col-12 col-md-4">
      <label className="form-label fw-semibold">Vaccine</label>

      <select
        className="form-select"
        value={vaccineId}
        onChange={(e) => {
          setVaccineId(e.target.value);

          // Clear dependent selections
          setSlotsInfo("");
          setDate("");
          setEarliestInfo("");
          setSlotId("");
          setError("");
          setSuccessMsg("");
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
  );
}
