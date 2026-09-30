import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Divider,
  Chip,
} from "@mui/material";
import {
  CalendarMonth,
  Home,
  FilePresent,
  Person,
  Work,
  Notifications,
  Settings,
  AutoAwesome,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserProfileSidebar({
  activeTab,
  setActiveTab,
  user,
  searchActive,
  setSearchActive,
  interviewCount = 0,
  notificationCount = 0,
}) {
  const menuItems = [
    { id: "overview", icon: <Home fontSize="small" />, text: "Tổng quan" },
    { id: "profile_itviec", icon: <Person fontSize="small" />, text: "Hồ sơ cá nhân" },
    { id: "attached_cv", icon: <FilePresent fontSize="small" />, text: "Hồ sơ đính kèm" },
    { id: "my_jobs", icon: <Work fontSize="small" />, text: "Việc làm của tôi" },
    { id: "interviews", icon: <CalendarMonth fontSize="small" />, text: "Lịch phỏng vấn", badge: interviewCount > 0 ? interviewCount : undefined },
    { id: "ai_usage", icon: <AutoAwesome fontSize="small" />, text: "Hạn mức & Gói AI" },
    { id: "notifications", icon: <Notifications fontSize="small" />, text: "Thông báo", badge: notificationCount > 0 ? notificationCount : undefined },
    { id: "settings", icon: <Settings fontSize="small" />, text: "Cài đặt tài khoản" },
  ];

  return (
    <Stack spacing={3}>
      {/* User Quick Info */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={2.5}>
          <Box
            onClick={() => setActiveTab("overview")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": { opacity: 0.85 },
            }}
          >
            <Avatar
              src={getMediaUrl(user?.avatarUrl || user?.avatar)}
              sx={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #0284c7, #2563eb)",
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: 800,
                boxShadow: "0 2px 8px rgba(2,132,199,0.25)",
              }}
            >
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                Xin chào
              </Typography>
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.2 }}>
                {user?.fullName || "Khách"}
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* CV Search Visibility Switch */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="body2" fontWeight={700} color="#334155" sx={{ fontSize: "0.85rem" }}>
                Cho phép tìm kiếm CV
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
                {searchActive ? "Đang bật tìm kiếm" : "Đang ẩn với NTD"}
              </Typography>
            </Box>
            <Box
              onClick={() => setSearchActive(!searchActive)}
              sx={{
                width: 42,
                height: 24,
                bgcolor: searchActive ? "#2563eb" : "#cbd5e1",
                borderRadius: "12px",
                p: "2px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  bgcolor: "#ffffff",
                  borderRadius: "50%",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  transform: searchActive ? "translateX(18px)" : "translateX(0)",
                  transition: "transform 0.3s ease",
                }}
              />
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* Navigation Menu */}
      <Paper
        sx={{
          p: 1.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={0.5}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Box
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.25,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  bgcolor: isActive ? "#eff6ff" : "transparent",
                  color: isActive ? "#2563eb" : "#475569",
                  fontWeight: isActive ? 700 : 500,
                  "&:hover": {
                    bgcolor: isActive ? "#eff6ff" : "#f8fafc",
                    color: isActive ? "#2563eb" : "#0f172a",
                  },
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      color: isActive ? "#2563eb" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={isActive ? 800 : 600}
                    sx={{ fontSize: "0.88rem" }}
                  >
                    {item.text}
                  </Typography>
                </Stack>
                {item.badge !== undefined && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      bgcolor: isActive ? "#2563eb" : "#ef4444",
                      color: "#ffffff",
                      px: 0.5,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
