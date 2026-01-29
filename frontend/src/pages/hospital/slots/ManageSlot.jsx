import { useState } from "react";
import SlotList from "./SlotList";
import SlotForm from "./SlotForm";
import "./slots.css";

export default function ManageSlot() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const hospitalId = user?.hospitalId;

  const todayISO = new Date().toISOString().slice(0, 10);

  const [mode, setMode] = useState("list"); // list | add | edit
  const [editSlot, setEditSlot] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // control which date SlotList shows
  const [listDate, setListDate] = useState(todayISO);

  const [notice, setNotice] = useState({ type: "", message: "" });

  const showNotice = (type, message) => {
    setNotice({ type, message });
    window.clearTimeout(showNotice._t);
    showNotice._t = window.setTimeout(() => {
      setNotice({ type: "", message: "" });
    }, 2500);
  };

  const refreshList = () => setRefreshKey((k) => k + 1);

  const closeForm = () => {
    setMode("list");
    setEditSlot(null);
  };

  return (
    <div className="container-fluid p-0">
      {/* Page header */}
      <div className="btp-page-head">
        <div>
          <div className="btp-page-title">Manage Slots</div>
          <div className="btp-page-sub">
            Logged in as <strong>{user?.username || "Hospital"}</strong>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setMode("add");
            setEditSlot(null);
          }}
        >
          + Add Slot
        </button>
      </div>

      {/* Notice */}
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

      {/* Form card */}
      {mode !== "list" && (
        <div className="card hospital-card p-3 mb-3">
          <div className="btp-card-head-lite">
            <div className="btp-card-title-lite">
              {mode === "edit" ? "Edit Slot" : "Add Slot"}
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary btp-close-btn"
              onClick={closeForm}
              title="Close"
            >
              ✕
            </button>
          </div>

          <SlotForm
            hospitalId={hospitalId}
            slot={mode === "edit" ? editSlot : null}
            onClose={closeForm}
            onSuccess={(msg, savedSlot) => {
              showNotice("success", msg);

              // jump list to the date of added/edited slot
              if (savedSlot?.date) setListDate(savedSlot.date);

              // auto-highlight / scroll to the slot
              if (savedSlot?.slotId) setSelectedSlotId(savedSlot.slotId);

              closeForm();
              refreshList();
            }}
            onError={(msg) => showNotice("error", msg)}
          />
        </div>
      )}

      {/* List card */}
      <div className="card hospital-card p-0">
        <SlotList
          hospitalId={hospitalId}
          refreshKey={refreshKey}
          selectedSlotId={selectedSlotId}
          onSelect={(id) => setSelectedSlotId(id)}
          onEdit={(slot) => {
            setMode("edit");
            setEditSlot(slot);
            setSelectedSlotId(slot?.slotId || null);
            if (slot?.date) setListDate(slot.date);
          }}
          onSuccess={(msg) => showNotice("success", msg)}
          onError={(msg) => showNotice("error", msg)}
          onRefresh={refreshList}
          date={listDate}
          onDateChange={setListDate}
        />
      </div>
    </div>
  );
}
