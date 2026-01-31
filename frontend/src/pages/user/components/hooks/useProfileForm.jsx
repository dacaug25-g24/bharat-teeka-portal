import { useEffect, useMemo, useState } from "react";
import { getProfile, updateProfile } from "../../../../services/patientService";
import { getApiErrorMessage } from "../../../../services/apiClients";
import {
  buildProfileForm,
  hasProfileChanges,
  safeGetUserFromStorage,
  updateUserInStorage,
  validateProfileForm,
} from "../utils/profileHelpers";

/*
  This hook handles Profile page logic.
  UI file will only show inputs and buttons.
*/

export default function useProfileForm() {
  const user = useMemo(() => safeGetUserFromStorage(), []);

  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  const roleLabel = useMemo(() => {
    if (isParent) return "Parent";
    if (roleId === 3) return "Patient/User";
    return "User";
  }, [isParent, roleId]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    remarks: "",
  });

  const [initialForm, setInitialForm] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Load profile from backend once userId is available
  useEffect(() => {
    const load = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        setErr("");
        setMsg("");

        const data = await getProfile(user.userId);

        const nextForm = buildProfileForm(data, user);
        setForm(nextForm);
        setInitialForm(nextForm);
      } catch (e) {
        // If backend fails, at least show localStorage values
        const fallback = buildProfileForm(null, user);
        setForm(fallback);
        setInitialForm(fallback);

        setErr(getApiErrorMessage(e) || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.userId, user?.username, user?.email, user?.phone, user?.address]);

  const onChange = (e) => {
    setErr("");
    setMsg("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validationError = useMemo(() => validateProfileForm(form), [form]);

  const hasChanges = useMemo(() => {
    return hasProfileChanges(form, initialForm);
  }, [form, initialForm]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    const v = validateProfileForm(form);
    if (v) {
      setErr(v);
      return;
    }

    if (!user?.userId) {
      setErr("User not found. Please login again.");
      return;
    }

    const phone = form.phone.trim();
    const address = form.address.trim();
    const remarks = (form.remarks || "").trim();

    try {
      setSaving(true);

      await updateProfile({
        userId: user.userId,
        phone,
        address,
        remarks: remarks || null,
      });

      updateUserInStorage(user, phone, address);

      setMsg("Profile updated successfully");

      // Save latest values as initial values
      setInitialForm({
        ...form,
        phone,
        address,
        remarks,
      });
    } catch (e2) {
      setErr(getApiErrorMessage(e2) || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setErr("");
    setMsg("");
    if (initialForm) setForm(initialForm);
  };

  return {
    user,
    roleLabel,

    form,
    onChange,

    loading,
    saving,

    msg,
    err,

    validationError,
    hasChanges,

    handleSave,
    handleReset,
  };
}
