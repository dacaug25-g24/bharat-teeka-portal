import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

const API = import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";

const EMPTY_COUNTS = { COMPLETED: 0, PENDING: 0, BOOKED: 0, CANCELLED: 0 };

const safeParseUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const pct = (n, total) => (total ? Math.round((n / total) * 100) : 0);

/* ---- components outside ---- */
const StatCard = ({ title, value, sub, btnText, onClick }) => (
  <div className="col-12 col-md-4">
    <div className="card hospital-card p-3 btp-kpi">
      <div className="d-flex justify-content-between align-items-center gap-3">
        <div>
          <div className="text-muted" style={{ fontSize: 13 }}>
            {title}
          </div>
          <div className="fs-4 fw-bold">{value}</div>
          <small className="text-muted">{sub}</small>
        </div>

        <button
          className="btn btn-sm btn-outline-primary px-3"
          onClick={onClick}
          style={{ flex: "0 0 auto", whiteSpace: "nowrap" }}
          type="button"
        >
          {btnText}
        </button>
      </div>
    </div>
  </div>
);

const BarRow = ({ label, count, percent, barClass }) => (
  <div className="btp-bar-row">
    <div className="btp-bar-left">
      <div className="btp-bar-label">{label}</div>
      <div className="text-muted btp-bar-sub">
        {count} • {percent}%
      </div>
    </div>

    <div className="progress btp-progress">
      <div
        className={`progress-bar ${barClass}`}
        style={{ width: `${percent}%` }}
      />
    </div>
  </div>
);

