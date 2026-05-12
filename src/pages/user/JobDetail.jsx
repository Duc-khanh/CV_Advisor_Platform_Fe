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
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import { useToast } from "../../contexts/ToastContext";

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

  return (
    <UserLayout>
      <Box sx={{ display: "flex", justifyContent: "center", px: 2, py: 6, bgcolor: "#f3f4f6" }}>
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
            Quay lại danh sách
          </Button>

          <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: "1px solid #e5e7eb" }}>
            <Typography fontSize={32} fontWeight={800} mb={2}>{job.title}</Typography>

            <Stack direction="row" spacing={3} flexWrap="wrap" mb={3}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Apartment color="primary" />
                <Typography fontWeight={600}>{job.companyName}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOn color="error" />
                <Typography>{job.location}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <MonetizationOn color="success" />
                <Typography fontWeight={700} color="success.main">{job.salaryRange || "Thỏa thuận"}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Work />
                <Typography>{job.experienceLevel}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Visibility />
                <Typography>{job.viewCount || 0} lượt xem</Typography>
              </Stack>
            </Stack>

            <Box sx={{ mb: 4, p: 2.5, borderRadius: 3, bgcolor: "#fef3c7" }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Event />
                <Typography fontWeight={700}>Hạn nộp:</Typography>
                <Typography>
                  {job.expiredAt ? new Date(job.expiredAt).toLocaleDateString("vi-VN") : "Không giới hạn"}
                </Typography>
              </Stack>
              {remainingDays !== null && (
                <Chip
                  sx={{ mt: 1 }}
                  label={remainingDays > 0 ? `Còn ${remainingDays} ngày` : "Đã hết hạn"}
                  color={remainingDays > 0 ? "success" : "error"}
                />
              )}
            </Box>

            <Typography variant="h6" fontWeight={700}>Mô tả công việc</Typography>
            <Typography sx={{ whiteSpace: "pre-line", mb: 3 }}>{job.description}</Typography>

            <Typography variant="h6" fontWeight={700}>Yêu cầu ứng viên</Typography>
            <Typography sx={{ whiteSpace: "pre-line" }}>{job.candidateRequirements}</Typography>

            <Divider sx={{ my: 4 }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="stretch">
              <Button
                variant={isFavorite ? "contained" : "outlined"}
                color={isFavorite ? "error" : "primary"}
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, py: 1.5, width: { xs: "100%", sm: "auto" } }}
              >
                {isFavorite ? "Đã lưu" : "Lưu tin"}
              </Button>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                disabled={remainingDays !== null && remainingDays <= 0}
                onClick={handleOpenApplyModal}
                sx={{ py: 2, fontWeight: 800, borderRadius: 2, width: { xs: "100%", sm: "auto" }, bgcolor: "#00b14f", "&:hover": { bgcolor: "#008f3f" }, textTransform: "none" }}
              >
                {remainingDays !== null && remainingDays <= 0 ? "Hết hạn ứng tuyển" : "Ứng tuyển ngay"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* MODAL ỨNG TUYỂN */}
{/* MODAL ỨNG TUYỂN */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box component="form" onSubmit={handleApplySubmit} sx={modalStyle}>
          {/* Header luôn hiển thị */}
          <Box sx={{ p: 2.5, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              Ứng tuyển <span style={{ color: "#00b14f" }}>{job.title}</span>
            </Typography>
            <IconButton onClick={() => { setOpenModal(false); setAiFeedback(null); }}><Close /></IconButton>
          </Box>

          <Box sx={{ p: { xs: 3, md: 4 } }}>
            {isEvaluatingAi ? (
              /* TRẠNG THÁI 1: ĐANG PHÂN TÍCH */
              <Box sx={{ py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress size={60} sx={{ color: '#00b14f', mb: 3 }} />
                <Typography variant="h6" fontWeight={600}>Đang ứng tuyển và phân tích CV...</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                  Hệ thống AI đang đánh giá mức độ phù hợp. Vui lòng đợi trong giây lát.
                </Typography>
              </Box>
            ) : aiFeedback ? (
              /* TRẠNG THÁI 2: KẾT QUẢ AI */
              <Box>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CheckCircle sx={{ fontSize: 60, color: '#00b14f', mb: 1 }} />
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
                  <Button variant="contained" onClick={() => { setOpenModal(false); setAiFeedback(null); }} sx={{ bgcolor: '#00b14f' }}>Hoàn tất</Button>
                </Box>
              </Box>
            ) : (
              /* TRẠNG THÁI 3: FORM ĐIỀN */
              <Stack spacing={2.5}>
                <Box sx={{ border: "2px dashed #00b14f", borderRadius: 2, p: 2, textAlign: "center", bgcolor: "#f0fff4" }}>
                  <CloudUpload sx={{ color: "#00b14f", mb: 1 }} />
                  <Typography variant="body2" fontWeight={600}>Tải lên CV (.pdf, .doc)</Typography>
                  <Button variant="outlined" size="small" component="label" sx={{ mt: 1 }}>
                    Chọn file
                    <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} />
                  </Button>
                  {cvFile && <Typography variant="caption" display="block" sx={{ mt: 1, color: "#00b14f" }}>{cvFile.name}</Typography>}
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
                  <Button type="submit" variant="contained" disabled={applying} sx={{ bgcolor: "#00b14f" }}>
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
   