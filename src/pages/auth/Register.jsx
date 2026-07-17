"use client";

import { useState, useEffect } from "react";
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
  Tabs,
  Tab,
} from "@mui/material";
import {
  PersonAdd,
  Email,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
  Business,
  Public,
  LocationOn,
  Description,
  AutoAwesome,
  Work,
} from "@mui/icons-material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { register, registerHr } from "../../services/auth/authService";
import AuthLayout from "../../layouts/AuthLayout";
import { useToast } from "../../contexts/ToastContext";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    industryName: "",
    address: "",
    description: "",
  });

  const [isHr, setIsHr] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  useEffect(() => {
    if (location.state?.isHr) {
      setIsHr(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("Mật khẩu nhập lại không khớp!", "error");
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = form;

      if (isHr) {
        await registerHr(registerData);
      } else {
        await register({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
      }

      showToast("Đăng ký thành công!", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Đăng ký thất bại", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      minHeight: 46,
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
  };

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
            maxWidth: 1120,
            minHeight: 640,
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
              <AutoAwesome sx={{ fontSize: 44 }} />
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
              Nền tảng kết nối nghề nghiệp AI
            </Typography>

            <Typography
              sx={{
                maxWidth: 390,
                fontSize: 14.5,
                lineHeight: 1.8,
                opacity: 0.9,
                zIndex: 2,
              }}
            >
              Tạo tài khoản để khám phá việc làm phù hợp, xây dựng CV chuyên
              nghiệp và kết nối với nhà tuyển dụng uy tín.
            </Typography>

            <Stack direction="row" spacing={1.5} sx={{ mt: 4, zIndex: 3 }}>
              {["CV AI", "Việc làm phù hợp", "Kết nối doanh nghiệp"].map(
                (item) => (
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
                )
              )}
            </Stack>

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
              }}
            >
              <Avatar sx={{ bgcolor: "#fff", color: "#2563eb" }}>
                <Work />
              </Avatar>

              <Box sx={{ textAlign: "left" }}>
                <Typography fontWeight={800} fontSize={14}>
                  Bắt đầu hành trình nghề nghiệp
                </Typography>
                <Typography fontSize={12.5} sx={{ opacity: 0.88 }}>
                  Ứng viên và nhà tuyển dụng cùng kết nối trên một nền tảng
                  thông minh.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT SIDE */}
          <Box
            sx={{
              width: { xs: "100%", md: "45%" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 3, sm: 5, md: 6 },
              py: { xs: 5, md: 5 },
              bgcolor: "#ffffff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 380 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Avatar
                  sx={{
                    width: 58,
                    height: 58,
                    mx: "auto",
                    mb: 1.5,
                    bgcolor: "#1976d2",
                    color: "#fff",
                    boxShadow: "0 10px 24px rgba(25,118,210,0.25)",
                  }}
                >
                  <PersonAdd />
                </Avatar>

                <Typography
                  sx={{
                    fontSize: 31,
                    fontWeight: 900,
                    color: "#1976d2",
                    mb: 0.8,
                  }}
                >
                  Tạo tài khoản
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: 14.5,
                    fontWeight: 500,
                  }}
                >
                  Đăng ký để bắt đầu sử dụng hệ thống tuyển dụng
                </Typography>
              </Box>

              <Tabs
                value={isHr ? 1 : 0}
                onChange={(e, val) => setIsHr(val === 1)}
                variant="fullWidth"
                sx={{
                  mb: 2.5,
                  minHeight: 44,
                  p: 0.5,
                  borderRadius: "999px",
                  bgcolor: "#f1f5f9",
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                  "& .MuiTab-root": {
                    minHeight: 36,
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 800,
                    color: "#64748b",
                  },
                  "& .Mui-selected": {
                    bgcolor: "#fff",
                    color: "#1976d2 !important",
                    boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
                  },
                }}
              >
                <Tab label="Ứng viên" />
                <Tab label="Nhà tuyển dụng" />
              </Tabs>

              <Stack spacing={1.8} component="form" onSubmit={handleSubmit}>
                <TextField
                  name="fullName"
                  placeholder="Họ và tên"
                  required
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "#64748b" }} fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                <TextField
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                  fullWidth
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "#64748b" }} fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                <TextField
                  name="password"
                  placeholder="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  required
                  fullWidth
                  onChange={handleChange}
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
                  sx={inputSx}
                />

                <TextField
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  fullWidth
                  onChange={handleChange}
                  error={
                    form.confirmPassword !== "" &&
                    form.password !== form.confirmPassword
                  }
                  helperText={
                    form.confirmPassword !== "" &&
                    form.password !== form.confirmPassword
                      ? "Mật khẩu không khớp"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#64748b" }} fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                          size="small"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={inputSx}
                />

                {isHr && (
                  <>
                    <TextField
                      name="companyName"
                      placeholder="Tên công ty"
                      required
                      fullWidth
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business
                              sx={{ color: "#64748b" }}
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />

                    <TextField
                      name="industryName"
                      placeholder="Lĩnh vực hoạt động"
                      required
                      fullWidth
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Public
                              sx={{ color: "#64748b" }}
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />

                    <TextField
                      name="address"
                      placeholder="Địa chỉ công ty"
                      required
                      fullWidth
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn
                              sx={{ color: "#64748b" }}
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={inputSx}
                    />

                    <TextField
                      name="description"
                      placeholder="Mô tả công ty"
                      multiline
                      rows={3}
                      fullWidth
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{ alignSelf: "flex-start", mt: 1 }}
                          >
                            <Description
                              sx={{ color: "#64748b" }}
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        ...inputSx,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "22px",
                          bgcolor: "#bfe8dd",
                          px: 1,
                          alignItems: "flex-start",
                          "& fieldset": { border: "none" },
                          "&:hover fieldset": { border: "none" },
                          "&.Mui-focused fieldset": {
                            border: "2px solid #38bdf8",
                          },
                        },
                        "& textarea": {
                          fontWeight: 600,
                          color: "#0f172a",
                        },
                        "& textarea::placeholder": {
                          color: "#64748b",
                          opacity: 1,
                        },
                      }}
                    />
                  </>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  sx={{
                    mt: 0.5,
                    py: 1.25,
                    borderRadius: "999px",
                    fontWeight: 800,
                    textTransform: "none",
                    fontSize: "0.95rem",
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
                  {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
                </Button>

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: 13,
                    color: "#64748b",
                    pt: 0.5,
                  }}
                >
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: "none",
                      color: "#1976d2",
                      fontWeight: 800,
                    }}
                  >
                    Đăng nhập
                  </Link>
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AuthLayout>
  );
}