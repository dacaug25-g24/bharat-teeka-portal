import SectionWrapper from "./SectionWrapper";
import Footer from "../Footer/Footer";
import "./HeroSearch.css";

export default function HeroSearch({ showFooter = false }) {
    return (
        <>
            <SectionWrapper>
                <div id="find-center" className="col-12">
                    <div className="hero-search-card w-100 bg-white shadow-lg rounded-4 p-4 p-md-5">
                        <h1 className="section-title mb-3 text-center fw-bold">
                            Search Your Nearest Vaccination Center
                        </h1>

                        <p className="text-muted mb-4 mx-auto text-center hero-subtitle">
                            Get a preview list of nearest centers and check availability of
                            vaccination slots.
                        </p>

                        <div className="row g-3 align-items-center justify-content-center mt-1">
                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <select className="form-select form-select-lg rounded-3">
                                    <option>Select State</option>
                                </select>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-6">
                                <select className="form-select form-select-lg rounded-3">
                                    <option>Select City</option>
                                </select>
                            </div>

                            <div className="col-lg-3 col-md-4 col-sm-8">
                                <button className="btn btn-landing-search btn-lg w-100 rounded-pill shadow-sm">
                                    Search Centers
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {showFooter && <Footer />}
        </>
    );
}
