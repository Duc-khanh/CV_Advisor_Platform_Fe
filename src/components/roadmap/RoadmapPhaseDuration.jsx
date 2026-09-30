import React from "react";
import { Typography } from "@mui/material";

const RoadmapPhaseDuration = ({ duration }) => {
  if (!duration) return null;

  return (
    <Typography
      variant="caption"
      sx={{
        display: "inline-block",
        mt: 1,
        px: 2,
        py: 0.75,
        borderRadius: "6px",
        bgcolor: "#eff6ff",
        color: "#2563eb",
        fontWeight: "600",
      }}
    >
      ⏱ {duration}
    </Typography>
  );
};

export default RoadmapPhaseDuration;
