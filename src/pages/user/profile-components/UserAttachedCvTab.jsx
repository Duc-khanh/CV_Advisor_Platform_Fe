import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  CloudUpload,
  FilePresent,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { useToast } from "../../../contexts/ToastContext";

export default function UserAttachedCvTab({ user }) {
  const showToast = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const fileType = file.name.split(".").pop().toLowerCase();
    if (fileType !== "pdf" && fileType !== "doc" && fileType !== "docx") {
      showToast("Chỉ hỗ trợ tải lên file PDF, DOC hoặc DOCX.", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Dung lượng file tối đa là 5MB.", "error");
      return;
    }

    setUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      showToast("Tải lên CV thành công!", "success");
    }, 1500);
  };

  return (
    <Stack spacing={3}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h6" fontWeight={800} color="#0f172a" mb={1}>
          Quản lý CV đính kèm
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Tải lên các file CV đính kèm để dễ dàng ứng tuyển vào các vị trí công việc mơ ước của bạn.
        </Typography>

        {/* Existing CV details container */}
        <Box
          sx={{
            p: 2.5,
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            bgcolor: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: "#ffe4e6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FilePresent sx={{ color: "#fb7185", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={700} color="#0f172a">
                NguyenDucKhanhCVFullStack.pdf
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Cập nhật lần cuối: 13/04/2026 • Dung lượng: 1.2 MB
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: "#e2e8f0",
                color: "#64748b",
                textTransform: "none",
                fontWeight: 700,
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f1f5f9" },
              }}
            >
              Tải về CV
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ textTransform: "none", fontWeight: 700 }}
            >
              Xóa
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Upload drag-and-drop zone */}
        <Box
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          sx={{
            border: "2px dashed",
            borderColor: dragActive ? "#3b82f6" : "#cbd5e1",
            borderRadius: 3.5,
            p: 5,
            textAlign: "center",
            cursor: "pointer",
            bgcolor: dragActive ? "#eff6ff" : "#f8fafc",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              borderColor: "#3b82f6",
              bgcolor: "#eff6ff",
            },
          }}
          component="label"
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            hidden
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#2563eb",
              }}
            >
              <CloudUpload fontSize="large" />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} color="#334155" mb={0.5}>
                {uploading ? "Đang tải tệp lên..." : "Kéo thả file CV của bạn vào đây hoặc click để duyệt file"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hỗ trợ tệp: PDF, DOC, DOCX • Dung lượng không quá 5MB
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

      {/* Guidelines Paper */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle2" fontWeight={800} color="#334155" mb={2}>
          Mẹo viết CV đính kèm chuyên nghiệp
        </Typography>
        <Stack spacing={1.5}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <CheckCircle sx={{ color: "#10b981", fontSize: 18, mt: 0.2 }} />
            <Typography variant="body2" color="#475569" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              <strong>Sử dụng định dạng tệp PDF</strong> để tránh lỗi hiển thị font chữ và bố cục trên các máy tính khác nhau.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <CheckCircle sx={{ color: "#10b981", fontSize: 18, mt: 0.2 }} />
            <Typography variant="body2" color="#475569" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              <strong>Đặt tên file rõ ràng</strong> bao gồm họ tên và vị trí ứng tuyển. Ví dụ: <code>NguyenDuckhanh_CV_Fullstack.pdf</code>.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Error sx={{ color: "#f59e0b", fontSize: 18, mt: 0.2 }} />
            <Typography variant="body2" color="#475569" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              Tránh viết CV quá dài (khuyên dùng từ 1-2 trang) tập trung vào kinh nghiệm cốt lõi liên quan nhất.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
