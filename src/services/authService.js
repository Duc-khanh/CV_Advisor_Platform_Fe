import authApi from "../api/authApi.js";

export const register = (data) => {
  return authApi.post("/register", data);
};

export const registerHr = (data) => {
  return authApi.post("/register-hr", data);
};

export const login = (data) => {
  return authApi.post("/login", data);
};
