import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  CloudUpload,
  PictureAsPdf,
  CheckCircle,
  AutoAwesome,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AIAnalysisCard from "./AIAnalysisCard";
import api from "../../services/axios";
import { getPublicJobs } from "../../services/job/publicJobService";
import { useToast } from "../../contexts/ToastContext";
import { saveCvAnalysis } from "../../services/cv/cvAnalysisStorage";

export default function CVAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const showToast = useToast();
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    return `${(size / 1024).toFixed(1)} KB`;
  };

  const extractKeywords = (analysis, summaryText) => {
    const keywordSources = [
      summaryText || "",
      analysis?.strengths?.join(" ") || "",
      analysis?.weaknesses?.join(" ") || "",
      analysis?.missingSkills?.join(" ") || "",
    ];

    const rawText = keywordSources.join(" ").toLowerCase();

    return Array.from(
      new Set(
        rawText
          .replace(/[^a-zA-Z0-9\s]+/g, " ")
          .split(/\s+/)
          .filter((word) => word.length >= 3)
      )
    ).slice(0, 35);
  };

  const scoreJobMatch = (job, keywords) => {
    const text = [
      job.title,
      job.companyName,
      job.location,
      job.jobType,
      job.salaryRange,
      job.candidateRequirements,
      job.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.reduce((score, keyword) => {
      return score + (text.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  };

  const buildRecommendedJobs = (jobs, analysis, summaryText) => {
    if (!jobs?.length) return [];

    const keywords = extractKeywords(analysis, summaryText);

    const scored = jobs.map((job) => ({
      job,
      score: scoreJobMatch(job, keywords),
    }));

    const sorted = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.job);

    if (sorted.length >= 4) return sorted.slice(0, 4);

    return jobs.slice(0, 4);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      showToast("Chỉ cho phép upload file PDF.", "warning");
      setFile(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("File PDF tối đa 5MB.", "warning");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      showToast("Vui lòng chọn file CV PDF trước khi phân tích.", "warning");
      return;
    }

    setUploading(true);
    setResult(null);
    setRecommendedJobs([]);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await api.post("/api/v1/ai/evaluate-cv", formData);
      const data = res.data;

      const analysis = {
        score: Number(data.analysis?.score ?? data.score ?? 0),
        strengths: data.analysis?.strengths ?? data.strengths ?? [],
        weaknesses: data.analysis?.weaknesses ?? data.weaknesses ?? [],
        missingSkills: data.analysis?.missingSkills ?? data.missingSkills ?? [],
      };

      const summaryText = data.analysis?.summary || data.summary || "";

      setResult(analysis);
      setSummary(summaryText);

      setLoadingJobs(true);

      try {
        const jobs = await getPublicJobs();
        const matchedJobs = buildRecommendedJobs(jobs, analysis, summaryText);
        setRecommendedJobs(matchedJobs);

        saveCvAnalysis({
          analysis,
          summary: summaryText,
          recommendedJobs: matchedJobs,
        });
      } finally {
        setLoadingJobs(false);
      }
    } catch (err) {
      const responseData = err.response?.data;
      const rawMessage = typeof responseData?.message === "string"
        ? responseData.message
        : typeof responseData === "string"
          ? responseData
          : err.message || "";
      const normalized = rawMessage.toLowerCase();
      const quotaExceeded =
        err.response?.status === 429 ||
        responseData?.code === "AI_QUOTA_EXCEEDED" ||
        normalized.includes("more credits") ||
        normalized.includes("openrouter_credits") ||
        normalized.includes('"code":402');
      const message = quotaExceeded
        ? "AI đã hết hạn mức sử dụng. Vui lòng nạp thêm credit OpenRouter rồi thử lại."
        : rawMessage && rawMessage.length <= 180
          ? rawMessage
          : "Không thể phân tích CV lúc này. Vui lòng thử lại sau.";

      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  };

  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    if (droppedFile.type !== "application/pdf") {
      showToast("Chỉ cho phép upload file PDF.", "warning");
      return;
    }

    if (droppedFile.size > 5 * 1024 * 1024) {
      showToast("File PDF tối đa 5MB.", "warning");
      return;
    }

    setFile(droppedFile);
  };

  const handleRemoveFile = (e) => {
    e?.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 2, md: 3 },
        bgcolor: "#f8fafc",
        minHeight: result ? "100vh" : "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: result ? "flex-start" : "center",
      }}
    >
      <Container maxWidth="xl">
        {/* ================= 1. HERO HEADER ================= */}
        <Box sx={{ textAlign: "center", maxWidth: "600px", mx: "auto" }}>
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.6,
              bgcolor: "#eff6ff",
              color: "#1D61F2",
              px: 1.5,
              py: 0.5,
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            <AutoAwesome sx={{ fontSize: 14, color: "#1D61F2" }} />
            <span>Phân tích CV AI</span>
          </Box>

          {/* Tiêu đề H1 */}
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: "1.65rem", sm: "1.875rem" },
              fontWeight: 700,
              color: "#0f172a",
              mt: 1,
              mb: 0,
              lineHeight: 1.25,
            }}
          >
            Phân tích CV bằng AI
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              color: "#64748b",
              maxWidth: "36rem",
              mx: "auto",
              mt: 1,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            Tải lên CV để hệ thống tự động bóc tách kỹ năng, phát hiện điểm mạnh - điểm yếu và gợi ý công việc phù hợp.
          </Typography>

          {/* 3 tags dạng text inline */}
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              mt: 1,
              fontWeight: 500,
            }}
          >
            Đánh giá chuẩn ATS • Phân tích kỹ năng • Gợi ý việc làm phù hợp
          </Typography>
        </Box>

        {/* ================= 2. KHU VỰC TẢI LÊN CV (UPLOAD BOX) ================= */}
        <Paper
          elevation={0}
          sx={{
            maxWidth: "42rem",
            width: "100%",
            mx: "auto",
            mt: 2.5,
            p: { xs: 2.5, sm: 3.5 },
            bgcolor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            boxSizing: "border-box",
          }}
        >
          {/* Vùng Dropzone (Kéo thả file) */}
          <Box
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              border: isDragging ? "2px dashed #1D61F2" : "2px dashed #bfdbfe",
              bgcolor: isDragging ? "#eff6ff" : "rgba(239, 246, 255, 0.3)",
              borderRadius: "12px",
              p: { xs: 2.5, sm: 3.5 },
              textAlign: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#1D61F2",
                bgcolor: "rgba(239, 246, 255, 0.5)",
              },
            }}
          >
            {!file ? (
              <Box>
                <CloudUpload sx={{ fontSize: 40, color: "#1D61F2", mb: 0.5 }} />
                <Typography sx={{ fontSize: "0.925rem", fontWeight: 600, color: "#334155" }}>
                  Kéo & thả file PDF vào đây hoặc
                </Typography>

                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    mt: 1.2,
                    px: 2,
                    py: 0.8,
                    bgcolor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  Chọn file từ máy tính
                </Box>

                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: "0.75rem",
                    color: "#94a3b8",
                    mt: 1.5,
                  }}
                >
                  Hỗ trợ định dạng PDF (tối đa 5MB)
                </Typography>
              </Box>
            ) : (
              /* Trạng thái đã chọn file */
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  bgcolor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "10px",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                  <PictureAsPdf sx={{ color: "#ef4444", fontSize: 30, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0, textAlign: "left" }}>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {formatFileSize(file.size)} • Định dạng PDF
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle sx={{ color: "#16a34a", fontSize: 20 }} />
                  <Button
                    size="small"
                    onClick={handleRemoveFile}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      color: "#dc2626",
                      p: 0.5,
                      minWidth: "auto",
                      "&:hover": { bgcolor: "#fee2e2" },
                    }}
                  >
                    Đổi file
                  </Button>
                </Stack>
              </Box>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              hidden
              onChange={handleFileChange}
            />
          </Box>

          {/* ================= 3. ACTION FOOTER ================= */}
          <Button
            variant="contained"
            onClick={handleAnalyze}
            disabled={uploading || !file}
            sx={{
              width: "100%",
              height: 48,
              bgcolor: "#1D61F2",
              color: "#ffffff",
              fontWeight: 600,
              fontSize: "0.95rem",
              borderRadius: "12px",
              textTransform: "none",
              mt: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "#1550c7",
              },
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
                bgcolor: "#1D61F2",
                color: "#ffffff",
              },
            }}
          >
            {uploading ? (
              <Stack direction="row" spacing={1} alignItems="center">
                <CircularProgress size={18} color="inherit" />
                <span>Đang phân tích CV...</span>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1} alignItems="center">
                <AutoAwesome sx={{ fontSize: 18 }} />
                <span>Bắt đầu phân tích CV</span>
              </Stack>
            )}
          </Button>

          {/* Lưu ý bảo mật */}
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              textAlign: "center",
              mt: 1.5,
              display: "block",
            }}
          >
            File của bạn được bảo mật tuyệt đối và chỉ sử dụng cho mục đích phân tích năng lực cá nhân.
          </Typography>
        </Paper>

        {/* ================= 4. KẾT QUẢ PHÂN TÍCH (NẾU CÓ) ================= */}
        {result && (
          <Box sx={{ mt: 4 }}>
            <AIAnalysisCard {...result} />

            {summary && (
              <Paper
                elevation={0}
                sx={{
                  mt: 3,
                  p: 3.5,
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                }}
              >
                <Typography variant="h6" fontWeight={800} mb={1.5} color="#0f172a">
                  Tóm tắt phân tích
                </Typography>
                <Typography variant="body2" color="#475569" lineHeight={1.7}>
                  {summary}
                </Typography>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 3.5,
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
              }}
            >
              <Typography variant="h6" fontWeight={800} mb={2} color="#0f172a">
                Gợi ý việc làm phù hợp
              </Typography>

              {loadingJobs ? (
                <Typography color="text.secondary">
                  Đang tải gợi ý việc làm từ hệ thống...
                </Typography>
              ) : recommendedJobs.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(4, 1fr)",
                    },
                    gap: 2.5,
                  }}
                >
                  {recommendedJobs.slice(0, 4).map((job, idx) => {
                    const jobId = job.jobId || job.id;

                    return (
                      <Paper
                        key={jobId || idx}
                        elevation={0}
                        onClick={() => jobId && navigate(`/job/${jobId}`)}
                        sx={{
                          p: 2.5,
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          bgcolor: "#ffffff",
                          cursor: jobId ? "pointer" : "default",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 130,
                          transition: "all 0.2s ease",
                          "&:hover": jobId
                            ? {
                                borderColor: "#1D61F2",
                                transform: "translateY(-3px)",
                                boxShadow: "0 10px 20px -5px rgba(29, 97, 242, 0.1)",
                              }
                            : {},
                        }}
                      >
                        <Box>
                          <Typography fontWeight={700} color="#0f172a" fontSize="0.95rem">
                            {job.title || job.jobTitle || "Công việc đề xuất"}
                          </Typography>
                          <Typography variant="body2" color="#64748b" mt={0.5}>
                            {job.companyName || job.company || "Công ty"}
                          </Typography>
                        </Box>
                        {job.location && (
                          <Typography variant="caption" color="#94a3b8" mt={1}>
                            {job.location}
                          </Typography>
                        )}
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  Chưa có gợi ý việc làm từ dữ liệu hệ thống.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}
