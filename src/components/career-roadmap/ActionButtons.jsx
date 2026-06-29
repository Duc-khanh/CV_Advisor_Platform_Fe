import React from "react";
import { Button, Stack, CircularProgress } from "@mui/material";
import { AutoAwesome, Refresh } from "@mui/icons-material";

const ActionButtons = ({ isAnalyzing, cvFile, onAnalyze, onReset }) => (
  <Stack spacing={2}>
    <Button
      fullWidth
      variant="contained"
      onClick={onAnalyze}
      disabled={isAnalyzing || !cvFile}
      startIcon={
        isAnalyzing ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <AutoAwesome sx={{ fontSize: 18 }} />
        )
      }
      sx={{
        height: 48,
        borderRadius: "10px",
        textTransform: "none",
        fontSize: "0.95rem",
        fontWeight: 800,
        bgcolor: "#2563eb",
        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
        boxShadow: "0 8px 20px rgba(37,99,235,0.18)",
        "&:hover": {
          background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
          boxShadow: "0 12px 25px rgba(37,99,235,0.24)",
        },
        "&:disabled": {
          bgcolor: "#cbd5e1",
          background: "#cbd5e1",
          color: "#f8fafc",
          boxShadow: "none",
        },
      }}
    >
      {isAnalyzing ? "Đang phân tích..." : "Phân tích CV"}
    </Button>

    <Button
      fullWidth
      variant="outlined"
      onClick={onReset}
      startIcon={<Refresh sx={{ fontSize: 18 }} />}
      sx={{
        height: 48,
        borderRadius: "10px",
        textTransform: "none",
        fontSize: "0.95rem",
        fontWeight: 800,
        bgcolor: "#ffffff",
        borderColor: "#dbe3ef",
        color: "#475569",
        "&:hover": {
          bgcolor: "#f8fafc",
          borderColor: "#cbd5e1",
        },
      }}
    >
      Làm mới
    </Button>
  </Stack>
);

export default ActionButtons;