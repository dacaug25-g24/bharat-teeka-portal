import SectionWrapper from "./SectionWrapper";
import "./ChildrenVaccination.css";

import ChildrenVaccinationimg from "../../assets/Children_Vaccination.svg";

export default function ChildrenVaccination() {
    return (
        <SectionWrapper>
            <div className="col-md-6 d-flex flex-column justify-content-center">

                <h2 className="section-title mb-2 fw-bold text-start">
                    Children Vaccination
                </h2>

                <p className="text-muted mb-3">
                    Safe and government-approved vaccines are available for children to provide
                    protection against preventable diseases.
                </p>

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

                {/* Buttons like PrecautionDose */}
                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-precaution rounded-pill px-4">
                        Book Your Slot
                    </button>
                    <button className="btn rounded-pill px-4 secondary-btn">
                        Find Nearby Centers
                    </button>
                </div>

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
