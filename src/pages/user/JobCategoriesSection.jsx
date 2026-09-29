import React from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Megaphone,
  TrendingUp,
  Palette,
  Landmark,
  Users2,
  ArrowUpRight,
  Sparkles,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function JobCategoriesSection() {
  const navigate = useNavigate();

  // Dữ liệu danh mục nghề nghiệp chuẩn hóa tone Xanh Công Nghệ đồng bộ 100%
  const categories = [
    {
      title: "Công nghệ thông tin",
      keyword: "IT",
      count: "1,245+ việc làm",
      growth: "+18%",
      icon: <Code2 className="w-5 h-5 text-sky-600" />,
      tag: "Top nhu cầu",
    },
    {
      title: "Marketing & Digital",
      keyword: "Marketing",
      count: "856+ việc làm",
      growth: "+12%",
      icon: <Megaphone className="w-5 h-5 text-blue-600" />,
      tag: "Tăng trưởng",
    },
    {
      title: "Kinh doanh & Bán hàng",
      keyword: "Kinh doanh",
      count: "1,032+ việc làm",
      growth: "+15%",
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      tag: "Thu nhập cao",
    },
    {
      title: "Thiết kế & Sáng tạo",
      keyword: "Thiết kế",
      count: "524+ việc làm",
      growth: "+9%",
      icon: <Palette className="w-5 h-5 text-indigo-600" />,
      tag: "Đột phá",
    },
    {
      title: "Tài chính - Kế toán",
      keyword: "Kế toán",
      count: "732+ việc làm",
      growth: "+11%",
      icon: <Landmark className="w-5 h-5 text-blue-700" />,
      tag: "Ổn định",
    },
    {
      title: "Nhân sự & Tuyển dụng",
      keyword: "Nhân sự",
      count: "312+ việc làm",
      growth: "+8%",
      icon: <Users2 className="w-5 h-5 text-sky-700" />,
      tag: "Kết nối",
    },
  ];

  const handleCategoryClick = (keyword) => {
    navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Tech Blue Ambient Lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        
        {/* Section Header: Chuẩn phong cách Xanh công nghệ */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Xu hướng thị trường AI 2026
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Khám Phá{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Danh Mục Nghề Nghiệp
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl">
              Hàng ngàn cơ hội việc làm hấp dẫn thuộc các lĩnh vực trọng điểm, được AI phân tích và xếp hạng theo nhu cầu tuyển dụng thực tế.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-50/80 hover:bg-sky-100 text-xs font-black text-sky-700 border border-sky-200/80 transition-all cursor-pointer self-start sm:self-auto shadow-2xs group"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid 6 Cột Cân Đối, Sắc Nét */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.04 }}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryClick(cat.keyword)}
              className="group relative p-4 sm:p-4.5 rounded-2xl bg-white shadow-xs hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle hover blue gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-0" />

              {/* Top Row: Icon + Growth badge */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-50 to-blue-50 text-blue-600 flex items-center justify-center shadow-2xs group-hover:scale-105 group-hover:border-sky-300 transition-all">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {cat.growth}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 my-1">
                <h3 className="text-xs sm:text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
                  {cat.title}
                </h3>
                <p className="text-[11px] font-bold text-sky-600 mt-1">
                  {cat.count}
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-extrabold text-slate-400 group-hover:text-blue-600 relative z-10">
                <span>Khám phá</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

      </Container>
    </Box>
  );
}
