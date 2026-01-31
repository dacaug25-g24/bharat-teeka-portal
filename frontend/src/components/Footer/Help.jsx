import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function Help() {
  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-teal text-center mb-3">Help</h1>
              <p className="text-muted text-center mb-4">
                Need assistance? Below are common help topics to get you started.
              </p>

              <div className="bg-white p-4 rounded-3 shadow-sm">
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <h6 className="mb-1 fw-semibold">How to Register</h6>
                    <p className="text-muted small mb-0">Create an account via the <Link to="/register">Register</Link> page and complete your profile.</p>
                  </li>

                  <li className="mb-3">
                    <h6 className="mb-1 fw-semibold">Booking a Slot</h6>
                    <p className="text-muted small mb-0">Find vaccination centres and book slots via <Link to="/book-slot">Book Slot</Link>.</p>
                  </li>

                  <li className="mb-3">
                    <h6 className="mb-1 fw-semibold">Download Certificates</h6>
                    <p className="text-muted small mb-0">Download your vaccination certificate from the <Link to="/download-certificate">Certificate</Link> page.</p>
                  </li>

                  <li className="mb-3">
                    <h6 className="mb-1 fw-semibold">Frequently Asked Questions</h6>
                    <p className="text-muted small mb-0">See common questions on our <Link to="/faq">FAQs</Link> page.</p>
                  </li>

                  <li>
                    <h6 className="mb-1 fw-semibold">Still need help?</h6>
                    <p className="text-muted small mb-0">Contact our support team via the <Link to="/contact">Contact Us</Link> page for further assistance.</p>
                  </li>
                </ul>
              </div>

              <p className="small text-muted text-center mt-3 mb-0">For urgent assistance, please refer to the official helpline numbers on the Contact page.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
