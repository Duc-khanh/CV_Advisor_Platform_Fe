import api from "../axios";
import { API_ENDPOINTS } from "../../shared/api/endpoints";

const unwrap = (response) => response.data?.data ?? response.data;

export const getMyAiUsage = () => api.get(API_ENDPOINTS.MY_AI_USAGE).then(unwrap);
export const getAiPlans = () => api.get(API_ENDPOINTS.AI_PLANS).then(unwrap);

export const getAdminAiDashboard = () =>
  api.get(API_ENDPOINTS.ADMIN_AI_DASHBOARD).then(unwrap);
export const getAdminAiPlans = () =>
  api.get(API_ENDPOINTS.ADMIN_AI_PLANS).then(unwrap);
export const createAdminAiPlan = (payload) =>
  api.post(API_ENDPOINTS.ADMIN_AI_PLANS, payload).then(unwrap);
export const updateAdminAiPlan = (id, payload) =>
  api.put(API_ENDPOINTS.ADMIN_AI_PLAN(id), payload).then(unwrap);
export const getAdminAiSubscription = (userId) =>
  api.get(API_ENDPOINTS.ADMIN_AI_SUBSCRIPTION(userId)).then(unwrap);
export const updateAdminAiSubscription = (userId, payload) =>
  api.put(API_ENDPOINTS.ADMIN_AI_SUBSCRIPTION(userId), payload).then(unwrap);
export const adjustAdminAiCredits = (userId, payload) =>
  api.post(API_ENDPOINTS.ADMIN_AI_CREDITS(userId), payload).then(unwrap);
export const getAdminAiUsage = (params) =>
  api.get(API_ENDPOINTS.ADMIN_AI_USAGE, { params }).then(unwrap);

export const getApiErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.response?.data?.error || fallback;
