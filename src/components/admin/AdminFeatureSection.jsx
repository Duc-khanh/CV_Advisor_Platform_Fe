import React from "react";
import { Paper, Typography, Stack, Box, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PeopleAlt,
  WorkHistory,
  CalendarMonth,
  Assessment,
  Settings,
  AutoAwesome
} from "@mui/icons-material";

const AdminFeatureCard = ({ title, description, icon, gradient, onClick }) => {
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

export default function AdminFeatureSection() {
  const navigate = useNavigate();
  const features = [
    {
      title: "Quản lý AI",
      desc: "Gói cước, hạn mức và lịch sử AI",
      path: "/admin/ai",
      icon: <AutoAwesome />,
      bg: "linear-gradient(135deg, #2563eb, #1d4ed8)"
    },
    {
      title: "Quản lý Người dùng",
      desc: "Thêm, sửa, khóa tài khoản người dùng",
      path: "/admin/users",
      icon: <PeopleAlt />,
      bg: "linear-gradient(135deg, #6366f1, #4338ca)"
    },
    {
      title: "Quản lý HR",
      desc: "Nhân sự, hồ sơ và phân quyền hệ thống",
      path: "/admin/hrs",
      icon: <WorkHistory />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)"
    },
    {
      title: "Quản lý đặt lịch",
      desc: "Theo dõi lịch đặt và trạng thái xử lý",
      path: "/admin/schedules",
      icon: <CalendarMonth />,
      bg: "linear-gradient(135deg, #10b981, #047857)"
    },
    {
      title: "Báo cáo thống kê",
      desc: "Phân tích dữ liệu và doanh thu",
      path: "/admin/stats",
      icon: <Assessment />,
      bg: "linear-gradient(135deg, #f97316, #c2410c)"
    },
    {
      title: "Cài đặt hệ thống",
      desc: "Cấu hình hệ thống và bảo mật",
      path: "/admin/settings",
      icon: <Settings />,
      bg: "linear-gradient(135deg, #0ea5e9, #0369a1)"
    }
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2.5, color: "#0f172a" }}
      >
        Quản lý chức năng hệ thống
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            sm: "repeat(3, minmax(0, 1fr))",
            md: "repeat(6, minmax(0, 1fr))",
          },
          gap: 2,
          width: "100%",
        }}
      >
        {features.map((item, index) => (
          <AdminFeatureCard
            key={index}
            title={item.title}
            description={item.desc}
            icon={item.icon}
            gradient={item.bg}
            onClick={() => item.path ? navigate(item.path) : console.log(item.title)}
          />
        ))}
      </Box>
    </Paper>
  );
}
