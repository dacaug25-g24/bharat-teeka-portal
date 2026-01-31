import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../services/adminApi";
import "./admin-ui.css";

const TOKEN_KEY = "token";

export default function ApprovedHospitals() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    roleId: 2,
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    hospitalName: "",
    registrationNo: "",
    hospitalType: "",
    stateId: "",
    cityId: "",
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingStates, setLoadingStates] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleAuthError = (error, fallbackMsg) => {
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

  const toNumberOrEmpty = (v) => {
    if (v === "" || v === null || v === undefined) return "";
    const n = Number(v);
    return Number.isNaN(n) ? "" : n;
  };

  // ✅ Load states
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await adminApi.get("/api/admin/getallstates", {
          headers: getAuthHeaders(),
        });
        setStates(res.data || []);
      } catch (err) {
        console.error("States load error:", err);
        setStates([]);
        handleAuthError(err, "Failed to load states");
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // ✅ When state changes, load cities
  const handleStateChange = async (e) => {
    const stateId = e.target.value;

    setForm((p) => ({
      ...p,
      stateId,
      cityId: "",
    }));

    setCities([]);

    if (!stateId) return;

    setLoadingCities(true);
    try {
      const res = await adminApi.get(`/api/admin/getcitiesbystate/${stateId}`, {
        headers: getAuthHeaders(),
      });
      setCities(res.data || []);
    } catch (err) {
      console.error("Cities load error:", err);
      setCities([]);
      handleAuthError(err, "Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const resetForm = () => {
    setForm({
      roleId: 2,
      username: "",
      password: "",
      email: "",
      phone: "",
      address: "",
      hospitalName: "",
      registrationNo: "",
      hospitalType: "",
      stateId: "",
      cityId: "",
    });
    setCities([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        roleId: 2, // fixed
        stateId: toNumberOrEmpty(form.stateId),
        cityId: toNumberOrEmpty(form.cityId),
      };

      await adminApi.post("/api/admin/addhospital", payload, {
        headers: getAuthHeaders(),
      });

      alert("Hospital added successfully!");
      resetForm();
    } catch (error) {
      console.error("Add hospital error:", error);
      handleAuthError(error, "Failed to add hospital");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-3">
      <div className="card admin-card2">
        <div className="card-body">
          {/* Header */}
          <div className="admin-header">
            <div>
              <h4 className="admin-title2 mb-1">Add Approved Hospital</h4>
              <div className="admin-subtitle2">
                Create hospital account & details
              </div>
            </div>

            <div className="admin-mini-note">
              roleId: <b>2</b> (Hospital)
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Section: Hospital */}
              <div className="col-12">
                <div className="admin-section-title">Hospital Details</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Hospital Name</label>
                <input
                  className="form-control admin-input2"
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Registration No</label>
                <input
                  className="form-control admin-input2"
                  name="registrationNo"
                  value={form.registrationNo}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Hospital Type</label>
                <select
                  className="form-select admin-input2"
                  name="hospitalType"
                  value={form.hospitalType}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="">Select Hospital Type</option>
                  <option value="GOVERNMENT">Government</option>
                  <option value="PRIVATE">Private</option>
                  <option value="TRUST">Trust</option>
                </select>
              </div>

              {/* State Dropdown */}
              <div className="col-md-6">
                <label className="form-label">State</label>
                <select
                  className="form-select admin-input2"
                  name="stateId"
                  value={form.stateId}
                  onChange={handleStateChange}
                  required
                  disabled={submitting || loadingStates}
                >
                  <option value="">
                    {loadingStates ? "Loading states..." : "Select State"}
                  </option>

                  {states.map((s) => (
                    <option key={s.stateId} value={s.stateId}>
                      {s.stateName}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Dropdown */}
              <div className="col-md-6">
                <label className="form-label">City</label>
                <select
                  className="form-select admin-input2"
                  name="cityId"
                  value={form.cityId}
                  onChange={handleChange}
                  disabled={
                    submitting ||
                    !form.stateId ||
                    loadingCities ||
                    !cities.length
                  }
                  required
                >
                  <option value="">
                    {loadingCities
                      ? "Loading cities..."
                      : !form.stateId
                        ? "Select state first"
                        : !cities.length
                          ? "No cities found"
                          : "Select City"}
                  </option>

                  {cities.map((c) => (
                    <option key={c.cityId} value={c.cityId}>
                      {c.cityName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Section: Login */}
              <div className="col-12">
                <div className="admin-section-title">Login Details</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input
                  className="form-control admin-input2"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Password</label>
                <input
                  className="form-control admin-input2"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-12">
                <hr className="admin-hr" />
              </div>

              {/* Section: Contact */}
              <div className="col-12">
                <div className="admin-section-title">Contact Details</div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  className="form-control admin-input2"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  className="form-control admin-input2"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control admin-input2"
                  rows="2"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              {/* Actions */}
              <div className="col-12 d-flex gap-2 flex-wrap mt-2">
                <button
                  className="btn btn-primary admin-add2"
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Add Hospital"}
                </button>

                <button
                  className="btn btn-outline-secondary admin-btn2"
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>

          {/* Bottom info */}
          <div className="admin-info mt-3">
            <div className="small">
              <b>Note:</b> <code>roleId</code> is fixed to <b>2</b>. Select{" "}
              <b>State</b> first, then <b>City</b>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
