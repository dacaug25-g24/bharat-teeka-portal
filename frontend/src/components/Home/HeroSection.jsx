import heroImg from "../../assets/independance.svg";
import "./HeroSection.css";

export default function HeroSection() {
    return (
        <div id="home" className="home-hero-section">
            <div className="container py-5">
                <div className="row align-items-center">

                    <div className="col-md-6">
                        <h1 className="display-6 fw-bold mb-4 text-dark">
                            Historic & Unparalleled Achievement!
                        </h1>

                        <h2 className="fw-semibold mb-4 text-primary">
                            India’s Glorious Journey of Vaccination
                        </h2>

                        <div className="p-3 bg-white shadow rounded highlight-box d-inline-flex align-items-center">
                            <span className="badge badge-vaccination me-3 d-inline-flex align-items-center">
                                <i className="bi bi-shield-check me-1"></i>
                            </span>
                            <span className="fs-4 fw-bold text-danger">
                                200 CRORE VACCINATIONS
                            </span>
                        </div>

                        <p className="mt-4 fst-italic text-secondary">
                            “Vaccination is one of the most effective ways to protect lives and strengthen public health.”
                            <br />– Government of India
                        </p>
                    </div>

                    <div className="col-md-6 text-center">
                        <img
                            src={heroImg}
                            alt="Vaccination Hero Visual"
                            className="img-fluid hero-image"
                        />
                    </div>

                </div>
            </div>
        </div>
    );
}
