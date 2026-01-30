import { Link } from "react-router-dom";
import { useMemo } from "react";
import useUserDashboardHome from "./hooks/useUserDashboardHome";
import {
  safeStr,
  formatDateDDMMYYYY,
  normalizeStatus,
  statusBadgeClass,
  findLatestAppointment,
  buildStats,
} from "./utils/dashboardHelpers";

/*
  Dashboard UI.
  All data loading is in useUserDashboardHome hook.
*/

export default function UserDashboardHome() {
  const {
    user,
    isParent,
    loading,
    err,
    beneficiaries,
    appointments,
  } = useUserDashboardHome();

  const latestAppointment = useMemo(() => {
    return findLatestAppointment(appointments);
  }, [appointments]);

  const stats = useMemo(() => {
    return buildStats(appointments);
  }, [appointments]);

  return (
    <div className="container-fluid p-0">
      {/* Top welcome card */}
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

      {/* Loading UI */}
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
          <div className="row g-3">
            {/* Latest appointment */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="fw-semibold mb-1">Latest Appointment</div>
                  <div className="text-muted small">
                    Most recent booking (if any)
                  </div>

                  {!latestAppointment ? (
                    <div className="mt-3 text-muted">
                      No appointment found. Book your first slot.
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
                          {formatDateDDMMYYYY(
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

            {/* Beneficiaries */}
            {isParent && (
              <div className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-semibold mb-1">Beneficiaries</div>
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
                      <div className="fw-semibold mb-1">Appointments</div>
                      <div className="text-muted small">
                        Total appointments summary
                      </div>
                    </div>

                    <span className="badge text-bg-primary">{stats.total}</span>
                  </div>

                  <div className="mt-3 small">
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
                    <Link
                      to="/user/history"
                      className="btn btn-sm btn-outline-primary"
                    >
                      Open History
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-info border-0 mt-3 mb-0">
            Tip: Keep your phone and address updated in Profile so hospitals can
            contact you easily.
          </div>
        </>
      )}
    </div>
  );
}
