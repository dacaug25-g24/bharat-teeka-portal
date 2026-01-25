import "./ParentDashboard.css";
import Footer from "../../../components/Footer/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function ParentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="parent-page">
      <div className="parent-body">

        {/* SIDEBAR */}
        <aside className="parent-sidebar">
          <h3 className="sidebar-title">
            Bharat<span className="text-warning">Teeka</span>
          </h3>

          <ul className="sidebar-menu list-unstyled">
            <li
              className={
                location.pathname === "/parent" ||
                location.pathname.startsWith("/parent/dashboard")
                  ? "active"
                  : ""
              }
              onClick={() => navigate("/parent/dashboard")}
            >
              Dashboard
            </li>

            <li
              className={location.pathname === "/parent/book-appointment" ? "active" : ""}
              onClick={() => navigate("/parent/book-appointment")}
            >
              Book Appointment
            </li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="parent-main">

          {/* TOP BAR */}
          <header className="parent-topbar">
            <small>
              Welcome,{" "}
              <span className="parent-name text-warning">{user?.username}</span>
            </small>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* PAGE CONTENT */}
          <div className="parent-content container-fluid py-4">
            <Outlet />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
