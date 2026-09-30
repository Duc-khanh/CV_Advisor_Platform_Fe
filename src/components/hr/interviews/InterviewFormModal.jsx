/**
 * InterviewFormModal.jsx
 * Modal tạo mới / chỉnh sửa lịch phỏng vấn (Dành cho HR)
 * Thiết kế hiện đại, responsive, không bị chèn ép layout.
 */
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  Box,
  IconButton,
  Autocomplete,
  CircularProgress,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Close,
  EventNote,
  Videocam,
  LocationOn,
  Person,
  Schedule,
  Email,
  Notes,
} from '@mui/icons-material';
import {
  INTERVIEW_TYPE_OPTIONS,
  INTERVIEW_ROUND_OPTIONS,
} from '../../../features/interviews/interviewConstants';

const EMPTY_FORM = {
  applicationId: '',
  roundName: 'Vòng 1 - Phỏng vấn Sơ loại HR',
  interviewType: 'ONLINE',
  locationOrLink: '',
  startTime: '',
  endTime: '',
  interviewerName: '',
  interviewerEmail: '',
  notes: '',
};

function toLocalDatetimeInput(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

export default function InterviewFormModal({
  open,
  onClose,
  onSubmit,
  editingItem = null,
  candidates = [],
  saving = false,
}) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [error, setError] = useState('');

  const isEdit = Boolean(editingItem);

  useEffect(() => {
    if (open) {
      setError('');
      if (editingItem) {
        setFormData({
          applicationId: editingItem.applicationId || '',
          roundName: editingItem.roundName || editingItem.round || 'Vòng 1 - Phỏng vấn Sơ loại HR',
          interviewType: editingItem.interviewType || editingItem.type || 'ONLINE',
          locationOrLink: editingItem.locationOrLink || editingItem.meetingLink || editingItem.location || '',
          startTime: toLocalDatetimeInput(editingItem.startTime || editingItem.scheduledAt),
          endTime: toLocalDatetimeInput(editingItem.endTime || editingItem.endAt),
          interviewerName: editingItem.interviewerName || editingItem.interviewer || '',
          interviewerEmail: editingItem.interviewerEmail || '',
          notes: editingItem.notes || '',
        });
        const matched = candidates.find((c) => c.applicationId === editingItem.applicationId);
        setSelectedCandidate(
          matched || {
            applicationId: editingItem.applicationId,
            candidateName: editingItem.candidateName,
            jobTitle: editingItem.jobTitle,
            email: editingItem.candidateEmail,
          }
        );
      } else {
        setFormData(EMPTY_FORM);
        setSelectedCandidate(null);
      }
    }
  }, [open, editingItem, candidates]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartTimeChange = (val) => {
    handleChange('startTime', val);
    if (val) {
      const startD = new Date(val);
      if (!isNaN(startD.getTime())) {
        const endD = new Date(startD.getTime() + 60 * 60 * 1000);
        const pad = (n) => String(n).padStart(2, '0');
        const defaultEnd = `${endD.getFullYear()}-${pad(endD.getMonth() + 1)}-${pad(endD.getDate())}T${pad(endD.getHours())}:${pad(endD.getMinutes())}`;
        if (!formData.endTime || new Date(formData.endTime) <= startD) {
          handleChange('endTime', defaultEnd);
        }
      }
    }
  };

  const handleCandidateSelect = (_, val) => {
    setSelectedCandidate(val);
    handleChange('applicationId', val ? (val.applicationId || val.id) : '');
  };

  const handleSubmit = async () => {
    if (!formData.applicationId) {
      setError('Vui lòng chọn ứng viên cần phỏng vấn.');
      return;
    }
    if (!formData.startTime) {
      setError('Vui lòng chọn thời gian bắt đầu phỏng vấn.');
      return;
    }
    if (formData.endTime && formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('Thời gian kết thúc phải diễn ra sau thời gian bắt đầu.');
      return;
    }

    try {
      const formatToLocal = (dateVal) => {
        if (!dateVal) return null;
        const d = new Date(dateVal);
        if (isNaN(d.getTime())) return null;
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
      };

      const startFormatted = formatToLocal(formData.startTime);
      const endFormatted = formData.endTime ? formatToLocal(formData.endTime) : null;

      const locOrLink = (formData.locationOrLink || '').trim();
      const payload = {
        applicationId: Number(formData.applicationId),
        roundName: formData.roundName,
        round: formData.roundName,
        interviewType: formData.interviewType,
        type: formData.interviewType,
        locationOrLink: locOrLink,
        meetingLink: locOrLink,
        location: locOrLink,
        startTime: startFormatted,
        scheduledAt: startFormatted,
        endTime: endFormatted,
        endAt: endFormatted,
        interviewerName: formData.interviewerName,
        interviewer: formData.interviewerName,
        interviewerEmail: formData.interviewerEmail,
        notes: formData.notes,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err?.message || 'Đã xảy ra lỗi khi lưu lịch phỏng vấn.');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        },
      }}
    >
      {/* Tiêu đề Modal */}
      <DialogTitle
        sx={{
          bgcolor: '#fafafa',
          borderBottom: '1px solid #f1f5f9',
          px: { xs: 2.5, sm: 3.5 },
          py: 2.2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.8} alignItems="center">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
              }}
            >
              <EventNote sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={800} color="#1e293b" fontSize="1.15rem">
                {isEdit ? 'Cập nhật lịch phỏng vấn' : 'Lên lịch phỏng vấn mới'}
              </Typography>
              <Typography variant="caption" color="#64748b" display="block" mt={0.2}>
                Hệ thống sẽ gửi email thông báo chi tiết đến ứng viên và người phỏng vấn
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: '#94a3b8',
              '&:hover': { bgcolor: '#f1f5f9', color: '#334155' },
            }}
          >
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Nội dung Form */}
      <DialogContent sx={{ px: { xs: 2, sm: 3.5 }, py: 3, bgcolor: '#ffffff' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Card 1: Ứng viên & Vòng phỏng vấn */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="#0284c7"
              mb={2}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Person sx={{ fontSize: 18 }} /> 1. Thông tin ứng viên & Vòng tuyển dụng
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Chọn ứng viên - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Autocomplete
                  options={candidates}
                  disabled={isEdit}
                  getOptionLabel={(opt) =>
                    opt
                      ? `${opt.candidateName || 'Ứng viên'} - ${opt.jobTitle || 'Vị trí'} (${opt.email || opt.candidateEmail || 'Chưa có email'})`
                      : ''
                  }
                  value={selectedCandidate}
                  onChange={handleCandidateSelect}
                  renderOption={(props, opt) => (
                    <Box component="li" {...props} key={opt.applicationId || opt.id}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#0ea5e9', fontSize: '0.85rem' }}>
                          {(opt.candidateName || 'U').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600} color="#1e293b">
                            {opt.candidateName}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {opt.jobTitle} • {opt.email || opt.candidateEmail}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Chọn ứng viên cần hẹn lịch *"
                      placeholder="Gõ tên ứng viên hoặc vị trí ứng tuyển..."
                      size="small"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <>
                            <Person sx={{ color: '#0284c7', mr: 1, fontSize: 20 }} />
                            {params.InputProps.startAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Box>

              {/* Vòng phỏng vấn */}
              <FormControl fullWidth size="small">
                <InputLabel>Vòng phỏng vấn</InputLabel>
                <Select
                  value={formData.roundName}
                  label="Vòng phỏng vấn"
                  onChange={(e) => handleChange('roundName', e.target.value)}
                >
                  {INTERVIEW_ROUND_OPTIONS.map((rnd) => (
                    <MenuItem key={rnd} value={rnd}>
                      {rnd}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Hình thức phỏng vấn */}
              <FormControl fullWidth size="small">
                <InputLabel>Hình thức phỏng vấn</InputLabel>
                <Select
                  value={formData.interviewType}
                  label="Hình thức phỏng vấn"
                  onChange={(e) => handleChange('interviewType', e.target.value)}
                >
                  {INTERVIEW_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Link họp hoặc địa điểm - Full width */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <TextField
                  fullWidth
                  size="small"
                  label={
                    formData.interviewType === 'ONLINE'
                      ? 'Link cuộc họp trực tuyến (Google Meet / Zoom / MS Teams)'
                      : 'Địa điểm phỏng vấn trực tiếp (Phòng họp / Văn phòng)'
                  }
                  placeholder={
                    formData.interviewType === 'ONLINE'
                      ? 'https://meet.google.com/abc-defg-hij'
                      : 'Tầng 3, Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM'
                  }
                  value={formData.locationOrLink}
                  onChange={(e) => handleChange('locationOrLink', e.target.value)}
                  InputProps={{
                    startAdornment:
                      formData.interviewType === 'ONLINE' ? (
                        <Videocam sx={{ color: '#2563eb', mr: 1, fontSize: 20 }} />
                      ) : (
                        <LocationOn sx={{ color: '#ea580c', mr: 1, fontSize: 20 }} />
                      ),
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Card 2: Thời gian & Người phỏng vấn */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="#2563eb"
              mb={2}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Schedule sx={{ fontSize: 18 }} /> 2. Thời gian & Người phụ trách
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              {/* Bắt đầu */}
              <TextField
                fullWidth
                size="small"
                type="datetime-local"
                label="Thời gian bắt đầu *"
                InputLabelProps={{ shrink: true }}
                value={formData.startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />

              {/* Kết thúc */}
              <TextField
                fullWidth
                size="small"
                type="datetime-local"
                label="Thời gian kết thúc (Dự kiến)"
                InputLabelProps={{ shrink: true }}
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />

              {/* Người phỏng vấn */}
              <TextField
                fullWidth
                size="small"
                label="Họ tên người phỏng vấn"
                placeholder="VD: Nguyễn Văn A (Lead Tech)"
                value={formData.interviewerName}
                onChange={(e) => handleChange('interviewerName', e.target.value)}
                InputProps={{
                  startAdornment: <Person sx={{ color: '#64748b', mr: 1, fontSize: 18 }} />,
                }}
              />

              {/* Email người phỏng vấn */}
              <TextField
                fullWidth
                size="small"
                type="email"
                label="Email người phỏng vấn"
                placeholder="interviewer@company.com"
                value={formData.interviewerEmail}
                onChange={(e) => handleChange('interviewerEmail', e.target.value)}
                InputProps={{
                  startAdornment: <Email sx={{ color: '#64748b', mr: 1, fontSize: 18 }} />,
                }}
              />
            </Box>
          </Box>

          {/* Card 3: Ghi chú */}
          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: 3,
              bgcolor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="#475569"
              mb={1.5}
              display="flex"
              alignItems="center"
              gap={1}
            >
              <Notes sx={{ fontSize: 18 }} /> 3. Ghi chú & Dặn dò ứng viên
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Ứng viên vui lòng chuẩn bị laptop, portfolio hoặc các sản phẩm demo đã thực hiện..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Box>
        </Stack>
      </DialogContent>

      {/* Nút hành động */}
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
            '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' },
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
          {saving ? 'Đang lưu...' : isEdit ? 'Cập nhật lịch' : 'Tạo lịch & Gửi lời mời'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
