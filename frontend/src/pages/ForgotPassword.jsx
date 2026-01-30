// src/pages/ForgotPassword.jsx
import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import Footer from "../components/Footer/Footer";
import "./ForgotPassword.css";
import { authApi, getApiErrorMessage } from "../services/apiClients";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    aadhaar: "",
    dob: "", // yyyy-MM-dd
    newPassword: "",
    confirmPassword: "",
  });

  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState({ type: "", text: "" }); // success | danger | info

  // show/hide toggles
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canVerify = useMemo(() => {
    return (
      form.username.trim().length >= 3 &&
      form.email.trim().includes("@") &&
      /^\d{12}$/.test(form.aadhaar.trim()) &&
      !!form.dob
    );
  }, [form.username, form.email, form.aadhaar, form.dob]);

  const passwordsOk = useMemo(() => {
    if (!verified) return false;
    if (!form.newPassword || form.newPassword.length < 6) return false;
    if (form.newPassword !== form.confirmPassword) return false;
    return true;
  }, [verified, form.newPassword, form.confirmPassword]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setMsg({ type: "", text: "" });

    // If user edits identity after verified, unverify + clear passwords
    const identityFields = ["username", "email", "aadhaar", "dob"];
    if (verified && identityFields.includes(name)) {
      setVerified(false);
      setForm((p) => ({
        ...p,
        [name]: value,
        newPassword: "",
        confirmPassword: "",
      }));
      setShowNew(false);
      setShowConfirm(false);
      setMsg({ type: "info", text: "Details changed. Please verify again." });
      return;
    }

    setForm((p) => ({ ...p, [name]: value }));
  };

  const unlockDetails = () => {
    setVerified(false);
    setForm((p) => ({ ...p, newPassword: "", confirmPassword: "" }));
    setShowNew(false);
    setShowConfirm(false);
    setMsg({ type: "info", text: "You can edit details and verify again." });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!canVerify) {
      setMsg({
        type: "danger",
        text: "Please fill Username, Email, Aadhaar (12 digits) and Date of Birth.",
      });
      return;
    }

    setChecking(true);
    try {
      const res = await authApi.post("/api/auth/forgot-password/verify", {
        username: form.username.trim(),
        email: form.email.trim(),
        aadhaar: form.aadhaar.trim(),
        dob: form.dob,
      });

      const data = res?.data;

      if (!data?.success || data?.verified !== true) {
        setVerified(false);
        setMsg({
          type: "danger",
          text: data?.message || "Details not matched",
        });
        return;
      }

      setVerified(true);
      setMsg({
        type: "success",
        text: data?.message || "Verified! Now set your new password.",
      });
    } catch (err) {
      setVerified(false);
      setMsg({ type: "danger", text: getApiErrorMessage(err) });
    } finally {
      setChecking(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!verified) {
      setMsg({ type: "danger", text: "Please verify your details first." });
      return;
    }
    if (!form.newPassword || form.newPassword.length < 6) {
      setMsg({
        type: "danger",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMsg({ type: "danger", text: "Passwords do not match." });
      return;
    }

    setSaving(true);
    try {
      const res = await authApi.post("/api/auth/forgot-password/reset", {
        username: form.username.trim(),
        email: form.email.trim(),
        aadhaar: form.aadhaar.trim(),
        dob: form.dob,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      const data = res?.data;

      if (!data?.success) {
        setMsg({
          type: "danger",
          text: data?.message || "Failed to update password.",
        });
        return;
      }

      setMsg({
        type: "success",
        text: data?.message || "Password updated successfully! Please login.",
      });

      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setMsg({ type: "danger", text: getApiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const disabledIdentity = checking || saving || verified;
  const disabledPw = !verified || checking || saving;

  return (
    <div className="fp-page min-vh-100 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="card fp-card shadow-sm w-100" style={{ maxWidth: 560 }}>
          <div className="card-body p-4 p-md-5">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
              <h3 className="fw-bold text-center fp-title m-0">
                Forgot Password
              </h3>
              {verified && (
                <span className="badge fp-verified-badge">Verified ✅</span>
              )}
            </div>

            <p className="text-muted text-center mb-4">
              Verify your details to set a new password
              {verified && (
                <>
                  {" "}
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-1 fp-change-link"
                    onClick={unlockDetails}
                    disabled={checking || saving}
                  >
                    Change details
                  </button>
                </>
              )}
            </p>

            {msg?.text && (
              <div className={`alert alert-${msg.type} py-2`} role="alert">
                {msg.text}
              </div>
            )}

            {/* STEP 1: VERIFY */}
            <form onSubmit={handleVerify} className="mb-3">
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Username</label>
                  <input
                    name="username"
                    type="text"
                    className="form-control"
                    placeholder="Enter username"
                    value={form.username}
                    onChange={onChange}
                    disabled={disabledIdentity}
                    autoComplete="username"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter registered email"
                    value={form.email}
                    onChange={onChange}
                    disabled={disabledIdentity}
                    autoComplete="email"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Aadhaar</label>
                  <input
                    name="aadhaar"
                    type="text"
                    className="form-control"
                    placeholder="12 digit Aadhaar"
                    value={form.aadhaar}
                    onChange={onChange}
                    disabled={disabledIdentity}
                    inputMode="numeric"
                    maxLength={12}
                  />
                  <div className="form-text">Must be 12 digits</div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Date of Birth
                  </label>
                  <input
                    name="dob"
                    type="date"
                    className="form-control"
                    value={form.dob}
                    onChange={onChange}
                    disabled={disabledIdentity}
                  />
                </div>
              </div>

              <button
                className="btn btn-teal w-100 fw-semibold py-2 mt-3"
                disabled={checking || saving || !canVerify || verified}
              >
                {checking ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Verifying...
                  </>
                ) : verified ? (
                  "Verified ✅"
                ) : (
                  "Verify Details"
                )}
              </button>
            </form>

            {/* STEP 2: RESET */}
            <form onSubmit={handleReset}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">New Password</label>

                  <div className="input-group">
                    <input
                      name="newPassword"
                      type={showNew ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter new password"
                      value={form.newPassword}
                      onChange={onChange}
                      disabled={disabledPw}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary fp-eye-btn"
                      onClick={() => setShowNew((s) => !s)}
                      disabled={disabledPw}
                      aria-label={showNew ? "Hide password" : "Show password"}
                      title={showNew ? "Hide" : "Show"}
                    >
                      {showNew ? "🙈" : "👁️"}
                    </button>
                  </div>

                  <div className="form-text">Min 6 characters</div>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Confirm Password
                  </label>

                  <div className="input-group">
                    <input
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      placeholder="Re-type new password"
                      value={form.confirmPassword}
                      onChange={onChange}
                      disabled={disabledPw}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary fp-eye-btn"
                      onClick={() => setShowConfirm((s) => !s)}
                      disabled={disabledPw}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                      title={showConfirm ? "Hide" : "Show"}
                    >
                      {showConfirm ? "🙈" : "👁️"}
                    </button>
                  </div>

                  {verified &&
                    form.confirmPassword &&
                    form.newPassword !== form.confirmPassword && (
                      <div className="text-danger small mt-1">
                        Passwords do not match
                      </div>
                    )}
                  {verified &&
                    form.confirmPassword &&
                    form.newPassword === form.confirmPassword && (
                      <div className="text-success small mt-1">
                        Passwords match ✅
                      </div>
                    )}
                </div>
              </div>

              <button
                className="btn btn-dark w-100 fw-semibold py-2 mt-3"
                disabled={!passwordsOk || saving || checking}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>

            <div className="d-flex justify-content-between mt-3 small">
              <Link to="/login" className="text-decoration-none">
                Back to login
              </Link>
              <Link to="/register" className="text-decoration-none">
                Create account
              </Link>
            </div>

            <hr className="my-4" />

            <p className="text-muted small mb-0">
              After verification, password inputs will be enabled.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}