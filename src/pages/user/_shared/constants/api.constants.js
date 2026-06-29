/**
 * API Endpoints Configuration
 */

export const API_BASE_URL = "http://localhost:8080";

export const API_ENDPOINTS = {
  // Public Jobs
  JOBS: "/api/public/jobs",
  JOB_DETAIL: (id) => `/api/public/jobs/${id}`,
  JOB_CATEGORIES: "/api/public/jobs/categories",

  // User Applications
  MY_APPLICATIONS: "/api/user/jobs/apply/my-applications",
  APPLY_JOB: (jobId) => `/api/user/jobs/apply/${jobId}`,
  UPDATE_APPLICATION: (appId) => `/api/user/jobs/apply/${appId}`,

  // User Favorites
  FAVORITE_JOBS: "/api/user/jobs/favorite/all",
  ADD_FAVORITE: (jobId) => `/api/user/jobs/favorite/add/${jobId}`,
  REMOVE_FAVORITE: (jobId) => `/api/user/jobs/favorite/${jobId}`,

  // CV Management
  USER_CV: "/api/user/cv",
  UPLOAD_CV: "/api/user/cv/upload",

  // AI Services
  EVALUATE_CV: "/api/v1/ai/evaluate-cv",
  GENERATE_ROADMAP: "/api/v1/ai/generate-roadmap",
  ANALYZE_CV: "/api/v1/ai/analyze-cv",

  // User Profile
  USER_PROFILE: "/api/user/profile",
  UPDATE_PROFILE: "/api/user/profile/update",
  UPLOAD_AVATAR: "/api/user/profile/avatar",
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};
