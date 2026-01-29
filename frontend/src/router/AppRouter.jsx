import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import BookSlot from "../pages/BookSlot";
import Contact from "../pages/Contact";
import RaiseIssue from "../pages/RaiseIssue";
import Support from "../pages/Support";

import About from "../components/Footer/About";
import PrivacyPolicy from "../components/Footer/PrivacyPolicy";
import Help from "../components/Footer/Help";

import LandingNavbar from "../components/Navbar/LandingNavbar";
import AppNavbar from "../components/Navbar/AppNavbar";

import HeroSearch from "../components/Home/HeroSearch";
import DownloadCertificate from "../components/Home/DownloadCertificate";
import Faq from "../components/Home/Faq";
import SideEffects from "../components/Home/SideEffects";
import GetCertificate from "../components/Home/GetCertificate";

import ProtectedRoute from "../components/ProtectedRoute";
import HospitalRoutes from "../pages/hospital/HospitalRoutes";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import AdminRoutes from "../pages/admin/AdminRoutes";

import UserRoutes from "../pages/user/UserRoutes";

const AppRoutes = () => {
  const { pathname } = useLocation();

  return (
    <>
      {pathname === "/" ? <LandingNavbar /> : <AppNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-center" element={<HeroSearch showFooter />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route
          path="/download-certificate"
          element={<DownloadCertificate showFooter />}
        />
        <Route path="/faq" element={<Faq showFooter />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/raise-issue" element={<RaiseIssue />} />
        <Route path="/support" element={<Support />} />
        <Route path="/side-effects" element={<SideEffects />} />
        <Route path="/get-certificate" element={<GetCertificate />} />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospital/*"
          element={
            <ProtectedRoute>
              <HospitalRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/hospital/*"
          element={
            <ProtectedRoute>
              <HospitalRoutes />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserRoutes />
            </ProtectedRoute>
          }
        />

        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
