import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import { Close, ArrowForward, AccessTime, Book } from "@mui/icons-material";

const ARTICLES = [
  {
    id: 1,
    title: "7 kỹ năng lập trình viên cần có trong năm 2024",
    desc: "Những kỹ năng quan trọng giúp bạn trở thành lập trình viên xuất sắc và bứt phá trong sự nghiệp.",
    category: "Phát triển bản thân",
    readTime: "5 phút đọc",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
    content: `Trong thế giới công nghệ thay đổi nhanh chóng, việc liên tục cập nhật và nâng cao kỹ năng là bắt buộc đối với mỗi lập trình viên. Dưới đây là 7 kỹ năng quan trọng nhất mà bạn cần trang bị trong năm 2024:

1. Tư duy giải quyết vấn đề (Problem Solving)
Viết mã chỉ là bước cuối cùng. Khả năng phân tích một bài toán lớn, chia nhỏ nó ra và tìm ra phương án tối ưu mới là kỹ năng định hình một kỹ sư phần mềm xuất sắc.

2. Làm chủ hệ thống Git & Version Control
Việc quản lý nhánh, giải quyết xung đột (conflict resolution) và làm việc cộng tác hiệu quả qua GitHub/GitLab là kỹ năng cơ bản nhưng cực kỳ quan trọng đối với các dự án lớn.

3. Kỹ năng giao tiếp và làm việc nhóm (Soft Skills)
Lập trình viên không chỉ làm việc với máy tính. Bạn cần giải thích ý tưởng kỹ thuật cho đồng nghiệp phi kỹ thuật (HR, Product Manager) và lắng nghe ý kiến phản hồi một cách cởi mở.

4. Hiểu biết về Cloud & Containerization
AWS, Azure, Docker và Kubernetes không còn là nhiệm vụ riêng của DevOps. Một nhà phát triển hiện đại cần biết cách đóng gói ứng dụng và vận hành cơ bản trên hạ tầng đám mây.

5. Viết mã sạch và tối ưu (Clean Code & Refactoring)
Mã của bạn viết ra phải dễ đọc và dễ bảo trì đối với người khác. Hãy thực hành các nguyên lý SOLID, viết Unit Test đầy đủ và không ngừng cải tiến cấu trúc code của mình.

6. Khả năng tự học và cập nhật công nghệ
Các công nghệ, thư viện và framework mới xuất hiện liên tục. Hãy rèn luyện kỹ năng đọc tài liệu tiếng Anh, thử nghiệm cái mới để không bị tụt lại phía sau.

7. Tiếng Anh chuyên ngành tốt
Hầu hết tài liệu, API và giải pháp cho các lỗi lập trình đều bằng tiếng Anh. Thành thạo tiếng Anh giúp bạn tiếp cận kho tàng tri thức thế giới nhanh hơn gấp nhiều lần.

Hãy bắt đầu lên kế hoạch học tập và rèn luyện các kỹ năng này ngay hôm nay để sẵn sàng cho những cơ hội nghề nghiệp lớn trong năm nay!`
  },
  {
    id: 2,
    title: "Cách viết CV gây ấn tượng với nhà tuyển dụng",
    desc: "Bí quyết viết CV chuyên nghiệp giúp bạn vượt qua vòng lọc hồ sơ và giành tấm vé vào phỏng vấn.",
    category: "CV & Phỏng vấn",
    readTime: "7 phút đọc",
    imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300&h=200&fit=crop",
    content: `CV (Curriculum Vitae) là cầu nối đầu tiên giữa bạn và nhà tuyển dụng. Để CV của bạn nổi bật giữa hàng trăm hồ sơ khác, hãy áp dụng những nguyên tắc vàng dưới đây:

1. Cấu trúc rõ ràng, chuyên nghiệp
Sắp xếp thông tin theo thứ tự thời gian đảo ngược (mới nhất lên đầu). Sử dụng các tiêu đề lớn như: Thông tin cá nhân, Mục tiêu nghề nghiệp, Kinh nghiệm làm việc, Kỹ năng, Dự án cá nhân, Học vấn.

2. Tập trung vào số liệu thực tế (Thành tựu)
Đừng viết mơ hồ: "Tham gia phát triển dự án web". Hãy viết có số liệu rõ ràng: "Phát triển 3 tính năng cốt lõi cho trang web bán hàng, giúp tăng tốc độ tải trang lên 30% và cải thiện tỷ lệ chuyển đổi thêm 15%".

3. Tối ưu hóa CV theo JD (Job Description)
Đọc kỹ mô tả công việc của công ty và đưa các từ khóa kỹ năng yêu cầu (ví dụ: React, Spring Boot, MySQL...) vào CV của bạn một cách tự nhiên. Hệ thống lọc CV tự động (ATS) thường quét các từ khóa này để chấm điểm.

4. Phần Dự án cá nhân (Projects) phải có sản phẩm chạy thực tế
Nhà tuyển dụng rất thích các ứng viên chủ động. Hãy mô tả chi tiết các dự án bạn tự làm: Công nghệ sử dụng là gì, vai trò của bạn, kèm link GitHub và đường dẫn chạy Demo thực tế.

5. Tránh lỗi chính tả và định dạng cẩu thả
Một lỗi chính tả nhỏ cũng có thể khiến nhà tuyển dụng đánh giá bạn là người thiếu cẩn thận. Hãy rà soát CV ít nhất 3 lần và luôn lưu định dạng file dưới dạng PDF trước khi gửi đi.

6. Viết thư giới thiệu (Cover Letter) ngắn gọn nhưng chân thành
Đính kèm một thư giới thiệu ngắn gọn giới thiệu bản thân và lý do bạn muốn ứng tuyển vào công ty. Điều này thể hiện sự tôn trọng và chuyên nghiệp của bạn đối với vị trí ứng tuyển.

Một chiếc CV chuẩn chỉnh chính là 50% sự thành công của buổi xin việc. Hãy đầu tư thời gian thật xứng đáng!`
  },
  {
    id: 3,
    title: "Xu hướng việc làm IT năm 2024",
    desc: "Những công nghệ và vị trí đang được săn đón nhiều nhất trong thị trường tuyển dụng hiện nay.",
    category: "Thị trường lao động",
    readTime: "6 phút đọc",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop",
    content: `Năm 2024 chứng kiến những bước chuyển dịch mạnh mẽ trong ngành Công nghệ Thông tin tại Việt Nam và toàn cầu. Dưới đây là những xu hướng tuyển dụng nổi bật nhất:

1. Trí tuệ nhân tạo (AI) và Machine Learning lên ngôi
Sự bùng nổ của các mô hình ngôn ngữ lớn (LLM) như ChatGPT đã thúc đẩy các doanh nghiệp tích hợp AI vào sản phẩm. Nhu cầu tuyển dụng kỹ sư AI, kỹ sư Prompt và chuyên viên phân tích dữ liệu tăng trưởng vượt bậc.

2. Lập trình viên Full Stack đa năng được ưu tiên
Để tối ưu chi phí vận hành, các doanh nghiệp, đặc biệt là các công ty Startup, có xu hướng săn đón các lập trình viên có thể làm tốt cả Frontend (React, Vue) lẫn Backend (NodeJS, Java, Go).

3. Chuyển dịch mạnh mẽ lên Điện toán đám mây (Cloud)
Hạ tầng vật lý đang dần được thay thế bằng hạ tầng đám mây. Kỹ sư Cloud, DevOps với chứng chỉ AWS, Azure hay GCP đang nhận được mức đãi ngộ cực kỳ hấp dẫn.

4. An toàn thông tin (Cybersecurity) là ưu tiên hàng đầu
Khi các cuộc tấn công mạng ngày càng tinh vi, việc bảo mật dữ liệu khách hàng và hệ thống doanh nghiệp trở thành yếu tố sống còn. Các vị trí chuyên gia kiểm thử bảo mật (Penetration Tester), kỹ sư SecOps đang rất khan hiếm nhân lực.

5. Xu hướng làm việc kết hợp (Hybrid Work)
Chế độ làm việc linh hoạt (lên văn phòng 2-3 ngày, làm việc tại nhà các ngày còn lại) đã trở thành tiêu chuẩn chung của các công ty IT hàng đầu, giúp thu hút nhân tài từ khắp nơi.

Để duy trì lợi thế cạnh tranh trong năm 2024, các bạn lập trình viên hãy chủ động nâng cấp bản thân với các từ khóa công nghệ mới và học cách cộng tác hiệu quả với các công cụ AI hỗ trợ code nhé!`
  }
];

