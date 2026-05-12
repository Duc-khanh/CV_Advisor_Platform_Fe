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
} from "@mui/icons-material";
import { Google } from "@mui/icons-material";
import { useGoogleLogin } from "@react-oauth/google";
import AuthLayout from "../components/AuthLayout";
import { login, loginWithGoogle } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useToast } from "../contexts/ToastContext";

const normalizeToken = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    return value.trim().replace(/^Bearer\s+/i, "");
  }
  return null;
};

const navigateByRole = (role, navigate) => {
  if (role === "ADMIN") navigate("/admin");
  else if (role === "HR") navigate("/hr");
  else navigate("/user");
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ── Đăng nhập thường ──────────────────────────────────────
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

  // ── Đăng nhập Google (useGoogleLogin → access_token) ──────
  const loginGoogle = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      try {
        localStorage.removeItem("token");
        console.log(
          "[Google] access_token:",
          tokenResponse.access_token?.substring(0, 30) + "..."
        );

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
        console.error(
          "Google login error:",
          err.response?.data || err.message
        );
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
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          width: "100%",
          maxWidth: 480,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Avatar
            sx={{
              mb: 2,
              bgcolor: "primary.main",
              mx: "auto",
              width: 60,
              height: 60,
              boxShadow: "0 4px 10px rgba(25, 118, 210, 0.2)",
            }}
          >
            <Work fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight="700" color="primary.dark" gutterBottom>
            ĐĂNG NHẬP
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Đăng nhập để kết nối với các cơ hội nghề nghiệp tốt nhất.
          </Typography>
        </Box>

        {/* Form */}
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Địa chỉ Email"
            type="email"
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            name="password"
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            onChange={handleChange}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              py: 1.6,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
              },
            }}
          >
            Đăng nhập ngay
          </Button>

          <Divider sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            hoặc
          </Divider>

          {/* Google Login Button */}
       <Button
  variant="outlined"
  fullWidth
  size="large"
  onClick={() => loginGoogle()}
  startIcon={<Google />}
  sx={{
    py: 1.6,
    borderRadius: 2.5,
    textTransform: "none",
    fontSize: "1rem",
    fontWeight: 600,

    // Màu Google chuẩn hơn
    color: "#4285F4",
    borderColor: "#DADCE0",
    backgroundColor: "#fff",

    boxShadow: "0 1px 2px rgba(60,64,67,.15)",

    "&:hover": {
      backgroundColor: "#F8FAFF",
      borderColor: "#4285F4",
      boxShadow: "0 2px 6px rgba(66,133,244,.25)",
    },

    "&:active": {
      backgroundColor: "#EEF4FF",
    },
  }}
>
  Đăng nhập bằng Google
</Button>

          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Bạn chưa có tài khoản?{" "}
              <Link
                to="/register"
                style={{
                  textDecoration: "none",
                  color: "#1976d2",
                  fontWeight: "700",
                }}
              >
                Đăng ký ngay
              </Link>
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </AuthLayout>
  );
}