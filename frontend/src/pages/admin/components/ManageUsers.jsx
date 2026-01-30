import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin-ui.css";

//  OPTION B: HTTP runs on 5225
const API = import.meta.env.VITE_ADMIN_API || "http://localhost:5225";
const ROLE_MAP = { 1: "ADMIN", 3: "PATIENT", 2: "HOSPITAL" };
const TOKEN_KEY = "token";
const USER_KEY = "user";

export default function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | PATIENT | HOSPITAL
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null); // optional: disable per-row while action running

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthErrors = (error, fallbackMsg) => {
    const status = error?.response?.status;

    if (status === 401) {
      alert("Unauthorized (401): Please login again. Token missing/expired.");
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      navigate("/login", { replace: true });
      return true;
    }

    if (status === 403) {
      alert("Forbidden (403): You are not ADMIN or role claim mismatch.");
      return true;
    }

    alert(error?.response?.data || fallbackMsg);
    return false;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/getallusers`, {
        headers: getAuthHeaders(),
      });
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
      handleAuthErrors(e, "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔴 deactivate user (DELETE)
  const deactivateUser = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;

    setBusyId(id);
    try {
      await axios.delete(`${API}/api/admin/deactivateuser/${id}`, {
        headers: getAuthHeaders(),
      });
      await fetchUsers();
    } catch (err) {
      console.error(err);
      handleAuthErrors(err, "Failed to deactivate user");
    } finally {
      setBusyId(null);
    }
  };

  // 🟢 reactivate user (PUT)
  const activateUser = async (id) => {
    setBusyId(id);
    try {
      await axios.put(
        `${API}/api/admin/reactivateuser/${id}`,
        {}, //  PUT body empty
        { headers: getAuthHeaders() },
      );
      await fetchUsers();
    } catch (err) {
      console.error(err);
      handleAuthErrors(err, "Failed to activate user");
    } finally {
      setBusyId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return (users || [])
      .filter((u) => {
        if (filter === "ALL") return true;
        if (filter === "PATIENT") return u.roleId === 3;
        if (filter === "HOSPITAL") return u.roleId === 2;
        return true;
      })
      .filter((u) => {
        if (!q) return true;
        return (
          (u?.username || "").toLowerCase().includes(q) ||
          (u?.email || "").toLowerCase().includes(q) ||
          (u?.phone || "").toLowerCase().includes(q)
        );
      });
  }, [users, filter, searchTerm]);

  const countActive = useMemo(
    () => (filteredUsers || []).filter((u) => !!u.isActive).length,
    [filteredUsers],
  );

  return (
    <div className="container-fluid p-0">
      <div className="admin-surface">
        {/* HEADER */}
        <div className="admin-head">
          <div>
            <div className="admin-title-row">
              <h4 className="admin-page-title m-0">Manage Users</h4>

              <span className="admin-chip">
                Total: <b>{filteredUsers.length}</b>
              </span>

              <span className="admin-chip success">
                Active: <b>{countActive}</b>
              </span>

              <span className="admin-chip danger">
                Inactive: <b>{filteredUsers.length - countActive}</b>
              </span>
            </div>

            <div className="admin-page-subtitle">
              Filter, search, activate or deactivate users
            </div>
          </div>

          {/* ACTIONS */}
          <div className="admin-actions">
            <div className="admin-seg">
              <button
                type="button"
                className={`admin-seg-btn ${filter === "ALL" ? "on" : ""}`}
                onClick={() => setFilter("ALL")}
              >
                All
              </button>
              <button
                type="button"
                className={`admin-seg-btn ${filter === "PATIENT" ? "on" : ""}`}
                onClick={() => setFilter("PATIENT")}
              >
                Patients
              </button>
              <button
                type="button"
                className={`admin-seg-btn ${filter === "HOSPITAL" ? "on" : ""}`}
                onClick={() => setFilter("HOSPITAL")}
              >
                Hospitals
              </button>
            </div>

            <div className="admin-search">
              <span className="admin-search-ico">🔎</span>
              <input
                className="admin-search-input"
                placeholder="Search name / email / phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="btn btn-outline-secondary admin-mini-btn"
              onClick={fetchUsers}
              disabled={loading}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="d-flex align-items-center gap-2 p-3">
            <div className="spinner-border spinner-border-sm" role="status" />
            <span className="text-muted">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-emoji">👀</div>
            <div className="fw-semibold">No users found</div>
            <div className="text-muted small">
              Try changing filter or search.
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table admin-table2 align-middle mb-0">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ID</th>
                  <th>User</th>
                  <th style={{ width: 120 }}>Role</th>
                  <th>Email</th>
                  <th style={{ width: 150 }}>Phone</th>
                  <th>Address</th>
                  <th style={{ width: 120 }}>Status</th>
                  <th style={{ width: 190 }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((u) => {
                  const roleName = ROLE_MAP[u.roleId] || "UNKNOWN";
                  const isAdmin = u.roleId === 1;
                  const active = !!u.isActive;
                  const rowBusy = busyId === u.userId;

                  return (
                    <tr key={u.userId}>
                      <td className="text-muted">{u.userId}</td>

                      <td>
                        <div className="admin-usercell">
                          <div className="admin-avatar-sm">
                            {(u.username?.[0] || "U").toUpperCase()}
                          </div>
                          <div className="admin-usercell-meta">
                            <div className="admin-usercell-name">
                              {u.username}
                            </div>
                            <div className="admin-usercell-sub text-muted small">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`admin-role-pill role-${roleName.toLowerCase()}`}
                        >
                          {roleName}
                        </span>
                      </td>

                      <td className="text-muted">{u.email}</td>
                      <td className="text-muted">{u.phone}</td>
                      <td className="text-muted">{u.address || "-"}</td>

                      <td>
                        <span
                          className={`admin-status-pill ${active ? "ok" : "bad"}`}
                        >
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {isAdmin ? (
                          <span className="text-muted small">Protected</span>
                        ) : active ? (
                          <button
                            className="admin-action danger"
                            onClick={() => deactivateUser(u.userId)}
                            disabled={rowBusy}
                          >
                            {rowBusy ? "⏳ ..." : "⛔ Deactivate"}
                          </button>
                        ) : (
                          <button
                            className="admin-action success"
                            onClick={() => activateUser(u.userId)}
                            disabled={rowBusy}
                          >
                            {rowBusy ? "⏳ ..." : " Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
