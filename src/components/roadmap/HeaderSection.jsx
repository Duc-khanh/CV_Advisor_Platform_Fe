import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import {
  AutoAwesome,
  Description,
  TrackChanges,
  School,
} from "@mui/icons-material";

const HeaderSection = () => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      textAlign: "center",
      mb: 4,
      py: { xs: 3, md: 4 },
      px: 3,
      borderRadius: "0 0 28px 28px",
      background:
        "linear-gradient(135deg, #f8faff 0%, #ffffff 45%, #eff6ff 100%)",
    }}
  >
    <Box
      sx={{
        position: "absolute",
        left: { xs: 18, md: 90 },
        top: { xs: 20, md: 30 },
        width: { xs: 60, md: 82 },
        height: { xs: 60, md: 82 },
        borderRadius: "20px",
        background: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        justifyContent: "center",
        transform: "rotate(-8deg)",
      }}
    >
      <Description
        sx={{
          fontSize: { sm: 34, md: 46 },
          color: "#3b82f6",
        }}
      />
    </Box>

    <Box
      sx={{
        position: "absolute",
        right: { xs: 18, md: 100 },
        top: { xs: 22, md: 32 },
        width: { xs: 62, md: 84 },
        height: { xs: 62, md: 84 },
        borderRadius: "50%",
        background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TrackChanges
        sx={{
          fontSize: { sm: 36, md: 50 },
          color: "#2563eb",
        }}
      />
    </Box>

    <Box
      sx={{
        position: "relative",
        zIndex: 1,
        maxWidth: 680,
        mx: "auto",
      }}
    >
      <Chip
        icon={<AutoAwesome sx={{ color: "#2563eb !important" }} />}
        label="Lộ trình học tập AI"
        sx={{
          mb: 1.5,
          px: 0.8,
          height: 30,
          borderRadius: "999px",
          bgcolor: "#eff6ff",
          color: "#2563eb",
          fontWeight: 800,
          fontSize: "0.8rem",
          border: "1px solid #dbeafe",
        }}
      />

      <Typography
        variant="h2"
        fontWeight={900}
        sx={{
          lineHeight: 1.1,
          letterSpacing: "-1px",
          fontSize: {
            xs: "1.6rem",
            sm: "2.2rem",
            md: "2.8rem",
          },
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1.5,
        }}
      >
        Cố vấn Sự nghiệp AI
      </Typography>

      <Typography
        variant="body1"
        color="#64748b"
        sx={{
          fontSize: { xs: "0.92rem", md: "1rem" },
          fontWeight: 600,
          lineHeight: 1.6,
          maxWidth: 580,
          mx: "auto",
          mb: 2,
        }}
      >
        Nhận đề xuất lộ trình học tập cá nhân hóa dựa trên CV của bạn và xu
        hướng thị trường.
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >
        <Chip
          size="small"
          icon={<Description />}
          label="Phân tích CV"
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            fontWeight: 700,
          }}
        />

        <Chip
          size="small"
          icon={<School />}
          label="Lộ trình học tập"
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            fontWeight: 700,
          }}
        />

        <Chip
          size="small"
          icon={<TrackChanges />}
          label="Theo xu hướng thị trường"
          sx={{
            bgcolor: "#ffffff",
            border: "1px solid #e2e8f0",
            fontWeight: 700,
          }}
        />
      </Stack>
    </Box>
  </Box>
);

export default HeaderSection;