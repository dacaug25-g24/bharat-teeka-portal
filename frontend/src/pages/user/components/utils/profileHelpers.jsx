export const safeGetUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const buildProfileForm = (apiData, user) => {
  // We try backend data first, then fallback to localStorage user data
  return {
    username: apiData?.username ?? user?.username ?? "",
    email: apiData?.email ?? user?.email ?? "",
    phone: apiData?.phone ?? user?.phone ?? "",
    address: apiData?.address ?? user?.address ?? "",
    remarks: apiData?.remarks ?? "",
  };
};

export const validateProfileForm = (form) => {
  const phone = (form.phone || "").trim();
  const address = (form.address || "").trim();

  if (!phone) return "Phone is required";
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return "Enter a valid 10-digit Indian phone number";
  }

  if (!address) return "Address is required";
  if (address.length < 5) return "Address must be at least 5 characters";

  return "";
};

export const hasProfileChanges = (form, initialForm) => {
  if (!initialForm) return false;

  const p1 = (form.phone || "").trim();
  const p2 = (initialForm.phone || "").trim();

  const a1 = (form.address || "").trim();
  const a2 = (initialForm.address || "").trim();

  const r1 = (form.remarks || "").trim();
  const r2 = (initialForm.remarks || "").trim();

  return p1 !== p2 || a1 !== a2 || r1 !== r2;
};

export const updateUserInStorage = (user, updatedPhone, updatedAddress) => {
  if (!user) return;

  const nextUser = {
    ...user,
    phone: updatedPhone,
    address: updatedAddress,
  };

  localStorage.setItem("user", JSON.stringify(nextUser));
};
