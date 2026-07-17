import React from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";

const ScoreDisplay = ({ score = 0, summary }) => {
  const scoreLabel =
    score >= 80
      ? "Rất tốt"
      : score >= 65
      ? "Khá tốt"
      : score >= 50
      ? "Trung bình"
      : "Cần cải thiện";

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="subtitle2"
        fontWeight="700"
        mb={3}
        color="#64748b"
        sx={{
          textTransform: "uppercase",
          fontSize: "0.75rem",
          letterSpacing: "0.5px",
        }}
      >
        Điểm số
      </Typography>

      {/* Layout ngang */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        alignItems="center"
      >
        {/* Circle Score */}
        <Box
          sx={{
            position: "relative",
            width: 170,
            height: 170,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Outer Progress */}
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
              boxShadow: "0 10px 30px rgba(59,130,246,0.15)",
            }}
          >
            {/* Inner Circle */}
            <Box
              sx={{
                width: 132,
                height: 132,
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
                fontWeight="900"
                color="#2563eb"
                sx={{ lineHeight: 1 }}
              >
                {score}%
              </Typography>

              {/* <Typography
                variant="caption"
                fontWeight="700"
                color="#94a3b8"
                sx={{
                  mt: 0.5,
                  letterSpacing: "1px",
                }}
              >
                MATCH SCORE
              </Typography> */}
            </Box>
          </Box>
        </Box>

        {/* Summary */}
        <Box sx={{ flex: 1 }}>
          <Chip
            label={scoreLabel}
            size="small"
            sx={{
              bgcolor:
                score >= 80
                  ? "#dcfce7"
                  : score >= 65
                  ? "#dbeafe"
                  : "#fef3c7",

              color:
                score >= 80
                  ? "#15803d"
                  : score >= 65
                  ? "#1d4ed8"
                  : "#b45309",

              fontWeight: 800,
              px: 1,
              mb: 2,
            }}
          />

          {summary && (
            <Typography
              variant="body1"
              color="#475569"
              sx={{
                lineHeight: 1.9,
                fontSize: "1rem",
              }}
            >
              {summary}
            </Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default ScoreDisplay;