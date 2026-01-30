import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
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

  // Inline per-field errors (shown under each field)
  const [fieldErrors, setFieldErrors] = useState({});

  // Top alert error on submit
  const [submitError, setSubmitError] = useState("");

  // track what user touched (so we don’t shout errors before typing)
  const [touched, setTouched] = useState({});

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const errorRef = useRef(null);

  useEffect(() => {
    if (submitError) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [submitError]);

  const calcAge = (dobStr) => {
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  // --- Validators (match backend) ---
  const validators = useMemo(() => {
    const isBlank = (s) => !s || !String(s).trim();

    const username = (v) => {
      const val = (v || "").trim();
      if (!val) return "Username is required";
      if (val.length < 3) return "Username must be at least 3 characters";
      if (val.length > 50) return "Username must be at most 50 characters";
      if (!/^[A-Za-z0-9._]+$/.test(val))
        return "Only letters, numbers, dot(.) and underscore(_) allowed";
      return "";
    };

    const email = (v) => {
      const val = (v || "").trim();
      if (!val) return "Email is required";
      if (!/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/.test(val))
        return "Enter a valid email (example: user@gmail.com)";
      return "";
    };

    const phone = (v) => {
      const val = (v || "").trim();
      if (!val) return "Phone is required";
      if (!/^[6-9]\d{9}$/.test(val))
        return "Enter valid 10-digit Indian phone (starts with 6-9)";
      return "";
    };

    const password = (v) => {
      const val = v || "";
      if (!val) return "Password is required";
      if (/\s/.test(val)) return "Password must not contain spaces";
      // min 8, 1 upper, 1 lower, 1 digit, 1 special from @$!%*?&^#
      const ok =
        /[a-z]/.test(val) &&
        /[A-Z]/.test(val) &&
        /\d/.test(val) &&
        /[@$!%*?&^#]/.test(val) &&
        val.length >= 8;
      if (!ok)
        return "Min 8 chars + 1 uppercase + 1 lowercase + 1 number + 1 special (@$!%*?&^#)";
      return "";
    };

    const confirmPassword = (v, all) => {
      const val = v || "";
      if (!val) return "Confirm password is required";
      if (val !== (all.password || "")) return "Passwords do not match";
      return "";
    };

    const firstName = (v) => {
      const val = (v || "").trim();
      if (!val) return "First name is required";
      if (val.length > 50) return "First name max 50 characters";
      if (!/^[A-Za-z ]+$/.test(val)) return "First name must contain only letters";
      return "";
    };

    const lastName = (v) => {
      const val = (v || "").trim();
      if (!val) return "Last name is required";
      if (val.length > 50) return "Last name max 50 characters";
      if (!/^[A-Za-z ]+$/.test(val)) return "Last name must contain only letters";
      return "";
    };

    const dateOfBirth = (v) => {
      const val = (v || "").trim();
      if (!val) return "Date of birth is required";
      const age = calcAge(val);
      if (Number.isNaN(age)) return "Invalid date of birth";
      if (age < 18)
        return "Only 18+ can register. Add minors as beneficiaries after login.";
      return "";
    };

    const gender = (v) => {
      const val = (v || "").trim();
      if (!val) return "Gender is required";
      return "";
    };

    const aadhaarNumber = (v) => {
      const val = (v || "").trim();
      if (!val) return "Aadhaar is required";
      if (!/^\d{12}$/.test(val)) return "Aadhaar must be exactly 12 digits";
      return "";
    };

    const bloodGroup = (v) => {
      const val = (v || "").trim().toUpperCase();
      if (!val) return "Blood group is required";
      if (!/^(A|B|AB|O)[+-]$/.test(val))
        return "Invalid blood group (example: A+, O-, AB+)";
      return "";
    };

    const address = (v) => {
      const val = (v || "").trim();
      if (!val) return "Address is required";
      if (val.length < 5) return "Address is too short";
      return "";
    };

    return {
      isBlank,
      username,
      email,
      phone,
      password,
      confirmPassword,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      aadhaarNumber,
      bloodGroup,
      address,
    };
  }, []);

  // Validate single field
  const validateField = (name, value, nextForm) => {
    switch (name) {
      case "username":
        return validators.username(value);
      case "email":
        return validators.email(value);
      case "phone":
        return validators.phone(value);
      case "password":
        return validators.password(value);
      case "confirmPassword":
        return validators.confirmPassword(value, nextForm);
      case "firstName":
        return validators.firstName(value);
      case "lastName":
        return validators.lastName(value);
      case "dateOfBirth":
        return validators.dateOfBirth(value);
      case "gender":
        return validators.gender(value);
      case "aadhaarNumber":
        return validators.aadhaarNumber(value);
      case "bloodGroup":
        return validators.bloodGroup(value);
      case "address":
        return validators.address(value);
      default:
        return "";
    }
  };

  // Validate all fields (for final submit)
  const validateAll = (nextForm) => {
    const errs = {};
    const fields = [
      "username",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "aadhaarNumber",
      "bloodGroup",
      "address",
    ];

    fields.forEach((f) => {
      const msg = validateField(f, nextForm[f], nextForm);
      if (msg) errs[f] = msg;
    });

    return errs;
  };

  const markTouched = (name) => {
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const onChange = (e) => {
    setSubmitError("");
    const { name, value } = e.target;

    // input hygiene like before
    let cleaned = value;

    if (name === "aadhaarNumber") cleaned = value.replace(/\D/g, "").slice(0, 12);
    if (name === "phone") cleaned = value.replace(/\D/g, "").slice(0, 10);
    if (name === "username") cleaned = value.replace(/[^A-Za-z0-9._]/g, "");

    const nextForm = { ...form, [name]: cleaned };
    setForm(nextForm);

    // live validation only after touch
    if (touched[name]) {
      const msg = validateField(name, cleaned, nextForm);
      setFieldErrors((p) => ({ ...p, [name]: msg }));
    }

    // if password changes, revalidate confirmPassword too (live)
    if (name === "password" && touched.confirmPassword) {
      const msg2 = validateField("confirmPassword", nextForm.confirmPassword, nextForm);
      setFieldErrors((p) => ({ ...p, confirmPassword: msg2 }));
    }
  };

  const onBlur = (e) => {
    const { name } = e.target;
    markTouched(name);

    const msg = validateField(name, form[name], form);
    setFieldErrors((p) => ({ ...p, [name]: msg }));

    // if user leaves password, revalidate confirm as well
    if (name === "password" && touched.confirmPassword) {
      const msg2 = validateField("confirmPassword", form.confirmPassword, form);
      setFieldErrors((p) => ({ ...p, confirmPassword: msg2 }));
    }
  };

  const showErr = (name) => {
    return Boolean(touched[name] && fieldErrors[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // mark all required fields touched
    const requiredFields = [
      "username",
      "email",
      "phone",
      "password",
      "confirmPassword",
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "aadhaarNumber",
      "bloodGroup",
      "address",
    ];
    const nextTouched = {};
    requiredFields.forEach((f) => (nextTouched[f] = true));
    setTouched((p) => ({ ...p, ...nextTouched }));

    const errs = validateAll(form);
    setFieldErrors(errs);

    if (Object.keys(errs).length > 0) {
      setSubmitError("Please correct the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    setSubmitError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_AUTH_API || "http://localhost:8080"}/api/auth/register`,
        {
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
            dateOfBirth: form.dateOfBirth, // yyyy-MM-dd
            gender: form.gender,
            aadhaarNumber: form.aadhaarNumber.trim(),
            bloodGroup: form.bloodGroup.trim().toUpperCase(),
            remarks: form.remarks.trim() || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setSubmitError(data?.message || "Registration failed!");
        return;
      }

      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setSubmitError(
        "Cannot connect to server. Please ensure backend is running on port 8080."
      );
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

                {submitError && (
                  <div ref={errorRef} className="alert alert-danger border-0 py-2">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
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
                        className={`form-control ${showErr("username") ? "is-invalid" : ""}`}
                        value={form.username}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        placeholder="e.g. user_123"
                        autoComplete="username"
                      />
                      {showErr("username") && (
                        <div className="invalid-feedback d-block">
                          {fieldErrors.username}
                        </div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        name="email"
                        type="email"
                        className={`form-control ${showErr("email") ? "is-invalid" : ""}`}
                        value={form.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        placeholder="e.g. user@gmail.com"
                        autoComplete="email"
                      />
                      {showErr("email") && (
                        <div className="invalid-feedback d-block">{fieldErrors.email}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        className={`form-control ${showErr("phone") ? "is-invalid" : ""}`}
                        value={form.phone}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        placeholder="10-digit number (starts 6-9)"
                        inputMode="numeric"
                        maxLength={10}
                        autoComplete="tel"
                      />
                      {showErr("phone") && (
                        <div className="invalid-feedback d-block">{fieldErrors.phone}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          name="password"
                          type={showPwd ? "text" : "password"}
                          className={`form-control ${showErr("password") ? "is-invalid" : ""}`}
                          value={form.password}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          placeholder="Min 8 chars + strong pattern"
                          autoComplete="new-password"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPwd((p) => !p)}
                          aria-label={showPwd ? "Hide password" : "Show password"}
                          disabled={loading}
                        >
                          <i className={`bi ${showPwd ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                      {showErr("password") && (
                        <div className="invalid-feedback d-block">{fieldErrors.password}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                      </label>
                      <div className="input-group">
                        <input
                          name="confirmPassword"
                          type={showConfirmPwd ? "text" : "password"}
                          className={`form-control ${
                            showErr("confirmPassword") ? "is-invalid" : ""
                          }`}
                          value={form.confirmPassword}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          placeholder="Re-enter password"
                          autoComplete="new-password"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowConfirmPwd((p) => !p)}
                          aria-label={
                            showConfirmPwd ? "Hide confirm password" : "Show confirm password"
                          }
                          disabled={loading}
                        >
                          <i className={`bi ${showConfirmPwd ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                      {showErr("confirmPassword") && (
                        <div className="invalid-feedback d-block">
                          {fieldErrors.confirmPassword}
                        </div>
                      )}
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
                          className={`form-control ${showErr("firstName") ? "is-invalid" : ""}`}
                          value={form.firstName}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          placeholder="e.g. Shubham"
                        />
                        {showErr("firstName") && (
                          <div className="invalid-feedback d-block">{fieldErrors.firstName}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          name="lastName"
                          type="text"
                          className={`form-control ${showErr("lastName") ? "is-invalid" : ""}`}
                          value={form.lastName}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          placeholder="e.g. Kumar"
                        />
                        {showErr("lastName") && (
                          <div className="invalid-feedback d-block">{fieldErrors.lastName}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                          name="dateOfBirth"
                          type="date"
                          className={`form-control ${showErr("dateOfBirth") ? "is-invalid" : ""}`}
                          value={form.dateOfBirth}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                        />
                        {showErr("dateOfBirth") && (
                          <div className="invalid-feedback d-block">{fieldErrors.dateOfBirth}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          name="gender"
                          className={`form-select ${showErr("gender") ? "is-invalid" : ""}`}
                          value={form.gender}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {showErr("gender") && (
                          <div className="invalid-feedback d-block">{fieldErrors.gender}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Aadhaar Number <span className="text-danger">*</span>
                        </label>
                        <input
                          name="aadhaarNumber"
                          type="text"
                          className={`form-control ${showErr("aadhaarNumber") ? "is-invalid" : ""}`}
                          value={form.aadhaarNumber}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          maxLength={12}
                          inputMode="numeric"
                          placeholder="12-digit Aadhaar"
                        />
                        {showErr("aadhaarNumber") && (
                          <div className="invalid-feedback d-block">{fieldErrors.aadhaarNumber}</div>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Blood Group <span className="text-danger">*</span>
                        </label>
                        <select
                          name="bloodGroup"
                          className={`form-select ${showErr("bloodGroup") ? "is-invalid" : ""}`}
                          value={form.bloodGroup}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                        >
                          <option value="">Select</option>
                          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                            <option key={bg} value={bg}>
                              {bg}
                            </option>
                          ))}
                        </select>
                        {showErr("bloodGroup") && (
                          <div className="invalid-feedback d-block">{fieldErrors.bloodGroup}</div>
                        )}
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
                          className={`form-control ${showErr("address") ? "is-invalid" : ""}`}
                          value={form.address}
                          onChange={onChange}
                          onBlur={onBlur}
                          disabled={loading}
                          placeholder="House no, street, city"
                        />
                        {showErr("address") && (
                          <div className="invalid-feedback d-block">{fieldErrors.address}</div>
                        )}
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
                          placeholder="Any important note (allergy, etc.)"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-100 fw-semibold py-2 mt-4"
                    disabled={loading}
                  >
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