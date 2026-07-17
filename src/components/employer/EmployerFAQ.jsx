import React from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Paper,
  Button
} from "@mui/material";
import { ExpandMore, HeadsetMic } from "@mui/icons-material";

const faqs = [
  {
    q: "Làm sao để tin tuyển dụng hiện lên đầu trang?",
    a: "Hệ thống AI sẽ tự động đề xuất tin tuyển dụng dựa trên mức độ phù hợp. Ngoài ra, bạn có thể sử dụng các gói dịch vụ đẩy tin để tăng khả năng tiếp cận ứng viên."
  },
  {
    q: "Hệ thống bảo mật thông tin ứng viên như thế nào?",
    a: "Chúng tôi cam kết bảo mật 100% dữ liệu ứng viên và doanh nghiệp theo tiêu chuẩn quốc tế. Thông tin chỉ được chia sẻ khi có sự đồng ý của các bên."
  },
  {
    q: "Có hỗ trợ đăng nhập bằng tài khoản LinkedIn không?",
    a: "Có, hệ thống cho phép đồng bộ thông tin từ LinkedIn để giúp bạn tạo hồ sơ doanh nghiệp và đăng tin nhanh chóng hơn."
  },
  {
    q: "Tôi có thể dùng thử trước khi đăng ký không?",
    a: "Tất nhiên, bạn có thể bắt đầu với gói Starter miễn phí hoặc đăng ký dùng thử 7 ngày gói Professional để trải nghiệm đầy đủ tính năng."
  }
];

const EmployerFAQ = () => {
  return (
    <Box sx={{ py: 10, bgcolor: "#f8fafc" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography 
            variant="overline" 
            sx={{ color: "#2563eb", fontWeight: 800, letterSpacing: 2 }}
          >
            CÂU HỎI THƯỜNG GẶP
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={900} 
            sx={{ color: "#1e293b", mt: 1 }}
          >
            Giải đáp thắc mắc của bạn
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { md: "1.5fr 1fr" }, gap: 4 }}>
          <Box>
            {faqs.map((item, index) => (
              <Accordion 
                key={index}
                elevation={0}
                sx={{ 
                  mb: 2, 
                  borderRadius: "16px !important",
                  "&:before": { display: "none" },
                  border: "1px solid #f1f5f9",
                  bgcolor: "#ffffff",
                  overflow: "hidden"
                }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight={700} color="#1e293b">{item.q}</Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                  <Typography color="#64748b" sx={{ lineHeight: 1.6 }}>{item.a}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: "24px",
              bgcolor: "#ffffff",
              border: "1px solid #eff6ff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              justifyContent: "center"
            }}
          >
            <Box sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              bgcolor: "#eff6ff", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#2563eb",
              mb: 3
            }}>
              <HeadsetMic sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h6" fontWeight={800} color="#1e293b" sx={{ mb: 1 }}>
              Bạn cần hỗ trợ thêm?
            </Typography>
            <Typography variant="body2" color="#64748b" sx={{ mb: 3, lineHeight: 1.6 }}>
              Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: "#2563eb",
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700
              }}
            >
              Liên hệ ngay
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default EmployerFAQ;
