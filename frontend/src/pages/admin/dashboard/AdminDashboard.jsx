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

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className="admin-page">
      <div className="admin-body">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <h3 className="sidebar-title">
            Bharat<span className="text-warning">Teeka</span>
          </h3>

          <div className="sidebar-subtitle">ADMIN PANEL</div>

          <ul className="sidebar-menu list-unstyled">
            <li
              className={isActive("/admin/profile") ? "active" : ""}
              onClick={() => navigate("/admin/profile")}
            >
              <span className="sidebar-ico">👤</span>
              Manage Profile
            </li>

            <li
              className={isActive("/admin/manage-vaccines") ? "active" : ""}
              onClick={() => navigate("/admin/manage-vaccines")}
            >
              <span className="sidebar-ico">💉</span>
              Manage Vaccines
            </li>

            <li
              className={isActive("/admin/manage-users") ? "active" : ""}
              onClick={() => navigate("/admin/manage-users")}
            >
              <span className="sidebar-ico">👥</span>
              Manage Users
            </li>

            <li
              className={isActive("/admin/approved-hospitals") ? "active" : ""}
              onClick={() => navigate("/admin/approved-hospitals")}
            >
              <span className="sidebar-ico">🏥</span>
              Approved Hospitals
            </li>

            <li
              className={isActive("/admin/reports") ? "active" : ""}
              onClick={() => navigate("/admin/reports")}
            >
              <span className="sidebar-ico">📊</span>
              Reports
            </li>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="admin-main">
          <header className="admin-topbar">
            <small>
              Welcome,{" "}
              <span className="admin-name text-warning">{user?.username}</span>
            </small>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
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
