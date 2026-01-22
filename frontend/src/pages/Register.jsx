import { Link } from "react-router-dom";
import "./Register.css";
import registerImg from "./../assets/registration.jpg";

export default function Register() {
  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-0" style={{ maxWidth: "900px", width: "100%" }}>
        <div className="row g-0">

          <div className="col-md-5 d-none d-md-block">
            <img
              src={registerImg}
              className="img-fluid h-100"
              alt="Register"
              style={{ objectFit: "cover", borderRadius: "8px 0 0 8px" }}
            />
          </div>

          <div className="col-md-7 p-4 d-flex flex-column justify-content-center">
            <h3 className="text-center mb-3 text-success fw-bold">
              Create Account
            </h3>

            <form>
              <div className="row">
 
                <div className="col-md-6 mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter full name"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Mobile</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <button type="button" className="btn btn-outline-success w-100">
                    Send OTP
                  </button>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">OTP</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Create password"
                  />
                </div>
              </div>

              <button className="btn btn-success w-100 mt-2">Register</button>
            </form>

            <p className="mt-3 text-center">
              Already registered? <Link to="/">Login</Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
