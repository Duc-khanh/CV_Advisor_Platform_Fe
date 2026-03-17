import React, { useEffect } from "react";
import { Container, Typography, Box, Paper, Divider, Button, Stack } from "@mui/material";
import { ArrowBack, Security, Gavel, Storage, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import UserLayout from "../../components/UserLayout"; 

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <UserLayout>
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)} 
          sx={{ mb: 3, color: "#00b14f" }}
        >
          Quay lại
        </Button>

        <Paper sx={{ p: { xs: 3, md: 6 }, borderRadius: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <Box textAlign="center" mb={4}>
            <Security sx={{ fontSize: 50, color: "#00b14f", mb: 2 }} />
            <Typography variant="h4" fontWeight={800} gutterBottom>
              THỎA THUẬN SỬ DỤNG DỮ LIỆU CÁ NHÂN
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Cập nhật lần cuối: Ngày 20 tháng 01 năm 2026
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Stack spacing={4}>
            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Gavel color="primary" fontSize="small" /> 1. Mục đích thu thập dữ liệu
              </Typography>
              <Typography variant="body1" paragraph>
                Chúng tôi thu thập các thông tin bao gồm Họ tên, Email, Số điện thoại và Hồ sơ cá nhân (CV) của bạn nhằm mục đích:
              </Typography>
              <ul>
                <li>Kết nối ứng viên với các nhà tuyển dụng phù hợp.</li>
                <li>Hỗ trợ quá trình ứng tuyển vào các vị trí công việc cụ thể.</li>
                <li>Thông báo các cơ hội nghề nghiệp dựa trên mong muốn của bạn.</li>
              </ul>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage color="primary" fontSize="small" /> 2. Cam kết bảo mật
              </Typography>
              <Typography variant="body1" paragraph>
                Hệ thống <b>CV Advisor Platform</b> cam kết không chia sẻ dữ liệu của bạn cho bất kỳ bên thứ ba nào ngoài nhà tuyển dụng mà bạn đã chủ động nhấn nút "Nộp hồ sơ ứng tuyển". Toàn bộ dữ liệu được mã hóa và lưu trữ an toàn trên máy chủ của chúng tôi.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility color="primary" fontSize="small" /> 3. Quyền hạn của người dùng
              </Typography>
              <Typography variant="body1">
                Bạn có toàn quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình khỏi hệ thống bất cứ lúc nào thông qua phần Cài đặt tài khoản hoặc liên hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
              </Typography>
            </Box>

            <Box sx={{ bgcolor: "#f0fff4", p: 3, borderRadius: 2, border: "1px solid #c6f6d5" }}>
              <Typography variant="body2" color="#2d3748" sx={{ fontStyle: "italic" }}>
                Bằng việc tích chọn vào ô đồng ý trong form ứng tuyển, bạn xác nhận đã đọc, hiểu và cho phép chúng tôi sử dụng dữ liệu CV của bạn để phục vụ mục đích tìm kiếm việc làm.
              </Typography>
            </Box>
          </Stack>

          <Box mt={6} textAlign="center">
            <Button 
              variant="contained" 
              onClick={() => navigate(-1)}
              sx={{ bgcolor: "#00b14f", px: 6, py: 1.5, borderRadius: 2, fontWeight: 700, "&:hover": { bgcolor: "#008f3f" } }}
            >
              Tôi đã hiểu
            </Button>
          </Box>
        </Paper>
      </Container>
    </UserLayout>
  );
}