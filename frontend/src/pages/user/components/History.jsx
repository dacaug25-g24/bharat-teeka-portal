import useHistoryData from "./hooks/useHistoryData";
import { getStatusBadgeClass } from "./utils/historyMappers";
import { downloadCertificatePdfByAppointment } from "../../../services/patientService";

import { saveBlobAsFile } from "./utils/downloadHelpers";
import { useMemo, useState } from "react";

/*
  This file is only UI.
  All history fetching logic is inside useHistoryData hook.
*/

export default function History() {
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    isParent,

    tab,
    setTab,

    selectedChild,
    setSelectedChild,

    beneficiaries,
    loadingBeneficiaries,

    loadingProfile,
    loadingRows,

    error,
    setError,

    displayRows,
    canFetch,

    cancellingId,
    handleCancel,
  } = useHistoryData();

  // ✅ download loading states
  const [downloadingLatest, setDownloadingLatest] = useState(false);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [downloadingApptId, setDownloadingApptId] = useState(null);

  // ✅ helper: completed check (handle different casing)
  const isCompleted = (status) =>
    String(status || "").trim().toUpperCase() === "COMPLETED";

  // ✅ helper: booked check
  const isBooked = (status) =>
    String(status || "").trim().toUpperCase() === "BOOKED";

  // ✅ UI FIX (ONLY): If Beneficiary tab is selected but no beneficiary chosen,
  // show EMPTY table (don’t show parent/self rows).
  const rowsToShow = useMemo(() => {
    const noChildSelected =
      tab === "beneficiary" &&
      (!selectedChild || String(selectedChild).trim() === "");
    return noChildSelected ? [] : displayRows;
  }, [tab, selectedChild, displayRows]);

  const handleDownloadLatest = async () => {
    const completed = (displayRows || []).filter((r) => isCompleted(r.status));

    if (completed.length === 0) {
      setError("No completed vaccinations available to download.");
      return;
    }

    // pick latest by appointment id (simple)
    const latest = completed.reduce(
      (max, cur) => (cur.id > max.id ? cur : max),
      completed[0]
    );

    setError("");
    setDownloadingLatest(true);

    try {
      const blob = await downloadCertificatePdfByAppointment(latest.id);
      saveBlobAsFile(
        blob,
        `vaccination_certificate_latest_appt_${latest.id}.pdf`
      );
    } catch (e) {
      setError("Certificate not available for latest completed appointment.");
    } finally {
      setDownloadingLatest(false);
    }
  };

  const handleDownloadByAppointment = async (appointmentId) => {
    setError("");
    setDownloadingApptId(appointmentId);

    try {
      const blob = await downloadCertificatePdfByAppointment(appointmentId);
      saveBlobAsFile(blob, `vaccination_certificate_appt_${appointmentId}.pdf`);
    } catch (e) {
      setError("Certificate not available for this appointment.");
    } finally {
      setDownloadingApptId(null);
    }
  };

  const handleDownloadAllCompleted = async () => {
    const completed = (displayRows || []).filter((r) => isCompleted(r.status));

    if (completed.length === 0) {
      setError("No completed vaccinations available to download.");
      return;
    }

    setError("");
    setDownloadingAll(true);

    try {
      for (const r of completed) {
        setDownloadingApptId(r.id);
        const blob = await downloadCertificatePdfByAppointment(r.id);
        saveBlobAsFile(blob, `vaccination_certificate_appt_${r.id}.pdf`);
      }
    } catch (e) {
      setError("Some certificates could not be downloaded.");
    } finally {
      setDownloadingApptId(null);
      setDownloadingAll(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="mb-1">History</h5>
              <div className="text-muted small">
                Appointment and vaccination history
              </div>
            </div>

            {/* ✅ Certificate buttons */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-success"
                onClick={handleDownloadLatest}
                disabled={loadingRows || downloadingLatest || !canFetch}
                title="Downloads latest completed vaccination certificate"
              >
                {downloadingLatest ? "Downloading..." : "Download Latest"}
              </button>

              <button
                className="btn btn-sm btn-outline-success"
                onClick={handleDownloadAllCompleted}
                disabled={loadingRows || downloadingAll || !canFetch}
                title="Downloads all completed certificates (multiple PDFs)"
              >
                {downloadingAll ? "Downloading..." : "Download All Completed"}
              </button>

              {(loadingProfile || loadingRows) && (
                <span className="badge text-bg-light align-self-center">
                  Loading...
                </span>
              )}
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Tabs */}
          <div className="d-flex gap-2 mb-3">
            <button
              className={`btn btn-sm ${
                tab === "self" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setTab("self");
                setSelectedChild("");
                setError("");
              }}
            >
              Self
            </button>

            <button
              className={`btn btn-sm ${
                tab === "beneficiary" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => {
                setTab("beneficiary");
                setSelectedChild(""); // ✅ keep empty until user selects a child
                setError("");
              }}
              disabled={!isParent}
            >
              Beneficiary
            </button>
          </div>

          {/* Beneficiary dropdown */}
          {isParent && tab === "beneficiary" && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Select Beneficiary
              </label>

              <select
                className="form-select"
                value={selectedChild}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedChild(val);
                }}
                disabled={loadingBeneficiaries}
              >
                <option value="">Select</option>
                {beneficiaries.map((b) => (
                  <option key={b.patientId} value={b.patientId}>
                    {b.firstName} {b.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {!canFetch && (
            <div className="alert alert-light border small">
              {tab === "self"
                ? "Waiting for your patient profile..."
                : "Select a beneficiary to view history."}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Hospital</th>
                  <th>Vaccine</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th style={{ width: 220 }}>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingRows ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      Loading history...
                    </td>
                  </tr>
                ) : rowsToShow.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-4">
                      {tab === "beneficiary"
                        ? "Select a beneficiary to view history."
                        : "No records found."}
                    </td>
                  </tr>
                ) : (
                  rowsToShow.map((r) => (
                    <tr key={r.key}>
                      <td>{r.id}</td>
                      <td className="fw-semibold">{r.hospital}</td>
                      <td>{r.vaccine}</td>
                      <td>{r.date}</td>
                      <td>{r.time}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(r.status)}`}>
                          {r.status}
                        </span>
                      </td>

                      <td className="d-flex gap-2">
                        {/* Cancel only for BOOKED */}
                        {isBooked(r.status) && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(r.id)}
                            disabled={cancellingId === r.id}
                          >
                            {cancellingId === r.id ? "Cancelling..." : "Cancel"}
                          </button>
                        )}

                        {/* Download only for COMPLETED */}
                        {isCompleted(r.status) ? (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleDownloadByAppointment(r.id)}
                            disabled={downloadingApptId === r.id}
                            title="Download certificate for this record"
                          >
                            {downloadingApptId === r.id
                              ? "Downloading..."
                              : "Certificate"}
                          </button>
                        ) : (
                          !isBooked(r.status) && (
                            <span className="text-muted small align-self-center">
                              -
                            </span>
                          )
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Small footer note */}
          <div className="text-muted small mt-2">
            Certificates are available only after vaccination status is{" "}
            <b>COMPLETED</b>.
          </div>
        </div>
      </div>
    </div>
  );
}
