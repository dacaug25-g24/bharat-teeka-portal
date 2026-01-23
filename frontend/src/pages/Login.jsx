import { Link, useNavigate } from "react-router-dom";
import loginImg from "./../assets/login.jpg";
import { useState } from "react";
import "./Login.css"; // Separate CSS file

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        
         // Dispatch event to update navbar
          window.dispatchEvent(new Event('userChange'));

        // Show success message
        alert(`✅ Login Successful!\n\nWelcome ${data.user.username}\nRole: ${data.user.roleName}\nEmail: ${data.user.email}`);
        
        // Redirect based on role
        redirectBasedOnRole(data.user.roleId);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("❌ Cannot connect to server. Make sure backend is running on port 8080.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const redirectBasedOnRole = (roleId) => {
    switch(roleId) {
      case 1:
        navigate("/admin-dashboard");
        break;
      case 2:
        navigate("/hospital-dashboard");
        break;
      case 3:
        navigate("/patient-dashboard");
        break;
      case 4:
        navigate("/parent-dashboard");
        break;
      default:
        navigate("/");
    }
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
    <div className="login-container">
      <div className="card login-card">
        <div className="row g-0">
          {/* Left side - Image */}
          <div className="col-md-6 d-none d-md-block">
            <img
              src={loginImg}
              className="login-left-img"
              alt="Vaccination Login"
            />
          </div>

          {/* Right side - Login Form */}
          <div className="col-md-6">
            <div className="login-form-container">
              <h2 className="login-title">Bharat Teeka Portal</h2>
              <p className="login-subtitle">Login to your account</p>
              
              {/* Backend Status Check */}
              <div className="text-center mb-3">
                <button 
                  type="button" 
                  className="btn btn-outline-info btn-sm"
                  onClick={checkBackendStatus}
                >
                  🔍 Check Backend Status
                </button>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error:</strong> {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}

              {/* Login Form */}
              <form className="login-form" onSubmit={handleSubmit}>
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
                  className="btn login-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Logging in...
                    </>
                  ) : "Login"}
                </button>
              </form>

              {/* Forgot Password */}
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot Password?
              </Link>

              {/* Test Credentials */}
              <div className="test-credentials-container">
                <div className="test-credentials-title">
                  Quick Test Credentials:
                </div>
                <div className="test-buttons-container">
                  <button 
                    type="button" 
                    className="btn test-btn admin"
                    onClick={() => fillTestCredentials("admin", "admin123")}
                  >
                    👑 Admin
                  </button>
                  <button 
                    type="button" 
                    className="btn test-btn hospital"
                    onClick={() => fillTestCredentials("aiims", "hospital123")}
                  >
                    🏥 Hospital
                  </button>
                  <button 
                    type="button" 
                    className="btn test-btn patient"
                    onClick={() => fillTestCredentials("raj", "patient123")}
                  >
                    👤 Patient
                  </button>
                  <button 
                    type="button" 
                    className="btn test-btn parent"
                    onClick={() => fillTestCredentials("parent1", "parent123")}
                  >
                    👪 Parent
                  </button>
                </div>
              </div>

              {/* Register Link */}
              <div className="register-link">
               New Patient? <Link to="/register">Register Here</Link>  {/* This now goes to CreateAccount */}
              </div>

              {/* Backend Info */}
              <div className="backend-info">
                <strong>Backend Information:</strong>
                <div>Port: 8080</div>
                <div>Database: p24_bharat_teeka_portal</div>
                <a 
                  href="http://localhost:8080/api/auth/test" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Test Connection
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}