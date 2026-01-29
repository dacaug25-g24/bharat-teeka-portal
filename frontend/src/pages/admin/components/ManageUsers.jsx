import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./admin-ui.css";

const API = import.meta.env.VITE_ADMIN_API || "https://localhost:7233";
const ROLE_MAP = { 1: "ADMIN", 3: "PATIENT", 2: "HOSPITAL" };

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | PATIENT | HOSPITAL
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getallusers`);
      setUsers(res.data || []);
    } catch (e) {
      console.error(e);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔴 deactivate user (DELETE)
  const deactivateUser = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await axios.delete(`${API}/api/admin/deactivateuser/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to deactivate user");
    }
  };

  // 🟢 reactivate user (PUT)
  const activateUser = async (id) => {
    try {
      await axios.put(`${API}/api/admin/reactivateuser/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Failed to activate user");
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
    [filteredUsers]
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

            <button className="btn btn-outline-secondary admin-mini-btn" onClick={fetchUsers}>
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
            <div className="text-muted small">Try changing filter or search.</div>
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

                  return (
                    <tr key={u.userId}>
                      <td className="text-muted">{u.userId}</td>

                      <td>
                        <div className="admin-usercell">
                          <div className="admin-avatar-sm">
                            {(u.username?.[0] || "U").toUpperCase()}
                          </div>
                          <div className="admin-usercell-meta">
                            <div className="admin-usercell-name">{u.username}</div>
                            <div className="admin-usercell-sub text-muted small">
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={`admin-role-pill role-${roleName.toLowerCase()}`}>
                          {roleName}
                        </span>
                      </td>

                      <td className="text-muted">{u.email}</td>
                      <td className="text-muted">{u.phone}</td>
                      <td className="text-muted">{u.address || "-"}</td>

                      <td>
                        <span className={`admin-status-pill ${active ? "ok" : "bad"}`}>
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
                          >
                            ⛔ Deactivate
                          </button>
                        ) : (
                          <button
                            className="admin-action success"
                            onClick={() => activateUser(u.userId)}
                          >
                            ✅ Activate
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
