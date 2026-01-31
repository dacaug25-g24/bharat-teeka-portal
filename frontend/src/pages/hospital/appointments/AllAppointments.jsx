import { useEffect, useState } from "react";
import VaccinationHistoryDropdown from "./VaccinationHistoryDropdown";
import "./appointments.css";
import { hospitalApi, authApi } from "../../../services/apiClients";

const AllAppointments = ({ hospitalId, dateFilter }) => {
  const [appointments, setAppointments] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPatientBasics = async (patientIds) => {
    const missing = patientIds.filter((id) => !patientMap[id]);
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

  const fetchAppointments = async () => {
    if (!hospitalId) return;
    setLoading(true);
    setError("");

    try {
      const url = dateFilter
        ? `/hospital/appointments/hospital/${hospitalId}?date=${dateFilter}`
        : `/hospital/appointments/hospital/${hospitalId}`;

      const res = await hospitalApi.get(url);
      const data = res.data;

      const arr = Array.isArray(data) ? data : [];
      setAppointments(arr);

      const ids = [...new Set(arr.map((a) => a.patientId).filter(Boolean))];
      await fetchPatientBasics(ids);
    } catch (e) {
      setError("Unable to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId, dateFilter]);

  const statusClass = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "completed") return "btp-chip completed";
    if (v === "cancelled") return "btp-chip cancelled";
    if (v === "booked") return "btp-chip booked";
    return "btp-chip pending";
  };

  return (
    <div>
      {loading && <p className="text-muted mb-2">Loading appointments...</p>}
      {error && <p className="text-danger mb-2">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p className="text-muted mb-0">No appointments found</p>
      )}

      {appointments.length > 0 && (
        <div className="btp-table-wrap">
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Aadhaar</th>
                  <th>History</th>
                  <th>Date</th>
                  <th>Vaccine</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => {
                  const p = patientMap[a.patientId];
                  const vaccineName = a?.slot?.vaccine?.vaccineName || "-";

                  return (
                    <tr key={a.appointmentId}>
                      <td>{a.appointmentId}</td>
                      <td>{p?.fullName || `Patient #${a.patientId}`}</td>
                      <td>{p?.aadhaarNumber || "-"}</td>
                      <td>
                        <VaccinationHistoryDropdown patientId={a.patientId} />
                      </td>
                      <td>{a.bookingDate}</td>
                      <td className="fw-semibold">{vaccineName}</td>
                      <td>
                        <span className={statusClass(a.status)}>
                          {a.status}
                        </span>
                      </td>
                      <td>{a.remarks || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
