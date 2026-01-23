import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateAccount.css";

export default function CreateAccount() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long!");
      setLoading(false);
      return;
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid 10-digit Indian phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/create-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("✅ Account created successfully!");
        
        // Store userId for next step
        localStorage.setItem("pendingUserId", data.userId);
        localStorage.setItem("pendingUsername", formData.username);
        
        // Redirect to personal info page after 2 seconds
        setTimeout(() => {
          navigate("/personal-info");
        }, 2000);
      } else {
        setError(data.message || "Account creation failed!");
      }
    } catch (err) {
      setError("❌ Cannot connect to server. Make sure backend is running.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="card create-account-card">
        <div className="row g-0">
          {/* Left Side - Illustration */}
          <div className="col-md-6 d-none d-md-block create-account-left">
            <div className="create-account-left-content">
              <h2>Create Your Account</h2>
              <p>Step 1 of 2: Basic Account Information</p>
              <div className="steps">
                <div className="step active">
                  <div className="step-number">1</div>
                  <div className="step-info">
                    <strong>Account Details</strong>
                    <small>Username, password, contact info</small>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-info">
                    <strong>Personal Information</strong>
                    <small>Complete your profile</small>
                  </div>
                </div>
              </div>
              
              <div className="requirements">
                <h5>Requirements:</h5>
                <ul>
                  <li>Username must be unique</li>
                  <li>Password minimum 6 characters</li>
                  <li>Valid email address</li>
                  <li>10-digit Indian phone number</li>
                  <li>Complete address</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-md-6">
            <div className="create-account-form-container">
              <h2 className="create-account-title">Create Account</h2>
              <p className="create-account-subtitle">Step 1: Basic Information</p>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error:</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}
              
              {success && (
                <div className="alert alert-success alert-dismissible fade show" role="alert">
                  <strong>Success!</strong> {success}
                  <div className="mt-2">
                    <div className="spinner-border spinner-border-sm text-success me-2" role="status"></div>
                    Redirecting to next step...
                  </div>
                </div>
              )}

              <form className="create-account-form" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Username *</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a username"
                      required
                    />
                    <small className="text-muted">This will be your login ID</small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Retype your password"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      className="form-control" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit Indian number"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Address *</label>
                  <textarea 
                    className="form-control" 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete postal address"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn create-account-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating Account...
                    </>
                  ) : "Create Account →"}
                </button>
              </form>

              <div className="login-redirect">
                Already have an account? <Link to="/login">Login Here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}