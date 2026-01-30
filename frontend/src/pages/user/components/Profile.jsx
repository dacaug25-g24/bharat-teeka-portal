import useProfileForm from "./hooks/useProfileForm";

/*
  This is the Profile page UI.
  All API and state logic is inside useProfileForm hook.
*/

export default function Profile() {
  const {
    form,
    onChange,

    loading,
    saving,

    msg,
    err,

    validationError,
    hasChanges,

    handleSave,
    handleReset,
  } = useProfileForm();

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-1">Profile</h5>
            </div>

            {loading && <span className="badge text-bg-light">Loading...</span>}
          </div>

          {err && (
            <div className="alert alert-danger border-0 py-2">{err}</div>
          )}
          {msg && (
            <div className="alert alert-success border-0 py-2">{msg}</div>
          )}

          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input className="form-control" value={form.username} disabled />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" value={form.email} disabled />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Enter phone"
                  maxLength={10}
                  disabled={loading}
                />
                <div className="form-text">
                  10-digit Indian number (starts with 6-9).
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Address *</label>
                <input
                  className="form-control"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Enter address"
                  disabled={loading}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Remarks (optional)</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={form.remarks}
                  onChange={onChange}
                  rows={3}
                  placeholder="Notes, allergies, etc."
                  disabled={loading}
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={
                    loading || saving || Boolean(validationError) || !hasChanges
                  }
                  title={validationError || (!hasChanges ? "No changes to save" : "")}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleReset}
                  disabled={loading || saving}
                >
                  Reset
                </button>
              </div>

              {validationError && (
                <div className="col-12">
                  <div className="text-danger small">{validationError}</div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
