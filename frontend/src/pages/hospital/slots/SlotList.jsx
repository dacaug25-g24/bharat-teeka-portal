import { useEffect, useMemo, useState } from "react";
import "./slots.css";
import { hospitalApi, getApiErrorMessage } from "../../../services/apiClients";

export default function SlotList({
  hospitalId,
  onEdit,
  refreshKey,
  onSuccess,
  onError,
  onRefresh,
  selectedSlotId,
  onSelect,
  date,
  onDateChange,
}) {
  const todayISO = new Date().toISOString().slice(0, 10);

  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  const [deleteState, setDeleteState] = useState({
    slotId: null,
    deleting: false,
  });

  const canUseTimeFilter = useMemo(() => Boolean(date && time), [date, time]);

  const showLocalSuccess = (msg) => {
    setLocalSuccess(msg);
    window.clearTimeout(showLocalSuccess._t);
    showLocalSuccess._t = window.setTimeout(() => setLocalSuccess(""), 1800);
  };

  const fetchSlots = async ({ silent = false } = {}) => {
    if (!hospitalId) return;

    if (!silent) {
      setLoading(true);
      setLocalError("");
    }

    try {
      const res = canUseTimeFilter
        ? await hospitalApi.get(`/hospital/slots/by-time`, {
            params: { hospitalId, date, time },
          })
        : await hospitalApi.get(`/hospital/slots`, {
            params: { hospitalId, date },
          });

      const data = res.data;
      setSlots(Array.isArray(data) ? data : []);

      if (!silent) showLocalSuccess("Refreshed successfully");
    } catch (e) {
      const msg = getApiErrorMessage(e) || "Unable to fetch slots";
      setLocalError(msg);
      setSlots([]);
      onError?.(msg);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId, date, time, refreshKey]);

  useEffect(() => {
    if (!selectedSlotId) return;
    const el = document.getElementById(`slot-row-${selectedSlotId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [selectedSlotId, slots]);

  const startDelete = (slotId) => setDeleteState({ slotId, deleting: false });
  const cancelDelete = () => setDeleteState({ slotId: null, deleting: false });

  const confirmDelete = async (slotId) => {
    try {
      setDeleteState({ slotId, deleting: true });

      await hospitalApi.delete(`/hospital/slots/${slotId}`);

      onSuccess?.("Slot deleted successfully");
      cancelDelete();
      onRefresh?.();
    } catch (e) {
      onError?.(getApiErrorMessage(e) || "Failed to delete slot");
      setDeleteState({ slotId, deleting: false });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center px-3 py-3">
        <div className="fw-bold fs-6">Slots</div>

        <button
          className="btn btn-primary"
          onClick={() => fetchSlots({ silent: false })}
          disabled={loading}
          type="button"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="btp-filters">
        <div className="btp-filter-grid">
          <div className="btp-filter-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange?.(e.target.value)}
            />
          </div>

          <div className="btp-filter-group">
            <label>Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="btp-filter-actions">
            <button
              className="btn btn-primary"
              onClick={() => fetchSlots({ silent: false })}
              disabled={loading}
              type="button"
            >
              Apply
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => {
                onDateChange?.(todayISO);
                setTime("");
                showLocalSuccess("Filters cleared");
              }}
              disabled={loading}
              type="button"
            >
              Clear
            </button>
          </div>
        </div>

        {localSuccess && (
          <div className="alert alert-success py-2 mt-3 mb-0">
            {localSuccess}
          </div>
        )}
        {localError && (
          <div className="alert alert-danger py-2 mt-3 mb-0">{localError}</div>
        )}
      </div>

      {slots.length === 0 && !loading ? (
        <div className="px-3 pb-3 text-muted">No slots found</div>
      ) : (
        <div className="btp-table-wrap">
          <div style={{ overflowX: "auto" }}>
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr className="text-dark">
                  <th style={{ width: 70 }}>ID</th>
                  <th style={{ width: 130 }}>Date</th>
                  <th>Vaccine</th>
                  <th style={{ width: 110 }}>Start</th>
                  <th style={{ width: 110 }}>End</th>
                  <th style={{ width: 90 }}>Capacity</th>
                  <th style={{ width: 90 }}>Booked</th>
                  <th style={{ width: 100 }}>Available</th>
                  <th style={{ width: 170 }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {slots.map((slot) => {
                  const isSelected = slot.slotId === selectedSlotId;
                  const isAskingDelete = deleteState.slotId === slot.slotId;
                  const isDeletingThis = isAskingDelete && deleteState.deleting;

                  const available =
                    Number(slot.capacity) - Number(slot.bookedCount);

                  return (
                    <tr
                      key={slot.slotId}
                      id={`slot-row-${slot.slotId}`}
                      className={isSelected ? "table-primary" : ""}
                      onClick={() => onSelect?.(slot.slotId)}
                      style={{ cursor: "pointer" }}
                    >
                      <td className="fw-semibold">{slot.slotId}</td>
                      <td className="fw-semibold">{slot.date}</td>
                      <td className="fw-semibold">
                        {slot?.vaccine?.vaccineName || "-"}
                      </td>
                      <td className="fw-semibold">{slot.startTime}</td>
                      <td className="fw-semibold">{slot.endTime}</td>
                      <td className="fw-semibold">{slot.capacity}</td>
                      <td className="fw-semibold">{slot.bookedCount}</td>
                      <td className="fw-semibold">{available}</td>

                      <td onClick={(e) => e.stopPropagation()}>
                        {!isAskingDelete ? (
                          <div className="btp-row-actions">
                            <button
                              className="btn btn-outline-primary"
                              onClick={() => onEdit?.(slot)}
                              type="button"
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => startDelete(slot.slotId)}
                              type="button"
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <div className="btp-delete-box">
                            <div className="small mb-2">
                              Delete slot <strong>#{slot.slotId}</strong>?
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => confirmDelete(slot.slotId)}
                                disabled={isDeletingThis}
                                type="button"
                              >
                                {isDeletingThis ? "Deleting..." : "Yes"}
                              </button>
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cancelDelete}
                                disabled={isDeletingThis}
                                type="button"
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}
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
  );
}
