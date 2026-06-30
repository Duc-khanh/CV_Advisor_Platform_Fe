/**
 * Job Status & Category Constants
 */

export const JOB_STATUS_CONFIG = {
  PENDING: { label: "Đang chờ", color: "#fef3c7", bgColor: "#fffbeb" },
  REVIEWING: {
    label: "Đang xem xét",
    color: "#0284c7",
    bgColor: "#e0f2fe",
  },
  ACCEPTED: {
    label: "Đã trúng tuyển",
    color: "#16a34a",
    bgColor: "#dcfce7",
  },
  REJECTED: { label: "Từ chối", color: "#dc2626", bgColor: "#fee2e2" },
};

export const JOB_TYPE_CONFIG = {
  "full-time": { label: "Toàn thời gian", icon: "💼" },
  "part-time": { label: "Bán thời gian", icon: "🕐" },
  contract: { label: "Hợp đồng", icon: "📝" },
  freelance: { label: "Freelance", icon: "🎯" },
};

export const JOB_CATEGORIES = [
  { id: "tech", name: "Công nghệ", icon: "💻", count: 1250 },
  { id: "design", name: "Thiết kế", icon: "🎨", count: 890 },
  { id: "marketing", name: "Marketing", icon: "📊", count: 640 },
  { id: "sales", name: "Bán hàng", icon: "📞", count: 510 },
];

export const PAGINATION_DEFAULTS = {
  PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
};

export const SEARCH_FILTERS = {
  LOCATION_OPTIONS: [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Toàn quốc",
  ],
  SALARY_RANGES: [
    { label: "Dưới 5 triệu", value: "0-5" },
    { label: "5 - 10 triệu", value: "5-10" },
    { label: "10 - 20 triệu", value: "10-20" },
    { label: "Trên 20 triệu", value: "20+" },
  ],
  JOB_TYPES: ["full-time", "part-time", "contract", "freelance"],
};
