import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  getProfile,
  getParentChildren,
  getAppointmentHistory,
  getPatientIdByUserId,
} from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function UserDashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [profile, setProfile] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selfPatientId, setSelfPatientId] = useState(null);

  const safeStr = (v) => (v === null || v === undefined || v === "" ? "-" : v);

  const toDateObj = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isFinite(d.getTime()) ? d : null;
  };

  const formatDate = (v) => {
    const d = toDateObj(v);
    if (!d) return safeStr(v);
    
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}-${mm}-${yy}`;
  };

  const normalizeStatus = (a) => {
    const s = String(a?.status || a?.appointmentStatus || a?.state || "")
      .trim()
      .toLowerCase();

    if (!s) return "Unknown";
    if (s.includes("cancel")) return "Cancelled";
    if (s.includes("complete") || s.includes("done")) return "Completed";
    if (s.includes("book")) return "Booked";
    return (a?.status || a?.appointmentStatus || a?.state || "Unknown");
  };

  const latestAppointment = useMemo(() => {
    if (!Array.isArray(appointments) || appointments.length === 0) return null;

    const getTime = (x) => {
      const d =
        x?.appointmentDate || x?.date || x?.createdAt || x?.slotDate || null;
      const t = toDateObj(d)?.getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const sorted = [...appointments].sort((a, b) => getTime(b) - getTime(a));
    return sorted[0];
  }, [appointments]);

  const stats = useMemo(() => {
    const list = Array.isArray(appointments) ? appointments : [];
    const total = list.length;

    const booked = list.filter((a) => normalizeStatus(a) === "Booked").length;
    const completed = list.filter(
      (a) => normalizeStatus(a) === "Completed"
    ).length;
    const cancelled = list.filter(
      (a) => normalizeStatus(a) === "Cancelled"
    ).length;

    return { total, booked, completed, cancelled };
  }, [appointments]);

  const profileScore = useMemo(() => {
    
    const phone = profile?.phone || user?.phone || "";
    const address = profile?.address || user?.address || "";

    let score = 0;
    if (String(phone).trim()) score += 50;
    if (String(address).trim()) score += 50;

    return score; 
  }, [profile, user]);

  const statusBadgeClass = (status) => {
    if (status === "Booked") return "text-bg-primary";
    if (status === "Completed") return "text-bg-success";
    if (status === "Cancelled") return "text-bg-danger";
    return "text-bg-secondary";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        if (!user?.userId) {
          setErr("User not found. Please login again.");
          return;
        }

        
        const p = await getProfile(user.userId);
        setProfile(p || null);

        const pid = user?.patientId || (await getPatientIdByUserId(user.userId));
        setSelfPatientId(pid || null);

       
        if (isParent) {
          const kids = await getParentChildren(user.userId);
          setBeneficiaries(Array.isArray(kids) ? kids : []);
        } else {
          setBeneficiaries([]);
        }

        if (pid) {
          const hist = await getAppointmentHistory({
            patientId: pid,
            parentUserId: isParent ? user.userId : null,
          });
          setAppointments(Array.isArray(hist) ? hist : []);
        } else {
          setAppointments([]);
        }
      } catch (e) {
        setErr(getApiErrorMessage(e) || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.userId, isParent]);

  const displayPhone = profile?.phone || user?.phone || "";
  const displayAddress = profile?.address || user?.address || "";

  return (
    <div className="container-fluid p-0">
      {/* Top Welcome Card */}
      <div className="card border-0 shadow-sm mb-3 overflow-hidden">
        <div className="card-body d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
          <div className="pe-md-2">
            <div className="d-flex align-items-center gap-2 mb-1">
              <div
                className="rounded-circle bg-primary-subtle d-flex align-items-center justify-content-center"
                style={{ width: 44, height: 44 }}
              >
                <span className="fw-bold text-primary">
                  {(user?.username || "U").slice(0, 1).toUpperCase()}
                </span>
              </div>

              <div>
                <h5 className="mb-0">
                  Welcome,{" "}
                  <span className="text-primary">{safeStr(user?.username)}</span>
                </h5>
                <div className="text-muted small">
                  {isParent
                    ? "Manage beneficiaries and book appointments."
                    : "Book appointments and track your vaccination journey."}
                </div>
              </div>
            </div>

            <div className="small text-muted mt-2">

            </div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-primary" to="/user/book-appointment">
              Book Appointment
            </Link>
            <Link className="btn btn-outline-secondary" to="/user/history">
              View History
            </Link>
            {isParent && (
              <Link className="btn btn-outline-primary" to="/user/beneficiaries">
                Beneficiaries
              </Link>
            )}
            <Link className="btn btn-outline-dark" to="/user/profile">
              Edit Profile
            </Link>
          </div>
        </div>

      </div>

      {err && <div className="alert alert-danger border-0">{err}</div>}

      {/* Loading placeholders */}
      {loading ? (
        <div className="row g-3">
          {[1, 2, 3].map((x) => (
            <div className="col-12 col-md-6 col-lg-4" key={x}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="placeholder-glow">
                    <div className="placeholder col-7 mb-2"></div>
                    <div className="placeholder col-10 mb-2"></div>
                    <div className="placeholder col-6"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="row g-3">

            {/* Latest appointment */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="fw-semibold d-flex align-items-center gap-2">
                    <span>🧾</span> Latest Appointment
                  </div>
                  <div className="text-muted small">
                    Most recent booking (if any)
                  </div>

                  {!latestAppointment ? (
                    <div className="mt-3 text-muted">
                      No appointment found. Book your first slot!
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Status</span>
                        <span
                          className={`badge ${statusBadgeClass(
                            normalizeStatus(latestAppointment)
                          )}`}
                        >
                          {normalizeStatus(latestAppointment)}
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Date</span>
                        <span className="fw-semibold small">
                          {formatDate(
                            latestAppointment.appointmentDate ||
                            latestAppointment.date ||
                            latestAppointment.createdAt ||
                            latestAppointment.slotDate
                          )}
                        </span>
                      </div>

                      {(latestAppointment.hospitalName ||
                        latestAppointment.centerName) && (
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">Hospital</span>
                            <span className="fw-semibold small text-truncate ms-2">
                              {latestAppointment.hospitalName ||
                                latestAppointment.centerName}
                            </span>
                          </div>
                        )}

                      <div className="mt-3">
                        <Link
                          to="/user/book-appointment"
                          className="btn btn-sm btn-outline-dark"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {isParent && (
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold d-flex align-items-center gap-2">
                          <span>👨‍👩‍👧</span> Beneficiaries
                        </div>
                        <div className="text-muted small">
                          Active beneficiaries
                        </div>
                      </div>
                      <span className="badge text-bg-success">
                        {beneficiaries.length}
                      </span>
                    </div>

                    <div className="mt-3">
                      <Link
                        to="/user/beneficiaries"
                        className="btn btn-sm btn-outline-success"
                      >
                        Manage Beneficiaries
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-semibold d-flex align-items-center gap-2">
                        <span>📅</span> Appointments
                      </div>
                      <div className="text-muted small">
                        Total appointments and summary
                      </div>
                    </div>
                    <span className="badge text-bg-primary">{stats.total}</span>
                  </div>

                  <div className="mt-3 small">
                    {/* <div className="d-flex justify-content-between">
                      <span className="text-muted">Booked</span>
                      <span className="fw-semibold">{stats.booked}</span>
                    </div> */}
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Completed</span>
                      <span className="fw-semibold">{stats.completed}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Cancelled</span>
                      <span className="fw-semibold">{stats.cancelled}</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <Link to="/user/history" className="btn btn-sm btn-outline-primary">
                      Open History
                    </Link>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Helpful info */}
          <div className="alert alert-info border-0 mt-3 mb-0">
            ℹ️ Tip: Keep your <b>phone</b> and <b>address</b> updated in Profile so hospitals can contact you easily.
          </div>
        </>
      )}
    </div>
  );
}
