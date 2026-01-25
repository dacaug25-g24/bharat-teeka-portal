import "./Dashboard.css";
import Footer from "../../../components/Footer/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="admin-page">
      <div className="admin-body">

        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <h3 className="sidebar-title">
            Bharat<span className="text-warning">Teeka</span>
          </h3>

          <ul className="sidebar-menu list-unstyled">
            <li
              className={
                location.pathname === "/admin" ||
                location.pathname === "/admin/dashboard"
                  ? "active"
                  : ""
              }
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </li>

            <li
              className={
                location.pathname === "/admin/hospitals" ? "active" : ""
              }
              onClick={() => navigate("/admin/hospitals")}
            >
              Hospital Management
            </li>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="admin-main">
          <header className="admin-topbar">
            <small>
              Welcome,{" "}
              <span className="admin-name text-warning">
                {user?.username}
              </span>
            </small>

            <button
              className="logout-btn btn btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          <div className="admin-content container-fluid py-4">
            <Outlet />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
