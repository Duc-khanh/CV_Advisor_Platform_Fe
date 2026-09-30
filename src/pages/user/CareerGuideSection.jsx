import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Container, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import {
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Eye,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { articleService } from "../../services/company/articleService";

export default function CareerGuideSection() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getArticlesPublic({
          page: 0,
          size: 3,
          sortBy: "newest",
        });
        setArticles((data.content || []).slice(0, 3));
      } catch (err) {
        console.error("Lỗi tải cẩm nang:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleCardClick = (articleId) => {
    navigate(`/career-guide/${articleId}`);
  };

  const handleViewAll = () => {
    navigate("/career-guide");
  };

  // Fallback default sample articles if database returns empty
  const displayArticles =
    articles.length > 0
      ? articles
      : [
          {
            articleId: 1,
            title: "10 Sai lầm phổ biến khi viết CV IT khiến bạn bị loại ngay từ vòng lọc ATS",
            description:
              "Rất nhiều ứng viên sở hữu kỹ năng thực chiến tốt nhưng CV lại không vượt qua được hệ thống quét từ khóa tự động. Tìm hiểu cách tối ưu hóa hồ sơ ngay hôm nay.",
            category: "Kinh nghiệm viết CV",
            readTime: "4 phút đọc",
            viewsCount: "1.8k",
            createdAt: "2026-09-20",
            imageUrl:
              "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80",
          },
          {
            articleId: 2,
            title: "Bí quyết trả lời câu hỏi: 'Hãy giới thiệu bản thân' gây ấn tượng tuyệt đối",
            description:
              "Ấn tượng ban đầu quyết định 80% thành công của buổi phỏng vấn. Học ngay công thức STAR và cách định vị bản thân sắc bén trước nhà tuyển dụng.",
            category: "Kỹ năng phỏng vấn",
            readTime: "5 phút đọc",
            viewsCount: "2.4k",
            createdAt: "2026-09-22",
            imageUrl:
              "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
          },
          {
            articleId: 3,
            title: "Chiến thuật tìm việc hiệu quả trong thời đại công nghệ AI bùng nổ",
            description:
              "Làm sao để tiếp cận thị trường việc làm ẩn và tối ưu hóa hồ sơ năng lực số để được các Headhunter và doanh nghiệp công nghệ săn đón.",
            category: "Chiến lược nghề nghiệp",
            readTime: "6 phút đọc",
            viewsCount: "3.1k",
            createdAt: "2026-09-25",
            imageUrl:
              "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
          },
        ];

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Tech Ambient Lighting */}
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Góc Chuyên Gia & Cẩm Nang Nghề Nghiệp
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Bí Quyết Phát Triển{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Sự Nghiệp & Ứng Tuyển
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl leading-relaxed">
              Cập nhật kỹ năng viết CV chuẩn ATS, kinh nghiệm phỏng vấn và chiến lược chinh phục các nhà tuyển dụng công nghệ hàng đầu.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-sky-50/80 hover:bg-sky-100 text-xs font-black text-sky-700 border border-sky-200/80 transition-all cursor-pointer self-start sm:self-auto shadow-2xs group"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* ===== ARTICLE CARDS GRID (3 CỘT CÂN ĐỐI, HIỆN ĐẠI, THỜI THƯỢNG) ===== */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-white p-4 space-y-3 shadow-xs">
                <Skeleton variant="rounded" width="100%" height={190} sx={{ borderRadius: "18px" }} />
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="90%" height={28} />
                <Skeleton variant="text" width="80%" height={20} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayArticles.map((article, index) => {
              const formattedDate = article.createdAt
                ? new Date(article.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Gần đây";

              const categoryBadge = article.category || "Cẩm nang IT";
              const readTimeText = article.readTime || "5 phút đọc";

              return (
                <motion.div
                  key={article.articleId || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{ y: -6 }}
                  onClick={() => handleCardClick(article.articleId)}
                  className="group relative rounded-3xl bg-white shadow-xs hover:shadow-2xl hover:shadow-sky-500/12 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Cover Image with 16:9 Aspect Ratio & Floating Badges */}
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100">
                      <img
                        src={
                          article.imageUrl ||
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80"
                        }
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80";
                        }}
                      />

                      {/* Floating Category Pill Tag */}
                      <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-xl bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-black shadow-md border border-white/20">
                        {categoryBadge}
                      </div>

                      {/* Floating Read Time Tag */}
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <Clock className="w-3 h-3 text-cyan-300" />
                        <span>{readTimeText}</span>
                      </div>
                    </div>

                    {/* Article Content */}
                    <div className="p-5 sm:p-6">
                      {/* Meta: Date & Views */}
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formattedDate}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{article.viewsCount || 120} lượt xem</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-[17px] font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>

                      {/* Description Summary */}
                      <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed mt-2.5">
                        {article.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-400 group-hover:text-blue-600 transition-colors">
                    <span>Đọc toàn bộ bài viết</span>
                    <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-all">
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </Container>
    </Box>
  );
}
