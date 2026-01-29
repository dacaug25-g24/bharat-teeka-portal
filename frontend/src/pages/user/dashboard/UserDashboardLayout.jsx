import Footer from "../../../components/Footer/Footer";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";

export default function UserDashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const roleId = useMemo(() => Number(user?.roleId || 0), [user]);
  const isParent = roleId === 4;

  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const linkClass = ({ isActive }) =>
    `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded ${isActive ? "fw-semibold text-primary bg-primary-subtle" : "text-dark"
    }`;

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <div className="flex-grow-1">
        <div className="container-fluid">
          <div className="row g-0">
            <aside className="col-12 col-md-3 col-lg-2 border-end bg-white">
              <div className="px-3 px-md-4 py-3 border-bottom">
                <div className="fw-bold fs-5 text-primary">BharatTeeka</div>
                <div className="text-muted small">
                  {isParent ? "Parent Account" : "User Account"}
                </div>
              </div>


              <div className="p-2 p-md-3">
                <nav className="nav flex-column gap-1">
                  <NavLink to="dashboard" className={linkClass}>
                    <span>🏠</span> <span>Dashboard</span>
                  </NavLink>

                  <NavLink to="book-appointment" className={linkClass}>
                    <span>📅</span> <span>Book Appointment</span>
                  </NavLink>

                  {isParent && (
                    <NavLink to="beneficiaries" className={linkClass}>
                      <span>👨‍👩‍👧</span> <span>Manage Beneficiaries</span>
                    </NavLink>
                  )}

                  <NavLink to="history" className={linkClass}>
                    <span>🧾</span> <span>History</span>
                  </NavLink>

                  <NavLink to="profile" className={linkClass}>
                    <span>⚙️</span> <span>Profile</span>
                  </NavLink>
                </nav>
              </div>
            </aside>

            <main className="col-12 col-md-9 col-lg-10">
              <div className="bg-white border-bottom">
                <div className="px-3 px-md-4 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold fw-bold fs-5">
                      Welcome,{" "}
                      <span className="text-primary">{user?.username || "User"}</span>
                    </div>
                    <div className="text-muted small">
                      Role: {isParent ? "Parent" : "Patient/User"}
                    </div>
                  </div>

                  <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>

              <div className="p-3 p-md-4">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
