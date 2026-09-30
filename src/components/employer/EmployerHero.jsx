import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  Play,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building2,
  Cpu,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Clock
} from "lucide-react";

export default function EmployerHero({ onOpenRegister }) {
  const scrollToDemo = () => {
    const el = document.getElementById("ai-recruitment-demo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/60 text-slate-900">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-indigo-50/20 to-transparent pointer-events-none -z-0 blur-3xl" />
      <div className="absolute top-24 left-1/10 w-80 h-80 bg-sky-200/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-36 right-1/10 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 font-bold text-xs tracking-wide shadow-xs mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>NỀN TẢNG TUYỂN DỤNG & ĐÁNH GIÁ ỨNG VIÊN BẰNG AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black tracking-tight text-slate-900 leading-[1.18]"
            >
              Tìm Kiếm & Sàng Lọc{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Nhân Tài Đỉnh Cao
              </span>{" "}
              Với Tốc Độ Siêu Tốc
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-medium"
            >
              Tự động hóa 80% quy trình tuyển dụng: từ tối ưu JD, bóc tách hồ sơ CV, so khớp năng lực tức thì đến xếp hạng ứng viên chuẩn xác dựa trên trí tuệ nhân tạo.
            </motion.p>

            {/* Quick Metrics Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="grid grid-cols-3 gap-3 my-7 p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-sm"
            >
              <div className="text-center p-2 rounded-xl bg-blue-50/50">
                <span className="block text-lg sm:text-2xl font-black text-blue-600">85%</span>
                <span className="text-[11px] font-bold text-slate-500">Giảm thời gian lọc</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-indigo-50/50">
                <span className="block text-lg sm:text-2xl font-black text-indigo-600">96%</span>
                <span className="text-[11px] font-bold text-slate-500">Độ chuẩn khớp JD</span>
              </div>
              <div className="text-center p-2 rounded-xl bg-sky-50/50">
                <span className="block text-lg sm:text-2xl font-black text-sky-600">&lt; 24h</span>
                <span className="text-[11px] font-bold text-slate-500">Chốt ứng viên Top</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <button
                type="button"
                onClick={onOpenRegister}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Đăng Ký Tuyển Dụng Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={scrollToDemo}
                className="px-5 sm:px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-sm sm:text-base transition-all hover:border-slate-400 cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                <span>Xem Demo AI Live</span>
              </button>
            </motion.div>

            {/* Trust badge */}
            <div className="mt-6 flex items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Miễn phí dùng thử 7 ngày</span>
              </div>
              <span className="text-slate-300">•</span>
              <span>Không cần thẻ tín dụng</span>
              <span className="text-slate-300">•</span>
              <span>Hỗ trợ tích hợp 24/7</span>
            </div>
          </div>

          {/* Right Column: High-Tech Floating Satellite Hologram Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Glowing Aura behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-sky-400/20 rounded-full blur-3xl -z-10 animate-pulse" />

              {/* Satellite 1: Top-Right AI Screening Latency & Equalizer */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-3 z-20 flex items-center gap-2.5 px-3.5 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200/90 shadow-xl shadow-blue-500/10 cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-slate-800 leading-tight">AI ATS Screening</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">&lt; 0.2s</span>
                  </div>
                  {/* Equalizer Waveform */}
                  <div className="flex items-end gap-0.5 h-2.5 mt-1">
                    {[45, 90, 100, 65, 85, 50, 80].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] }}
                        transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Satellite 2: Bottom-Left Realtime Pool */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -bottom-6 -left-3 z-20 flex items-center gap-2.5 px-3.5 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-500/10 cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-800 leading-tight">120,000+ Ứng Viên</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] text-slate-500 font-semibold">Cập nhật hồ sơ mỗi ngày</span>
                  </div>
                </div>
              </motion.div>

              {/* Main Interactive Hologram Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-blue-900/10 p-6 relative overflow-hidden">
                {/* Header of Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      AI
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-none">AI Candidate Scorecard</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">So khớp tự động theo Job Description</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                    96% Phù Hợp
                  </span>
                </div>

                {/* Candidate Highlight */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                      HN
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Hoàng Nam • Senior Engineer</h4>
                      <p className="text-xs text-slate-500">5 năm kinh nghiệm • Đang sẵn sàng nhận việc</p>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-200/60">
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">
                      ✓ React / TypeScript
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">
                      ✓ Node.js & Microservices
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-bold">
                      ✓ System Design
                    </span>
                  </div>
                </div>

                {/* Live Analysis Progress Bars */}
                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Độ tương thích kỹ năng chuyên môn:</span>
                      <span className="text-blue-600 font-black">98%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-[98%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                      <span>Kinh nghiệm & Quy mô dự án:</span>
                      <span className="text-indigo-600 font-black">94%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full w-[94%]" />
                    </div>
                  </div>
                </div>

                {/* Quick Action Footer */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Thời gian duyệt hồ sơ: 0.18s</span>
                  <button
                    type="button"
                    onClick={onOpenRegister}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Xem hồ sơ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
