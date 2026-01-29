import SectionWrapper from "./SectionWrapper";
import "./PrecautionDose.css";
import Vaccine_dose from "../../assets/Precaution_dose.svg";

export default function PrecautionDose() {
    return (
        <SectionWrapper bg>
            <div id="book-slot" className="col-md-6 d-flex flex-column justify-content-center">

                <h2 className="section-title mb-2 fw-bold text-start">
                    Free Booster & Follow-up Vaccines
                </h2>

                <p className="text-muted mt-2 mb-3">
                    Eligible citizens can now receive booster or follow-up doses
                    at government vaccination centers at no cost, helping maintain
                    strong immunity against various preventable diseases.
                </p>

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

                <div className="d-flex gap-2 flex-wrap">
                    <button className="btn btn-precaution rounded-pill px-4">
                        Book Your Slot
                    </button>

                    <a
                        href="#find-center"
                        className="btn secondary-btn rounded-pill px-4"
                    >
                        Find Nearby Centers
                    </a>
                </div>

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
