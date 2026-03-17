import axios from "./axios";

export const getPublicJobs = async (params = {}) => {
  const res = await axios.get("/api/public/jobs", { params });
  return res.data;
};
