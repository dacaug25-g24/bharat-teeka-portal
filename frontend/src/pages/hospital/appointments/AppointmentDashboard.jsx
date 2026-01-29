import { useEffect, useMemo, useState } from "react";
import TodayAppointments from "./TodayAppointments";
import AllAppointments from "./AllAppointments";
import "./appointments.css";

const API = import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";

const AppointmentDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const hospitalId = user?.hospitalId;

  const [view, setView] = useState("today");
  const [totalSlots, setTotalSlots] = useState(0);
  const [vaccines, setVaccines] = useState([]);
  const [todayCount, setTodayCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("");

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const fetchSummary = async () => {
    try {
      if (!hospitalId) return;

      const slotsRes = await fetch(
        `${API}/hospital/slots?hospitalId=${hospitalId}&date=${todayISO}`,
      );
      if (slotsRes.ok) {
        const slotsData = await slotsRes.json();
        setTotalSlots(Array.isArray(slotsData) ? slotsData.length : 0);
      } else setTotalSlots(0);

      const vaccinesRes = await fetch(`${API}/hospital/vaccines`);
      if (vaccinesRes.ok) {
        const vaccinesData = await vaccinesRes.json();
        setVaccines(Array.isArray(vaccinesData) ? vaccinesData : []);
      } else setVaccines([]);

      const todayRes = await fetch(
        `${API}/hospital/appointments/hospital/${hospitalId}/today`,
      );
      if (todayRes.ok) {
        const todayData = await todayRes.json();
        setTodayCount(Array.isArray(todayData) ? todayData.length : 0);
      } else setTodayCount(0);
    } catch {
      // silent (same behavior)
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  const onClear = () => setDateFilter("");

  if (!hospitalId) {
    return (
      <div className="alert alert-warning mb-0">
        Hospital not linked. Please login again.
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="btp-page-title">Appointments Dashboard</div>

      {/* KPI row */}
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <div className="btp-kpi-mini">
            <div className="btp-kpi-label">Total Slots (Today)</div>
            <div className="btp-kpi-value">{totalSlots}</div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="btp-kpi-mini">
            <div className="btp-kpi-label">Today's Appointments</div>
            <div className="btp-kpi-value">{todayCount}</div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="btp-kpi-mini">
            <div className="btp-kpi-label">Vaccines Available</div>
            <div className="btp-kpi-value">{vaccines.length}</div>
          </div>
        </div>
      </div>

      {/* Filters + Tabs */}
      <div className="btp-filters">
        <div className="btp-filter-row">
          <div className="btp-filter-group">
            <label>Search by date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="btp-filter-actions">
            <button
              className="btn btn-outline-secondary"
              onClick={onClear}
              type="button"
            >
              Clear
            </button>

            <button
              className="btn btn-outline-primary"
              onClick={fetchSummary}
              type="button"
            >
              Refresh Summary
            </button>
          </div>
        </div>

        <div className="btp-tabs">
          <button
            className={`btp-tab ${view === "today" ? "active" : ""}`}
            onClick={() => setView("today")}
            type="button"
          >
            Today
          </button>

          <button
            className={`btp-tab ${view === "all" ? "active" : ""}`}
            onClick={() => setView("all")}
            type="button"
          >
            All
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-3">
        {view === "today" ? (
          <TodayAppointments hospitalId={hospitalId} dateFilter={dateFilter} />
        ) : (
          <AllAppointments hospitalId={hospitalId} dateFilter={dateFilter} />
        )}
      </div>
    </div>
  );
};

export default AppointmentDashboard;
