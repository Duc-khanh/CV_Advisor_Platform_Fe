import api from "./axios";

const API_URL = "/api/user/notifications";

export const NOTIFICATIONS_CHANGED_EVENT = "notifications_changed";

export const emitNotificationChange = () => {
  try {
    window.dispatchEvent(new CustomEvent(NOTIFICATIONS_CHANGED_EVENT));
  } catch (e) {
    console.error("Error dispatching notification change event:", e);
  }
};

export const normalizeNotification = (notif) => {
  if (!notif) return notif;
  const isRead = notif.isRead !== undefined ? Boolean(notif.isRead) : Boolean(notif.read);
  return {
    ...notif,
    isRead,
    read: isRead,
  };
};

export const getNotifications = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.type && params.type !== "ALL") query.append("type", params.type);
  if (params.unreadOnly) query.append("unreadOnly", "true");

  const queryString = query.toString() ? `?${query.toString()}` : "";
  const res = await api.get(`${API_URL}${queryString}`);
  const data = Array.isArray(res.data) ? res.data : [];
  return data.map(normalizeNotification);
};

export const getUnreadNotificationCount = async () => {
  try {
    const res = await api.get(`${API_URL}/unread-count`);
    return Number(res.data?.unreadCount || 0);
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

export const markNotificationAsRead = async (id) => {
  const res = await api.put(`${API_URL}/${id}/read`);
  emitNotificationChange();
  return normalizeNotification(res.data);
};

export const markAllNotificationsAsRead = async () => {
  const res = await api.put(`${API_URL}/read-all`);
  emitNotificationChange();
  return res.data;
};

export const deleteNotification = async (id) => {
  const res = await api.delete(`${API_URL}/${id}`);
  emitNotificationChange();
  return res.data;
};

export const clearAllNotifications = async () => {
  const res = await api.delete(`${API_URL}/clear-all`);
  emitNotificationChange();
  return res.data;
};
