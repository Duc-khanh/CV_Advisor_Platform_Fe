import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building2,
  CheckCircle2,
  Cpu,
  Zap,
  ShieldCheck,
  Activity,
  Layers,
  Code2,
} from 'lucide-react';

// ============= FLOATING HIGH-TECH ECOSYSTEM (TONE XANH CÔNG NGHỆ, GIÀU HIỆU ỨNG, KHÔNG BỊ TRỐNG) =============
const TechRecruitmentEcosystem = () => {
  return (
    <div className="relative w-full max-w-lg xl:max-w-xl mx-auto py-4">
      {/* 1. Ambient Tech Blue Glowing Auras */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/25 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl -z-10 animate-tech-pulse pointer-events-none" />
      <div className="absolute top-1/2 -left-10 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl -z-10 pointer-events-none" />

      {/* 2. SATELLITE CARD 1 (Top-Right): Tốc độ AI & Waveform */}
      <motion.div
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.03 }}
        className="absolute -top-4 -right-2 z-20 flex items-center gap-2.5 px-4 py-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-sky-200/90 shadow-xl shadow-sky-500/15 cursor-default"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
          <Zap className="w-4 h-4 fill-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-extrabold text-slate-800 leading-tight">AI Matching</span>
            <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.2 rounded">&lt; 0.25s</span>
          </div>
          {/* Animated Mini Waveform */}
          <div className="flex items-end gap-0.5 h-2.5 mt-1">
            {[40, 80, 100, 60, 90, 50, 75].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] }}
                transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1 bg-sky-500 rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* 3. SATELLITE CARD 2 (Bottom-Left): Đề xuất việc làm tương thích */}
      <motion.div
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        whileHover={{ scale: 1.03 }}
        className="absolute -bottom-5 -left-3 z-20 hidden sm:flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200 shadow-xl shadow-blue-500/15 cursor-default"
      >
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 font-black">
          <Building2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold text-slate-800 leading-tight">560+ Doanh nghiệp tuyển dụng</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-600">FPT, VNG, Viettel, TechCorp</span>
          </div>
        </div>
      </motion.div>

      {/* 4. MAIN TECH CARD: AI MATCH TERMINAL (Tone Xanh Hiện Đại, Kính Trong Suốt) */}
      <div className="relative overflow-hidden rounded-[32px] bg-white/90 backdrop-blur-2xl border border-sky-200/80 p-6 sm:p-7 shadow-2xl shadow-sky-900/10 group hover:border-sky-400 transition-all duration-300">
        
        {/* Subtle Tech Grid Texture */}
        <div className="absolute inset-0  opacity-30 pointer-events-none" />

        {/* Scanline Beam Effect */}
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-sky-400/0 via-sky-400/10 to-transparent pointer-events-none animate-scanline" />

        {/* Header: AI Radar Status */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-sky-600" />
              AI Match Radar • Realtime Scan
            </span>
          </div>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200/80">
            ONLINE 99.8%
          </span>
        </div>

        {/* Center: Target Job + Glowing Precision SVG Ring */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mb-5 relative z-10">
          
          {/* CYBERNETIC AI RADAR & PRECISION HUD GAUGE */}
          <div className="sm:col-span-5 flex justify-center">
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
              
              {/* Lớp 0: Core Blue Ambient Halo & Ripple Waves */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-sky-400/25 via-blue-500/20 to-indigo-500/20 blur-md pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-sky-400/35 animate-ping opacity-25 pointer-events-none" style={{ animationDuration: '3.5s' }} />

              {/* Lớp 1: 360° Realtime Radar Sweep Cone & Needle (Tia quét radar xoay liên tục) */}
              <div className="absolute inset-2.5 rounded-full overflow-hidden pointer-events-none z-0">
                <div 
                  className="w-full h-full rounded-full animate-radar-sweep relative"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(56, 189, 248, 0.1) 310deg, rgba(14, 165, 233, 0.45) 360deg)'
                  }}
                >
                  {/* Radar Leading Beam Needle Line */}
                  <div className="absolute top-0 left-1/2 w-[2px] h-1/2 -translate-x-1/2 bg-gradient-to-t from-transparent via-sky-300 to-cyan-300 shadow-[0_0_10px_#38bdf8]" />
                </div>
              </div>

              {/* Lớp 2: Lưới tọa độ chữ thập HUD (Reticle Crosshair & Concentric Rings) */}
              <div className="absolute inset-2.5 rounded-full border border-sky-300/40 pointer-events-none z-0" />
              <div className="absolute inset-7 rounded-full border border-sky-400/30 border-dashed pointer-events-none z-0" />
              <div className="absolute inset-x-3 top-1/2 h-[1px] -translate-y-1/2 bg-sky-300/40 pointer-events-none z-0" />
              <div className="absolute inset-y-3 left-1/2 w-[1px] -translate-x-1/2 bg-sky-300/40 pointer-events-none z-0" />

              {/* Lớp 3: Vòng quỹ đạo ngoài (Orbit Ring) có 2 hạt Photon xoay 360° */}
              <div
                className="absolute inset-0 rounded-full border border-dashed border-sky-400/50 animate-orbit-slow pointer-events-none z-10"
              >
                {/* Photon Node 1 (Top Cyan Glow) */}
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee] ring-2 ring-white" />
                {/* Photon Node 2 (Bottom Blue Glow) */}
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_#2563eb] ring-2 ring-white" />
              </div>

              {/* Lớp 4: Các điểm Blip mục tiêu AI (Target Signal Pings nhấp nháy) */}
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.25, 0.8] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-9 right-8 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
              />
              <motion.div
                animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.7, 1.15, 0.7] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
                className="absolute bottom-9 left-9 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] pointer-events-none z-10"
              />

              {/* Lớp 5: High Precision SVG Gauge + HUD Compass Ticks */}
              <svg className="w-full h-full -rotate-90 relative z-10 pointer-events-none" viewBox="0 0 100 100">
                {/* HUD Compass Ticks Ring (Vạch chia độ kỹ thuật 360 độ sắc nét) */}
                <circle
                  cx="50"
                  cy="50"
                  r="47"
                  stroke="#7dd3fc"
                  strokeWidth="1.5"
                  fill="transparent"
                  strokeDasharray="1.2 11.2"
                  opacity="0.85"
                />

                {/* Background Ring Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="37"
                  stroke="#e2e8f0"
                  strokeWidth="6"
                  fill="transparent"
                />

                {/* Dynamic Animated Glowing Progress Ring */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="37"
                  stroke="url(#cyberGaugeGrad)"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray="232.48"
                  initial={{ strokeDashoffset: 232.48 }}
                  animate={{ strokeDashoffset: 232.48 * (1 - 0.96) }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.2 }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 7px rgba(14, 165, 233, 0.85))' }}
                />

                <defs>
                  <linearGradient id="cyberGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Lớp 6: Trung tâm hiển thị điểm số (Glassmorphic Core HUD Capsule) */}
              <div className="absolute w-[74px] h-[74px] sm:w-[80px] sm:h-[80px] rounded-full bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-xl shadow-sky-500/15 flex flex-col items-center justify-center z-20 pointer-events-auto">
                <div className="flex items-baseline">
                  <span className="text-2xl sm:text-[27px] font-black bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                    96
                  </span>
                  <span className="text-xs font-black text-sky-600 ml-0.5">%</span>
                </div>
                <div className="flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200/80 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-wider text-sky-700 leading-none">
                    AI MATCH
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Target Role & Details */}
          <div className="sm:col-span-7 space-y-1.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">
              <Sparkles className="w-3 h-3" />
              Tương thích hồ sơ cao
            </span>
            <h4 className="text-base font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
              Senior Java Fullstack Engineer
            </h4>
            <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
              <Building2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
              <span>TechCorp Vietnam • Hà Nội</span>
            </p>
            <p className="text-xs font-black text-emerald-600 pt-0.5">
              Mức lương: 35 - 55 triệu / tháng
            </p>
          </div>
        </div>

        {/* 4 Skill Compatibility Matrix Nodes (Xanh công nghệ sắc nét) */}
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
            <span>Kỹ năng phân tích CV:</span>
            <span className="text-blue-600 font-extrabold">4/4 Tiêu chuẩn</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { skill: 'Spring Boot & Cloud', match: '99%' },
              { skill: 'React / Next.js', match: '96%' },
              { skill: 'Docker / Microservices', match: '94%' },
              { skill: 'AI & Data Integration', match: '95%' },
            ].map((node) => (
              <div
                key={node.skill}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/40 transition-all"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-700 truncate">{node.skill}</span>
                </div>
                <span className="text-[11px] font-black text-blue-600 flex-shrink-0">
                  {node.match}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer: Verified Badge */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Hồ sơ đã được AI xác thực</span>
          </div>
          <span className="text-[11px] font-bold text-sky-600 hover:underline cursor-pointer flex items-center gap-0.5">
            <span>Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
};

// ============= MAIN HERO SECTION (TONE XANH CÔNG NGHỆ CHỦ ĐẠO - BỐ CỤC ĐẦY ĐẶN KHÔNG BỊ TRỐNG) =============
export default function HeroSection({
  searchQuery = {},
  setSearchQuery = () => {},
  onSearch = () => {},
}) {
  const [keyword, setKeyword] = useState(searchQuery?.keyword || '');
  const [location, setLocation] = useState(searchQuery?.location || '');
  const navigate = useNavigate();

  const quickTags = ['Java Spring', 'ReactJS', 'Data & AI', 'DevOps / Cloud', 'Kế toán'];

  const handleSearch = () => {
    setSearchQuery({ keyword, location });
    onSearch?.();
    navigate('/search');
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    setSearchQuery({ keyword: tag, location });
    navigate('/search');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-sky-50/50 via-white to-blue-50/30 pt-8 pb-14 relative overflow-hidden ">
      
      {/* Background Tech Blue Ambient Lighting */}
      <div className="absolute top-10 right-20 w-[450px] h-[450px] bg-sky-400/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container 2 Columns: Cân đối, lấp đầy không gian, không bị gom cục */}
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

            {/* Tiêu đề chính Tone Xanh công nghệ */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-3">
              Kết Nối Nhân Tài & Việc Làm
              <br />
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Đột Phá Bằng Trí Tuệ AI
              </span>
            </h1>

            {/* Subtext gọn gàng */}
            <p className="text-slate-600 text-sm sm:text-base font-medium max-w-lg mb-6 leading-relaxed">
              Phân tích CV tức thì, đo lường kỹ năng chuyên sâu và gợi ý việc làm chuẩn xác với tỷ lệ tương thích lên đến 98%.
            </p>

            {/* Thanh tìm kiếm Capsule Tone Xanh sang trọng */}
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
                    onKeyPress={handleKeyPress}
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
                    onKeyPress={handleKeyPress}
                    className="w-full bg-transparent outline-none text-xs sm:text-sm text-slate-900 placeholder-slate-400 font-bold"
                  />
                </div>

                {/* Search Button Tone Xanh Dương Hiện Đại */}
                <button
                  type="button"
                  onClick={handleSearch}
                  style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 50%, #4f46e5 100%)', color: '#ffffff' }}
                  className="flex-shrink-0 px-6 py-2.5 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border-none"
                >
                  <span>Tìm việc ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Tags Tone Xanh */}
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

            {/* 3 Thẻ số liệu tuyển dụng thời gian thực (Lấp đầy không gian, cực kỳ chuyên nghiệp) */}
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

          {/* ===== CỘT PHẢI (5 COLS): HỆ SINH THÁI TUYỂN DỤNG CÔNG NGHỆ AI PHÁT QUANG SANG TRỌNG ===== */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <TechRecruitmentEcosystem />
          </div>

        </div>
      </div>
    </div>
  );
}
