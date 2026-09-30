import React from "react";
import { Paper, Typography, Grid } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import TrendCard from "./TrendCard";

const MarketTrendsSection = ({ roadmap }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <TrendingUp color="success" />
      Xu hướng thị trường
    </Typography>

    <Grid container spacing={2.5}>
      {(roadmap.marketTrends || []).map((trend, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <TrendCard trend={trend} />
        </Grid>
      ))}
    </Grid>
  </Paper>
);

export default MarketTrendsSection;
