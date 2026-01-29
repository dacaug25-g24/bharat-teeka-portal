import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin-ui.css";

const API = import.meta.env.VITE_ADMIN_API || "https://localhost:7233";

export default function ManageVaccine() {
  const [vaccines, setVaccines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVaccines = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getallvaccines`);
      setVaccines(res.data || []);
    } catch (error) {
      console.error("Error fetching vaccines", error);
      alert("Failed to load vaccines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const filteredVaccines = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return vaccines;
    return (vaccines || []).filter((v) =>
      (v?.vaccineName || "").toLowerCase().includes(q)
    );
  }, [vaccines, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vaccine?")) return;

    try {
      await axios.delete(`${API}/api/admin/deletevaccine/${id}`);
      fetchVaccines();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Failed to delete vaccine");
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="card admin-card2">
        <div className="card-body">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h4 className="admin-title2 mb-1">Manage Vaccines</h4>
              <div className="admin-subtitle2">
                Search, add, update or delete vaccines
              </div>
            </div>

            <div className="admin-actions2">
              {/* Search */}
              <div className="input-group admin-search2">
                <span className="input-group-text">🔎</span>
                <input
                  className="form-control"
                  placeholder="Search vaccine..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={() => setSearchTerm("")}
                    title="Clear"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Add */}
              <button
                className="btn btn-primary admin-add2"
                onClick={() => navigate("/admin/add-vaccine")}
              >
                + Add Vaccine
              </button>
            </div>
          </div>

          {/* Body */}
          {loading ? (
            <div className="admin-loading2">
              <div className="spinner-border spinner-border-sm" role="status" />
              <span className="text-muted">Loading vaccines...</span>
            </div>
          ) : filteredVaccines.length === 0 ? (
            <div className="alert alert-light border mb-0 admin-empty2">
              No vaccines found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 admin-table2">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 70 }}>ID</th>
                    <th>Name</th>
                    <th>Manufacturer</th>
                    <th>Type</th>
                    <th style={{ width: 120 }}>Age</th>
                    <th style={{ width: 90 }}>Doses</th>
                    <th style={{ width: 110 }}>Gap</th>
                    <th style={{ width: 110 }}>Temp</th>
                    <th style={{ width: 120 }}>Expiry</th>
                    <th style={{ width: 190 }}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVaccines.map((v) => (
                    <tr key={v.vaccineId}>
                      <td className="text-muted">{v.vaccineId}</td>
                      <td className="fw-semibold">{v.vaccineName}</td>
                      <td>{v.manufacturer}</td>
                      <td>{v.vaccineType}</td>
                      <td>
                        {v.minAge} - {v.maxAge}
                      </td>
                      <td>{v.doseRequired}</td>
                      <td>{v.doseGapDays} days</td>
                      <td>{v.storageTemperature} °C</td>
                      <td>
                        {v.expiryDate ? v.expiryDate.split("T")[0] : "N/A"}
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-outline-primary btn-sm admin-btn2"
                            onClick={() =>
                              navigate(`/admin/update-vaccine/${v.vaccineId}`)
                            }
                          >
                            Update
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm admin-btn2"
                            onClick={() => handleDelete(v.vaccineId)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
