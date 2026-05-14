import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Alert,
  LinearProgress,
  Chip,
  Grid,
  Divider,
} from "@mui/material";
import { CloudUpload, Search, Star } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/UserLayout";
import AIAnalysisCard from "./AIAnalysisCard";
import api from "../../services/axios";
import { getPublicJobs } from "../../services/publicJobService";
import { useToast } from "../../contexts/ToastContext";
import { saveCvAnalysis } from "../../services/cvAnalysisStorage";

export default function CVAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const showToast = useToast();
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

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
    const text = [job.title, job.companyName, job.location, job.jobType, job.salaryRange, job.candidateRequirements, job.description]
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

    if (sorted.length >= 4) {
      return sorted.slice(0, 6);
    }

    return jobs.slice(0, 6);
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

        // Lưu theo userId – dùng helper để tránh lẫn dữ liệu giữa các tài khoản
        saveCvAnalysis({
          analysis,
          summary: summaryText,
          recommendedJobs: matchedJobs,
        });
      } finally {
        setLoadingJobs(false);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || err.message || "Phân tích CV thất bại.";
      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <UserLayout>
      <Box sx={{ py: 2 }}>
        <Typography variant="h4" fontWeight={800} mb={1}>
          Phân tích CV bằng AI
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Tải lên file CV định dạng PDF để hệ thống phân tích kỹ năng, điểm mạnh, điểm yếu và gợi ý những công việc phù hợp nhất.
        </Typography>

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4, border: "1px solid #e2e8f0" }}>
          <Stack spacing={3}>
            <Box>
              <Typography fontWeight={700} mb={1}>
                Upload CV của bạn
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                sx={{ textTransform: "none", minWidth: 180 }}
              >
                Chọn file PDF
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  File đã chọn: <strong>{file.name}</strong> - {(file.size / 1024).toFixed(1)} KB
                </Typography>
              )}
            </Box>

            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAnalyze}
                disabled={uploading}
                startIcon={<Search />}
                sx={{ textTransform: "none", fontWeight: 700 }}
              >
                {uploading ? "Đang phân tích..." : "Phân tích CV"}
              </Button>
              {uploading && <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />}
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Lưu ý:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                File CV phải là PDF. Hệ thống sẽ trích xuất nội dung và gợi ý những vị trí phù hợp dựa trên kỹ năng, kinh nghiệm và mục tiêu nghề nghiệp của bạn.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {result && (
          <Box>
            <AIAnalysisCard {...result} />

            {summary && (
              <Paper sx={{ mt: 4, p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
                <Typography variant="h5" fontWeight={800} mb={2}>
                  Tóm tắt phân tích
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {summary}
                </Typography>
              </Paper>
            )}

            <Paper sx={{ mt: 4, p: 4, borderRadius: 4, border: "1px solid #e2e8f0" }}>
              <Typography variant="h5" fontWeight={800} mb={2}>
                Gợi ý việc làm phù hợp
              </Typography>

              {loadingJobs ? (
                <Typography color="text.secondary">Đang tải gợi ý việc làm từ hệ thống...</Typography>
              ) : recommendedJobs.length > 0 ? (
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(4,1fr)' },
                  gap: 3,
                }}>
                  {recommendedJobs.map((job, idx) => {
                    const jobId = job.jobId || job.id;
                    const companyInitial = job.companyName?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase() || 'J';
                    return (
                      <Paper
                        key={jobId || idx}
                        elevation={0}
                        onClick={() => jobId && navigate(`/user/job/${jobId}`)}
                        sx={{
                          p: 2.5, borderRadius: 4,
                          border: '1px solid #e2e8f0',
                          bgcolor: '#ffffff',
                          cursor: jobId ? 'pointer' : 'default',
                          display: 'flex', flexDirection: 'column',
                          height: 110,           // ← chiều cao cố định như UserHome
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': jobId ? {
                            borderColor: '#4f46e5',
                            transform: 'translateY(-5px)',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
                          } : {},
                        }}
                      >
                        {/* Header: avatar + title + company */}
                        <Stack direction="row" spacing={2} alignItems="flex-start" mb={1.5}>
                          <Box sx={{
                            width: 44, height: 44, flexShrink: 0,
                            borderRadius: 2, bgcolor: '#eef2ff', color: '#4338ca',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '1rem',
                            boxShadow: '0 2px 8px rgba(79,70,229,0.12)',
                          }}>
                            {companyInitial}
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            {/* Tên việc làm – tối đa 2 dòng, chiều cao cố định */}
                            <Typography fontWeight={700} sx={{
                              fontSize: '0.92rem', lineHeight: 1.35,
                              height: '2.5rem',           // ← 2 dòng × line-height
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              color: '#1e293b',
                              wordBreak: 'break-word',
                            }}>
                              {job.title || job.jobTitle || 'Công việc đề xuất'}
                            </Typography>
                            {/* Công ty – 1 dòng ellipsis */}
                            <Typography variant="body2" sx={{
                              mt: 0.25, color: '#64748b',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {job.companyName || job.company || '\u00A0'}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Chips */}
                        <Stack direction="row" spacing={1} sx={{ mb: 1.5, overflow: 'hidden' }}>
                          <Chip
                            label={job.location ? job.location.split(',').pop().trim() : 'Toàn quốc'}
                            size="small"
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0, maxWidth: 120 }}
                          />
                          <Chip
                            label={job.jobType || 'Toàn thời gian'}
                            size="small"
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0 }}
                          />
                        </Stack>

                        {/* Salary + Button – luôn ở đáy card */}
                        <Box sx={{ mt: 'auto' }}>
                          <Divider sx={{ mb: 1.5, borderColor: '#f1f5f9' }} />
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography fontWeight={800} sx={{
                              color: '#10b981', fontSize: '0.92rem',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              maxWidth: 'calc(100% - 80px)',
                            }}>
                              {job.salaryRange || 'Thỏa thuận'}
                            </Typography>
                            <Button
                              size="small" variant="contained" disableElevation
                              onClick={(e) => { e.stopPropagation(); if (jobId) navigate(`/user/job/${jobId}`); }}
                              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.75rem', px: 1.5, flexShrink: 0 }}
                            >
                              Chi tiết
                            </Button>
                          </Stack>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>
              ) : (
                <Typography color="text.secondary">
                  Chưa có gợi ý việc làm từ dữ liệu hệ thống. Vui lòng thử lại hoặc cập nhật CV và hồ sơ.
                </Typography>
              )}
            </Paper>
          </Box>
        )}
      </Box>
    </UserLayout>
  );
}
