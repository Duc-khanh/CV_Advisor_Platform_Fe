import React from "react";
import { Alert } from "@mui/material";

const ErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <Alert
      severity="error"
      sx={{
        bgcolor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fca5a5",
        "& .MuiAlert-icon": { color: "#dc2626" },
      }}
    >
      {error}
    </Alert>
  );
};

export default ErrorAlert;
