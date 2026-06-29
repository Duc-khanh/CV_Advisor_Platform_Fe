/**
 * SalaryDisplay - Hiển thị mức lương
 */

import React from "react";
import { Typography, Box } from "@mui/material";
import { AttachMoney } from "@mui/icons-material";

export const SalaryDisplay = ({ salaryRange, variant = "body2" }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <AttachMoney sx={{ fontSize: 18, color: "#16a34a" }} />
      <Typography variant={variant} fontWeight="600" color="#0f172a">
        {salaryRange}
      </Typography>
    </Box>
  );
};
