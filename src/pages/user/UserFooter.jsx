// UserFooter.jsx
import React from "react";
import { 
  Box, Grid, Typography, Link, Divider, Stack, IconButton 
} from "@mui/material";
import { 
  LocationOn, Phone, Email, Business, Facebook, Twitter, LinkedIn 
} from "@mui/icons-material";

const UserFooter = () => {
  return (
    <Box sx={{ bgcolor: "#0f172a", color: "white", py: 8, mt: 10 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: { xs: 4, md: 10 } }}>
        <Grid container spacing={6}>
          {/* Cột 1: Thông tin công ty */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="900" mb={2} sx={{ color: "#6366f1" }}>
              JobFinder AI
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
              Nền tảng tìm việc thông minh với AI, giúp bạn kết nối với cơ hội phù hợp nhất.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: "#6366f1" }}><Facebook /></IconButton>
              <IconButton sx={{ color: "#6366f1" }}><Twitter /></IconButton>
              <IconButton sx={{ color: "#6366f1" }}><LinkedIn /></IconButton>
            </Stack>
          </Grid>

          {/* Cột 2: Liên hệ */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="700" mb={3}>Liên Hệ</Typography>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center">
                <LocationOn sx={{ mr: 1, color: "#6366f1" }} />
                <Typography variant="body2">123 Đường ABC, Quận 1, TP.HCM, Việt Nam</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Phone sx={{ mr: 1, color: "#6366f1" }} />
                <Typography variant="body2">+84 123 456 789</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Email sx={{ mr: 1, color: "#6366f1" }} />
                <Typography variant="body2">support@jobfinder.ai</Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Cột 3: Giấy phép và Liên kết */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="700" mb={3}>Giấy Phép & Liên Kết</Typography>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center">
                <Business sx={{ mr: 1, color: "#6366f1" }} />
                <Typography variant="body2">Giấy phép kinh doanh: 0123456789</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Đăng ký bởi Sở Kế hoạch và Đầu tư TP.HCM.
              </Typography>
              <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Link href="#" color="inherit" underline="hover" variant="body2">Về Chúng Tôi</Link>
                <Link href="#" color="inherit" underline="hover" variant="body2">Chính Sách Bảo Mật</Link>
                <Link href="#" color="inherit" underline="hover" variant="body2">Điều Khoản Sử Dụng</Link>
                <Link href="#" color="inherit" underline="hover" variant="body2">Hỗ Trợ</Link>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 4 }} />
        <Typography variant="body2" textAlign="center" sx={{ opacity: 0.6 }}>
          © 2023 JobFinder AI. Tất cả quyền được bảo lưu.
        </Typography>
      </Box>
    </Box>
  );
};

export default UserFooter;