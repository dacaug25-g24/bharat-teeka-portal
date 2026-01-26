import { useEffect, useState } from "react";

export default function ManageSlot() {
  const user = JSON.parse(localStorage.getItem("user"));
  const hospitalId = user?.hospitalId;

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);

  const fetchSlots = async (selectedDate = date, selectedTime = time) => {
    if (!hospitalId) {
      setError("Hospital not logged in");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let url = `http://localhost:8082/hospital/slots?hospitalId=${hospitalId}&date=${selectedDate}`;
      if (selectedTime) {
        url = `http://localhost:8082/hospital/slots/by-time?hospitalId=${hospitalId}&date=${selectedDate}&time=${selectedTime.trim()}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch slots");

      const data = await res.json();
      setSlots(data);

      if (!selectedTime) {
        const times = data.map((slot) => slot.startTime);
        setAvailableTimes(times);
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load slots");
      setSlots([]);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId && date) fetchSlots(date, time);
  }, [hospitalId, date, time]);

  return (
    <div className="hospital-info-panel">
      <h5>Manage Slots</h5>
      <p>Welcome, {user?.username || "Hospital"}</p>

      <div className="mb-3">
        <label className="form-label fw-semibold">Select Date:</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setTime("");
          }}
        />
      </div>

      {availableTimes.length > 0 && (
        <div className="mb-3">
          <label className="form-label fw-semibold">Select Start Time (optional):</label>
          <select
            className="form-control"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">-- All Times --</option>
            {availableTimes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <p>Loading slots...</p>}
      {error && <p className="text-danger">{error}</p>}

      {slots.length === 0 && !loading ? (
        <p>No slots found for {date}{time && ` at ${time}`}</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Slot ID</th>
              <th>Date</th>
              <th>Vaccine</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Capacity</th>
              <th>Booked</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.slotId}>
                <td>{slot.slotId}</td>
                <td>{slot.date}</td>
                <td>{slot.vaccine.vaccineName}</td>
                <td>{slot.startTime}</td>
                <td>{slot.endTime}</td>
                <td>{slot.capacity}</td>
                <td>{slot.bookedCount}</td>
                <td>{slot.capacity - slot.bookedCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}