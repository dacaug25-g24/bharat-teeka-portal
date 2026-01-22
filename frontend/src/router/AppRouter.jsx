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

const AppRoutes = () => {
  const { pathname } = useLocation();

  return (
    <>
      {/* Navbar Logic */}
      {pathname === "/" ? <LandingNavbar /> : <AppNavbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/find-center" element={<HeroSearch />} />
        <Route path="/book-slot" element={<BookSlot />} />
        <Route path="/download-certificate" element={<DownloadCertificate />} />
        <Route path="/faq" element={<Faq />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/help" element={<Help />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/raise-issue" element={<RaiseIssue />} />
        <Route path="/support" element={<Support />} />
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
