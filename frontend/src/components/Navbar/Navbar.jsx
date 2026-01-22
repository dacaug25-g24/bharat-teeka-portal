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
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

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
              <a className="nav-link" href="#contact">Contact Us</a>
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
