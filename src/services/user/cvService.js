/**
 * CV Service - Quản lý tất cả API calls liên quan tới CV
 */

import axios from "../axios";
import { API_ENDPOINTS } from "../../pages/user/_shared/constants";

export const cvService = {
  /**
   * Lấy CV của user
   * @returns {Promise}
   */
  getUserCV: async () => {
    const response = await axios.get(API_ENDPOINTS.USER_CV);
    return response.data;
  },

  /**
   * Upload CV
   * @param {File} file
   * @returns {Promise}
   */
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(API_ENDPOINTS.UPLOAD_CV, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Xóa CV
   * @param {string|number} cvId
   * @returns {Promise}
   */
  deleteCV: async (cvId) => {
    const response = await axios.delete(`${API_ENDPOINTS.USER_CV}/${cvId}`);
    return response.data;
  },

  /**
   * Đánh giá CV bằng AI
   * @param {File} file
   * @param {string} targetRole - Vị trí mục tiêu
   * @returns {Promise}
   */
  evaluateCV: async (file, targetRole = "") => {
    const formData = new FormData();
    formData.append("file", file);
    if (targetRole) formData.append("targetRole", targetRole);

    const response = await axios.post(API_ENDPOINTS.EVALUATE_CV, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Phân tích CV chi tiết
   * @param {File} file
   * @returns {Promise}
   */
  analyzeCV: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(API_ENDPOINTS.ANALYZE_CV, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  /**
   * Tạo lộ trình sự nghiệp
   * @param {File} file
   * @param {string} targetRole
   * @param {string} desiredRoadmap
   * @returns {Promise}
   */
  generateRoadmap: async (file, targetRole = "", desiredRoadmap = "") => {
    const formData = new FormData();
    formData.append("file", file);
    if (targetRole) formData.append("targetRole", targetRole);
    if (desiredRoadmap) formData.append("desiredRoadmap", desiredRoadmap);

    const response = await axios.post(API_ENDPOINTS.GENERATE_ROADMAP, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
