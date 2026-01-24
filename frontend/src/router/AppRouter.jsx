import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

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
import ProtectedRoute from "../components/ProtectedRoute";

import CreateAccount from "../pages/registration/CreateAccount";
import PersonalInfo from "../pages/registration/PersonalInfo";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";
import HospitalDashboard from "../pages/hospital/dashboard/HospitalDashboard";
import PatientDashboard from "../pages/patient/dashboard/PatientDashboard";
import ParentDashboard from "../pages/patient/dashboard/ParentDashboard";


const AppRoutes = () => {
  const { pathname } = useLocation();

  return (
    <>
      {pathname === "/" ? <LandingNavbar /> : <AppNavbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-center" element={<HeroSearch showFooter />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/download-certificate" element={<DownloadCertificate showFooter />} />
        <Route path="/faq" element={<Faq showFooter />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/registration/create-account" element={<CreateAccount />} />
        <Route path="/registration/personal-info" element={<PersonalInfo />}/>

        <Route path="/raise-issue" element={<RaiseIssue />} />
        <Route path="/support" element={<Support />} />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hospital-dashboard" element={
          <ProtectedRoute>
            <HospitalDashboard />
          </ProtectedRoute>
        } />
        <Route path="/patient-dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/parent-dashboard" element={
          <ProtectedRoute>
            <ParentDashboard />
          </ProtectedRoute>
        } />
      </Routes>

    </>
  );
};

const AppRouter = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default AppRouter;
