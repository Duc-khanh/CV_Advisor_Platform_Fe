import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  FilePresent,
  CheckCircle,
  Error,
  Visibility,
  Download,
  Delete,
} from "@mui/icons-material";
import { useToast } from "../../../contexts/ToastContext";
import { cvService } from "../../../services/user";
import { getCvUrl } from "../../../utils/urlHelpers";

export default function UserAttachedCvTab({ user }) {
  const showToast = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCvList();
  }, []);

  const fetchCvList = async () => {
    setLoading(true);
    try {
      const data = await cvService.getUserCV();
      if (Array.isArray(data)) {
        setCvs(data);
      } else if (data) {
        setCvs(data?.files || data?.cvs || data?.data || [data]);
      } else {
        setCvs([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách CV:", error);
      showToast("Không thể tải danh sách CV. Vui lòng thử lại sau.", "error");
    } finally {
      setLoading(false);
    }
  };

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

  const getFileUrl = (cv) => {
    const url = cv.fileUrl || cv.cvFileUrl || cv.url || cv.path || cv.filePath || cv.fileLink || cv.link;
    return getCvUrl(url || "");
  };

  const getFileName = (cv) => {
    return cv.fileName || cv.name || cv.originalName || cv.title || "CV của bạn";
  };

  const getFileSizeText = (cv) => {
    const fileSize = cv.size || cv.fileSize || cv.metadata?.size;
    if (!fileSize || typeof fileSize !== "number") return "-";
    return `${(fileSize / 1024 / 1024).toFixed(1)} MB`;
  };

  const getFileUpdateDate = (cv) => {
    const dateValue = cv.updatedAt || cv.modifiedAt || cv.uploadedAt || cv.createdAt || cv.timestamp;
    if (!dateValue) return "-";
    const date = new Date(dateValue);
    return date.toLocaleDateString("vi-VN");
  };

  const handleFile = async (file) => {
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
    try {
      const uploaded = await cvService.uploadCV(file);
      showToast("Tải lên CV thành công!", "success");
      if (uploaded) {
        await fetchCvList();
      }
    } catch (error) {
      console.error("Lỗi upload CV:", error);
      const msg = error?.response?.data?.message || "Không thể tải lên CV. Vui lòng thử lại.";
      showToast(msg, "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cv) => {
    const fileName = getFileName(cv);
    if (!window.confirm(`Bạn có chắc muốn xóa ${fileName}?`)) return;

    try {
      const id = cv.id || cv.cvId || cv.fileId || cv._id;
      if (!id) {
        throw new Error("Không tìm thấy ID file CV để xóa.");
      }
      await cvService.deleteCV(id);
      showToast("Xóa CV thành công.", "success");
      await fetchCvList();
    } catch (error) {
      console.error("Lỗi xóa CV:", error);
      const msg = error?.response?.data?.message || "Không thể xóa CV. Vui lòng thử lại.";
      showToast(msg, "error");
    }
  };

  const renderCvItem = (cv) => {
    const fileUrl = getFileUrl(cv);
    const fileName = getFileName(cv);
    return (
      <Box
        key={cv.id || cv.cvId || cv.fileId || cv._id || fileName}
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
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "#e0f2fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FilePresent sx={{ color: "#0ea5e9", fontSize: 28 }} />
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Button
              component="a"
              href={fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                p: 0,
                minWidth: 0,
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 800,
                color: "#0f172a",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
              {getFileUpdateDate(cv)} • {getFileSizeText(cv)}
            </Typography>
          </Box>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Visibility />}
            component="a"
            href={fileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!fileUrl}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Xem CV
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Download />}
            component="a"
            href={fileUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            download={fileName}
            disabled={!fileUrl}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Tải về
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => handleDelete(cv)}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Xóa
          </Button>
        </Stack>
      </Box>
    );
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

        <Stack spacing={2.5} mb={4}>
          {loading ? (
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={24} />
            </Paper>
          ) : cvs.length > 0 ? (
            cvs.map((cv) => renderCvItem(cv))
          ) : (
            <Paper
              sx={{
                p: 4,
                borderRadius: 3,
                border: "1px solid #e2e8f0",
                bgcolor: "#f8fafc",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Bạn chưa tải lên CV đính kèm nào. Hãy chọn file hoặc kéo thả vào khu vực bên dưới.
              </Typography>
            </Paper>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />

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
            cursor: uploading ? "default" : "pointer",
            bgcolor: dragActive ? "#eff6ff" : "#f8fafc",
            transition: "all 0.2s ease",
            position: "relative",
            "&:hover": {
              borderColor: uploading ? "#cbd5e1" : "#3b82f6",
              bgcolor: uploading ? "#f8fafc" : "#eff6ff",
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
              {uploading ? <CircularProgress size={28} color="inherit" /> : <CloudUpload fontSize="large" />}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={800} color="#334155" mb={0.5}>
                {uploading
                  ? "Đang tải tệp lên..."
                  : "Kéo thả file CV của bạn vào đây hoặc click để duyệt file"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Hỗ trợ tệp: PDF, DOC, DOCX • Dung lượng không quá 5MB
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Paper>

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
