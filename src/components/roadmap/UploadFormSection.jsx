import React, { useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import {
  CloudUpload,
  InsertDriveFile,
  WorkOutline,
  CalendarMonth,
  AutoAwesome,
  Refresh,
  ArrowForward,
  ArrowDownward,
  CheckCircle,
  DeleteOutline,
} from "@mui/icons-material";

const suggestionTags = [
  "Java Backend",
  "Frontend React",
  "Data Analyst",
  "Tester / QA",
];

const roadmapDurations = [
  "3 tháng (Cấp tốc)",
  "6 tháng (Tiêu chuẩn)",
  "1 năm (Dài hạn)",
];

const UploadFormSection = ({
  cvFile,
  targetRole,
  desiredRoadmap,
  error,
  isAnalyzing,
  onFileUpload,
  onTargetRoleChange,
  onDesiredRoadmapChange,
  onAnalyze,
  onReset,
}) => {
  const fileInputRef = useRef(null);

  const handleTagClick = (tag) => {
    onTargetRoleChange(tag);
  };

  const isCtaDisabled = isAnalyzing || !cvFile || !targetRole?.trim();

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", lg: "1020px" },
        mx: "auto",
        alignSelf: "center",
        p: { xs: 2.5, sm: 3, md: 3.5 },
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.05)",
        boxSizing: "border-box",
      }}
    >
      {/* KHUNG NHẬP LIỆU: BỐ CỤC 2 CỘT CÓ MŨI TÊN LIÊN KẾT Ở GIỮA */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr auto 1fr",
          },
          alignItems: "stretch",
          gap: { xs: 2, md: 2, lg: 2.5 },
        }}
      >
        {/* ================= CỘT 1: ĐIỂM XUẤT PHÁT ================= */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            p: { xs: 2, sm: 2.25 },
            borderRadius: "12px",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Tiêu đề cột 1 */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  border: "1px solid #bfdbfe",
                }}
              >
                1
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "0.98rem", sm: "1.05rem" },
                }}
              >
                Năng lực hiện tại
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.8rem", pl: 4.2 }}>
              Điểm xuất phát từ hồ sơ của bạn
            </Typography>
          </Box>

          {/* Khung upload CV */}
          {!cvFile ? (
            <Button
              component="label"
              fullWidth
              sx={{
                flex: 1,
                minHeight: 190,
                borderRadius: "10px",
                border: "2px dashed #93c5fd",
                bgcolor: "#ffffff",
                textTransform: "none",
                color: "#0f172a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "#eff6ff",
                  borderColor: "#2563eb",
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "8px",
                  bgcolor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#2563eb",
                  mb: 1,
                }}
              >
                <CloudUpload sx={{ fontSize: 24 }} />
              </Box>

              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.92rem", mb: 0.3 }}
              >
                Tải lên CV (PDF)
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontSize: "0.78rem",
                  textAlign: "center",
                  maxWidth: "260px",
                  mb: 1.2,
                }}
              >
                AI sẽ đọc kỹ năng và kinh nghiệm bạn đang có
              </Typography>

              <Chip
                icon={<InsertDriveFile sx={{ color: "#2563eb !important", fontSize: 14 }} />}
                label="Định dạng PDF (tối đa 5MB)"
                size="small"
                sx={{
                  height: 24,
                  bgcolor: "#eff6ff",
                  color: "#3b82f6",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                  borderRadius: "6px",
                }}
              />

              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf,application/pdf"
                onChange={onFileUpload}
              />
            </Button>
          ) : (
            /* Khi đã upload thành công */
            <Box
              sx={{
                flex: 1,
                minHeight: 190,
                borderRadius: "10px",
                border: "2px solid #86efac",
                bgcolor: "#f0fdf4",
                p: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.2 }}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    borderRadius: "8px",
                    bgcolor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#16a34a",
                    flexShrink: 0,
                  }}
                >
                  <InsertDriveFile sx={{ fontSize: 20 }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={0.6} sx={{ mb: 0.2 }}>
                    <CheckCircle sx={{ color: "#16a34a", fontSize: 16 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#166534", fontSize: "0.85rem" }}>
                      Đã tải lên CV thành công
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      fontWeight: 700,
                      color: "#0f172a",
                      fontSize: "0.85rem",
                    }}
                  >
                    {cvFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.75rem" }}>
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB • File PDF
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1 }}>
                <Typography variant="caption" sx={{ color: "#15803d", fontWeight: 600, fontSize: "0.75rem" }}>
                  ✓ AI sẵn sàng trích xuất kỹ năng
                </Typography>

                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    py: 0.4,
                    px: 1.2,
                    borderColor: "#bbf7d0",
                    color: "#15803d",
                    bgcolor: "#ffffff",
                    "&:hover": {
                      borderColor: "#86efac",
                      bgcolor: "#f0fdf4",
                    },
                  }}
                >
                  Đổi file khác
                  <input
                    type="file"
                    hidden
                    accept=".pdf,application/pdf"
                    onChange={onFileUpload}
                  />
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* ================= MŨI TÊN LIÊN KẾT Ở GIỮA ================= */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 0.5, md: 0 },
          }}
        >
          <Box
            sx={{
              width: { xs: 34, md: 36 },
              height: { xs: 34, md: 36 },
              borderRadius: "50%",
              bgcolor: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              boxShadow: "0 2px 8px rgba(37,99,235,0.12)",
            }}
          >
            {/* Desktop: Mũi tên sang phải / Mobile: Mũi tên xuống dưới */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <ArrowForward sx={{ fontSize: 18 }} />
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <ArrowDownward sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        </Box>

        {/* ================= CỘT 2: ĐÍCH ĐẾN ================= */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            p: { xs: 2, sm: 2.25 },
            borderRadius: "12px",
            bgcolor: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          {/* Tiêu đề cột 2 */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.3 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "6px",
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  border: "1px solid #bfdbfe",
                }}
              >
                2
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "0.98rem", sm: "1.05rem" },
                }}
              >
                Mục tiêu mong muốn
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b", fontSize: "0.8rem", pl: 4.2 }}>
              Vị trí & thời gian bạn hướng tới
            </Typography>
          </Box>

          {/* Khung nhập mục tiêu & thời gian */}
          <Stack
            spacing={1.5}
            sx={{
              flex: 1,
              minHeight: 190,
              bgcolor: "#ffffff",
              p: 2,
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxSizing: "border-box",
              justifyContent: "space-between",
            }}
          >
            {/* Input (Bắt buộc): Vị trí nghề nghiệp mục tiêu */}
            <Box>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#334155",
                  mb: 0.4,
                }}
              >
                Vị trí nghề nghiệp mục tiêu (*)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="VD: Fullstack Developer, Data Engineer..."
                value={targetRole}
                onChange={(e) => onTargetRoleChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WorkOutline sx={{ color: "#2563eb", fontSize: 16 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "6px",
                    bgcolor: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    "& fieldset": { borderColor: "#cbd5e1" },
                    "&:hover fieldset": { borderColor: "#94a3b8" },
                    "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                  },
                }}
              />

              {/* Tags gợi ý nhanh */}
              <Box sx={{ mt: 0.8, display: "flex", alignItems: "center", gap: 0.6, flexWrap: "wrap" }}>
                <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, fontSize: "0.72rem" }}>
                  Gợi ý:
                </Typography>
                {suggestionTags.map((tag) => {
                  const isSelected = targetRole === tag;
                  return (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={() => handleTagClick(tag)}
                      sx={{
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        height: 22,
                        borderRadius: "6px",
                        bgcolor: isSelected ? "#2563eb" : "#f1f5f9",
                        color: isSelected ? "#ffffff" : "#475569",
                        border: isSelected ? "1px solid #1d4ed8" : "1px solid #e2e8f0",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          bgcolor: isSelected ? "#1d4ed8" : "#e2e8f0",
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Select (Bắt buộc): Thời gian học tập dự kiến */}
            <Box>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  color: "#334155",
                  mb: 0.4,
                }}
              >
                Thời gian học tập dự kiến (*)
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={desiredRoadmap || "6 tháng (Tiêu chuẩn)"}
                  onChange={(e) => onDesiredRoadmapChange(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <CalendarMonth sx={{ color: "#2563eb", fontSize: 16 }} />
                    </InputAdornment>
                  }
                  sx={{
                    borderRadius: "6px",
                    bgcolor: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#94a3b8" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2563eb" },
                  }}
                >
                  {roadmapDurations.map((dur) => (
                    <MenuItem key={dur} value={dur} sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                      {dur}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* THÔNG BÁO LỖI NẾU CÓ */}
      {error && (
        <Alert severity="error" sx={{ mt: 2.5, borderRadius: "8px", fontWeight: 600 }}>
          {error}
        </Alert>
      )}

      {/* ================= 3. NÚT HÀNH ĐỘNG CHÍNH (CTA) ================= */}
      <Box
        sx={{
          mt: 3,
          pt: 2.5,
          borderTop: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          alignItems="center"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={onAnalyze}
            disabled={isCtaDisabled}
            sx={{
              height: 48,
              px: { xs: 3, sm: 5 },
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: 300, md: 340 },
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 800,
              bgcolor: "#2563eb",
              color: "#ffffff",
              boxShadow: "0 8px 20px rgba(37,99,235,0.22)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#1d4ed8",
                boxShadow: "0 10px 24px rgba(37,99,235,0.3)",
              },
              "&:disabled": {
                bgcolor: "#cbd5e1",
                color: "#f8fafc",
                boxShadow: "none",
              },
            }}
          >
            {isAnalyzing ? (
              <Stack direction="row" spacing={1.2} alignItems="center">
                <CircularProgress size={20} color="inherit" />
                <span>AI đang phân tích & tạo lộ trình...</span>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesome sx={{ fontSize: 20 }} />
                <span>Tạo lộ trình học tập cùng AI</span>
              </Stack>
            )}
          </Button>

          {/* Nút Làm mới khi đã có dữ liệu nhập */}
          {(cvFile || targetRole) && (
            <Button
              variant="outlined"
              onClick={onReset}
              startIcon={<Refresh sx={{ fontSize: 18 }} />}
              sx={{
                height: 48,
                px: 2.5,
                borderRadius: "8px",
                textTransform: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                borderColor: "#e2e8f0",
                color: "#64748b",
                "&:hover": {
                  borderColor: "#cbd5e1",
                  bgcolor: "#f8fafc",
                  color: "#334155",
                },
              }}
            >
              Làm mới
            </Button>
          )}
        </Stack>

        {/* Chú thích hướng dẫn khi disable */}
        {isCtaDisabled && !isAnalyzing && (
          <Typography
            variant="caption"
            sx={{
              color: "#94a3b8",
              fontWeight: 600,
              mt: 1.2,
              fontSize: "0.78rem",
            }}
          >
            * Vui lòng tải lên file CV và nhập vị trí mục tiêu để AI tạo lộ trình
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default UploadFormSection;