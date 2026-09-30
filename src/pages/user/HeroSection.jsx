import React, { useState, useEffect } from "react";
import { Search, MapPin, ArrowRight, Building2, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// ============= RIGHT COLUMN: AI MATCHING DASHBOARD =============
const AIMatchingDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full relative max-w-lg"
    >
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/15 via-blue-500/15 to-indigo-500/15 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-sky-900/10 rounded-3xl p-6 sm:p-7 hover:shadow-2xl transition-all duration-300">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-extrabold text-emerald-700">AI CV Match</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              96% Phù hợp
            </span>
          </span>
          <span className="text-xs font-semibold text-slate-400">Thời gian thực</span>
        </div>

        {/* Featured Job Card */}
        <div className="space-y-3">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Senior React / Fullstack Developer
          </h3>
          <div className="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-slate-700">
              <Building2 className="w-3.5 h-3.5 text-sky-600" />
              FPT Software
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-600" />
              Hà Nội / Hybrid
            </span>
          </div>

          {/* Compatibility Progress */}
          <div className="pt-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-1.5">
              <span>Độ tương thích hồ sơ</span>
              <span className="text-sky-600">96.5%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "96.5%" }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
                className="h-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="pt-5 mt-5 border-t border-slate-100 grid grid-cols-2 gap-3">
          <div className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">Việc làm mới</span>
              <TrendingUp className="w-4 h-4 text-sky-600" />
            </div>
            <p className="font-black text-xl text-slate-900">1,250+</p>
            <span className="text-[10px] font-bold text-emerald-600">+18% tuần này</span>
          </div>

          <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-600">Doanh nghiệp</span>
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="font-black text-xl text-slate-900">580+</p>
            <span className="text-[10px] font-bold text-indigo-600">Đang tuyển dụng</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============= MAIN HERO SECTION =============
export default function HeroSection({
  searchQuery = {},
  setSearchQuery = () => {},
  onSearch = () => {},
}) {
  const [keyword, setKeyword] = useState(searchQuery?.keyword || "");
  const [location, setLocation] = useState(searchQuery?.location || "");
  const navigate = useNavigate();

  const quickTags = ["Java Spring", "ReactJS", "Data & AI", "DevOps / Cloud", "Kế toán"];

  useEffect(() => {
    if (searchQuery.keyword !== undefined) setKeyword(searchQuery.keyword);
    if (searchQuery.location !== undefined) setLocation(searchQuery.location);
  }, [searchQuery]);

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    const trimmedLocation = location.trim();
    
    setSearchQuery({ keyword: trimmedKeyword, location: trimmedLocation });
    onSearch?.({ keyword: trimmedKeyword, location: trimmedLocation });

    const params = new URLSearchParams();
    if (trimmedKeyword) params.set("keyword", trimmedKeyword);
    if (trimmedLocation) params.set("location", trimmedLocation);

    const queryString = params.toString();
    navigate(`/search${queryString ? `?${queryString}` : ""}`);
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    const trimmedLocation = location.trim();
    setSearchQuery({ keyword: tag, location: trimmedLocation });
    onSearch?.({ keyword: tag, location: trimmedLocation });

    const params = new URLSearchParams();
    params.set("keyword", tag);
    if (trimmedLocation) params.set("location", trimmedLocation);

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-sky-50/50 via-white to-blue-50/30 pt-8 pb-14 relative overflow-hidden">
      {/* Background Tech Blue Ambient Lighting */}
      <div className="absolute top-10 right-20 w-[450px] h-[450px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* ===== CỘT TRÁI (7 COLS): TÌM KIẾM & THÔNG TIN TUYỂN DỤNG CÔNG NGHỆ ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            {/* Tone Xanh: High-Tech Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-sky-200/90 rounded-full shadow-sm mb-4 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
              </span>
              <span className="text-xs font-black tracking-wide text-sky-700 uppercase">
                AI Career Advisor Platform 2026
              </span>
            </div>

            {/* Tiêu đề chính */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-3">
              Kết Nối Nhân Tài & Việc Làm
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Đột Phá Bằng Trí Tuệ AI
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-lg mb-6 leading-relaxed">
              Phân tích CV tức thì, đo lường kỹ năng chuyên sâu và gợi ý việc làm chuẩn xác với tỷ lệ tương thích lên đến 98%.
            </p>

            {/* Thanh tìm kiếm Capsule */}
            <div className="w-full max-w-xl mb-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xl shadow-sky-500/10 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-500/15 transition-all">
                {/* Keyword Input */}
                <div className="flex-1 min-w-0 flex items-center px-3.5 py-2.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/30 transition-all">
                  <Search className="w-4 h-4 text-sky-600 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Vị trí tuyển dụng, kỹ năng, công ty..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-bold"
                  />
                </div>

                {/* Location Input */}
                <div className="w-full sm:w-44 min-w-0 flex-shrink-0 flex items-center px-3 py-2.5 bg-slate-50/80 hover:bg-slate-50 rounded-xl focus-within:bg-white focus-within:ring-2 focus-within:ring-sky-500/30 transition-all">
                  <MapPin className="w-4 h-4 text-slate-400 mr-1.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Địa điểm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-bold"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4f46e5 100%)", color: "#ffffff" }}
                  className="flex-shrink-0 px-6 py-2.5 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border-none"
                >
                  <span>Tìm việc ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="text-xs font-bold text-slate-400">Xu hướng:</span>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="px-3 py-1 bg-white border border-slate-200/90 hover:border-sky-300 hover:text-sky-600 text-slate-600 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* 3 Thẻ số liệu */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-200/70 max-w-xl">
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1,250+</p>
                <p className="text-xs font-bold text-slate-500">Việc làm mới mở</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-sky-600 tracking-tight">96.5%</p>
                <p className="text-xs font-bold text-slate-500">Khớp hồ sơ AI</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight">&lt; 0.28s</p>
                <p className="text-xs font-bold text-slate-500">Tốc độ phân tích</p>
              </div>
            </div>
          </motion.div>

          {/* ===== CỘT PHẢI (5 COLS): AI DASHBOARD GLASSMORPHISM ===== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <AIMatchingDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
