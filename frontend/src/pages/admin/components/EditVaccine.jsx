import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./admin-ui.css";

// ✅ OPTION B: HTTP runs on 5225
const API = import.meta.env.VITE_ADMIN_API || "http://localhost:5225";
const TOKEN_KEY = "token";

export default function EditVaccine() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vaccine, setVaccine] = useState({
    vaccineId: "",
    vaccineName: "",
    manufacturer: "",
    vaccineType: "",
    description: "",
    sideEffects: "",
    minAge: "",
    maxAge: "",
    doseRequired: "",
    doseGapDays: "",
    storageTemperature: "",
    expiryDate: "",
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthErrors = (error, fallbackMsg) => {
    const status = error?.response?.status;

    if (status === 401) {
      alert("Unauthorized (401): Please login again. Token missing/expired.");
      navigate("/login", { replace: true });
      return;
    }
    if (status === 403) {
      alert("Forbidden (403): You are not ADMIN or role claim mismatch.");
      return;
    }

    alert(error?.response?.data || fallbackMsg);
  };

  const normalizeDate = (val) => {
    if (!val) return "";
    const s = String(val);
    return s.includes("T") ? s.split("T")[0] : s;
  };

  const toNumberOrEmpty = (v) => {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(v);
    return Number.isNaN(n) ? "" : n;
  };

  // Fetch vaccine by id
  useEffect(() => {
    const fetchVaccine = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/admin/getvaccinebyid/${id}`, {
          headers: getAuthHeaders(),
        });

        const data = res.data || {};
        setVaccine({
          ...data,
          expiryDate: normalizeDate(data.expiryDate),
        });
      } catch (e) {
        console.error(e);
        handleAuthErrors(e, "Failed to load vaccine");
      } finally {
        setLoading(false);
      }
    };

    fetchVaccine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVaccine((p) => ({ ...p, [name]: value }));
  };

  // ✅ Update vaccine
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    try {
      const payload = {
        ...vaccine,
        minAge: toNumberOrEmpty(vaccine.minAge),
        maxAge: toNumberOrEmpty(vaccine.maxAge),
        doseRequired: toNumberOrEmpty(vaccine.doseRequired),
        doseGapDays: toNumberOrEmpty(vaccine.doseGapDays),
        storageTemperature: vaccine.storageTemperature, // keep as string if backend expects string
        expiryDate: vaccine.expiryDate || null,
      };

      await axios.put(`${API}/api/admin/updatevaccine/${id}`, payload, {
        headers: getAuthHeaders(),
      });

      alert("Vaccine updated successfully!");
      navigate("/admin/manage-vaccines");
    } catch (e) {
      console.error(e);
      handleAuthErrors(e, "Failed to update vaccine");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading2">
        <div className="spinner-border spinner-border-sm" role="status" />
        <span className="text-muted">Loading vaccine...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3">
      <div className="card admin-card2">
        <div className="card-body">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h4 className="admin-title2 mb-1">Update Vaccine</h4>
              <div className="admin-subtitle2">Vaccine ID: {id}</div>
            </div>

            <button
              className="btn btn-light admin-btn2"
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
            >
              ← Back
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Basic Info */}
              <div className="col-12">
                <div className="admin-section-title">Basic Info</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Vaccine Name</label>
                <input
                  className="form-control admin-input2"
                  name="vaccineName"
                  value={vaccine.vaccineName || ""}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Manufacturer</label>
                <input
                  className="form-control admin-input2"
                  name="manufacturer"
                  value={vaccine.manufacturer || ""}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Vaccine Type</label>
                <input
                  className="form-control admin-input2"
                  name="vaccineType"
                  value={vaccine.vaccineType || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Age & Dose */}
              <div className="col-12">
                <div className="admin-section-title">Age & Dose Details</div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Min Age</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="minAge"
                  value={vaccine.minAge ?? ""}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Max Age</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="maxAge"
                  value={vaccine.maxAge ?? ""}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Doses Required</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="doseRequired"
                  value={vaccine.doseRequired ?? ""}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Dose Gap (Days)</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="doseGapDays"
                  value={vaccine.doseGapDays ?? ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Storage */}
              <div className="col-12">
                <div className="admin-section-title">Storage</div>
              </div>

              <div className="col-md-4">
                <label className="form-label">Storage Temperature (°C)</label>
                <input
                  className="form-control admin-input2"
                  name="storageTemperature"
                  value={vaccine.storageTemperature || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Expiry Date</label>
                <input
                  className="form-control admin-input2"
                  type="date"
                  name="expiryDate"
                  value={vaccine.expiryDate || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Notes */}
              <div className="col-12">
                <div className="admin-section-title">Notes</div>
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control admin-input2"
                  rows="3"
                  name="description"
                  value={vaccine.description || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Side Effects</label>
                <textarea
                  className="form-control admin-input2"
                  rows="3"
                  name="sideEffects"
                  value={vaccine.sideEffects || ""}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              {/* Actions */}
              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button
                  className="btn btn-primary admin-add2"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Updating..." : "Update Vaccine"}
                </button>

                <button
                  className="btn btn-outline-secondary admin-btn2"
                  type="button"
                  onClick={() => navigate("/admin/manage-vaccines")}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
