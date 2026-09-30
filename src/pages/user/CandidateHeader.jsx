import React, { useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Divider,
  MenuList,
  IconButton,
  Badge,
  CircularProgress,
  Stack,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Person,
  Home,
  FilePresent,
  Work,
  NotificationsNone,
  Notifications,
  CalendarMonth,
  AutoAwesome,
  Info,
  DoneAll,
  OpenInNew,
  AccessTime,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmDialog from "../../components/dialogs/LogoutConfirmDialog";
import Navbar from "../../components/ui/Navbar";
import { getCurrentUser } from "../../services/user/currentUser";
import { getMediaUrl } from "../../utils/urlHelpers";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  NOTIFICATIONS_CHANGED_EVENT,
} from "../../services/notificationService";

export default function CandidateHeader() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // ===== USER STATE =====
  const [user, setUser] = useState(null);

  // ===== MENU USER =====
  const [anchorUser, setAnchorUser] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const openUserMenu = Boolean(anchorUser);

  // ===== NOTIFICATION STATE =====
  const [anchorNotif, setAnchorNotif] = useState(null);
  const openNotifMenu = Boolean(anchorNotif);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const showToast = useToast();

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  // ===== FETCH USER & NOTIFICATIONS =====
  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((res) => {
          const userData = res.data.data || res.data;
          setUser(userData);
        })
        .catch((err) => {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
          }
          console.error("Lỗi khi tải thông tin user:", err);
        });

      fetchUnreadCount();

      // Listen for global notification update events
      const handleNotifUpdate = () => {
        fetchUnreadCount();
      };
      window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);

      // Polling định kỳ mỗi 45s để cập nhật thông báo mới
      const interval = setInterval(fetchUnreadCount, 45000);
      return () => {
        clearInterval(interval);
        window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);
      };
    }
  }, [token, navigate, fetchUnreadCount]);

  const handleOpenNotifMenu = async (event) => {
    setAnchorNotif(event.currentTarget);
    setLoadingNotifs(true);
    try {
      const data = await getNotifications();
      const notifs = Array.isArray(data) ? data : [];
      setRecentNotifications(notifs.slice(0, 7));
      const unread = notifs.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Lỗi tải thông báo popup:", err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  const handleCloseNotifMenu = () => setAnchorNotif(null);

  const handleMarkAllReadPopup = async (e) => {
    if (e) e.stopPropagation();
    try {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await markNotificationAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setRecentNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch (e) {
        console.error(e);
      }
    }
    handleCloseNotifMenu();
    if (notif.link) {
      navigate(notif.link);
    } else {
      navigate("/profile?tab=notifications");
    }
  };

  // ===== GET INITIALS =====
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0].toUpperCase() +
      words[words.length - 1][0].toUpperCase()
    );
  };

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
      return `${diffDays} ngày trước`;
    } catch {
      return dateStr;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "INTERVIEW":
        return <CalendarMonth sx={{ fontSize: 18, color: "#2563eb" }} />;
      case "APPLICATION":
        return <Work sx={{ fontSize: 18, color: "#059669" }} />;
      case "AI_USAGE":
        return <AutoAwesome sx={{ fontSize: 18, color: "#7c3aed" }} />;
      default:
        return <Info sx={{ fontSize: 18, color: "#64748b" }} />;
    }
  };

  const handleOpenUserMenu = (event) => setAnchorUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorUser(null);

  const goTo = (path) => {
    navigate(path);
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    setLogoutDialogOpen(false);
    showToast("Đăng xuất thành công!", "success");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        borderBottom: "1px solid #f1f5f9",
        zIndex: 1100,
      }}
    >
      <Box sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 } }}>
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: "68px",
          }}
        >
          {/* LOGO */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
              mr: { xs: 2, md: 4 },
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="CareerGo Logo"
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                mr: 1.2,
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "1.25rem", sm: "1.35rem" },
                letterSpacing: "-0.5px",
                color: "#0f172a",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Career<Box component="span" sx={{ color: "#2563eb", ml: "1px" }}>Go</Box>
            </Typography>
          </Box>

          {/* RIGHT SIDE GROUP: NAVIGATION + NOTIFICATIONS + USER PROFILE */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1.5, sm: 2.5, md: 3 },
            }}
          >
            {/* NAVIGATION MENU */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
              <Navbar />
            </Box>

            {/* NOTIFICATION BELL & POPUP */}
            {isLoggedIn && (
              <Box sx={{ position: "relative" }}>
                <Tooltip title="Thông báo">
                  <IconButton
                    onClick={handleOpenNotifMenu}
                    sx={{
                      width: 40,
                      height: 40,
                      color: unreadCount > 0 ? "#2563eb" : "#64748b",
                      bgcolor: openNotifMenu ? "#eff6ff" : "transparent",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                        color: "#2563eb",
                      },
                    }}
                  >
                    <Badge
                      badgeContent={unreadCount}
                      max={99}
                      sx={{
                        "& .MuiBadge-badge": {
                          bgcolor: "#ef4444",
                          color: "#ffffff",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          height: 18,
                          minWidth: 18,
                        },
                      }}
                    >
                      {unreadCount > 0 ? <Notifications /> : <NotificationsNone />}
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* NOTIFICATION DROPDOWN POPUP */}
                <Menu
                  anchorEl={anchorNotif}
                  open={openNotifMenu}
                  onClose={handleCloseNotifMenu}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      width: 380,
                      maxWidth: "92vw",
                      borderRadius: 3,
                      boxShadow: "0 20px 50px rgba(15, 23, 42, 0.15)",
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      p: 0,
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {/* POPUP HEADER */}
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #f1f5f9",
                      bgcolor: "#ffffff",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight={800} fontSize="0.95rem" color="#0f172a">
                        Thông báo
                      </Typography>
                      {unreadCount > 0 && (
                        <Chip
                          label={`${unreadCount} mới`}
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
                    </Box>

                    {unreadCount > 0 && (
                      <Button
                        size="small"
                        startIcon={<DoneAll sx={{ fontSize: 16 }} />}
                        onClick={handleMarkAllReadPopup}
                        sx={{
                          textTransform: "none",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#2563eb",
                          p: "2px 8px",
                          borderRadius: 1.5,
                          "&:hover": { bgcolor: "#eff6ff" },
                        }}
                      >
                        Đã đọc tất cả
                      </Button>
                    )}
                  </Box>

                  {/* POPUP LIST BODY */}
                  <Box sx={{ maxHeight: 360, overflowY: "auto" }}>
                    {loadingNotifs ? (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <CircularProgress size={24} sx={{ color: "#2563eb" }} />
                      </Box>
                    ) : recentNotifications.length === 0 ? (
                      <Box sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Bạn chưa có thông báo mới nào
                        </Typography>
                      </Box>
                    ) : (
                      recentNotifications.map((item) => (
                        <Box
                          key={item.id}
                          onClick={() => handleNotifClick(item)}
                          sx={{
                            p: 1.5,
                            px: 2,
                            display: "flex",
                            gap: 1.5,
                            alignItems: "flex-start",
                            cursor: "pointer",
                            bgcolor: !item.isRead ? "#f0f7ff" : "#ffffff",
                            borderBottom: "1px solid #f8fafc",
                            transition: "background-color 0.15s ease",
                            "&:hover": {
                              bgcolor: !item.isRead ? "#e0effe" : "#f8fafc",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "8px",
                              bgcolor: !item.isRead ? "#dbeafe" : "#f1f5f9",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              mt: 0.2,
                            }}
                          >
                            {getTypeIcon(item.type)}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight={!item.isRead ? 800 : 600}
                              color="#0f172a"
                              sx={{
                                fontSize: "0.84rem",
                                lineHeight: 1.3,
                                mb: 0.3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="#64748b"
                              sx={{
                                fontSize: "0.78rem",
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="#94a3b8"
                              sx={{ fontSize: "0.7rem", fontWeight: 600, mt: 0.5, display: "block" }}
                            >
                              {formatTime(item.createdAt)}
                            </Typography>
                          </Box>
                          {!item.isRead && (
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "#2563eb",
                                flexShrink: 0,
                                mt: 0.8,
                              }}
                            />
                          )}
                        </Box>
                      ))
                    )}
                  </Box>

                  {/* POPUP FOOTER */}
                  <Box
                    sx={{
                      p: 1.2,
                      textAlign: "center",
                      borderTop: "1px solid #e2e8f0",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      onClick={() => {
                        handleCloseNotifMenu();
                        navigate("/profile?tab=notifications");
                      }}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: "#2563eb",
                      }}
                    >
                      Xem tất cả thông báo &rarr;
                    </Button>
                  </Box>
                </Menu>
              </Box>
            )}

            {/* USER SECTION / AVATAR */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                borderLeft: { xs: "none", sm: "1px solid #e2e8f0" },
                pl: { xs: 0, sm: 2 },
              }}
            >
              {isLoggedIn ? (
                <Avatar
                  src={getMediaUrl(user?.avatarUrl || user?.avatar)}
                  onClick={handleOpenUserMenu}
                  sx={{
                    bgcolor: "#2563eb",
                    width: 36,
                    height: 36,
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(37,99,235,0.2)",
                  }}
                >
                  {!user?.avatarUrl && !user?.avatar && getInitials(user?.fullName)}
                </Avatar>
              ) : (
                <Button
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{
                    fontWeight: 800,
                    textTransform: "none",
                    color: "#ffffff",
                    bgcolor: "#2563eb",
                    px: 2.5,
                    py: 0.8,
                    borderRadius: "20px",
                    boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Đăng nhập
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Box>

      {/* MENU USER */}
      <Menu
        anchorEl={anchorUser}
        open={openUserMenu}
        onClose={handleCloseUserMenu}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 260,
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar
            src={getMediaUrl(user?.avatarUrl || user?.avatar)}
            sx={{ bgcolor: "#2563eb", width: 44, height: 44, fontSize: "1rem", fontWeight: 800 }}
          >
            {!user?.avatarUrl && !user?.avatar && getInitials(user?.fullName)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography fontWeight={800} fontSize="0.95rem" noWrap>
              {user?.fullName || "Người dùng"}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.8rem" noWrap>
              {user?.email || "Chưa có email"}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <MenuList dense>
          <MenuItem onClick={() => goTo("/profile?tab=overview")}>
            <Home fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Tổng quan
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=profile_itviec")}>
            <Person fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Hồ sơ cá nhân
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=attached_cv")}>
            <FilePresent fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Hồ sơ đính kèm
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=my_jobs")}>
            <Work fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Việc làm của tôi
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=notifications")}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Notifications fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Thông báo
              </Box>
              {unreadCount > 0 && (
                <Chip
                  label={unreadCount}
                  size="small"
                  sx={{
                    height: 18,
                    minWidth: 18,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: "#ef4444",
                    color: "#ffffff",
                    px: 0.2,
                  }}
                />
              )}
            </Box>
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=settings")}>
            <Settings fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Cài đặt tài khoản
          </MenuItem>
        </MenuList>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => {
              setLogoutDialogOpen(true);
              setAnchorUser(null);
            }}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>

      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </AppBar>
  );
}
