import { Grid, Typography, Box, Paper } from "@mui/material";
import { PostAdd, People, EventAvailable, RateReview } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AdminFeatureCard from "../admin/AdminFeatureCard";

export default function HRFeatureSection() {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: "#1e293b" }}>
        Quản lý tuyển dụng
      </Typography>

      <Paper
        elevation={0}
        sx={{
          width: "100%",
          p: { xs: 3, md: 6 },
          borderRadius: 8,
          border: "1px solid #f1f5f9",
          backgroundColor: "#ffffff",
        }}
      >
        <Grid container spacing={9}>
          <Grid item xs={12} sm={6} md={3}>
            <AdminFeatureCard
              title="Đăng tin"
              description="Tạo tin tuyển dụng mới"
              icon={<PostAdd sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              onClick={() => navigate("/hr/jobs")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AdminFeatureCard
              title="Duyệt hồ sơ"
              description="Xem danh sách ứng viên"
              icon={<People sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              onClick={() => navigate("/hr/applications")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AdminFeatureCard
              title="Lịch hẹn"
              description="Quản lý lịch phỏng vấn"
              icon={<EventAvailable sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              onClick={() => navigate("/hr/interviews")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AdminFeatureCard
              title="Đánh giá"
              description="Chấm điểm bài test"
              icon={<RateReview sx={{ fontSize: 28 }} />}
              gradient="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
              onClick={() => navigate("/hr/reviews")}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