export default function CareerGuideSection() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  const themeColor = "#2563eb";

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={900} color="#0f172a">
            Cẩm nang nghề nghiệp
          </Typography>

          <Link
            href="#"
            underline="none"
            sx={{
              color: themeColor,
              fontWeight: 800,
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Xem tất cả bài viết <ArrowForward sx={{ fontSize: 16 }} />
          </Link>
        </Stack>

        <Grid container spacing={3.5}>
          {ARTICLES.map((article) => (
            <Grid item key={article.id} xs={12} md={4}>
              <Paper
                elevation={0}
                onClick={() => setSelectedArticle(article)}
                sx={{
                  p: 2.2,
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  display: "flex",
                  gap: 2,
                  height: "100%",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: themeColor,
                    boxShadow: "0 10px 26px rgba(37,99,235,0.06)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                {/* Article Small Image */}
                <Box
                  component="img"
                  src={article.imageUrl}
                  alt={article.title}
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "10px",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />

                {/* Article Info */}
                <Stack justifyContent="space-between" sx={{ flex: 1, minWidth: 0 }}>
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight={800}
                      color="#0f172a"
                      sx={{
                        fontSize: "0.92rem",
                        lineHeight: 1.3,
                        mb: 0.8,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{
                        fontSize: "0.78rem",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {article.desc}
                    </Typography>
                  </Box>

                  {/* Footer metadata */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                    <Chip
                      label={article.category}
                      size="small"
                      sx={{
                        height: 20,
                        bgcolor: "#eff6ff",
                        color: themeColor,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        borderRadius: "5px",
                      }}
                    />

                    <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 650 }}>
                      {article.readTime}
                    </Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Details Article Dialog */}
      <Dialog
        open={Boolean(selectedArticle)}
        onClose={() => setSelectedArticle(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{ sx: { borderRadius: "20px", p: 2 } }}
      >
        {selectedArticle && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, pt: 1 }}>
              <Chip
                label={selectedArticle.category}
                sx={{
                  bgcolor: "#eff6ff",
                  color: themeColor,
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  borderRadius: "6px",
                }}
              />
              <IconButton onClick={() => setSelectedArticle(null)} sx={{ bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" } }}>
                <Close />
              </IconButton>
            </Box>

            <DialogContent sx={{ px: 3, pb: 4 }}>
              <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ mt: 1, mb: 2, lineHeight: 1.35 }}>
                {selectedArticle.title}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3, color: "#64748b" }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTime sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>{selectedArticle.readTime}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Book sx={{ fontSize: 16 }} />
                  <Typography sx={{ fontSize: "0.82rem", fontWeight: 600 }}>Hướng dẫn nghề nghiệp</Typography>
                </Stack>
              </Stack>

              {/* Large cover image inside blog detail */}
              <Box
                component="img"
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                sx={{
                  width: "100%",
                  maxHeight: 320,
                  borderRadius: "16px",
                  objectFit: "cover",
                  mb: 4,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                }}
              />

              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="body1"
                color="#334155"
                sx={{
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                  whiteSpace: "pre-line",
                  fontWeight: 500,
                  textAlign: "justify",
                }}
              >
                {selectedArticle.content}
              </Typography>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
