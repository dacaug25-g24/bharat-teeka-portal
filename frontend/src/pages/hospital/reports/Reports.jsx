import { useEffect, useMemo, useRef, useState } from "react";
import "./reports.css";
import {
  hospitalApi,
  authApi,
  getApiErrorMessage,
} from "../../../services/apiClients";

export default function Reports() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const hospitalId = user?.hospitalId;

  const hospitalName =
    user?.hospitalName ||
    user?.username ||
    user?.name ||
    `Hospital ${hospitalId}`;

  const todayISO = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [from, setFrom] = useState(todayISO);
  const [to, setTo] = useState(todayISO);

  const [notice, setNotice] = useState({ type: "", msg: "" });

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [patientMap, setPatientMap] = useState({});

  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

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
      showNotice("danger", "Please select both From and To dates.");
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

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await hospitalApi.get(`/hospital/vaccinations/report/pdf`, {
        params: {
          hospitalId,
          from,
          to,
          hospitalName: hospitalName || "",
        },
        responseType: "blob", // ✅ important for file
      });

      downloadBlob(res.data, `vaccination_report_${from}_to_${to}.pdf`);
      showNotice("success", "PDF downloaded");
      setExportOpen(false);
    } catch (e) {
      console.error(e);
      showNotice("danger", `Download failed: ${getApiErrorMessage(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (!validate()) return;

    if (!rows.length) {
      showNotice(
        "danger",
        'Click "Show Data" first (Excel includes Patient + Aadhaar).',
      );
      return;
    }

    const escapeHtml = (v) =>
      String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const getPatientName = (pid) =>
      patientMap?.[pid]?.fullName || `Patient #${pid}`;
    const getAadhaar = (pid) => patientMap?.[pid]?.aadhaarNumber || "-";

    const html = `
      <html><head><meta charset="utf-8" /></head><body>
      <table border="1">
        <thead>
          <tr>
            <th>RecordId</th>
            <th>AppointmentId</th>
            <th>Patient</th>
            <th>Aadhaar</th>
            <th>Vaccine</th>
            <th>Dose</th>
            <th>Batch</th>
            <th>Date</th>
            <th>Slot</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map((r) => {
              const pid = r.patientId;
              return `
                <tr>
                  <td>${escapeHtml(r.recordId)}</td>
                  <td>${escapeHtml(r?.appointment?.appointmentId ?? r.appointmentId ?? "-")}</td>
                  <td>${escapeHtml(getPatientName(pid))}</td>
                  <td>${escapeHtml(getAadhaar(pid))}</td>
                  <td>${escapeHtml(r?.vaccine?.vaccineName ?? "-")}</td>
                  <td>${escapeHtml(r.doseNumber ?? "-")}</td>
                  <td>${escapeHtml(r.batchNumber ?? "-")}</td>
                  <td>${escapeHtml(r.vaccinationDate ?? "-")}</td>
                  <td>${escapeHtml(r.slotId ?? "-")}</td>
                  <td>${escapeHtml(r.remarks ?? "-")}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
      </body></html>
    `.trim();

    const blob = new Blob([html], {
      type: "application/vnd.ms-excel;charset=utf-8",
    });

    downloadBlob(blob, `vaccination_report_${from}_to_${to}.xls`);
    showNotice("success", "Excel downloaded");
    setExportOpen(false);
  };

  const loadPreview = async () => {
    if (!validate()) return;

    setLoading(true);
    setRows([]);

    try {
      const res = await hospitalApi.get(
        `/hospital/vaccinations/hospital/${hospitalId}`,
        { params: { from, to } },
      );

      const arr = Array.isArray(res.data) ? res.data : [];
      setRows(arr);

      const ids = arr.map((r) => r.patientId).filter(Boolean);
      await fetchPatientBasics(ids);

      showNotice("success", `Loaded ${arr.length} records`);
    } catch (e) {
      console.error(e);
      showNotice(
        "danger",
        `Unable to load report data: ${getApiErrorMessage(e)}`,
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const clearPreview = () => {
    setRows([]);
    showNotice("success", "Preview cleared");
  };

  useEffect(() => {
    if (!hospitalId) return;
    loadPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId]);

  useEffect(() => {
    const onDown = (e) => {
      if (!exportRef.current) return;
      if (exportOpen && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setExportOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [exportOpen]);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h5 className="mb-0 fw-bold">Reports</h5>
          <small className="text-muted">
            Download vaccination reports by date range
          </small>
        </div>
      </div>

      {notice.msg && (
        <div className={`alert alert-${notice.type} py-2`} role="alert">
          {notice.msg}
        </div>
      )}

      <div className="card hospital-card p-3">
        <div className="row g-3 align-items-end">
          <div className="col-12 col-lg-6">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label mb-1">From</label>
                <input
                  type="date"
                  className="form-control"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label mb-1">To</label>
                <input
                  type="date"
                  className="form-control"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="btp-reports-topbar">
              <div className="btp-reports-actions">
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
                  onClick={loadPreview}
                  disabled={loading}
                  type="button"
                >
                  {loading ? "Loading..." : "Show Data"}
                </button>

                <button
                  className="btn btn-outline-secondary"
                  onClick={clearPreview}
                  disabled={loading}
                  type="button"
                >
                  Clear View
                </button>
              </div>

              <div className="btp-export" ref={exportRef}>
                <button
                  className="btn btn-outline-dark btp-export-btn"
                  type="button"
                  disabled={loading}
                  onClick={() => setExportOpen((v) => !v)}
                >
                  Export <span className="btp-caret">▾</span>
                </button>

                {exportOpen && (
                  <div className="btp-export-menu">
                    <button
                      className="btp-export-item"
                      type="button"
                      onClick={downloadExcel}
                      disabled={loading}
                    >
                      📊 Download Excel
                    </button>
                    <button
                      className="btp-export-item"
                      type="button"
                      onClick={downloadPDF}
                      disabled={loading}
                    >
                      📄 Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card hospital-card p-3 mt-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Preview</h6>
          <small className="text-muted">Total: {rows.length}</small>
        </div>

        {rows.length === 0 ? (
          <div className="text-muted" style={{ fontSize: 14 }}>
            No preview loaded.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped align-middle">
              <thead className="table-light">
                <tr>
                  <th>RecordId</th>
                  <th>AppointmentId</th>
                  <th>Patient</th>
                  <th>Aadhaar</th>
                  <th>Vaccine</th>
                  <th>Dose</th>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>Slot</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const p = patientMap?.[r.patientId];
                  return (
                    <tr key={r.recordId}>
                      <td>{r.recordId}</td>
                      <td>
                        {r?.appointment?.appointmentId ??
                          r.appointmentId ??
                          "-"}
                      </td>
                      <td>{p?.fullName || `Patient #${r.patientId}`}</td>
                      <td>{p?.aadhaarNumber || "-"}</td>
                      <td>{r?.vaccine?.vaccineName || "-"}</td>
                      <td>{r.doseNumber}</td>
                      <td>{r.batchNumber}</td>
                      <td>{r.vaccinationDate}</td>
                      <td>{r.slotId ?? "-"}</td>
                      <td>{r.remarks || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card hospital-card p-3 mt-3">
        <h6 className="mb-2">What’s included</h6>
        <div className="text-muted" style={{ fontSize: 14 }}>
          RecordId, AppointmentId, Patient (Name), Aadhaar, Vaccine, DoseNumber,
          BatchNumber, VaccinationDate, SlotId, Remarks
        </div>
      </div>
    </div>
  );
}
