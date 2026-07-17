import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import { AddBox, PersonAdd, Event, NoteAdd } from "@mui/icons-material";

export default function HRQuickActions() {
  const actions = [
    { label: "Đăng tin mới", icon: <AddBox />, color: "#2d6a4f" },
    { label: "Thêm ứng viên", icon: <PersonAdd />, color: "#0077b6" },
    { label: "Tạo lịch hẹn", icon: <Event />, color: "#f59e0b" },
    { label: "Tạo ghi chú", icon: <NoteAdd />, color: "#7209b7" },
  ];

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: "#334155" }}>
        Thao tác nhanh
      </Typography>
      
      <Paper
        elevation={0}
        sx={{
          p: 3, // Tăng padding bên trong ô bao ngoài để các nút có chỗ thở
          borderRadius: 4,
          border: "1px solid #f1f5f9",
          bgcolor: "#ffffff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
        }}
      >
        <Grid container spacing={3}> {/* Tăng khoảng cách giữa các nút lên 3 */}
          {actions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                sx={{
                  py: 1.8, // Tăng độ dày của nút (to hơn)
                  px: "calc(16px + 1cm)",
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700, // Làm chữ đậm hơn
                  fontSize: "0.95rem", // Tăng kích thước chữ (to rõ)
                  color: action.color,
                  borderColor: action.color,
                  borderWidth: '2px', // Làm viền nút dày hơn cho rõ
                  "&:hover": {
                    borderWidth: '2px',
                    borderColor: action.color,
                    bgcolor: `${action.color}08`,
                    transform: "translateY(-3px)",
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