import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
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

/* ===== STYLE CHO MODAL ===== */
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: 650 },
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
  if (!token) return null;
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

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [applying, setApplying] = useState(false);

  // State cho Modal và Form ứng tuyển
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    targetLocation: "",
    coverLetter: "",
    agreeTerms: false,
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
      try {
        const res = await axios.get(`http://localhost:8080/api/public/jobs/${id}`);
        setJob(res.data);
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
      alert("Vui lòng đăng nhập để thực hiện chức năng này");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/user/jobs/favorite/${id}`,
        null,
        { headers: authHeader }
      );
      setIsFavorite(!isFavorite);
    } catch (err) {
      alert("Không thể thực hiện thao tác yêu thích");
    }
  };

  /* ===== 4. XỬ LÝ MỞ MODAL ỨNG TUYỂN ===== */
  const handleOpenApplyModal = () => {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      alert("Vui lòng đăng nhập để ứng tuyển");
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
      alert("Vui lòng tải lên file CV của bạn");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Bạn cần đồng ý với điều khoản để tiếp tục");
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
      await axios.post(
        `http://localhost:8080/api/user/jobs/apply/${id}`,
        submitData,
        {
          headers: {
            ...authHeader,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Ứng tuyển thành công! Nhà tuyển dụng sẽ xem xét hồ sơ của bạn.");
      setOpenModal(false);
      setCvFile(null);
    } catch (err) {
      alert(err.response?.data?.message || "Ứng tuyển thất bại");
    } finally {
      setApplying(false);
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

            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant={isFavorite ? "contained" : "outlined"}
                color={isFavorite ? "error" : "primary"}
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleToggleFavorite}
                sx={{ borderRadius: 2, flex: 1, textTransform: "none", fontWeight: 700, py: 1.5 }}
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
                sx={{ py: 2, fontWeight: 800, borderRadius: 2, flex: 2.5, bgcolor: "#00b14f", "&:hover": { bgcolor: "#008f3f" }, textTransform: "none" }}
              >
                {remainingDays !== null && remainingDays <= 0 ? "Hết hạn ứng tuyển" : "Ứng tuyển ngay"}
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* MODAL ỨNG TUYỂN */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Box sx={{ p: 2.5, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={700}>
              Ứng tuyển <span style={{ color: "#00b14f" }}>{job.title}</span>
            </Typography>
            <IconButton onClick={() => setOpenModal(false)}><Close /></IconButton>
          </Box>

          <Box sx={{ p: 3 }} component="form" onSubmit={handleApplySubmit}>
            <Stack spacing={3}>
              <Box sx={{ border: "2px dashed #00b14f", borderRadius: 2, p: 3, textAlign: "center", bgcolor: "#f0fff4" }}>
                <CloudUpload sx={{ fontSize: 40, color: "#00b14f", mb: 1 }} />
                <Typography variant="body1" fontWeight={600}>Tải lên CV từ máy tính</Typography>
                <Typography variant="caption" color="text.secondary">Hỗ trợ .doc, .docx, .pdf dưới 5MB</Typography>
                <Box mt={2}>
                  <Button variant="contained" component="label" sx={{ bgcolor: "#eee", color: "#333", "&:hover": { bgcolor: "#ddd" } }}>
                    Chọn CV
                    <input hidden type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCvFile(e.target.files[0])} />
                  </Button>
                </Box>
                {cvFile && (
                  <Stack direction="row" justifyContent="center" alignItems="center" mt={2} spacing={1} sx={{ color: "#00b14f" }}>
                    <CheckCircle fontSize="small" />
                    <Typography variant="body2" fontWeight={700}>{cvFile.name}</Typography>
                  </Stack>
                )}
              </Box>

              <TextField
                label="Họ và tên *" fullWidth size="small"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email *" fullWidth size="small" type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số điện thoại *" fullWidth size="small"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </Grid>
              </Grid>


              <Box>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Description fontSize="small" color="success" /> Thư giới thiệu:
                </Typography>
                <TextField
                  placeholder="Viết thư giới thiệu ngắn gọn..."
                  multiline rows={4} fullWidth
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                />
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    color="success"
                  />
                }
                label={
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Tôi đã đọc và đồng ý với {" "}
                    <Link 
                      onClick={() => navigate("/privacy-policy")} // Dùng navigate để giữ state
                      sx={{ color: "#00b14f", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}
                    >
                      "Thoả thuận sử dụng dữ liệu cá nhân"
                    </Link>{" "}
                    của Nhà tuyển dụng
                  </Typography>
                }
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setOpenModal(false)} sx={{ px: 4 }}>Hủy</Button>
                <Button
                  type="submit" variant="contained" disabled={applying}
                  sx={{ bgcolor: "#00b14f", px: 4, "&:hover": { bgcolor: "#008f3f" } }}
                >
                  {applying ? "Đang xử lý..." : "Nộp hồ sơ ứng tuyển"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Modal>
    </UserLayout>
  );
}