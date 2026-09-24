import React from "react";
import { Box, Paper, Typography, Button, Stack, Chip } from "@mui/material";
import {
  Construction,
  ArrowBack,
  Home,
  AutoAwesome,
  RocketLaunch,
  NotificationsActiveOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function UnderDevelopment({
  featureName = "Tính năng này",
  title = "Tính năng đang phát triển",
  description = "Chúng tôi đang tích cực hoàn thiện tính năng này để mang đến trải nghiệm tốt nhất cho bạn. Vui lòng quay lại sau!",
  homeUrl = "/",
  homeLabel = "Về trang chủ",
  minHeight = "65vh",
  showHomeButton = true,
  showBackButton = true,
  badge = "Đang phát triển",
}) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 680,
          p: { xs: 3.5, sm: 5 },
          borderRadius: 4,
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          textAlign: "center",
          boxShadow: "0 10px 30px -10px rgba(15, 23, 42, 0.05), 0 2px 8px -2px rgba(15, 23, 42, 0.02)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative top bar gradient */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          }}
        />

        <Stack spacing={3} alignItems="center">
          {/* Main Icon Graphic */}
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "24px",
                background: "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563eb",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                boxShadow: "0 10px 25px rgba(37, 99, 235, 0.12)",
              }}
            >
              <Construction sx={{ fontSize: 42 }} />
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                width: 28,
                height: 28,
                borderRadius: "50%",
                bgcolor: "#f59e0b",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.35)",
              }}
            >
              <AutoAwesome sx={{ fontSize: 16 }} />
            </Box>
          </Box>

          {/* Status Badge */}
          <Chip
            icon={<RocketLaunch sx={{ fontSize: "14px !important" }} />}
            label={badge}
            color="primary"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.78rem",
              borderRadius: "20px",
              px: 0.5,
              borderColor: "rgba(37, 99, 235, 0.3)",
              bgcolor: "rgba(37, 99, 235, 0.04)",
            }}
          />

          {/* Title & Description */}
          <Box sx={{ maxWidth: 520 }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                color: "#0f172a",
                mb: 1.25,
                fontSize: { xs: "1.25rem", sm: "1.45rem" },
                letterSpacing: "-0.3px",
              }}
            >
              {featureName ? `${featureName} - ${title}` : title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: "0.92rem",
                lineHeight: 1.65,
                color: "#64748b",
              }}
            >
              {description}
            </Typography>
          </Box>

          {/* Feature Highlights/Note Card */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 480,
              p: 2,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              border: "1px dashed #cbd5e1",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              textAlign: "left",
            }}
          >
            <NotificationsActiveOutlined sx={{ color: "#2563eb", fontSize: 24, flexShrink: 0 }} />
            <Box>
              <Typography variant="caption" fontWeight={700} color="#1e293b" sx={{ display: "block" }}>
                Sắp ra mắt
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.78rem", lineHeight: 1.4 }}>
                Hệ thống đang tích hợp và kiểm thử giao diện để đảm bảo tính ổn định và bảo mật cao nhất.
              </Typography>
            </Box>
          </Paper>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ width: { xs: "100%", sm: "auto" }, pt: 1 }}
          >
            {showBackButton && (
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  px: 2.5,
                  py: 1,
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  "&:hover": {
                    borderColor: "#94a3b8",
                    bgcolor: "#f1f5f9",
                  },
                }}
              >
                Quay lại trang trước
              </Button>
            )}

            {showHomeButton && (
              <Button
                variant="contained"
                startIcon={<Home />}
                onClick={() => navigate(homeUrl)}
                sx={{
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.88rem",
                  px: 2.5,
                  py: 1,
                  bgcolor: "#2563eb",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                    boxShadow: "0 6px 16px rgba(37, 99, 235, 0.35)",
                  },
                }}
              >
                {homeLabel}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
