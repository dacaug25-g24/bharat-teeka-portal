import { useEffect } from "react";
import "./Dashboard.css";
import Footer from "../../../components/Footer/Footer";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  const token = localStorage.getItem(TOKEN_KEY);

  // ✅ guard: if not logged in, kick to login
  useEffect(() => {
    if (!user || !token) {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    navigate("/login", { replace: true });
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
              <span className="admin-name text-warning">
                {user?.username || "Admin"}
              </span>
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
