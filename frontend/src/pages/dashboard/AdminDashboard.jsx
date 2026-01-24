import "./Dashboard.css";

export default function AdminDashboard() {
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
              <h1>Admin Dashboard</h1>
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

      <div className="container">
        <div className="user-info-panel">
          <h5>Your Information</h5>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Address:</strong> {user?.address}</p>
          <p><strong>Role:</strong> Administrator</p>
        </div>

        <h3 className="mb-4">Admin Controls</h3>

        <div className="row">
          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">User Management</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Add, edit, or remove users from the system.</p>
                <button className="dashboard-btn w-100">Manage Users</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">Hospital Management</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Manage hospitals and vaccination centers.</p>
                <button className="dashboard-btn w-100">Manage Hospitals</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">Reports & Analytics</h5>
              </div>
              <div className="card-body">
                <p className="card-text">View vaccination reports and statistics.</p>
                <button className="dashboard-btn w-100">View Reports</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">System Settings</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Configure system settings and preferences.</p>
                <button className="dashboard-btn w-100">Settings</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">Manage Content</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Update website content and announcements.</p>
                <button className="dashboard-btn w-100">Manage Content</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card admin-card">
              <div className="card-header">
                <h5 className="mb-0">Access Control</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Manage roles and permissions.</p>
                <button className="dashboard-btn w-100">Access Control</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}