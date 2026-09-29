import React from "react";
import { Paper, Typography, Stack, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PostAdd,
  People,
  EventAvailable,
  RateReview,
  AutoAwesome,
  Settings
} from "@mui/icons-material";

const HRFeatureCard = ({ title, description, icon, gradient, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        width: "100%",
        height: 145,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 1.5,
        borderRadius: 3,
        background: gradient,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.25s ease",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        boxSizing: "border-box",
        overflow: "hidden",
        minWidth: 0,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        }
      }}
    >
      <Stack spacing={1} alignItems="center" sx={{ width: "100%", minWidth: 0, px: 0.5 }}>
        <Box sx={{ color: "#ffffff", display: "flex", mb: 0.25 }}>
          {React.cloneElement(icon, { sx: { fontSize: 30 } })} 
        </Box>

        <Tooltip title={title} arrow placement="top">
          <Typography
            fontWeight={700}
            fontSize={13.5}
            sx={{
              color: "#ffffff",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Tooltip>

        <Tooltip title={description} arrow placement="bottom">
          <Typography
            fontSize={11.5}
            sx={{
              color: "rgba(255,255,255,0.85)",
              width: "100%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            {description}
          </Typography>
        </Tooltip>
      </Stack>
    </Paper>
  );
};

export default function HRFeatureSection() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Tin tuyển dụng",
      desc: "Tạo và quản lý tin tuyển dụng",
      path: "/hr/jobs",
      icon: <PostAdd />,
      bg: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    },
    {
      title: "Hạn mức AI",
      desc: "Theo dõi gói cước & quota AI",
      path: "/hr/ai-usage",
      icon: <AutoAwesome />,
      bg: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    },
    {
      title: "Quản lý Ứng viên",
      desc: "Xem hồ sơ & đánh giá ứng viên",
      path: "/hr/applications",
      icon: <People />,
      bg: "linear-gradient(135deg, #6366f1, #4338ca)",
    },
    {
      title: "Lịch phỏng vấn",
      desc: "Sắp xếp lịch hẹn & phỏng vấn",
      path: "/hr/interviews",
      icon: <EventAvailable />,
      bg: "linear-gradient(135deg, #f59e0b, #d97706)",
    },
    {
      title: "Đánh giá ứng viên",
      desc: "Chấm điểm bài test & kỹ năng",
      path: "/hr/reviews",
      icon: <RateReview />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    },
    {
      title: "Cài đặt doanh nghiệp",
      desc: "Cấu hình thông tin nhà tuyển dụng",
      path: "/hr/settings",
      icon: <Settings />,
      bg: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
        mt: 4,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2.5, color: "#0f172a" }}
      >
        Quản lý chức năng tuyển dụng
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
          width: "100%",
        }}
      >
        {features.map((item, idx) => (
          <HRFeatureCard
            key={idx}
            title={item.title}
            description={item.desc}
            icon={item.icon}
            gradient={item.bg}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Box>
    </Paper>
  );
}
