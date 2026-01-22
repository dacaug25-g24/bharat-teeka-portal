import { Link } from "react-router-dom";
import "./FloatingHelp.css";

export default function FloatingHelp() {
  return (
    <Link
      to="/support"
      className="btn btn-success shadow-lg position-fixed d-flex align-items-center floating-help-btn"
    >
      <i className="bi bi-telephone-fill me-2"></i>
      Support
    </Link>
  );
}
