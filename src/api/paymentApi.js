import axios from "axios";

const BASE = "https://masterapi.springfest.in/api/payment";

export const initiatePayment = async (data) => {
  const res = await axios.post(`${BASE}/initiate`, data);
  return res.data;
};