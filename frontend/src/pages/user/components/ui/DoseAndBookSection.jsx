/*
  This section handles dose selection and booking button.
*/

export default function DoseAndBookSection({
  doseNumber,
  setDoseNumber,
  handleBook,
  disableBook,
  booking,
  bookingFor,
  isParent,
  selectedBeneficiary,
  selfPatientId,
}) {
  return (
    <>
      <hr className="my-2" />

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
            Waiting for your Patient ID.
          </div>
        )}
      </div>
    </>
  );
}
