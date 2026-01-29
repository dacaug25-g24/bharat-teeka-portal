import { useEffect, useMemo, useState } from "react";
import {
  getParentChildren,
  addChild,
  deleteChild,
} from "../../../services/patientService";
import { getApiErrorMessage } from "../../../services/apiClients";

export default function AddBeneficiary() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  // State
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    aadharNumber: "",
    bloodGroup: "",
    relationId: "",
    remarks: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Relations

  const relations = useMemo(
    () => [
      { id: 1, name: "Father" },
      { id: 2, name: "Mother" },
      { id: 3, name: "Guardian" },
      { id: 4, name: "Grandfather" },
      { id: 5, name: "Grandmother" },
      { id: 6, name: "Uncle" },
      { id: 7, name: "Aunt" },
      { id: 8, name: "Son" },
      { id: 9, name: "Daughter" },
    ],
    []
  );

  // Load beneficiaries

  useEffect(() => {
    const loadChildren = async () => {
      if (!isParent || !user?.userId) return;

      try {
        setLoadingList(true);
        const data = await getParentChildren(user.userId);
        setBeneficiaries(Array.isArray(data) ? data : []);
      } catch (e) {
        setBeneficiaries([]);
        setError(getApiErrorMessage(e) || "Failed to load beneficiaries");
      } finally {
        setLoadingList(false);
      }
    };

    loadChildren();
  }, [isParent, user?.userId]);

  // Handlers
  const onChange = (e) => {
    setError("");
    setSuccess("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      aadharNumber: "",
      bloodGroup: "",
      relationId: "",
      remarks: "",
    });
  };

  const validate = () => {
    if (!form.firstName.trim()) return "First name is required";
    if (!form.lastName.trim()) return "Last name is required";
    if (!form.dateOfBirth) return "Date of birth is required";
    if (!form.gender) return "Gender is required";
    if (!form.bloodGroup) return "Blood group is required";
    if (!form.relationId) return "Relation is required";

    const aad = form.aadharNumber.trim();
    if (!aad) return "Aadhaar is required";
    if (!/^\d{12}$/.test(aad)) return "Aadhaar must be exactly 12 digits";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isParent) {
      setError("Only Parent users can add beneficiaries.");
      return;
    }

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        aadharNumber: form.aadharNumber.trim(),
        bloodGroup: form.bloodGroup,
        relationId: Number(form.relationId),
        remarks: form.remarks?.trim() || null,
      };

      await addChild({
        parentUserId: user.userId,
        payload,
      });

      setSuccess("✅ Beneficiary added successfully");
      resetForm();

      // reload list
      const data = await getParentChildren(user.userId);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiErrorMessage(e) || "Failed to add beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (patientId) => {
    if (!isParent) return;

    const ok = window.confirm(
      "Are you sure you want to remove this beneficiary?"
    );
    if (!ok) return;

    try {
      setError("");
      setSuccess("");

      await deleteChild({
        parentUserId: user.userId,
        patientId,
      });

      setSuccess("✅ Beneficiary removed successfully");

      // refresh list
      const data = await getParentChildren(user.userId);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiErrorMessage(e) || "Failed to remove beneficiary");
    }
  };


  // UI
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 className="mb-1">Beneficiaries</h5>
          <div className="text-muted small">
            Add and manage beneficiaries.
          </div>
        </div>
      </div>

      {!isParent && (
        <div className="alert alert-warning border-0">
          Only <b>Parent</b> users can manage beneficiaries.
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-3">
        {/* Add Form */}
        <div className="col-12 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h6 className="fw-semibold mb-3">Add Beneficiary</h6>

              <form onSubmit={handleSubmit}>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">First Name *</label>
                    <input
                      className="form-control"
                      name="firstName"
                      value={form.firstName}
                      onChange={onChange}
                      disabled={!isParent}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name *</label>
                    <input
                      className="form-control"
                      name="lastName"
                      value={form.lastName}
                      onChange={onChange}
                      disabled={!isParent}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={onChange}
                      disabled={!isParent}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Gender *</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={form.gender}
                      onChange={onChange}
                      disabled={!isParent}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Aadhaar *</label>
                    <input
                      className="form-control"
                      name="aadharNumber"
                      value={form.aadharNumber}
                      onChange={onChange}
                      maxLength={12}
                      disabled={!isParent}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Blood Group *</label>
                    <select
                      className="form-select"
                      name="bloodGroup"
                      value={form.bloodGroup}
                      onChange={onChange}
                      disabled={!isParent}
                    >
                      <option value="">Select</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Relation *</label>
                    <select
                      className="form-select"
                      name="relationId"
                      value={form.relationId}
                      onChange={onChange}
                      disabled={!isParent}
                    >
                      <option value="">Select</option>
                      {relations.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Remarks</label>
                    <textarea
                      className="form-control"
                      name="remarks"
                      value={form.remarks}
                      onChange={onChange}
                      rows={2}
                      disabled={!isParent}
                    />
                  </div>

                  <div className="col-12 d-flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!isParent || submitting}
                    >
                      {submitting ? "Adding..." : "Add Beneficiary"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={resetForm}
                      disabled={!isParent}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <h6 className="fw-semibold mb-0">Your Beneficiaries</h6>
                <span className="badge text-bg-light">
                  {beneficiaries.length}
                </span>
              </div>

              {loadingList ? (
                <div className="text-muted">Loading...</div>
              ) : beneficiaries.length === 0 ? (
                <div className="text-muted">No beneficiaries added yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>DOB</th>
                        <th>Gender</th>
                        <th>Relation</th>
                        <th>Blood</th>
                        <th>Patient ID</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {beneficiaries.map((b) => (
                        <tr key={b.patientId}>
                          <td className="fw-semibold">
                            {b.firstName} {b.lastName}
                          </td>
                          <td>{b.dateOfBirth}</td>
                          <td>{b.gender}</td>
                          <td>
                            {relations.find(r => r.id === b.relationId)?.name || "-"}
                          </td>
                          <td>{b.bloodGroup}</td>
                          <td>{b.patientId}</td>

                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(b.patientId)}
                            >
                              Delete
                            </button>
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
      </div>
    </div>
  );
}
