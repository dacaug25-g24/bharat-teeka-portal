import SectionWrapper from "./SectionWrapper";
import "./DownloadCertificate.css";

import CertificateImg from "../../assets/Date_Correction.svg";
import Footer from "../Footer/Footer";
import { Link } from "react-router-dom";

export default function DownloadCertificate({ showFooter = false }) {
    return (
        <>
            <SectionWrapper bg>
                <div id="download-certificate" className="col-md-6 text-center order-md-1">
                    <img
                        src={CertificateImg}
                        className="hero-img certificate-img"
                        alt="Download Certificate"
                    />
                </div>

                <div className="col-md-6 d-flex flex-column justify-content-center order-md-2">
                    <h2 className="section-title mb-2 fw-bold text-start">
                        Download Vaccination Certificate
                    </h2>

                    <p className="text-muted mb-3">
                        Access and download your official vaccination certificate instantly.
                        Keep it for travel, employment, or any official verification purposes.
                    </p>

                    <div className="certificate-steps mb-4">
                        <div className="step-item">
                            <div className="step-number">1</div>
                            <div>
                                <h6 className="fw-semibold mb-1">Login</h6>
                                <p className="small text-muted mb-0">
                                    Enter your registered details securely
                                </p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">2</div>
                            <div>
                                <h6 className="fw-semibold mb-1">Verify Your Vaccination</h6>
                                <p className="small text-muted mb-0">
                                    Check your records and ensure all details are correct
                                </p>
                            </div>
                        </div>

                        <div className="step-item">
                            <div className="step-number">3</div>
                            <div>
                                <h6 className="fw-semibold mb-1">Download Certificate</h6>
                                <p className="small text-muted mb-0">
                                    Save the official certificate as a PDF
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Buttons like PrecautionDose */}
                    <div className="d-flex gap-3 w-100">
                        <Link to="/get-certificate" className="flex-fill text-decoration-none">
                            <button className="btn btn-precaution rounded-pill w-100">
                                Download Now
                            </button>
                        </Link>

                        <Link to="/faq" className="flex-fill text-decoration-none">
                            <button className="btn secondary-btn rounded-pill w-100">
                                View FAQ
                            </button>
                        </Link>
                    </div>
                </div>
            </SectionWrapper>

            {showFooter && <Footer />}
        </>
    );
}
