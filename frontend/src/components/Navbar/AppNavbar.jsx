import { Link, NavLink, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import emblemGov from "../../assets/emblem-gov.svg";
import "./Navbar.css";

const ROLE_BADGE = {
  1: { label: "ADMIN", tone: "badge-admin" },
  2: { label: "HOSPITAL", tone: "badge-hospital" },
  3: { label: "PATIENT", tone: "badge-user" },
  4: { label: "PARENT", tone: "badge-user" },
};

export default function AppNavbar() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const roleId = Number(user?.roleId);
  const badge = ROLE_BADGE[roleId] || { label: "USER", tone: "badge-user" };

  const dashboardPath = useMemo(() => {
    if (roleId === 1) return "/admin/profile";
    if (roleId === 2) return "/hospital/dashboard";
    if (roleId === 3 || roleId === 4) return "/user/dashboard";
    return "/user/dashboard";
  }, [roleId]);

  const menuLinks = useMemo(() => {
    if (roleId === 1) {
      return [
        { to: "/admin/profile", label: "Dashboard / Profile" },
        { to: "/admin/manage-users", label: "Manage Users" },
        { to: "/admin/approved-hospitals", label: "Hospitals" },
        { to: "/admin/manage-vaccines", label: "Vaccines" },
        { to: "/admin/reports", label: "Reports" },
      ];
    }

    if (roleId === 2) {
      return [
        { to: "/hospital/dashboard", label: "Dashboard" },
        { to: "/hospital/appointments", label: "Appointments" },
        { to: "/hospital/slots", label: "Slots" },
        { to: "/hospital/vaccination-records", label: "Vaccinations" },
        { to: "/hospital/reports", label: "Reports" },
      ];
    }

    // Parent/Patient
    return [
      { to: "/user/dashboard", label: "Dashboard" },
      { to: "/user/book-appointment", label: "Book Appointment" },
      { to: "/user/beneficiaries", label: "Beneficiaries" },
      { to: "/user/history", label: "History" },
      { to: "/user/profile", label: "Profile" },
    ];
  }, [roleId]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-teal py-2 shadow-sm bt-nav">
      <div className="container-fluid px-4">
        {/* ✅ Brand click -> Home page (but stays AppNavbar because logged in) */}
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
            <span className="brand-subtitle d-flex align-items-center gap-2">
              Towards Healthy Bharat
              <span className={`role-badge ${badge.tone}`}>{badge.label}</span>
            </span>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#appNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="appNavbar">
          {/* Center menu */}
          <ul className="navbar-nav mx-auto align-items-center nav-role-menu">
            {menuLinks.map((m) => (
              <li className="nav-item" key={m.to}>
                <NavLink
                  to={m.to}
                  className={({ isActive }) =>
                    `nav-link nav-link-soft ${isActive ? "active" : ""}`
                  }
                >
                  {m.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right buttons */}
          <div className="d-flex align-items-center gap-2 ms-lg-2 mt-3 mt-lg-0">
            <button
              className="btn btn-outline-light btn-dashboard"
              type="button"
              onClick={() => navigate(dashboardPath)}
            >
              Go to Dashboard
            </button>

            <button
              className="btn btn-light btn-logout"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}