import { Link } from "react-router-dom";
import "./Login.css";
import loginImg from "./../assets/login.jpg";

export default function Login() {
  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-0" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="row g-0">

          <div className="col-md-6 d-none d-md-block">
            <img
              src={loginImg}
              className="img-fluid h-100"
              alt="Login"
              style={{ objectFit: "cover", borderRadius: "8px 0 0 8px" }}
            />
          </div>

          <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
            <h3 className="text-center mb-3">Welcome Back</h3>

            <form>

              <div className="mb-3">
                <label className="form-label">Select Role</label>
                <select className="form-select">
                  <option value="">Choose role</option>
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
                  <option value="government">Government of India</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">User ID / Email</label>
                <input type="text" className="form-control" placeholder="Enter User ID / Email" />
              </div>

              <div className="mb-1">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Enter Password" />
              </div>

              <div className="text-end">
                <Link to="/forgot-password" className="small">Forgot Password?</Link>
              </div>

              <button className="btn btn-primary w-100 mt-2">Login</button>

            </form>

            <p className="mt-3 text-center">
              New Patient? <Link to="/register">Register Here</Link>
            </p>

          </div>

        </div>
      </div>  
    </div>
  );
}
