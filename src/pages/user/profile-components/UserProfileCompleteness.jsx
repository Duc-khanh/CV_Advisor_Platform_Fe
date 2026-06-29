import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

export default function UserProfileCompleteness({ completionPercent }) {
  return (
    <Stack spacing={3}>
      {/* Completeness Meter */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          textAlign: "center",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle2" fontWeight={850} color="#0f172a" mb={2.5}>
          Độ hoàn thiện hồ sơ
        </Typography>

        <Box sx={{ position: "relative", display: "inline-flex", mb: 2.5 }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={100}
            thickness={6}
            sx={{ color: "#fee2e2" }}
          />
          <CircularProgress
            variant="determinate"
            value={completionPercent}
            size={100}
            thickness={6}
            sx={{
              color: "#ef4444",
              position: "absolute",
              left: 0,
              strokeLinecap: "round",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={900} color="#ef4444" sx={{ fontSize: "1.15rem" }}>
              {completionPercent}%
            </Typography>
            <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: "0.55rem" }}>
              hoàn thành
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 1.8,
            bgcolor: "#f8fafc",
            borderRadius: 2.5,
            border: "1px dashed #e2e8f0",
            mb: 2.5,
            textAlign: "left",
          }}
        >
          <Typography
            variant="caption"
            color="#475569"
            fontWeight={550}
            sx={{ lineHeight: 1.4, display: "block", fontSize: "0.72rem" }}
          >
            Nâng cấp hồ sơ của bạn lên <strong>70%</strong> để nhận gợi ý CV mẫu độc quyền của chuyên gia IT từ AI.
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{
            bgcolor: "#ef4444",
            color: "#fff",
            textTransform: "none",
            fontWeight: 800,
            py: 1.2,
            borderRadius: 2.5,
            fontSize: "0.85rem",
            boxShadow: "0 4px 10px rgba(239,68,68,0.15)",
            "&:hover": { bgcolor: "#dc2626" },
          }}
        >
          Xem và Tải CV
        </Button>
      </Paper>

      {/* Quick Auto Fill */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={1.8} sx={{ alignItems: "center", textAlign: "center" }}>
          <Avatar sx={{ bgcolor: "#fee2e2", color: "#ef4444", width: 40, height: 40 }}>
            <AutoAwesome sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" fontWeight={850} color="#0f172a" mb={0.2} sx={{ fontSize: "0.85rem" }}>
              Cập nhật nhanh hồ sơ
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
              Điền nhanh hồ sơ bằng CV của bạn chỉ với ít phút.
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="outlined"
            sx={{
              borderColor: "#ef4444",
              color: "#ef4444",
              textTransform: "none",
              fontWeight: 800,
              py: 1,
              borderRadius: 2.5,
              fontSize: "0.8rem",
              "&:hover": { borderColor: "#dc2626", bgcolor: "#fff5f5" },
            }}
          >
            Điền hồ sơ tự động
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
