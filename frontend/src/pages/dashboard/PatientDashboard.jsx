import "./Dashboard.css";

export default function PatientDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>👤 Patient Dashboard</h1>
              <p className="mb-0">Welcome back, <strong>{user?.username}</strong></p>
            </div>
            <div className="col-md-4 text-end">
              <button className="logout-btn" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container">
        <div className="user-info-panel">
          <h5>Personal Information</h5>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Address:</strong> {user?.address}</p>
          <p><strong>Patient ID:</strong> PT-{user?.userId?.toString().padStart(4, '0')}</p>
        </div>

        <h3 className="mb-4">My Services</h3>
        
        <div className="row">
          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">📅 Book Vaccination</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Schedule your vaccination appointment.</p>
                <button className="dashboard-btn w-100">Book Now</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">📄 Vaccination Certificate</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Download your vaccination certificate.</p>
                <button className="dashboard-btn w-100">Download</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">📋 Appointment History</h5>
              </div>
              <div className="card-body">
                <p className="card-text">View your vaccination history.</p>
                <button className="dashboard-btn w-100">View History</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">📍 Find Centers</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Search nearby vaccination centers.</p>
                <button className="dashboard-btn w-100">Search Centers</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">🔔 Dose Reminders</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Get reminders for next dose.</p>
                <button className="dashboard-btn w-100">Set Reminder</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card patient-card">
              <div className="card-header">
                <h5 className="mb-0">👨‍⚕️ Health Profile</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Update your health information.</p>
                <button className="dashboard-btn w-100">Update Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}