/**
 * Job Service - Quản lý tất cả API calls liên quan tới công việc
 */

import axios from "../axios";
import { API_ENDPOINTS } from "../../pages/user/_shared/constants";

export const jobService = {
  /**
   * Lấy danh sách công việc
   * @param {Object} params - { keyword, location, jobType, salaryRange, page, pageSize }
   * @returns {Promise}
   */
  listJobs: async (params = {}) => {
    const response = await axios.get(API_ENDPOINTS.JOBS, { params });
    return response.data;
  },

  /**
   * Lấy chi tiết một công việc
   * @param {string} jobId
   * @returns {Promise}
   */
  getJobDetail: async (jobId) => {
    const response = await axios.get(API_ENDPOINTS.JOB_DETAIL(jobId));
    return response.data;
  },

  /**
   * Lấy danh sách các danh mục công việc
   * @returns {Promise}
   */
  getCategories: async () => {
    const response = await axios.get(API_ENDPOINTS.JOB_CATEGORIES);
    return response.data;
  },

  /**
   * Nộp đơn ứng tuyển
   * @param {string} jobId
   * @param {Object} data - { cvId, coverLetter }
   * @returns {Promise}
   */
  applyJob: async (jobId, data) => {
    const response = await axios.post(API_ENDPOINTS.APPLY_JOB(jobId), data);
    return response.data;
  },

  /**
   * Lấy danh sách đơn ứng tuyển của user
   * @param {Object} params - { status, page, pageSize }
   * @returns {Promise}
   */
  getMyApplications: async (params = {}) => {
    const response = await axios.get(API_ENDPOINTS.MY_APPLICATIONS, { params });
    return response.data;
  },

  /**
   * Cập nhật trạng thái ứng tuyển
   * @param {string} applicationId
   * @param {Object} data
   * @returns {Promise}
   */
  updateApplication: async (applicationId, data) => {
    const response = await axios.patch(
      API_ENDPOINTS.UPDATE_APPLICATION(applicationId),
      data
    );
    return response.data;
  },

  /**
   * Lấy danh sách công việc yêu thích
   * @returns {Promise}
   */
  getFavoriteJobs: async () => {
    const response = await axios.get(API_ENDPOINTS.FAVORITE_JOBS);
    return response.data;
  },

  /**
   * Thêm công việc vào yêu thích
   * @param {string} jobId
   * @returns {Promise}
   */
  addToFavorite: async (jobId) => {
    const response = await axios.post(API_ENDPOINTS.ADD_FAVORITE(jobId));
    return response.data;
  },

  /**
   * Xóa công việc khỏi yêu thích
   * @param {string} jobId
   * @returns {Promise}
   */
  removeFromFavorite: async (jobId) => {
    const response = await axios.delete(API_ENDPOINTS.REMOVE_FAVORITE(jobId));
    return response.data;
  },
};
