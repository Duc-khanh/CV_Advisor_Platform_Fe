/**
 * ApplicationStatusBadge - Hiển thị trạng thái ứng tuyển
 */

import React from "react";
import { Chip } from "@mui/material";
import { JOB_STATUS_CONFIG } from "../../constants";

export const ApplicationStatusBadge = ({ status, size = "small" }) => {
  const config = JOB_STATUS_CONFIG[status] || JOB_STATUS_CONFIG.PENDING;

  return (
    <Chip
      label={config.label}
      size={size}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: "600",
        border: `1px solid ${config.color}`,
      }}
    />
  );
};
