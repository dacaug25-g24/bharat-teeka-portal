import { useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile } from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function Profile() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const roleLabel = useMemo(() => {
    if (isParent) return "Parent";
    if (roleId === 3) return "Patient/User";
    return "User";
  }, [isParent, roleId]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    remarks: "",
  });

  const [initialForm, setInitialForm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");


  // Load profile from backend

  useEffect(() => {
    const load = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        setErr("");
        setMsg("");

        const data = await getProfile(user.userId);

        const next = {
          username: data?.username ?? user?.username ?? "",
          email: data?.email ?? user?.email ?? "",
          phone: data?.phone ?? user?.phone ?? "",
          address: data?.address ?? user?.address ?? "",
          remarks: data?.remarks ?? "",
        };

        setForm(next);
        setInitialForm(next);
      } catch (e) {
        const fallback = {
          username: user?.username || "",
          email: user?.email || "",
          phone: user?.phone || "",
          address: user?.address || "",
          remarks: "",
        };
        setForm(fallback);
        setInitialForm(fallback);
        setErr(getApiErrorMessage(e) || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.userId, user?.username, user?.email, user?.phone, user?.address]);

  const onChange = (e) => {
    setErr("");
    setMsg("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validate = (nextForm = form) => {
    const phone = (nextForm.phone || "").trim();
    const address = (nextForm.address || "").trim();

    if (!phone) return "Phone is required";
    if (!/^[6-9]\d{9}$/.test(phone))
      return "Enter a valid 10-digit Indian phone number";
    if (!address) return "Address is required";
    if (address.length < 5) return "Address must be at least 5 characters";

    return "";
  };

  const currentValidationError = useMemo(() => validate(form), [form]);

  const hasChanges = useMemo(() => {
    if (!initialForm) return false;
    return (
      form.phone.trim() !== (initialForm.phone || "").trim() ||
      form.address.trim() !== (initialForm.address || "").trim() ||
      form.remarks.trim() !== (initialForm.remarks || "").trim()
    );
  }, [form, initialForm]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    if (!user?.userId) {
      setErr("User not found. Please login again.");
      return;
    }

    try {
      setSaving(true);

      await updateProfile({
        userId: user.userId,
        phone: form.phone.trim(),
        address: form.address.trim(),
        remarks: form.remarks.trim() || null,
      });

      const updatedUser = {
        ...user,
        phone: form.phone.trim(),
        address: form.address.trim(),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMsg("✅ Profile updated successfully");
      setInitialForm({
        ...form,
        phone: form.phone.trim(),
        address: form.address.trim(),
        remarks: form.remarks.trim(),
      });
    } catch (e2) {
      setErr(getApiErrorMessage(e2) || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setErr("");
    setMsg("");
    if (initialForm) setForm(initialForm);
  };

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
            <div>
              <h5 className="mb-1">Profile</h5>
              {/* <div className="text-muted small">
                Role: <span className="fw-semibold">{roleLabel}</span>
              </div> */}
            </div>

            {loading && <span className="badge text-bg-light">Loading...</span>}
          </div>

          {err && <div className="alert alert-danger border-0 py-2">{err}</div>}
          {msg && <div className="alert alert-success border-0 py-2">{msg}</div>}

          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Username</label>
                <input className="form-control" value={form.username} disabled />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" value={form.email} disabled />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Enter phone"
                  maxLength={10}
                  disabled={loading}
                />
                <div className="form-text">
                  10-digit Indian number (starts with 6-9).
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Address *</label>
                <input
                  className="form-control"
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  placeholder="Enter address"
                  disabled={loading}
                />
              </div>

              <div className="col-12">
                <label className="form-label">Remarks (optional)</label>
                <textarea
                  className="form-control"
                  name="remarks"
                  value={form.remarks}
                  onChange={onChange}
                  rows={3}
                  placeholder="Notes, allergies, etc."
                  disabled={loading}
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={
                    loading ||
                    saving ||
                    Boolean(currentValidationError) ||
                    !hasChanges
                  }
                  title={
                    currentValidationError ||
                    (!hasChanges ? "No changes to save" : "")
                  }
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleReset}
                  disabled={loading || saving}
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
