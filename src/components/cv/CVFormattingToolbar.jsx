import React, { useState } from "react";
import {
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  Sparkles,
  Wand2,
  Copy,
  Check,
} from "lucide-react";
import {
  Box,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

const AI_SUGGESTIONS = [
  {
    title: "Mục tiêu nghề nghiệp ấn tượng (Backend)",
    text: "Lập trình viên Backend với hơn 2 năm kinh nghiệm thiết kế hệ thống Microservices quy mô cao bằng Java Spring Boot và Node.js. Đam mê tối ưu hiệu năng database, thiết kế clean API và áp dụng CI/CD tự động hóa.",
  },
  {
    title: "Mục tiêu nghề nghiệp ấn tượng (Frontend)",
    text: "Kỹ sư Frontend chuyên sâu React.js, Next.js và Tailwind CSS. Có kinh nghiệm xây dựng giao diện người dùng tương tác cao cấp, tối ưu Core Web Vitals và tích hợp RESTful/GraphQL APIs mượt mà.",
  },
  {
    title: "Mô tả công việc chuẩn Action-Verbs (Kinh nghiệm)",
    text: "• Thiết kế và triển khai kiến trúc RESTful APIs phục vụ hơn 50,000 người dùng hàng ngày.\n• Tối ưu hóa truy vấn SQL PostgreSQL giúp giảm thời gian phản hồi API trung bình từ 450ms xuống 120ms.\n• Phối hợp cùng đội ngũ Product và UI/UX để phát triển các tính năng thanh toán bảo mật chuẩn quốc tế.",
  },
];

export default function CVFormattingToolbar({
  onApplyText,
}) {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          px: 1.5,
          py: 0.6,
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          position: "sticky",
          top: 12,
          zIndex: 5,
          mx: "auto",
          mb: 3,
        }}
      >
        <Tooltip title="In đậm (Bold)">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { bgcolor: "#f1f5f9" } }}>
            <Bold size={15} />
          </IconButton>
        </Tooltip>

        <Tooltip title="In nghiêng (Italic)">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { bgcolor: "#f1f5f9" } }}>
            <Italic size={15} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Danh sách gạch đầu dòng (Bullet List)">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { bgcolor: "#f1f5f9" } }}>
            <List size={15} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.8 }} />

        <Tooltip title="Căn trái">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { bgcolor: "#f1f5f9" } }}>
            <AlignLeft size={15} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Căn giữa">
          <IconButton size="small" sx={{ color: "#475569", "&:hover": { bgcolor: "#f1f5f9" } }}>
            <AlignCenter size={15} />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.8 }} />

        {/* Nút AI Sparkles */}
        <Tooltip title="AI trau chuốt nội dung CV">
          <Button
            size="small"
            onClick={() => setAiModalOpen(true)}
            startIcon={<Sparkles size={14} color="#2563eb" />}
            sx={{
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "#2563eb",
              bgcolor: "#eff6ff",
              borderRadius: "6px",
              px: 1.2,
              py: 0.4,
              "&:hover": {
                bgcolor: "#dbeafe",
              },
            }}
          >
            AI Trau chuốt
          </Button>
        </Tooltip>
      </Box>

      {/* AI Suggestions Modal */}
      <Dialog
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ p: 0.8, bgcolor: "#eff6ff", borderRadius: "8px", color: "#2563eb", display: "flex" }}>
              <Wand2 size={18} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                AI Trợ Lý Trau Chuốt CV
              </Typography>
              <Typography variant="caption" color="#64748b">
                Gợi ý đoạn văn chuẩn ATS giúp CV của bạn gây ấn tượng mạnh với HR
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={() => setAiModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1.5 }}>
          <Stack spacing={2}>
            {AI_SUGGESTIONS.map((sug, idx) => (
              <Box
                key={idx}
                sx={{
                  p: 2,
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} color="#1D61F2">
                    {sug.title}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleCopy(sug.text, idx)}
                    startIcon={copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: copiedIdx === idx ? "#16a34a" : "#475569",
                    }}
                  >
                    {copiedIdx === idx ? "Đã sao chép" : "Sao chép"}
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#334155",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {sug.text}
                </Typography>
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
