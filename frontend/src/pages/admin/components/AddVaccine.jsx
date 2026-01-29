import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./admin-ui.css";

const API = import.meta.env.VITE_ADMIN_API || "https://localhost:7233";

export default function AddVaccine() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const [vaccine, setVaccine] = useState({
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

  const handleChange = (e) => {
    setVaccine((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post(`${API}/api/admin/addvaccine`, vaccine);
      alert("Vaccine added successfully!");
      navigate("/admin/manage-vaccines");
    } catch (error) {
      console.error(error);
      alert("Failed to add vaccine");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="card admin-card2">
        <div className="card-body">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h4 className="admin-title2 mb-1">Add Vaccine</h4>
              <div className="admin-subtitle2">Create a new vaccine entry</div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-light admin-btn2"
                type="button"
                onClick={() => navigate(-1)}
              >
                ← Back
              </button>
            </div>
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
                  value={vaccine.vaccineName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Manufacturer</label>
                <input
                  className="form-control admin-input2"
                  name="manufacturer"
                  value={vaccine.manufacturer}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Vaccine Type</label>
                <input
                  className="form-control admin-input2"
                  name="vaccineType"
                  value={vaccine.vaccineType}
                  onChange={handleChange}
                  placeholder="mRNA / Viral Vector / Inactivated..."
                />
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Dose & Age */}
              <div className="col-12">
                <div className="admin-section-title">Age & Dose Details</div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Min Age</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="minAge"
                  value={vaccine.minAge}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Max Age</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="maxAge"
                  value={vaccine.maxAge}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Doses Required</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="doseRequired"
                  value={vaccine.doseRequired}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Dose Gap (Days)</label>
                <input
                  className="form-control admin-input2"
                  type="number"
                  name="doseGapDays"
                  value={vaccine.doseGapDays}
                  onChange={handleChange}
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
                  value={vaccine.storageTemperature}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Expiry Date</label>
                <input
                  className="form-control admin-input2"
                  type="date"
                  name="expiryDate"
                  value={vaccine.expiryDate}
                  onChange={handleChange}
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
                  value={vaccine.description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Side Effects</label>
                <textarea
                  className="form-control admin-input2"
                  rows="3"
                  name="sideEffects"
                  value={vaccine.sideEffects}
                  onChange={handleChange}
                />
              </div>

              {/* Actions */}
              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button
                  className="btn btn-primary admin-add2"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Vaccine"}
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
