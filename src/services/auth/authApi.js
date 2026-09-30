import axios from "axios";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api").replace(/\/+$/, "");
const authBaseUrl = apiBaseUrl.endsWith("/api") ? `${apiBaseUrl}/auth` : `${apiBaseUrl}/api/auth`;

const authApi = axios.create({
  baseURL: authBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default authApi;
