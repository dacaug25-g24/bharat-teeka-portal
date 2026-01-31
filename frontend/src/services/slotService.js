import { hospitalApi } from "./apiClients";

const slotService = {
  createSlot: (slotData) => hospitalApi.post("/hospital/slots", slotData),

  updateSlot: (slotId, slotData) =>
    hospitalApi.put(`/hospital/slots/${slotId}`, slotData),

  deleteSlot: (slotId) => hospitalApi.delete(`/hospital/slots/${slotId}`),

  // if your backend supports listing all slots (optional)
  getAllSlots: () => hospitalApi.get("/hospital/slots"),

  getSlotsByHospital: (hospitalId) =>
    hospitalApi.get(`/hospital/slots/hospital/${hospitalId}`),

  // ✅ This matches what your dashboard already uses
  getSlotsByHospitalAndDate: (hospitalId, date) =>
    hospitalApi.get("/hospital/slots", { params: { hospitalId, date } }),

  // If you still have this endpoint in backend
  getAvailableSlots: (hospitalId, date) =>
    hospitalApi.get(`/hospital/slots/available/${hospitalId}`, {
      params: { date },
    }),
};

export default slotService;
