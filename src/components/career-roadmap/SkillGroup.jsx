import React from "react";
import { Box, Typography, Stack } from "@mui/material";
import SkillItem from "./SkillItem";

const SkillGroup = ({ title, skills, color, bgColor }) => (
  <Box
    sx={{
      p: 0,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      width: "100%",
      minWidth: 0,
    }}
  >
    <Typography
      variant="subtitle2"
      fontWeight="700"
      mb={2}
      color={color}
      sx={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 1,
        whiteSpace: "normal",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {title}
    </Typography>
    <Stack spacing={1.5}>
      {skills.map((skill, index) => (
        <SkillItem
          key={`${title}-${index}`}
          skill={skill}
          borderColor={color}
        />
      ))}
    </Stack>
  </Box>
);

export default SkillGroup;
