import React from "react";
import { Box, Button, Container, Stack, Typography } from "@mui/material";

export default function HomeCTASection({ onCreateCv }) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#4f46e5", position: "relative", overflow: "hidden" }}>
      <Box
        sx={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
        <Typography variant="h3" fontWeight="900" sx={{ color: "#ffffff", mb: 3, fontSize: { xs: "2rem", md: "3rem" } }}>
          Sẵn sàng nâng tầm sự nghiệp?
        </Typography>
        <Typography variant="h6" sx={{ color: "#e0e7ff", mb: 5, fontWeight: 400 }}>
          Hàng ngàn nhà tuyển dụng đang chờ đợi hồ sơ của bạn. Hãy để AI giúp bạn kết nối với họ ngay hôm nay.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
          <Button
            onClick={onCreateCv}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#ffffff",
              color: "#4f46e5",
              fontWeight: 800,
              px: 5,
              py: 2,
              borderRadius: 50,
              "&:hover": { bgcolor: "#f8fafc" },
            }}
          >
            Tạo CV Ngay
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "rgba(255,255,255,0.5)",
              color: "#ffffff",
              fontWeight: 800,
              px: 5,
              py: 2,
              borderRadius: 50,
              "&:hover": { borderColor: "#ffffff", bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            Tìm Việc Làm
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
