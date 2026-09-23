import React, { useState } from "react";
import {
  LayoutTemplate,
  Palette,
  Type,
  Cloud,
  CloudOff,
  LoaderCircle,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export const COLOR_PRESETS = [
  { name: "Xanh dương thương hiệu", value: "#1D61F2" },
  { name: "Xanh Navy đậm", value: "#1e3a8a" },
  { name: "Đen tối giản (Charcoal)", value: "#111827" },
  { name: "Xám thanh lịch (Slate)", value: "#475569" },
  { name: "Xanh ngọc (Teal)", value: "#0d9488" },
  { name: "Xanh lá đậm (Emerald)", value: "#15803d" },
  { name: "Nâu tây (Bronze)", value: "#854d0e" },
  { name: "Đỏ rượu (Burgundy)", value: "#991b1b" },
  { name: "Tím Indigo", value: "#6366f1" },
];

export const FONT_PRESETS = [
  { name: "Inter (Hiện đại)", value: "Inter, sans-serif" },
  { name: "Roboto (Tiêu chuẩn)", value: "Roboto, sans-serif" },
  { name: "Montserrat (Hình học)", value: "Montserrat, sans-serif" },
  { name: "Poppins (Trẻ trung)", value: "Poppins, sans-serif" },
  { name: "Open Sans (Rõ nét)", value: "'Open Sans', sans-serif" },
  { name: "Merriweather (Cổ điển)", value: "Merriweather, serif" },
  { name: "Lora (Thanh lịch)", value: "Lora, serif" },
  { name: "Playfair Display (Sang trọng)", value: "'Playfair Display', serif" },
];

export const TEMPLATE_PRESETS = [
  {
    id: "modern",
    name: "Modern (2 Cột)",
    description: "Thiết kế hiện đại với sidebar màu nhạt chứa liên hệ và kỹ năng",
    badge: "Phổ biến nhất",
  },
  {
    id: "classic",
    name: "Classic (1 Cột)",
    description: "Bố cục truyền thống, thanh lịch, chuẩn tối ưu hệ thống ATS",
    badge: "Chuẩn ATS",
  },
];

export default function CVStudioTopBar({
  selectedTemplate,
  onSelectTemplate,
  primaryColor,
  onSelectColor,
  fontFamily,
  onSelectFont,
  autoSaveStatus = "saved",
  onDownload,
}) {
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [colorAnchor, setColorAnchor] = useState(null);
  const [fontAnchor, setFontAnchor] = useState(null);

  const activeFontName =
    FONT_PRESETS.find((f) => f.value === fontFamily)?.name.split(" ")[0] || "Inter";

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        px: { xs: 2, sm: 3, md: 3.5 },
        py: 1.25,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 1.5,
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        zIndex: 10,
      }}
    >
      {/* Cụm bên trái: Template, Bảng màu, Phông chữ, Giãn dòng */}
      <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap">
        {/* Nút Đổi Template */}
        <Button
          variant="outlined"
          size="small"
          onClick={() => setTemplateDialogOpen(true)}
          startIcon={<LayoutTemplate size={16} color="#1D61F2" />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#334155",
            borderColor: "#cbd5e1",
            borderRadius: "8px",
            height: 38,
            px: 1.8,
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "#f8fafc",
              borderColor: "#94a3b8",
            },
          }}
        >
          Đổi Template
        </Button>

        {/* Nút Bảng màu */}
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => setColorAnchor(e.currentTarget)}
          startIcon={
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                bgcolor: primaryColor,
                border: "2px solid #ffffff",
                boxShadow: "0 0 0 1px #cbd5e1",
              }}
            />
          }
          endIcon={<ChevronDown size={14} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#334155",
            borderColor: "#cbd5e1",
            borderRadius: "8px",
            height: 38,
            px: 1.8,
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "#f8fafc",
              borderColor: "#94a3b8",
            },
          }}
        >
          Bảng màu
        </Button>

        {/* Menu Bảng màu */}
        <Menu
          anchorEl={colorAnchor}
          open={Boolean(colorAnchor)}
          onClose={() => setColorAnchor(null)}
          PaperProps={{
            sx: {
              p: 1.5,
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              minWidth: 200,
            },
          }}
        >
          <Typography variant="caption" sx={{ px: 1, pb: 1, display: "block", fontWeight: 700, color: "#64748b" }}>
            CHỌN MÀU CHỦ ĐẠO
          </Typography>
          {COLOR_PRESETS.map((color) => {
            const isSelected = primaryColor.toLowerCase() === color.value.toLowerCase();
            return (
              <MenuItem
                key={color.value}
                onClick={() => {
                  onSelectColor(color.value);
                  setColorAnchor(null);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "8px",
                  py: 1,
                  px: 1.5,
                  mb: 0.5,
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      bgcolor: color.value,
                      border: "2px solid #ffffff",
                      boxShadow: "0 0 0 1px #cbd5e1",
                    }}
                  />
                  <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500, color: "#1e293b" }}>
                    {color.name}
                  </Typography>
                </Stack>
                {isSelected && <Check size={16} color="#1D61F2" />}
              </MenuItem>
            );
          })}
        </Menu>

        {/* Nút Phông chữ */}
        <Button
          variant="outlined"
          size="small"
          onClick={(e) => setFontAnchor(e.currentTarget)}
          startIcon={<Type size={16} color="#64748b" />}
          endIcon={<ChevronDown size={14} />}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.85rem",
            color: "#334155",
            borderColor: "#cbd5e1",
            borderRadius: "8px",
            height: 38,
            px: 1.8,
            bgcolor: "#ffffff",
            "&:hover": {
              bgcolor: "#f8fafc",
              borderColor: "#94a3b8",
            },
          }}
        >
          {activeFontName}
        </Button>

        {/* Menu Phông chữ */}
        <Menu
          anchorEl={fontAnchor}
          open={Boolean(fontAnchor)}
          onClose={() => setFontAnchor(null)}
          PaperProps={{
            sx: {
              p: 1.5,
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              minWidth: 200,
            },
          }}
        >
          <Typography variant="caption" sx={{ px: 1, pb: 1, display: "block", fontWeight: 700, color: "#64748b" }}>
            CHỌN PHÔNG CHỮ
          </Typography>
          {FONT_PRESETS.map((f) => {
            const isSelected = fontFamily === f.value;
            return (
              <MenuItem
                key={f.value}
                onClick={() => {
                  onSelectFont(f.value);
                  setFontAnchor(null);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: "8px",
                  py: 1,
                  px: 1.5,
                  mb: 0.5,
                  fontFamily: f.value,
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: isSelected ? 700 : 500, fontFamily: f.value }}>
                  {f.name}
                </Typography>
                {isSelected && <Check size={16} color="#1D61F2" />}
              </MenuItem>
            );
          })}
        </Menu>
      </Stack>

      {/* Cụm bên phải: Lưu bản nháp & Tải file PDF */}
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Stack
          direction="row"
          spacing={0.7}
          alignItems="center"
          sx={{
            color: autoSaveStatus === "local" ? "#b45309" : autoSaveStatus === "saving" ? "#2563eb" : "#64748b",
            bgcolor: autoSaveStatus === "local" ? "#fffbeb" : "#f8fafc",
            borderRadius: "999px",
            px: 1.2,
            py: 0.65,
          }}
        >
          {autoSaveStatus === "saving" ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : autoSaveStatus === "local" ? (
            <CloudOff size={14} />
          ) : (
            <Cloud size={14} />
          )}
          <Typography variant="caption" sx={{ color: "inherit", fontWeight: 600, whiteSpace: "nowrap" }}>
            {autoSaveStatus === "saving" ? "Đang lưu..." : autoSaveStatus === "local" ? "Đã lưu trên thiết bị" : "Đã lưu"}
          </Typography>
        </Stack>
        {/* Nút Lưu bản nháp (Ghost button: border-slate-200 text-slate-700 hover:bg-slate-50) */}


        {/* Nút Tải file PDF (Primary Blue #1D61F2, text-white, icon download) */}
        <Button
          variant="contained"
          size="small"
          onClick={onDownload}
          startIcon={<Download size={16} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            bgcolor: "#1D61F2",
            color: "#ffffff",
            borderRadius: "10px",
            height: 38,
            px: 2.2,
            boxShadow: "0 2px 8px rgba(29, 97, 242, 0.25)",
            "&:hover": {
              bgcolor: "#1752cd",
              boxShadow: "0 4px 12px rgba(29, 97, 242, 0.35)",
            },
          }}
        >
          Tải file PDF
        </Button>
      </Stack>

      {/* Modal Chọn Template */}
      <Dialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 1.5,
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              Chọn Mẫu Thiết Kế CV
            </Typography>
            <Typography variant="body2" color="#64748b">
              Chọn phong cách phù hợp với định hướng nghề nghiệp của bạn
            </Typography>
          </Box>
          <IconButton onClick={() => setTemplateDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {TEMPLATE_PRESETS.map((tmpl) => {
              const isSelected = selectedTemplate === tmpl.id;
              return (
                <Box
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl.id);
                    setTemplateDialogOpen(false);
                  }}
                  sx={{
                    border: isSelected ? "2px solid #1D61F2" : "1px solid #e2e8f0",
                    borderRadius: "14px",
                    p: 2.5,
                    cursor: "pointer",
                    bgcolor: isSelected ? "#eff6ff" : "#ffffff",
                    transition: "all 0.2s ease",
                    position: "relative",
                    "&:hover": {
                      borderColor: "#1D61F2",
                      boxShadow: "0 8px 24px rgba(29, 97, 242, 0.12)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} color={isSelected ? "#1D61F2" : "#0f172a"}>
                      {tmpl.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        bgcolor: isSelected ? "#1D61F2" : "#f1f5f9",
                        color: isSelected ? "#ffffff" : "#475569",
                        px: 1.2,
                        py: 0.3,
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "0.72rem",
                      }}
                    >
                      {tmpl.badge}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="#64748b" sx={{ mb: 2, fontSize: "0.85rem", lineHeight: 1.5 }}>
                    {tmpl.description}
                  </Typography>

                  {/* Thumbnail Mockup */}
                  <Box
                    sx={{
                      height: 120,
                      borderRadius: "8px",
                      bgcolor: isSelected ? "#ffffff" : "#f8fafc",
                      border: "1px dashed #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isSelected ? "#1D61F2" : "#94a3b8",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    {tmpl.id === "modern" ? "2 Cột: Sidebar & Nội dung chính" : "1 Cột: Trực diện chuẩn ATS"}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
