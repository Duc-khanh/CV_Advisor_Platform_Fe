/**
 * InterviewCalendarView.jsx
 * Hiển thị lịch phỏng vấn theo giao diện Calendar tháng trực quan
 * Thoáng đãng, có khoảng cách rõ ràng, không bị dính nhau.
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  INTERVIEW_STATUS_HEX,
  INTERVIEW_STATUS_LABELS,
} from '../../../features/interviews/interviewConstants';
import { formatTime } from '../../../features/interviews/interviewHelpers';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export default function InterviewCalendarView({
  interviews = [],
  onEventClick,
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  };

  // Tính ma trận ngày cho tháng đang xem
  const calendarGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const weeks = [];
    let currentWeek = [];

    // Các ngày tháng trước bù vào đầu tuần
    for (let i = firstDay - 1; i >= 0; i--) {
      currentWeek.push({
        day: prevMonthDays - i,
        month: viewMonth - 1,
        year: viewYear,
        isCurrentMonth: false,
      });
    }

    // Các ngày trong tháng này
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        day,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Các ngày tháng sau bù vào cuối tuần
    if (currentWeek.length > 0) {
      let nextMonthDay = 1;
      while (currentWeek.length < 7) {
        currentWeek.push({
          day: nextMonthDay++,
          month: viewMonth + 1,
          year: viewYear,
          isCurrentMonth: false,
        });
      }
      weeks.push(currentWeek);
    }

    return weeks;
  }, [viewYear, viewMonth]);

  // Gom nhóm phỏng vấn theo ngày YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};
    interviews.forEach((it) => {
      const timeVal = it.scheduledAt || it.startTime;
      if (!timeVal) return;
      const d = new Date(timeVal);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(it);
    });
    return map;
  }, [interviews]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        bgcolor: '#ffffff',
      }}
    >
      {/* Header tháng & điều hướng */}
      <Box
        sx={{
          py: 1.8,
          px: 2.5,
          bgcolor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography variant="h6" fontWeight={800} color="#1e293b" fontSize="1.1rem">
            {MONTHS[viewMonth]} {viewYear}
          </Typography>
          <Chip
            label="Hôm nay"
            size="small"
            onClick={goToday}
            sx={{
              fontWeight: 600,
              fontSize: '0.75rem',
              bgcolor: '#ffffff',
              border: '1px solid #cbd5e1',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#f1f5f9' },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={0.8}>
          <IconButton size="small" onClick={goPrev} sx={{ border: '1px solid #e2e8f0', bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc' } }}>
            <ChevronLeft sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton size="small" onClick={goNext} sx={{ border: '1px solid #e2e8f0', bgcolor: '#fff', '&:hover': { bgcolor: '#f8fafc' } }}>
            <ChevronRight sx={{ fontSize: 20 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* Lưới lịch cuộn ngang được trên màn hình nhỏ */}
      <Box sx={{ overflowX: 'auto', width: '100%' }}>
        <Box sx={{ minWidth: 720 }}>
          {/* Tên các thứ trong tuần */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              bgcolor: '#f1f5f9',
              borderBottom: '1px solid #e2e8f0',
              textAlign: 'center',
              py: 1.2,
            }}
          >
            {WEEKDAYS.map((w, idx) => (
              <Typography
                key={w}
                variant="caption"
                fontWeight={700}
                color={idx === 0 ? '#ef4444' : '#475569'}
                fontSize="0.8rem"
              >
                {w}
              </Typography>
            ))}
          </Box>

          {/* Lưới các ô ngày */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {calendarGrid.map((week, wIdx) => (
              <Box
                key={wIdx}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  borderBottom: wIdx === calendarGrid.length - 1 ? 'none' : '1px solid #e2e8f0',
                }}
              >
                {week.map((cell, cIdx) => {
                  const padM = String(cell.month + 1).padStart(2, '0');
                  const padD = String(cell.day).padStart(2, '0');
                  const cellDateKey = `${cell.year}-${padM}-${padD}`;
                  const events = eventsByDate[cellDateKey] || [];
                  const isToday =
                    cell.isCurrentMonth &&
                    cell.day === today.getDate() &&
                    cell.month === today.getMonth() &&
                    cell.year === today.getFullYear();

                  return (
                    <Box
                      key={cIdx}
                      sx={{
                        minHeight: 115,
                        p: 1.2,
                        borderRight: cIdx === 6 ? 'none' : '1px solid #e2e8f0',
                        bgcolor: cell.isCurrentMonth ? '#ffffff' : '#f8fafc',
                        position: 'relative',
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      {/* Số ngày - Có khoảng cách rõ ràng với sự kiện bên dưới */}
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: isToday ? 800 : 600,
                          color: isToday
                            ? '#ffffff'
                            : cell.isCurrentMonth
                            ? '#1e293b'
                            : '#94a3b8',
                          bgcolor: isToday ? '#0ea5e9' : 'transparent',
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 0.8,
                          fontSize: '0.78rem',
                        }}
                      >
                        {cell.day}
                      </Typography>

                      {/* Danh sách sự kiện trong ngày với khoảng cách spacing rộng rãi */}
                      <Stack spacing={0.8}>
                        {events.slice(0, 3).map((ev) => (
                          <Tooltip
                            key={ev.id}
                            title={`${ev.candidateName || 'Ứng viên'} (${ev.jobTitle || 'Phỏng vấn'}) - ${formatTime(ev.scheduledAt || ev.startTime)}`}
                          >
                            <Box
                              onClick={() => onEventClick?.(ev)}
                              sx={{
                                px: 1,
                                py: 0.45,
                                borderRadius: 1.5,
                                bgcolor: `${INTERVIEW_STATUS_HEX[ev.status] || '#2563eb'}15`,
                                borderLeft: `3px solid ${INTERVIEW_STATUS_HEX[ev.status] || '#2563eb'}`,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                  bgcolor: `${INTERVIEW_STATUS_HEX[ev.status] || '#2563eb'}25`,
                                  transform: 'translateX(2px)',
                                },
                              }}
                            >
                              <Typography
                                fontSize="0.72rem"
                                fontWeight={600}
                                color={INTERVIEW_STATUS_HEX[ev.status] || '#64748b'}
                                noWrap
                              >
                                {formatTime(ev.scheduledAt || ev.startTime)} {ev.candidateName}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ))}
                        {events.length > 3 && (
                          <Typography fontSize="0.68rem" color="#0284c7" fontWeight={700} pl={0.5}>
                            +{events.length - 3} lịch khác
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Chú thích màu trạng thái */}
      <Box
        sx={{
          px: 2.5,
          py: 1.4,
          bgcolor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 2.5,
          flexWrap: 'wrap',
        }}
      >
        {Object.entries(INTERVIEW_STATUS_HEX).map(([status, color]) => (
          <Stack key={status} direction="row" spacing={0.75} alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: color,
              }}
            />
            <Typography fontSize="0.75rem" color="#64748b" fontWeight={500}>
              {INTERVIEW_STATUS_LABELS[status] || status}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Paper>
  );
}
