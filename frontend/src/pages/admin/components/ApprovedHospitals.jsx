import { useEffect, useState } from "react";
import axios from "axios";
import "./admin-ui.css";

const API = import.meta.env.VITE_ADMIN_API || "https://localhost:7233";

export default function ApprovedHospitals() {
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

  const [submitting, setSubmitting] = useState(false);

  // ✅ Load states on page load
  useEffect(() => {
    axios
      .get(`${API}/api/admin/getallstates`)
      .then((res) => setStates(res.data || []))
      .catch((err) => {
        console.error("States load error:", err);
        setStates([]);
      });
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

    if (!stateId) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    try {
      const res = await axios.get(
        `${API}/api/admin/getcitiesbystate/${stateId}`
      );
      setCities(res.data || []);
    } catch (err) {
      console.error("Cities load error:", err);
      setCities([]);
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
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        stateId: form.stateId === "" ? "" : Number(form.stateId),
        cityId: form.cityId === "" ? "" : Number(form.cityId),
      };

      await axios.post(`${API}/api/admin/addhospital`, payload);

      alert("Hospital added successfully!");
      resetForm();
    } catch (error) {
      console.error("Add hospital error:", error);
      alert(error.response?.data || "Failed to add hospital");
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
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.stateId} value={s.stateId}>
                      {s.stateName}
                    </option>
                  ))}
                </select>
              </div>

              {/*City Dropdown (dependent) */}
              <div className="col-md-6">
                <label className="form-label">City</label>
                <select
                  className="form-select admin-input2"
                  name="cityId"
                  value={form.cityId}
                  onChange={handleChange}
                  disabled={!form.stateId || loadingCities || !cities.length}
                  required
                >
                  <option value="">
                    {loadingCities
                      ? "Loading cities..."
                      : !form.stateId
                      ? "Select state first"
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
