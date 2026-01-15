import { Paper, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color }) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        display: "flex", 
        alignItems: "center", 
        gap: 2.5, 
        bgcolor: "white",
        border: "1px solid #f1f5f9",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-5px)" }
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderRadius: 3, 
        bgcolor: `${color}10`, // Màu icon nhạt 10% làm nền
        color: color,
        display: "flex"
      }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="500">{title}</Typography>
        <Typography variant="h5" fontWeight="800" color="#1e293b">{value}</Typography>
      </Box>
    </Paper>
  );
}