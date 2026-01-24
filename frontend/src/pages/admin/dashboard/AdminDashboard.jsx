import "./Dashboard.css";
import Footer from "../../../components/Footer/Footer";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* SIDEBAR */}
        <aside className="admin-sidebar shadow">
          <h3 className="sidebar-title">BharatTeeka</h3>

          <ul className="sidebar-menu list-unstyled">
            <li className="active">Dashboard</li>
            <li>User Management</li>
            <li>Hospital Management</li>
            <li>Reports</li>
            <li>Settings</li>
            <li>Access Control</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="admin-main flex-grow-1 d-flex flex-column">
          {/* TOP BAR */}
          <header className="admin-topbar d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
            <div>
              <small>
                Welcome, <span className="admin-name text-warning">{user?.username}</span>
              </small>
            </div>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* CONTENT */}
          <div className="admin-content flex-grow-1 container-fluid py-4">
            {/* USER INFO */}
            <div className="user-info-panel mb-4 p-3 shadow-sm rounded">
              <h5>Your Information</h5>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Address:</strong> {user?.address}</p>
              <p><strong>Role:</strong> Administrator</p>
            </div>

          </div>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
