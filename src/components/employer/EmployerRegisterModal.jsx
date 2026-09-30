import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { registerHr } from "../../services/auth/authService";
import { useToast } from "../../contexts/ToastContext";
import {
  validateEmployerRegister,
  getAuthErrorMessage,
} from "../../utils/authValidation";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    borderRadius: "8px",
    bgcolor: "#ffffff",
    transition: "all 0.15s ease-in-out",
    "& fieldset": {
      borderColor: "#cbd5e1", // border-slate-300
      borderWidth: "1px",
    },
    "&:hover fieldset": {
      borderColor: "#94a3b8",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb", // blue-600
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
    },
  },
  "& input": {
    fontWeight: 500,
    fontSize: "0.9rem",
    color: "#0f172a",
    py: 0,
    "&::placeholder": {
      color: "#94a3b8",
      opacity: 1,
    },
  },
};

const EmployerRegisterModal = ({ open, onClose, selectedPlan = "" }) => {
  const navigate = useNavigate();
  const showToast = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setForm({
        fullName: "",
        email: "",
        companyName: "",
        password: "",
      });
      setShowPassword(false);
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateEmployerRegister(form);
    if (!validation.isValid) {
      showToast(validation.error, "error");
      return;
    }

    setLoading(true);
    try {
      await registerHr({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        companyName: form.companyName.trim(),
        password: form.password,
        industryName: "Công nghệ thông tin",
        address: "",
        description: "",
      });
      showToast(
        "Đăng ký tài khoản Doanh nghiệp thành công! Đang chuyển hướng...",
        "success"
      );
      onClose();
      setTimeout(() => {
        navigate("/login", {
          state: {
            registeredEmail: form.email,
            isEmployer: true,
          },
        });
      }, 1000);
    } catch (err) {
      showToast(getAuthErrorMessage(err, "Đăng ký tài khoản doanh nghiệp thất bại. Vui lòng thử lại!"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {/* Backdrop tối mờ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(15, 23, 42, 0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Modal Card */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              bgcolor: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
              border: "1px solid #f1f5f9",
              p: { xs: 2.5, sm: 3.5 },
              zIndex: 1,
            }}
          >
            {/* Nút Close góc phải */}
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                position: "absolute",
                top: 14,
                right: 14,
                color: "#94a3b8",
                "&:hover": {
                  color: "#0f172a",
                  bgcolor: "#f1f5f9",
                },
              }}
            >
              <Close fontSize="small" />
            </IconButton>

            {/* Header Modal */}
            <Box sx={{ textAlign: "center", mb: 2.5 }}>
              {selectedPlan && (
                <Chip
                  label={`Gói: ${selectedPlan}`}
                  size="small"
                  sx={{
                    mb: 1.5,
                    fontWeight: 700,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    border: "1px solid #dbeafe",
                  }}
                />
              )}
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "1.25rem", sm: "1.35rem" },
                  fontWeight: 800,
                  color: "#0f172a", // text-slate-900
                  letterSpacing: "-0.3px",
                  lineHeight: 1.3,
                }}
              >
                Đăng ký tài khoản Doanh nghiệp
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b", // text-slate-500
                  fontSize: "0.875rem",
                  mt: 0.5,
                }}
              >
                Bắt đầu đăng tin và tìm kiếm nhân tài cùng CareerGo
              </Typography>
            </Box>

            {/* Form Inputs */}
            <Stack
              component="form"
              onSubmit={handleSubmit}
              spacing={1.75}
              noValidate
            >
              {/* 1. Họ và tên người liên hệ / HR */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#334155",
                    mb: 0.5,
                  }}
                >
                  Họ và tên người đại diện / HR
                </Typography>
                <TextField
                  fullWidth
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  required
                  sx={inputStyle}
                />
              </Box>

              {/* 2. Email doanh nghiệp */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#334155",
                    mb: 0.5,
                  }}
                >
                  Email doanh nghiệp
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  required
                  sx={inputStyle}
                />
              </Box>

              {/* 3. Tên công ty / Doanh nghiệp */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#334155",
                    mb: 0.5,
                  }}
                >
                  Tên công ty / Doanh nghiệp
                </Typography>
                <TextField
                  fullWidth
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Công ty TNHH Công Nghệ ABC"
                  required
                  sx={inputStyle}
                />
              </Box>

              {/* 4. Mật khẩu */}
              <Box>
                <Typography
                  component="label"
                  sx={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "#334155",
                    mb: 0.5,
                  }}
                >
                  Mật khẩu
                </Typography>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: "#94a3b8" }}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <VisibilityOff fontSize="small" />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyle}
                />
              </Box>

              {/* Nút CTA chính */}
              <Box sx={{ pt: 0.75 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.4,
                    borderRadius: "8px",
                    bgcolor: "#2563eb",
                    color: "#ffffff",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                    },
                  }}
                >
                  {loading ? (
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CircularProgress size={18} color="inherit" />
                      <span>Đang tạo tài khoản...</span>
                    </Stack>
                  ) : (
                    "Đăng ký tài khoản ngay"
                  )}
                </Button>
              </Box>

              {/* Footer Modal */}
              <Box sx={{ textAlign: "center", pt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ color: "#64748b", fontSize: "0.85rem" }}
                >
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    onClick={onClose}
                    style={{
                      color: "#2563eb",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Đăng nhập ngay
                  </Link>
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    color: "#94a3b8",
                    fontSize: "0.75rem",
                    mt: 1.25,
                    lineHeight: 1.4,
                  }}
                >
                  Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của chúng tôi.
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default EmployerRegisterModal;
