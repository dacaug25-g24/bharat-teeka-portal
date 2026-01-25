import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./registration.css";
import Footer from "../../components/Footer/Footer";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Enter a valid 10-digit Indian phone number");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/create-account",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("Account created successfully!");
        localStorage.setItem("pendingUserId", data.userId);
        localStorage.setItem("pendingUsername", formData.username);

        setTimeout(() => navigate("/registration/personal-info"), 2000);
      } else {
        setError(data.message || "Account creation failed!");
      }
    } catch (err) {
      setError("Cannot connect to server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-account-container">
        <div className="card create-account-card shadow-lg">
          {/* 🔑 FIX: make row stretch full height */}
          <div className="row g-0 h-100 align-items-stretch">

            {/* LEFT PANEL */}
            <div className="col-md-6 d-none d-md-flex create-account-left">
              <div className="left-inner">
                <h2 className="mb-3">Create Your Account</h2>

                <div className="steps mb-4">
                  <div className="step active">
                    <div className="step-number">1</div>
                    <div className="step-info">
                      <strong>Account Details</strong>
                      <small>Username, Password, Contact Info</small>
                    </div>
                  </div>

                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-info">
                      <strong>Personal Info</strong>
                      <small>Complete your profile</small>
                    </div>
                  </div>
                </div>

                <div className="requirements">
                  <h5>Requirements:</h5>
                  <ul>
                    <li>Unique username</li>
                    <li>Minimum 6-character password</li>
                    <li>Valid email</li>
                    <li>10-digit Indian phone number</li>
                    <li>Complete address</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-md-6 create-account-form-container">
              <h2 className="text-center text-teal mb-2">Create Account</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    placeholder="Choose username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="Minimum 6 chars"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Confirm Password *</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Retype password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
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
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      placeholder="10-digit Indian number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Address *</label>
                  <textarea
                    className="form-control"
                    name="address"
                    rows="2"
                    placeholder="Complete postal address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-modern btn-teal w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account →"
                  )}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-teal">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
