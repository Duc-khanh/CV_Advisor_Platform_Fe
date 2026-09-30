import React from "react";
import { Sparkles, FileText, Target, GraduationCap, ArrowRight } from "lucide-react";

const HeaderSection = () => (
  <div className="text-center max-w-3xl mx-auto pt-2 pb-6 px-4">
    {/* High-tech badge */}
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-xs backdrop-blur-xs text-xs font-bold text-blue-700 mb-4 animate-fade-in">
      <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
      <span className="tracking-wide">AI CAREER ROADMAP & SKILL GAP ENGINE</span>
    </div>

    {/* Title with Gradient */}
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
      Xây Dựng Lộ Trình Học Tập{" "}
      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
        Từ CV Của Bạn
      </span>
    </h1>

    {/* Subtitle */}
    <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
      Tải lên CV để AI phân tích kỹ năng hiện có, so khớp với vị trí mong muốn và tạo lộ trình học tập chi tiết để bạn đạt mục tiêu sự nghiệp.
    </p>

    {/* Modern Linear Step Badges */}
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-5 text-xs font-semibold">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-xs">
        <FileText className="w-3.5 h-3.5 text-blue-600" />
        <span>1. Đọc CV hiện có</span>
      </div>

      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 shadow-xs">
        <Target className="w-3.5 h-3.5 text-indigo-600" />
        <span>2. So khớp mục tiêu</span>
      </div>

      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />

      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold shadow-xs">
        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
        <span>3. Nhận lộ trình bù kỹ năng</span>
      </div>
    </div>
  </div>
);

export default HeaderSection;
