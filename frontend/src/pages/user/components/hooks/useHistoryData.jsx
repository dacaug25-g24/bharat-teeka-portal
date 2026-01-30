import { useEffect, useMemo, useState } from "react";
import {
  cancelAppointment,
  getAppointmentDetails,
  getParentChildren,
  getProfile,
} from "../../../../services/patientService";
import { getApiErrorMessage } from "../../../../services/apiClients";
import { normalizeHistoryRows } from "../utils/historyMappers";

/*
  This hook handles all History page logic.
  The component only shows UI using the values from here.
*/

export default function useHistoryData() {
  const user = JSON.parse(localStorage.getItem("user"));
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  // Tabs: self or beneficiary
  const [tab, setTab] = useState("self");
  const [selectedChild, setSelectedChild] = useState("");

  // Self profile
  const [selfPatientId, setSelfPatientId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Beneficiaries list
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loadingBeneficiaries, setLoadingBeneficiaries] = useState(false);

  // Raw rows from backend
  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(false);

  // Messages
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState(null);

  // Load self patient id
  useEffect(() => {
    const run = async () => {
      if (!user?.userId) return;

      try {
        setLoadingProfile(true);
        setError("");

        const data = await getProfile(user.userId);
        setSelfPatientId(data?.patientId ?? null);
      } catch (e) {
        setSelfPatientId(null);
        setError(getApiErrorMessage(e) || "Failed to load profile");
      } finally {
        setLoadingProfile(false);
      }
    };

    run();
  }, [user?.userId]);

  // Load beneficiaries for parent
  useEffect(() => {
    const run = async () => {
      if (!isParent || !user?.userId) return;

      try {
        setLoadingBeneficiaries(true);
        const data = await getParentChildren(user.userId);
        setBeneficiaries(Array.isArray(data) ? data : []);
      } catch (e) {
        setBeneficiaries([]);
        setError(getApiErrorMessage(e) || "Failed to load beneficiaries");
      } finally {
        setLoadingBeneficiaries(false);
      }
    };

    run();
  }, [isParent, user?.userId]);

  // Decide current patient id (self or beneficiary)
  const activePatientId = useMemo(() => {
    if (tab === "self") return selfPatientId;

    if (!selectedChild) return null;
    return Number(selectedChild);
  }, [tab, selfPatientId, selectedChild]);

  const canFetch = Boolean(activePatientId);

  // Fetch history when patient id changes
  useEffect(() => {
    const run = async () => {
      if (!canFetch) return;

      try {
        setLoadingRows(true);
        setError("");
        setRows([]);

        const data = await getAppointmentDetails({
          patientId: Number(activePatientId),
          parentUserId: tab === "beneficiary" ? user.userId : null,
        });

        setRows(Array.isArray(data) ? data : []);
      } catch (e) {
        setRows([]);
        setError(getApiErrorMessage(e) || "Failed to load history");
      } finally {
        setLoadingRows(false);
      }
    };

    run();
  }, [canFetch, activePatientId, tab, user?.userId]);

  // Cancel appointment
  const handleCancel = async (appointmentId) => {
    const ok = window.confirm("Cancel this appointment?");
    if (!ok) return;

    try {
      setCancellingId(appointmentId);
      setError("");

      const parentUserId = tab === "beneficiary" ? user.userId : null;

      const resp = await cancelAppointment(appointmentId, parentUserId);

      if (resp?.success === false) {
        throw new Error(resp?.message || "Failed to cancel appointment");
      }

      // Update status locally after cancel
      setRows((prev) =>
        (prev || []).map((r) => {
          const id = r?.appointmentId ?? r?.appointment_id ?? r?.id;
          if (Number(id) === Number(appointmentId)) {
            return { ...r, status: "Cancelled" };
          }
          return r;
        })
      );
    } catch (e) {
      setError(getApiErrorMessage(e) || e.message || "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  // Convert raw rows to display rows
  const displayRows = useMemo(() => {
    return normalizeHistoryRows(rows);
  }, [rows]);

  return {
    user,
    isParent,

    tab,
    setTab,

    selectedChild,
    setSelectedChild,

    selfPatientId,
    loadingProfile,

    beneficiaries,
    loadingBeneficiaries,

    rows,
    displayRows,
    loadingRows,

    error,
    setError,

    cancellingId,
    handleCancel,

    canFetch,
  };
}
