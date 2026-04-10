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
} from "@mui/material";
import {
  Work,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import AuthLayout from "../components/AuthLayout";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(form);
      const token = res.data.token;

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Decode token để lấy role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Điều hướng theo role
      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "HR") {
        navigate("/hr");
      } else {
        navigate("/user");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    }
  };

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
          // Đổ bóng mềm mại tạo chiều sâu (Soft Shadow)
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.08)",
          bgcolor: "background.paper",
        }}
      >
        {/* Phần đầu của Form */}
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

        {/* Nội dung Form */}
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
              fontWeight: "600",
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

          <Box sx={{ mt: 2 }}>
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