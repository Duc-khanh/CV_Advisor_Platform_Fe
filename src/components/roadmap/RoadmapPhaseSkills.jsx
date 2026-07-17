import React from "react";
import { Box, Typography, Grid, Stack } from "@mui/material";
import { 
  ChevronRight, 
  CodeOutlined,
  PsychologyOutlined,
  SettingsOutlined,
  StorageOutlined,
  CloudQueueOutlined
} from "@mui/icons-material";

const RoadmapPhaseSkills = ({ skills }) => {
  if (!skills || skills.length === 0) return null;

  // Hàm chọn icon dựa trên tên kỹ năng hoặc vị trí
  const getSkillIcon = (skill, index) => {
    const s = skill.toLowerCase();
    if (s.includes("react") || s.includes("frontend") || s.includes("js")) return <CodeOutlined sx={{ fontSize: 18 }} />;
    if (s.includes("db") || s.includes("sql") || s.includes("redis") || s.includes("data")) return <StorageOutlined sx={{ fontSize: 18 }} />;
    if (s.includes("devops") || s.includes("docker") || s.includes("cloud")) return <CloudQueueOutlined sx={{ fontSize: 18 }} />;
    if (s.includes("logic") || s.includes("kiến trúc")) return <PsychologyOutlined sx={{ fontSize: 18 }} />;
    return <SettingsOutlined sx={{ fontSize: 18 }} />;
  };

  return (
    <Box sx={{ mt: 2.5 }}>
      <Grid container spacing={2}>
        {skills.map((skill, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                border: "1px solid #f1f5f9",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "default",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#f1f5f9",
                  borderColor: "#e2e8f0",
                }
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                  flexShrink: 0
                }}
              >
                {getSkillIcon(skill, index)}
              </Box>

              <Typography
                variant="body2"
                fontWeight={700}
                color="#334155"
                sx={{
                  flex: 1,
                  fontSize: "0.8rem",
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {skill}
              </Typography>

              <ChevronRight sx={{ color: "#cbd5e1", fontSize: 18 }} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Cần import Paper từ MUI
import { Paper } from "@mui/material";

export default RoadmapPhaseSkills;
