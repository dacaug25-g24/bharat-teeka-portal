import { useEffect, useState } from "react";
import VaccinationHistoryDropdown from "./VaccinationHistoryDropdown";
import "./appointments.css";

const HOSPITAL_API =
  import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";
const AUTH_API = import.meta.env.VITE_AUTH_API || "http://localhost:8080";

const TodayAppointments = ({ hospitalId, dateFilter }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [notice, setNotice] = useState({ type: "", msg: "" });
  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(
      () => setNotice({ type: "", msg: "" }),
      2500,
    );
  };

  const [actionUI, setActionUI] = useState({
    openForId: null,
    mode: null,
    batchNumber: "",
    remarks: "",
    reason: "",
    saving: false,
  });

  const openComplete = (appt) =>
    setActionUI({
      openForId: appt.appointmentId,
      mode: "complete",
      batchNumber: "",
      remarks: "",
      reason: "",
      saving: false,
    });

  const openCancel = (appt) =>
    setActionUI({
      openForId: appt.appointmentId,
      mode: "cancel",
      batchNumber: "",
      remarks: "",
      reason: "",
      saving: false,
    });

  const closeActionUI = () =>
    setActionUI({
      openForId: null,
      mode: null,
      batchNumber: "",
      remarks: "",
      reason: "",
      saving: false,
    });

  const fetchPatientBasics = async (patientIds) => {
    const missing = patientIds.filter((id) => !patientMap[id]);
    if (missing.length === 0) return;

    const results = await Promise.allSettled(
      missing.map((id) =>
        fetch(`${AUTH_API}/auth/patients/${id}/basic`).then((r) =>
          r.ok ? r.json() : null,
        ),
      ),
    );

    const next = {};
    results.forEach((res, idx) => {
      const id = missing[idx];
      if (res.status === "fulfilled" && res.value) next[id] = res.value;
    });

    setPatientMap((prev) => ({ ...prev, ...next }));
  };

  const fetchAppointments = async () => {
    if (!hospitalId) return;
    setLoading(true);
    setError("");

    try {
      const url = dateFilter
        ? `${HOSPITAL_API}/hospital/appointments/hospital/${hospitalId}?date=${dateFilter}`
        : `${HOSPITAL_API}/hospital/appointments/hospital/${hospitalId}/today`;

      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const arr = Array.isArray(data) ? data : [];
      setAppointments(arr);

      const ids = [...new Set(arr.map((a) => a.patientId).filter(Boolean))];
      await fetchPatientBasics(ids);
    } catch {
      setError("Unable to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId, dateFilter]);

  // const completeWithDetails = async (appt) => {
  //   const id = appt.appointmentId;

  //   if (!actionUI.batchNumber.trim()) {
  //     showNotice("danger", "Batch number is required");
  //     return;
  //   }

  //   try {
  //     setActionUI((p) => ({ ...p, saving: true }));

  //     const res = await fetch(
  //       `${HOSPITAL_API}/hospital/appointments/${id}/complete-details`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           batchNumber: actionUI.batchNumber.trim(),
  //           remarks: actionUI.remarks?.trim() || "",
  //         }),
  //       },
  //     );

  //     if (!res.ok) throw new Error();
  //     showNotice("success", "Appointment completed & vaccination recorded");
  //     closeActionUI();
  //     fetchAppointments();
  //   } catch {
  //     showNotice("danger", "Failed to complete appointment");
  //     setActionUI((p) => ({ ...p, saving: false }));
  //   }
  // };
  const completeWithDetails = async (appt) => {
    const id = appt.appointmentId;

    if (!actionUI.batchNumber.trim()) {
      showNotice("danger", "Batch number is required");
      return;
    }

    try {
      setActionUI((p) => ({ ...p, saving: true }));

      const res = await fetch(
        `${HOSPITAL_API}/hospital/appointments/${id}/complete-details`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            batchNumber: actionUI.batchNumber.trim(),
            remarks: actionUI.remarks?.trim() || "",
          }),
        },
      );

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `HTTP ${res.status}`);
      }

      showNotice("success", "Appointment completed & vaccination recorded");
      closeActionUI();
      await fetchAppointments();
    } catch (e) {
      console.error("Complete failed:", e);
      showNotice("danger", `Failed: ${e.message || "Complete error"}`);
      setActionUI((p) => ({ ...p, saving: false }));
    }
  };

  const cancelAppointment = async (appt) => {
    const id = appt.appointmentId;

    if (!actionUI.reason.trim()) {
      showNotice("danger", "Cancel reason is required");
      return;
    }

    try {
      setActionUI((p) => ({ ...p, saving: true }));

      const res = await fetch(
        `${HOSPITAL_API}/hospital/appointments/${id}/cancel?reason=${encodeURIComponent(
          actionUI.reason.trim(),
        )}`,
        { method: "PUT" },
      );

      if (!res.ok) throw new Error();
      showNotice("success", "Appointment cancelled successfully");
      closeActionUI();
      fetchAppointments();
    } catch {
      showNotice("danger", "Failed to cancel appointment");
      setActionUI((p) => ({ ...p, saving: false }));
    }
  };

  const statusClass = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "completed") return "btp-chip completed";
    if (v === "cancelled") return "btp-chip cancelled";
    if (v === "booked") return "btp-chip booked";
    return "btp-chip pending";
  };

  return (
    <div>
      {notice.msg && (
        <div className={`alert alert-${notice.type} py-2`} role="alert">
          {notice.msg}
        </div>
      )}

      {loading && <p className="text-muted mb-2">Loading appointments...</p>}
      {error && <p className="text-danger mb-2">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-muted mb-0">No appointments found</p>
      )}

      {appointments.length > 0 && (
        <div className="btp-table-wrap">
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Aadhaar</th>
                  <th>History</th>
                  <th>Date</th>
                  <th>Vaccine</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th style={{ width: 320 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => {
                  const p = patientMap[a.patientId];
                  const vaccineName = a?.slot?.vaccine?.vaccineName || "-";
                  const canAct = a.status === "BOOKED";
                  const isOpen = actionUI.openForId === a.appointmentId;

                  return (
                    <tr key={a.appointmentId}>
                      <td>{a.appointmentId}</td>
                      <td>{p?.fullName || `Patient #${a.patientId}`}</td>
                      <td>{p?.aadhaarNumber || "-"}</td>
                      <td>
                        <VaccinationHistoryDropdown patientId={a.patientId} />
                      </td>
                      <td>{a.bookingDate}</td>
                      <td className="fw-semibold">{vaccineName}</td>
                      <td>
                        <span className={statusClass(a.status)}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.remarks || "-"}</td>

                      <td className="btp-actions-td">
                        {!canAct ? (
                          <span className="text-muted">No actions</span>
                        ) : (
                          <div className="btp-actions-wrap">
                            {/* Buttons (when closed) */}
                            {!isOpen && (
                              <div className="btp-table-actions">
                                <button
                                  className="btn btn-success"
                                  onClick={() => openComplete(a)}
                                  type="button"
                                >
                                  Complete
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => openCancel(a)}
                                  type="button"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            {/* Mini modal overlay */}
                            {isOpen && (
                              <div className="btp-mini-modal">
                                <div
                                  className="btp-mini-backdrop"
                                  onClick={closeActionUI}
                                />

                                <div
                                  className="btp-mini-panel"
                                  role="dialog"
                                  aria-modal="true"
                                >
                                  <div className="btp-mini-head">
                                    <div className="btp-mini-title">
                                      {actionUI.mode === "complete"
                                        ? "Complete Appointment"
                                        : "Cancel Appointment"}
                                    </div>

                                    <button
                                      type="button"
                                      className="btp-mini-close"
                                      onClick={closeActionUI}
                                      disabled={actionUI.saving}
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  {actionUI.mode === "complete" ? (
                                    <>
                                      <div className="btp-mini-body">
                                        <div className="btp-mini-field">
                                          <label className="form-label mb-1">
                                            Batch Number
                                          </label>
                                          <input
                                            className="form-control"
                                            value={actionUI.batchNumber}
                                            onChange={(e) =>
                                              setActionUI((p) => ({
                                                ...p,
                                                batchNumber: e.target.value,
                                              }))
                                            }
                                            placeholder="e.g. BATCH-001"
                                          />
                                        </div>

                                        <div className="btp-mini-field">
                                          <label className="form-label mb-1">
                                            Remarks (optional)
                                          </label>
                                          <input
                                            className="form-control"
                                            value={actionUI.remarks}
                                            onChange={(e) =>
                                              setActionUI((p) => ({
                                                ...p,
                                                remarks: e.target.value,
                                              }))
                                            }
                                            placeholder="e.g. Vaccinated successfully"
                                          />
                                        </div>
                                      </div>

                                      <div className="btp-mini-foot">
                                        <button
                                          className="btn btn-success"
                                          onClick={() => completeWithDetails(a)}
                                          disabled={actionUI.saving}
                                          type="button"
                                        >
                                          {actionUI.saving
                                            ? "Saving..."
                                            : "Save"}
                                        </button>

                                        <button
                                          className="btn btn-outline-secondary"
                                          onClick={closeActionUI}
                                          disabled={actionUI.saving}
                                          type="button"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="btp-mini-body">
                                        <div className="btp-mini-field">
                                          <label className="form-label mb-1">
                                            Cancel Reason
                                          </label>
                                          <input
                                            className="form-control"
                                            value={actionUI.reason}
                                            onChange={(e) =>
                                              setActionUI((p) => ({
                                                ...p,
                                                reason: e.target.value,
                                              }))
                                            }
                                            placeholder="e.g. Patient not available"
                                          />
                                        </div>
                                      </div>

                                      <div className="btp-mini-foot">
                                        <button
                                          className="btn btn-danger"
                                          onClick={() => cancelAppointment(a)}
                                          disabled={actionUI.saving}
                                          type="button"
                                        >
                                          {actionUI.saving
                                            ? "Saving..."
                                            : "Cancel"}
                                        </button>

                                        <button
                                          className="btn btn-outline-secondary"
                                          onClick={closeActionUI}
                                          disabled={actionUI.saving}
                                          type="button"
                                        >
                                          Close
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayAppointments;
