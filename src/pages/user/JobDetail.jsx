import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../../services/axios";
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Modal,
  TextField,
  IconButton,
  Checkbox,
  FormControlLabel,
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
  CloudUpload,
  Close,
  CheckCircle,
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
import UserLayout from "../../components/UserLayout";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";

/* ===== STYLE CHO MODAL ===== */
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%", md: 840 },
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 0,
  maxHeight: "95vh",
  overflowY: "auto",
};

/* ===== LẤY AUTH HEADER ===== */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* ===== TÍNH SỐ NGÀY CÒN LẠI ===== */
const calculateRemainingDays = (expiredAt) => {
  if (!expiredAt) return null;
  const now = new Date();
  const expiredDate = new Date(expiredAt);
  return Math.ceil((expiredDate - now) / (1000 * 60 * 60 * 24));
};

/* ===== TÍNH SỐ NGÀY ĐÃ ĐĂNG ===== */
const calculateDaysAgo = (createdAt) => {
  if (!createdAt) return "Đăng 2 ngày trước";
  const now = new Date();
  const created = new Date(createdAt);
  
  // Set times to midnight to calculate pure day differences
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const createdMidnight = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  
  const diffTime = nowMidnight - createdMidnight;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return "Đăng hôm nay";
  return `Đăng ${diffDays} ngày trước`;
};

