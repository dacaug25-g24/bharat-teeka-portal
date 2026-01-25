import { Routes, Route, Navigate } from "react-router-dom";
import ParentDashboard from "./dashboard/ParentDashboard";
import BookAppointment from "./components/BookAppointment"; // shared component

// Dashboard panel component
function DashboardPanel() {
  return (
    <div className="parent-info-panel">
      <h5>Parent Dashboard</h5>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

export default function ParentRoutes() {
  return (
    <Routes>
      {/* Parent dashboard as parent route */}
      <Route path="/" element={<ParentDashboard />}>

        {/* Default dashboard when /parent is accessed */}
        <Route index element={<DashboardPanel />} />

        {/* Explicit dashboard route */}
        <Route path="dashboard" element={<DashboardPanel />} />

        {/* Book Appointment (shared component) */}
        <Route path="book-appointment" element={<BookAppointment />} />

      </Route>

      {/* Redirect unknown /parent/* paths to dashboard */}
      <Route path="*" element={<Navigate to="/parent/dashboard" replace />} />
    </Routes>
  );
}
