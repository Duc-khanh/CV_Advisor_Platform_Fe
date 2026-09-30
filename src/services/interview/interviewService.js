/**
 * interviewService.js
 * Service layer cho chức năng Lịch phỏng vấn (HR)
 */
import api from "../axios";

const BASE = "/api/hr/interviews";

// Lấy danh sách lịch phỏng vấn (phân trang + lọc)
export const getInterviews = async (params = {}) => {
  const res = await api.get(BASE, { params });
  return res.data;
};

// Lấy danh sách theo khoảng ngày cho Calendar view
export const getInterviewsForCalendar = async (from, to) => {
  const res = await api.get(`${BASE}/calendar`, { params: { from, to } });
  return res.data;
};

// Lấy thống kê số lượng phỏng vấn
export const getInterviewStats = async () => {
  const res = await api.get(`${BASE}/stats`);
  return res.data;
};

// Lấy chi tiết một lịch phỏng vấn
export const getInterviewById = async (id) => {
  const res = await api.get(`${BASE}/${id}`);
  return res.data;
};

// Lấy danh sách ứng viên có trạng thái INTERVIEW để chọn khi tạo lịch
export const getInterviewCandidates = async () => {
  try {
    const res = await api.get("/api/hr/applications", {
      params: { status: "INTERVIEW", size: 200 },
    });
    const raw = res.data;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.content)) return raw.content;
    return [];
  } catch (err) {
    console.warn("getInterviewCandidates error:", err);
    return [];
  }
};

// Tạo lịch phỏng vấn mới & gửi email
export const createInterview = async (payload) => {
  const res = await api.post(BASE, payload);
  return res.data;
};

// Cập nhật thông tin lịch phỏng vấn
export const updateInterview = async (id, payload) => {
  const res = await api.put(`${BASE}/${id}`, payload);
  return res.data;
};

// Đổi trạng thái lịch phỏng vấn
export const updateInterviewStatus = async (id, status) => {
  const res = await api.patch(`${BASE}/${id}/status`, null, {
    params: { status },
  });
  return res.data;
};

// Lưu kết quả đánh giá phỏng vấn
export const submitInterviewFeedback = async (id, payload) => {
  const res = await api.post(`${BASE}/${id}/feedback`, payload);
  return res.data;
};

// Hủy / Xóa lịch phỏng vấn
export const deleteInterview = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};