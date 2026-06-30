/**
 * CV & Analysis Domain Types
 */

export const CV_ANALYSIS_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
};

/**
 * @typedef {Object} ICVAnalysis
 * @property {number} score - Điểm từ 0-100
 * @property {string} summary - Tóm tắt đánh giá
 * @property {string[]} strengths - Điểm mạnh
 * @property {string[]} weaknesses - Điểm yếu
 * @property {string[]} missingSkills - Kỹ năng còn thiếu
 */

/**
 * @typedef {Object} ICareerRoadmapPhase
 * @property {string} title - Tên giai đoạn
 * @property {string} description - Mô tả chi tiết
 * @property {string[]} skills - Các kỹ năng cần học
 * @property {string} duration - Thời gian ước tính
 */

/**
 * @typedef {Object} ICareerRoadmap
 * @property {ICareerRoadmapPhase[]} learningPath
 * @property {string} summary
 * @property {Object[]} marketTrends
 */

/**
 * @typedef {Object} ICVFile
 * @property {File} file
 * @property {string} name
 * @property {number} size
 * @property {string} type
 */