/* ===== TẠO SKILLS/TAGS TỰ ĐỘNG THEO TIÊU ĐỀ ===== */
const getJobTags = (title = "") => {
  const t = title.toLowerCase();
  if (t.includes("java")) {
    return ["Java", "Spring Boot", "MySQL", "REST API", "Git", "SQL"];
  }
  if (t.includes("react") || t.includes("frontend") || t.includes("front-end") || t.includes("javascript")) {
    return ["React", "JavaScript", "TypeScript", "HTML5/CSS3", "REST API", "Git"];
  }
  if (t.includes("node") || t.includes("backend") || t.includes("back-end")) {
    return ["Node.js", "Express", "MongoDB", "REST API", "Docker", "Git"];
  }
  if (t.includes("design") || t.includes("thiết kế") || t.includes("figma") || t.includes("ui/ux")) {
    return ["Figma", "UI/UX", "Adobe Photoshop", "Illustrator", "Creative"];
  }
  if (t.includes("marketing") || t.includes("seo") || t.includes("quảng cáo")) {
    return ["SEO", "Google Ads", "Content Marketing", "Social Media", "Analytics"];
  }
  if (t.includes("kinh doanh") || t.includes("sale") || t.includes("bán hàng")) {
    return ["Kỹ năng giao tiếp", "Đàm phán", "Tư vấn khách hàng", "Microsoft Office", "Giải quyết vấn đề"];
  }
  return ["Kỹ năng giao tiếp", "Làm việc nhóm", "Giải quyết vấn đề", "Chủ động", "Thích ứng nhanh"];
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

/* ===== TẠO THÔNG TIN CÔNG TY CHI TIẾT ===== */
const getCompanyDetails = (companyName, location) => {
  const domain = companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company";
  return {
    slogan: "Nền tảng công nghệ và đào tạo nguồn nhân lực chất lượng cao hàng đầu.",
    size: "50 - 150 nhân viên",
    industry: "Giáo dục / Công nghệ thông tin",
    website: `https://${domain}.vn`,
    address: `Tòa nhà ${companyName || "Company Building"}, ${location || "Hà Nội, Việt Nam"}`,
  };
};

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Đã sửa: Phải nằm trong component
  const showToast = useToast();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [isEvaluatingAi, setIsEvaluatingAi] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetLocation: "",
    coverLetter: "",
    agreeTerms: false,
    allowAiAnalysis: true,
  });

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
        const res = await axios.get(`http://localhost:8080/api/public/jobs/${id}`, {
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
        const res = await axios.get(
          `http://localhost:8080/api/user/jobs/favorite/${id}/status`,
          { headers: authHeader }
        );
        setIsFavorite(res.data);
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái yêu thích");
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
        await axios.delete(
          `http://localhost:8080/api/user/jobs/favorite/${id}`,
          { headers: authHeader }
        );
        setIsFavorite(false);
        showToast("Đã bỏ lưu tin!", "info");
      } catch (err) {
        showToast("Không thể thực hiện thao tác yêu thích", "error");
      }
    } else {
      // === THÊM YÊU THÍCH ===
      try {
        await axios.post(
          `http://localhost:8080/api/user/jobs/favorite/add/${id}`,
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

  /* ===== 5. XỬ LÝ GỬI ĐƠN ỨNG TUYỂN ===== */
  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const authHeader = getAuthHeader();

    if (!cvFile) {
      showToast("Vui lòng tải lên file CV của bạn", "warning");
      return;
    }

    if (!formData.agreeTerms) {
      showToast("Bạn cần đồng ý với điều khoản để tiếp tục", "warning");
      return;
    }

    const submitData = new FormData();
    submitData.append("cv", cvFile);
    submitData.append("fullName", formData.fullName);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("targetLocation", formData.targetLocation);
    submitData.append("coverLetter", formData.coverLetter);

    try {
      setApplying(true);
      await api.post(
        `/api/user/jobs/apply/${id}`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (formData.allowAiAnalysis) {
        setIsEvaluatingAi(true);

        const evaluateData = new FormData();
        evaluateData.append("cv", cvFile);
        evaluateData.append("jobDescription", `Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.candidateRequirements}`);

        try {
          const aiRes = await axios.post(
            "http://localhost:8080/api/v1/ai/evaluate-cv",
            evaluateData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setAiFeedback(aiRes.data);
          showToast("Ứng tuyển thành công!", "success");
        } catch (aiErr) {
          console.error("Lỗi AI:", aiErr);
          showToast("Ứng tuyển thành công! Nhưng có lỗi khi AI phân tích.", "warning");
          setOpenModal(false);
          setCvFile(null);
        }
      } else {
        showToast("Ứng tuyển thành công! Bạn đã chọn không phân tích CV bằng AI.", "success");
        setOpenModal(false);
        setCvFile(null);
      }

    } catch (err) {
      showToast(err.response?.data?.message || "Ứng tuyển thất bại", "error");
    } finally {
      setApplying(false);
      setIsEvaluatingAi(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!job) return <Typography align="center">Không tìm thấy công việc</Typography>;

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
    <UserLayout>
      {/* KHU VỰC NỀN TRÊN CỦA TRANG CHỦ CHỨA NÚT BACK */}
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

            {/* CỘT PHẢI (Sidebar thông tin bổ sung) */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={4}>
                {/* Card 1: Thông tin chung */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={850} color="#0f172a" sx={{ mb: 2.5 }}>
                    Thông tin công việc
                  </Typography>

                  <Stack spacing={2.5}>
                    {[
                      {
                        label: "Cấp bậc",
                        val: job.experienceLevel || "Mid Level",
                        icon: <Work sx={{ color: "#64748b", fontSize: 20 }} />,
                      },
                      {
                        label: "Kinh nghiệm",
                        val: "1 - 3 năm",
                        icon: <School sx={{ color: "#64748b", fontSize: 20 }} />,
                      },
                      {
                        label: "Hình thức làm việc",
                        val: "Toàn thời gian",
                        icon: <Schedule sx={{ color: "#64748b", fontSize: 20 }} />,
                      },
                      {
                        label: "Giới tính",
                        val: "Không yêu cầu",
                        icon: <Transgender sx={{ color: "#64748b", fontSize: 20 }} />,
                      },
                      {
                        label: "Số lượng tuyển",
                        val: "3 người",
                        icon: <People sx={{ color: "#64748b", fontSize: 20 }} />,
                      },
                      {
                        label: "Hạn nộp hồ sơ",
                        val: job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : "Chưa xác định",
                        icon: <Event sx={{ color: "#64748b", fontSize: 20 }} />,
                        badge: remainingDays !== null && remainingDays <= 0 ? "Đã hết hạn" : null,
                      },
                    ].map((item, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: "#f1f5f9",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="caption" color="#94a3b8" fontWeight={750} display="block" sx={{ mb: 0.1 }}>
                            {item.label}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2" color="#334155" fontWeight={700} noWrap>
                              {item.val}
                            </Typography>
                            {item.badge && (
                              <Chip
                                label={item.badge}
                                size="small"
                                color="error"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                {/* Card 2: Thông tin công ty */}
                <Paper
                  id="company-info"
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                    <Avatar
                      src={getMediaUrl(job.companyLogo)}
                      variant="rounded"
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontSize: "1.2rem",
                        fontWeight: 800,
                        color: "#2563eb",
                        p: 0.25,
                      }}
                    >
                      {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2" fontWeight={850} color="#0f172a" noWrap display="flex" alignItems="center" gap={0.5}>
                        Thông tin công ty
                      </Typography>
                      <Typography variant="caption" color="#2563eb" fontWeight={800} noWrap display="flex" alignItems="center" gap={0.3}>
                        {job.companyName} <Verified sx={{ fontSize: 13 }} />
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="caption" color="#64748b" fontWeight={650} display="block" sx={{ mb: 3.5, fontStyle: "italic" }}>
                    "{company.slogan}"
                  </Typography>

                  <Stack spacing={2.5}>
                    {[
                      {
                        label: "Quy mô",
                        val: company.size,
                        icon: <People sx={{ color: "#64748b", fontSize: 18 }} />,
                      },
                      {
                        label: "Lĩnh vực",
                        val: company.industry,
                        icon: <Work sx={{ color: "#64748b", fontSize: 18 }} />,
                      },
                      {
                        label: "Website",
                        val: company.website,
                        icon: <Language sx={{ color: "#64748b", fontSize: 18 }} />,
                        isLink: true,
                      },
                      {
                        label: "Địa chỉ",
                        val: company.address,
                        icon: <LocationOn sx={{ color: "#64748b", fontSize: 18 }} />,
                      },
                    ].map((item, i) => (
                      <Stack key={i} direction="row" spacing={1.5} alignItems="flex-start">
                        {item.icon}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="#94a3b8" fontWeight={750} display="block" sx={{ mb: 0.1 }}>
                            {item.label}
                          </Typography>
                          {item.isLink ? (
                            <Link
                              href={item.val}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                color: "#2563eb",
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              {item.val}
                            </Link>
                          ) : (
                            <Typography variant="body2" color="#475569" fontWeight={700} sx={{ lineHeight: 1.4 }}>
                              {item.val}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                {/* Card 3: Chia sẻ công việc */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    bgcolor: "#ffffff",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={850} color="#0f172a" sx={{ mb: 2 }}>
                    Chia sẻ công việc
                  </Typography>

                  <Stack direction="row" spacing={2.5}>
                    {[
                      {
                        icon: <Facebook sx={{ color: "#1877f2", fontSize: 20 }} />,
                        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                      },
                      {
                        icon: <LinkedIn sx={{ color: "#0a66c2", fontSize: 20 }} />,
                        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                      },
                      {
                        icon: <Info sx={{ color: "#0068ff", fontSize: 20 }} />,
                        url: `https://zalo.me/share?to=&url=${encodeURIComponent(window.location.href)}`,
                      },
                    ].map((social, idx) => (
                      <IconButton
                        key={idx}
                        component="a"
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: "#f1f5f9",
                          border: "1px solid #e2e8f0",
                          borderRadius: "50%",
                          "&:hover": { bgcolor: "#e2e8f0" },
                        }}
                      >
                        {social.icon}
                      </IconButton>
                    ))}
                    <IconButton
                      onClick={handleCopyLink}
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        borderRadius: "50%",
                        "&:hover": { bgcolor: "#e2e8f0" },
                      }}
                    >
                      <ContentCopy sx={{ color: "#64748b", fontSize: 18 }} />
                    </IconButton>
                  </Stack>
                </Paper>

                {/* Card 4: Báo cáo tin tuyển dụng */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: "16px",
                    border: "1px solid #fee2e2",
                    bgcolor: "#fff5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    "&:hover": { bgcolor: "#fecaca" },
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Flag sx={{ color: "#ef4444", fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={800} color="#b91c1c">
                      Báo cáo tin tuyển dụng
                    </Typography>
                  </Stack>
                  <ChevronRight sx={{ color: "#b91c1c" }} />
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. STICKY FOOTER BAR */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          bgcolor: "#ffffff",
          borderTop: "1px solid #e2e8f0",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
          py: 2,
          display: { xs: "none", md: "block" },
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* Bên trái: Thông tin nhanh */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={getMediaUrl(job.companyLogo)}
                variant="rounded"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "#2563eb",
                  p: 0.25,
                }}
              >
                {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
              </Avatar>
              <Box>
                <Typography fontWeight={850} color="#0f172a" sx={{ fontSize: "0.95rem", lineHeight: 1.3 }}>
                  {job.title}
                </Typography>
                <Typography variant="caption" color="#64748b" fontWeight={750}>
                  {job.companyName} · {job.location ? job.location.split(",").pop().trim() : "Hà Nội"} ·{" "}
                  <span style={{ color: "#10b981", fontWeight: 800 }}>{job.salaryRange || "Thỏa thuận"}</span>
                </Typography>
              </Box>
            </Stack>

            {/* Bên phải: Nút action */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={isFavorite ? <Favorite sx={{ color: "#ef4444" }} /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 800,
                  borderRadius: "8px",
                  borderColor: "#e2e8f0",
                  color: "#475569",
                  bgcolor: "#ffffff",
                  "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
                  textTransform: "none",
                }}
              >
                Lưu tin
              </Button>

              <Button
                variant="contained"
                startIcon={<Send sx={{ transform: "rotate(-30deg)" }} />}
                disabled={remainingDays !== null && remainingDays <= 0}
                onClick={handleOpenApplyModal}
                sx={{
                  px: 4,
                  py: 1,
                  fontWeight: 800,
                  borderRadius: "8px",
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1d4ed8" },
                  textTransform: "none",
                }}
              >
                Ứng tuyển ngay
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* MODAL ỨNG TUYỂN */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleApplySubmit} sx={modalStyle}>
          {/* Header luôn hiển thị */}
          <Box sx={{ p: 2.5, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              Ứng tuyển <span style={{ color: "#2563eb" }}>{job.title}</span>
            </Typography>
            <IconButton onClick={() => { setOpenModal(false); setAiFeedback(null); }}><Close /></IconButton>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {isEvaluatingAi ? (
              /* TRẠNG THÁI 1: ĐANG PHÂN TÍCH */
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#2563eb', mb: 3 }} />
                <Typography variant="h6" fontWeight={600}>Đang ứng tuyển và phân tích CV...</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Hệ thống AI đang đánh giá mức độ phù hợp. Vui lòng đợi trong giây lát.
                </Typography>
              </Box>
            ) : aiFeedback ? (
              /* TRẠNG THÁI 2: KẾT QUẢ AI */
              <Box>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#10b981', mb: 1 }} />
                  <Typography variant="h5" fontWeight={700} color="success.main">Ứng tuyển thành công!</Typography>
                </Box>
                
                <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
                    <AutoAwesome color="primary" fontSize="small" /> Đánh giá từ AI
                  </Typography>
                  
                  <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                    <Box sx={{ position: 'relative', display: 'flex' }}>
                      <CircularProgress variant="determinate" value={100} size={70} sx={{ color: '#e2e8f0' }} />
                      <CircularProgress variant="determinate" value={aiFeedback.score} size={70} sx={{ position: 'absolute', color: aiFeedback.score >= 70 ? '#10b981' : '#f59e0b' }} />
                      <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography fontWeight={800}>{aiFeedback.score}%</Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2">{aiFeedback.summary}</Typography>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight={700} color="success.main">ƯU ĐIỂM:</Typography>
                      {aiFeedback.strengths?.map((s, i) => <Typography key={i} variant="caption" display="block">• {s}</Typography>)}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="caption" fontWeight={700} color="error.main">CẦN CẢI THIỆN:</Typography>
                      {aiFeedback.weaknesses?.map((w, i) => <Typography key={i} variant="caption" display="block">• {w}</Typography>)}
                    </Grid>
                  </Grid>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button variant="contained" onClick={() => { setOpenModal(false); setAiFeedback(null); }} sx={{ bgcolor: '#2563eb' }}>Hoàn tất</Button>
                </Box>
              </Box>
            ) : (
              /* TRẠNG THÁI 3: FORM ĐIỀN */
              <Stack spacing={2.5}>
                <Box sx={{ border: "2px dashed #2563eb", borderRadius: 2, p: 2, textAlign: "center", bgcolor: "#f0fdf4" }}>
                  <CloudUpload sx={{ color: "#2563eb", mb: 1 }} />
                  <Typography variant="body2" fontWeight={600}>Tải lên CV (.pdf, .doc)</Typography>
                  <Button variant="outlined" size="small" component="label" sx={{ mt: 1 }}>
                    Chọn file
                    <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} />
                  </Button>
                  {cvFile && <Typography variant="caption" display="block" sx={{ mt: 1, color: "#10b981" }}>{cvFile.name}</Typography>}
                </Box>

                <TextField label="Họ và tên *" fullWidth size="small" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Email *" fullWidth size="small" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField label="Số điện thoại *" fullWidth size="small" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                  </Grid>
                </Grid>

                <TextField label="Thư giới thiệu" multiline rows={3} fullWidth placeholder="Viết ngắn gọn..." value={formData.coverLetter} onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })} />

                <Box>
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} color="success" />}
                    label={<Typography variant="caption">Tôi đồng ý với điều khoản sử dụng</Typography>}
                  />
                  <FormControlLabel
                    control={<Checkbox size="small" checked={formData.allowAiAnalysis} onChange={(e) => setFormData({ ...formData, allowAiAnalysis: e.target.checked })} color="primary" />}
                    label={<Typography variant="caption">Cho phép AI phân tích CV</Typography>}
                  />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setOpenModal(false)}>Hủy</Button>
                  <Button type="submit" variant="contained" disabled={applying} sx={{ bgcolor: "#2563eb" }}>
                    {applying ? "Đang xử lý..." : "Nộp hồ sơ"}
                  </Button>
                </Stack>
              </Stack>
            )}
          </Box>
        </Box>
      </Modal>
    </UserLayout>
  );
}
   