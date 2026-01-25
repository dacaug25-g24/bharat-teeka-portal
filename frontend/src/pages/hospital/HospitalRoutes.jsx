import { Routes, Route, Navigate } from "react-router-dom";
import HospitalDashboard from "./dashboard/HospitalDashboard";
import ManageSlot from "./components/ManageSlot";

// Dashboard panel component
function DashboardPanel() {
  return (
    <div className="hospital-info-panel">
      <h5>Hospital Dashboard</h5>
      <p>Welcome to the hospital dashboard.</p>
    </div>
  );
}

export default function HospitalRoutes() {
  return (
    <Routes>
      {/* Parent hospital route */}
      <Route path="/" element={<HospitalDashboard />}>

        {/* Default: show dashboard when /hospital is accessed */}
        <Route index element={<DashboardPanel />} />

        {/* Explicit dashboard path */}
        <Route path="dashboard" element={<DashboardPanel />} />

        {/* Manage slots */}
        <Route path="slots" element={<ManageSlot />} />

      </Route>

      {/* Redirect unknown /hospital/* paths to dashboard */}
      <Route path="*" element={<Navigate to="/hospital/dashboard" replace />} />
    </Routes>
  );
}
