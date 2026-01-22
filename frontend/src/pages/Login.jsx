import { Link } from "react-router-dom";
import "./Login.css";
import loginImg from "./../assets/login.jpg";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Show success message
        alert(`✅ Login Successful!\n\nWelcome ${data.user.username}\nRole: ${data.user.roleName}\nEmail: ${data.user.email}`);
        
        // Redirect based on role
        redirectBasedOnRole(data.user.roleId);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("❌ Connection error. Make sure backend is running on port 8080.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (roleId) => {
    const routes = {
      1: "/admin-dashboard",
      2: "/hospital-dashboard", 
      3: "/patient-dashboard",
      4: "/parent-dashboard"
    };
    
    const route = routes[roleId] || "/dashboard";
    window.location.href = route;
  };

  const fillTestCredentials = (user, pass) => {
    setUsername(user);
    setPassword(pass);
  };

  const checkBackendStatus = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/test");
      const data = await response.json();
      alert(`✅ Backend is running!\n\nStatus: ${data.status}\nMessage: ${data.message}`);
    } catch (error) {
      alert("❌ Backend is not running. Please start Spring Boot application on port 8080.");
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-0" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="row g-0">
          <div className="col-md-6 d-none d-md-block">
            <img
              src={loginImg}
              className="img-fluid h-100"
              alt="Login"
              style={{ objectFit: "cover", borderRadius: "8px 0 0 8px" }}
            />
          </div>

          <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
            <h3 className="text-center mb-3">Bharat Teeka Portal</h3>
            <p className="text-center text-muted mb-4">Login to your account</p>
            
            {/* Backend Status Check */}
            <div className="mb-3 text-center">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-info"
                onClick={checkBackendStatus}
              >
                🔍 Check Backend Status
              </button>
            </div>
            
            {/* Test Users Buttons */}
            <div className="mb-3">
              <small className="text-muted">Quick Test Credentials:</small>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-success"
                  onClick={() => fillTestCredentials("admin", "admin123")}
                >
                  👑 Admin
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => fillTestCredentials("aiims", "hospital123")}
                >
                  🏥 Hospital
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => fillTestCredentials("raj", "patient123")}
                >
                  👤 Patient
                </button>
                <button 
                  type="button" 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => fillTestCredentials("parent1", "parent123")}
                >
                  👪 Parent
                </button>
              </div>
            </div>
            
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error:</strong> {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Enter username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Enter password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Authenticating...
                  </>
                ) : "🚀 Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <Link to="/forgot-password" className="small me-3">Forgot Password?</Link>
              <Link to="/register" className="small">New Patient? Register Here</Link>
            </div>

            {/* Backend Info */}
            <div className="mt-4 p-3 bg-light rounded">
              <small className="text-muted">
                <strong>Backend Info:</strong><br/>
                • Port: 8080<br/>
                • Database: p24_bharat_teeka_portal<br/>
                • Test: <a 
                  href="http://localhost:8080/api/auth/test" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  http://localhost:8080/api/auth/test
                </a>
              </small>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}