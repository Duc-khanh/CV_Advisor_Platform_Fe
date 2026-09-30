import { Box, Typography } from "@mui/material";

export default function AdminFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",      // Tự động đẩy lên cách xa nội dung phía trên
        pt: 2,           // Giảm khoảng cách phía trên
        pb: 1,           // Giảm khoảng cách phía dưới cho bé lại
        borderTop: "1px solid #e2e8f0",
        textAlign: "center",
      }}
    >
      <Typography 
        variant="caption" // Dùng variant caption để chữ bé lại
        sx={{ 
          color: "text.disabled", 
          fontSize: "0.75rem", // Cố định kích thước chữ bé
          letterSpacing: "0.5px" 
        }}
      >
        © 2026 RECRUITMENT PLATFORM • THIẾT KẾ BỞI ADMIN TEAM • VERSION 1.0
      </Typography>
    </Box>
  );
}