import axios from "./axios";

export const getMyJobs = async ({ keyword, experienceLevel }) => {
  const res = await axios.get("/api/hr/jobs", {
    params: {
      keyword: keyword || null,
      experienceLevel: experienceLevel || null,
    },
  });
  return res.data;
};

/* ===== CREATE ===== */
export const createJob = async (formData) => {
  return axios.post("/api/hr/jobs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===== UPDATE ===== */
export const updateJob = async (id, formData) => {
  return axios.put(`/api/hr/jobs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ===== DELETE ===== */
export const deleteJob = async (id) => {
  return axios.delete(`/api/hr/jobs/${id}`);
};
