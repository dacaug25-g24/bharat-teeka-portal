import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SectionWrapper from "./SectionWrapper";
import "./ChildrenVaccination.css";

import ChildrenVaccinationimg from "../../assets/Children_Vaccination.svg";

export default function ChildrenVaccination() {
  const navigate = useNavigate();
  const [showLoginMsg, setShowLoginMsg] = useState(false);

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
      navigate(DASHBOARD_PATH);
      return;
    }

    setShowLoginMsg(true);
    setTimeout(() => setShowLoginMsg(false), 2500);
  };

  return (
    <SectionWrapper>
      <div className="col-md-6 d-flex flex-column justify-content-center">
        <h2 className="section-title mb-2 fw-bold text-start">
          Children Vaccination
        </h2>

        <p className="text-muted mb-3">
          Safe and government-approved vaccines are available for children to
          provide protection against preventable diseases.
        </p>

        {/* warning */}
        {showLoginMsg && (
          <div className="alert alert-warning d-flex align-items-center gap-2 py-2">
            <span className="fw-semibold">Login first</span>
            <span className="text-muted">to book a slot for your child.</span>
          </div>
        )}

        <div className="vaccine-grid mb-4">
          <div className="vaccine-card">
            <div className="vaccine-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h6 className="fw-semibold mb-1">BCG</h6>
            <p className="small text-muted mb-0">Birth</p>
          </div>

          <div className="vaccine-card">
            <div className="vaccine-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h6 className="fw-semibold mb-1">DTaP / DTP</h6>
            <p className="small text-muted mb-0">6 weeks – 6 years</p>
          </div>

          <div className="vaccine-card">
            <div className="vaccine-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h6 className="fw-semibold mb-1">MMR</h6>
            <p className="small text-muted mb-0">9 months – 15 years</p>
          </div>

          <div className="vaccine-card">
            <div className="vaccine-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <h6 className="fw-semibold mb-1">Polio (OPV/IPV)</h6>
            <p className="small text-muted mb-0">Birth – 5 years</p>
          </div>
        </div>

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
            Tip: Login to manage beneficiaries and book child vaccination slots.
          </p>
        )}
      </div>

      <div className="col-md-6 text-center">
        <img
          src={ChildrenVaccinationimg}
          className="hero-img children-img"
          alt="Children Vaccination"
        />
      </div>
    </SectionWrapper>
  );
}
