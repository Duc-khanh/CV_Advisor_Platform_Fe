/**
 * InterviewFeedbackModal.jsx
 * Modal nhập kết quả đánh giá sau buổi phỏng vấn
 */
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  CircularProgress,
  Avatar,
  Alert,
} from '@mui/material';
import {
  Close,
  RateReview,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { FEEDBACK_NEXT_ACTION_OPTIONS } from '../../../features/interviews/interviewConstants';
import { formatDateTime } from '../../../features/interviews/interviewHelpers';

const EMPTY_FEEDBACK = {
  rating: 3,
  result: 'PASSED',
  feedback: '',
  strengths: '',
  improvements: '',
  nextAction: 'NEXT_ROUND',
};

export default function InterviewFeedbackModal({
  open,
  onClose,
  onSubmit,
  interview = null,
  saving = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FEEDBACK);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (interview) {
        setFormData({
          rating: interview.rating ? Math.round(interview.rating / 2) : 3,
          result: interview.result || (interview.status === 'COMPLETED' ? 'PASSED' : 'PASSED'),
          feedback: interview.feedback || '',
          strengths: interview.strengths || '',
          improvements: interview.improvements || '',
          nextAction: interview.nextAction || 'NEXT_ROUND',
        });
      } else {
        setFormData(EMPTY_FEEDBACK);
      }
    }
  }, [open, interview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.feedback.trim()) {
      setError('Vui lòng nhập nhận xét / đánh giá tổng quan về ứng viên.');
      return;
    }

    try {
      const payload = {
        result: formData.result,
        rating: formData.rating * 2, // Quy đổi thang điểm 10
        feedback: formData.feedback,
        strengths: formData.strengths,
        improvements: formData.improvements,
        nextAction: formData.nextAction,
        status: 'COMPLETED',
      };
      await onSubmit(interview.id, payload);
    } catch (err) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu đánh giá.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          bgcolor: '#fafafa',
          borderBottom: '1px solid #f1f5f9',
          px: { xs: 2.5, sm: 3.5 },
          py: 2.2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
              }}
            >
              <RateReview sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="#1e293b" fontSize="1.15rem">
                Đánh giá kết quả phỏng vấn
              </Typography>
              <Typography variant="caption" color="#64748b" display="block">
                Ghi nhận nhận xét và xếp loại cho ứng viên
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#94a3b8', '&:hover': { bgcolor: '#f1f5f9' } }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Body */}
      <DialogContent sx={{ px: { xs: 2.5, sm: 3.5 }, py: 3, bgcolor: '#ffffff' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Thông tin ứng viên */}
        {interview && (
          <Box
            sx={{
              p: 2,
              mb: 3,
              bgcolor: '#f8fafc',
              borderRadius: 2.5,
              border: '1px solid #e2e8f0',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: '#0ea5e9',
                  width: 44,
                  height: 44,
                  fontWeight: 700,
                }}
              >
                {interview.candidateName ? interview.candidateName.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} color="#1e293b">
                  {interview.candidateName}
                </Typography>
                <Typography variant="body2" color="#64748b">
                  Vị trí: <strong>{interview.jobTitle || '—'}</strong> • {interview.round || interview.roundName || 'Vòng 1'}
                </Typography>
                <Typography variant="caption" color="#94a3b8">
                  Thời gian: {formatDateTime(interview.scheduledAt || interview.startTime)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}

        <Stack spacing={2.5}>
          {/* Kết quả chung */}
          <FormControl fullWidth size="small">
            <InputLabel>Kết quả phỏng vấn</InputLabel>
            <Select
              value={formData.result}
              label="Kết quả phỏng vấn"
              onChange={(e) => handleChange('result', e.target.value)}
            >
              <MenuItem value="PASSED">
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircle sx={{ color: '#16a34a', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={600} color="#16a34a">
                    ĐẠT (Passed)
                  </Typography>
                </Stack>
              </MenuItem>
              <MenuItem value="FAILED">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Cancel sx={{ color: '#ef4444', fontSize: 18 }} />
                  <Typography variant="body2" fontWeight={600} color="#ef4444">
                    CHƯA ĐẠT (Failed)
                  </Typography>
                </Stack>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Đánh giá số sao */}
          <Box>
            <Typography variant="caption" color="#475569" fontWeight={700} textTransform="uppercase" display="block" mb={0.5}>
              Điểm đánh giá ({formData.rating * 2}/10 điểm)
            </Typography>
            <Rating
              value={formData.rating}
              onChange={(_, val) => handleChange('rating', val || 1)}
              size="large"
              sx={{ color: '#f59e0b' }}
            />
          </Box>

          {/* Nhận xét tổng quan */}
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Nhận xét tổng quan & Đánh giá năng lực *"
            placeholder="Đánh giá về kỹ năng chuyên môn, thái độ, tư duy giao tiếp và giải quyết vấn đề..."
            value={formData.feedback}
            onChange={(e) => handleChange('feedback', e.target.value)}
          />

          {/* Điểm mạnh */}
          <TextField
            fullWidth
            size="small"
            label="Điểm mạnh nổi bật"
            placeholder="VD: Nắm vững kiến thức nền tảng, phản ứng nhanh nhạy..."
            value={formData.strengths}
            onChange={(e) => handleChange('strengths', e.target.value)}
          />

          {/* Điểm cần cải thiện */}
          <TextField
            fullWidth
            size="small"
            label="Điểm cần cải thiện / Lưu ý"
            placeholder="VD: Cần trau dồi thêm ngoại ngữ, kỹ năng thuyết trình..."
            value={formData.improvements}
            onChange={(e) => handleChange('improvements', e.target.value)}
          />

          {/* Hành động tiếp theo */}
          <FormControl fullWidth size="small">
            <InputLabel>Bước tiếp theo</InputLabel>
            <Select
              value={formData.nextAction}
              label="Bước tiếp theo"
              onChange={(e) => handleChange('nextAction', e.target.value)}
            >
              {FEEDBACK_NEXT_ACTION_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2.5, sm: 3.5 },
          py: 2.2,
          bgcolor: '#fafafa',
          borderTop: '1px solid #f1f5f9',
          gap: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={saving}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#cbd5e1',
            color: '#64748b',
            px: 2.5,
            '&:hover': { bgcolor: '#f1f5f9' },
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
            px: 3.5,
            py: 1,
            boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
              boxShadow: '0 6px 16px rgba(14,165,233,0.35)',
            },
          }}
        >
          {saving ? 'Đang lưu...' : 'Lưu kết quả đánh giá'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
