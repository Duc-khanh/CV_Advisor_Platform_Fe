import React from "react";
import { Box, Typography } from "@mui/material";

const RoadmapPhaseTitle = ({ title, name, index }) => (
  <Box
    sx={{
      width: "100%",
      minWidth: 0,
    }}
  >
    <Typography
      variant="subtitle1"
      fontWeight="700"
      color="#0f172a"
      sx={{
        width: "100%",
        lineHeight: 1.5,

        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "break-word",

        display: "block",
      }}
    >
      {title || name || `Bước ${index + 1}`}
    </Typography>
  </Box>
);

export default RoadmapPhaseTitle;