import React from "react";
import { Grid, Box } from "@mui/material";
import { PeopleAlt, WorkHistory, Assessment } from "@mui/icons-material";
import AdminLayout from "../../components/AdminLayout"; // Kiểm tra lại đường dẫn
import StatCard from "./StatCard";
import AdminFeatureSection from "./AdminFeatureSection";
import AdminQuickActions from "./AdminQuickActions";

export default function AdminHome() {
  return (
    <AdminLayout>
      {/* Nội dung Dashboard */}
      {/* <Box sx={{ p: { xs: 1, md: 2 } }}> */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tổng Người dùng"
              value="1,250"
              icon={<PeopleAlt />}
              color="#3b82f6"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tuyển dụng mới"
              value="45"
              icon={<WorkHistory />}
              color="#10b981"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Báo cáo lỗi"
              value="12"
              icon={<Assessment />}
              color="#f43f5e"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Doanh thu"
              value="$12,400"
              icon={<Assessment />}
              color="#f59e0b"
            />
          </Grid>
        </Grid>

        <AdminFeatureSection />
        <AdminQuickActions />
      {/* </Box> */}
    </AdminLayout>
  );
}