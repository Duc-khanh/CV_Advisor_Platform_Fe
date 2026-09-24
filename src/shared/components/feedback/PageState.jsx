import { Box, CircularProgress, Typography } from "@mui/material";

export default function PageState({
  loading = false,
  title,
  description,
  minHeight = "50vh",
}) {
  return (
    <Box
      role={loading ? "status" : undefined}
      sx={{
        minHeight,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        px: 3,
        textAlign: "center",
      }}
    >
      {loading && <CircularProgress size={48} />}
      {title && <Typography variant="h6" fontWeight={700}>{title}</Typography>}
      {description && <Typography color="text.secondary">{description}</Typography>}
    </Box>
  );
}
