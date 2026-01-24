import "./Dashboard.css";

export default function ParentDashboard() {
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
              <h1>Parent Dashboard</h1>
              <p className="mb-0">Welcome, <strong>{user?.username}</strong></p>
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
          <h5>Parent Information</h5>
          <p><strong>Name:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Phone:</strong> {user?.phone}</p>
          <p><strong>Address:</strong> {user?.address}</p>
          <p><strong>Parent ID:</strong> PR-{user?.userId?.toString().padStart(4, '0')}</p>
        </div>

        <h3 className="mb-4">Child Vaccination Management</h3>
        
        <div className="row">
          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Child Registration</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Register your child for vaccination.</p>
                <button className="dashboard-btn w-100">Register Child</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Child Vaccination Schedule</h5>
              </div>
              <div className="card-body">
                <p className="card-text">View and manage child vaccination schedule.</p>
                <button className="dashboard-btn w-100">View Schedule</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Vaccination History</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Track your child's vaccination history.</p>
                <button className="dashboard-btn w-100">View History</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Book Child Appointment</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Schedule vaccination for your child.</p>
                <button className="dashboard-btn w-100">Book Appointment</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Download Certificates</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Download child vaccination certificates.</p>
                <button className="dashboard-btn w-100">Download</button>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="dashboard-card parent-card">
              <div className="card-header">
                <h5 className="mb-0">Vaccination Reminders</h5>
              </div>
              <div className="card-body">
                <p className="card-text">Set reminders for upcoming vaccinations.</p>
                <button className="dashboard-btn w-100">Set Reminders</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}