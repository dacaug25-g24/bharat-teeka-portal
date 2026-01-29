import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboardLayout from "./dashboard/UserDashboardLayout";

import UserDashboardHome from "./components/UserDashboardHome";
import BookAppointment from "./components/BookAppointment";
import AddBeneficiary from "./components/AddBeneficiary";
import History from "./components/History";
import Profile from "./components/Profile";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserDashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboardHome />} />
        <Route path="book-appointment" element={<BookAppointment />} />
        <Route path="beneficiaries" element={<AddBeneficiary />} />
        <Route path="history" element={<History />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
