import "./Dashboard.css";

export default function HospitalDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1>Hospital Dashboard</h1>
              <p className="mb-0">Welcome, <strong>{user?.username}</strong> Hospital</p>
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

      <div className="container">
        <div className="user-info-panel">
          <h5>Hospital Information</h5>
          <p><strong>Hospital Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Contact:</strong> {user?.phone}</p>
          <p><strong>Address:</strong> {user?.address}</p>
          <p><strong>Status:</strong> <span className="text-success">Active</span></p>
        </div>

        <h3 className="mb-4">Hospital Management</h3>
        
        <div className="row">
          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Vaccine Inventory</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Manage vaccine stock and inventory levels.</p>
                <button className="dashboard-btn w-100">Manage Inventory</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Appointments</h5>
              </div>
              <div className="card-body">
                <p className="card-text">View and manage vaccination appointments.</p>
                <button className="dashboard-btn w-100">View Appointments</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Patient Records</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Access patient vaccination records.</p>
                <button className="dashboard-btn w-100">Patient Records</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Staff Management</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Manage hospital staff and schedules.</p>
                <button className="dashboard-btn w-100">Manage Staff</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Daily Reports</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Generate daily vaccination reports.</p>
                <button className="dashboard-btn w-100">Generate Report</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card hospital-card">
              <div className="card-header">
                <h5 className="mb-0">Notifications</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Send notifications to patients.</p>
                <button className="dashboard-btn w-100">Send Notifications</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}