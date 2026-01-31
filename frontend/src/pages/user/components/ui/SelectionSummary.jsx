/*
  This card shows the current selection summary.
*/

export default function SelectionSummary({
  bookingFor,
  selectedBeneficiary,
  selfPatientId,
  selectedStateName,
  selectedCityName,
  selectedHospitalName,
  selectedVaccineName,
  date,
  slotId,
}) {
  return (
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
  );
}
