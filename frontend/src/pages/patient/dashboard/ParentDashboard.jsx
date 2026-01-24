import "./ParentDashboard.css";
import Footer from "../../../components/Footer/Footer";

export default function ParentDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* SIDEBAR */}
        <aside className="parent-sidebar shadow">
          <h3 className="sidebar-title">BharatTeeka</h3>

          <ul className="sidebar-menu list-unstyled">
            <li className="active">Dashboard</li>
            <li>Register Child</li>
            <li>Book Appointment</li>
            <li>Vaccination Schedule</li>
            <li>Vaccination History</li>
            <li>Download Certificate</li>
            <li>Reminders</li>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="parent-main flex-grow-1 d-flex flex-column">
          {/* TOP BAR */}
          <header className="parent-topbar d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
            <div>
              <small>
                Welcome,{" "}
                <span className="parent-name text-warning">
                  {user?.username}
                </span>
              </small>
            </div>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* CONTENT */}
          <div className="parent-content flex-grow-1 container-fluid py-4">
            <div className="parent-info-panel mb-4 shadow-sm rounded">
              <h5>Parent Information</h5>
              <p><strong>Name:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Address:</strong> {user?.address}</p>
              <p>
                <strong>Parent ID:</strong>{" "}
                PR-{user?.userId?.toString().padStart(4, "0")}
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
