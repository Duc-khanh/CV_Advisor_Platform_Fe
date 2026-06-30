/**
 * CV & Analysis Constants
 */

export const CV_CONSTRAINTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  ACCEPTED_EXTENSIONS: [".pdf", ".doc", ".docx"],
};

export const CV_SCORE_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  AVERAGE: 40,
  POOR: 0,
};

export const CV_SCORE_LABELS = {
  EXCELLENT: "Xuất sắc",
  GOOD: "Tốt",
  AVERAGE: "Trung bình",
  POOR: "Cần cải thiện",
};

export const CV_SCORE_COLORS = {
  EXCELLENT: "#16a34a",
  GOOD: "#3b82f6",
  AVERAGE: "#f97316",
  POOR: "#dc2626",
};

export const ROADMAP_PHASES = {
  FOUNDATION: "Nền tảng",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
  EXPERT: "Chuyên gia",
};
