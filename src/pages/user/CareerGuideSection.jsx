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
    title: "7 kỹ năng mềm giúp bạn bứt phá sự nghiệp trong năm 2024",
    desc: "Những kỹ năng quan trọng giúp bạn làm việc hiệu quả, thích ứng tốt và thăng tiến vượt bậc trong mọi ngành nghề.",
    category: "Phát triển bản thân",
    readTime: "5 phút đọc",
    imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=200&fit=crop",
    content: `Trong thị trường lao động thay đổi nhanh chóng, việc liên tục cập nhật và nâng cao kỹ năng là bắt buộc đối với mọi nhân sự. Dưới đây là 7 kỹ năng mềm quan trọng nhất mà bạn cần trang bị trong năm 2024:

1. Tư duy giải quyết vấn đề (Problem Solving)
Khả năng phân tích một tình huống khó khăn, chia nhỏ nó ra và tìm ra phương án tối ưu là kỹ năng định hình một nhân sự xuất sắc trong mọi vai trò.

2. Làm việc nhóm và hợp tác (Collaboration)
Khả năng phối hợp nhịp nhàng với đồng nghiệp, tôn trọng ý kiến khác biệt và cùng nhau hướng tới mục tiêu chung của tập thể.

3. Kỹ năng giao tiếp hiệu quả (Communication)
Truyền đạt thông tin rõ ràng, súc tích qua cả văn bản lẫn lời nói, đồng thời biết lắng nghe tích cực để hiểu rõ mong muốn của khách hàng và đối tác.

4. Quản lý thời gian và sắp xếp công việc
Biết cách phân bổ thời gian hợp lý, đặt thứ tự ưu tiên cho các đầu việc quan trọng và hoàn thành đúng hạn (deadline) mà không bị quá tải.

5. Khả năng thích ứng nhanh (Adaptability)
Không ngại thay đổi khi công ty áp dụng quy trình mới, công nghệ mới hoặc có sự điều chỉnh định hướng chiến lược.

6. Tư duy học hỏi suốt đời (Continuous Learning)
Liên tục tự trau dồi kiến thức mới liên quan đến ngành nghề, rèn luyện kỹ năng sử dụng các công cụ mới để nâng cao năng suất làm việc.

7. Trí tuệ cảm xúc (EQ)
Thấu hiểu cảm xúc của bản thân và đồng nghiệp, giữ bình tĩnh trước áp lực và xây dựng các mối quan hệ cực kỳ tích cực nơi công sở.

Hãy bắt đầu lên kế hoạch học tập và rèn luyện các kỹ năng này ngay hôm nay để sẵn sàng cho những cơ hội thăng tiến lớn trong năm nay!`
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
Đọc kỹ mô tả công việc của công ty và đưa các từ khóa kỹ năng yêu cầu vào CV của bạn một cách tự nhiên. Hệ thống lọc CV tự động (ATS) thường quét các từ khóa này để chấm điểm.

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
    title: "Xu hướng tuyển dụng và thị trường việc làm năm 2024",
    desc: "Khám phá các xu hướng tuyển dụng mới nhất, yêu cầu của doanh nghiệp và những cơ hội phát triển nghề nghiệp mở ra trong năm nay.",
    category: "Thị trường lao động",
    readTime: "6 phút đọc",
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop",
    content: `Năm 2024 chứng kiến những bước chuyển dịch mạnh mẽ trong thị trường lao động tại Việt Nam và toàn cầu. Dưới đây là những xu hướng tuyển dụng nổi bật nhất mà người tìm việc cần lưu ý:

1. Ứng dụng AI và công nghệ vào công việc
Các doanh nghiệp thuộc mọi lĩnh vực từ marketing, tài chính, nhân sự cho đến sản xuất đang tích cực đưa các công cụ trí tuệ nhân tạo (AI) vào quy trình vận hành. Nhân sự biết ứng dụng AI để tối ưu hóa năng suất sẽ có lợi thế cạnh tranh cực kỳ lớn.

2. Ưu tiên nhân sự đa năng (T-shaped Skills)
Doanh nghiệp có xu hướng tuyển dụng những ứng viên sở hữu kiến thức rộng ở nhiều lĩnh vực và có chuyên môn sâu ở một lĩnh vực cụ thể để tối ưu chi phí và tăng tính linh hoạt.

3. Chú trọng sức khỏe tinh thần nơi công sở
Chăm sóc sức khỏe tinh thần của nhân viên đang trở thành chiến lược giữ chân nhân tài của nhiều doanh nghiệp. Các chính sách bảo hiểm sức khỏe, ngày nghỉ phép linh hoạt và hoạt động gắn kết tập thể ngày càng được đầu tư.

4. Mô hình làm việc kết hợp (Hybrid Work) tiếp tục duy trì
Làm việc linh hoạt giữa văn phòng và tại nhà đã trở thành một tiêu chuẩn mới, giúp doanh nghiệp tuyển dụng được nhân sự giỏi ở khắp mọi miền địa lý mà không bị giới hạn khoảng cách.

5. Đánh giá cao kỹ năng thực chiến hơn bằng cấp thuần túy
Các nhà tuyển dụng ngày càng chú trọng vào kết quả thực tế, kinh nghiệm giải quyết dự án và thái độ làm việc của ứng viên hơn là chỉ nhìn vào tên trường đại học hay bằng cấp học thuật.

Để duy trì lợi thế cạnh tranh trong năm 2024, hãy chủ động làm mới CV, kết nối mạng lưới quan hệ chất lượng và không ngừng nâng cao năng lực tự học của mình!`
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

        <Grid container spacing={2}>
          {ARTICLES.map((article) => (
            <Grid
              item
              key={article.id}
              sx={{
                display: 'flex',
                flexBasis: 'calc(33.3333% - 20px)',
                maxWidth: 'calc(33.3333% - 20px)',
                flexGrow: 0,
              }}
            >
              <Paper
                elevation={0}
                onClick={() => setSelectedArticle(article)}
                sx={{
                  p: 1.2,
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  display: "flex",
                  flex: 1,
                  gap: 1.25,
                  minHeight: 100,
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
                    width: 60,
                    height: 60,
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
                        WebkitLineClamp: 1,
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
