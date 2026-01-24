import "./PatientDashboard.css";
import Footer from "../../../components/Footer/Footer";

export default function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="d-flex flex-grow-1">
        {/* SIDEBAR */}
        <aside className="patient-sidebar shadow">
          <h3 className="sidebar-title">BharatTeeka</h3>

          <ul className="sidebar-menu list-unstyled">
            <li className="active">Dashboard</li>
            <li>Book Vaccination</li>
            <li>My Appointments</li>
            <li>Vaccination History</li>
            <li>Download Certificate</li>
            <li>Find Centers</li>
            <li>Health Profile</li>
          </ul>
        </aside>

        {/* MAIN */}
        <div className="patient-main flex-grow-1 d-flex flex-column">
          {/* TOP BAR */}
          <header className="patient-topbar d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
            <div>
              <small>
                Welcome,{" "}
                <span className="patient-name text-warning">
                  {user?.username}
                </span>
              </small>
            </div>

            <button className="logout-btn btn btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* CONTENT */}
          <div className="patient-content flex-grow-1 container-fluid py-4">
            <div className="patient-info-panel mb-4 shadow-sm rounded">
              <h5>Personal Information</h5>
              <p><strong>Name:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
              <p><strong>Address:</strong> {user?.address}</p>
              <p>
                <strong>Patient ID:</strong>{" "}
                PT-{user?.userId?.toString().padStart(4, "0")}
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
