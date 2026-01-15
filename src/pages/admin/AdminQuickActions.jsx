import { Box, Typography, Paper, Grid, Button } from "@mui/material";
import {
  PersonAdd,
  PeopleAlt,
  AdminPanelSettings,
  Dataset
} from "@mui/icons-material";

export default function AdminQuickActions() {
  const actions = [
    { label: "Thêm người dùng", icon: <PersonAdd />, color: "#2d6a4f" },
    { label: "Thêm nhân sự HR", icon: <PeopleAlt />, color: "#0077b6" },
    { label: "Phân quyền hệ thống", icon: <AdminPanelSettings />, color: "#f59e0b" },
    { label: "Quản lý dữ liệu", icon: <Dataset />, color: "#7209b7" },
  ];

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: "#334155" }}>
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
                  py: 1.8, // giữ chiều cao giống HR
                  px: "calc(16px + 0.5cm)", // ⬅️ tăng chiều ngang
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  color: action.color,
                  borderColor: action.color,
                  borderWidth: "2px",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  "&:hover": {
                    borderWidth: "2px",
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
