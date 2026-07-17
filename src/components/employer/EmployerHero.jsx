import React from "react";
import { Box, Typography, Button, Stack, Container, Grid } from "@mui/material";
import { Speed, GroupAdd, BarChart } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EmployerHero = () => {
  const navigate = useNavigate();

  const stats = [
    {
      icon: <Speed fontSize="small" />,
      label: "Tiết kiệm 50%",
      sub: "thời gian sàng lọc CV",
    },
    {
      icon: <GroupAdd fontSize="small" />,
      label: "Tăng 80%",
      sub: "ứng viên phù hợp",
    },
    {
      icon: <BarChart fontSize="small" />,
      label: "Giảm chi phí",
      sub: "tuyển dụng hiệu quả",
    },
  ];

  return (
    <Box
      sx={{
        pt: { xs: 8, md: 11 },
        pb: { xs: 7, md: 10 },
        background:
          "radial-gradient(circle at 85% 25%, rgba(37,99,235,0.12) 0%, rgba(37,99,235,0.04) 28%, transparent 45%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
        overflow: "hidden",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, md: 6, lg: 10 },
        }}
      >
        <Grid
          container
          spacing={{ xs: 4, md: 8 }}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={5.4}>
            <Box sx={{ maxWidth: "580px" }}>
              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  color: "#1e293b",
                  mb: 3,
                  lineHeight: 1.12,
                  letterSpacing: "-1.5px",
                  fontSize: {
                    xs: "2.3rem",
                    sm: "3rem",
                    md: "3.6rem",
                  },
                }}
              >
                Giải pháp tuyển dụng{" "}
                <Box
                  component="span"
                  sx={{
                    color: "#2563eb",
                    display: { xs: "inline", md: "block" },
                  }}
                >
                  đột phá
                </Box>{" "}
                cho doanh nghiệp
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  mb: 4.5,
                  fontWeight: 500,
                  lineHeight: 1.75,
                  maxWidth: "560px",
                  fontSize: { xs: "1rem", md: "1.08rem" },
                }}
              >
                AI Recruit giúp doanh nghiệp tìm kiếm và tuyển dụng nhân tài
                nhanh hơn,
                {/* <br /> */}
                thông minh hơn với sự hỗ trợ của trí tuệ nhân tạo.
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 3, md: 3 }}
                sx={{ mb: 5 }}
              >
                {stats.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      alignItems: "center",
                      minWidth: { sm: 135 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: "14px",
                        bgcolor: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2563eb",
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight={800}
                        color="#1e293b"
                        sx={{ lineHeight: 1.2 }}
                      >
                        {item.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="#64748b"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        {item.sub}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() =>
                    navigate("/register", { state: { isHr: true } })
                  }
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: "12px",
                    bgcolor: "#2563eb",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "1rem",
                    boxShadow: "0 18px 35px rgba(37,99,235,0.28)",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                      boxShadow: "0 20px 40px rgba(37,99,235,0.34)",
                    },
                  }}
                >
                  Đăng ký tuyển dụng ngay
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: "12px",
                    borderColor: "#dbe3ef",
                    color: "#64748b",
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "1rem",
                    bgcolor: "#ffffff",
                    "&:hover": {
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      bgcolor: "#f8fafc",
                    },
                  }}
                >
                  Xem demo
                </Button>
              </Stack>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            md={6.6}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: { xs: "540px", md: "640px" },
                mt: { xs: 2, md: 0 },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: "8% -4% -6% 8%",
                  bgcolor: "#2563eb",
                  borderRadius: "36px",
                  opacity: 0.07,
                  transform: "rotate(3deg)",
                  zIndex: 0,
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  top: -35,
                  right: -30,
                  width: 130,
                  height: 130,
                  opacity: 0.35,
                  backgroundImage:
                    "radial-gradient(#bfdbfe 1.6px, transparent 1.6px)",
                  backgroundSize: "14px 14px",
                  zIndex: 0,
                  display: { xs: "none", md: "block" },
                }}
              />

              <Box
                component="img"
                src="/image/hero/hr-dashboard.jpg"
                alt="HR Dashboard"
                sx={{
                  width: "100%",
                  maxWidth: "640px",
                  display: "block",
                  borderRadius: "28px",
                  boxShadow:
                    "0 30px 80px rgba(15, 23, 42, 0.12), 0 12px 30px rgba(37, 99, 235, 0.12)",
                  position: "relative",
                  zIndex: 1,
                  objectFit: "contain",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployerHero;