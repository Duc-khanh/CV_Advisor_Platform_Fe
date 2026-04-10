import { Paper, Typography, Stack, Box } from "@mui/material";

export default function AdminFeatureCard({ title, description, icon, gradient, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        width: "100%",
        height: 160,              // ✅ TIẾP TỤC THU NHỎ (Từ 180px xuống 160px)
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 2,                     // Padding nhỏ lại để cân đối với size ô
        borderRadius: 5,
        background: gradient,
        cursor: "pointer",
        textAlign: "center",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)", 
        "&:hover": {
          transform: "scale(1.05) translateY(-5px)", // Hiệu ứng phóng nhẹ thay vì chỉ bay lên
          boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        }
      }}
    >
      <Stack spacing={1} alignItems="center" sx={{ width: "100%" }}>
        <Box sx={{ color: "#ffffff", display: 'flex', mb: 0.5 }}>
          {icon}
        </Box>

        <Typography
          fontWeight={700}
          fontSize={14} // Chữ tiêu đề bé hơn cho sang
          sx={{ 
            color: "#ffffff",
            width: "100%",
            px: 1,
            lineHeight: 1.2
          }}
        >
          {title}
        </Typography>

        <Typography
          fontSize={11} // Chữ mô tả bé lại
          sx={{
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.4,
            px: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            opacity: 0.9
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Paper>
  );
}


