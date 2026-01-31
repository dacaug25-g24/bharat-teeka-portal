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
import ForgotPassword from "../pages/ForgotPassword";

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
import AdminRoutes from "../pages/admin/AdminRoutes";
import UserRoutes from "../pages/user/UserRoutes";

const LANDING_ONLY = ["/login", "/register", "/forgot-password"];

const AppRoutes = () => {
  const { pathname } = useLocation();

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isAuthed = !!token && !!user;

  // ✅ Rule:
  // - Always show LandingNavbar on login/register/forgot
  // - Else if logged-in => show AppNavbar (even on "/")
  // - Else show LandingNavbar
  const showLandingNavbar = LANDING_ONLY.includes(pathname) || !isAuthed;

  return (
    <>
      {showLandingNavbar ? <LandingNavbar /> : <AppNavbar />}

      <Routes>
        {/* Public */}
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
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/raise-issue" element={<RaiseIssue />} />
        <Route path="/support" element={<Support />} />
        <Route path="/side-effects" element={<SideEffects />} />
        <Route path="/get-certificate" element={<GetCertificate />} />

        {/* Protected */}
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

        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <UserRoutes />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
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