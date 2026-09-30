import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import {
  LocationOn,
  MonetizationOn,
  Work,
  ArrowBack,
  AutoAwesome,
  Favorite,
  FavoriteBorder,
  Description,
  Verified,
  People,
  CardGiftcard,
  TrendingUp,
  Security,
  School,
  AccessTime,
  Apartment,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useToast } from "../../../contexts/ToastContext";
import { getMediaUrl } from "../../../utils/urlHelpers";
import { PageState } from "../../../shared/components";
import {
  JobApplicationDialog,
  JobDetailSidebar,
  JobDetailStickyActions,
} from "./components";
import {
  calculateDaysAgo,
  calculateRemainingDays,
  getCompanyDetails,
  getJobTags,
} from "./utils/jobDetail.utils";

/* ================= AUTH TOKEN ================= */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return { Authorization: `Bearer ${token}` };
};

const MotionBox = motion(Box);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const TABS = [
  { label: "Mô tả công việc", id: "job-desc" },
  { label: "Yêu cầu ứng viên", id: "job-reqs" },
  { label: "Quyền lợi được hưởng", id: "job-benefits" },
  { label: "Thông tin công ty", id: "company-info" },
];

const getBenefitsList = (salaryRange) => [
  {
    title: "Thu nhập cạnh tranh",
    subtitle: salaryRange && salaryRange !== "Thỏa thuận" ? `Lương ${salaryRange}/tháng` : "Mức lương thỏa thuận theo năng lực",
    icon: <MonetizationOn sx={{ fontSize: 22 }} />,
    color: "#0284c7",
    bg: "#f0f9ff",
  },
  {
    title: "Thưởng hiệu suất",
    subtitle: "Thưởng tháng 13, thưởng theo KPI và kết quả dự án",
    icon: <TrendingUp sx={{ fontSize: 22 }} />,
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    title: "Bảo hiểm toàn diện",
    subtitle: "Đầy đủ BHXH, BHYT, BHTN và gói khám sức khỏe định kỳ",
    icon: <Security sx={{ fontSize: 22 }} />,
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    title: "Môi trường công nghệ",
    subtitle: "Văn hóa mở, thiết bị làm việc hiện đại, khuyến khích sáng tạo",
    icon: <AutoAwesome sx={{ fontSize: 22 }} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    title: "Đào tạo & Phát triển",
    subtitle: "Tài trợ chứng chỉ công nghệ, đào tạo kỹ năng chuyên sâu",
    icon: <School sx={{ fontSize: 22 }} />,
    color: "#db2777",
    bg: "#fdf2f8",
  },
  {
    title: "Phúc lợi sự kiện",
    subtitle: "Du lịch hàng năm, hoạt động teambuilding, quà tặng sinh nhật",
    icon: <CardGiftcard sx={{ fontSize: 22 }} />,
    color: "#ea580c",
    bg: "#fff7ed",
  },
];

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState("job-desc");

  const isFetched = useRef(false);

  // Mở modal nếu quay lại từ trang điều khoản
  useEffect(() => {
    if (location.state?.fromPrivacy) {
      setOpenModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch dữ liệu công việc
  useEffect(() => {
    if (isFetched.current) return;
    const fetchJobDetail = async () => {
      try {
        const authHeader = getAuthHeader();
        const res = await api.get(`/api/public/jobs/${id}`, {
          headers: authHeader || {},
        });
        setJob(res.data);
        if (res.data.favorite !== undefined) {
          setIsFavorite(res.data.favorite);
        }

        // Lưu vào danh sách đã xem gần đây
        try {
          const viewedKey = "recent_viewed_jobs";
          const currentList = JSON.parse(localStorage.getItem(viewedKey) || "[]");
          const newEntry = {
            jobId: res.data.jobId || id,
            title: res.data.title || "Công việc",
            companyName: res.data.companyName || res.data.company?.name || "Công ty",
            location: res.data.location || "Toàn quốc",
            salaryRange: res.data.salaryRange || "Thỏa thuận",
            viewedDate: new Date().toLocaleDateString("vi-VN"),
            viewedTimestamp: Date.now(),
          };
          const filtered = currentList.filter(
            (item) => String(item.jobId) !== String(newEntry.jobId)
          );
          const updated = [newEntry, ...filtered].slice(0, 30);
          localStorage.setItem(viewedKey, JSON.stringify(updated));
        } catch (storageErr) {
          console.error("Lỗi lưu việc làm đã xem:", storageErr);
        }
        isFetched.current = true;
      } catch (err) {
        console.error("Lỗi tải chi tiết công việc:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
    window.scrollTo(0, 0);
  }, [id]);

  // Kiểm tra trạng thái yêu thích
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const authHeader = getAuthHeader();
      if (!authHeader || !job) return;
      try {
        const res = await api.get(`/api/user/jobs/favorite/${id}/status`, {
          headers: authHeader,
        });
        setIsFavorite(res.data);
      } catch (err) {
        console.error("Lỗi kiểm tra favorite:", err);
      }
    };
    checkFavoriteStatus();
  }, [id, job]);

  // Xử lý toggle yêu thích
  const handleToggleFavorite = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      showToast("Vui lòng đăng nhập để thực hiện chức năng này", "warning");
      navigate("/login");
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/api/user/jobs/favorite/${id}`, {
          headers: authHeader,
        });
        setIsFavorite(false);
        showToast("Đã bỏ lưu tin việc làm!", "info");
      } else {
        await api.post(`/api/user/jobs/favorite/add/${id}`, null, {
          headers: authHeader,
        });
        setIsFavorite(true);
        showToast("Đã lưu việc làm vào mục yêu thích! ❤️", "success");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setIsFavorite(true);
        showToast("Công việc đã có trong danh sách yêu thích", "warning");
      } else {
        showToast("Không thể cập nhật trạng thái yêu thích", "error");
      }
    }
  };

  const handleOpenApplyModal = () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      showToast("Vui lòng đăng nhập để ứng tuyển", "warning");
      navigate("/login");
      return;
    }
    setOpenModal(true);
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveTab(sectionId);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Đã sao chép liên kết công việc! 📋", "success");
  };

  if (loading) {
    return <PageState loading title="Đang tải thông tin việc làm..." minHeight="80vh" />;
  }

  if (!job) {
    return <PageState title="Không tìm thấy công việc này" />;
  }

  const remainingDays = calculateRemainingDays(job.expiredAt);
  const tags = getJobTags(job.title);
  const benefits = getBenefitsList(job.salaryRange);
  const company = getCompanyDetails(job.companyName, job.location);
  const isExpired = remainingDays !== null && remainingDays <= 0;

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* Nút quay lại */}
      <Box sx={{ mb: 2.5 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBack sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: "none",
            color: "#64748b",
            fontWeight: 700,
            fontSize: "0.88rem",
            px: 1.5,
            py: 0.8,
            borderRadius: "12px",
            bgcolor: "transparent",
            "&:hover": {
              bgcolor: "rgba(2, 132, 199, 0.08)",
              color: "#0284c7",
            },
            transition: "all 0.2s",
          }}
        >
          Quay lại danh sách việc làm
        </Button>
      </Box>

      {/* 1. HERO BANNER: THIẾT KẾ CÔNG NGHỆ KHÔNG VIỀN (BORDERLESS TECH HEADER) */}
      <MotionBox
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        sx={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          bgcolor: "#ffffff",
          boxShadow: "0 20px 45px -15px rgba(2, 132, 199, 0.08), 0 8px 25px -5px rgba(15, 23, 42, 0.04)",
          p: { xs: 3, md: 4.5 },
          mb: 4,
        }}
      >
        {/* Ambient Gradient Glows (Hiệu ứng ánh sáng công nghệ nhẹ nhàng) */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: "20%",
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Grid container spacing={3.5} alignItems="center">
          {/* Logo và Thông tin chính */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
              <Avatar
                src={getMediaUrl(job.companyLogo)}
                variant="rounded"
                sx={{
                  width: { xs: 72, sm: 88 },
                  height: { xs: 72, sm: 88 },
                  borderRadius: "20px",
                  bgcolor: "#f8fafc",
                  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
                  border: "none",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "#0284c7",
                  flexShrink: 0,
                  p: 0.5,
                }}
              >
                {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Tên công ty & Huy hiệu xác thực */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 750,
                      color: "#475569",
                      fontSize: "1rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {job.companyName || "Công ty Công nghệ"}
                  </Typography>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.4,
                      px: 1,
                      py: 0.2,
                      borderRadius: "20px",
                      bgcolor: "rgba(2, 132, 199, 0.08)",
                      color: "#0284c7",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                    }}
                  >
                    <Verified sx={{ fontSize: 14 }} /> Đã xác thực
                  </Box>
                </Stack>

                {/* Tiêu đề công việc */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    color: "#0f172a",
                    fontSize: { xs: "1.4rem", sm: "1.8rem", md: "2.1rem" },
                    lineHeight: 1.25,
                    letterSpacing: "-0.02em",
                    mb: 2,
                  }}
                >
                  {job.title}
                </Typography>

                {/* Các thẻ thông số (Pills) */}
                <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap sx={{ mb: 2.5 }}>
                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.7,
                      px: 1.6,
                      py: 0.7,
                      borderRadius: "12px",
                      bgcolor: "#f0fdf4",
                      color: "#15803d",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                    }}
                  >
                    <MonetizationOn sx={{ fontSize: 18 }} />
                    {job.salaryRange || "Thỏa thuận"}
                  </Box>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.7,
                      px: 1.6,
                      py: 0.7,
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      color: "#475569",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 18, color: "#ef4444" }} />
                    {job.location ? job.location.split(",").pop().trim() : "Toàn quốc"}
                  </Box>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.7,
                      px: 1.6,
                      py: 0.7,
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      color: "#475569",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    <Work sx={{ fontSize: 18, color: "#0284c7" }} />
                    {job.experienceLevel || "Mid Level"}
                  </Box>

                  <Box
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.7,
                      px: 1.6,
                      py: 0.7,
                      borderRadius: "12px",
                      bgcolor: "#f8fafc",
                      color: "#64748b",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                    }}
                  >
                    <AccessTime sx={{ fontSize: 18 }} />
                    {calculateDaysAgo(job.createdAt)}
                  </Box>
                </Stack>

                {/* Danh sách kỹ năng (Tags công nghệ có micro-interaction) */}
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {tags.map((tag, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Box
                        sx={{
                          px: 1.4,
                          py: 0.5,
                          borderRadius: "10px",
                          bgcolor: "rgba(2, 132, 199, 0.06)",
                          color: "#0369a1",
                          fontWeight: 750,
                          fontSize: "0.78rem",
                          cursor: "default",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "rgba(2, 132, 199, 0.12)",
                            color: "#0284c7",
                          },
                        }}
                      >
                        #{tag}
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Grid>

          {/* Cột phải: Hạn nộp & Nút hành động chính */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: "20px",
                bgcolor: "#f8fafc",
                boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.02)",
              }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      mb: 0.6,
                    }}
                  >
                    Hạn nộp hồ sơ
                  </Typography>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Typography sx={{ color: "#0f172a", fontWeight: 850, fontSize: "1.15rem" }}>
                      {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : "Đang tuyển liên tục"}
                    </Typography>
                    {remainingDays !== null && (
                      <Chip
                        size="small"
                        label={remainingDays > 0 ? `Còn ${remainingDays} ngày` : "Đã hết hạn"}
                        sx={{
                          bgcolor: remainingDays > 0 ? "#dcfce7" : "#fee2e2",
                          color: remainingDays > 0 ? "#15803d" : "#b91c1c",
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          borderRadius: "8px",
                          border: "none",
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <Divider sx={{ borderColor: "rgba(226, 232, 240, 0.8)" }} />

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="outlined"
                    onClick={handleToggleFavorite}
                    startIcon={
                      isFavorite ? (
                        <Favorite sx={{ color: "#ef4444", fontSize: 20 }} />
                      ) : (
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                      )
                    }
                    sx={{
                      flex: 1,
                      fontWeight: 800,
                      borderRadius: "14px",
                      textTransform: "none",
                      borderColor: "#e2e8f0",
                      color: isFavorite ? "#ef4444" : "#64748b",
                      bgcolor: isFavorite ? "#fef2f2" : "#ffffff",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                      "&:hover": {
                        borderColor: "#ef4444",
                        bgcolor: "#fff5f5",
                        color: "#ef4444",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {isFavorite ? "Đã lưu" : "Lưu tin"}
                  </Button>

                  <Button
                    variant="contained"
                    disabled={isExpired}
                    onClick={handleOpenApplyModal}
                    sx={{
                      flex: 2,
                      fontWeight: 800,
                      borderRadius: "14px",
                      textTransform: "none",
                      background: isExpired
                        ? "#94a3b8"
                        : "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                      boxShadow: isExpired ? "none" : "0 8px 24px rgba(2, 132, 199, 0.3)",
                      py: 1.3,
                      "&:hover": {
                        boxShadow: "0 12px 28px rgba(2, 132, 199, 0.45)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {isExpired ? "Đã hết hạn" : "Ứng tuyển ngay"}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </MotionBox>

      {/* 2. TAB ĐIỀU HƯỚNG MƯỢT MÀ (PILL TABS) */}
      <Box
        sx={{
          mb: 4,
          p: 0.8,
          borderRadius: "16px",
          bgcolor: "#ffffff",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.03)",
          display: "inline-flex",
          maxWidth: "100%",
          overflowX: "auto",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack direction="row" spacing={1}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "0.88rem",
                  px: { xs: 2, sm: 2.8 },
                  py: 1,
                  borderRadius: "12px",
                  whiteSpace: "nowrap",
                  color: isActive ? "#ffffff" : "#64748b",
                  bgcolor: isActive ? "#0284c7" : "transparent",
                  boxShadow: isActive ? "0 6px 18px rgba(2, 132, 199, 0.25)" : "none",
                  "&:hover": {
                    bgcolor: isActive ? "#0284c7" : "rgba(2, 132, 199, 0.06)",
                    color: isActive ? "#ffffff" : "#0284c7",
                  },
                  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {tab.label}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* 3. NỘI DUNG CHÍNH (GRID CỘT TRÁI CHI TIẾT & CỘT PHẢI SIDEBAR) */}
      <Grid container spacing={4}>
        {/* CỘT TRÁI: CHI TIẾT CÔNG VIỆC */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3.5}>
            {/* Box 1: Mô tả công việc */}
            <MotionBox
              id="job-desc"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: "24px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
              }}
            >
              <SectionHeading icon={<Description sx={{ fontSize: 22 }} />} label="Mô tả công việc" color="#0284c7" />
              <Typography
                sx={{
                  whiteSpace: "pre-line",
                  color: "#334155",
                  fontSize: "0.96rem",
                  lineHeight: 1.85,
                  letterSpacing: "0.01em",
                  pl: { xs: 0, sm: 1 },
                }}
              >
                {job.description}
              </Typography>
            </MotionBox>

            {/* Box 2: Yêu cầu ứng viên */}
            <MotionBox
              id="job-reqs"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: "24px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
              }}
            >
              <SectionHeading icon={<People sx={{ fontSize: 22 }} />} label="Yêu cầu ứng viên" color="#7c3aed" />
              <Typography
                sx={{
                  whiteSpace: "pre-line",
                  color: "#334155",
                  fontSize: "0.96rem",
                  lineHeight: 1.85,
                  letterSpacing: "0.01em",
                  pl: { xs: 0, sm: 1 },
                }}
              >
                {job.candidateRequirements}
              </Typography>
            </MotionBox>

            {/* Box 3: Quyền lợi được hưởng (Card Lợi ích công nghệ) */}
            <MotionBox
              id="job-benefits"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: "24px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
              }}
            >
              <SectionHeading icon={<AutoAwesome sx={{ fontSize: 22 }} />} label="Quyền lợi được hưởng" color="#ea580c" />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
                  gap: 2.2,
                  mt: 1,
                }}
              >
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: "18px",
                        bgcolor: b.bg,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                        height: "100%",
                        transition: "all 0.25s",
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "12px",
                            bgcolor: "#ffffff",
                            color: b.color,
                            display: "grid",
                            placeItems: "center",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)",
                          }}
                        >
                          {b.icon}
                        </Box>
                        <Typography sx={{ fontWeight: 850, fontSize: "0.9rem", color: "#0f172a" }}>
                          {b.title}
                        </Typography>
                      </Stack>
                      <Typography sx={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600, lineHeight: 1.5 }}>
                        {b.subtitle}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </MotionBox>

            {/* Box 4: Thông tin công ty */}
            <MotionBox
              id="company-info"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: "24px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
              }}
            >
              <SectionHeading icon={<Apartment sx={{ fontSize: 22 }} />} label="Về chúng tôi" color="#059669" />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ sm: "center" }}>
                <Avatar
                  src={getMediaUrl(job.companyLogo)}
                  variant="rounded"
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "18px",
                    bgcolor: "#f0fdf4",
                    color: "#059669",
                    fontSize: "1.6rem",
                    fontWeight: 900,
                    flexShrink: 0,
                    boxShadow: "0 8px 20px rgba(5, 150, 105, 0.12)",
                  }}
                >
                  {job.companyName?.charAt(0).toUpperCase() || "C"}
                </Avatar>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography sx={{ color: "#0f172a", fontWeight: 850, fontSize: "1.15rem" }}>
                      {job.companyName}
                    </Typography>
                    <Verified sx={{ fontSize: 18, color: "#0284c7" }} />
                  </Stack>
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontSize: "0.88rem",
                      fontStyle: "italic",
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    "{company.slogan}"
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[company.size, company.industry, company.address.split(",")[0]].map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          px: 1.4,
                          py: 0.5,
                          borderRadius: "8px",
                          bgcolor: "#f1f5f9",
                          color: "#475569",
                          fontSize: "0.78rem",
                          fontWeight: 750,
                        }}
                      >
                        {item}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </MotionBox>
          </Stack>
        </Grid>

        {/* CỘT PHẢI: SIDEBAR THÔNG TIN BỔ SUNG */}
        <JobDetailSidebar
          job={job}
          company={company}
          isExpired={isExpired}
          onCopyLink={handleCopyLink}
        />
      </Grid>

      {/* THANH HÀNH ĐỘNG STICKY ĐÁY MÀN HÌNH */}
      <JobDetailStickyActions
        job={job}
        isFavorite={isFavorite}
        isExpired={isExpired}
        onApply={handleOpenApplyModal}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* MODAL ỨNG TUYỂN */}
      <JobApplicationDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        job={job}
        jobId={id}
      />
    </Box>
  );
}

function SectionHeading({ icon, label, color }) {
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "12px",
          bgcolor: `${color}15`,
          color: color,
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontWeight: 850, fontSize: "1.15rem", color: "#0f172a" }}>
        {label}
      </Typography>
    </Stack>
  );
}
