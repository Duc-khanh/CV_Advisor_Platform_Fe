import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { registerHr } from "../../services/auth/authService";
import { useToast } from "../../contexts/ToastContext";
import {
  validateEmployerRegister,
  getAuthErrorMessage,
} from "../../utils/authValidation";

// Minimalist, high-conversion input style: clean borders, focus ring, no clutter
const inputStyle = {
  "& .MuiOutlinedInput-root": {
    height: 46,
    borderRadius: "10px",
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
      borderColor: "#2563eb", // brand blue
      borderWidth: "1.5px",
    },
    "&.Mui-focused": {
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.12)",
    },
  },
  "& input": {
    fontWeight: 500,
    fontSize: "0.9375rem",
    color: "#0f172a",
    py: 0,
    "&::placeholder": {
      color: "#94a3b8",
      opacity: 1,
    },
  },
};

const EmployerRegisterSection = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    companyName: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();

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
        industryName: "",
        address: "",
        description: "",
      });

      showToast(
        "Đăng ký tài khoản Doanh nghiệp thành công! Vui lòng đăng nhập để bắt đầu.",
        "success"
      );
      navigate("/login");
    } catch (err) {
      showToast(
        getAuthErrorMessage(
          err,
          "Đăng ký tài khoản doanh nghiệp thất bại. Vui lòng thử lại!"
        ),
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      id="employer-register"
      sx={{
        py: { xs: 6, md: 9 },
        bgcolor: "#f8fafc",
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
        scrollMarginTop: "70px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 1. Container căn giữa (mx-auto, max-width: 500px) */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "500px",
          mx: "auto",
          px: { xs: 2, sm: 0 },
        }}
      >
        {/* 2. Card: Nền trắng, bo góc rounded-2xl, viền border border-slate-100, shadow-md, padding: 32px */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: "24px", sm: "32px" },
            borderRadius: "16px", // rounded-2xl
            bgcolor: "#ffffff",
            border: "1px solid #f1f5f9", // border-slate-100
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)", // shadow-md
          }}
        >
          {/* 3. Căn giữa tiêu đề và phụ đề */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: "1.35rem", sm: "1.55rem" },
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.4px",
                mb: 0.5,
              }}
            >
              Đăng ký tài khoản Doanh nghiệp
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                fontSize: "0.875rem",
              }}
            >
              Tạo tài khoản miễn phí chỉ trong vài phút
            </Typography>
          </Box>

          {/* 4. Giữ lại đúng 4 trường (loại bỏ Xác nhận mật khẩu) */}
          {/* 5. Input spacing: space-y-3.5 (14px: spacing={1.75}) */}
          <Stack
            component="form"
            onSubmit={handleSubmit}
            spacing={1.75} // space-y-3.5 (14px)
            noValidate
          >
            {/* Trường 1: Họ tên HR */}
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

            {/* Trường 2: Email doanh nghiệp */}
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
                placeholder="hr@congty.com"
                required
                sx={inputStyle}
              />
            </Box>

            {/* Trường 3: Tên công ty */}
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
                placeholder="Công ty TNHH Giải Pháp Công Nghệ ABC"
                required
                sx={inputStyle}
              />
            </Box>

            {/* Trường 4: Mật khẩu (có icon ẩn/hiện con mắt) */}
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
                        sx={{ color: "#64748b" }}
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

            {/* Nút bấm (CTA) */}
            <Box sx={{ pt: 1 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  height: 48,
                  borderRadius: "10px",
                  bgcolor: "#2563eb", // Brand Blue
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "none",
                  transition: "all 0.15s ease-in-out",
                  "&:hover": {
                    bgcolor: "#1d4ed8",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                  },
                }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Đang xử lý...</span>
                  </Stack>
                ) : (
                  "Đăng ký tài khoản ngay"
                )}
              </Button>
            </Box>

            {/* Footer form */}
            <Box sx={{ textAlign: "center", pt: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", fontSize: "0.85rem" }}
              >
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
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
                Bằng việc đăng ký, bạn đồng ý với Điều khoản dịch vụ & Chính
                sách bảo mật của chúng tôi.
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default EmployerRegisterSection;
