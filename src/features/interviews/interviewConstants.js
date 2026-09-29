/**
 * interviewConstants.js
 * Các hằng số dùng chung cho toàn bộ tính năng Lịch phỏng vấn (HR)
 */

export const INTERVIEW_STATUS = {
  SCHEDULED: 'SCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  RESCHEDULED: 'RESCHEDULED',
};

export const INTERVIEW_STATUS_LABELS = {
  SCHEDULED: 'Đã lên lịch',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
  RESCHEDULED: 'Đổi lịch',
  ALL: 'Tất cả',
};

export const INTERVIEW_STATUS_COLOR = {
  SCHEDULED: 'primary',
  COMPLETED: 'success',
  CANCELLED: 'error',
  RESCHEDULED: 'warning',
};

/** Màu hex dùng cho Calendar event và badge */
export const INTERVIEW_STATUS_HEX = {
  SCHEDULED: '#2563eb',
  COMPLETED: '#16a34a',
  CANCELLED: '#ef4444',
  RESCHEDULED: '#d97706',
};

export const INTERVIEW_STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tất cả trạng thái' },
  { value: 'SCHEDULED', label: 'Đã lên lịch' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
  { value: 'RESCHEDULED', label: 'Đổi lịch' },
];

export const INTERVIEW_TYPE = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
};

export const INTERVIEW_TYPE_LABELS = {
  ONLINE: 'Trực tuyến',
  OFFLINE: 'Trực tiếp',
};

export const INTERVIEW_TYPE_OPTIONS = [
  { value: 'ONLINE', label: 'Trực tuyến (Online Meeting)' },
  { value: 'OFFLINE', label: 'Trực tiếp (Tại văn phòng)' },
];

export const INTERVIEW_ROUND_OPTIONS = [
  'Vòng 1 - Phỏng vấn Sơ loại HR',
  'Vòng 2 - Phỏng vấn Chuyên môn / Kỹ thuật',
  'Vòng 3 - Phỏng vấn Văn hóa & Quản lý',
  'Vòng cuối - Trao đổi Offer',
];

export const FEEDBACK_NEXT_ACTION_OPTIONS = [
  { value: 'ACCEPT', label: 'Đạt - Chuyển sang trúng tuyển' },
  { value: 'NEXT_ROUND', label: 'Đạt - Lên lịch vòng tiếp theo' },
  { value: 'REJECT', label: 'Chưa phù hợp - Từ chối ứng viên' },
];

export const INTERVIEW_THEME_COLOR = '#0ea5e9';
