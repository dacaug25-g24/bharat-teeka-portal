import { hospitalApi } from "./apiClients";

export const getSlotById = async (slotId) => {
  const res = await hospitalApi.get(`/hospital/slots/${slotId}`);
  return res.data;
};
