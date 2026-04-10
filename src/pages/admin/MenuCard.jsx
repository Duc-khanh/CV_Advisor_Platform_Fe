import { Paper, Typography, Box, Icon } from "@mui/material";

export default function MenuCard({ title, subtitle, icon, gradient, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        cursor: "pointer",
        background: gradient,
        color: "white",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
        },
      }}
    >
      <Box sx={{ mb: 2, fontSize: "40px", display: "flex" }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="700" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.9 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}