import React from "react";
import { Box, Container, Grid, Typography, Stack } from "@mui/material";
import {
  RocketLaunch,
  CrisisAlert,
  VerifiedUser,
  TrendingUp,
} from "@mui/icons-material";

export default function HowItWorksSection() {
  const points = [
    {
      title: "Việc làm đa dạng",
      desc: "Hàng nghìn cơ hội từ nhiều ngành nghề khác nhau",
      icon: <RocketLaunch fontSize="medium" />,
      color: "#ec4899",
      bgcolor: "#fdf2f8",
    },
    {
      title: "Phù hợp với bạn",
      desc: "Tìm việc phù hợp với kỹ năng và mong muốn",
      icon: <CrisisAlert fontSize="medium" />,
      color: "#10b981",
      bgcolor: "#eafaf1",
    },
    {
      title: "Ứng tuyển dễ dàng",
      desc: "Quy trình đơn giản, nhanh chóng, tiết kiệm thời gian",
      icon: <VerifiedUser fontSize="medium" />,
      color: "#f97316",
      bgcolor: "#fff7ed",
    },
    {
      title: "Phát triển sự nghiệp",
      desc: "Nhiều cơ hội học hỏi và thăng tiến lâu dài",
      icon: <TrendingUp fontSize="medium" />,
      color: "#8b5cf6",
      bgcolor: "#f5f3ff",
    },
  ];

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        {/* Left aligned title */}
        <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ mb: 4 }}>
          Tại sao nên chọn Recruit?
        </Typography>

        <Grid container spacing={4}>
          {points.map((point, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                {/* Rounded square icon container */}
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: "16px",
                    bgcolor: point.bgcolor,
                    color: point.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.6rem",
                  }}
                >
                  {point.icon}
                </Box>

                {/* Text Content */}
                <Box>
                  <Typography
                    variant="body1"
                    fontWeight={900}
                    color="#1e293b"
                    sx={{ fontSize: "0.92rem", mb: 0.5 }}
                  >
                    {point.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="#64748b"
                    sx={{ fontSize: "0.78rem", lineHeight: 1.4, display: "block" }}
                  >
                    {point.desc}
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
