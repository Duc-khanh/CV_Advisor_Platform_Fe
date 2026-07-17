import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import SkillGroup from "./SkillGroup";

const SkillAnalysisCard = ({ evaluation }) => {
  const skillGroups = [
    {
      title: "Điểm mạnh",
      skills: evaluation.strengths,
      color: "#16a34a",
      bgColor: "#f0fdf4",
    },
    {
      title: "Điểm cần cải thiện",
      skills: evaluation.weaknesses,
      color: "#f97316",
      bgColor: "#fff7ed",
    },
    {
      title: "Kỹ năng thiếu",
      skills: evaluation.missingSkills,
      color: "#dc2626",
      bgColor: "#fef2f2",
    },
  ].filter((group) => group.skills?.length > 0);

  return (
    <Paper
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: "24px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        fontWeight="700"
        mb={4}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#0f172a",
        }}
      >
        <AutoAwesome sx={{ color: "#2563eb" }} />
        Phân tích kỹ năng
      </Typography>

      {/* 3 Cột cố định */}
      <Grid container spacing={3} alignItems="stretch" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {skillGroups.map((group, index) => (
          <Grid item xs={12} key={index} sx={{ gridColumn: 'auto' }}>
            <SkillGroup
              title={group.title}
              skills={group.skills}
              color={group.color}
              bgColor={group.bgColor}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SkillAnalysisCard;
