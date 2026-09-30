/**
 * InterviewStatsBar.jsx
 * Component hiển thị 4 thẻ thống kê nhanh ở đầu trang Lịch phỏng vấn
 */
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { EventNote, EventAvailable, PendingActions, CheckCircleOutline } from '@mui/icons-material';
import StatCard from '../../ui/StatCard';

export default function InterviewStatsBar({ stats = {}, loading = false }) {
  const {
    todayCount = 0,
    upcomingCount = 0,
    pendingFeedback = 0,
    completedThisMonth = 0,
  } = stats;

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
          bgcolor: '#ffffff',
          borderRadius: 3,
          border: '1px solid #f1f5f9',
        }}
      >
        <CircularProgress sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  const cards = [
    {
      title: 'Phỏng vấn hôm nay',
      value: todayCount.toString(),
      icon: <EventNote />,
      color: '#0ea5e9',
    },
    {
      title: 'Sắp diễn ra',
      value: upcomingCount.toString(),
      icon: <EventAvailable />,
      color: '#2563eb',
    },
    {
      title: 'Chờ đánh giá kết quả',
      value: pendingFeedback.toString(),
      icon: <PendingActions />,
      color: '#d97706',
    },
    {
      title: 'Hoàn thành trong tháng',
      value: completedThisMonth.toString(),
      icon: <CheckCircleOutline />,
      color: '#10b981',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: { xs: 2, sm: 2.5, lg: 3 },
        mb: 3,
      }}
    >
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
        />
      ))}
    </Box>
  );
}
