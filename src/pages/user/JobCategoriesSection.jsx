  import React from "react";
  import { Box, Container, Grid, Paper, Typography, Link, Stack } from "@mui/material";
  import {
    Code,
    Campaign,
    TrendingUp,
    Brush,
    AccountBalance,
    People,
    ArrowForward,
  } from "@mui/icons-material";

  export default function JobCategoriesSection() {
    // 6 specific job categories matching the screenshot styling
    const categories = [
      {
        title: "Công nghệ thông tin",
        count: "1.245 việc làm",
        icon: <Code fontSize="medium" />,
        color: "#10b981",
        bgcolor: "#eafaf1",
      },
      {
        title: "Marketing",
        count: "856 việc làm",
        icon: <Campaign fontSize="medium" />,
        color: "#ec4899",
        bgcolor: "#fdf2f8",
      },
      {
        title: "Kinh doanh",
        count: "1.032 việc làm",
        icon: <TrendingUp fontSize="medium" />,
        color: "#f97316",
        bgcolor: "#fff7ed",
      },
      {
        title: "Thiết kế",
        count: "524 việc làm",
        icon: <Brush fontSize="medium" />,
        color: "#8b5cf6",
        bgcolor: "#f5f3ff",
      },
      {
        title: "Tài chính - Kế toán",
        count: "732 việc làm",
        icon: <AccountBalance fontSize="medium" />,
        color: "#06b6d4",
        bgcolor: "#ecfeff",
      },
      {
        title: "Nhân sự",
        count: "312 việc làm",
        icon: <People fontSize="medium" />,
        color: "#eab308",
        bgcolor: "#fef9c3",
      },
    ];

    return (
      <Box sx={{ py: 6, bgcolor: "#ffffff" }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header aligned Left and Right */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 4 }}
          >
            <Typography variant="h5" fontWeight={900} color="#0f172a">
              Danh mục nghề nghiệp
            </Typography>
            {/* <Link
              href="#"
              underline="none"
              sx={{
                color: "#334155",
                fontWeight: 800,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": { color: "#2563eb" },
              }}
            >
              Xem tất cả <ArrowForward sx={{ fontSize: 16 }} />
            </Link> */}
          </Stack>

          <Grid container spacing={3.5} justifyContent="center" alignItems="stretch">
            {categories.map((category, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={index} sx={{ display: "flex" }}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    minHeight: 130,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    flexGrow: 1,
                    p: 2,
                    textAlign: "center",
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#ffffff",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#dbeafe",
                      boxShadow: "0 15px 35px rgba(37,99,235,0.06)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  {/* Icon wrapper with color and bgcolor */}
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "10px",
                      bgcolor: category.bgcolor,
                      color: category.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      fontSize: "1.25rem",
                    }}
                  >
                    {category.icon}
                  </Box>

                  <Typography
                    variant="body1"
                    fontWeight={800}
                    color="#1e293b"
                    mb={0.5}
                    sx={{
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      lineHeight: 1.3,
                    }}
                  >
                    {category.title}
                  </Typography>

                  <Typography variant="caption" fontWeight={600} color="#64748b" sx={{ fontSize: "0.75rem" }}>
                    {category.count}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }
