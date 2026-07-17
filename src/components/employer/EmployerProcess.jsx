import React from "react";
import { Box, Typography, Container, Stack, Avatar } from "@mui/material";
import { 
  AppRegistration, 
  PostAdd, 
  HowToReg, 
  ConnectWithoutContact 
} from "@mui/icons-material";

const steps = [
  {
    icon: <AppRegistration />,
    title: "Tạo tài khoản doanh nghiệp",
    desc: "Đăng ký nhanh chóng và xác thực thông tin công ty chỉ trong vài phút."
  },
  {
    icon: <PostAdd />,
    title: "Đăng tin tuyển dụng",
    desc: "Thiết lập yêu cầu, mô tả công việc và mức lương hấp dẫn."
  },
  {
    icon: <HowToReg />,
    title: "Nhận đề xuất ứng viên",
    desc: "AI tự động sàng lọc và đề xuất các ứng viên phù hợp nhất."
  },
  {
    icon: <ConnectWithoutContact />,
    title: "Kết nối & Phỏng vấn",
    desc: "Liên hệ trực tiếp, sắp xếp phỏng vấn và quản lý từ A-Z trên hệ thống."
  }
];

const EmployerProcess = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
          >
            QUY TRÌNH HOẠT ĐỘNG
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={900} 
            sx={{ color: "#1e293b", mt: 1 }}
          >
            Tuyển dụng chưa bao giờ đơn giản đến thế
          </Typography>
        </Box>

        <Stack 
          direction={{ xs: "column", md: "row" }} 
          spacing={4} 
          justifyContent="space-between"
          sx={{ position: "relative" }}
        >
          {/* Dotted line connecting steps */}
          <Box sx={{ 
            position: "absolute", 
            top: "40px", 
            left: "10%", 
            right: "10%", 
            height: "2px", 
            borderBottom: "2px dashed #e2e8f0",
            display: { xs: "none", md: "block" },
            zIndex: 0
          }} />

          {steps.map((step, index) => (
            <Box key={index} sx={{ textAlign: "center", flex: 1, position: "relative", zIndex: 1 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#ffffff",
                  color: "#2563eb",
                  mx: "auto",
                  mb: 3,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                  border: "4px solid #f8fafc"
                }}
              >
                {step.icon}
              </Avatar>
              <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mb: 1.5, fontSize: "1.1rem" }}>
                {step.title}
              </Typography>
              <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6, px: 2 }}>
                {step.desc}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default EmployerProcess;
