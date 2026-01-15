import { Box, Toolbar, Grid, Button, Typography, Stack } from "@mui/material";
import { AddCircleOutline, People, AssignmentTurnedIn, TrendingUp } from "@mui/icons-material";

import HRSidebar from "./HRSidebar";
import AdminHeader from "../admin/AdminHeader"; 
import StatCard from "../admin/StatCard";      
import HRFeatureSection from "./HRFeatureSection"; 
import AdminFooter from "../admin/AdminFooter";
import HRQuickActions from "./HRQuickActions";

export default function HrHome() {
  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafb", minHeight: "100vh", width: "100vw" }}>
      <AdminHeader />
      <HRSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          // Đảm bảo phần nội dung chiếm trọn phần còn lại của màn hình
          width: { sm: `calc(100% - 280px)` }, 
          overflowX: "hidden"
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 5 }, flexGrow: 1, width: "100%" }}>
          {/* Header Dashboard HR */}
         
          {/* Stat cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Tin đang tuyển" value="12" icon={<AssignmentTurnedIn />} color="#2d6a4f" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Ứng viên mới" value="156" icon={<People />} color="#0077b6" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Lịch phỏng vấn" value="8" icon={<TrendingUp />} color="#f59e0b" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Tỷ lệ đạt" value="24%" icon={<TrendingUp />} color="#7209b7" />
            </Grid>
          </Grid>
        
          <HRFeatureSection />
          <HRQuickActions />
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}