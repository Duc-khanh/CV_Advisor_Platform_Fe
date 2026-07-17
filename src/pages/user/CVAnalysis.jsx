import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  LinearProgress,
  Chip,
  Divider,
  Container,
} from "@mui/material";
import {
  CloudUpload,
  Search,
  PictureAsPdf,
  CheckCircle,
  InfoOutlined,
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
      const message =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        "Phân tích CV thất bại.";

      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ py: 6, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              textAlign: "center",
              mb: 2.5,
              py: { xs: 2.2, md: 2.8 },
              px: 3,
              borderRadius: "0 0 28px 28px",
              background:
                "linear-gradient(135deg, #f8faff 0%, #ffffff 45%, #eff6ff 100%)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: { xs: 18, md: 90 },
                top: { xs: 18, md: 24 },
                width: { xs: 52, md: 70 },
                height: { xs: 52, md: 70 },
                borderRadius: "20px",
                background: "linear-gradient(135deg, #eff6ff, #bfdbfe)",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                transform: "rotate(-8deg)",
                opacity: 0.9,
              }}
            >
              <PictureAsPdf
                sx={{
                  fontSize: { sm: 30, md: 40 },
                  color: "#3b82f6",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                right: { xs: 18, md: 100 },
                top: { xs: 18, md: 24 },
                width: { xs: 54, md: 72 },
                height: { xs: 54, md: 72 },
                borderRadius: "50%",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.9,
              }}
            >
              <Search
                sx={{
                  fontSize: { sm: 32, md: 44 },
                  color: "#2563eb",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                maxWidth: 650,
                mx: "auto",
              }}
            >
              <Chip
                icon={<AutoAwesome sx={{ color: "#2563eb !important" }} />}
                label="Phân tích CV AI"
                sx={{
                  mb: 1,
                  px: 0.6,
                  height: 28,
                  borderRadius: "999px",
                  bgcolor: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: 800,
                  fontSize: "0.76rem",
                  border: "1px solid #dbeafe",
                }}
              />

              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  lineHeight: 1.08,
                  letterSpacing: "-1px",
                  fontSize: {
                    xs: "1.45rem",
                    sm: "2rem",
                    md: "2.45rem",
                  },
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Phân tích CV bằng AI
              </Typography>

              <Typography
                variant="body1"
                color="#64748b"
                sx={{
                  fontSize: { xs: "0.88rem", md: "0.98rem" },
                  fontWeight: 500,
                  lineHeight: 1.65,
                  maxWidth: 560,
                  mx: "auto",
                  mb: 1.2,
                }}
              >
                Tải lên CV PDF để hệ thống phân tích kỹ năng, điểm mạnh, điểm
                yếu và gợi ý việc làm phù hợp.
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                flexWrap="wrap"
                useFlexGap
                sx={{ mt: 0.5 }}
              >
                <Chip
                  size="small"
                  icon={<CheckCircle />}
                  label="Đánh giá CV"
                  sx={{
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                    height: 30,
                  }}
                />

                <Chip
                  size="small"
                  icon={<AutoAwesome />}
                  label="Phân tích kỹ năng"
                  sx={{
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                    height: 30,
                  }}
                />

                <Chip
                  size="small"
                  icon={<Search />}
                  label="Gợi ý việc làm"
                  sx={{
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    fontWeight: 700,
                    height: 30,
                  }}
                />
              </Stack>
            </Box>
          </Box>

          {/* Upload UI */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: "20px",
              mb: 4,
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={2.5}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  bgcolor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CloudUpload sx={{ color: "#3b82f6" }} />
              </Box>

              <Box>
                <Typography fontWeight={800} color="#0f172a">
                  Upload CV của bạn
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Tải lên file PDF để bắt đầu phân tích
                </Typography>
              </Box>
            </Stack>

            <Button
              component="label"
              fullWidth
              sx={{
                height: 205,
                borderRadius: 3,
                border: "2px dashed #93c5fd",
                bgcolor: "#ffffff",
                textTransform: "none",
                color: "#0f172a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                mb: 2,
                "&:hover": {
                  bgcolor: "#eff6ff",
                  borderColor: "#3b82f6",
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1.5,
                  bgcolor: "#3b82f6",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 0.5,
                }}
              >
                <CloudUpload />
              </Box>

              <Typography fontWeight={800}>Kéo & thả file PDF vào đây</Typography>

              <Typography variant="body2" color="#64748b">
                hoặc
              </Typography>

              <Box
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: "1px solid #93c5fd",
                  color: "#2563eb",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CloudUpload sx={{ fontSize: 18 }} />
                Chọn file PDF
              </Box>

              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={handleFileChange}
              />
            </Button>

            {file && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #e2e8f0",
                  bgcolor: "#f8fafc",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <PictureAsPdf sx={{ color: "#ef4444", fontSize: 28 }} />

                <Typography
                  variant="body2"
                  fontWeight={700}
                  color="#334155"
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {file.name}
                </Typography>

                <Typography variant="caption" color="#64748b">
                  {formatFileSize(file.size)}
                </Typography>

                <CheckCircle sx={{ color: "#22c55e", fontSize: 22 }} />
              </Box>
            )}

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              mb={3}
              flexWrap="wrap"
              useFlexGap
            >
              <InfoOutlined sx={{ fontSize: 16, color: "#64748b" }} />

              <Typography variant="caption" color="#64748b">
                Dung lượng tối đa 5MB
              </Typography>

              <Typography variant="caption" color="#94a3b8">
                •
              </Typography>

              <Typography variant="caption" color="#64748b">
                Định dạng: PDF
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2.5}
              alignItems={{ xs: "stretch", md: "center" }}
            >
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={uploading || !file}
                startIcon={<Search />}
                sx={{
                  height: 48,
                  minWidth: 180,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#2563eb",
                  boxShadow: "0 10px 20px rgba(37,99,235,0.22)",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },
                  "&:disabled": {
                    bgcolor: "#cbd5e1",
                    color: "#ffffff",
                  },
                }}
              >
                {uploading ? "Đang phân tích..." : "Phân tích CV"}
              </Button>

              <Box>
                <Typography fontWeight={800} color="#0f172a" mb={0.5}>
                  Lưu ý:
                </Typography>
                <Typography variant="body2" color="#64748b">
                  File CV phải là PDF. Hệ thống sẽ trích xuất nội dung và gợi ý
                  những vị trí phù hợp dựa trên kỹ năng, kinh nghiệm và mục tiêu
                  nghề nghiệp của bạn.
                </Typography>
              </Box>
            </Stack>

            {uploading && <LinearProgress sx={{ mt: 3, borderRadius: 2 }} />}
          </Paper>

          {result && (
            <Box>
              <AIAnalysisCard {...result} />

              {summary && (
                <Paper
                  sx={{
                    mt: 4,
                    p: 4,
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography variant="h5" fontWeight={800} mb={2}>
                    Tóm tắt phân tích
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {summary}
                  </Typography>
                </Paper>
              )}

              <Paper
                sx={{
                  mt: 4,
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography variant="h5" fontWeight={800} mb={2}>
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
                      gap: 3,
                    }}
                  >
                    {recommendedJobs.slice(0, 4).map((job, idx) => {
                      const jobId = job.jobId || job.id;

                      const companyInitial =
                        job.companyName?.charAt(0)?.toUpperCase() ||
                        job.title?.charAt(0)?.toUpperCase() ||
                        "J";

                      return (
                        <Paper
                          key={jobId || idx}
                          elevation={0}
                          onClick={() =>
                            jobId && navigate(`/job/${jobId}`)
                          }
                          sx={{
                            p: 2.5,
                            borderRadius: 4,
                            border: "1px solid #e2e8f0",
                            bgcolor: "#ffffff",
                            cursor: jobId ? "pointer" : "default",
                            display: "flex",
                            flexDirection: "column",
                            height: 210,
                            overflow: "hidden",
                            transition: "all 0.3s ease",
                            "&:hover": jobId
                              ? {
                                  borderColor: "#2563eb",
                                  transform: "translateY(-5px)",
                                  boxShadow:
                                    "0 20px 25px -5px rgba(0,0,0,0.05)",
                                }
                              : {},
                          }}
                        >
                          <Typography fontWeight={800}>
                            {job.title || job.jobTitle || "Công việc đề xuất"}
                          </Typography>

                          <Typography variant="body2" color="#64748b">
                            {job.companyName || job.company || "Công ty"}
                          </Typography>
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