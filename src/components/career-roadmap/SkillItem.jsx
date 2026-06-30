import React from "react";
import { Box, Typography } from "@mui/material";

const SkillItem = ({ skill, borderColor }) => (
  <Box
    sx={{
      width: "100%",
      display: "flex",
      alignItems: "flex-start",
      gap: 1.5,
      minWidth: 0,
    }}
  >
    <Box
      sx={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: borderColor,
        flexShrink: 0,
        marginTop: "8px",
      }}
    />
    <Typography
      sx={{
        fontSize: "0.95rem",
        lineHeight: 1.6,
        color: "#334155",
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "break-word",
        minWidth: 0,
        flex: 1,
      }}
    >
      {skill}
    </Typography>
  </Box>
);

export default SkillItem;
