import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Paper, Typography, Button, IconButton, Tooltip, Stack, Chip, Collapse,
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  TrendingUp as TrendingUpIcon,
  WorkOutline as WorkIcon,
  ReplayRounded as RefreshIcon,
  DeleteOutlineRounded as DeleteIcon,
  UnfoldMoreRounded as ArrowDownIcon,
  UnfoldLessRounded as ArrowUpIcon,
} from '@mui/icons-material';
import AIAnalysisCard from './AIAnalysisCard';
import { loadCvAnalysis, clearCvAnalysis, getCurrentUserId } from '../../services/cv/cvAnalysisStorage';

export default function LastCvAnalysisSection() {
  const navigate = useNavigate();
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const userId = getCurrentUserId();
    setIsLoggedIn(!!userId);

    const data = loadCvAnalysis();
    setLastAnalysis(data || null);
  }, []);

  const handleClear = () => {
    clearCvAnalysis();
    setLastAnalysis(null);
  };

  if (!lastAnalysis) {
    return (
      <Container maxWidth={false} sx={{ mt: -8, mb: 4, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: 6,

            bgcolor: '#ffffff',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={4}>
            {/* Icon */}
            <Box sx={{
              width: 80, height: 80, flexShrink: 0,
              borderRadius: 4,
              background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(37,99,235,0.3)',
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
                  onClick={() => navigate(isLoggedIn ? '/cv-analysis' : '/login')}
                  sx={{
                    textTransform: 'none', fontWeight: 700, px: 3, py: 1.2, borderRadius: 50,
                    background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                    boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
                    '&:hover': { boxShadow: '0 6px 20px rgba(37,99,235,0.5)' },
                  }}
                >
                  {isLoggedIn ? 'Phân tích CV ngay' : 'Đăng nhập để phân tích'}
                </Button>
                {!isLoggedIn && (
                  <Button variant="text" onClick={() => navigate('/register')}
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
                  sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600, borderRadius: 50 }} />
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

  const analysisScore = lastAnalysis.analysis?.score ?? lastAnalysis.analysis?.overallScore ?? null;

  return (
    <Container maxWidth={false} sx={{ mt: -8, mb: 4, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 6,

          bgcolor: '#ffffff',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        {/* Header bar */}
        <Box
          sx={{
            px: { xs: 2.5, md: 4 },
            py: 2,
            background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 2,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={(e) => {
            if (e.target.closest('button')) return;
            setIsCollapsed(prev => !prev);
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" gap={1}>
            <Box sx={{
              width: 38, height: 38, borderRadius: 2.5,
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <AIIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography fontWeight={800} color="#fff" variant="subtitle1" sx={{ lineHeight: 1.3 }}>
                Kết quả phân tích CV gần nhất
              </Typography>
              {createdDate && (
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block' }}>
                  Phân tích ngày {createdDate}
                </Typography>
              )}
            </Box>

            {/* Score Badge */}
            {analysisScore !== null && (
              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.8, py: 0.5,
                borderRadius: 50,
                bgcolor: 'rgba(255, 255, 255, 0.2)',

                backdropFilter: 'blur(8px)',
              }}>
                <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: 800 }}>
                  Điểm CV: {analysisScore}/100
                </Typography>
                <Chip
                  label={analysisScore >= 80 ? 'Rất tốt' : analysisScore >= 65 ? 'Khá tốt' : 'Cần cải thiện'}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: '#ffffff',
                    color: analysisScore >= 80 ? '#16a34a' : analysisScore >= 65 ? '#2563eb' : '#ea580c',
                  }}
                />
              </Box>
            )}
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'flex-end', md: 'flex-start' } }}>
            <Tooltip title={isCollapsed ? 'Mở rộng kết quả' : 'Thu gọn'} arrow>
              <IconButton
                size="small"
                disableRipple
                aria-label={isCollapsed ? 'Mở rộng kết quả' : 'Thu gọn'}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollapsed(prev => !prev);
                }}
                sx={{
                  width: 34,
                  height: 34,
                  color: '#fff',
                  bgcolor: isCollapsed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                  borderRadius: 1.5,
                  outline: 'none',
                  '&:focus, &:focus-visible': { outline: 'none' },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {isCollapsed ? <ArrowDownIcon sx={{ fontSize: 19 }} /> : <ArrowUpIcon sx={{ fontSize: 19 }} />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Phân tích lại" arrow>
              <IconButton
                size="small"
                disableRipple
                aria-label="Phân tích lại"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/cv-analysis');
                }}
                sx={{
                  width: 34,
                  height: 34,
                  color: '#fff',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1.5,
                  outline: 'none',
                  '&:focus, &:focus-visible': { outline: 'none' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                }}
              >
                <RefreshIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Xóa kết quả" arrow>
              <IconButton
                size="small"
                disableRipple
                aria-label="Xóa kết quả"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                sx={{
                  width: 34,
                  height: 34,
                  color: '#fff',
                  bgcolor: 'rgba(239,68,68,0.25)',
                  borderRadius: 1.5,
                  outline: 'none',
                  '&:focus, &:focus-visible': { outline: 'none' },
                  '&:hover': { bgcolor: 'rgba(239,68,68,0.5)' },
                }}
              >
                <DeleteIcon sx={{ fontSize: 19 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Compact Summary Strip when Collapsed */}
        {isCollapsed && (
          <Box sx={{
            px: { xs: 3, md: 4 },
            py: 2.2,
            bgcolor: '#f8fafc',

            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" sx={{ color: '#475569', fontWeight: 600 }}>
                Tóm tắt kết quả:
              </Typography>
              {analysisScore !== null && (
                <Chip
                  label={`${analysisScore}/100 điểm`}
                  size="small"
                  sx={{ bgcolor: '#eff6ff', color: '#1d4ed8', fontWeight: 800, }}
                />
              )}
              {lastAnalysis.analysis?.strengths?.length > 0 && (
                <Chip
                  label={`${lastAnalysis.analysis.strengths.length} điểm mạnh`}
                  size="small"
                  sx={{ bgcolor: '#f0fdf4', color: '#15803d', fontWeight: 600, }}
                />
              )}
              {lastAnalysis.analysis?.weaknesses?.length > 0 && (
                <Chip
                  label={`${lastAnalysis.analysis.weaknesses.length} điểm yếu`}
                  size="small"
                  sx={{ bgcolor: '#fef2f2', color: '#b91c1c', fontWeight: 600, }}
                />
              )}
              {lastAnalysis.recommendedJobs?.length > 0 && (
                <Chip
                  label={`${lastAnalysis.recommendedJobs.length} việc làm phù hợp`}
                  size="small"
                  sx={{ bgcolor: '#f8fafc', color: '#64748b', fontWeight: 600, }}
                />
              )}
            </Stack>


          </Box>
        )}

        {/* Collapsible Body */}
        <Collapse in={!isCollapsed} timeout="auto" unmountOnExit={false}>
          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {/* AI score card */}
            <AIAnalysisCard {...lastAnalysis.analysis} />

            {/* Summary */}
            {lastAnalysis.summary && (
              <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: 3, bgcolor: '#eff6ff', }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <TrendingUpIcon sx={{ color: '#2563eb', fontSize: 18 }} />
                  <Typography variant="subtitle2" fontWeight={700} color="#2563eb">
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
                  <WorkIcon sx={{ color: '#2563eb' }} />
                  <Typography variant="h6" fontWeight={800} color="#1e293b">
                    Việc làm đề xuất cho bạn
                  </Typography>
                  <Chip label={`${Math.min(lastAnalysis.recommendedJobs.length, 4)} gợi ý`}
                    size="small" sx={{ bgcolor: '#eff6ff', color: '#2563eb', fontWeight: 600 }} />
                </Stack>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
                  gap: 2,
                }}>
                  {lastAnalysis.recommendedJobs.slice(0, 4).map((job, idx) => {
                    const jobId = job.jobId || job.id;
                    const companyInitial = job.companyName?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase() || 'J';
                    return (
                      <Paper
                        key={jobId || idx}
                        elevation={0}
                        onClick={() => jobId && navigate(`/job/${jobId}`)}
                        sx={{
                          p: 2.5, borderRadius: 3,

                          bgcolor: '#ffffff',
                          cursor: jobId ? 'pointer' : 'default',
                          display: 'flex', flexDirection: 'column',
                          minHeight: 180,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': jobId ? {

                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(37,99,235,0.1)',
                          } : {},
                        }}
                      >
                        {/* Header */}
                        <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={1.5}>
                          <Box sx={{
                            width: 40, height: 40, flexShrink: 0,
                            borderRadius: 1.5, bgcolor: '#eff6ff', color: '#2563eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, fontSize: '0.95rem',
                          }}>
                            {companyInitial}
                          </Box>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography fontWeight={700} sx={{
                              fontSize: '0.88rem', lineHeight: 1.35,
                              height: '2.35rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              color: '#1e293b',
                              wordBreak: 'break-word',
                            }}>
                              {job.title || job.jobTitle || 'Công việc đề xuất'}
                            </Typography>
                            <Typography variant="body2" sx={{
                              mt: 0.25, color: '#64748b', fontSize: '0.8rem',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            }}>
                              {job.companyName || job.company || '\u00A0'}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Chips */}
                        <Stack direction="row" spacing={1} sx={{ overflow: 'hidden', mb: 1 }}>
                          <Chip
                            label={job.location ? job.location.split(',').pop().trim() : 'Toàn quốc'}
                            size="small"
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0, maxWidth: 110, fontSize: '0.7rem' }}
                          />
                          <Chip
                            label={job.jobType || 'Toàn thời gian'}
                            size="small"
                            sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0, fontSize: '0.7rem' }}
                          />
                        </Stack>

                        {/* Salary at bottom */}
                        <Box sx={{ mt: 'auto' }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Typography fontWeight={800} sx={{
                              color: '#10b981', fontSize: '0.85rem',
                              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                              maxWidth: 'calc(100% - 64px)',
                            }}>
                              {job.salaryRange || 'Thỏa thuận'}
                            </Typography>
                            <Button
                              size="small" variant="contained" disableElevation
                              onClick={(e) => { e.stopPropagation(); if (jobId) navigate(`/job/${jobId}`); }}
                              sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.72rem', px: 1.2, flexShrink: 0, minWidth: 56 }}
                            >
                              Chi tiết
                            </Button>
                          </Stack>
                        </Box>
                      </Paper>
                    );
                  })}
                </Box>

                {lastAnalysis.recommendedJobs.length > 4 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button variant="text" onClick={() => navigate('/cv-analysis')}
                      sx={{ textTransform: 'none', color: '#2563eb', fontWeight: 600 }}>
                      Xem thêm {lastAnalysis.recommendedJobs.length - 4} gợi ý khác →
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Collapse>
      </Paper>
    </Container>
  );
}