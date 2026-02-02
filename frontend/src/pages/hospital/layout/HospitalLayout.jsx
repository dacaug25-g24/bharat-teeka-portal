import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import HospitalSidebar from "./HospitalSidebar";
import "./Dashboard.css";

export default function HospitalLayout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const roleId = useMemo(() => Number(user?.roleId || 0), [user]);

  useEffect(() => {
    // Must be logged in + hospital role
    if (!user) navigate("/login", { replace: true });
    if (user && roleId !== 2) navigate("/login", { replace: true });
  }, [user, roleId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const pageTitle = (() => {
    if (pathname.includes("/hospital/appointments")) return "Appointments";
    if (pathname.includes("/hospital/slots")) return "Slots";
    if (pathname.includes("/hospital/vaccines")) return "Vaccines";
    if (pathname.includes("/hospital/vaccination-records"))
      return "Vaccination Records";
    if (pathname.includes("/hospital/reports")) return "Reports";
    return "Dashboard";
  })();

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <div className="flex-grow-1">
        <div className="container-fluid">
          <div className="row g-0">
            {/* Sidebar */}
            <aside className="col-12 col-md-3 col-lg-2 border-end bg-white hospital-aside">
              <HospitalSidebar handleLogout={handleLogout} />
            </aside>

            {/* Main */}
            <main className="col-12 col-md-9 col-lg-10">
              {/* Topbar */}
              <div className="bg-white border-bottom hospital-topbar">
                <div className="px-3 px-md-4 py-3 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold fs-5 text-primary">{pageTitle}</div>
                    <div className="text-muted small">
                      Welcome,{" "}
                      <span className="fw-semibold">
                        {user?.username || "Hospital"}
                      </span>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 p-md-4 hospital-content">
                <Outlet />
              </div>

              {/* Footer */}
              <footer className="text-center py-2 text-muted small">
                © 2026 Bharat Teeka Portal
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
