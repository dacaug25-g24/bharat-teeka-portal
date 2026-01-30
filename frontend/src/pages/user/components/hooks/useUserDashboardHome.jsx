import { useEffect, useMemo, useState } from "react";
import {
  getProfile,
  getParentChildren,
  getAppointmentHistory,
  getPatientIdByUserId,
} from "../../../../services/patientService";
import { getApiErrorMessage } from "../../../../services/apiClients";

/*
  This hook loads all dashboard data.
  UI file only displays it.
*/

export default function useUserDashboardHome() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [profile, setProfile] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selfPatientId, setSelfPatientId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setErr("");
        setLoading(true);

        if (!user?.userId) {
          setErr("User not found. Please login again.");
          return;
        }

        // 1) Profile
        const p = await getProfile(user.userId);
        setProfile(p || null);

        // 2) Self patientId
        const pid =
          user?.patientId || (await getPatientIdByUserId(user.userId));
        setSelfPatientId(pid || null);

        // 3) Beneficiaries (only for parent)
        if (isParent) {
          const kids = await getParentChildren(user.userId);
          setBeneficiaries(Array.isArray(kids) ? kids : []);
        } else {
          setBeneficiaries([]);
        }

        // 4) Appointment history for self
        if (pid) {
          const hist = await getAppointmentHistory({
            patientId: pid,
            parentUserId: isParent ? user.userId : null,
          });
          setAppointments(Array.isArray(hist) ? hist : []);
        } else {
          setAppointments([]);
        }
      } catch (e) {
        setErr(getApiErrorMessage(e) || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.userId, isParent, user?.patientId]);

  const displayPhone = profile?.phone || user?.phone || "";
  const displayAddress = profile?.address || user?.address || "";

  return {
    user,
    isParent,

    loading,
    err,

    profile,
    beneficiaries,
    appointments,
    selfPatientId,

    displayPhone,
    displayAddress,
  };
}
