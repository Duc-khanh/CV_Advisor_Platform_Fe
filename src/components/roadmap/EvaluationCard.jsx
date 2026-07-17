import React from "react";
import { Paper, Typography, Divider } from "@mui/material";
import ScoreDisplay from "./ScoreDisplay";
import ObjectiveSection from "./ObjectiveSection";

const EvaluationCard = ({ evaluation, targetRole, desiredRoadmap }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      height: "100%",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      📊 Đánh giá CV
    </Typography>

    {evaluation && (
      <>
        <ScoreDisplay score={evaluation.score} summary={evaluation.summary} />
        <Divider sx={{ my: 3 }} />
        <ObjectiveSection targetRole={targetRole} desiredRoadmap={desiredRoadmap} />
      </>
    )}
  </Paper>
);

export default EvaluationCard;
