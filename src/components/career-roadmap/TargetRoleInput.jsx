import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { WorkOutline } from "@mui/icons-material";

const TargetRoleInput = ({ value, onChange }) => (
  <Box>
    <Typography
      variant="h6"
      fontWeight={800}
      color="#0f172a"
      mb={2}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.4,
      }}
    >
      <Box
        component="span"
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          border: "2px solid #3b82f6",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#3b82f6",
          fontSize: 14,
        }}
      >
        ◎
      </Box>
      Thiết lập phân tích
    </Typography>

    <Typography variant="body2" fontWeight={600} color="#475569" mb={1}>
      Vị trí mục tiêu (tùy chọn)
    </Typography>

    <TextField
      fullWidth
      placeholder="VD: Frontend Developer, Data Scientist..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1.2,
            }}
          >
            <WorkOutline sx={{ color: "#2563eb", fontSize: 18 }} />
          </Box>
        ),
      }}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          height: 48,
          borderRadius: "10px",
          bgcolor: "#ffffff",
          fontSize: "0.9rem",
          fontWeight: 600,
          "& fieldset": {
            borderColor: "#dbe3ef",
          },
          "&:hover fieldset": {
            borderColor: "#bfdbfe",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6",
            borderWidth: "1px",
          },
        },
      }}
    />
  </Box>
);

export default TargetRoleInput;