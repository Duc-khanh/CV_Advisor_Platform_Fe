/**
 * User Profile Domain Types
 */

/**
 * @typedef {Object} IUserProfile
 * @property {string} userId
 * @property {string} email
 * @property {string} fullName
 * @property {string} [phone]
 * @property {string} [avatar]
 * @property {string} [headline]
 * @property {string} [bio]
 * @property {string} [location]
 * @property {string[]} [skills]
 * @property {Object[]} [experience]
 * @property {Object[]} [education]
 */

/**
 * @typedef {Object} IUserExperience
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} startDate
 * @property {string} endDate
 * @property {string} description
 */

/**
 * @typedef {Object} IUserEducation
 * @property {string} id
 * @property {string} school
 * @property {string} degree
 * @property {string} field
 * @property {string} graduationDate
 */
