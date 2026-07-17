import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { AccessTimeOutlined } from "@mui/icons-material";
import RoadmapPhaseSkills from "./RoadmapPhaseSkills";

const RoadmapItemCard = ({ phase, index }) => (
  <Box
    sx={{
      display: "flex",
      gap: { xs: 2, sm: 3 },
      position: "relative",
    }}
  >
    {/* Số giai đoạn (Circle Number) */}
    <Box
      sx={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        bgcolor: "#2563eb",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: "1.1rem",
        flexShrink: 0,
        zIndex: 2,
        boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
        mt: 1
      }}
    >
      {index + 1}
    </Box>

    {/* Thẻ nội dung giai đoạn */}
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: { xs: 2.5, md: 3 },
        borderRadius: "20px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
          borderColor: "#cbd5e1",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            color="#1e293b"
            sx={{ fontSize: { xs: "1rem", md: "1.15rem" }, lineHeight: 1.3 }}
          >
            Giai đoạn {index + 1}: {phase.title || phase.name}
          </Typography>

          {phase.duration && (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "#64748b", flexShrink: 0, ml: 2 }}>
              <AccessTimeOutlined sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={700}>
                {phase.duration}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Typography 
          variant="body2" 
          color="#64748b" 
          sx={{ 
            lineHeight: 1.6,
            fontSize: { xs: "0.85rem", md: "0.92rem" },
            maxWidth: "90%"
          }}
        >
          {phase.description}
        </Typography>
      </Box>

      {/* Danh sách kỹ năng/nhiệm vụ (Skill Cards Grid) */}
      <RoadmapPhaseSkills skills={phase.skills} />
    </Paper>
  </Box>
);

export default RoadmapItemCard;