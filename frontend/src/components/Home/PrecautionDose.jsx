import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionWrapper from "./SectionWrapper";
import "./PrecautionDose.css";
import Vaccine_dose from "../../assets/Precaution_dose.svg";

export default function PrecautionDose() {
  const navigate = useNavigate();
  const [showLoginMsg, setShowLoginMsg] = useState(false);

  // Change this if your dashboard route is different
  const DASHBOARD_PATH = "/user";

  const isLoggedIn = useMemo(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) return false;

    try {
      const user = JSON.parse(userRaw);
      return Boolean(user?.userId);
    } catch {
      return false;
    }
  }, []);

  const handleBookSlotClick = (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      // logged in → go to dashboard (booking is inside dashboard)
      navigate(DASHBOARD_PATH);
      return;
    }

    // not logged in → show message
    setShowLoginMsg(true);
    setTimeout(() => setShowLoginMsg(false), 2500);
  };

  return (
    <SectionWrapper bg>
      <div
        id="book-slot"
        className="col-md-6 d-flex flex-column justify-content-center"
      >
        <h2 className="section-title mb-2 fw-bold text-start">
          Free Booster & Follow-up Vaccines
        </h2>

        <p className="text-muted mt-2 mb-3">
          Eligible citizens can now receive booster or follow-up doses at
          government vaccination centers at no cost, helping maintain strong
          immunity against various preventable diseases.
        </p>

        {/* Login warning message */}
        {showLoginMsg && (
          <div className="alert alert-warning d-flex align-items-center gap-2 py-2">
            <span className="fw-semibold">Login first</span>
            <span className="text-muted">to book your slot.</span>
          </div>
        )}

        <ul className="list-unstyled mb-3 precaution-list">
          <li>
            <i className="bi bi-shield-check me-2 text-teal"></i>
            Extra protection after your primary vaccination
          </li>
          <li>
            <i className="bi bi-geo-alt me-2 text-teal"></i>
            Available at nearby government centers
          </li>
          <li>
            <i className="bi bi-phone me-2 text-teal"></i>
            Digital vaccination certificate updated instantly
          </li>
        </ul>

        <div className="d-flex gap-3 w-100">
          <button
            className="btn btn-precaution rounded-pill flex-fill"
            onClick={handleBookSlotClick}
          >
            Book Your Slot
          </button>

          <a
            href="#find-center"
            className="btn secondary-btn rounded-pill flex-fill"
          >
            Find Nearby Centers
          </a>
        </div>

        {!isLoggedIn && (
          <p className="small text-muted mt-3 mb-0">
            Tip: Login to access your dashboard and book appointments easily.
          </p>
        )}
      </div>

      <div className="col-md-6 text-center">
        <img
          src={Vaccine_dose}
          className="hero-img precaution-img"
          alt="Booster Dose"
        />
      </div>
    </SectionWrapper>
  );
}
