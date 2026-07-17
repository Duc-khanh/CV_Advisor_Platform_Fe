import React from "react";
import { Typography } from "@mui/material";

const RoadmapPhaseDescription = ({ description }) => {
  if (!description) return null;

  return (
    <Typography
      variant="body2"
      color="#64748b"
      sx={{
        mt: 1,
        lineHeight: 1.7,

        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "break-word",

        width: "100%",
        minWidth: 0,
      }}
    >
      {description}
    </Typography>
  );
};

export default RoadmapPhaseDescription;