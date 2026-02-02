import Footer from "../Footer/Footer";
import AppNavbar from "../Navbar/AppNavbar";

export default function SideEffects() {
    return (
        <>
            <div className="container pt-4 pb-4">
        {/* Page Header */}
        <h3 className="fw-bold mb-2">Vaccine Side Effects</h3>
        <p className="text-muted mb-4">
          Vaccines are generally safe and effective. Most side effects are mild
          and temporary. This page provides general awareness about possible
          side effects after vaccination.
        </p>

        {/* Mild Side Effects */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success-subtle fw-semibold">
            Common (Mild) Side Effects
          </div>
          <div className="card-body">
            <ul className="mb-0">
              <li>Pain, redness, or swelling at the injection site</li>
              <li>Mild fever</li>
              <li>Tiredness or fatigue</li>
              <li>Headache</li>
              <li>Muscle or joint pain</li>
            </ul>
          </div>
        </div>

        {/* Moderate Side Effects */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-warning-subtle fw-semibold">
            Less Common (Moderate) Side Effects
          </div>
          <div className="card-body">
            <ul className="mb-0">
              <li>High fever (above 101°F / 38.5°C)</li>
              <li>Chills</li>
              <li>Nausea or vomiting</li>
              <li>Swollen lymph nodes</li>
              <li>Temporary weakness or dizziness</li>
            </ul>
          </div>
        </div>

        {/* Severe Side Effects */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-danger-subtle fw-semibold">
            Rare (Severe) Side Effects
          </div>
          <div className="card-body">
            <ul className="mb-0">
              <li>Severe allergic reaction (difficulty breathing)</li>
              <li>Persistent chest pain</li>
              <li>Severe headache with blurred vision</li>
              <li>Swelling of face or throat</li>
            </ul>

            <div className="alert alert-danger mt-3 mb-0">
              <strong>Important:</strong> Seek immediate medical attention if
              any severe symptoms occur.
            </div>
          </div>
        </div>

        {/* When to Contact Doctor */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-info-subtle fw-semibold">
            When Should You Contact a Doctor?
          </div>
          <div className="card-body">
            <ul className="mb-0">
              <li>Fever lasts more than 48 hours</li>
              <li>Severe pain or swelling does not reduce</li>
              <li>Any unusual or worsening symptoms</li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="alert alert-secondary mb-0">
          <strong>Disclaimer:</strong> This information is for awareness only
          and does not replace professional medical advice. Always consult a
          healthcare provider if you have concerns after vaccination.
        </div>
      </div>

      <Footer />
    </>
  );
}