import React from "react";
import { Box, Typography, Container, Grid, Paper, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const plans = [
  {
    title: "Starter",
    price: "Miễn phí",
    desc: "Dành cho doanh nghiệp nhỏ mới bắt đầu",
    features: [
      "Đăng tối đa 3 tin tuyển dụng",
      "Quản lý tối đa 50 ứng viên",
      "Sàng lọc CV cơ bản",
      "Hỗ trợ qua email"
    ],
    buttonText: "Dùng thử miễn phí",
    popular: false
  },
  {
    title: "Professional",
    price: "990.000đ",
    unit: "/ tháng",
    desc: "Dành cho doanh nghiệp vừa và nhỏ",
    features: [
      "Đăng tin không giới hạn",
      "Quản lý không giới hạn ứng viên",
      "Sàng lọc AI thông minh",
      "Báo cáo & Phân tích nâng cao",
      "Hỗ trợ ưu tiên"
    ],
    buttonText: "Dùng thử 7 ngày",
    popular: true
  },
  {
    title: "Enterprise",
    price: "Liên hệ",
    desc: "Giải pháp tùy chỉnh cho doanh nghiệp lớn",
    features: [
      "Tất cả tính năng Professional",
      "Tích hợp API & SSO",
      "Tư vấn & Triển khai riêng",
      "Hỗ trợ 24/7"
    ],
    buttonText: "Liên hệ tư vấn",
    popular: false
  }
];

const EmployerPricing = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#ffffff" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
          >
            BẢNG GIÁ
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={900} 
            sx={{ color: "#1e293b", mt: 1 }}
          >
            Lựa chọn gói dịch vụ phù hợp với doanh nghiệp
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={plan.popular ? 20 : 0}
                sx={{
                  p: 4,
                  borderRadius: "24px",
                  border: plan.popular ? "none" : "1px solid #f1f5f9",
                  bgcolor: "#ffffff",
                  position: "relative",
                  transition: "all 0.3s ease",
                  ...(plan.popular && {
                    transform: { md: "scale(1.05)" },
                    boxShadow: "0 25px 50px rgba(37,99,235,0.15)"
                  })
                }}
              >
                {plan.popular && (
                  <Chip 
                    label="Phổ biến nhất" 
                    color="primary"
                    sx={{ 
                      position: "absolute", 
                      top: 20, 
                      right: 20, 
                      fontWeight: 700,
                      bgcolor: "#2563eb"
                    }} 
                  />
                )}
                
                <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mb: 1 }}>
                  {plan.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
                  <Typography variant="h4" fontWeight={900} color="#2563eb">
                    {plan.price}
                  </Typography>
                  {plan.unit && (
                    <Typography variant="body2" color="#64748b" sx={{ ml: 1 }}>
                      {plan.unit}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body2" color="#64748b" sx={{ mb: 4 }}>
                  {plan.desc}
                </Typography>

                <List sx={{ mb: 4 }}>
                  {plan.features.map((feature, fIndex) => (
                    <ListItem key={fIndex} disableGutters sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature} 
                        primaryTypographyProps={{ 
                          variant: "body2", 
                          fontWeight: 500,
                          color: "#334155"
                        }} 
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  fullWidth
                  variant={plan.popular ? "contained" : "outlined"}
                  size="large"
                  sx={{
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 700,
                    ...(plan.popular && {
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1d4ed8" }
                    })
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default EmployerPricing;
