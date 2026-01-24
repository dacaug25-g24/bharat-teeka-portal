import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import emblemGov from "../../assets/emblem-gov.svg";
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      }
    };
    
    checkUser();
    
    // Listen for storage changes (when login/logout happens)
    window.addEventListener('storage', checkUser);
    
    // Custom event listener for login/logout
    window.addEventListener('userChange', checkUser);
    
    return () => {
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('userChange', checkUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    
    // Trigger custom event to update navbar
    window.dispatchEvent(new Event('userChange'));
    
    navigate("/login");
  };

  const getDashboardLink = () => {
    if (!user) return "#";
    
    // Check based on roleId or roleName
    const roleId = user.roleId || user.role;
    
    switch(roleId) {
      case 1: return "/admin-dashboard";
      case 2: return "/hospital-dashboard";
      case 3: return "/patient-dashboard";
      case 4: return "/parent-dashboard";
      default: return "/";
    }
  };

  const getDashboardText = () => {
    if (!user) return "Dashboard";
    
    const roleId = user.roleId || user.role;
    const roleName = user.roleName || "User";
    
    return `${roleName} Dashboard`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal py-2 shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
          <img
            src={emblemGov}
            alt="Government emblem"
            className="brand-pill me-2"
          />
          <div className="d-flex flex-column">
            <span className="brand-title">
              Bharat<span className="text-warning"> Teeka </span>Portal
            </span>
            <span className="brand-subtitle">Towards Healthy Bharat</span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto gap-3 align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/find-center">Find Center</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/book-slot">Book Slot</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/download-certificate">Download Certificate</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">FAQ</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <>
                {/* User dropdown */}
                <div className="dropdown">
                  <button 
                    className="btn btn-outline-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="d-flex align-items-center">
                      <div className="user-avatar me-2">
                        <i className="bi bi-person-circle fs-5"></i>
                      </div>
                      <div className="user-info text-start">
                        <div className="user-name small fw-bold">{user.username}</div>
                        <div className="user-role small" style={{ fontSize: "0.7rem", opacity: 0.8 }}>
                          {user.roleName || "User"}
                        </div>
                      </div>
                    </div>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li>
                      <Link className="dropdown-item" to={getDashboardLink()}>
                        <i className="bi bi-speedometer2 me-2"></i>
                        {getDashboardText()}
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i>
                        My Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Login and Register buttons */}
                <Link className="btn btn-login px-4" to="/login">
                  Sign In
                </Link>
                <Link className="btn btn-register px-4" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}