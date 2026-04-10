import React from "react";
import { Paper, Typography, Grid, Stack, Box } from "@mui/material";
import {
  PeopleAlt,
  WorkHistory,
  CalendarMonth,
  Assessment,
  Settings
} from "@mui/icons-material";

const AdminFeatureCard = ({ title, description, icon, gradient, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        width: "100%",
        minHeight: 160,          // Giảm chiều cao từ 200 xuống 160
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,                   // Giảm padding từ 3 xuống 2
        borderRadius: 3,        // Bo góc nhẹ hơn cho hợp với kích thước bé
        background: gradient,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.25s ease",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        }
      }}
    >
      <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
        {/* Icon thu nhỏ lại */}
        <Box sx={{ color: "#ffffff", display: "flex" }}>
          {React.cloneElement(icon, { sx: { fontSize: 32 } })} 
        </Box>

        {/* Tiêu đề thu nhỏ font */}
        <Typography
          fontWeight={700}
          fontSize={14}          // Giảm từ 16 xuống 14
          sx={{
            color: "#ffffff",
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>

        {/* Mô tả thu nhỏ font và chiều cao */}
        <Typography
          fontSize={11.5}         // Giảm từ 12.5 xuống 11.5
          sx={{
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.4,
            height: "2.8em", 
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default function AdminFeatureSection() {
  const features = [
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
      icon: <WorkHistory />,
  
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)"
    },
    {
      title: "Quản lý đặt lịch",
      desc: "Theo dõi lịch đặt và trạng thái xử lý",
      icon: <CalendarMonth />,
      bg: "linear-gradient(135deg, #10b981, #047857)"
    },
    {
      title: "Báo cáo thống kê",
      desc: "Phân tích dữ liệu và doanh thu",
      icon: <Assessment />,
      bg: "linear-gradient(135deg, #f97316, #c2410c)"
    },
    {
      title: "Cài đặt hệ thống",
      desc: "Cấu hình hệ thống và bảo mật",
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
        variant="subtitle1" // Đổi từ h6 xuống subtitle1 để chữ nhỏ hơn
        fontWeight={700}
        sx={{ mb: 2.5, color: "#0f172a" }}
      >
        Quản lý chức năng hệ thống
      </Typography>

      <Grid container spacing={2}>
        {features.map((item, index) => (
         <Grid
  item
  xs={6}
  sm={4}
  md={3}
  sx={{ display: "flex" }}
>

            <AdminFeatureCard
              title={item.title}
              description={item.desc}
              icon={item.icon}
              gradient={item.bg}
              onClick={() => console.log(item.title)}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}