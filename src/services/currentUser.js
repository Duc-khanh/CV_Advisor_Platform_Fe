import axios from "./axios";

/**
 * Lấy thông tin user đang đăng nhập
 * GET /api/me
 */
export const getCurrentUser = () => {
  return axios.get("/api/me");
};

/**
 * Cập nhật thông tin user đang đăng nhập
 * PUT /api/me (multipart/form-data)
 */
export const updateCurrentUser = (data, avatar) => {
  const formData = new FormData();

  formData.append(
    "data",
    new Blob([JSON.stringify(data)], { type: "application/json" })
  );

  if (avatar) {
    formData.append("avatar", avatar);
  }

  return axios.put("/api/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
