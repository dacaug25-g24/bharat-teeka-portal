import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./PersonalInfo.css";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    aadhaarNumber: "",
    remarks: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // Check if user came from step 1
  useEffect(() => {
    const pendingUserId = localStorage.getItem("pendingUserId");
    const pendingUsername = localStorage.getItem("pendingUsername");
    
    if (!pendingUserId || !pendingUsername) {
      alert("Please complete account creation first!");
      navigate("/create-account");
    } else {
      setUserId(pendingUserId);
      setUsername(pendingUsername);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate required fields
    if (!formData.fullName || !formData.dateOfBirth || !formData.gender) {
      setError("Please fill all required fields!");
      setLoading(false);
      return;
    }

    // Calculate age
    const age = calculateAge(formData.dateOfBirth);
    
    // Show role determination
    const role = age < 18 ? "Parent (age < 18)" : "Patient (age ≥ 18)";
    const confirmMessage = `Based on your age (${age} years), you will be registered as a ${role}. Continue?`;
    
    if (!window.confirm(confirmMessage)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/complete-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          aadhaarNumber: formData.aadhaarNumber,
          remarks: formData.remarks
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear pending data
        localStorage.removeItem("pendingUserId");
        localStorage.removeItem("pendingUsername");
        
        // Show success
        alert(`✅ Registration Complete!\n\nUsername: ${data.username}\nRole: ${data.roleName}\n\nYou can now login.`);
        
        // Redirect to login
        navigate("/login");
      } else {
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("❌ Cannot connect to server. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-info-container">
      <div className="card personal-info-card">
        <div className="row g-0">
          {/* Left Side */}
          <div className="col-md-6 d-none d-md-block personal-info-left">
            <div className="personal-info-left-content">
              <h2>Complete Your Profile</h2>
              <p>Step 2 of 2: Personal Information</p>
              
              <div className="steps">
                <div className="step completed">
                  <div className="step-number">✓</div>
                  <div className="step-info">
                    <strong>Account Created</strong>
                    <small>Username: {username}</small>
                  </div>
                </div>
                <div className="step active">
                  <div className="step-number">2</div>
                  <div className="step-info">
                    <strong>Personal Details</strong>
                    <small>Complete your profile</small>
                  </div>
                </div>
              </div>
              
              <div className="role-info">
                <h5>Role Determination:</h5>
                <div className="role-rule">
                  <div className="role-item">
                    <span className="role-badge patient">Patient</span>
                    <span className="role-desc">Age 18 or above</span>
                  </div>
                  <div className="role-item">
                    <span className="role-badge parent">Parent</span>
                    <span className="role-desc">Below 18 years</span>
                  </div>
                </div>
                <p className="small">Your role will be automatically determined based on your Date of Birth.</p>
              </div>
              
              <div className="account-info">
                <h5>Your Account:</h5>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>User ID:</strong> {userId}</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="col-md-6">
            <div className="personal-info-form-container">
              <h2 className="personal-info-title">Personal Information</h2>
              <p className="personal-info-subtitle">Step 2: Complete Your Profile</p>
              
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error:</strong> {error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}

              <form className="personal-info-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date of Birth *</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted">This determines your role (Patient/Parent)</small>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Gender *</label>
                    <select 
                      className="form-control" 
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Aadhaar Number</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder="12-digit Aadhaar (Optional)"
                    maxLength="12"
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">Remarks / Additional Information</label>
                  <textarea 
                    className="form-control" 
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Any additional information (Optional)"
                    rows="3"
                  ></textarea>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn personal-info-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Completing Registration...
                      </>
                    ) : "Complete Registration →"}
                  </button>
                  
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/create-account")}
                  >
                    ← Go Back to Step 1
                  </button>
                </div>
              </form>

              <div className="login-redirect">
                Already registered? <Link to="/login">Login Here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}