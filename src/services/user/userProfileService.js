/**
 * User Profile Service
 */

import axios from "../axios";
import { API_ENDPOINTS } from "../../pages/user/_shared/constants";

export const userProfileService = {
  /**
   * Lấy hồ sơ user
   * @returns {Promise}
   */
  getProfile: async () => {
    const response = await axios.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  },

  /**
   * Cập nhật hồ sơ user
   * @param {Object} data - { fullName, headline, bio, phone, location, skills }
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    const response = await axios.patch(API_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  /**
   * Upload avatar
   * @param {File} file
   * @returns {Promise}
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(API_ENDPOINTS.UPLOAD_AVATAR, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
