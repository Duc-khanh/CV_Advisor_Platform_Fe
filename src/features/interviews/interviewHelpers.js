/**
 * interviewHelpers.js
 * Các hàm tiện ích dùng chung cho Interview feature
 */
import { INTERVIEW_STATUS_HEX } from './interviewConstants';

export const formatDateTime = (val) => {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

export const formatDate = (val) => {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

export const formatTime = (val) => {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
};

export const toInputDateTime = (val) => {
  if (!val) return '';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
};

export const calcInterviewStats = (interviews = []) => {
  const stats = {
    total: interviews.length,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    rescheduled: 0,
    today: 0,
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  interviews.forEach((it) => {
    switch (it.status) {
      case 'SCHEDULED':
        stats.scheduled += 1;
        break;
      case 'COMPLETED':
        stats.completed += 1;
        break;
      case 'CANCELLED':
        stats.cancelled += 1;
        break;
      case 'RESCHEDULED':
        stats.rescheduled += 1;
        break;
      default:
        break;
    }
    const scheduledTime = it.scheduledAt || it.startTime;
    if (scheduledTime && scheduledTime.startsWith(todayStr)) {
      stats.today += 1;
    }
  });

  return stats;
};

export const mapInterviewsToCalendarEvents = (interviews = []) => {
  return interviews.map((it) => {
    const scheduledTime = it.scheduledAt || it.startTime;
    const start = new Date(scheduledTime);
    const end = new Date(start.getTime() + (it.durationMinutes || 60) * 60 * 1000);

    return {
      id: it.id,
      title: `${it.candidateName || 'Ứng viên'} - ${it.jobTitle || 'Phỏng vấn'}`,
      start,
      end,
      color: INTERVIEW_STATUS_HEX[it.status] || '#2563eb',
      extendedProps: {
        raw: it,
        type: it.type || it.interviewType,
        meetingLink: it.meetingLink || it.locationOrLink,
        location: it.location || it.locationOrLink,
        status: it.status,
        round: it.round || it.roundName,
        interviewer: it.interviewer || it.interviewerName,
      },
    };
  });
};

export const isInterviewPast = (scheduledAt) => {
  if (!scheduledAt) return false;
  return new Date(scheduledAt) < new Date();
};
