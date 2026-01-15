"use client";

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
  PersonAdd, 
  Email, 
  Lock, 
  Person, 
  Visibility, 
  VisibilityOff 
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import AuthLayout from "../components/AuthLayout";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = form;
      await register(registerData);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          textAlign: "center",
          boxShadow: "0px 15px 35px rgba(0, 0, 0, 0.1)",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              mb: 2,
              bgcolor: "primary.main",
              mx: "auto",
              width: 56,
              height: 56,
              boxShadow: "0 4px 12px rgba(30, 123, 164, 0.2)",
            }}
          >
            <PersonAdd fontSize="medium" />
          </Avatar>
          <Typography variant="h4" fontWeight="700" color="primary.dark" gutterBottom>
            ĐĂNG KÝ
          </Typography>
          <Typography variant="body2" color="text.secondary">
           Bắt đầu hành trình tìm kiếm sự nghiệp mơ ước của bạn ngay hôm nay.
          </Typography>
        </Box>

        {/* Form */}
        <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
          <TextField
            name="fullName"
            label="Họ và tên"
            required
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            required
            fullWidth
            onChange={handleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          {/* Ô Mật khẩu */}
          <TextField
            name="password"
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            onChange={handleChange}
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

          {/* Ô Nhập lại mật khẩu */}
          <TextField
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            type={showConfirmPassword ? "text" : "password"}
            required
            fullWidth
            onChange={handleChange}
            error={form.confirmPassword !== "" && form.password !== form.confirmPassword}
            helperText={
                form.confirmPassword !== "" && form.password !== form.confirmPassword 
                ? "Mật khẩu không khớp" 
                : ""
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            fullWidth
            sx={{
              mt: 1,
              py: 1.6,
              borderRadius: 2,
              fontWeight: "600",
              textTransform: "none",
              // background: "linear-gradient(135deg, #1e7ba4, #2fa1c4)",
              background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(30, 123, 164, 0.3)",
              },
            }}
          >
            {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
          </Button>

          <Typography variant="body2" color="text.secondary">
            Đã có tài khoản?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1e7ba4", fontWeight: "700" }}>
              Đăng nhập
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </AuthLayout>
  );
}