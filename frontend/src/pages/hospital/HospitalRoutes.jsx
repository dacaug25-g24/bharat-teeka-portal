import { Routes, Route, Navigate } from "react-router-dom";
import HospitalLayout from "./layout/HospitalLayout";
import HospitalDashboard from "./layout/HospitalDashboard";
import ManageSlot from "./slots/ManageSlot";
import AppointmentDashboard from "./appointments/AppointmentDashboard";
import VaccineList from "./vaccines/VaccineList";
import Reports from "./reports/Reports";
import VaccinationRecords from "./vaccinations/VaccinationRecords";

export default function HospitalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HospitalLayout />}>
        {/* Dashboard */}
        <Route index element={<HospitalDashboard />} />
        <Route path="dashboard" element={<HospitalDashboard />} />

        {/* Slots */}
        <Route path="slots" element={<ManageSlot />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentDashboard />} />

        {/* Vaccines */}
        <Route path="vaccines" element={<VaccineList />} />

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

        <Route path="vaccination-records" element={<VaccinationRecords />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/hospital/dashboard" replace />} />
    </Routes>
  );
}