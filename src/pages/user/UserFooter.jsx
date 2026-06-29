import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link,
  Divider,
  Stack,
  IconButton,
  Container,
} from "@mui/material";

import {
  LocationOn,
  Phone,
  Email,
  Facebook,
  Twitter,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";

const UserFooter = () => {
  const primaryColor = "#2563eb";

  const footerLinks = {
    candidate: [
      "Tìm việc làm",
      "Phân tích CV bằng AI",
      "Tạo CV Online",
      "Cẩm nang nghề nghiệp",
    ],
    employer: [
      "Đăng tin tuyển dụng",
      "Tìm kiếm nhân tài",
      "Quản lý ứng viên",
      "Giải pháp HR AI",
    ],
    support: [
      "Trung tâm hỗ trợ",
      "Điều khoản dịch vụ",
      "Chính sách bảo mật",
      "Liên hệ",
    ],
  };

  return (
    <Box
      sx={{
        bgcolor: "#f8fafc",
        borderTop: "1px solid #e2e8f0",
        color: "#1e293b",
        pt: 10,
        pb: 4,
        mt: 10,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* BRAND */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 3.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
                }}
              >
                R
              </Box>
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{
                  color: "#0f172a",
                  letterSpacing: "0.5px",
                }}
              >
                Recruit<span style={{ color: "#2563eb" }}></span>
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "#475569",
                lineHeight: 1.9,
                maxWidth: 450,
                mb: 4,
              }}
            >
              Nền tảng tuyển dụng thông minh ứng dụng AI giúp ứng viên
              phát triển sự nghiệp và hỗ trợ doanh nghiệp tìm kiếm nhân tài
              phù hợp nhanh chóng, chính xác và hiệu quả.
            </Typography>

            {/* SOCIAL */}
            <Stack direction="row" spacing={1.5}>
              {[Facebook, LinkedIn, Twitter, YouTube].map(
                (Icon, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      bgcolor: "#e2e8f0",
                      color: "#475569",
                      width: 42,
                      height: 42,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: primaryColor,
                        color: "#fff",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                )
              )}
            </Stack>
          </Grid>

          {/* LINKS */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              sx={{ mb: 3, color: "#0f172a" }}
            >
              Ứng Viên
            </Typography>

            <Stack spacing={2}>
              {footerLinks.candidate.map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    color: "#475569",
                    fontSize: "0.9rem",
                    transition: "0.2s",
                    "&:hover": {
                      color: primaryColor,
                      pl: 0.5,
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* EMPLOYER */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              sx={{ mb: 3, color: "#0f172a" }}
            >
              Doanh Nghiệp
            </Typography>

            <Stack spacing={2}>
              {footerLinks.employer.map((item) => (
                <Link
                  key={item}
                  href="#"
                  underline="none"
                  sx={{
                    color: "#475569",
                    fontSize: "0.9rem",
                    transition: "0.2s",
                    "&:hover": {
                      color: primaryColor,
                      pl: 0.5,
                    },
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              sx={{ mb: 3, color: "#0f172a" }}
            >
              Liên Hệ
            </Typography>

            <Stack spacing={3}>
              <Box display="flex">
                <LocationOn
                  sx={{
                    mr: 1.5,
                    color: primaryColor,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.7 }}
                >
                  QTSC Innovation Building,
                  Quận 12, TP. Hồ Chí Minh
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Phone
                  sx={{
                    mr: 1.5,
                    color: primaryColor,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#475569" }}
                >
                  1900 123 456
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Email
                  sx={{
                    mr: 1.5,
                    color: primaryColor,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#475569" }}
                >
                  contact@jobify.vn
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider
          sx={{
            borderColor: "#e2e8f0",
            my: 6,
          }}
        />

        {/* BOTTOM */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#64748b",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © {new Date().getFullYear()} HireAI.
            All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {footerLinks.support.map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "#64748b",
                  fontSize: "0.85rem",
                  "&:hover": {
                    color: primaryColor,
                  },
                }}
              >
                {item}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default UserFooter;