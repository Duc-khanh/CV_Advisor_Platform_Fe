/**
 * JobTypeChip - Hiển thị loại công việc dưới dạng chip
 */

import React from "react";
import { Chip } from "@mui/material";
import { JOB_TYPE_CONFIG } from "../../constants";

export const JobTypeChip = ({ jobType, variant = "filled", size = "small" }) => {
  const config = JOB_TYPE_CONFIG[jobType] || {
    label: jobType,
    icon: "📋",
  };

  return (
    <Chip
      label={`${config.icon} ${config.label}`}
      variant={variant}
      size={size}
      sx={{
        bgcolor: variant === "filled" ? "#eff6ff" : "transparent",
        color: "#2563eb",
        fontWeight: "600",
        border: variant === "outlined" ? "1px solid #2563eb" : "none",
      }}
    />
  );
};
