// services/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // backend
});
  
const normalizeToken = (value) => {
  if (!value) return null;
  return value.toString().trim().replace(/^Bearer\s+/i, "");
};

instance.interceptors.request.use(config => {
  const rawToken = localStorage.getItem("token");
  const token = normalizeToken(rawToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
