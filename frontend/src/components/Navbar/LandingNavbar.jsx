import { Link } from "react-router-dom";
import emblemGov from "../../assets/emblem-gov.svg";
import "./Navbar.css";

export default function LandingNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal py-2 shadow-sm">
      <div className="container-fluid px-4">

        <a className="navbar-brand fw-bold d-flex align-items-center" href="#home">
          <img
            src={emblemGov}
            alt="Government emblem"
            className="brand-pill me-2"
          />
          <div className="d-flex flex-column">
            <span className="brand-title">
              Bharat<span className="text-warning"> Teeka </span>Portal
            </span>
            <span className="brand-subtitle">Towards Healthy Bharat</span>
          </div>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#landingNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="landingNavbar">
          <ul className="navbar-nav mx-auto gap-3 align-items-center">

            <li className="nav-item">
              <a className="nav-link" href="#home">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#find-center">Find Center</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#book-slot">Book Slot</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#download-certificate">Download Certificate</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#faq">FAQ</a>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

          <a className="btn btn-register px-4 ms-2" href="/login">
            Sign In
          </a>
          <a className="btn btn-register px-4 ms-2" href="/register">
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}
