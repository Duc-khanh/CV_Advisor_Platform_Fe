import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Close, Warning, CheckCircleOutline, InfoOutlined, ErrorOutline } from "@mui/icons-material";

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, type = "info", confirmText = "Xác nhận", cancelText = "Hủy" }) {
  // Cấu hình dựa trên type: danger, success, warning, info
  const getConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: <ErrorOutline sx={{ fontSize: 34, color: "#ef4444" }} />,
          iconBg: "linear-gradient(135deg, rgba(248,113,113,0.14), rgba(239,68,68,0.08))",
          gradBg: "linear-gradient(180deg, #fff7f7 0%, #ffffff 100%)",
          btnColor: "#ef4444",
          btnHover: "#dc2626",
          shadow: "0 10px 20px rgba(239,68,68,0.24)",
          shadowHover: "0 12px 24px rgba(239,68,68,0.3)"
        };
      case "success":
        return {
          icon: <CheckCircleOutline sx={{ fontSize: 34, color: "#10b981" }} />,
          iconBg: "linear-gradient(135deg, rgba(16,185,129,0.14), rgba(16,185,129,0.08))",
          gradBg: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)",
          btnColor: "#10b981",
          btnHover: "#059669",
          shadow: "0 10px 20px rgba(16,185,129,0.24)",
          shadowHover: "0 12px 24px rgba(16,185,129,0.3)"
        };
      case "warning":
        return {
          icon: <Warning sx={{ fontSize: 34, color: "#f59e0b" }} />,
          iconBg: "linear-gradient(135deg, rgba(245,158,11,0.14), rgba(245,158,11,0.08))",
          gradBg: "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)",
          btnColor: "#f59e0b",
          btnHover: "#d97706",
          shadow: "0 10px 20px rgba(245,158,11,0.24)",
          shadowHover: "0 12px 24px rgba(245,158,11,0.3)"
        };
      case "info":
      default:
        return {
          icon: <InfoOutlined sx={{ fontSize: 34, color: "#3b82f6" }} />,
          iconBg: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(59,130,246,0.08))",
          gradBg: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
          btnColor: "#3b82f6",
          btnHover: "#2563eb",
          shadow: "0 10px 20px rgba(59,130,246,0.24)",
          shadowHover: "0 12px 24px rgba(59,130,246,0.3)"
        };
    }
  };

  const config = getConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "22px",
          overflow: "hidden",
          bgcolor: "#ffffff",
          boxShadow: "0 22px 50px rgba(15,23,42,0.16)",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: 3,
          pt: 3.5,
          pb: 2,
          textAlign: "center",
          background: config.gradBg,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            color: "#94a3b8",
          }}
        >
          <Close sx={{ fontSize: 20 }} />
        </IconButton>

        <Box
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2.5,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: config.iconBg,
          }}
        >
          {config.icon}
        </Box>

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            color: "#0f172a",
            mb: 1.5,
            lineHeight: 1.3,
            fontSize: "1.18rem"
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            lineHeight: 1.6,
            fontSize: "0.92rem",
            maxWidth: 320,
            mx: "auto",
          }}
        >
          {message}
        </Typography>
      </Box>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1.5,
          gap: 1.5,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            height: 44,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.92rem",
            borderColor: "#e2e8f0",
            color: "#475569",
            bgcolor: "#ffffff",
            "&:hover": {
              borderColor: "#cbd5e1",
              bgcolor: "#f8fafc",
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          fullWidth
          sx={{
            height: 44,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.92rem",
            bgcolor: config.btnColor,
            boxShadow: config.shadow,
            "&:hover": {
              bgcolor: config.btnHover,
              boxShadow: config.shadowHover,
            },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
