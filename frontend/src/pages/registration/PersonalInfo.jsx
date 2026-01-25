import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./registration.css";

export default function PersonalInfo() {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender: "",
    aadhaarNumber: "",
    bloodGroup: "",
    remarks: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const pendingUserId = localStorage.getItem("pendingUserId");
    const pendingUsername = localStorage.getItem("pendingUsername");

    if (!pendingUserId || !pendingUsername) {
      navigate("/registration/create-account");
    } else {
      setUserId(pendingUserId);
      setUsername(pendingUsername);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.fullName || !formData.dateOfBirth || !formData.gender) {
      setError("Please fill all required fields!");
      setLoading(false);
      return;
    }

    const age = calculateAge(formData.dateOfBirth);
    const role = age < 18 ? "Parent (age < 18)" : "Patient (age ≥ 18)";
    if (!window.confirm(`Based on age ${age}, role will be: ${role}. Continue?`)) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId), ...formData }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem("pendingUserId");
        localStorage.removeItem("pendingUsername");
        alert(`Registration Complete!\nUsername: ${data.username}\nRole: ${data.roleName}`);
        navigate("/login");
      } else {
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("Cannot connect to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personal-info-container">
      <div className="card personal-info-card shadow-lg">
        <div className="row g-0">

          <div className="col-md-6 d-none d-md-flex personal-info-left flex-column justify-content-center p-5">
            <h2 className="mb-3">Complete Your Profile</h2>
            <p className="mb-4">Step 2 of 2: Personal Info</p>

            <div className="steps mb-4">
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
          </div>

          <div className="col-md-6 p-4 personal-info-form-container">
            <h2 className="text-center text-teal mb-2">Personal Information</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Date of Birth *</label>
                  <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender *</label>
                  <select className="form-control" name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Aadhaar Number</label>
                <input type="text" className="form-control" name="aadhaarNumber" maxLength="12" placeholder="Optional" value={formData.aadhaarNumber} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Blood Group</label>
                <select className="form-control" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Remarks / Additional Info</label>
                <textarea className="form-control" name="remarks" rows="3" value={formData.remarks} onChange={handleChange}></textarea>
              </div>

              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-teal" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Completing...
                    </>
                  ) : (
                    "Complete Registration →"
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
