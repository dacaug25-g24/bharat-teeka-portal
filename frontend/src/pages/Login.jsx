import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer/Footer";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const username = form.username.trim();
    const password = form.password;

    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (!password) return "Password is required";
    if (password.length < 4) return "Password must be at least 4 characters";

    return "";
  };

  const redirectBasedOnRole = (roleId) => {
    const r = Number(roleId);

    // IMPORTANT: Your admin routes are /admin/*
    if (r === 1) return navigate("/admin/profile", { replace: true });

    if (r === 2) return navigate("/hospital/dashboard", { replace: true });
    if (r === 3 || r === 4)
      return navigate("/user/dashboard", { replace: true });

    return navigate("/login", { replace: true });
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
      const res = await fetch(
        `${import.meta.env.VITE_AUTH_API || "http://localhost:8080"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username.trim(),
            password: form.password,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok || !data?.success) {
        setError(data?.message || "Login failed. Please try again.");
        return;
      }

      // Store user + token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      redirectBasedOnRole(data.user.roleId);
    } catch (err) {
      console.error("Login error:", err);
      setError("Connection error. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex flex-column">
      <div className="container flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div
          className="card login-card shadow-sm w-100"
          style={{ maxWidth: 520 }}
        >
          <div className="card-body p-4 p-md-5">
            <h3 className="fw-bold text-center mb-1 login-title">
              Bharat Teeka Portal
            </h3>
            <p className="text-muted text-center mb-4">Login to continue</p>

            {error && (
              <div className="alert alert-danger py-2" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Enter username"
                  value={form.username}
                  onChange={onChange}
                  disabled={loading}
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={form.password}
                  onChange={onChange}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <button
                className="btn btn-teal w-100 fw-semibold py-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="d-flex justify-content-between mt-3 small">
              <Link to="/register" className="text-decoration-none">
                Create account
              </Link>
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot password?
              </Link>
            </div>

            <hr className="my-4" />

            <p className="text-muted small mb-0">
              Note: Only 18+ users can create a Patient account. Beneficiaries
              (children/parents) can be added after login.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}