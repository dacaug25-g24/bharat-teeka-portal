import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer/Footer";
import "./Login.css";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        redirectBasedOnRole(data.user.roleId);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please ensure the backend is running on port 8080.");
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
      4: "/parent-dashboard",
    };
    window.location.href = routes[roleId] || "/dashboard";
  };

  return (
    <div className="login-page">

      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="login-container shadow-lg rounded-4 d-flex flex-column flex-md-row overflow-hidden">

          <div className="login-left d-none d-md-flex flex-column justify-content-center p-5">
            <h2 className="fw-bold mb-3">Welcome Back!</h2>
            <p className="text-light mb-0">
              Login to your Bharat Teeka Portal account to access vaccination information,
              book slots, and manage your profile securely.
            </p>
          </div>

          <div className="login-right p-5 flex-grow-1">
            <h3 className="text-center text-teal mb-3 fw-bold">Login</h3>

            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError("")}></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <input
                  type="text"
                  className="form-control input-modern"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control input-modern"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-modern w-100 fw-bold mb-3"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Authenticating...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            <div className="text-center">
              <Link to="#" className="text-decoration-none me-3 small">
                Forgot Password?
              </Link>
              <Link to="/register" className="text-decoration-none small">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
