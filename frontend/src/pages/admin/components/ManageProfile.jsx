import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./admin-ui.css";

const API = import.meta.env.VITE_ADMIN_API || "https://localhost:7233";
const PHOTO_KEY = "admin_profile_photo";

export default function ManageProfile() {
  const [profile, setProfile] = useState({
    userId: "",
    username: "",
    email: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // profile photo (local only)
  const [photo, setPhoto] = useState(localStorage.getItem(PHOTO_KEY) || "");

  // initials fallback
  const initials = useMemo(() => {
    const name = (profile.username || "Admin").trim();
    const parts = name.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "A") + (parts[1]?.[0] || "")).toUpperCase();
  }, [profile.username]);

  // fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/getadminprofile`);
      setProfile(res.data || {});
    } catch (error) {
      console.error(error);
      alert("Failed to load admin profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // validation
  const validate = () => {
    const e = {};

    // email validation
    if (!profile.email) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      e.email = "Enter a valid email address";
    }

    // phone validation (10–15 digits)
    if (!profile.phone) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(profile.phone)) {
      e.phone = "Phone must contain 10–15 digits";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await axios.put(`${API}/api/admin/updateadminprofile`, profile);
      alert("Profile updated successfully");
      fetchAdminProfile();
    } catch (error) {
      console.error(error);
      alert(error.response?.data || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // photo upload (local preview)
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      alert("Upload JPG, PNG or WEBP only");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPhoto(base64);
      localStorage.setItem(PHOTO_KEY, base64);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto("");
    localStorage.removeItem(PHOTO_KEY);
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="spinner-border spinner-border-sm" />
        <span className="text-muted">Loading admin profile...</span>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-3">
        {/* LEFT PROFILE CARD */}
        <div className="col-12 col-lg-4">
          <div className="card admin-card border-0">
            <div className="card-body">
              <div className="admin-profile-header">
                <div className="admin-avatar">
                  {photo ? (
                    <img src={photo} alt="Admin" className="admin-avatar-img" />
                  ) : (
                    <div className="admin-avatar-fallback">{initials}</div>
                  )}
                </div>

                <div className="admin-profile-meta">
                  <div className="admin-profile-name">{profile.username}</div>
                  <div className="admin-profile-sub">{profile.email}</div>
                  <div className="admin-profile-chip">ADMIN</div>
                </div>
              </div>

              <div className="admin-profile-actions mt-3">
                <label className="btn btn-primary admin-btn mb-0">
                  Upload Photo
                  <input type="file" hidden onChange={handlePhotoChange} />
                </label>

                <button
                  className="btn btn-outline-secondary admin-btn-outline"
                  type="button"
                  onClick={removePhoto}
                  disabled={!photo}
                >
                  Remove
                </button>
              </div>

              <div className="admin-profile-info mt-3">
                <div className="admin-kv">
                  <div className="admin-k">Phone</div>
                  <div className="admin-v">{profile.phone || "-"}</div>
                </div>

                <div className="admin-kv">
                  <div className="admin-k">Address</div>
                  <div className="admin-v">{profile.address || "-"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="col-12 col-lg-8">
          <div className="card admin-card border-0">
            <div className="card-body">
              <h4 className="admin-page-title mb-2">Manage Profile</h4>
              <div className="admin-page-subtitle mb-3">
                Username cannot be changed
              </div>

              <form onSubmit={handleUpdate} className="admin-form">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Username</label>
                    <input className="form-control" value={profile.username} disabled />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback">{errors.phone}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 d-flex gap-2 admin-tight-actions">
                    <button
                      className="btn btn-primary admin-btn"
                      type="submit"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      className="btn btn-outline-secondary admin-btn-outline"
                      type="button"
                      onClick={fetchAdminProfile}
                      disabled={saving}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>

              <div className="admin-hint mt-3">
                Profile photo is stored locally. Backend upload can be added later.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
