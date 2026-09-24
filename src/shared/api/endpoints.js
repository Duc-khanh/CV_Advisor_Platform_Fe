export { API_BASE_URL } from "../../utils/urlHelpers";

export const API_ENDPOINTS = {
  JOBS: "/api/public/jobs",
  JOB_DETAIL: (id) => `/api/public/jobs/${id}`,
  JOB_CATEGORIES: "/api/public/jobs/categories",
  MY_APPLICATIONS: "/api/user/jobs/apply/my-applications",
  APPLY_JOB: (jobId) => `/api/user/jobs/apply/${jobId}`,
  UPDATE_APPLICATION: (applicationId) => `/api/user/jobs/apply/${applicationId}`,
  FAVORITE_JOBS: "/api/user/jobs/favorite/all",
  ADD_FAVORITE: (jobId) => `/api/user/jobs/favorite/add/${jobId}`,
  REMOVE_FAVORITE: (jobId) => `/api/user/jobs/favorite/${jobId}`,
  USER_CV: "/api/user/cvs",
  UPLOAD_CV: "/api/user/cvs/upload",
  EVALUATE_CV: "/api/v1/ai/evaluate-cv",
  GENERATE_ROADMAP: "/api/v1/ai/generate-roadmap",
  ANALYZE_CV: "/api/v1/ai/analyze-cv",
  USER_PROFILE: "/api/user/profile",
  UPDATE_PROFILE: "/api/user/profile/update",
  UPLOAD_AVATAR: "/api/user/profile/avatar",
  MY_AI_USAGE: "/api/me/ai-usage",
  AI_PLANS: "/api/me/ai-usage/plans",
  ADMIN_AI_DASHBOARD: "/api/admin/ai/dashboard",
  ADMIN_AI_PLANS: "/api/admin/ai/plans",
  ADMIN_AI_PLAN: (id) => `/api/admin/ai/plans/${id}`,
  ADMIN_AI_SUBSCRIPTION: (userId) => `/api/admin/ai/subscriptions/${userId}`,
  ADMIN_AI_CREDITS: (userId) => `/api/admin/ai/subscriptions/${userId}/credits`,
  ADMIN_AI_USAGE: "/api/admin/ai/usage",
};

export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
};
