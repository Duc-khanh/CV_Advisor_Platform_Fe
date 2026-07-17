import React from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";

const FileSuccessAlert = ({ cvFile }) => {
  if (!cvFile) return null;

  return (
    <Box
      sx={{
        mt: 3,
        width: "100%",
        minWidth: 0,
        minHeight: 76,
        borderRadius: "14px",
        border: "1px solid #86efac",
        bgcolor: "#dcfce7",
        display: "flex",
        alignItems: "center",
        px: 2,
        gap: 1.5,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <CheckCircle sx={{ color: "#059669", fontSize: 30, flexShrink: 0 }} />

      <Typography
        fontWeight={700}
        color="#047857"
        sx={{
          flex: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Đã tải lên: {cvFile.name}
      </Typography>

      <IconButton size="small" sx={{ flexShrink: 0 }}>
        <Close sx={{ color: "#64748b" }} />
      </IconButton>
    </Box>
  );
};

export default FileSuccessAlert;