const HospitalDashboard = () => {
  const navigate = useNavigate();

  const user = safeParseUser();
  const hospitalId = user?.hospitalId;

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [stats, setStats] = useState({
    slots: 0,
    todayAppointments: 0,
    vaccines: 0,
  });

  const [statusCounts, setStatusCounts] = useState(EMPTY_COUNTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!hospitalId) return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    try {
      const [slotsRes, todayRes, vaccinesRes] = await Promise.allSettled([
        fetch(
          `${API}/hospital/slots?hospitalId=${hospitalId}&date=${todayISO}`,
          {
            signal: controller.signal,
          },
        ),
        fetch(`${API}/hospital/appointments/hospital/${hospitalId}/today`, {
          signal: controller.signal,
        }),
        fetch(`${API}/hospital/vaccines`, { signal: controller.signal }),
      ]);

      const slots =
        slotsRes.status === "fulfilled" && slotsRes.value.ok
          ? (await slotsRes.value.json()).length
          : 0;

      let todayAppointments = 0;
      const counts = { ...EMPTY_COUNTS };

      if (todayRes.status === "fulfilled" && todayRes.value.ok) {
        const list = await todayRes.value.json();
        const arr = Array.isArray(list) ? list : [];
        todayAppointments = arr.length;

        for (const a of arr) {
          const s = a?.status;
          if (s && Object.prototype.hasOwnProperty.call(counts, s))
            counts[s] += 1;
        }
      }

      const vaccines =
        vaccinesRes.status === "fulfilled" && vaccinesRes.value.ok
          ? (await vaccinesRes.value.json()).length
          : 0;

      setStats({ slots, todayAppointments, vaccines });
      setStatusCounts(counts);
    } catch (e) {
      if (e?.name !== "AbortError") setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [hospitalId, todayISO]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const total = stats.todayAppointments || 0;

  const donutStyle = {
    "--p1": pct(statusCounts.COMPLETED, total),
    "--p2": pct(statusCounts.PENDING, total),
    "--p3": pct(statusCounts.BOOKED, total),
    "--p4": pct(statusCounts.CANCELLED, total),
  };

  if (!hospitalId) {
    return (
      <div className="p-3">
        <div className="alert alert-warning mb-0">
          Hospital not linked. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <div className="btp-dashboard-header mb-3">
        <div>
          <h5 className="mb-0 fw-bold">Overview</h5>
          <small className="text-muted">
            Quick access to hospital operations
          </small>
        </div>

        <button
          type="button"
          className="btn btn-sm btn-outline-secondary px-3 btp-refresh-btn"
          onClick={fetchStats}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Quick Actions (ALL PRIMARY STYLE) */}
      <div className="card hospital-card p-3 mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
          <h6 className="mb-0 fw-bold">Quick Actions</h6>
          <small className="text-muted">Common hospital tasks</small>
        </div>

        <div className="btp-quick-actions-primary">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospital/slots")}
          >
            Add / Edit Slots
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospital/appointments")}
          >
            Manage Appointments
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospital/vaccines")}
          >
            View Vaccines
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospital/vaccination-records")}
          >
            Vaccination Records
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/hospital/reports")}
          >
            Reports
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* KPI cards */}
      <div className="row g-3">
        <StatCard
          title="Slots (Today)"
          value={stats.slots}
          sub={todayISO}
          btnText="Manage"
          onClick={() => navigate("/hospital/slots")}
        />
        <StatCard
          title="Appointments (Today)"
          value={stats.todayAppointments}
          sub="Today"
          btnText="View"
          onClick={() => navigate("/hospital/appointments")}
        />
        <StatCard
          title="Vaccines"
          value={stats.vaccines}
          sub="All"
          btnText="View"
          onClick={() => navigate("/hospital/vaccines")}
        />
      </div>

      {/* Chart Card */}
      <div className="card hospital-card p-3 mt-3">
        <div className="btp-card-head">
          <div>
            <h6 className="mb-0">Today's Appointment Status</h6>
            <small className="text-muted">
              Distribution of today’s appointments (Total: {total})
            </small>
          </div>

          <button
            className="btn btn-sm btn-outline-secondary px-3 btp-refresh-btn"
            onClick={fetchStats}
            disabled={loading}
            type="button"
          >
            {loading ? "Refreshing..." : "Refresh Chart"}
          </button>
        </div>

        <div className="row g-3 align-items-center mt-2">
          {/* Donut */}
          <div className="col-12 col-lg-4 d-flex justify-content-center">
            <div className="btp-donut" style={donutStyle}>
              <div className="btp-donut-center">
                <div className="fw-bold" style={{ fontSize: 20 }}>
                  {total}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  total
                </div>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="col-12 col-lg-8">
            <div className="btp-legend mb-3">
              <div className="btp-legend-item">
                <span className="btp-dot btp-dot-success" />
                <div className="d-flex justify-content-between w-100">
                  <span>Completed</span>
                  <span className="text-muted">
                    {statusCounts.COMPLETED} (
                    {pct(statusCounts.COMPLETED, total)}%)
                  </span>
                </div>
              </div>

              <div className="btp-legend-item">
                <span className="btp-dot btp-dot-warning" />
                <div className="d-flex justify-content-between w-100">
                  <span>Pending</span>
                  <span className="text-muted">
                    {statusCounts.PENDING} ({pct(statusCounts.PENDING, total)}%)
                  </span>
                </div>
              </div>

              <div className="btp-legend-item">
                <span className="btp-dot btp-dot-primary" />
                <div className="d-flex justify-content-between w-100">
                  <span>Booked</span>
                  <span className="text-muted">
                    {statusCounts.BOOKED} ({pct(statusCounts.BOOKED, total)}%)
                  </span>
                </div>
              </div>

              <div className="btp-legend-item">
                <span className="btp-dot btp-dot-danger" />
                <div className="d-flex justify-content-between w-100">
                  <span>Cancelled</span>
                  <span className="text-muted">
                    {statusCounts.CANCELLED} (
                    {pct(statusCounts.CANCELLED, total)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div className="btp-bars">
              <BarRow
                label="Completed"
                count={statusCounts.COMPLETED}
                percent={pct(statusCounts.COMPLETED, total)}
                barClass="bg-success"
              />
              <BarRow
                label="Pending"
                count={statusCounts.PENDING}
                percent={pct(statusCounts.PENDING, total)}
                barClass="bg-warning"
              />
              <BarRow
                label="Booked"
                count={statusCounts.BOOKED}
                percent={pct(statusCounts.BOOKED, total)}
                barClass="bg-primary"
              />
              <BarRow
                label="Cancelled"
                count={statusCounts.CANCELLED}
                percent={pct(statusCounts.CANCELLED, total)}
                barClass="bg-danger"
              />
            </div>

            {total === 0 && (
              <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                No appointments found for today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
