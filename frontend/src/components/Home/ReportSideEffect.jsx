import SectionWrapper from "./SectionWrapper";
import "./ReportSideEffect.css";
import reportsaefi from "../../assets/reports-aefi.svg";

export default function SideEffectsInfo() {
    const commonSideEffects = [
        "Mild fever or chills",
        "Soreness at the injection site",
        "Headache or fatigue",
        "Muscle or joint pain",
        "Mild nausea"
    ];

    return (
        <SectionWrapper bg>
            <div className="col-md-6 text-center">
                <img
                    src={reportsaefi}
                    className="hero-img report-img"
                    alt="Common Side Effects"
                />
            </div>

            <div className="col-md-6 d-flex flex-column justify-content-center">

                <h3 className="section-title mb-2 fw-bold text-start">
                    Common Side Effects
                </h3>

                <p className="text-muted mb-3">
                    After vaccination, some people may experience mild, temporary side effects. These are usually normal and a sign that your body is building protection.
                </p>

                <ul className="list-unstyled report-list mb-3">
                    {commonSideEffects.map((effect, idx) => (
                        <li key={idx}>
                            <i className="bi bi-exclamation-circle me-2 text-teal"></i>
                            {effect}
                        </li>
                    ))}
                </ul>

                <p className="text-muted">
                    Most side effects resolve within a few days. If you experience anything severe or unusual, consult a healthcare professional.
                </p>

                <div className="flex-wrap gap-2">
                    <button className="btn rounded-pill px-4 secondary-btn">
                        View Common Side Effects
                    </button>
                </div>

            </div>
        </SectionWrapper>
    );
}
