import useHistoryData from "./hooks/useHistoryData";
import { getStatusBadgeClass } from "./utils/historyMappers";

/*
  This file is only UI.
  All logic is inside useHistoryData hook.
*/

export default function History() {
  const {
    isParent,

    tab,
    setTab,

    selectedChild,
    setSelectedChild,

    beneficiaries,
    loadingBeneficiaries,

    loadingProfile,
    loadingRows,

    error,
    setError,

    displayRows,
    canFetch,

    cancellingId,
    handleCancel,
  } = useHistoryData();

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5 className="mb-1">History</h5>
              <div className="text-muted small">
                Appointment and vaccination history
              </div>
            </div>

            {(loadingProfile || loadingRows) && (
              <span className="badge text-bg-light">Loading...</span>
            )}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Tabs */}
          <div className="d-flex gap-2 mb-3">
            <button
              className={`btn btn-sm ${
                tab === "self" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setTab("self");
                setSelectedChild("");
              }}
            >
              Self
            </button>

            <button
              className={`btn btn-sm ${
                tab === "beneficiary" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setTab("beneficiary");
                setSelectedChild("");
                setError("");
              }}
              disabled={!isParent}
            >
              Beneficiary
            </button>
          </div>

          {/* Beneficiary dropdown */}
          {isParent && tab === "beneficiary" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Select Beneficiary
              </label>

              <select
                className="form-select"
                value={selectedChild}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChild(val);
                }}
                disabled={loadingBeneficiaries}
              >
                <option value="">Select</option>
                {beneficiaries.map((b) => (
                  <option key={b.patientId} value={b.patientId}>
                    {b.firstName} {b.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!canFetch && (
            <div className="alert alert-light border small">
              {tab === "self"
                ? "Waiting for your patient profile..."
                : "Select a beneficiary to view history."}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Hospital</th>
                  <th>Vaccine</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingRows ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Loading history...
                    </td>
                  </tr>
                ) : displayRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      No records found.
                    </td>
                  </tr>
                ) : (
                  displayRows.map((r) => (
                    <tr key={r.key}>
                      <td>{r.id}</td>
                      <td className="fw-semibold">{r.hospital}</td>
                      <td>{r.vaccine}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        {String(r.status).toUpperCase() === "BOOKED" ? (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(r.id)}
                            disabled={cancellingId === r.id}
                          >
                            {cancellingId === r.id ? "Cancelling..." : "Cancel"}
                          </button>
                        ) : (
                          <span className="text-muted small">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
