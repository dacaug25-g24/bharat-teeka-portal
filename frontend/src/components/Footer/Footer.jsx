import { Link } from "react-router-dom";
import emblemGov from "../../assets/emblem-gov.svg";
import "./Footer.css";
export default function Footer() {
  return (
    <footer className="footer-main mt-5 pt-5 pb-3">
      <div className="container">
        <div className="row gy-4">

          <div className="col-md-4">
            <div className="d-flex align-items-center mb-3">
              <img
                src={emblemGov}
                alt="Government emblem"
                className="brand-pill me-2"
              />
              <div>
                <h5 className="mb-1">Bharat Teeka Portal</h5>
                <p className="small text-footer-muted mb-0">
                  Towards Healthy Bharat.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">CoWIN</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/about">About</Link>              </li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/help">Help</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Services</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/download-certificate">Certificate</Link></li>
              <li><Link to="/book-slot">Book Slot</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Support</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/raise-issue">Raise Issue</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="col-md-2">
            <h6 className="footer-heading">Connect</h6>
            <div className="d-flex gap-2 mb-2">
              <a href="#" className="footer-social">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="footer-social">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="footer-social">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
            <p className="small text-footer-muted mb-0">
              Stay updated with latest vaccination news.
            </p>
          </div>
        </div>

        <hr className="border-footer mt-4 mb-3" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small text-footer-muted mb-2 mb-md-0">
            © {new Date().getFullYear()} Bharat Teeka Portal. All rights reserved.
          </p>
          <div className="d-flex gap-3 small text-footer-muted">
            <span>Terms of Use</span>
            <span>Accessibility</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
