import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin-ui.css";

//  OPTION B: HTTP runs on 5225
const API = import.meta.env.VITE_ADMIN_API || "http://localhost:5225";
const TOKEN_KEY = "token";
const USER_KEY = "user";

/* ---------------- COUNT UP HOOK ---------------- */
function useCountUp(value, duration = 300) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current ?? 0;
    const end = Number(value ?? 0);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const startTime = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  return display;
}

/* ---------------- REPORTS COMPONENT ---------------- */
export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthErrors = (error, fallbackMsg) => {
    const status = error?.response?.status;

    if (status === 401) {
      alert("Unauthorized (401): Please login again. Token missing/expired.");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      navigate("/login", { replace: true });
      return true;
    }

    if (status === 403) {
      alert("Forbidden (403): You are not ADMIN or role claim mismatch.");
      return true;
    }

    alert(error?.response?.data || fallbackMsg);
    return false;
  };

  const fetchReport = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await axios.get(`${API}/api/admin/userreport`, {
        headers: getAuthHeaders(),
      });
      setReport(res.data || null);
    } catch (e) {
      console.error(e);
      handleAuthErrors(e, "Failed to load report");
      setReport(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Animated values
  const totalUsers = useCountUp(report?.totalUsers ?? 0);
  const activeUsers = useCountUp(report?.activeUsers ?? 0);
  const inactiveUsers = useCountUp(report?.inactiveUsers ?? 0);
  const totalPatients = useCountUp(report?.totalPatients ?? 0);
  const totalHospitals = useCountUp(report?.totalHospitals ?? 0);

  const cards = useMemo(
    () => [
      { label: "Total Users", value: totalUsers, icon: "👥", accent: "blue" },
      {
        label: "Active Users",
        value: activeUsers,
        icon: "",
        accent: "green",
      },
      {
        label: "Inactive Users",
        value: inactiveUsers,
        icon: "⏸️",
        accent: "orange",
      },
      {
        label: "Total Patients",
        value: totalPatients,
        icon: "🧑‍⚕️",
        accent: "purple",
      },
      {
        label: "Total Hospitals",
        value: totalHospitals,
        icon: "🏥",
        accent: "teal",
      },
    ],
    [totalUsers, activeUsers, inactiveUsers, totalPatients, totalHospitals],
  );

  if (loading) {
    return (
      <div className="admin-loading2">
        <div className="spinner-border spinner-border-sm" role="status" />
        <span className="text-muted">Loading report...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="alert alert-light border mb-0">
        No report data.
        <button
          className="btn btn-sm btn-outline-secondary ms-2"
          onClick={() => fetchReport(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Retry"}
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div className="admin-header admin-reports-head">
        <div>
          <h4 className="admin-title2 mb-1">Reports</h4>
          <div className="admin-subtitle2">System overview</div>
        </div>

        <button
          className="btn btn-primary admin-add2"
          onClick={() => fetchReport(true)}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "↻ Refresh"}
        </button>
      </div>

      {/* Cards */}
      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-12 col-sm-6 col-lg-4" key={c.label}>
            <div
              className={`card admin-stat-card border-0 h-100 accent-${c.accent}`}
            >
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <div className="text-muted small">{c.label}</div>
                  <div className="fs-2 fw-bold mt-1">{c.value}</div>
                  <div className="admin-stat-sub">
                    {refreshing ? "Updating..." : "Updated from server"}
                  </div>
                </div>

                <div className="admin-stat-icon">{c.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-info mt-3">
        <div className="small">
          Tip: Click <b>Refresh</b> to load the latest counts with animation.
        </div>
      </div>
    </div>
  );
}
