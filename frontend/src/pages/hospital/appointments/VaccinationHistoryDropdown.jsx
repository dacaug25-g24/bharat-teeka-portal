import { useEffect, useState } from "react";

const API = import.meta.env.VITE_HOSPITAL_API || "http://localhost:8081";

const VaccinationHistoryDropdown = ({ patientId }) => {
  const [history, setHistory] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/hospital/vaccinations/patient/${patientId}`,
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setHistory(Array.isArray(data) ? data : []);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && history.length === 0) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div>
      <button
        className="btn btn-sm btn-info"
        onClick={() => setOpen(!open)}
        type="button"
      >
        {open ? "Hide" : "View"}
      </button>

      {open && (
        <ul
          className="list-group mt-2"
          style={{ maxHeight: 180, overflowY: "auto" }}
        >
          {loading && <li className="list-group-item">Loading...</li>}

          {!loading && history.length === 0 && (
            <li className="list-group-item">No vaccination record</li>
          )}

          {!loading &&
            history.map((r) => (
              <li key={r.recordId} className="list-group-item p-2">
                <div className="fw-semibold">
                  {r?.vaccine?.vaccineName || "-"} — Dose {r.doseNumber}
                </div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  Date: {r.vaccinationDate} | Batch: {r.batchNumber}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default VaccinationHistoryDropdown;
