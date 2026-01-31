import { useEffect, useMemo, useState } from "react";
import "./vaccination-records.css";
import {
  hospitalApi,
  authApi,
  getApiErrorMessage,
} from "../../../services/apiClients";

export default function VaccinationRecords() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const hospitalId = user?.hospitalId;

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [from, setFrom] = useState(todayISO);
  const [to, setTo] = useState(todayISO);

  const [query, setQuery] = useState(""); // name / aadhaar / patientId
  const [vaccineQuery, setVaccineQuery] = useState("");
  const [slotQuery, setSlotQuery] = useState("");

  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [patientMap, setPatientMap] = useState({});

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", msg: "" });

  const showNotice = (type, msg) => {
    setNotice({ type, msg });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(
      () => setNotice({ type: "", msg: "" }),
      2500,
    );
  };

  const validate = () => {
    if (!hospitalId) {
      showNotice("danger", "Hospital ID not found. Please login again.");
      return false;
    }
    if (!from || !to) {
      showNotice("danger", "Select From and To dates.");
      return false;
    }
    if (from > to) {
      showNotice("danger", "From date cannot be after To date.");
      return false;
    }
    return true;
  };

  const fetchPatientBasics = async (patientIds) => {
    const unique = [...new Set(patientIds.filter(Boolean))];
    const missing = unique.filter((id) => !patientMap[id]);
    if (missing.length === 0) return;

    const results = await Promise.allSettled(
      missing.map((id) =>
        authApi.get(`/auth/patients/${id}/basic`).then((r) => r.data),
      ),
    );

    const next = {};
    results.forEach((res, idx) => {
      const id = missing[idx];
      if (res.status === "fulfilled" && res.value) next[id] = res.value;
    });

    setPatientMap((prev) => ({ ...prev, ...next }));
  };

  const loadRecords = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await hospitalApi.get(
        `/hospital/vaccinations/hospital/${hospitalId}`,
        {
          params: { from, to },
        },
      );

      const arr = Array.isArray(res.data) ? res.data : [];
      setRecords(arr);

      const ids = arr.map((r) => r.patientId).filter(Boolean);
      await fetchPatientBasics(ids);

      showNotice("success", `Loaded ${arr.length} records`);
    } catch (e) {
      console.error(e);
      showNotice(
        "danger",
        `Unable to load vaccination records: ${getApiErrorMessage(e)}`,
      );
      setRecords([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load on open
  useEffect(() => {
    if (!hospitalId) return;
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  // Filter client-side
  useEffect(() => {
    const q = query.trim().toLowerCase();
    const vq = vaccineQuery.trim().toLowerCase();
    const sq = slotQuery.trim().toLowerCase();

    const next = records.filter((r) => {
      const pid = String(r.patientId || "");
      const aadhaar = String(
        patientMap?.[r.patientId]?.aadhaarNumber || "",
      ).toLowerCase();
      const name = String(
        patientMap?.[r.patientId]?.fullName || "",
      ).toLowerCase();

      const vaccineName = String(r?.vaccine?.vaccineName || "").toLowerCase();
      const slotId = String(r.slotId || "");

      const matchPatient =
        !q || pid.includes(q) || aadhaar.includes(q) || name.includes(q);
      const matchVaccine = !vq || vaccineName.includes(vq);
      const matchSlot = !sq || slotId.includes(sq);

      return matchPatient && matchVaccine && matchSlot;
    });

    setFiltered(next);
  }, [query, vaccineQuery, slotQuery, records, patientMap]);

  const clearFilters = () => {
    setQuery("");
    setVaccineQuery("");
    setSlotQuery("");
    showNotice("success", "Filters cleared");
  };

  return (
    <div className="container-fluid p-0">
      <div className="btp-page-head">
        <div>
          <div className="btp-page-title">Vaccination Records</div>
          <div className="btp-page-sub">
            Track patient vaccination history by date, vaccine, slot and batch
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={loadRecords}
          disabled={loading}
          type="button"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {notice.msg && (
        <div className={`alert alert-${notice.type} py-2`} role="alert">
          {notice.msg}
        </div>
      )}

      <div className="card hospital-card p-0 mb-3">
        <div className="btp-filters">
          <div className="btp-filter-grid">
            <div className="btp-filter-group">
              <label>From</label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>

            <div className="btp-filter-group">
              <label>To</label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="btp-filter-actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setFrom(todayISO);
                  setTo(todayISO);
                }}
                disabled={loading}
                type="button"
              >
                Today
              </button>

              <button
                className="btn btn-primary"
                onClick={loadRecords}
                disabled={loading}
                type="button"
              >
                Apply Date
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={clearFilters}
                disabled={loading}
                type="button"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <hr className="my-3" />

          <div className="btp-filter-grid btp-filter-grid-3">
            <div className="btp-filter-group">
              <label>Patient Search</label>
              <input
                placeholder="Name / Aadhaar / PatientId"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="btp-filter-group">
              <label>Vaccine</label>
              <input
                placeholder="e.g. Covaxin"
                value={vaccineQuery}
                onChange={(e) => setVaccineQuery(e.target.value)}
              />
            </div>

            <div className="btp-filter-group">
              <label>Slot Id</label>
              <input
                placeholder="e.g. 12"
                value={slotQuery}
                onChange={(e) => setSlotQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card hospital-card p-3">
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <div className="fw-bold">Records</div>
          <small className="text-muted">
            Showing {filtered.length} / {records.length}
          </small>
        </div>

        {filtered.length === 0 ? (
          <div className="text-muted" style={{ fontSize: 14 }}>
            No records found.
          </div>
        ) : (
          <div className="btp-table-wrap">
            <div style={{ overflowX: "auto" }}>
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 90 }}>Record</th>
                    <th style={{ minWidth: 180 }}>Patient</th>
                    <th style={{ width: 160 }}>Aadhaar</th>
                    <th style={{ minWidth: 140 }}>Vaccine</th>
                    <th style={{ width: 80 }}>Dose</th>
                    <th style={{ width: 140 }}>Batch</th>
                    <th style={{ width: 130 }}>Date</th>
                    <th style={{ width: 90 }}>Slot</th>
                    <th style={{ width: 90 }}>Appt</th>
                    <th style={{ minWidth: 160 }}>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => {
                    const p = patientMap?.[r.patientId];
                    return (
                      <tr key={r.recordId}>
                        <td className="fw-semibold">{r.recordId}</td>
                        <td>{p?.fullName || `Patient #${r.patientId}`}</td>
                        <td>{p?.aadhaarNumber || "-"}</td>
                        <td className="fw-semibold">
                          {r?.vaccine?.vaccineName || "-"}
                        </td>
                        <td>{r.doseNumber}</td>
                        <td>{r.batchNumber || "-"}</td>
                        <td>{r.vaccinationDate || "-"}</td>
                        <td>{r.slotId || "-"}</td>
                        <td>{r.appointmentId || "-"}</td>
                        <td>{r.remarks || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
