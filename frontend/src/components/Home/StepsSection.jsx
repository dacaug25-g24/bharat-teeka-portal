import "./StepsSection.css";
import step1 from "../../assets/Step_1.svg";
import step2 from "../../assets/Step_2.svg";
import step3 from "../../assets/Step_3.svg";

export default function StepsSection() {
    return (
        <div className="container my-5">
            <h3 className="text-center fw-bold mb-4">How It Works</h3>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="step-card h-100 text-center p-4">
                        <div className="step-badge">Step 1</div>
                        <div className="step-image">
                            <img src={step1} alt="Register" />
                        </div>
                        <div className="step-body">
                            <h5 className="fw-bold mb-2">Register Yourself</h5>
                            <p className="text-muted mb-0">
                                Register yourself and set up a secure password.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="step-card h-100 text-center p-4">
                        <div className="step-badge">Step 2</div>
                        <div className="step-image">
                            <img src={step2} alt="Search Center" />
                        </div>
                        <div className="step-body">
                            <h5 className="fw-bold mb-2">Find the Center</h5>
                            <p className="text-muted mb-0">
                                Search centers by district and city.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="step-card h-100 text-center p-4">
                        <div className="step-badge">Step 3</div>
                        <div className="step-image">
                            <img src={step3} alt="Get Vaccinated" />
                        </div>
                        <div className="step-body">
                            <h5 className="fw-bold mb-2">Get Vaccinated</h5>
                            <p className="text-muted mb-0">
                                Visit the center on your scheduled date and get vaccinated safely.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
