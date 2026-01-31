import { todayISO } from "../utils/beneficiaryHelpers";

export default function BeneficiaryForm({
  isParent,
  form,
  onChange,
  onSubmit,
  onReset,
  submitting,
  relations,
}) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h6 className="fw-semibold mb-3">Add Beneficiary</h6>

        <form onSubmit={onSubmit}>
          <div className="row g-2">
            <div className="col-md-6">
              <label className="form-label">First Name *</label>
              <input
                className="form-control"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                disabled={!isParent}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Last Name *</label>
              <input
                className="form-control"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                disabled={!isParent}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Date of Birth *</label>
              <input
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={form.dateOfBirth}
                max={todayISO()}
                onChange={onChange}
                disabled={!isParent}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Gender *</label>
              <select
                className="form-select"
                name="gender"
                value={form.gender}
                onChange={onChange}
                disabled={!isParent}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Aadhaar *</label>
              <input
                className="form-control"
                name="aadharNumber"
                value={form.aadharNumber}
                onChange={onChange}
                maxLength={12}
                disabled={!isParent}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Blood Group *</label>
              <select
                className="form-select"
                name="bloodGroup"
                value={form.bloodGroup}
                onChange={onChange}
                disabled={!isParent}
              >
                <option value="">Select</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Relation *</label>
              <select
                className="form-select"
                name="relationId"
                value={form.relationId}
                onChange={onChange}
                disabled={!isParent}
              >
                <option value="">Select</option>
                {relations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Remarks</label>
              <textarea
                className="form-control"
                name="remarks"
                value={form.remarks}
                onChange={onChange}
                rows={2}
                disabled={!isParent}
              />
            </div>

            <div className="col-12 d-flex gap-2 mt-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isParent || submitting}
              >
                {submitting ? "Adding..." : "Add Beneficiary"}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onReset}
                disabled={!isParent}
              >
                Reset
              </button>
            </div>

            {!isParent && (
              <div className="text-muted small mt-2">
                You are not a Parent user, so you cannot add beneficiaries.
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
