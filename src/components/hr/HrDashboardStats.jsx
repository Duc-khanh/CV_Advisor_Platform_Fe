import { Box, Typography, CircularProgress } from "@mui/material";
import { People, AssignmentTurnedIn, TrendingUp, EventNote } from "@mui/icons-material";
import StatCard from "../ui/StatCard";

export default function HrDashboardStats({ jobsCount, applicationsCount, interviewCount, acceptRate, loading }) {
  return (
    <Box sx={{ mt: 1, mb: 2, opacity: loading ? 0.6 : 1 }}>
      <Typography variant="h5" fontWeight={800} mb={2.5} color="#1e293b">
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
            borderRadius: 3,
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 15px rgba(15, 23, 42, 0.04)",
          }}
        >
          <CircularProgress sx={{ color: "#0ea5e9" }} />
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
            color="#0284c7"
          />
          <StatCard
            title="Ứng viên nộp hồ sơ"
            value={applicationsCount.toString()}
            icon={<People />}
            color="#2563eb"
          />
          <StatCard
            title="Lịch phỏng vấn"
            value={interviewCount.toString()}
            icon={<EventNote />}
            color="#f59e0b"
          />
          <StatCard
            title="Tỷ lệ đạt tuyển dụng"
            value={acceptRate}
            icon={<TrendingUp />}
            color="#3b82f6"
          />
        </Box>
      )}
    </Box>
  );
}
