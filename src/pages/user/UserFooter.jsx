import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Facebook,
  LinkedIn,
  Twitter,
  YouTube,
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const UserFooter = () => {
  const navigate = useNavigate();
  const primaryColor = "#2563eb";

  const candidateLinks = [
    { label: "Tìm việc làm IT", to: "/" },
    { label: "Tạo CV Chuyên nghiệp", to: "/cv-builder" },
    { label: "Phân tích CV bằng AI", to: "/cv-analysis", badge: "AI" },
    { label: "Lộ trình học tập", to: "/career-roadmap", badge: "Hot" },
    { label: "Luyện phỏng vấn AI", to: "/ai-interview" },
    { label: "Cẩm nang nghề nghiệp", to: "/career-guide" },
  ];

  const employerLinks = [
    { label: "Đăng tin tuyển dụng", to: "/for-employers" },
    { label: "Tìm kiếm ứng viên", to: "/for-employers" },
    { label: "Bảng giá dịch vụ", to: "/for-employers" },
    { label: "Giải pháp Tuyển dụng AI", to: "/for-employers" },
  ];

  const supportLinks = [
    { label: "Trung tâm hỗ trợ", to: "/privacy-policy" },
    { label: "Điều khoản dịch vụ", to: "/privacy-policy" },
    { label: "Chính sách bảo mật", to: "/privacy-policy" },
    { label: "Liên hệ hợp tác", to: "/for-employers" },
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        color: "#1e293b",
        mt: "auto",
        width: "100%",
        position: "relative",
      }}
    >
      {/* TOP GLOW ACCENT BAR */}
      <Box
        sx={{
          height: "3px",
          width: "100%",
          background: "linear-gradient(90deg, #2563eb 0%, #38bdf8 50%, #818cf8 100%)",
        }}
      />

      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 7 }, pb: 4 }}>
        <Grid container spacing={{ xs: 4, md: 5 }}>
          {/* BRAND COLUMN */}
          <Grid item xs={12} md={4.5}>
            {/* LOGO */}
            <Box
              onClick={() => {
                navigate("/");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
                mb: 2,
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="CareerGo Logo"
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  mr: 1.2,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "1.25rem", sm: "1.35rem" },
                  letterSpacing: "-0.5px",
                  color: "#0f172a",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                Career<Box component="span" sx={{ color: "#2563eb", ml: "1px" }}>Go</Box>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                lineHeight: 1.75,
                maxWidth: 420,
                mb: 3,
                fontSize: "0.875rem",
              }}
            >
              CareerGo — Nền tảng phát triển sự nghiệp thông minh ứng dụng AI,
              giúp ứng viên tìm việc, xây dựng CV chuẩn chuyên gia và hỗ trợ doanh nghiệp
              tuyển dụng nhân tài nhanh chóng, chuẩn xác.
            </Typography>

            {/* SOCIAL ICONS */}
            <Stack direction="row" spacing={1.2}>
              {[
                { icon: <Facebook fontSize="small" />, link: "#" },
                { icon: <LinkedIn fontSize="small" />, link: "#" },
                { icon: <Twitter fontSize="small" />, link: "#" },
                { icon: <YouTube fontSize="small" />, link: "#" },
              ].map((item, index) => (
                <IconButton
                  key={index}
                  size="small"
                  sx={{
                    bgcolor: "#e2e8f0",
                    color: "#475569",
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: primaryColor,
                      color: "#ffffff",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 10px rgba(37,99,235,0.25)",
                    },
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* ỨNG VIÊN */}
          <Grid item xs={6} sm={4} md={2.5}>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{
                mb: 2,
                color: "#0f172a",
                fontSize: "0.95rem",
                letterSpacing: "-0.2px",
              }}
            >
              Dành cho Ứng Viên
            </Typography>

            <Stack spacing={1.2}>
              {candidateLinks.map((item, idx) => (
                <Box
                  key={idx}
                  component={Link}
                  to={item.to}
                  sx={{
                    color: "#475569",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.8,
                    transition: "all 0.2s ease",
                    width: "fit-content",
                    "&:hover": {
                      color: primaryColor,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: item.badge === "AI" ? "#eff6ff" : "#fef2f2",
                        color: item.badge === "AI" ? "#2563eb" : "#ef4444",
                        border: item.badge === "AI" ? "1px solid #bfdbfe" : "1px solid #fecaca",
                        px: 0.2,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* DOANH NGHIỆP */}
          <Grid item xs={6} sm={4} md={2.2}>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{
                mb: 2,
                color: "#0f172a",
                fontSize: "0.95rem",
                letterSpacing: "-0.2px",
              }}
            >
              Doanh Nghiệp
            </Typography>

            <Stack spacing={1.2}>
              {employerLinks.map((item, idx) => (
                <Box
                  key={idx}
                  component={Link}
                  to={item.to}
                  sx={{
                    color: "#475569",
                    fontSize: "0.875rem",
                    textDecoration: "none",
                    fontWeight: 500,
                    display: "inline-block",
                    transition: "all 0.2s ease",
                    width: "fit-content",
                    "&:hover": {
                      color: primaryColor,
                      transform: "translateX(4px)",
                    },
                  }}
                >
                  {item.label}
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* LIÊN HỆ */}
          <Grid item xs={12} sm={4} md={2.8}>
            <Typography
              variant="subtitle2"
              fontWeight="800"
              sx={{
                mb: 2,
                color: "#0f172a",
                fontSize: "0.95rem",
                letterSpacing: "-0.2px",
              }}
            >
              Liên Hệ & Hỗ Trợ
            </Typography>

            <Stack spacing={1.8}>
              <Box display="flex" alignItems="flex-start" gap={1.2}>
                <LocationOn
                  sx={{
                    color: primaryColor,
                    fontSize: 20,
                    mt: 0.2,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.6, fontSize: "0.875rem" }}
                >
                  Tòa nhà CareerGo Tower, Cầu Giấy, Hà Nội
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.2}>
                <Phone
                  sx={{
                    color: primaryColor,
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontSize: "0.875rem", fontWeight: 700 }}
                >
                  1900 6868
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1.2}>
                <Email
                  sx={{
                    color: primaryColor,
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", fontSize: "0.875rem" }}
                >
                  support@careergo.vn
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider sx={{ borderColor: "#e2e8f0", my: 3.5 }} />

        {/* BOTTOM COPYRIGHT & LEGAL */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "center" }}
          spacing={2}
          sx={{
            pr: { xs: 0, sm: 4, md: 10 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              fontSize: "0.8125rem",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            © {new Date().getFullYear()} CareerGo. All rights reserved.
          </Typography>

          <Stack
            direction="row"
            spacing={{ xs: 2, sm: 3 }}
            flexWrap="wrap"
            justifyContent="center"
          >
            {supportLinks.map((item, idx) => (
              <Box
                key={idx}
                component={Link}
                to={item.to}
                sx={{
                  color: "#64748b",
                  fontSize: "0.8125rem",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.15s ease",
                  "&:hover": {
                    color: primaryColor,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default UserFooter;
