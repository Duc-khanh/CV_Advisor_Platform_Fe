import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";

const steps = [
  { step: 1, title: "Tạo CV Profile", desc: "Điền thông tin và tạo hồ sơ chuyên nghiệp của bạn." },
  { step: 2, title: "AI Phân Tích", desc: "Hệ thống AI tự động đánh giá và tìm công việc phù hợp nhất." },
  { step: 3, title: "Ứng Tuyển & Nhận Việc", desc: "Nộp CV bằng 1 click và chờ phản hồi từ nhà tuyển dụng." },
];

export default function HowItWorksSection() {
  return (
    <Box sx={{ py: 12, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        {/* Header Section */}
        <Stack alignItems="center" sx={{ mb: 10 }}>
          <Typography
            variant="h3"
            fontWeight="900"
            textAlign="center"
            sx={{
              mb: 2,
              color: "#0f172a",
              fontSize: { xs: "28px", sm: "32px", md: "40px" },
              letterSpacing: "-0.5px",
            }}
          >
            Quy Trình Hoạt Động
          </Typography>
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              color: "#64748b",
              fontSize: { xs: "14px", md: "16px" },
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            3 bước đơn giản để tìm được công việc mơ ước của bạn
          </Typography>
        </Stack>

        {/* Steps Container */}
        <Box sx={{ display: "flex", justifyContent: "center", position: "relative" }}>
          {/* Connector Lines (Desktop only) */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              position: "absolute",
              top: "44px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "calc(100% - 120px)",
              maxWidth: "800px",
              height: "2px",
              bgcolor: "linear-gradient(90deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* Steps Grid */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 6, md: 4 }}
            sx={{
              width: "100%",
              maxWidth: { md: "900px" },
              justifyContent: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            {steps.map((item, index) => (
              <Stack
                key={index}
                alignItems="center"
                textAlign="center"
                sx={{
                  flex: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: { xs: "none", md: "translateY(-8px)" },
                  },
                }}
              >
                {/* Circle with Number */}
                <Box
                  sx={{
                    width: { xs: 88, md: 100 },
                    height: { xs: 88, md: 100 },
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 12px 24px rgba(99, 102, 241, 0.25), 0 4px 8px rgba(14, 165, 233, 0.15)",
                    border: "4px solid #ffffff",
                    position: "relative",
                    zIndex: 2,
                    fontSize: { xs: "40px", md: "48px" },
                    fontWeight: "900",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  fontWeight="700"
                  sx={{
                    mb: 1.5,
                    color: "#1e293b",
                    fontSize: { xs: "16px", md: "18px" },
                    letterSpacing: "-0.3px",
                  }}
                >
                  {item.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "#64748b",
                    fontSize: { xs: "13px", md: "14px" },
                    maxWidth: 280,
                    lineHeight: 1.6,
                  }}
                >
                  {item.desc}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
