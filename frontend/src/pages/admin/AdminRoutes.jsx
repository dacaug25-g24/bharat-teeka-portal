import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./dashboard/AdminDashboard";

// Existing
import ManageHospital from "./components/ManageHospital";

// New pages
import ManageProfile from "./components/ManageProfile";
import ManageVaccine from "./components/ManageVaccine";
import ManageUsers from "./components/ManageUsers";
import ApprovedHospitals from "./components/ApprovedHospitals";
import Reports from "./components/Reports";
import AddVaccine from "./components/AddVaccine";
import EditVaccine from "./components/EditVaccine";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* Layout route */}
      <Route path="/" element={<AdminDashboard />}>
        
        {/* ✅ DEFAULT: show profile immediately */}
        <Route index element={<ManageProfile />} />

        {/* Existing routes (unchanged) */}
        <Route path="dashboard" element={<div className="card p-4">Admin Dashboard Home</div>} />
        <Route path="hospitals" element={<ManageHospital />} />

        <Route path="profile" element={<ManageProfile />} />
        <Route path="manage-vaccines" element={<ManageVaccine />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="approved-hospitals" element={<ApprovedHospitals />} />
        <Route path="reports" element={<Reports />} />

        <Route path="add-vaccine" element={<AddVaccine />} />
        <Route path="update-vaccine/:id" element={<EditVaccine />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
