import axios from "axios";

const BASE_URL = "http://localhost:8081/hospital/slots";

const slotService = {
  createSlot: (slotData) => axios.post(BASE_URL, slotData),
  updateSlot: (slotId, slotData) => axios.put(`${BASE_URL}/${slotId}`, slotData),
  deleteSlot: (slotId) => axios.delete(`${BASE_URL}/${slotId}`),
  getAllSlots: () => axios.get(BASE_URL),
  getSlotsByHospital: (hospitalId) => axios.get(`${BASE_URL}/hospital/${hospitalId}`),
  getAvailableSlots: (hospitalId, date) =>
    axios.get(`${BASE_URL}/available/${hospitalId}?date=${date}`),
};

export default slotService;
