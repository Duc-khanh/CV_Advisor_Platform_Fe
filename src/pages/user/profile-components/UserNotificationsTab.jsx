import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Notifications,
  NotificationsActive,
  CalendarMonth,
  Work,
  AutoAwesome,
  Info,
  DoneAll,
  DeleteOutline,
  Search,
  Refresh,
  OpenInNew,
  AccessTime,
  MarkEmailRead,
  NotificationsOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  NOTIFICATIONS_CHANGED_EVENT,
} from "../../../services/notificationService";

export default function UserNotificationsTab({ setActiveTab: setParentActiveTab }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL"); // ALL, UNREAD, INTERVIEW, APPLICATION, AI_USAGE, SYSTEM
  const [searchKeyword, setSearchKeyword] = useState("");
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchNotificationsData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi khi tải thông báo:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificationsData();

    const handleNotifUpdate = () => {
      fetchNotificationsData();
    };
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);
    };
  }, [fetchNotificationsData]);

  // Format relative time / date
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      if (diffDays === 1) return "Hôm qua";
      if (diffDays < 7) return `${diffDays} ngày trước`;

      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  // Icon & color by notification type
  const getTypeMeta = (type) => {
    switch (type) {
      case "INTERVIEW":
        return {
          icon: <CalendarMonth sx={{ fontSize: 22 }} />,
          label: "Lịch phỏng vấn",
          bg: "#eff6ff",
          color: "#2563eb",
          border: "#bfdbfe",
        };
      case "APPLICATION":
        return {
          icon: <Work sx={{ fontSize: 22 }} />,
          label: "Ứng tuyển",
          bg: "#ecfdf5",
          color: "#059669",
          border: "#a7f3d0",
        };
      case "AI_USAGE":
        return {
          icon: <AutoAwesome sx={{ fontSize: 22 }} />,
          label: "AI & Token",
          bg: "#f5f3ff",
          color: "#7c3aed",
          border: "#ddd6fe",
        };
      case "JOB_MATCH":
        return {
          icon: <Work sx={{ fontSize: 22 }} />,
          label: "Gợi ý việc làm",
          bg: "#fff7ed",
          color: "#ea580c",
          border: "#fed7aa",
        };
      case "SYSTEM":
      default:
        return {
          icon: <Info sx={{ fontSize: 22 }} />,
          label: "Hệ thống",
          bg: "#f8fafc",
          color: "#475569",
          border: "#e2e8f0",
        };
    }
  };

  // Actions
  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  const handleMarkAllRead = async () => {
    setActionLoading(true);
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (err) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Lỗi khi xóa thông báo:", err);
    }
  };

  const handleClearAll = async () => {
    setActionLoading(true);
    try {
      await clearAllNotifications();
      setNotifications([]);
      setClearDialogOpen(false);
    } catch (err) {
      console.error("Lỗi khi xóa tất cả thông báo:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCardClick = (item) => {
    if (!item.isRead) {
      handleMarkAsRead(item.id);
    }
    if (item.link) {
      if (item.link.startsWith("/profile?tab=")) {
        const tab = item.link.split("tab=")[1];
        if (setParentActiveTab) {
          setParentActiveTab(tab);
        }
        navigate(item.link);
      } else {
        navigate(item.link);
      }
    }
  };

  // Filtered List
  const filteredNotifications = notifications.filter((item) => {
    // Type Filter
    if (filterType === "UNREAD" && item.isRead) return false;
    if (filterType !== "ALL" && filterType !== "UNREAD" && item.type !== filterType) return false;

    // Search Keyword
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(kw);
      const matchMsg = item.message?.toLowerCase().includes(kw);
      if (!matchTitle && !matchMsg) return false;
    }
    return true;
  });

  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const interviewCount = notifications.filter((n) => n.type === "INTERVIEW").length;
  const appCount = notifications.filter((n) => n.type === "APPLICATION").length;
  const aiCount = notifications.filter((n) => n.type === "AI_USAGE").length;

  return (
    <Stack spacing={3}>
      {/* Header Bar */}
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "14px",
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.12)",
                }}
              >
                <NotificationsActive sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={800} color="#0f172a" sx={{ fontSize: "1.15rem" }}>
                  Thông báo của bạn
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                  Cập nhật tin tức phỏng vấn, trạng thái hồ sơ ứng tuyển & các tiện ích AI
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<DoneAll sx={{ fontSize: 18 }} />}
                onClick={handleMarkAllRead}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  borderColor: "#bfdbfe",
                  color: "#2563eb",
                  bgcolor: "#f0f7ff",
                  "&:hover": {
                    bgcolor: "#e0edff",
                    borderColor: "#93c5fd",
                  },
                }}
              >
                Đã đọc tất cả
              </Button>
            )}

            {totalCount > 0 && (
              <Button
                variant="text"
                size="small"
                color="error"
                startIcon={<DeleteOutline sx={{ fontSize: 18 }} />}
                onClick={() => setClearDialogOpen(true)}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: 2.5,
                }}
              >
                Xóa tất cả
              </Button>
            )}

            <Tooltip title="Làm mới thông báo">
              <IconButton
                onClick={fetchNotificationsData}
                disabled={loading}
                sx={{
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <Refresh sx={{ fontSize: 20, color: "#64748b" }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Filter & Search Bar */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          {/* Filter Chips */}
          <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: { xs: 1, md: 0 } }}>
            <Chip
              label={`Tất cả (${totalCount})`}
              onClick={() => setFilterType("ALL")}
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                bgcolor: filterType === "ALL" ? "#2563eb" : "#f1f5f9",
                color: filterType === "ALL" ? "#ffffff" : "#475569",
                "&:hover": {
                  bgcolor: filterType === "ALL" ? "#1d4ed8" : "#e2e8f0",
                },
              }}
            />
            <Chip
              label={`Chưa đọc (${unreadCount})`}
              onClick={() => setFilterType("UNREAD")}
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                bgcolor: filterType === "UNREAD" ? "#ef4444" : "#fef2f2",
                color: filterType === "UNREAD" ? "#ffffff" : "#dc2626",
                "&:hover": {
                  bgcolor: filterType === "UNREAD" ? "#dc2626" : "#fee2e2",
                },
              }}
            />
            <Chip
              label={`Phỏng vấn (${interviewCount})`}
              onClick={() => setFilterType("INTERVIEW")}
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                bgcolor: filterType === "INTERVIEW" ? "#2563eb" : "#f1f5f9",
                color: filterType === "INTERVIEW" ? "#ffffff" : "#475569",
                "&:hover": {
                  bgcolor: filterType === "INTERVIEW" ? "#1d4ed8" : "#e2e8f0",
                },
              }}
            />
            <Chip
              label={`Ứng tuyển (${appCount})`}
              onClick={() => setFilterType("APPLICATION")}
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                bgcolor: filterType === "APPLICATION" ? "#059669" : "#f1f5f9",
                color: filterType === "APPLICATION" ? "#ffffff" : "#475569",
                "&:hover": {
                  bgcolor: filterType === "APPLICATION" ? "#047857" : "#e2e8f0",
                },
              }}
            />
            <Chip
              label={`AI & Token (${aiCount})`}
              onClick={() => setFilterType("AI_USAGE")}
              sx={{
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer",
                bgcolor: filterType === "AI_USAGE" ? "#7c3aed" : "#f1f5f9",
                color: filterType === "AI_USAGE" ? "#ffffff" : "#475569",
                "&:hover": {
                  bgcolor: filterType === "AI_USAGE" ? "#6d28d9" : "#e2e8f0",
                },
              }}
            />
          </Stack>

          {/* Search Box */}
          <TextField
            size="small"
            placeholder="Tìm kiếm thông báo..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ fontSize: 20, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              sx: {
                borderRadius: 2.5,
                bgcolor: "#f8fafc",
                fontSize: "0.875rem",
                width: { xs: "100%", md: 240 },
              },
            }}
          />
        </Stack>
      </Paper>

      {/* Notification List Content */}
      {loading ? (
        <Paper
          sx={{
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            border: "1px solid #e2e8f0",
          }}
        >
          <CircularProgress size={36} thickness={4} sx={{ color: "#2563eb", mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Đang tải thông báo...
          </Typography>
        </Paper>
      ) : filteredNotifications.length === 0 ? (
        <Paper
          sx={{
            py: 8,
            px: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            borderRadius: 3,
            border: "1px dashed #cbd5e1",
            bgcolor: "#ffffff",
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              color: "#94a3b8",
            }}
          >
            <NotificationsOff sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="subtitle1" fontWeight={700} color="#334155" sx={{ mb: 0.5 }}>
            Không tìm thấy thông báo nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
            {filterType === "UNREAD"
              ? "Bạn đã đọc hết tất cả thông báo. Tuyệt vời!"
              : searchKeyword
              ? "Không có thông báo nào khớp với từ khóa tìm kiếm của bạn."
              : "Hiện tại bạn chưa có thông báo mới nào từ hệ thống."}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={1.5}>
          {filteredNotifications.map((item) => {
            const meta = getTypeMeta(item.type);
            const isUnread = !item.isRead;

            return (
              <Card
                key={item.id}
                onClick={() => handleCardClick(item)}
                sx={{
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: isUnread ? "#bfdbfe" : "#e2e8f0",
                  bgcolor: isUnread ? "#f8fbff" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: isUnread
                    ? "0 2px 8px rgba(37, 99, 235, 0.08)"
                    : "0 1px 3px rgba(0,0,0,0.02)",
                  "&:hover": {
                    borderColor: "#3b82f6",
                    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.12)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-start">
                    {/* Icon Category Avatar */}
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "12px",
                        bgcolor: meta.bg,
                        color: meta.color,
                        border: "1px solid " + meta.border,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {meta.icon}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                        sx={{ mb: 0.8 }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Chip
                            label={meta.label}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: "0.72rem",
                              fontWeight: 800,
                              bgcolor: meta.bg,
                              color: meta.color,
                              border: "1px solid " + meta.border,
                            }}
                          />
                          {isUnread && (
                            <Chip
                              label="Mới"
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: "0.68rem",
                                fontWeight: 800,
                                bgcolor: "#2563eb",
                                color: "#ffffff",
                              }}
                            />
                          )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={0.5} color="#94a3b8">
                          <AccessTime sx={{ fontSize: 14 }} />
                          <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
                            {formatTime(item.createdAt)}
                          </Typography>
                        </Stack>
                      </Stack>

                      {/* Title */}
                      <Typography
                        variant="subtitle1"
                        fontWeight={isUnread ? 800 : 700}
                        color={isUnread ? "#0f172a" : "#334155"}
                        sx={{ fontSize: "0.95rem", lineHeight: 1.4, mb: 0.6 }}
                      >
                        {item.title}
                      </Typography>

                      {/* Message */}
                      <Typography
                        variant="body2"
                        color="#475569"
                        sx={{
                          fontSize: "0.875rem",
                          lineHeight: 1.5,
                          whiteSpace: "pre-line",
                          mb: item.link ? 1.5 : 0,
                        }}
                      >
                        {item.message}
                      </Typography>

                      {/* Action Links & Buttons */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ mt: 1 }}
                      >
                        {item.link ? (
                          <Button
                            size="small"
                            variant="text"
                            endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCardClick(item);
                            }}
                            sx={{
                              p: 0,
                              textTransform: "none",
                              fontWeight: 700,
                              fontSize: "0.82rem",
                              color: "#2563eb",
                              "&:hover": {
                                bgcolor: "transparent",
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {item.actionText || "Xem chi tiết"}
                          </Button>
                        ) : <Box />}

                        {/* Card controls (mark read, delete) */}
                        <Stack direction="row" spacing={1} alignItems="center">
                          {isUnread && (
                            <Tooltip title="Đánh dấu đã đọc">
                              <IconButton
                                size="small"
                                onClick={(e) => handleMarkAsRead(item.id, e)}
                                sx={{
                                  color: "#64748b",
                                  "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
                                }}
                              >
                                <MarkEmailRead sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Xóa thông báo">
                            <IconButton
                              size="small"
                              onClick={(e) => handleDelete(item.id, e)}
                              sx={{
                                color: "#94a3b8",
                                "&:hover": { color: "#ef4444", bgcolor: "#fee2e2" },
                              }}
                            >
                              <DeleteOutline sx={{ fontSize: 18 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Confirmation Dialog for Clearing All */}
      <Dialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Xác nhận xóa tất cả thông báo?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Thao tác này sẽ xóa toàn bộ danh sách thông báo của bạn và không thể khôi phục lại. Bạn có chắc chắn muốn tiếp tục?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setClearDialogOpen(false)}
            sx={{ fontWeight: 700, textTransform: "none", color: "#64748b" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleClearAll}
            color="error"
            variant="contained"
            disabled={actionLoading}
            sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
          >
            {actionLoading ? "Đang xóa..." : "Xóa tất cả"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
