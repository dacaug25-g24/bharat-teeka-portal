import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import emblemGov from "../../assets/emblem-gov.svg";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal py-2 shadow-sm">
      <div className="container-fluid px-4">

        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
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
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#landingNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav mx-auto gap-3 align-items-center">

            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/find-center">Find Center</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/book-slot">Book Slot</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/download-certificate">Download Certificate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">FAQ</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

          <Link className="btn btn-register px-4 ms-2" to="/login">
            Sign In
          </Link>
          <Link className="btn btn-register px-4 ms-2" to="/register">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}