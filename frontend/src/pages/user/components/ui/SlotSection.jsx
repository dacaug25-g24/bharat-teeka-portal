/*
  This section handles date input and slot dropdown.
*/

export default function SlotSection({
  hospitalId,
  todayStr,
  date,
  setDate,
  slots,
  slotId,
  setSlotId,
  selectedSlot,
  availableCount,
  loadingSlots,
  setError,
  setSuccessMsg,
  setSlotsInfo,
  setEarliestInfo,
}) {
  return (
    <>
      <div className="col-12 col-md-4">
        <label className="form-label fw-semibold">Date</label>

        <input
          type="date"
          className="form-control"
          value={date}
          min={todayStr}
          onChange={(e) => {
            const value = e.target.value;

            if (value && value < todayStr) {
              setError("You cannot select a past date.");
              return;
            }

            setDate(value);

            // Clear slot selection when date changes
            setSlotId("");
            setSlotsInfo("");
            setError("");
            setSuccessMsg("");
            setEarliestInfo("");
          }}
          disabled={!hospitalId}
        />
      </div>

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
                {s.startTime} - {s.endTime} | {s.vaccine?.vaccineName || "Vaccine"}{" "}
                | Available: {available}
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
            | Available: <span className="fw-semibold">{availableCount}</span>
          </div>
        )}
      </div>
    </>
  );
}
