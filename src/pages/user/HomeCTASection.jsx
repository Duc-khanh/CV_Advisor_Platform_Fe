import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { ArrowForward, BusinessCenter } from "@mui/icons-material";

export default function HomeCTASection({ onCreateCv }) {
  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff" }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            borderRadius: "24px",
            p: { xs: 4, md: 6 },
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 15px 35px rgba(37,99,235,0.15)",
          }}
        >
          {/* Subtle glowing circular backgrounds */}
          <Box
            sx={{
              position: "absolute",
              top: "-50%",
              right: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={4}
            sx={{ position: "relative", zIndex: 1 }}
          >
            {/* Left Content with briefcase icon */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2rem",
                }}
              >
                <BusinessCenter />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  fontWeight={900}
                  sx={{ color: "#ffffff", mb: 1, fontSize: "1.45rem", letterSpacing: "-0.01em" }}
                >
                  Sẵn sàng tìm công việc phù hợp với bạn?
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: "0.92rem" }}
                >
                  Tạo hồ sơ ngay hôm nay và nhận những cơ hội tốt nhất từ các nhà tuyển dụng hàng đầu!
                </Typography>
              </Box>
            </Stack>

            {/* Right Action Button */}
            <Box sx={{ width: { xs: "100%", md: "auto" } }}>
              <Button
                onClick={onCreateCv}
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: "#ffffff",
                  color: "#2563eb",
                  fontWeight: 900,
                  px: 4,
                  py: 1.8,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "0.95rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)",
                  width: { xs: "100%", md: "auto" },
                  "&:hover": {
                    bgcolor: "#eff6ff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                Tạo hồ sơ miễn phí
              </Button>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
