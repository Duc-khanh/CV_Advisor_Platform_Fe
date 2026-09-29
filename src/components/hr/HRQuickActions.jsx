import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { AddBox, PersonAdd, Event, AutoAwesome } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function HRQuickActions() {
  const navigate = useNavigate();
  const actions = [
    { label: "Đăng tin mới", icon: <AddBox />, color: "#0ea5e9", path: "/hr/jobs" },
    { label: "Xem ứng viên", icon: <PersonAdd />, color: "#2563eb", path: "/hr/applications" },
    { label: "Tạo lịch hẹn", icon: <Event />, color: "#f59e0b", path: "/hr/interviews" },
    { label: "Hạn mức AI", icon: <AutoAwesome />, color: "#2563eb", path: "/hr/ai-usage" },
  ];

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="subtitle1" fontWeight="700" sx={{ mb: 2, color: "#0f172a" }}>
        Thao tác nhanh
      </Typography>
      
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
        }}
      >
        <Grid container spacing={2.5}>
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={() => action.path && navigate(action.path)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: action.color,
                  borderColor: action.color,
                  borderWidth: "1.5px",
                  "&:hover": {
                    borderWidth: "1.5px",
                    borderColor: action.color,
                    bgcolor: `${action.color}08`,
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 12px ${action.color}20`,
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                {action.label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
