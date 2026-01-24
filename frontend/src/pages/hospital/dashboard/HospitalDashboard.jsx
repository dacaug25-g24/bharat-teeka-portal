import "./Dashboard.css";
import Footer from "../../../components/Footer/Footer";

export default function HospitalDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* SIDEBAR */}
        <aside className="hospital-sidebar shadow">
          <h3 className="sidebar-title">BharatTeeka</h3>

          <ul className="sidebar-menu list-unstyled">
            <li className="active">Dashboard</li>
            <li>Manage Slots</li>
            <li>Appointments</li>
            <li>Vaccination Records</li>
            <li>Staff Management</li>
            <li>Settings</li>
          </ul>
        </aside>

        {/* MAIN CONTENT */}
        <div className="hospital-main flex-grow-1 d-flex flex-column">
          {/* TOP BAR */}
          <header className="hospital-topbar d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
            <div>
              <small>
                Welcome,{" "}
                <span className="hospital-name text-warning">
                  {user?.username}
                </span>
              </small>
            </div>

            <button
              className="logout-btn btn btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          {/* CONTENT */}
          <div className="hospital-content flex-grow-1 container-fluid py-4">
            <div className="hospital-info-panel mb-4 p-3 shadow-sm rounded">
              <h5>Hospital Information</h5>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Address:</strong> {user?.address}</p>
              <p><strong>Role:</strong> Hospital</p>
            </div>
          </div>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
