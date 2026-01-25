import "./Dashboard.css";
import Footer from "../../../components/Footer/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function HospitalDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="hospital-page">
      <div className="hospital-body">

        {/* SIDEBAR */}
        <aside className="hospital-sidebar">
          <h3 className="sidebar-title">
            Bharat<span className="text-warning">Teeka</span>
          </h3>

          <ul className="sidebar-menu list-unstyled">
            <li
              className={
                location.pathname === "/hospital" ||
                location.pathname.startsWith("/hospital/dashboard")
                  ? "active"
                  : ""
              }
              onClick={() => navigate("/hospital/dashboard")}
            >
              Dashboard
            </li>

            <li
              className={location.pathname === "/hospital/slots" ? "active" : ""}
              onClick={() => navigate("/hospital/slots")}
            >
              Manage Slots
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="hospital-main">
          <header className="hospital-topbar">
            <small>
              Welcome,{" "}
              <span className="hospital-name text-warning">
                {user?.username}
              </span>
            </small>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <div className="hospital-content container-fluid py-4">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
