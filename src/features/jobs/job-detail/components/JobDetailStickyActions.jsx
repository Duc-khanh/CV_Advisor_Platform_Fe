import React from "react";
import { Avatar, Box, Button, Container, Stack, Typography } from "@mui/material";
import { Favorite, FavoriteBorder, Send } from "@mui/icons-material";
import { getMediaUrl } from "../../../../utils/urlHelpers";

export default function JobDetailStickyActions({
  job,
  isFavorite,
  isExpired,
  onApply,
  onToggleFavorite,
}) {
  const city = job.location?.split(",").pop().trim() || "Toàn quốc";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: "rgba(255, 255, 255, 0.92)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -10px 30px rgba(14, 165, 233, 0.08), 0 -2px 10px rgba(15, 23, 42, 0.04)",
        py: 1.8,
        display: { xs: "none", md: "block" },
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={getMediaUrl(job.companyLogo)}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                bgcolor: "#f8fafc",
                color: "#0284c7",
                fontWeight: 900,
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              {job.companyName?.charAt(0).toUpperCase() || "C"}
            </Avatar>
            <Box>
              <Typography fontWeight={850} color="#0f172a" sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
                {job.title}
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={750} sx={{ fontSize: "0.82rem" }}>
                {job.companyName} · {city} ·{" "}
                <Box component="span" sx={{ color: "#16a34a", fontWeight: 800 }}>
                  {job.salaryRange || "Thỏa thuận"}
                </Box>
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={
                isFavorite ? (
                  <Favorite sx={{ color: "#ef4444", fontSize: 20 }} />
                ) : (
                  <FavoriteBorder sx={{ fontSize: 20 }} />
                )
              }
              onClick={onToggleFavorite}
              sx={{
                px: 3,
                py: 1.1,
                fontWeight: 800,
                borderRadius: "12px",
                textTransform: "none",
                borderColor: "#e2e8f0",
                color: isFavorite ? "#ef4444" : "#64748b",
                bgcolor: isFavorite ? "#fef2f2" : "#ffffff",
                "&:hover": {
                  borderColor: "#ef4444",
                  bgcolor: "#fff5f5",
                  color: "#ef4444",
                },
                transition: "all 0.2s",
              }}
            >
              {isFavorite ? "Đã lưu" : "Lưu tin"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Send sx={{ transform: "rotate(-30deg)", fontSize: 18 }} />}
              disabled={isExpired}
              onClick={onApply}
              sx={{
                px: 4,
                py: 1.1,
                fontWeight: 800,
                borderRadius: "12px",
                textTransform: "none",
                background: isExpired
                  ? "#94a3b8"
                  : "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                boxShadow: isExpired ? "none" : "0 8px 24px rgba(2, 132, 199, 0.3)",
                "&:hover": {
                  boxShadow: "0 12px 28px rgba(2, 132, 199, 0.45)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
              }}
            >
              {isExpired ? "Đã hết hạn" : "Ứng tuyển ngay"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
