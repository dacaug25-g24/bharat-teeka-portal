import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./dashboard/AdminDashboard";
import ManageHospital from "./components/ManageHospital";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />}>

        <Route index element={<Navigate to="dashboard" />} />

        <Route
          path="dashboard"
          element={
            <div className="user-info-panel">
              <h5>Your Information</h5>
              <p>Welcome to the admin dashboard.</p>
            </div>
          }
        />

        <Route
          path="hospitals"
          element={<ManageHospital />}
        />

      </Route>
    </Routes>
  );
}
