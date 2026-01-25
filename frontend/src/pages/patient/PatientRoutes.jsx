import { Routes, Route, Navigate } from "react-router-dom";
import PatientDashboard from "./dashboard/PatientDashboard";
import BookAppointment from "./components/BookAppointment";

// Dashboard panel component
function DashboardPanel() {
  return (
    <div className="patient-info-panel">
      <h5>Patient Dashboard</h5>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}

export default function PatientRoutes() {
  return (
    <Routes>
      {/* Parent route for patient */}
      <Route path="/" element={<PatientDashboard />}>

        {/* Default dashboard when /patient is accessed */}
        <Route index element={<DashboardPanel />} />

        {/* Explicit dashboard route */}
        <Route path="dashboard" element={<DashboardPanel />} />

        {/* Book Appointment */}
        <Route path="book-appointment" element={<BookAppointment />} />

      </Route>

      {/* Redirect unknown /patient/* paths to dashboard */}
      <Route path="*" element={<Navigate to="/patient/dashboard" replace />} />
    </Routes>
  );
}
