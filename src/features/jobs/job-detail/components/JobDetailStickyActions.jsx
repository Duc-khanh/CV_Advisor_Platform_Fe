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
  const city = job.location?.split(",").pop().trim() || "Hà Nội";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: "#ffffff",
        borderTop: "1px solid #e2e8f0",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        py: 2,
        display: { xs: "none", md: "block" },
      }}
    >
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={getMediaUrl(job.companyLogo)}
              variant="rounded"
              sx={{ width: 44, height: 44, border: "1px solid #e2e8f0", borderRadius: "6px" }}
            >
              {job.companyName?.charAt(0).toUpperCase() || "C"}
            </Avatar>
            <Box>
              <Typography fontWeight={850} color="#0f172a" sx={{ fontSize: "0.95rem", lineHeight: 1.3 }}>
                {job.title}
              </Typography>
              <Typography variant="caption" color="#64748b" fontWeight={750}>
                {job.companyName} · {city} ·{" "}
                <Box component="span" sx={{ color: "#10b981", fontWeight: 800 }}>
                  {job.salaryRange || "Thỏa thuận"}
                </Box>
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={isFavorite ? <Favorite sx={{ color: "#ef4444" }} /> : <FavoriteBorder />}
              onClick={onToggleFavorite}
              sx={{ px: 3, py: 1, fontWeight: 800, borderRadius: "8px", textTransform: "none" }}
            >
              {isFavorite ? "Đã lưu tin" : "Lưu tin"}
            </Button>
            <Button
              variant="contained"
              startIcon={<Send sx={{ transform: "rotate(-30deg)" }} />}
              disabled={isExpired}
              onClick={onApply}
              sx={{ px: 4, py: 1, fontWeight: 800, borderRadius: "8px", textTransform: "none" }}
            >
              {isExpired ? "Đã hết hạn" : "Ứng tuyển ngay"}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
