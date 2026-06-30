import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Logout, Close } from "@mui/icons-material";

export default function LogoutConfirmDialog({ open, onClose, onConfirm }) {
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
          pt: 2.5,
          pb: 2,
          textAlign: "center",
          background: "linear-gradient(180deg, #fff7f7 0%, #ffffff 100%)",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#94a3b8",
          }}
        >
          <Close sx={{ fontSize: 22 }} />
        </IconButton>

        <Box
          sx={{
            width: 68,
            height: 68,
            mx: "auto",
            mb: 2,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgba(248,113,113,0.14), rgba(239,68,68,0.08))",
          }}
        >
          <Logout
            sx={{
              fontSize: 34,
              color: "#ef4444",
            }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            color: "#0f172a",
            mb: 1,
          }}
        >
          Xác nhận đăng xuất
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            lineHeight: 1.6,
            fontSize: "0.92rem",
            maxWidth: 300,
            mx: "auto",
          }}
        >
          Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng các tính năng của hệ
          thống.
        </Typography>
      </Box>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 0.5,
          gap: 1.5,
          justifyContent: "center",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            height: 46,
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            borderColor: "#e2e8f0",
            color: "#475569",
            bgcolor: "#ffffff",
            "&:hover": {
              borderColor: "#cbd5e1",
              bgcolor: "#f8fafc",
            },
          }}
        >
          Hủy
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          fullWidth
          sx={{
            height: 46,
            borderRadius: "14px",
            textTransform: "none",
            fontWeight: 800,
            fontSize: "0.95rem",
            bgcolor: "#ef4444",
            boxShadow: "0 10px 20px rgba(239,68,68,0.24)",
            "&:hover": {
              bgcolor: "#dc2626",
              boxShadow: "0 12px 24px rgba(239,68,68,0.3)",
            },
          }}
        >
          Đăng xuất
        </Button>
      </DialogActions>
    </Dialog>
  );
}