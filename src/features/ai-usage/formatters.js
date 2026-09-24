export const formatNumber = (value) =>
  new Intl.NumberFormat("vi-VN").format(Number(value) || 0);

export const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatDateTime = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(value))
    : "—";

export const percentUsed = (used, limit) => {
  const total = Number(limit) || 0;
  return total > 0 ? Math.min(100, Math.round(((Number(used) || 0) / total) * 100)) : 0;
};

export const FEATURE_LABELS = {
  CV_EVALUATION: "Đánh giá CV",
  CAREER_ROADMAP: "Lộ trình nghề nghiệp",
  CV_REWRITE: "Viết lại CV",
  CAREER_ASSISTANT: "Trợ lý nghề nghiệp",
  CANDIDATE_FIT: "Đánh giá ứng viên",
};
