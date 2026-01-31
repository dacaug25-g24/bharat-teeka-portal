import { useEffect, useState } from "react";
import { getApiErrorMessage } from "../../../../services/apiClients";
import {
  addChild,
  deleteChild,
  getParentChildren,
} from "../../../../services/patientService";
import {
  emptyBeneficiaryForm,
  makeAddChildPayload,
  RELATIONS,
  validateBeneficiary,
} from "../utils/beneficiaryHelpers";

/*
  logic for Add Beneficiary page.
  UI components only call the functions from here.
*/

export default function useBeneficiaries() {
  // Read logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // Parent roleId is 4 in our system
  const roleId = Number(user?.roleId || 0);
  const isParent = roleId === 4;

  // List of beneficiaries
  const [beneficiaries, setBeneficiaries] = useState([]);

  // UI states
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState(emptyBeneficiaryForm());

  // Message states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Relation list is fixed, so we keep it as constant
  const relations = RELATIONS;

  /*
    Load beneficiaries list from backend.
    We call this after add or delete also.
  */
  const loadBeneficiaries = async () => {
    if (!isParent) return;
    if (!user?.userId) return;

    const data = await getParentChildren(user.userId);

    if (Array.isArray(data)) {
      setBeneficiaries(data);
    } else {
      setBeneficiaries([]);
    }
  };

  // Load list when page opens
  useEffect(() => {
    const run = async () => {
      if (!isParent || !user?.userId) return;

      try {
        setError("");
        setLoadingList(true);
        await loadBeneficiaries();
      } catch (e) {
        setBeneficiaries([]);
        setError(getApiErrorMessage(e) || "Failed to load beneficiaries");
      } finally {
        setLoadingList(false);
      }
    };

    run();
    // We only want this to run when login user or role changes
  }, [isParent, user?.userId]);

  // Handle input change for all fields
  const onChange = (e) => {
    setError("");
    setSuccess("");

    const { name, value } = e.target;

    setForm((prev) => {
      return { ...prev, [name]: value };
    });
  };

  // Reset form to empty values
  const resetForm = () => {
    setForm(emptyBeneficiaryForm());
  };

  /*
    Submit form to add beneficiary.
    Steps:
    1. Validate form
    2. Call add API
    3. Reload list
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!isParent) {
      setError("Only Parent users can add beneficiaries.");
      return;
    }

    const validationError = validateBeneficiary(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const payload = makeAddChildPayload(form);

      await addChild({
        parentUserId: user.userId,
        payload: payload,
      });

      setSuccess("Beneficiary added successfully");
      resetForm();

      await loadBeneficiaries();
    } catch (e1) {
      setError(getApiErrorMessage(e1) || "Failed to add beneficiary");
    } finally {
      setSubmitting(false);
    }
  };

  /*
    Delete beneficiary by patientId.
    After delete, refresh the list.
  */
  const handleDelete = async (patientId) => {
    if (!isParent) return;

    const ok = window.confirm(
      "Are you sure you want to remove this beneficiary?"
    );
    if (!ok) return;

    try {
      setError("");
      setSuccess("");

      await deleteChild({
        parentUserId: user.userId,
        patientId: patientId,
      });

      setSuccess("Beneficiary removed successfully");

      await loadBeneficiaries();
    } catch (e2) {
      setError(getApiErrorMessage(e2) || "Failed to remove beneficiary");
    }
  };

  // Return all values and functions that UI needs
  return {
    user,
    isParent,

    beneficiaries,
    loadingList,

    form,
    onChange,
    resetForm,

    relations,

    submitting,
    handleSubmit,
    handleDelete,

    error,
    success,
  };
}
