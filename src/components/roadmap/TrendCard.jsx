import React from "react";
import { Card, CardContent, Typography, Stack } from "@mui/material";

const TrendCard = ({ trend }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      bgcolor: "#f8fafc",
      height: "100%",
      transition: "all 0.3s ease",
      "&:hover": {
        borderColor: "#16a34a",
        boxShadow: "0 8px 20px rgba(22, 163, 74, 0.08)",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography
        variant="body2"
        fontWeight="700"
        color="#16a34a"
        mb={1.5}
      >
        {trend.skill || trend.topic}
      </Typography>
      <Stack spacing={0.75}>
        {trend.demand && (
          <Typography variant="caption" color="#64748b" display="block">
            <strong>Nhu cầu:</strong> {trend.demand}
          </Typography>
        )}
        {trend.salary && (
          <Typography variant="caption" color="#64748b" display="block">
            <strong>Lương:</strong> {trend.salary}
          </Typography>
        )}
      </Stack>
    </CardContent>
  </Card>
);

export default TrendCard;
