import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  CheckCircle,
  ErrorOutline,
  AutoAwesome,
  AddCircleOutline,
} from "@mui/icons-material";

export default function AIAnalysisCard({
  score = 0,
  strengths = [],
  weaknesses = [],
  missingSkills = [],
}) {
  const scoreLabel =
    score >= 80
      ? "Rất tốt"
      : score >= 65
      ? "Khá tốt"
      : score >= 50
      ? "Trung bình"
      : "Cần cải thiện";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 4,
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <AutoAwesome sx={{ color: "#2563eb" }} />
        <Typography variant="h5" fontWeight={800} color="#1e293b">
          Kết quả phân tích
        </Typography>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "260px minmax(0, 1fr) 280px",
          },
          gap: 3,
          alignItems: "stretch",
        }}
      >
      
<Paper
  elevation={0}
  sx={{
    p: 3,
    borderRadius: 3,
    border: "1px solid #e2e8f0",
    bgcolor: "#f8fafc",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  }}
>
  <Typography fontWeight={800} mb={3} color="#1e293b">
    Chỉ số phù hợp
  </Typography>

  {/* Circle Progress */}
  <Box
    sx={{
      position: "relative",
      width: 150,
      height: 150,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      mb: 2,
    }}
  >
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `conic-gradient(
          #3b82f6 ${score * 3.6}deg,
          #e2e8f0 ${score * 3.6}deg
        )`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 118,
          height: 118,
          borderRadius: "50%",
          bgcolor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 2px 10px rgba(0,0,0,0.04)",
        }}
      >
        <Typography
          variant="h3"
          fontWeight={900}
          color="#2563eb"
          sx={{ lineHeight: 1 }}
        >
          {score}%
        </Typography>
      </Box>
    </Box>
  </Box>

  <Chip
    label={scoreLabel}
    size="small"
    sx={{
      bgcolor: "#dcfce7",
      color: "#15803d",
      fontWeight: 700,
      mb: 2,
    }}
  />

  <Typography
    variant="body2"
    color="#64748b"
    sx={{
      maxWidth: 220,
      lineHeight: 1.7,
    }}
  >
    CV của bạn phù hợp với vị trí mục tiêu
  </Typography>
</Paper>

        {/* Điểm mạnh + điểm yếu: cố định 2 cột bằng nhau */}
        <Box
          sx={{
            minWidth: 0,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #bbf7d0",
              bgcolor: "#f0fdf4",
              minWidth: 0,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="subtitle2"
              color="#15803d"
              fontWeight={800}
              mb={1.5}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <CheckCircle sx={{ fontSize: 18 }} />
              ĐIỂM MẠNH
            </Typography>

            <Stack spacing={1.2}>
              {strengths.map((s, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <CheckCircle
                    sx={{
                      fontSize: 16,
                      color: "#10b981",
                      mt: "3px",
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#334155"
                    sx={{
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {s}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid #fecaca",
              bgcolor: "#fef2f2",
              minWidth: 0,
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Typography
              variant="subtitle2"
              color="#dc2626"
              fontWeight={800}
              mb={1.5}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ErrorOutline sx={{ fontSize: 18 }} />
              ĐIỂM YẾU
            </Typography>

            <Stack spacing={1.2}>
              {weaknesses.map((w, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    minWidth: 0,
                  }}
                >
                  <ErrorOutline
                    sx={{
                      fontSize: 16,
                      color: "#f43f5e",
                      mt: "3px",
                      flexShrink: 0,
                    }}
                  />

                  <Typography
                    variant="body2"
                    color="#334155"
                    sx={{
                      lineHeight: 1.6,
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {w}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        {/* Kỹ năng cần bổ sung */}
        {/* Kỹ năng cần bổ sung */}
<Paper
  elevation={0}
  sx={{
    p: 2.5,
    borderRadius: 3,
    bgcolor: "#fff7ed",
    minWidth: 0,
    height: "100%",
    boxSizing: "border-box",
  }}
>
  <Typography
    variant="subtitle2"
    color="#c2410c"
    fontWeight={800}
    mb={1.5}
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <AddCircleOutline sx={{ fontSize: 18 }} />
    KỸ NĂNG CẦN BỔ SUNG
  </Typography>

  <Stack spacing={1.2}>
    {missingSkills.map((skill, i) => (
      <Box
        key={i}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 1,
          minWidth: 0,
        }}
      >
        <AddCircleOutline
          sx={{
            fontSize: 16,
            color: "#f97316",
            mt: "3px",
            flexShrink: 0,
          }}
        />

        <Typography
          variant="body2"
          color="#334155"
          sx={{
            lineHeight: 1.6,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {skill}
        </Typography>
      </Box>
    ))}
  </Stack>
</Paper>
      </Box>
    </Paper>
  );
}