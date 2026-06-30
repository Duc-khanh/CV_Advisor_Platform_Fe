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
  Home,
  FilePresent,
  Person,
  Work,
  Email,
  Assignment,
  Notifications,
  Settings,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserProfileSidebar({
  activeTab,
  setActiveTab,
  user,
  searchActive,
  setSearchActive,
  appliedJobsCount = 0,
  savedJobsCount = 0,
}) {
  const menuItems = [
    { id: "overview", icon: <Home fontSize="small" />, text: "Tổng quan" },
    { id: "attached_cv", icon: <FilePresent fontSize="small" />, text: "Hồ sơ đính kèm" },
    { id: "profile_itviec", icon: <Person fontSize="small" />, text: "Hồ sơ cá nhân" },
    { id: "my_jobs", icon: <Work fontSize="small" />, text: "Việc làm của tôi" },
    { id: "invites", icon: <Email fontSize="small" />, text: "Lời mời công việc", badge: 0 },
    { id: "email_subscribe", icon: <Assignment fontSize="small" />, text: "Đăng ký nhận email" },
    { id: "notifications", icon: <Notifications fontSize="small" />, text: "Thông báo" },
    { id: "settings", icon: <Settings fontSize="small" />, text: "Cài đặt" },
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
              src={getMediaUrl(user.avatarUrl || user.avatar)}
              sx={{
                width: 48,
                height: 48,
                bgcolor: "#f43f5e",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                Xin chào
              </Typography>
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a" sx={{ lineHeight: 1.2 }}>
                {user.fullName || "Khách"}
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
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.75rem" }}>
                Nhà tuyển dụng có thể tìm thấy bạn
              </Typography>
            </Box>
            <Chip
              label={searchActive ? "Bật" : "Tắt"}
              size="small"
              onClick={() => setSearchActive(!searchActive)}
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: searchActive ? "#2563eb" : "#f1f5f9",
                color: searchActive ? "#ffffff" : "#64748b",
                px: 1.2,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: searchActive ? "#1d4ed8" : "#e2e8f0",
                },
              }}
            />
          </Box>

          {/* Profile Views Count */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" fontWeight={700} color="#334155" sx={{ fontSize: "0.85rem" }}>
              Nhà tuyển dụng xem CV
            </Typography>
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: "#10b981",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              0
            </Avatar>
          </Box>
        </Stack>
      </Paper>

      {/* Sidebar Menu Items */}
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
            const isSelected = activeTab === item.id || (item.id === "my_jobs" && activeTab === "saved_jobs");
            return (
              <Box
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  borderRadius: 2.5,
                  cursor: "pointer",
                  transition: "0.2s",
                  bgcolor: isSelected ? "#fff5f5" : "transparent",
                  color: isSelected ? "#ef4444" : "#64748b",
                  "&:hover": {
                    bgcolor: isSelected ? "#fff5f5" : "#f1f5f9",
                    color: isSelected ? "#ef4444" : "#0f172a",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  {item.icon}
                  <Typography variant="body2" fontWeight={isSelected ? 800 : 600} sx={{ fontSize: "0.875rem" }}>
                    {item.text}
                  </Typography>
                </Box>
                {item.badge !== undefined && (
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      bgcolor: "#2563eb",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </Avatar>
                )}
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Stack>
  );
}
