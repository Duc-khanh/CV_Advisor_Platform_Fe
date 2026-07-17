import React from "react";
import { Box, Typography, Container, Paper, Link } from "@mui/material";
import {
  FlashOn,
  Group,
  Psychology,
  Assessment,
  ArrowForward,
} from "@mui/icons-material";

const features = [
  {
    icon: <FlashOn sx={{ fontSize: 28 }} />,
    title: "Đăng tin nhanh chóng",
    desc: "Giao diện nhập liệu thông minh, hỗ trợ mẫu tin tuyển dụng chuyên nghiệp, tối ưu SEO.",
    color: "#2563eb",
  },
  {
    icon: <Group sx={{ fontSize: 28 }} />,
    title: "Quản lý ứng viên (ATS)",
    desc: "Theo dõi và quản lý toàn bộ quy trình tuyển dụng trên một nền tảng duy nhất.",
    color: "#0ea5e9",
  },
  {
    icon: <Psychology sx={{ fontSize: 28 }} />,
    title: "Sàng lọc thông minh với AI",
    desc: "AI tự động phân tích, đánh giá mức độ phù hợp của CV với mô tả công việc.",
    color: "#8b5cf6",
  },
  {
    icon: <Assessment sx={{ fontSize: 28 }} />,
    title: "Báo cáo & Phân tích",
    desc: "Hệ thống báo cáo trực quan, giúp bạn đo lường hiệu quả tuyển dụng chính xác.",
    color: "#f59e0b",
  },
];

const EmployerFeatures = () => {
  return (
    <Box sx={{ py: { xs: 7, md: 9 }, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 6 } }}>
          <Typography
            variant="overline"
            sx={{
              color: "#2563eb",
              fontWeight: 800,
              letterSpacing: 2,
              fontSize: "0.75rem",
            }}
          >
            TÍNH NĂNG NỔI BẬT
          </Typography>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              color: "#1e293b",
              mt: 1,
              fontSize: { xs: "1.7rem", md: "2rem" },
            }}
          >
            Đầy đủ công cụ giúp bạn tuyển dụng dễ dàng hơn
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {features.map((item, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                minHeight: 260,
                borderRadius: "18px",
                border: "1px solid #e5e7eb",
                bgcolor: "#ffffff",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                "&:hover": {
                  borderColor: "#bfdbfe",
                  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.06)",
                  transform: "translateY(-5px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: item.color,
                  mb: 2.5,
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight={800}
                color="#1e293b"
                sx={{
                  mb: 1.5,
                  minHeight: 48,
                  lineHeight: 1.35,
                  wordBreak: "break-word",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="#64748b"
                sx={{
                  height: 72,
                  lineHeight: "24px",
                  mb: 2.5,
                  overflow: "hidden",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {item.desc}
              </Typography>

              <Link
                href="#"
                underline="none"
                sx={{
                  mt: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  color: "#2563eb",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Tìm hiểu thêm <ArrowForward sx={{ fontSize: 16 }} />
              </Link>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default EmployerFeatures;