import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import { AutoAwesome, Description, School, TrendingUp } from "@mui/icons-material";

const HeaderSection = () => (
  <Box
    sx={{
      position: "relative",
      textAlign: "center",
      mb: { xs: 2.5, md: 3 },
      pt: { xs: 1, md: 1.5 },
      pb: 0.5,
      px: 2,
    }}
  >
    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        maxWidth: 720,
        mx: "auto",
      }}
    >
      {/* Badge: AI Career Roadmap */}
      <Chip
        icon={<AutoAwesome sx={{ color: "#2563eb !important", fontSize: 16 }} />}
        label="AI Career Roadmap"
        sx={{
          mb: 2,
          px: 1,
          height: 32,
          borderRadius: "999px",
          bgcolor: "#eff6ff",
          color: "#2563eb",
          fontWeight: 800,
          fontSize: "0.85rem",
          border: "1px solid #dbeafe",
        }}
      />

      {/* Tiêu đề */}
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          lineHeight: 1.2,
          letterSpacing: "-0.8px",
          fontSize: {
            xs: "1.75rem",
            sm: "2.3rem",
            md: "2.75rem",
          },
          color: "#0f172a",
          mb: 2,
        }}
      >
        Xây dựng lộ trình học tập từ{" "}
        <Box
          component="span"
          sx={{
            background: "linear-gradient(135deg, #2563eb, #3b82f6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CV của bạn
        </Box>
      </Typography>

      {/* Mô tả */}
      <Typography
        variant="body1"
        sx={{
          color: "#64748b",
          fontSize: { xs: "0.95rem", md: "1.05rem" },
          fontWeight: 500,
          lineHeight: 1.65,
          maxWidth: 640,
          mx: "auto",
          mb: 3,
        }}
      >
        Tải lên CV để AI phân tích kỹ năng hiện có, so khớp với vị trí mong muốn
        và tạo lộ trình học tập chi tiết để bạn đạt mục tiêu.
      </Typography>

      {/* Flow badges */}
      <Stack
        direction="row"
        spacing={1.5}
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Chip
          size="small"
          icon={<Description sx={{ fontSize: 15 }} />}
          label="1. Đọc CV hiện có"
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#334155",
          }}
        />

        <Box sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700 }}>
          →
        </Box>

        <Chip
          size="small"
          icon={<TrendingUp sx={{ fontSize: 15 }} />}
          label="2. So khớp mục tiêu"
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#334155",
          }}
        />

        <Box sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700 }}>
          →
        </Box>

        <Chip
          size="small"
          icon={<School sx={{ fontSize: 15 }} />}
          label="3. Nhận lộ trình bù kỹ năng"
          sx={{
            bgcolor: "#eff6ff",
            border: "1px solid #bfdbfe",
            fontWeight: 700,
            fontSize: "0.8rem",
            color: "#2563eb",
          }}
        />
      </Stack>
    </Box>
  </Box>
);

export default HeaderSection;