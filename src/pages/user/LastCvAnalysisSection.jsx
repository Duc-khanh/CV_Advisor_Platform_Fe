import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, Button, Grid, Stack, Chip,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  TrendingUp as TrendingUpIcon,
  WorkOutline as WorkIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import AIAnalysisCard from './AIAnalysisCard';
import { loadCvAnalysis, clearCvAnalysis, getCurrentUserId } from '../../services/cvAnalysisStorage';

/**
 * LastCvAnalysisSection
 * ─────────────────────────────────────────────────────────────────
 * Hiển thị kết quả phân tích CV gần nhất của người dùng hiện tại.
 *
 * Logic:
 * - Nếu chưa đăng nhập → hiển thị CTA "Phân tích CV ngay"
 * - Nếu đã đăng nhập nhưng chưa từng phân tích → hiển thị CTA
 * - Nếu đã đăng nhập và có kết quả → hiển thị kết quả của TÀI KHOẢN đó
 */
export default function LastCvAnalysisSection() {
  const navigate = useNavigate();
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const userId = getCurrentUserId();
    setIsLoggedIn(!!userId);

    // Đọc kết quả phân tích theo userId
    const data = loadCvAnalysis();
    setLastAnalysis(data || null);
  }, []);

  const handleClear = () => {
    clearCvAnalysis();
    setLastAnalysis(null);
  };

  /* ── Chưa đăng nhập hoặc chưa phân tích CV ── */
  if (!lastAnalysis) {
    return (
      <Container maxWidth={false} sx={{ mt: -8, mb: 12, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: 6,
            border: '1px solid #e2e8f0',
            bgcolor: '#ffffff',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={4}>
            {/* Icon */}
            <Box sx={{
              width: 80, height: 80, flexShrink: 0,
              borderRadius: 4,
              background: 'linear-gradient(135deg,#667eea,#764ba2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(102,126,234,0.3)',
            }}>
              <AIIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Box>

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5, color: '#1e293b' }}>
                Nhận gợi ý việc làm chính xác hơn bằng AI
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {isLoggedIn
                  ? 'Tải lên CV để hệ thống AI phân tích kỹ năng và đề xuất công việc phù hợp nhất với bạn.'
                  : 'Đăng nhập và phân tích CV để nhận gợi ý việc làm cá nhân hóa từ AI.'}
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<AIIcon />}
                  onClick={() => navigate(isLoggedIn ? '/user/cv-analysis' : '/login')}
                  sx={{
                    textTransform: 'none', fontWeight: 700, px: 3, py: 1.2, borderRadius: 50,
                    background: 'linear-gradient(135deg,#667eea,#764ba2)',
                    boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                    '&:hover': { boxShadow: '0 6px 20px rgba(102,126,234,0.5)' },
                  }}
                >
                  {isLoggedIn ? 'Phân tích CV ngay' : 'Đăng nhập để phân tích'}
                </Button>
                {!isLoggedIn && (
                  <Button variant="outlined" onClick={() => navigate('/register')}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 50 }}>
                    Tạo tài khoản
                  </Button>
                )}
              </Stack>
            </Box>

            {/* Feature chips */}
            <Stack spacing={1} sx={{ flexShrink: 0, display: { xs: 'none', lg: 'flex' } }}>
              {['Phân tích kỹ năng AI', 'Gợi ý việc làm phù hợp', 'Điểm mạnh & điểm yếu'].map((f) => (
                <Chip key={f} label={f} size="small"
                  icon={<TrendingUpIcon />}
                  sx={{ bgcolor: '#f0f4ff', color: '#4338ca', fontWeight: 600, borderRadius: 50 }} />
              ))}
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  /* ── Đã có kết quả phân tích ── */
  const createdDate = lastAnalysis.createdAt
    ? new Date(lastAnalysis.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  return (
    <Container maxWidth={false} sx={{ mt: -8, mb: 12, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 6,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Header bar */}
        <Box sx={{
          px: 4, py: 2.5,
          background: 'linear-gradient(135deg,#667eea,#764ba2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AIIcon sx={{ color: '#fff', fontSize: 22 }} />
            <Box>
              <Typography fontWeight={800} color="#fff" variant="subtitle1">
                Kết quả phân tích CV gần nhất
              </Typography>
              {createdDate && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Phân tích ngày {createdDate}
                </Typography>
              )}
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button size="small" startIcon={<RefreshIcon />}
              onClick={() => navigate('/user/cv-analysis')}
              sx={{
                color: '#fff', borderColor: 'rgba(255,255,255,0.5)',
                textTransform: 'none', fontWeight: 600, border: '1px solid',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', borderColor: '#fff' },
              }}>
              Phân tích lại
            </Button>
            <Button size="small" color="error" variant="contained"
              onClick={handleClear}
              sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: 'rgba(255,80,80,0.4)' }, boxShadow: 'none' }}>
              Xoá
            </Button>
          </Stack>
        </Box>

        {/* Body */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* AI score card */}
          <AIAnalysisCard {...lastAnalysis.analysis} />

          {/* Summary */}
          {lastAnalysis.summary && (
            <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: '#f8f9ff', border: '1px solid #e8eaf6' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <TrendingUpIcon sx={{ color: '#667eea', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#4a3f9f">
                  Tóm tắt phân tích
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {lastAnalysis.summary}
              </Typography>
            </Paper>
          )}

          {/* Recommended jobs */}
          {lastAnalysis.recommendedJobs?.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <WorkIcon sx={{ color: '#667eea' }} />
                <Typography variant="h6" fontWeight={800} color="#1e293b">
                  Việc làm đề xuất cho bạn
                </Typography>
                <Chip label={`${Math.min(lastAnalysis.recommendedJobs.length, 4)} gợi ý`}
                  size="small" sx={{ bgcolor: '#f0f4ff', color: '#4338ca', fontWeight: 600 }} />
              </Stack>

              <Grid container spacing={2}>
                {lastAnalysis.recommendedJobs.slice(0, 4).map((job, idx) => {
                  const jobId = job.jobId || job.id;
                  return (
                    <Grid item xs={12} sm={6} key={jobId || idx}>
                      <Paper
                        elevation={0}
                        onClick={() => jobId && navigate(`/user/job/${jobId}`)}
                        sx={{
                          p: 2.5, borderRadius: 3,
                          border: '1px solid #e8eaf6',
                          bgcolor: '#fafbff',
                          cursor: jobId ? 'pointer' : 'default',
                          transition: 'all 0.25s',
                          '&:hover': jobId ? {
                            borderColor: '#667eea',
                            boxShadow: '0 6px 20px rgba(102,126,234,0.12)',
                            transform: 'translateY(-2px)',
                          } : {},
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
                            <Typography fontWeight={700} sx={{
                              mb: 0.25, color: '#1e293b',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {job.title || job.jobTitle || 'Công việc đề xuất'}
                            </Typography>
                            <Typography variant="body2" color="#667eea" fontWeight={600} sx={{
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {job.companyName || job.company || 'Công ty chưa xác định'}
                            </Typography>
                            {job.location && (
                              <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
                                📍 {job.location}
                              </Typography>
                            )}
                          </Box>
                          {job.salaryRange && (
                            <Typography variant="caption" fontWeight={700} color="success.main"
                              sx={{ flexShrink: 0, bgcolor: '#f0fdf4', px: 1, py: 0.25, borderRadius: 1 }}>
                              {job.salaryRange}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>

              {lastAnalysis.recommendedJobs.length > 4 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="text" onClick={() => navigate('/user/cv-analysis')}
                    sx={{ textTransform: 'none', color: '#667eea', fontWeight: 600 }}>
                    Xem thêm {lastAnalysis.recommendedJobs.length - 4} gợi ý khác →
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
