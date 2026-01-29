import { useEffect, useMemo, useState } from "react";
import {
  getParentChildren,
  getProfile,
  getAppointmentDetails,
  cancelAppointment,
} from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function History() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const [tab, setTab] = useState("self");
  const [selectedChild, setSelectedChild] = useState("");

  // self profile
  const [selfPatientId, setSelfPatientId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // beneficiaries
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  // history
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);

  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Load self patientId

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.userId) return;

      try {
        setLoadingProfile(true);
        setError("");
        const data = await getProfile(user.userId);
        setSelfPatientId(data?.patientId ?? null);
      } catch (e) {
        setSelfPatientId(null);
        setError(getApiErrorMessage(e) || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [user?.userId]);


  //  Load beneficiaries (Parent)

  useEffect(() => {
    const loadChildren = async () => {
      if (!isParent || !user?.userId) return;

      try {
        setLoadingBeneficiaries(true);
        const data = await getParentChildren(user.userId);
        setBeneficiaries(Array.isArray(data) ? data : []);
      } catch (e) {
        setBeneficiaries([]);
        setError(getApiErrorMessage(e) || "Failed to load beneficiaries");
      } finally {
        setLoadingBeneficiaries(false);
      }
    };

    loadChildren();
  }, [isParent, user?.userId]);


  //  Active patientId

  const activePatientId = useMemo(() => {
    if (tab === "self") return selfPatientId;


    if (!selectedChild) return null;

    return Number(selectedChild);
  }, [tab, selfPatientId, selectedChild]);

  const canFetch = Boolean(activePatientId);


  // Fetch history

  useEffect(() => {
    const fetchHistory = async () => {
      if (!canFetch) return;

      try {
        setLoadingRows(true);
        setError("");
        setRows([]);

        const data = await getAppointmentDetails({
          patientId: Number(activePatientId),
          parentUserId: tab === "beneficiary" ? user.userId : null,
        });

        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setRows([]);
        setError(getApiErrorMessage(e) || "Failed to load history");
      } finally {
        setLoadingRows(false);
      }
    };

    fetchHistory();
  }, [canFetch, activePatientId, tab, user?.userId]);


  // Cancel appointment

  const handleCancel = async (appointmentId) => {
    const ok = window.confirm("Cancel this appointment?");
    if (!ok) return;

    try {
      setCancellingId(appointmentId);
      setError("");

      const parentUserId = tab === "beneficiary" ? user.userId : null;

      const resp = await cancelAppointment(appointmentId, parentUserId);

      if (resp?.success === false) {
        throw new Error(resp?.message || "Failed to cancel appointment");
      }


      setRows((prev) =>
        (prev || []).map((r) => {
          const id = r?.appointmentId ?? r?.appointment_id ?? r?.id;
          if (Number(id) === Number(appointmentId)) {
            return { ...r, status: "Cancelled" };
          }
          return r;
        })
      );
    } catch (e) {
      setError(getApiErrorMessage(e) || e.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };


  //  Format rows

  const displayRows = useMemo(() => {
    return (rows || []).map((r, idx) => {
      const id = r?.appointmentId ?? r?.appointment_id ?? r?.id ?? `row-${idx}`;

      const hospital =
        r?.hospitalName ??
        r?.hospital_name ??
        r?.hospital?.hospitalName ??
        r?.hospital?.hospital_name ??
        "-";

      const vaccine =
        r?.vaccineName ??
        r?.vaccine_name ??
        r?.vaccine?.vaccineName ??
        r?.vaccine?.vaccine_name ??
        "-";

      const date = r?.bookingDate ?? r?.booking_date ?? r?.date ?? "-";

      const start =
        r?.startTime ??
        r?.start_time ??
        r?.slot?.startTime ??
        r?.slot?.start_time ??
        "";

      const end =
        r?.endTime ??
        r?.end_time ??
        r?.slot?.endTime ??
        r?.slot?.end_time ??
        "";

      const time = start && end ? `${start} - ${end}` : "-";

      const status = String(r?.status ?? "BOOKED").toUpperCase();

      return {
        key: id,
        id,
        hospital,
        vaccine,
        date,
        time,
        status,
      };
    });
  }, [rows]);


  //  UI

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5 className="mb-1">History</h5>
              <div className="text-muted small">
                Appointment & vaccination history
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
              className={`btn btn-sm ${tab === "self" ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                setTab("self");
                setSelectedChild("");
              }}
            >
              Self
            </button>

            <button
              className={`btn btn-sm ${tab === "beneficiary" ? "btn-primary" : "btn-outline-primary"
                }`}
              onClick={() => {
                setTab("beneficiary");
                setSelectedChild("");
                setRows([]); // clear old self history
                setError("");
              }}
              disabled={!isParent}
            >
              Beneficiary
            </button>
          </div>

          {/* Beneficiary select */}
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
                  if (!val) setRows([]); // if user goes back to Select, clear table
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
                        <span
                          className={`badge ${r.status === "Completed"
                              ? "text-bg-success"
                              : r.status === "Cancelled"
                                ? "text-bg-secondary"
                                : "text-bg-warning"
                            }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td>
                        {r.status === "BOOKED" ? (
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
