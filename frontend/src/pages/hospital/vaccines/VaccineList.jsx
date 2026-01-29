import { useEffect, useMemo, useState } from "react";
import "./vaccines.css";

const API = import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";

export default function VaccineList() {
  const [vaccines, setVaccines] = useState([]);
  const [selected, setSelected] = useState(null);

  const [nameQuery, setNameQuery] = useState("");
  const [idQuery, setIdQuery] = useState("");

  const [expiringOnly, setExpiringOnly] = useState(false);
  const [expiringDays, setExpiringDays] = useState(30);

  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState({ type: "", message: "" });

  const showNotice = (type, message) => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => {
      setNotice({ type: "", message: "" });
    }, 2500);
  };

  const safeArray = (data) => (Array.isArray(data) ? data : []);

  const fetchAll = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${API}/hospital/vaccines`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const arr = safeArray(data);
      setVaccines(arr);

      if (selected?.vaccineId) {
        const found = arr.find((v) => v.vaccineId === selected.vaccineId);
        if (found) setSelected(found);
      }

      if (!silent) showNotice("success", "Vaccines loaded successfully");
    } catch {
      setVaccines([]);
      setSelected(null);
      showNotice("error", "Unable to fetch vaccines");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchById = async () => {
    const id = Number(idQuery);
    if (!id || id < 1) {
      showNotice("error", "Enter a valid Vaccine ID");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/hospital/vaccines/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSelected(data);
      showNotice("success", `Vaccine #${id} loaded`);
    } catch {
      showNotice("error", `Vaccine not found for ID ${id}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchByName = async () => {
    const q = nameQuery.trim();
    if (!q) {
      showNotice("error", "Type a vaccine name to search");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${API}/hospital/vaccines/search?name=${encodeURIComponent(q)}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVaccines(safeArray(data));
      setSelected(null);
      showNotice("success", `Search results for "${q}"`);
    } catch {
      setVaccines([]);
      setSelected(null);
      showNotice("error", "Unable to search vaccines");
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiring = async () => {
    const days = Number(expiringDays) || 30;

    setLoading(true);
    try {
      const res = await fetch(`${API}/hospital/vaccines/expiring?days=${days}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVaccines(safeArray(data));
      setSelected(null);
      showNotice("success", `Vaccines expiring in ${days} days`);
    } catch {
      setVaccines([]);
      setSelected(null);
      showNotice("error", "Unable to fetch expiring vaccines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (expiringOnly) fetchExpiring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expiringOnly]);

  const parseDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  };

  const expiryBadge = (expiryDate) => {
    const dt = parseDate(expiryDate);
    if (!dt) return { text: "-", cls: "bg-secondary" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((dt - today) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: "Expired", cls: "bg-danger" };
    if (diffDays <= 30)
      return { text: `Expiring (${diffDays}d)`, cls: "bg-warning text-dark" };
    return { text: "Valid", cls: "bg-success" };
  };

  const filtered = useMemo(() => {
    const q = nameQuery.trim().toLowerCase();
    if (!q) return vaccines;
    return vaccines.filter((v) =>
      String(v?.vaccineName || "")
        .toLowerCase()
        .includes(q),
    );
  }, [vaccines, nameQuery]);

  const clearAll = () => {
    setNameQuery("");
    setIdQuery("");
    setSelected(null);
    setExpiringOnly(false);
    setExpiringDays(30);
    fetchAll({ silent: false });
  };

  return (
    <div className="container-fluid p-0">
      {/* Page head (same zip as slots) */}
      <div className="btp-page-head">
        <div>
          <div className="btp-page-title">Vaccines</div>
          <div className="btp-page-sub">Search and view vaccine details</div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => fetchAll({ silent: false })}
          disabled={loading}
          type="button"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {notice.message && (
        <div
          className={`alert ${
            notice.type === "success" ? "alert-success" : "alert-danger"
          } py-2`}
          role="alert"
        >
          {notice.message}
        </div>
      )}

      {/* Filters (zip style like slots) */}
      <div className="card hospital-card p-0 mb-3">
        <div className="btp-filters">
          <div className="btp-filter-grid">
            <div className="btp-filter-group">
              <label>Search by name</label>
              <input
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="e.g. Covishield"
              />
            </div>

            <div className="btp-filter-group">
              <label>Search by ID</label>
              <input
                value={idQuery}
                onChange={(e) => setIdQuery(e.target.value)}
                placeholder="e.g. 1"
                inputMode="numeric"
              />
            </div>

            <div className="btp-filter-actions">
              {/* ✅ all primary only */}
              <button
                className="btn btn-primary"
                onClick={fetchByName}
                disabled={loading}
                type="button"
              >
                Search Name
              </button>
              <button
                className="btn btn-primary"
                onClick={fetchById}
                disabled={loading}
                type="button"
              >
                Search ID
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={clearAll}
                disabled={loading}
                type="button"
              >
                Clear
              </button>
            </div>
          </div>

          <hr className="my-3" />

          <div className="btp-filter-grid btp-filter-grid-2">
            <div className="btp-expiring-left">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={expiringOnly}
                  onChange={(e) => setExpiringOnly(e.target.checked)}
                  id="expiringOnly"
                />
                <label className="form-check-label" htmlFor="expiringOnly">
                  Show expiring vaccines
                </label>
              </div>
            </div>

            <div className="btp-filter-group">
              <label>Days</label>
              <input
                type="number"
                min="1"
                value={expiringDays}
                onChange={(e) => setExpiringDays(e.target.value)}
                disabled={!expiringOnly}
              />
            </div>

            <div className="btp-filter-actions">
              {/* ✅ all primary only */}
              <button
                className="btn btn-primary"
                onClick={fetchExpiring}
                disabled={loading || !expiringOnly}
                type="button"
              >
                Apply Expiry Filter
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setExpiringOnly(false);
                  fetchAll({ silent: false });
                }}
                disabled={loading}
                type="button"
              >
                Remove Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table + Details */}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="card hospital-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold">Vaccine List</div>
              <small className="text-muted">
                Showing {filtered.length} / {vaccines.length}
              </small>
            </div>

            {filtered.length === 0 ? (
              <div className="text-muted">No vaccines found</div>
            ) : (
              <div className="btp-table-wrap">
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 80 }}>ID</th>
                        <th>Name</th>
                        <th style={{ width: 210 }}>Manufacturer</th>
                        <th style={{ width: 110 }}>Doses</th>
                        <th style={{ width: 140 }}>Expiry</th>
                        <th style={{ width: 140 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((v) => {
                        const isActive = selected?.vaccineId === v?.vaccineId;
                        const exp = expiryBadge(v?.expiryDate);

                        return (
                          <tr
                            key={v?.vaccineId}
                            className={isActive ? "table-primary" : ""}
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelected(v)}
                          >
                            <td className="fw-bold">{v?.vaccineId}</td>
                            <td>{v?.vaccineName || "-"}</td>
                            <td>{v?.manufacturer || "-"}</td>
                            <td>
                              {v?.dosesRequired ??
                                v?.doseRequired ??
                                v?.doseCount ??
                                "-"}
                            </td>
                            <td>{v?.expiryDate || "-"}</td>
                            <td>
                              <span className={`badge ${exp.cls}`}>
                                {exp.text}
                              </span>
                            </td>
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

        <div className="col-12 col-lg-4">
          <div className="card hospital-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="fw-bold">Vaccine Details</div>
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSelected(null)}
                disabled={!selected}
                type="button"
              >
                Clear
              </button>
            </div>

            {!selected ? (
              <div className="text-muted">
                Click a vaccine in the table to view full details.
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <div className="text-muted btp-small">Name</div>
                  <div className="fs-5 fw-bold">
                    {selected.vaccineName || "-"}
                  </div>
                  <div className="text-muted btp-small">
                    ID: <strong>{selected.vaccineId}</strong>
                  </div>
                </div>

                <div className="btp-detail-grid">
                  <div className="btp-detail-row">
                    <span className="text-muted">Manufacturer</span>
                    <span className="fw-semibold">
                      {selected.manufacturer || "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Type</span>
                    <span className="fw-semibold">
                      {selected.vaccineType || "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Doses Required</span>
                    <span className="fw-semibold">
                      {selected.dosesRequired ??
                        selected.doseRequired ??
                        selected.doseCount ??
                        "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Dose Gap (days)</span>
                    <span className="fw-semibold">
                      {selected.doseGapDays ?? "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Storage Temp</span>
                    <span className="fw-semibold">
                      {selected.storageTemperature != null
                        ? `${selected.storageTemperature}°C`
                        : "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Manufacturing Date</span>
                    <span className="fw-semibold">
                      {selected.manufacturingDate || "-"}
                    </span>
                  </div>
                  <div className="btp-detail-row">
                    <span className="text-muted">Expiry Date</span>
                    <span className="fw-semibold">
                      {selected.expiryDate || "-"}
                    </span>
                  </div>

                  {selected.minAge != null && selected.maxAge != null && (
                    <div className="btp-detail-row">
                      <span className="text-muted">Age</span>
                      <span className="fw-semibold">
                        {selected.minAge} - {selected.maxAge}
                      </span>
                    </div>
                  )}
                </div>

                <hr />

                <div className="mb-2">
                  <div className="text-muted btp-small mb-1">Description</div>
                  <div className="btp-detail-text">
                    {selected.description || "-"}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-muted btp-small mb-1">Side Effects</div>
                  <div className="btp-detail-text">
                    {selected.sideEffects || "-"}
                  </div>
                </div>

                {/* <hr /> */}

                {/* <div className="text-muted btp-small mb-1">Full data (raw)</div>
                <pre className="btp-raw">
                  {JSON.stringify(selected, null, 2)}
                </pre> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
