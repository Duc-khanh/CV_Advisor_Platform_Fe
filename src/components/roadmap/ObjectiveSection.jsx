import React from "react";
import { Box, Typography, Stack } from "@mui/material";

const ObjectiveField = ({ label, value }) => (
  <Box>
    <Typography variant="caption" fontWeight="600" color="#64748b">
      {label}
    </Typography>
    <Typography variant="body2" color="#0f172a" fontWeight="500" mt={0.5}>
      {value}
    </Typography>
  </Box>
);

const ObjectiveSection = ({ targetRole, desiredRoadmap }) => (
  <Box>
    <Typography
      variant="subtitle2"
      fontWeight="700"
      mb={2}
      color="#64748b"
      sx={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}
    >
      Mục tiêu của bạn
    </Typography>
    <Stack direction="row" spacing={20} alignItems="flex-start">
      <ObjectiveField
        label="Vị trí mục tiêu"
        value={targetRole || "Chưa nhập vị trí mục tiêu"}
      />
      <ObjectiveField
        label="Lộ trình mong muốn"
        value={
          desiredRoadmap || "AI sẽ đề xuất lộ trình theo mục tiêu của bạn"
        }
      />
    </Stack>
  </Box>
);

export default ObjectiveSection;
