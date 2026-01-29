import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer/Footer";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // account
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // personal
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    aadhaarNumber: "",
    bloodGroup: "",
    remarks: "",

    // address
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const errorRef = useRef(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [error]);

  const onChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const calcAge = (dobStr) => {
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  const validate = () => {
    const username = form.username.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const aadhaar = form.aadhaarNumber.trim();

    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";

    if (!email) return "Email is required";

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) return "Enter a valid 10-digit Indian phone number";

    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) return "Passwords do not match";

    if (!firstName) return "First name is required";
    if (!lastName) return "Last name is required";
    if (!form.dateOfBirth) return "Date of birth is required";
    if (!form.gender) return "Gender is required";

    const age = calcAge(form.dateOfBirth);
    if (Number.isNaN(age)) return "Invalid date of birth";
    if (age < 18) return "Only 18+ users can create an account. Add minors as beneficiaries after login.";

    if (!aadhaar) return "Aadhaar is required";
    if (!/^\d{12}$/.test(aadhaar)) return "Aadhaar must be exactly 12 digits";

    if (!form.bloodGroup) return "Blood group is required";
    if (!address) return "Address is required";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),

          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          aadhaarNumber: form.aadhaarNumber.trim(),
          bloodGroup: form.bloodGroup,
          remarks: form.remarks.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Registration failed!");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError("Cannot connect to server. Please ensure backend is running on port 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <div className="container flex-grow-1 py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-1">Create Account</h2>
                  <p className="text-muted mb-0">
                    Register as an adult user (18+). You can add beneficiaries after login.
                  </p>
                </div>

                {error && (
                  <div ref={errorRef} className="alert alert-danger border-0 py-2">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* ACCOUNT */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h5 className="fw-semibold mb-0">Account Details</h5>
                    <span className="text-muted small">Fields marked * are required</span>
                  </div>
                  <hr className="mt-2 mb-3" />

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        name="username"
                        type="text"
                        className="form-control"
                        value={form.username}
                        onChange={onChange}
                        disabled={loading}
                        placeholder="e.g. user123"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={onChange}
                        disabled={loading}
                        placeholder="e.g. user@example.com"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        className="form-control"
                        value={form.phone}
                        onChange={onChange}
                        disabled={loading}
                        placeholder="10-digit Indian number"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          name="password"
                          type={showPwd ? "text" : "password"}
                          className="form-control"
                          value={form.password}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="Minimum 6 characters"
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPwd((p) => !p)}
                          aria-label={showPwd ? "Hide password" : "Show password"}
                        >
                          <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                      <div className="form-text">Minimum 6 characters</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          name="confirmPassword"
                          type={showConfirmPwd ? "text" : "password"}
                          className="form-control"
                          value={form.confirmPassword}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="Re-enter password"
                          required
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowConfirmPwd((p) => !p)}
                          aria-label={showConfirmPwd ? "Hide confirm password" : "Show confirm password"}
                        >
                          <i className={`bi ${showConfirmPwd ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PERSONAL */}
                  <div className="mt-4">
                    <h5 className="fw-semibold mb-0">Personal Details</h5>
                    <hr className="mt-2 mb-3" />

                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="firstName"
                          type="text"
                          className="form-control"
                          value={form.firstName}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="Enter first name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          className="form-control"
                          value={form.lastName}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="Enter last name"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          className="form-control"
                          value={form.dateOfBirth}
                          onChange={onChange}
                          disabled={loading}
                          required
                        />
                        <div className="form-text">Must be 18+ to create account</div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          name="gender"
                          className="form-select"
                          value={form.gender}
                          onChange={onChange}
                          disabled={loading}
                          required
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Aadhaar Number <span className="text-danger">*</span>
                        </label>
                        <input
                          name="aadhaarNumber"
                          type="text"
                          className="form-control"
                          value={form.aadhaarNumber}
                          onChange={onChange}
                          disabled={loading}
                          maxLength={12}
                          inputMode="numeric"
                          placeholder="12-digit Aadhaar"
                          required
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Blood Group <span className="text-danger">*</span>
                        </label>
                        <select
                          name="bloodGroup"
                          className="form-select"
                          value={form.bloodGroup}
                          onChange={onChange}
                          disabled={loading}
                          required
                        >
                          <option value="">Select</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* ADDRESS + REMARKS */}
                  <div className="mt-4">
                    <h5 className="fw-semibold mb-0">Address & Notes</h5>
                    <hr className="mt-2 mb-3" />

                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">
                          Address <span className="text-danger">*</span>
                        </label>
                        <input
                          name="address"
                          type="text"
                          className="form-control"
                          value={form.address}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="House no, area, city"
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Remarks (optional)</label>
                        <textarea
                          name="remarks"
                          className="form-control"
                          rows={2}
                          value={form.remarks}
                          onChange={onChange}
                          disabled={loading}
                          placeholder="Any important info (allergy, etc.)"
                        />
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-primary w-100 fw-semibold py-2 mt-4" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Creating account...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>

                  <div className="text-center mt-3">
                    <span className="text-muted">Already have an account?</span>{" "}
                    <Link to="/login" className="fw-semibold text-decoration-none">
                      Login
                    </Link>
                  </div>

                  <div className="alert alert-info border-0 mt-3 mb-0 small">
                    After login, you can add beneficiaries (children) from the dashboard.
                  </div>
                </form>
              </div>
            </div>

            <div className="text-center text-muted small mt-3">
              By registering, you agree to the portal terms and privacy policy.
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
