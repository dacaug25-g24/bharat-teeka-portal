import { useEffect, useMemo, useState } from "react";
import "./slots.css";

const API = import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";

export default function SlotForm({
  hospitalId,
  slot,
  onSuccess,
  onError,
  onClose,
}) {
  const [vaccines, setVaccines] = useState([]);
  const [loadingVaccines, setLoadingVaccines] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEdit = useMemo(() => Boolean(slot?.slotId), [slot]);
  const todayISO = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    vaccineId: "",
  });

  const [fieldError, setFieldError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoadingVaccines(true);

    fetch(`${API}/hospital/vaccines`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        setVaccines(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!mounted) return;
        onError?.("Failed to load vaccines");
      })
      .finally(() => {
        if (!mounted) return;
        setLoadingVaccines(false);
      });

    return () => {
      mounted = false;
    };
  }, [onError]);

  useEffect(() => {
    setFieldError("");

    if (slot) {
      setForm({
        date: slot.date || "",
        startTime: slot.startTime || "",
        endTime: slot.endTime || "",
        capacity: slot.capacity ?? "",
        vaccineId: slot.vaccine?.vaccineId ?? "",
      });
    } else {
      setForm({
        date: "",
        startTime: "",
        endTime: "",
        capacity: "",
        vaccineId: "",
      });
    }
  }, [slot]);

  const handleChange = (e) => {
    setFieldError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearForm = () => {
    setFieldError("");
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      capacity: "",
      vaccineId: "",
    });
  };

  const validate = () => {
    if (!hospitalId) return "Hospital not logged in";
    if (!form.date) return "Please select a date";
    if (form.date < todayISO) return "You cannot create a slot in the past";
    if (!form.startTime) return "Please select start time";
    if (!form.endTime) return "Please select end time";
    if (form.endTime <= form.startTime)
      return "End time must be after start time";
    if (!form.capacity || Number(form.capacity) <= 0)
      return "Capacity must be greater than 0";
    if (!form.vaccineId) return "Please select a vaccine";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");

    const err = validate();
    if (err) {
      setFieldError(err);
      return;
    }

    const payload = {
      hospitalId,
      vaccineId: Number(form.vaccineId),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      capacity: Number(form.capacity),
    };

    try {
      setSaving(true);

      const url = isEdit
        ? `${API}/hospital/slots/${slot.slotId}`
        : `${API}/hospital/slots`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json().catch(() => null);

      onSuccess?.(
        isEdit ? "Slot updated successfully" : "Slot added successfully",
        saved,
      );

      if (!isEdit) clearForm();
    } catch {
      onError?.("Failed to save slot");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fieldError && (
        <div className="alert alert-danger py-2">{fieldError}</div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            min={todayISO}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            className="form-control"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">End Time</label>
          <input
            type="time"
            className="form-control"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label">Capacity</label>
          <input
            type="number"
            className="form-control"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            min="1"
          />
        </div>

        <div className="col-12 col-md-8">
          <label className="form-label">Vaccine</label>
          <select
            className="form-select"
            name="vaccineId"
            value={form.vaccineId}
            onChange={handleChange}
            disabled={loadingVaccines}
          >
            <option value="">-- Select Vaccine --</option>
            {vaccines.map((v) => (
              <option key={v.vaccineId} value={v.vaccineId}>
                {v.vaccineName}
              </option>
            ))}
          </select>
          {loadingVaccines && (
            <small className="text-muted">Loading vaccines…</small>
          )}
        </div>
      </div>

      {/* Button row (not full width) */}
      <div className="btp-form-actions">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={clearForm}
          disabled={saving}
        >
          Clear
        </button>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onClose}
          disabled={saving}
        >
          Close
        </button>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Update Slot" : "Add Slot"}
        </button>
      </div>
    </form>
  );
}
