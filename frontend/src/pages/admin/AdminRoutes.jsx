import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./dashboard/AdminDashboard";

// Admin pages
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
      {/* Layout */}
      <Route path="/" element={<AdminDashboard />}>
        {/* Default */}
        <Route index element={<ManageProfile />} />

        {/* Pages */}
        <Route path="profile" element={<ManageProfile />} />
        <Route path="manage-vaccines" element={<ManageVaccine />} />
        <Route path="manage-users" element={<ManageUsers />} />
        <Route path="approved-hospitals" element={<ApprovedHospitals />} />
        <Route path="reports" element={<Reports />} />

        <Route path="add-vaccine" element={<AddVaccine />} />
        <Route path="update-vaccine/:id" element={<EditVaccine />} />

        {/* Fallback inside /admin */}
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}
