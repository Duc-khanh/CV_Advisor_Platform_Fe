import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import {
  ChevronRight,
  Description,
  Visibility,
  FilePresent,
  ArrowForward,
  AutoAwesome,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserProfileOverviewTab({
  user,
  completionPercent,
  setActiveTab,
  appliedJobsCount = 0,
  savedJobsCount = 0,
  inviteCount = 0,
}) {
  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "K";

  return (
    <Stack spacing={3}>
      {/* 1. Header Card (Basic info summary) */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {/* Avatar circle */}
          <Avatar
            src={getMediaUrl(user.avatarUrl || user.avatar)}
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#9d174d", // Dark pink/magenta like in the screenshot
              fontSize: "1.8rem",
              fontWeight: 800,
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5}>
              {user.fullName || "Tên ứng viên"}
            </Typography>

            <Stack spacing={0.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <AutoAwesome sx={{ fontSize: 16 }} />
                <Typography variant="body2" fontWeight={600} color="#64748b">
                  {user.headline || "Cập nhật chức danh"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <Description sx={{ fontSize: 16 }} />
                <Typography variant="body2" color="#64748b">
                  {user.email || "nguyenkhanh2561990@gmail.com"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Button
            onClick={() => setActiveTab("profile_itviec")}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: "none",
              color: "#2563eb",
              fontWeight: 800,
              fontSize: "0.875rem",
              "&:hover": { bgcolor: "#f0f7ff" },
            }}
          >
            Cập nhật hồ sơ
          </Button>
        </Box>
      </Paper>

      {/* 2. "Nhà tuyển dụng xem CV" box (Green border and text) */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
          border: "2px solid #22c55e", // Solid green border
          bgcolor: "#f0fdf4", // Light green tint
          position: "relative",
        }}
      >
        {/* NEW badge */}
        <Typography
          variant="caption"
          fontWeight={900}
          color="#16a34a"
          sx={{
            position: "absolute",
            top: 12,
            right: 16,
            fontSize: "0.7rem",
            letterSpacing: "0.05em",
          }}
        >
          MỚI
        </Typography>

        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          {/* Left badge */}
          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: "50%",
              bgcolor: "#dcfce7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #bbf7d0",
            }}
          >
            <Typography variant="h6" fontWeight={900} color="#16a34a" sx={{ lineHeight: 1 }}>
              0
            </Typography>
            <Typography variant="caption" fontWeight={700} color="#16a34a" sx={{ fontSize: "0.55rem" }}>
              lượt xem
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={800} color="#15803d" mb={0.5}>
              Nhà tuyển dụng xem CV
            </Typography>
            <Typography variant="body2" color="#166534" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              CV ẩn danh của bạn được các nhà tuyển dụng xem khi tìm kiếm ứng viên.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 3. "Hồ sơ đính kèm của bạn" box */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={2}>
          Hồ sơ đính kèm của bạn
        </Typography>

        <Box
          sx={{
            p: 2.5,
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            bgcolor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Pink folder icon */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "#ffe4e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FilePresent sx={{ color: "#fb7185", fontSize: 28 }} />
            </Box>

            <Box>
              <Typography
                variant="body2"
                fontWeight={700}
                color="#0f172a"
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": { color: "#ef4444" },
                }}
              >
                NguyenDucKhanhCVFullStack.pdf
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Cập nhật lần cuối: 13/04/2026
              </Typography>
            </Box>
          </Box>

          <Button
            onClick={() => setActiveTab("attached_cv")}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: "none",
              color: "#2563eb",
              fontWeight: 800,
              fontSize: "0.85rem",
            }}
          >
            Tải lên ngay
          </Button>
        </Box>
      </Paper>

      {/* 4. "Hồ sơ ITviec" box (completeness and templates preview) */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={2}>
          Hồ sơ ITviec
        </Typography>

        <Grid container spacing={3} alignItems="center">
          {/* Half ring completeness SVG gauge */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ position: "relative", width: 110, height: 110, display: "flex", justifyContent: "center" }}>
                {/* SVG circular progress */}
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#fee2e2"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ef4444"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * completionPercent) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={900} color="#ef4444" sx={{ lineHeight: 1 }}>
                    {completionPercent}%
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: "0.6rem" }}>
                    hoàn thành
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="#334155" fontWeight={600} mb={1.5} sx={{ lineHeight: 1.5 }}>
                  Nâng cấp hồ sơ của bạn lên <strong style={{ color: "#ef4444" }}>70%</strong> để bắt đầu tạo mẫu CV IT chuyên nghiệp.
                </Typography>
                <Button
                  onClick={() => setActiveTab("profile_itviec")}
                  endIcon={<ChevronRight />}
                  sx={{
                    textTransform: "none",
                    color: "#2563eb",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    p: 0,
                    "&:hover": { bgcolor: "transparent", color: "#1d4ed8" },
                  }}
                >
                  Nâng cấp hồ sơ
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Previews of CV template thumbnails */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {/* Sample template 1 */}
              <Box
                sx={{
                  width: 54,
                  height: 72,
                  borderRadius: 1,
                  border: "1px solid #cbd5e1",
                  bgcolor: "#f1f5f9",
                  backgroundImage: "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=200')",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                }}
              />
              {/* Sample template 2 */}
              <Box
                sx={{
                  width: 54,
                  height: 72,
                  borderRadius: 1,
                  border: "1px solid #cbd5e1",
                  bgcolor: "#f1f5f9",
                  backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200')",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                }}
              />
              {/* Explore action template */}
              <Box
                onClick={() => setActiveTab("profile_itviec")}
                sx={{
                  width: 60,
                  height: 72,
                  borderRadius: 1.5,
                  border: "1.5px dashed #f87171",
                  bgcolor: "#fff5f5",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  p: 0.5,
                  transition: "0.2s",
                  "&:hover": { bgcolor: "#fee2e2" },
                }}
              >
                <IconButton size="small" sx={{ bgcolor: "#ef4444", color: "#ffffff", width: 22, height: 22, p: 0, mb: 0.5, "&:hover": { bgcolor: "#ef4444" } }}>
                  <ArrowForward sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography variant="caption" color="#b91c1c" fontWeight={800} align="center" sx={{ fontSize: "0.55rem", lineHeight: 1.1 }}>
                  Khám phá mẫu CV
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 5. "Hoạt động của bạn" box */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={2.5}>
          Hoạt động của bạn
        </Typography>

        <Grid container spacing={2.5}>
          {/* Applied jobs block */}
          <Grid item xs={12} sm={4}>
            <Paper
              onClick={() => setActiveTab("my_jobs")}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#eff6ff", // Blue
                border: "1.5px solid #dbeafe",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(59, 130, 246, 0.1)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#1e40af" mb={1} sx={{ fontSize: "0.85rem" }}>
                Việc làm đã ứng tuyển
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#2563eb">
                {appliedJobsCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -5,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                }}
              >
                <ArrowForward sx={{ fontSize: 90, color: "#2563eb" }} />
              </Box>
            </Paper>
          </Grid>

          {/* Saved jobs block */}
          <Grid item xs={12} sm={4}>
            <Paper
              onClick={() => setActiveTab("my_jobs")} // or tab can go to my_jobs with subtab
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#fff5f5", // Red/Pink
                border: "1.5px solid #fee2e2",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(239, 68, 68, 0.1)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#991b1b" mb={1} sx={{ fontSize: "0.85rem" }}>
                Việc làm đã lưu
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#ef4444">
                {savedJobsCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -15,
                  right: -5,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                }}
              >
                <AutoAwesome sx={{ fontSize: 90, color: "#ef4444" }} />
              </Box>
            </Paper>
          </Grid>

          {/* Invitations block */}
          <Grid item xs={12} sm={4}>
            <Paper
              onClick={() => setActiveTab("invites")}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#f0fdf4", // Green
                border: "1.5px solid #dcfce7",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(16, 185, 129, 0.1)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#166534" mb={1} sx={{ fontSize: "0.85rem" }}>
                Lời mời công việc
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#10b981">
                {inviteCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  opacity: 0.12,
                  transform: "rotate(-10deg)",
                }}
              >
                <Visibility sx={{ fontSize: 90, color: "#10b981" }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
