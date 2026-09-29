/**
 * InterviewFilterBar.jsx
 * Thanh bộ lọc + chuyển đổi chế độ xem + nút tạo mới
 * Thiết kế gọn gàng, hiện đại, căn chỉnh cân đối.
 */
import React from 'react';
import {
  Box,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Add,
  TableRows,
  CalendarMonth,
} from '@mui/icons-material';
import { INTERVIEW_STATUS_OPTIONS } from '../../../features/interviews/interviewConstants';

export default function InterviewFilterBar({
  keyword = '',
  onKeywordChange,
  status = 'ALL',
  onStatusChange,
  viewMode = 'list',
  onViewModeChange,
  onCreateClick,
}) {
  return (
    <Box
      sx={{
        py: 1.2,
        px: { xs: 1.5, sm: 2 },
        bgcolor: '#ffffff',
        borderRadius: 2.5,
        border: '1px solid #e2e8f0',
        mb: 2.5,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
      >
        {/* Nhóm tìm kiếm và lọc trạng thái */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          flex={1}
          alignItems="center"
        >
          {/* Ô tìm kiếm */}
          <TextField
            size="small"
            placeholder="Tìm theo tên ứng viên, vị trí, người phỏng vấn..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#94a3b8', fontSize: 18 }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: '100%', sm: 280, md: 320 },
              flex: 'none',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                fontSize: '0.85rem',
                height: 38,
                bgcolor: '#f8fafc',
                '&:hover': { bgcolor: '#ffffff' },
                '&.Mui-focused': { bgcolor: '#ffffff' },
              },
            }}
          />

          {/* Lọc trạng thái - Gọn gàng, không bị thừa khoảng trắng */}
          <FormControl
            size="small"
            sx={{
              width: { xs: '100%', sm: 155 },
              minWidth: { sm: 150 },
              flexShrink: 0,
            }}
          >
            <InputLabel sx={{ fontSize: '0.85rem', lineHeight: '1rem', top: 0 }}>
              Trạng thái
            </InputLabel>
            <Select
              value={status}
              label="Trạng thái"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={{
                borderRadius: 2,
                fontSize: '0.85rem',
                height: 38,
                bgcolor: '#f8fafc',
                '& .MuiSelect-select': {
                  py: 1,
                  px: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                },
                '&:hover': { bgcolor: '#ffffff' },
                '&.Mui-focused': { bgcolor: '#ffffff' },
              }}
            >
              {INTERVIEW_STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: '0.85rem', py: 0.8 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        {/* Nhóm thao tác bên phải */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent={{ xs: 'space-between', sm: 'flex-end' }}
        >
          {/* Chuyển dạng xem (Segmented Control có khoảng cách rõ ràng, không dính nhau) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f1f5f9',
              p: '3px',
              borderRadius: 2,
              gap: '4px',
              border: '1px solid #e2e8f0',
            }}
          >
            <Tooltip title="Dạng danh sách bảng">
              <Button
                size="small"
                onClick={() => onViewModeChange('list')}
                sx={{
                  minWidth: 36,
                  height: 30,
                  p: 0,
                  borderRadius: 1.5,
                  bgcolor: viewMode === 'list' ? '#ffffff' : 'transparent',
                  color: viewMode === 'list' ? '#0284c7' : '#64748b',
                  boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  '&:hover': {
                    bgcolor: viewMode === 'list' ? '#ffffff' : 'rgba(0,0,0,0.04)',
                    color: '#0284c7',
                  },
                }}
              >
                <TableRows sx={{ fontSize: 18 }} />
              </Button>
            </Tooltip>

            <Tooltip title="Dạng lịch biểu">
              <Button
                size="small"
                onClick={() => onViewModeChange('calendar')}
                sx={{
                  minWidth: 36,
                  height: 30,
                  p: 0,
                  borderRadius: 1.5,
                  bgcolor: viewMode === 'calendar' ? '#ffffff' : 'transparent',
                  color: viewMode === 'calendar' ? '#0284c7' : '#64748b',
                  boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  '&:hover': {
                    bgcolor: viewMode === 'calendar' ? '#ffffff' : 'rgba(0,0,0,0.04)',
                    color: '#0284c7',
                  },
                }}
              >
                <CalendarMonth sx={{ fontSize: 18 }} />
              </Button>
            </Tooltip>
          </Box>

          {/* Nút Tạo mới */}
          <Button
            variant="contained"
            startIcon={<Add sx={{ fontSize: 18 }} />}
            onClick={onCreateClick}
            sx={{
              height: 38,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              px: { xs: 2, sm: 2.5 },
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              boxShadow: '0 3px 10px rgba(14,165,233,0.25)',
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
                boxShadow: '0 5px 14px rgba(14,165,233,0.35)',
              },
            }}
          >
            Lên lịch mới
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
