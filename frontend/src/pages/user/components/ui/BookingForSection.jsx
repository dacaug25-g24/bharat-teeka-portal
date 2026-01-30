/*
  This section handles who the booking is for:
  self or beneficiary.
*/

export default function BookingForSection({
  isParent,
  bookingFor,
  setBookingFor,
  selectedBeneficiary,
  setSelectedBeneficiary,
  beneficiaries,
  beneficiaryLabel,
  selfPatientId,
  loadingProfile,
  resetAll,
  setError,
  setSuccessMsg,
}) {
  const onSelectSelf = () => {
    setBookingFor("self");
    setSelectedBeneficiary("");
    resetAll();
  };

  const onSelectBeneficiary = () => {
    setBookingFor("beneficiary");
    resetAll();
  };

  return (
    <>
      <div className="col-12 col-lg-6">
        <label className="form-label fw-semibold">Booking For</label>

        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={`btn ${
              bookingFor === "self" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={onSelectSelf}
          >
            Self
          </button>

          <button
            type="button"
            className={`btn ${
              bookingFor === "beneficiary" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={onSelectBeneficiary}
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

      {isParent && bookingFor === "beneficiary" && (
        <div className="col-12 col-lg-6">
          <label className="form-label fw-semibold">Select Beneficiary</label>
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
    </>
  );
}
