import { hospitalApi } from "./apiClients";

const slotService = {
  createSlot: (slotData) => hospitalApi.post("/hospital/slots", slotData),

  updateSlot: (slotId, slotData) =>
    hospitalApi.put(`/hospital/slots/${slotId}`, slotData),

  deleteSlot: (slotId) => hospitalApi.delete(`/hospital/slots/${slotId}`),

  getAllSlots: () => hospitalApi.get("/hospital/slots"),

  getSlotsByHospital: (hospitalId) =>
    hospitalApi.get(`/hospital/slots/hospital/${hospitalId}`),

  getSlotsByHospitalAndDate: (hospitalId, date) =>
    hospitalApi.get("/hospital/slots", { params: { hospitalId, date } }),

  getAvailableSlots: (hospitalId, date) =>
    hospitalApi.get(`/hospital/slots/available/${hospitalId}`, {
      params: { date },
    }),
};

export default slotService;
