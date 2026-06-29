/**
 * Job Domain Types
 */

export const JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  FREELANCE: "freelance",
};

export const APPLICATION_STATUS = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
};

/**
 * @typedef {Object} IJob
 * @property {string} jobId
 * @property {string} title
 * @property {string} companyName
 * @property {string} [companyLogo]
 * @property {string} salaryRange
 * @property {string} location
 * @property {string} jobType
 * @property {string} description
 * @property {string} candidateRequirements
 * @property {boolean} isFavorite
 * @property {string} expiredAt
 */

/**
 * @typedef {Object} IJobApplication
 * @property {string} applicationId
 * @property {string} jobId
 * @property {string} status
 * @property {string} applyDate
 * @property {string} cvFileUrl
 */

/**
 * @typedef {Object} IJobCategory
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {number} count
 */
