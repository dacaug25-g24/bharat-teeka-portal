export const RELATIONS = [
  { id: 1, name: "Father" },
  { id: 2, name: "Mother" },
  { id: 3, name: "Guardian" },
  { id: 4, name: "Grandfather" },
  { id: 5, name: "Grandmother" },
  { id: 6, name: "Uncle" },
  { id: 7, name: "Aunt" },
  { id: 8, name: "Son" },
  { id: 9, name: "Daughter" },
];

// Returns today's date in YYYY-MM-DD format
// We use this for max date in Date of Birth field
export const todayISO = () => {
  return new Date().toISOString().split("T")[0];
};

// Returns empty form object
// We use this to reset the form easily
export const emptyBeneficiaryForm = () => {
  return {
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    aadharNumber: "",
    bloodGroup: "",
    relationId: "",
    remarks: "",
  };
};

// Validates the form and returns error message
// If everything is correct, it returns empty string
export const validateBeneficiary = (form) => {
  if (!form.firstName.trim()) return "First name is required";
  if (!form.lastName.trim()) return "Last name is required";
  if (!form.dateOfBirth) return "Date of birth is required";
  if (!form.gender) return "Gender is required";
  if (!form.bloodGroup) return "Blood group is required";
  if (!form.relationId) return "Relation is required";

  const aadhaar = form.aadharNumber.trim();
  if (!aadhaar) return "Aadhaar is required";
  if (!/^\d{12}$/.test(aadhaar)) return "Aadhaar must be exactly 12 digits";

  return "";
};

// Convert form data into payload format required by backend
export const makeAddChildPayload = (form) => {
  return {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    aadharNumber: form.aadharNumber.trim(),
    bloodGroup: form.bloodGroup,
    relationId: Number(form.relationId),
    remarks: form.remarks?.trim() || null,
  };
};
