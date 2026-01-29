import { NavLink } from "react-router-dom";

export default function HospitalSidebar({ handleLogout }) {
  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded hospital-navlink ${
      isActive ? "fw-semibold text-primary bg-primary-subtle" : "text-dark"
    }`;

  return (
    <div>
      <div className="p-3 border-bottom">
        <div className="fw-bold fs-5 text-primary">BharatTeeka</div>
        <div className="text-muted small">Hospital Panel</div>
      </div>

      <div className="p-2 p-md-3">
        <nav className="nav flex-column gap-1">
          <NavLink to="/hospital/dashboard" className={linkClass}>
            <span>🏠</span> <span>Dashboard</span>
          </NavLink>

          <NavLink to="/hospital/appointments" className={linkClass}>
            <span>📋</span> <span>Appointments</span>
          </NavLink>

          <NavLink to="/hospital/slots" className={linkClass}>
            <span>🕒</span> <span>Manage Slots</span>
          </NavLink>

          <NavLink to="/hospital/vaccines" className={linkClass}>
            <span>💉</span> <span>Vaccines</span>
          </NavLink>

          <NavLink to="/hospital/vaccination-records" className={linkClass}>
            <span>📌</span> <span>Vaccination Records</span>
          </NavLink>

          <NavLink to="/hospital/reports" className={linkClass}>
            <span>📄</span> <span>Reports</span>
          </NavLink>
        </nav>

        <hr className="my-3" />

        <button
          type="button"
          className="btn btn-outline-danger w-100"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
