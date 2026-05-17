import { Box, Typography, CircularProgress } from "@mui/material";
import { People, AssignmentTurnedIn, TrendingUp } from "@mui/icons-material";
import StatCard from "../admin/StatCard";

export default function HrDashboardStats({ jobsCount, applicationsCount, interviewCount, acceptRate, loading }) {
  return (
    <Box sx={{ mt: 6, mb: 2, opacity: loading ? 0.6 : 1 }}>
      <Typography variant="h5" fontWeight={700} mb={3} color="text.primary">
        Thống kê tổng quan
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 8,
            bgcolor: "#ffffff",
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }, 
          gap: 3 
        }}>
          <StatCard
            title="Tin đang tuyển"
            value={jobsCount.toString()}
            icon={<AssignmentTurnedIn />}
            color="#2d6a4f"
          />
          <StatCard
            title="Ứng viên đang ứng tuyển"
            value={applicationsCount.toString()}
            icon={<People />}
            color="#0077b6"
          />
          <StatCard
            title="Lịch phỏng vấn"
            value={interviewCount.toString()}
            icon={<TrendingUp />}
            color="#f59e0b"
          />
          <StatCard
            title="Tỷ lệ đạt"
            value={acceptRate}
            icon={<TrendingUp />}
            color="#7209b7"
          />
        </Box>
      )}
    </Box>
  );
}