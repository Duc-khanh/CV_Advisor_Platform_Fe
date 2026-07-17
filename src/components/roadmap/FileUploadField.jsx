import React from "react";
import { Box, Button, Typography, Chip } from "@mui/material";
import { CloudUpload, InsertDriveFile } from "@mui/icons-material";

const FileUploadField = ({ onFileUpload }) => (
  <Box>
    <Typography
      variant="h6"
      fontWeight={800}
      color="#0f172a"
      mb={2.5}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.4,
      }}
    >
      <CloudUpload sx={{ color: "#2563eb", fontSize: 28 }} />
      Tải lên CV của bạn
    </Typography>

    <Button
      component="label"
      fullWidth
      sx={{
        height: 220,
        borderRadius: "18px",
        border: "2px dashed #93c5fd",
        bgcolor: "#ffffff",
        textTransform: "none",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
        transition: "all 0.25s ease",
        "&:hover": {
          bgcolor: "#eff6ff",
          borderColor: "#3b82f6",
        },
      }}
    >
      <Box
        sx={{
          width: 60,
          height: 60,
          borderRadius: "50%",
          bgcolor: "#eff6ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        <CloudUpload sx={{ fontSize: 32, color: "#2563eb" }} />
      </Box>

      <Typography variant="subtitle1" fontWeight={800} mb={0.5}>
        Chọn file CV
      </Typography>

      <Typography variant="body2" color="#64748b" mb={1.5} sx={{ fontSize: '0.8rem' }}>
        Kéo & thả file PDF vào đây
      </Typography>

      <Chip
        icon={<InsertDriveFile sx={{ color: "#3b82f6 !important", fontSize: 16 }} />}
        label="Chỉ PDF (tối đa 5MB)"
        size="small"
        sx={{
          bgcolor: "#eff6ff",
          color: "#475569",
          fontWeight: 600,
          borderRadius: "999px",
          px: 1,
        }}
      />

      <input
        type="file"
        hidden
        accept=".pdf"
        onChange={onFileUpload}
      />
    </Button>
  </Box>
);

export default FileUploadField;