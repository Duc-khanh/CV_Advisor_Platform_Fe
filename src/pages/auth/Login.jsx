import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Avatar,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Work,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  AutoAwesome,
} from "@mui/icons-material";
import { Google } from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import AuthLayout from "../../layouts/AuthLayout";
import { login, loginWithGoogle } from "../../services/auth/authService";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../../contexts/ToastContext";

const normalizeToken = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    return value.trim().replace(/^Bearer\s+/i, "");
  }
  return null;
};

const navigateByRole = (role, navigate) => {
  if (role === "ADMIN") navigate("/admin_dashboard");
  else if (role === "HR") navigate("/hr_dashboard");
  else navigate("/");
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.removeItem("token");

    try {
      const res = await login(form);
      const rawToken =
        res.data.token || res.data.accessToken || res.data.access_token;

      const token = normalizeToken(rawToken);
      if (!token) throw new Error("Không nhận được token đăng nhập");

      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);

      showToast("Đăng nhập thành công!", "success");
      navigateByRole(decoded.role, navigate);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      showToast(
        err.response?.data?.message ||
          err.response?.statusText ||
          err.message ||
          "Đăng nhập thất bại. Vui lòng thử lại!",
        "error"
      );
    }
  };

  const loginGoogle = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        localStorage.removeItem("token");

        const res = await loginWithGoogle(tokenResponse.access_token);
        const rawToken =
          res.data.token || res.data.accessToken || res.data.access_token;

        const token = normalizeToken(rawToken);
        if (!token) throw new Error("Không nhận được token đăng nhập");

        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);

        showToast("Đăng nhập thành công!", "success");
        navigateByRole(decoded.role, navigate);
      } catch (err) {
        console.error("Google login error:", err.response?.data || err.message);
        showToast(
          err.response?.data?.message || "Đăng nhập bằng Google thất bại!",
          "error"
        );
      }
    },
    onError: (error) => {
      console.error("Google OAuth error:", error);
      showToast("Không thể mở cửa sổ đăng nhập Google!", "error");
    },
  });

  return (
    <AuthLayout>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: { xs: 2, md: 4 },
          background:
            "linear-gradient(135deg, #eaf4ff 0%, #f8fbff 50%, #e8f1fb 100%)",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 1060,
            minHeight: 600,
            display: "flex",
            overflow: "hidden",
            borderRadius: "34px",
            boxShadow: "0 28px 80px rgba(15, 23, 42, 0.16)",
            bgcolor: "#fff",
          }}
        >
          {/* LEFT SIDE */}
          <Box
            sx={{
              width: { xs: "0%", md: "55%" },
              display: { xs: "none", md: "flex" },
              position: "relative",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              px: 6,
              color: "#fff",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 45%, #2563eb 100%)",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 360,
                height: 360,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.13)",
                top: -120,
                left: -100,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: 300,
                height: 300,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.12)",
                bottom: -90,
                right: -80,
              }}
            />

            <Box
              sx={{
                position: "absolute",
                width: "120%",
                height: 180,
                borderRadius: "50%",
                bgcolor: "rgba(255,255,255,0.12)",
                top: 40,
                left: -80,
                transform: "rotate(-8deg)",
              }}
            />

            <Avatar
              sx={{
                width: 88,
                height: 88,
                mb: 2,
                bgcolor: "rgba(255,255,255,0.22)",
                color: "#fff",
                boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Work sx={{ fontSize: 44 }} />
            </Avatar>

            <Typography
              sx={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                mb: 1,
                zIndex: 2,
              }}
            >
              HireAI
            </Typography>

            <Typography
  sx={{
    fontSize: 18,
    fontWeight: 700,
    opacity: 0.95,
    mb: 2,
    zIndex: 2,
  }}
>
  Nền tảng kết nối nghề nghiệp 
</Typography>

            <Typography
              sx={{
                maxWidth: 370,
                fontSize: 14.5,
                lineHeight: 1.8,
                opacity: 0.9,
                zIndex: 2,
              }}
            >
              Khám phá cơ hội việc làm phù hợp, tạo CV chuyên nghiệp và kết nối với các doanh nghiệp hàng đầu.
{/* với các doanh nghiệp hàng đầu bằng công nghệ AI thông minh. */}
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 4, zIndex: 3 }}>
              {["Việc làm", "CV Thông minh", "Kết nối doanh nghiệp"].map((item) => (
                <Box
                  key={item}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: "999px",
                    bgcolor: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    fontSize: 13,
                    fontWeight: 700,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {item}
                </Box>
              ))}
            </Stack>
{/* 
            <Box
              sx={{
                position: "absolute",
                bottom: 34,
                left: 44,
                right: 44,
                p: 2,
                borderRadius: "22px",
                bgcolor: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                zIndex: 3,
              }} */}
            {/* > */}
              {/* <Avatar sx={{ bgcolor: "#fff", color: "#2563eb" }}>
                <AutoAwesome />
              </Avatar> */}

              {/* <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={800} fontSize={14}>
                  Gợi ý công việc thông minh
                </Typography>
                <Typography fontSize={12.5} sx={{ opacity: 0.88 }}>
                  AI tự động đề xuất công việc phù hợp với kỹ năng và kinh nghiệm của bạn.
                </Typography>
              </Box> */}
            {/* </Box> */}
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              width: { xs: "100%", md: "45%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 5, md: 6 },
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 360 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 900,
                    color: "#1976d2",
                    mb: 0.8,
                  }}
                >
                  Chào mừng trở lại
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: 14.5,
                    fontWeight: 500,
                  }}
                >
                  Đăng nhập để tiếp tục sử dụng hệ thống tuyển dụng
                </Typography>
              </Box>

              <Stack spacing={2.2} component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="email"
                  placeholder="Email"
                  type="email"
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#64748b" }} fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "999px",
                      bgcolor: "#bfe8dd",
                      color: "#0f172a",
                      px: 1,
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": {
                        border: "2px solid #38bdf8",
                      },
                    },
                    "& input": {
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#0f172a",
                    },
                    "& input::placeholder": {
                      color: "#64748b",
                      opacity: 1,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  placeholder="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#64748b" }} fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "999px",
                      bgcolor: "#bfe8dd",
                      px: 1,
                      "& fieldset": { border: "none" },
                      "&:hover fieldset": { border: "none" },
                      "&.Mui-focused fieldset": {
                        border: "2px solid #38bdf8",
                      },
                    },
                    "& input": {
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#0f172a",
                    },
                    "& input::placeholder": {
                      color: "#64748b",
                      opacity: 1,
                    },
                  }}
                />

                <Box sx={{ textAlign: "right", mt: -1 }}>
                  <Link
                    to="/forgot-password"
                    style={{
                      fontSize: 12.5,
                      color: "#64748b",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Quên mật khẩu?
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  sx={{
                    py: 1.25,
                    borderRadius: "999px",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    background:
                      "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
                    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.28)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)",
                      boxShadow: "0 10px 24px rgba(37, 99, 235, 0.36)",
                    },
                  }}
                >
                  Đăng nhập
                </Button>

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 13,
                    color: "#64748b",
                  }}
                >
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#1976d2",
                      fontWeight: 800,
                      textDecoration: "none",
                    }}
                  >
                    Đăng ký ngay
                  </Link>
                </Typography>

                <Divider sx={{ color: "#94a3b8", fontSize: 12 }}>
                  hoặc
                </Divider>

                <Button
  variant="outlined"
  fullWidth
  onClick={() => loginGoogle()}
  sx={{
    py: 1.25,
    borderRadius: "999px",
    textTransform: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#202124",
    borderColor: "#dadce0",
    bgcolor: "#fff",
    boxShadow: "none",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 1.2,

    "&:hover": {
      bgcolor: "#f8fafd",
      borderColor: "#dadce0",
      boxShadow: "0 1px 3px rgba(60,64,67,.18)",
    },
  }}
>
  <Box
    component="img"
    src="https://developers.google.com/identity/images/g-logo.png"
    alt="Google"
    sx={{
      width: 20,
      height: 20,
    }}
  />

  Tiếp tục với Google
</Button>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AuthLayout>
  );
}