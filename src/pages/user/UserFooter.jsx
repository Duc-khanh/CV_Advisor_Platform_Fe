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
  const primaryPurple = "#6366f1";

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
        bgcolor: "#0f172a",
        color: "#ffffff",
        pt: 10,
        pb: 4,
        mt: 10,
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={6}>
          {/* BRAND */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="h4"
              fontWeight="900"
              sx={{
                mb: 2,
                display: "flex",
                alignItems: "center",
                letterSpacing: 1,
              }}
            >
              <span style={{ color: primaryPurple }}>AI</span>
              <span style={{ marginLeft: 8 }}>RECRUIT</span>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#cbd5e1",
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
                      bgcolor: "#1e293b",
                      color: "#cbd5e1",
                      width: 42,
                      height: 42,
                      transition: "0.3s",
                      "&:hover": {
                        bgcolor: primaryPurple,
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
              sx={{ mb: 3 }}
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
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                    transition: "0.2s",
                    "&:hover": {
                      color: primaryPurple,
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
              sx={{ mb: 3 }}
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
                    color: "#cbd5e1",
                    fontSize: "0.9rem",
                    transition: "0.2s",
                    "&:hover": {
                      color: primaryPurple,
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
              sx={{ mb: 3 }}
            >
              Liên Hệ
            </Typography>

            <Stack spacing={3}>
              <Box display="flex">
                <LocationOn
                  sx={{
                    mr: 1.5,
                    color: primaryPurple,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1", lineHeight: 1.7 }}
                >
                  QTSC Innovation Building,
                  Quận 12, TP. Hồ Chí Minh
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Phone
                  sx={{
                    mr: 1.5,
                    color: primaryPurple,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1" }}
                >
                  1900 123 456
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Email
                  sx={{
                    mr: 1.5,
                    color: primaryPurple,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1" }}
                >
                  contact@airecruit.vn
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider
          sx={{
            borderColor: "#1e293b",
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
              color: "#94a3b8",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            © {new Date().getFullYear()} AI RECRUIT.
            All rights reserved.
          </Typography>

          <Stack direction="row" spacing={3}>
            {footerLinks.support.map((item) => (
              <Link
                key={item}
                href="#"
                underline="none"
                sx={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  "&:hover": {
                    color: primaryPurple,
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