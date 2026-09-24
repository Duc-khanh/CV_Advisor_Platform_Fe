import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../../../services/axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Chip,
  IconButton,
  Grid,
  Link,
  Avatar,
  Container,
} from "@mui/material";
import {
  LocationOn,
  MonetizationOn,
  Work,
  Event,
  ArrowBack,
  Apartment,
  Visibility,
  AutoAwesome,
  Favorite,
  FavoriteBorder,
  Description,
  Verified,
  Schedule,
  People,
  Language,
  Send,
  Facebook,
  LinkedIn,
  Flag,
  ChevronRight,
  ContentCopy,
  TrendingUp,
  Security,
  ThumbUp,
  School,
  Info,
  Transgender,
  CardGiftcard,
} from "@mui/icons-material";
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

/* ===== LẤY AUTH HEADER ===== */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ===== TẠO DANH SÁCH QUYỀN LỢI ĐẸP MẮT ===== */
const getJobBenefits = (salaryRange) => [
  {
    title: "Thu nhập hấp dẫn",
    subtitle: salaryRange && salaryRange !== "Thỏa thuận" ? `${salaryRange}/tháng` : "Cạnh tranh theo năng lực",
    icon: <CardGiftcard sx={{ color: "#2563eb", fontSize: 26 }} />,
    bgcolor: "#eff6ff",
    border: "#dbeafe",
  },
  {
    title: "Thưởng hiệu suất",
    subtitle: "Thưởng dự án, hiệu quả công việc vượt trội",
    icon: <CardGiftcard sx={{ color: "#d97706", fontSize: 26 }} />,
    bgcolor: "#fffbeb",
    border: "#fef3c7",
  },
  {
    title: "Bảo hiểm đầy đủ",
    subtitle: "BHXH, BHYT, BHTN đóng đầy đủ từ ngày ký hợp đồng",
    icon: <CardGiftcard sx={{ color: "#0284c7", fontSize: 26 }} />,
    bgcolor: "#f0f9ff",
    border: "#e0f2fe",
  },
  {
    title: "Môi trường trẻ",
    subtitle: "Năng động, thân thiện, cởi mở, khuyến khích sáng tạo",
    icon: <CardGiftcard sx={{ color: "#db2777", fontSize: 26 }} />,
    bgcolor: "#fff1f2",
    border: "#ffe4e6",
  },
  {
    title: "Đào tạo phát triển",
    subtitle: "Hỗ trợ kinh phí tham gia các khóa học nâng cao chuyên môn",
    icon: <CardGiftcard sx={{ color: "#059669", fontSize: 26 }} />,
    bgcolor: "#ecfdf5",
    border: "#d1fae5",
  },
];

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Đã sửa: Phải nằm trong component
  const showToast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const isFetched = useRef(false);

  /* ===== 0. KIỂM TRA NẾU QUAY LẠI TỪ TRANG ĐIỀU KHOẢN ===== */
  useEffect(() => {
    if (location.state?.fromPrivacy) {
      setOpenModal(true);
      // Xóa state để không tự mở modal khi reload trang
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* ===== 1. FETCH JOB DETAIL (PUBLIC) ===== */
  useEffect(() => {
    if (isFetched.current) return;

    const fetchJobDetail = async () => {
      const authHeader = getAuthHeader();
      try {
        const res = await api.get(`/api/public/jobs/${id}`, {
          headers: authHeader || {},
        });
        setJob(res.data);
        // Đọc trạng thái isFavorite từ response luôn
        if (res.data.favorite !== undefined) {
          setIsFavorite(res.data.favorite);
        }
        isFetched.current = true;
      } catch (err) {
        console.error("Lỗi lấy chi tiết công việc:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
    window.scrollTo(0, 0);
  }, [id]);

  /* ===== 2. KIỂM TRA TRẠNG THÁI YÊU THÍCH ===== */
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const authHeader = getAuthHeader();
      if (!authHeader || !job) return;

      try {
        const res = await api.get(
          `/api/user/jobs/favorite/${id}/status`,
          { headers: authHeader }
        );
        setIsFavorite(res.data);
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái yêu thích:", err);
      }
    };

    checkFavoriteStatus();
  }, [id, job]);

  /* ===== 3. XỬ LÝ TOGGLE YÊU THÍCH ===== */
  const handleToggleFavorite = async () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      showToast("Vui lòng đăng nhập để thực hiện chức năng này", "warning");
      navigate("/login");
      return;
    }

    if (isFavorite) {
      // === BỎ YÊU THÍCH ===
      try {
        await api.delete(
          `/api/user/jobs/favorite/${id}`,
          { headers: authHeader }
        );
        setIsFavorite(false);
        showToast("Đã bỏ lưu tin!", "info");
      } catch (err) {
        console.error("Lỗi bỏ lưu công việc:", err);
        showToast("Không thể thực hiện thao tác yêu thích", "error");
      }
    } else {
      // === THÊM YÊU THÍCH ===
      try {
        await api.post(
          `/api/user/jobs/favorite/add/${id}`,
          null,
          { headers: authHeader }
        );
        setIsFavorite(true);
        showToast("Đã lưu tin! ❤️", "success");
      } catch (err) {
        if (err.response?.status === 409) {
          showToast("Công việc đã có trong danh sách việc làm yêu thích", "warning");
          setIsFavorite(true); // Đồng bộ lại trạng thái
        } else {
          showToast("Không thể thực hiện thao tác yêu thích", "error");
        }
      }
    }
  };

  /* ===== 4. XỬ LÝ MỞ MODAL ỨNG TUYỂN ===== */
  const handleOpenApplyModal = () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      showToast("Vui lòng đăng nhập để ứng tuyển", "warning");
      navigate("/login");
      return;
    }
    setOpenModal(true);
  };

  if (loading) {
    return <PageState loading title="Đang tải công việc" minHeight="100vh" />;
  }

  if (!job) return <PageState title="Không tìm thấy công việc" />;

  const remainingDays = calculateRemainingDays(job.expiredAt);

  const tags = getJobTags(job.title);
  const benefits = getJobBenefits(job.salaryRange);
  const company = getCompanyDetails(job.companyName, job.location);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Đã sao chép liên kết công việc! 📋", "success");
  };

  return (
    <>
      <Box sx={{ bgcolor: "#f8fafc", pt: 3, pb: 2 }}>
        <Container maxWidth="xl">
          <Link
            onClick={() => navigate(-1)}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#475569",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              textDecoration: "none",
              transition: "all 0.2s",
              "&:hover": { color: "#2563eb", transform: "translateX(-2px)" },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} /> Quay lại danh sách việc làm
          </Link>
        </Container>
      </Box>

      {/* NỀN CHÍNH CỦA TRANG CHI TIẾT */}
      <Box sx={{ bgcolor: "#f8fafc", pb: 10, pt: 2 }}>
        <Container maxWidth="xl">
          {/* 1. HEADER CARD (Thông tin chính của công việc) */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
              bgcolor: "#ffffff",
              mb: 4,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(15,23,42,0.03)",
            }}
          >
            <Grid container spacing={3}>
              {/* Bên trái + Giữa: Logo & Thông tin */}
              <Grid size={{ xs: 12, lg: 9 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} sx={{ height: "100%" }}>
                  <Avatar
                    src={getMediaUrl(job.companyLogo)}
                    variant="rounded"
                    sx={{
                      width: 90,
                      height: 90,
                      bgcolor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      flexShrink: 0,
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: "#2563eb",
                      p: 0.5,
                      alignSelf: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      color="#0f172a"
                      sx={{ mb: 1, fontSize: { xs: "1.3rem", sm: "1.6rem" } }}
                    >
                      {job.title}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
                      <Typography fontWeight={750} color="#475569" sx={{ fontSize: "0.95rem" }}>
                        {job.companyName}
                      </Typography>
                      <Verified sx={{ fontSize: 16, color: "#2563eb" }} />
                    </Stack>

                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <LocationOn sx={{ color: "#ef4444", fontSize: 18 }} />
                          <Typography variant="body2" color="#475569" fontWeight={700} noWrap>
                            {job.location ? job.location.split(",").pop().trim() : "Hà Nội"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <MonetizationOn sx={{ color: "#10b981", fontSize: 18 }} />
                          <Typography variant="body2" color="#059669" fontWeight={750} noWrap>
                            {job.salaryRange || "Thỏa thuận"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Work sx={{ color: "#64748b", fontSize: 18 }} />
                          <Typography variant="body2" color="#475569" fontWeight={700} noWrap>
                            {job.experienceLevel || "Mid Level"}
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Visibility sx={{ color: "#64748b", fontSize: 18 }} />
                          <Typography variant="body2" color="#475569" fontWeight={700} noWrap>
                            {job.viewCount || 0} lượt xem
                          </Typography>
                        </Stack>
                      </Grid>
                      <Grid size={{ xs: 6, sm: 4, md: 2.4 }}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <Schedule sx={{ color: "#0284c7", fontSize: 18 }} />
                          <Typography variant="body2" color="#0284c7" fontWeight={750} noWrap>
                            {calculateDaysAgo(job.createdAt)}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                      {tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: "#eff6ff",
                            color: "#1e4ed8",
                            fontWeight: 800,
                            fontSize: "0.75rem",
                            borderRadius: "6px",
                          }}
                        />
                      ))}
                      <Chip
                        label="+2"
                        size="small"
                        sx={{
                          bgcolor: "#f0fdf4",
                          color: "#166534",
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          borderRadius: "6px",
                        }}
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Grid>

              {/* Bên phải: Sidebar Mức lương & Actions */}
              <Grid size={{ xs: 12, lg: 3 }}>
                <Box
                  sx={{
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={800}
                    color="#64748b"
                    letterSpacing={1}
                    sx={{ mb: 0.5, display: "block" }}
                  >
                    MỨC LƯƠNG
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#10b981" sx={{ mb: 3 }}>
                    {job.salaryRange || "Thỏa thuận"}
                  </Typography>

                  <Stack spacing={1.5}>
                    <Button
  fullWidth
  variant="contained"
  size="large"
  startIcon={<Send sx={{ transform: "rotate(-30deg)" }} />}
  disabled={remainingDays !== null && remainingDays <= 0}
  onClick={handleOpenApplyModal}
  sx={{
    py: 1.5,
    fontWeight: 900,
    borderRadius: "10px",
    textTransform: "none",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",

    // NORMAL
    background:
      remainingDays !== null && remainingDays <= 0
        ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
        : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",

    boxShadow:
      remainingDays !== null && remainingDays <= 0
        ? "0 4px 15px rgba(100,116,139,0.18)"
        : "0 4px 15px rgba(37,99,235,0.2)",

    color: "#fff",

    "&:hover": {
      background:
        remainingDays !== null && remainingDays <= 0
          ? "linear-gradient(135deg, #64748b 0%, #475569 100%)"
          : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
    },

    "&.Mui-disabled": {
      color: "#f8fafc",
      background:
        "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
      boxShadow: "0 4px 15px rgba(100,116,139,0.18)",
      opacity: 1,
    },
  }}
>
  {remainingDays !== null && remainingDays <= 0
    ? "Đã hết hạn tuyển dụng"
    : "Ứng tuyển ngay"}
</Button>

                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={isFavorite ? <Favorite sx={{ color: "#ef4444" }} /> : <FavoriteBorder />}
                      onClick={handleToggleFavorite}
                      sx={{
                        py: 1.5,
                        fontWeight: 800,
                        borderRadius: "10px",
                        borderColor: "#cbd5e1",
                        color: "#334155",
                        bgcolor: "#ffffff",
                        "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                        textTransform: "none",
                        fontSize: "0.95rem",
                      }}
                    >
                      {isFavorite ? "Đã lưu tin" : "Lưu tin"}
                    </Button>
                  </Stack>
                </Box>
              </Grid>

              {/* Dải Hạn nộp hồ sơ ở dưới cùng (Spanning 12 columns, now fully visible) */}
              <Grid size={12}>
                <Box
                  sx={{
                    bgcolor: "#fffbeb",
                    border: "1px solid #fef08a",
                    borderRadius: "12px",
                    px: 3,
                    py: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Event sx={{ color: "#b45309", fontSize: 18 }} />
                    <Typography fontWeight={750} color="#b45309" sx={{ fontSize: "0.88rem" }}>
                      Hạn nộp hồ sơ:{" "}
                      <span style={{ fontWeight: 600, color: "#475569" }}>
                        {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : "Chưa xác định"}
                      </span>
                    </Typography>
                  </Stack>
                  {remainingDays !== null && (
                    <Chip
                      size="small"
                      label={remainingDays > 0 ? `Còn ${remainingDays} ngày` : "Đã hết hạn"}
                      sx={{
                        bgcolor: remainingDays > 0 ? "#dcfce7" : "#fee2e2",
                        color: remainingDays > 0 ? "#15803d" : "#b91c1c",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* 2. KHU VỰC THÂN CHÍNH (Chi tiết công việc và Sidebar) */}
          <Grid container spacing={4}>
            {/* CỘT TRÁI (Nội dung chi tiết) */}
            <Grid size={{ xs: 12, lg: 8 }}>
              {/* Tab Navigation */}
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  mb: 4,
                  bgcolor: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={{ xs: 1.5, sm: 3 }} flexWrap="wrap" useFlexGap>
                  {[
                    { label: "Mô tả công việc", id: "job-desc" },
                    { label: "Yêu cầu ứng viên", id: "job-reqs" },
                    { label: "Quyền lợi được hưởng", id: "job-benefits" },
                    { label: "Thông tin công ty", id: "company-info" },
                  ].map((tab, index) => (
                    <Button
                      key={index}
                      onClick={() => scrollToSection(tab.id)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 750,
                        color: "#64748b",
                        fontSize: "0.9rem",
                        position: "relative",
                        py: 1,
                        px: 1.5,
                        borderRadius: "8px",
                        "&:hover": { color: "#2563eb", bgcolor: "#eff6ff" },
                      }}
                    >
                      {tab.label}
                    </Button>
                  ))}
                </Stack>
              </Paper>

              {/* Chi tiết nội dung */}
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                }}
              >
                {/* Section 1: Mô tả công việc */}
                <Box id="job-desc" sx={{ mb: 5 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.5 }}>
                    <Description sx={{ color: "#2563eb" }} />
                    <Typography variant="h6" fontWeight={850} color="#0f172a">
                      Mô tả công việc
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      color: "#334155",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      pl: 2.5,
                    }}
                  >
                    {job.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

                {/* Section 2: Yêu cầu ứng viên */}
                <Box id="job-reqs" sx={{ mb: 5 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 2.5 }}>
                 
                    <People sx={{ color: "#2563eb" }} />
                    <Typography variant="h6" fontWeight={850} color="#0f172a">
                      Yêu cầu ứng viên
                    </Typography>
                  </Stack>
                  <Typography
                    sx={{
                      whiteSpace: "pre-line",
                      color: "#334155",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      pl: 2.5,
                    }}
                  >
                    {job.candidateRequirements}
                  </Typography>
                </Box>

                <Divider sx={{ my: 4, borderColor: "#f1f5f9" }} />

                {/* Section 3: Quyền lợi */}
                <Box id="job-benefits">
                  <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 3 }}>
                
                    <AutoAwesome sx={{ color: "#2563eb" }} />
                    <Typography variant="h6" fontWeight={850} color="#0f172a">
                      Quyền lợi được hưởng
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                      },
                      gap: 2.5,
                      pl: { xs: 0, sm: 2.5 },
                    }}
                  >
                    {benefits.map((b, i) => (
                      <Paper
                        elevation={0}
                        key={i}
                        sx={{
                          p: 2.5,
                          borderRadius: "12px",
                          border: `1px solid ${b.border}`,
                          bgcolor: b.bgcolor,
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            borderColor: "#3b82f6",
                            bgcolor: "#ffffff",
                            boxShadow: "0 10px 25px rgba(59,130,246,0.08)",
                            transform: "translateY(-4px)",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          {b.icon}
                          <Typography fontWeight={900} color="#1e293b" sx={{ fontSize: "0.88rem" }}>
                            {b.title}
                          </Typography>
                        </Stack>
                        <Typography variant="caption" color="#475569" fontWeight={600} sx={{ fontSize: "0.78rem", mt: 0.5, lineHeight: 1.4 }}>
                          {b.subtitle}
                        </Typography>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <JobDetailSidebar
              job={job}
              company={company}
              isExpired={remainingDays !== null && remainingDays <= 0}
              onCopyLink={handleCopyLink}
            />
          </Grid>
        </Container>
      </Box>

      <JobDetailStickyActions
        job={job}
        isFavorite={isFavorite}
        isExpired={remainingDays !== null && remainingDays <= 0}
        onApply={handleOpenApplyModal}
        onToggleFavorite={handleToggleFavorite}
      />

      <JobApplicationDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        job={job}
        jobId={id}
      />
    </>
  );
}
