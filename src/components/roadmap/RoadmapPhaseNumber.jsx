import React from "react";
import { Box } from "@mui/material";

const RoadmapPhaseNumber = ({ index }) => (
  <Box
    sx={{
      minWidth: "32px",
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      bgcolor: "#2563eb",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "700",
      fontSize: "0.875rem",
      flexShrink: 0,
    }}
  >
    {index + 1}
  </Box>
);

export default RoadmapPhaseNumber;
