import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AutoAwesome, CheckCircle } from "@mui/icons-material";

export default function ApplicationAiResult({ feedback, onDone }) {
  return (
    <Box>
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <CheckCircle sx={{ fontSize: 60, color: "#10b981", mb: 1 }} />
        <Typography variant="h5" fontWeight={700} color="success.main">
          Ứng tuyển thành công!
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{ p: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 2 }}
      >
        <Typography variant="subtitle1" fontWeight={700} mb={2} display="flex" alignItems="center" gap={1}>
          <AutoAwesome color="primary" fontSize="small" /> Đánh giá từ AI
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Box sx={{ position: "relative", display: "flex" }}>
            <CircularProgress variant="determinate" value={100} size={70} sx={{ color: "#e2e8f0" }} />
            <CircularProgress
              variant="determinate"
              value={feedback.score}
              size={70}
              sx={{ position: "absolute", color: feedback.score >= 70 ? "#10b981" : "#f59e0b" }}
            />
            <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
              <Typography fontWeight={800}>{feedback.score}%</Typography>
            </Box>
          </Box>
          <Typography variant="body2">{feedback.summary}</Typography>
        </Stack>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" fontWeight={700} color="success.main">ƯU ĐIỂM:</Typography>
            {feedback.strengths?.map((strength) => (
              <Typography key={strength} variant="caption" display="block">• {strength}</Typography>
            ))}
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="caption" fontWeight={700} color="error.main">CẦN CẢI THIỆN:</Typography>
            {feedback.weaknesses?.map((weakness) => (
              <Typography key={weakness} variant="caption" display="block">• {weakness}</Typography>
            ))}
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button variant="contained" onClick={onDone}>Hoàn tất</Button>
      </Box>
    </Box>
  );
}
