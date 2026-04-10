import { Paper, Typography, Box, Grid, LinearProgress, Chip, Stack } from "@mui/material";
import { CheckCircle, ErrorOutline, AutoAwesome } from "@mui/icons-material";

export default function AIAnalysisCard({ score, strengths, weaknesses, missingSkills }) {
  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <AutoAwesome sx={{ color: "#8b5cf6" }} />
        <Typography variant="h5" fontWeight={800} color="#1e293b">Phân tích CV bằng AI</Typography>
      </Stack>

      <Grid container spacing={4}>
        {/* Điểm số */}
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: '#f8fafc', borderRadius: 4 }}>
            <Typography variant="h2" fontWeight={900} color="#6366f1">{score}</Typography>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>Chỉ số phù hợp (%)</Typography>
            <LinearProgress variant="determinate" value={score} sx={{ height: 10, borderRadius: 5, mt: 2, bgcolor: "#e2e8f0", "& .MuiLinearProgress-bar": { borderRadius: 5, bgcolor: "#6366f1" } }} />
          </Box>
        </Grid>

        {/* Điểm mạnh/Yếu */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="success.main" fontWeight={700} gutterBottom>✓ ĐIỂM MẠNH</Typography>
              <Stack spacing={1}>
                {strengths.map((s, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="body2">{s}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="error.main" fontWeight={700} gutterBottom>⚠ ĐIỂM YẾU</Typography>
              <Stack spacing={1}>
                {weaknesses.map((w, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ErrorOutline sx={{ fontSize: 16, color: '#f43f5e' }} />
                    <Typography variant="body2">{w}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="warning.main" fontWeight={700} mb={1}>⚡ KỸ NĂNG CẦN BỔ SUNG</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {missingSkills.map((skill, i) => (
                <Chip key={i} label={skill} size="small" sx={{ bgcolor: '#fff7ed', color: '#c2410c', fontWeight: 600, border: '1px solid #fdba74' }} />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}