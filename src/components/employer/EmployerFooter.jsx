import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Facebook,
  LinkedIn,
  YouTube,
  Twitter,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const EmployerFooter = ({ onOpenRegister }) => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#0f172a", // bg-slate-900
        color: "#94a3b8", // text-slate-400
        pt: { xs: 7, md: 9 },
        pb: 4,
        borderTop: "1px solid #1e293b",
        mt: 8,
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 3, md: 6, lg: 8 } }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* CỘT 1: LOGO & GIỚI THIỆU */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "1rem",
                  letterSpacing: "-0.5px",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                CG
              </Box>
              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ color: "#ffffff", letterSpacing: "-0.3px" }}
              >
                Career
                <Box component="span" sx={{ color: "#38bdf8" }}>
                  Go
                </Box>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                lineHeight: 1.7,
                fontSize: "0.875rem",
                mb: 3,
                maxWidth: "340px",
              }}
            >
              Nền tảng tuyển dụng thông minh ứng dụng công nghệ AI tiên tiến, giúp
              doanh nghiệp rút ngắn 50% thời gian sàng lọc và kết nối nhanh chóng
              với nguồn nhân tài chất lượng cao.
            </Typography>

            <Stack direction="row" spacing={1}>
              {[
                { icon: <Facebook fontSize="small" />, href: "#" },
                { icon: <LinkedIn fontSize="small" />, href: "#" },
                { icon: <YouTube fontSize="small" />, href: "#" },
                { icon: <Twitter fontSize="small" />, href: "#" },
              ].map((item, i) => (
                <IconButton
                  key={i}
                  size="small"
                  sx={{
                    color: "#94a3b8",
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#38bdf8",
                      bgcolor: "rgba(56, 189, 248, 0.1)",
                      borderColor: "rgba(56, 189, 248, 0.3)",
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* CỘT 2: DÀNH CHO DOANH NGHIỆP */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: "#ffffff", mb: 2.2, fontSize: "0.95rem" }}
            >
              Dành cho Doanh nghiệp
            </Typography>
            <Stack spacing={1.5}>
              <Box
                component="span"
                onClick={() => (onOpenRegister ? onOpenRegister() : null)}
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "color 0.15s ease",
                  "&:hover": { color: "#38bdf8" },
                }}
              >
                Đăng tin tuyển dụng
              </Box>
              <Box
                component="span"
                onClick={() => (onOpenRegister ? onOpenRegister() : null)}
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "color 0.15s ease",
                  "&:hover": { color: "#38bdf8" },
                }}
              >
                Tìm kiếm ứng viên
              </Box>
              <Box
                component="span"
                onClick={() => {
                  const el = document.getElementById("employer-pricing");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "color 0.15s ease",
                  "&:hover": { color: "#38bdf8" },
                }}
              >
                Bảng giá dịch vụ
              </Box>
              <Typography
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:hover": { color: "#38bdf8" },
                }}
              >
                ATS & AI Screening
              </Typography>
              <Box
                component="span"
                onClick={() => (onOpenRegister ? onOpenRegister() : null)}
                sx={{
                  color: "#38bdf8",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Đăng ký tài khoản HR →
              </Box>
            </Stack>
          </Grid>

          {/* CỘT 3: DÀNH CHO ỨNG VIÊN */}
          <Grid item xs={12} sm={6} md={2.5}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: "#ffffff", mb: 2.2, fontSize: "0.95rem" }}
            >
              Dành cho Ứng viên
            </Typography>
            <Stack spacing={1.5}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Tìm việc làm
              </Link>
              <Link
                to="/cv-builder"
                style={{
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Tạo CV online
              </Link>
              <Link
                to="/cv-analysis"
                style={{
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Phân tích CV bằng AI
              </Link>
              <Link
                to="/career-guide"
                style={{
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Cẩm nang nghề nghiệp
              </Link>
              <Link
                to="/search"
                style={{
                  textDecoration: "none",
                  color: "#94a3b8",
                  fontSize: "0.875rem",
                }}
              >
                Khám phá việc làm nổi bật
              </Link>
            </Stack>
          </Grid>

          {/* CỘT 4: LIÊN HỆ & PHÁP LÝ */}
          <Grid item xs={12} sm={6} md={3.5}>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ color: "#ffffff", mb: 2.2, fontSize: "0.95rem" }}
            >
              Liên hệ & Pháp lý
            </Typography>
            <Stack spacing={1.8}>
              <Box sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                <LocationOn sx={{ color: "#38bdf8", fontSize: 20, mt: 0.2 }} />
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Tòa nhà CareerGo Tower, Quận Cầu Giấy, Hà Nội
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                <Phone sx={{ color: "#38bdf8", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Hotline:{" "}
                  <Box component="span" sx={{ color: "#ffffff", fontWeight: 700 }}>
                    1900 6868
                  </Box>{" "}
                  (8:00 - 18:00)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1.2, alignItems: "center" }}>
                <Email sx={{ color: "#38bdf8", fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                  Email: support@careergo.vn
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, pt: 1 }}>
                <Link
                  to="/privacy-policy"
                  style={{
                    textDecoration: "none",
                    color: "#64748b",
                    fontSize: "0.8125rem",
                  }}
                >
                  Điều khoản sử dụng
                </Link>
                <Box sx={{ color: "#334155" }}>•</Box>
                <Link
                  to="/privacy-policy"
                  style={{
                    textDecoration: "none",
                    color: "#64748b",
                    fontSize: "0.8125rem",
                  }}
                >
                  Chính sách bảo mật
                </Link>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: "#1e293b", my: 4 }} />

        {/* HÀNG BẢN QUYỀN DƯỚI CÙNG */}
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: "#64748b", fontSize: "0.8125rem" }}
          >
            © 2026 CareerGo. All rights reserved. Nền tảng kết nối nhân tài & tuyển dụng thông minh.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default EmployerFooter;
