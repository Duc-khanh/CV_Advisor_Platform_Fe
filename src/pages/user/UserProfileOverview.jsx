import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Stack,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  Visibility,
  FolderOpen,
  AutoAwesome,
  ArrowForward,
  Assignment,
  Favorite,
  Mail,
} from "@mui/icons-material";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function UserProfileOverview({ user, completionPercent }) {
  const avatarUrl = getMediaUrl(user.avatarUrl || user.avatar);

  return (
    <Box id="overview" sx={{ mb: 4 }}>
      <Paper
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box
          component="a"
          href="#overview"
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            p: 1,
            borderRadius: 3,
            transition: "all 0.2s ease",
            '&:hover': { bgcolor: '#f8fafc' },
          }}
        >
          <Avatar
            src={avatarUrl}
            sx={{ width: 92, height: 92, bgcolor: "#ef4444", fontSize: "2rem", fontWeight: 700 }}
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5}>
              {user.fullName || "Tên ứng viên"}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {user.headline || "Cập nhật chức danh hiện tại"}
            </Typography>
            <Typography variant="body2" color="#64748b" mb={1}>
              {user.email || "Chưa cập nhật email"}
            </Typography>
            <Button
              component="a"
              href="#overview"
              endIcon={<ArrowForward />}
              size="small"
              variant="contained"
              sx={{
                textTransform: "none",
                bgcolor: "#2563eb",
                px: 3,
                py: 1.1,
                fontWeight: 700,
                boxShadow: "0 8px 20px rgba(37,99,235,0.12)",
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              Cập nhật hồ sơ
            </Button>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <Visibility sx={{ color: "#2563eb" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Nhà tuyển dụng xem CV
                </Typography>
                <Typography variant="body2" color="#64748b">
                  CV ẩn danh của bạn được các nhà tuyển dụng xem khi tìm kiếm ứng viên.
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h4" fontWeight={800} color="#0f172a">
                0
              </Typography>
              <Chip label="Mới" color="success" />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <FolderOpen sx={{ color: "#ef4444" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Hồ sơ đính kèm của bạn
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Tải lên CV hoặc hồ sơ để tăng khả năng ứng tuyển thành công.
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: "#0f172a",
              }}
            >
              Tải lên ngay
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
              <AutoAwesome sx={{ color: "#10b981" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Hồ sơ tuyển dụng
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Hoàn thiện hồ sơ để bắt đầu tạo mẫu CV chuyên nghiệp.
                </Typography>
              </Box>
            </Box>
            <Typography variant="h5" fontWeight={800} mb={1}>
              {completionPercent}% hoàn thành
            </Typography>
            <LinearProgress variant="determinate" value={completionPercent} sx={{ height: 8, borderRadius: 5, bgcolor: "#f3f4f6", '& .MuiLinearProgress-bar': { bgcolor: '#ef4444' } }} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Assignment sx={{ color: "#2563eb" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Việc làm đã ứng tuyển
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#0f172a">
                  {user.appliedJobsCount || 0}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Favorite sx={{ color: "#ef4444" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Việc làm đã lưu
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#0f172a">
                  {user.savedJobsCount || 0}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 4, border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(15,23,42,0.05)" }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Mail sx={{ color: "#10b981" }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                  Lời mời công việc
                </Typography>
                <Typography variant="h4" fontWeight={800} color="#0f172a">
                  {user.inviteCount || 0}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
