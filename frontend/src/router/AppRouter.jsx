import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CreateAccount from "../pages/registration/CreateAccount";
import PersonalInfo from "../pages/registration/PersonalInfo";
import About from "../components/Footer/About";
import PrivacyPolicy from "../components/Footer/PrivacyPolicy";
import Help from "../components/Footer/Help";
import Contact from "../pages/Contact";
import RaiseIssue from "../pages/RaiseIssue";
import Support from "../pages/Support";
import BookSlot from "../pages/BookSlot";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import HospitalDashboard from "../pages/dashboard/HospitalDashboard";
import PatientDashboard from "../pages/dashboard/PatientDashboard";
import ParentDashboard from "../pages/dashboard/ParentDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const AppRoutes = () => {
  const location = useLocation();
  
  // Hide navbar on these pages
  const hideNavbar = ["/login", "/register", "/create-account", "/personal-info"].includes(location.pathname);
  
  // Hide footer on these pages
  const hideFooter = ["/login", "/register", "/create-account", "/personal-info"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/personal-info" element={<PersonalInfo />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/raise-issue" element={<RaiseIssue />} />
        <Route path="/support" element={<Support />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/download-certificate" element={<Home />} />
        <Route path="/find-center" element={<Home />} />
        <Route path="/faq" element={<Home />} />
        
        {/* Protected Dashboard Routes */}
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
      {!hideFooter && <Footer />}
    </>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default AppRouter;