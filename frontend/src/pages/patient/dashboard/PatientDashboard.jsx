import "./PatientDashboard.css";
import Footer from "../../../components/Footer/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="patient-page">
      <div className="patient-body">

        {/* SIDEBAR */}
        <aside className="patient-sidebar">
          <h3 className="sidebar-title">
            Bharat<span className="text-warning">Teeka</span>
          </h3>

          <ul className="sidebar-menu list-unstyled">
            <li
              className={
                location.pathname === "/patient" ||
                location.pathname.startsWith("/patient/dashboard")
                  ? "active"
                  : ""
              }
              onClick={() => navigate("/patient/dashboard")}
            >
              Dashboard
            </li>

            <li
              className={location.pathname === "/patient/book-appointment" ? "active" : ""}
              onClick={() => navigate("/patient/book-appointment")}
            >
              Book Appointment
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="patient-main">

          {/* TOP BAR */}
          <header className="patient-topbar">
            <small>
              Welcome,{" "}
              <span className="patient-name text-warning">{user?.username}</span>
            </small>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* PAGE CONTENT */}
          <div className="patient-content container-fluid py-4">
            <Outlet />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
