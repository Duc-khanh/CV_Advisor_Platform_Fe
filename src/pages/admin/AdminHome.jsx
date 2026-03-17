import React from "react";
import { Grid, Box, Paper, Typography, Stack, Button } from "@mui/material";
import {
  PeopleAlt,
  WorkHistory,
  Assessment,
  CalendarMonth,
  Settings,
  PersonAdd,
  AdminPanelSettings,
  Dataset,
} from "@mui/icons-material";
import AdminLayout from "../../components/AdminLayout";
import StatCard from "./StatCard";

/* ================= FEATURE CARD (GIỮ NGUYÊN) ================= */
const AdminFeatureCard = ({ title, description, icon, gradient, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        width: "100%",
        minHeight: 160,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
        borderRadius: 3,
        background: gradient,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.25s ease",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ color: "#ffffff", display: "flex" }}>
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>

        <Typography
          fontWeight={700}
          fontSize={14}
          sx={{ color: "#ffffff", lineHeight: 1.2 }}
        >
          {title}
        </Typography>

        <Typography
          fontSize={11.5}
          sx={{
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.4,
            height: "2.8em",
            overflow: "hidden",
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default function AdminHome() {
  /* ===== DATA GIỮ NGUYÊN ===== */
  const features = [
    {
      title: "Quản lý Người dùng",
      desc: "Thêm, sửa, khóa tài khoản người dùng",
      icon: <PeopleAlt />,
      bg: "linear-gradient(135deg, #6366f1, #4338ca)",
    },
    {
      title: "Quản lý HR",
      desc: "Nhân sự, hồ sơ và phân quyền hệ thống",
      icon: <WorkHistory />,
      bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
    },
    {
      title: "Quản lý đặt lịch",
      desc: "Theo dõi lịch đặt và trạng thái xử lý",
      icon: <CalendarMonth />,
      bg: "linear-gradient(135deg, #10b981, #047857)",
    },
    {
      title: "Báo cáo thống kê",
      desc: "Phân tích dữ liệu và doanh thu",
      icon: <Assessment />,
      bg: "linear-gradient(135deg, #f97316, #c2410c)",
    },
    {
      title: "Cài đặt hệ thống",
      desc: "Cấu hình hệ thống và bảo mật",
      icon: <Settings />,
      bg: "linear-gradient(135deg, #0ea5e9, #0369a1)",
    },
  ];

  const actions = [
    { label: "Thêm người dùng", icon: <PersonAdd />, color: "#2d6a4f" },
    { label: "Thêm nhân sự HR", icon: <PeopleAlt />, color: "#0077b6" },
    { label: "Phân quyền hệ thống", icon: <AdminPanelSettings />, color: "#f59e0b" },
    { label: "Quản lý dữ liệu", icon: <Dataset />, color: "#7209b7" },
  ];

  return (
    <AdminLayout>
      {/* ================= STAT ================= */}
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng Người dùng" value="1,250" icon={<PeopleAlt />} color="#3b82f6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tuyển dụng mới" value="45" icon={<WorkHistory />} color="#10b981" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Báo cáo lỗi" value="12" icon={<Assessment />} color="#f43f5e" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Doanh thu" value="$12,400" icon={<Assessment />} color="#f59e0b" />
        </Grid>
      </Grid>

      {/* ================= FEATURE SECTION (GIỮ NGUYÊN UI) ================= */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 2.5 }}>
          Quản lý chức năng hệ thống
        </Typography>

        <Grid container spacing={2}>
          {features.map((item, index) => (
            <Grid item xs={6} sm={4} md={3} key={index}>
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

      {/* ================= QUICK ACTION (GIỮ NGUYÊN UI) ================= */}
      <Box sx={{ width: "100%", mt: 5 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: "#334155" }}>
          Thao tác quản trị nhanh
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            bgcolor: "#ffffff",
            boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
          }}
        >
          <Grid container spacing={3}>
            {actions.map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={action.icon}
                  sx={{
                    py: 1.8,
                    px: "calc(16px + 0.5cm)",
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: action.color,
                    borderColor: action.color,
                    borderWidth: "2px",
                    "&:hover": {
                      bgcolor: `${action.color}08`,
                      transform: "translateY(-3px)",
                    },
                  }}
                >
                  {action.label}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </AdminLayout>
  );
}
