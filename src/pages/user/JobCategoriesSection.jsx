import React from "react";
import { Box, Container, Grid, Paper, Typography } from "@mui/material";

export default function JobCategoriesSection({ jobCategories }) {
  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight="800" textAlign="center" sx={{ mb: 2, color: "#0f172a" }}>
          Khám Phá Ngành Nghề Nổi Bật
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 6, color: "#64748b" }}>
          Tìm kiếm cơ hội nghề nghiệp trong các lĩnh vực hàng đầu
        </Typography>

        <Grid container spacing={3}>
          {jobCategories.map((  category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#4f46e5",
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.15)",
                    transform: "translateY(-5px)",
                  },
                }}
              >
                <Box sx={{ color: "#4f46e5", mb: 2 }}>{category.icon}</Box>
                <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: "#1e293b" }}>
                  {category.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {category.count} việc làm
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
