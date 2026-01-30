/*
  This section shows next 7 days availability buttons.
  User can select date from here.
*/

export default function AvailabilitySection({
  hospitalId,
  availability,
  loadingAvailability,
  handleFindEarliest,
  date,
  setDate,
  setSlotId,
  setSlotsInfo,
  setError,
  setSuccessMsg,
  setEarliestInfo,
  formatChipDate,
}) {
  return (
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
        <div className="text-muted small">Select hospital to see availability.</div>
      ) : loadingAvailability ? (
        <div className="text-muted small">Loading availability...</div>
      ) : availability.length === 0 ? (
        <div className="text-muted small">No availability data. Select date manually.</div>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {availability.map((a) => {
            const isDisabled = Number(a.count || 0) === 0;
            const isActive = date === a.date;

            let btnClass = "btn-outline-primary";
            if (isActive) btnClass = "btn-primary";
            if (isDisabled && !isActive) btnClass = "btn-outline-secondary";

            return (
              <button
                key={a.date}
                type="button"
                className={`btn btn-sm ${btnClass}`}
                disabled={isDisabled}
                title={isDisabled ? "No slots" : "Click to select date"}
                onClick={() => {
                  setDate(a.date);

                  // Clear slot selection when date changes
                  setSlotId("");
                  setSlotsInfo("");
                  setError("");
                  setSuccessMsg("");
                  setEarliestInfo("");
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
        Tip: Click a date with slots to avoid trying many dates.
      </div>
    </div>
  );
}
