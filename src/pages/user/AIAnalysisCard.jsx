import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
} from 'lucide-react';

export default function AIAnalysisCard({
  score = 0,
  strengths = [],
  weaknesses = [],
  missingSkills = [],
}) {
  const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0;

  const getScoreStatus = (val) => {
    if (val >= 85) return { label: 'Rất tương thích', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200/80', dot: 'bg-emerald-500' };
    if (val >= 70) return { label: 'Tương thích tốt', color: 'text-sky-700', bg: 'bg-sky-50', border: 'border-sky-200/80', dot: 'bg-sky-500' };
    if (val >= 50) return { label: 'Đạt chuẩn cơ bản', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200/80', dot: 'bg-blue-500' };
    return { label: 'Cần nâng cấp hồ sơ', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200/80', dot: 'bg-rose-500' };
  };

  const status = getScoreStatus(numericScore);
  const circumference = 2 * Math.PI * 38; // r = 38 -> ~238.76
  const strokeOffset = circumference - (circumference * Math.min(Math.max(numericScore, 0), 100)) / 100;

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl shadow-sky-950/5 p-5 sm:p-7 relative overflow-hidden transition-all duration-300">
      
      {/* Background Tech Ambient Lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-sky-400/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* Header bar: AI System Badge & Realtime Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Báo Cáo Đánh Giá Năng Lực AI
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[10px] font-black uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Được phân tích đa chiều theo tiêu chuẩn tuyển dụng công nghệ 2026
            </p>
          </div>
        </div>

        {/* Total Metric Pills */}
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>{(strengths?.length || 0) + (weaknesses?.length || 0) + (missingSkills?.length || 0)} Tiêu chí quét</span>
          </span>
        </div>
      </div>

      {/* 
        ===== 4 Ô KẾT QUẢ ĐỒNG BỘ GỌN GÀNG NHẤT =====
        - Ô 1 (Đầu) và Ô 4 (Cuối) BẰNG NHAU (mỗi ô chiếm 25%)
        - 2 Ô giữa (Điểm mạnh & Cần tối ưu) cũng chiếm 25% mỗi ô
        - TẤT CẢ BADGE ĐỒNG BỘ LÀ SỐ TRÒN MINI GỌN GÀNG (2, 2, 2)
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10 items-stretch">
        
        {/* ===== Ô 1 (ĐẦU): CHỈ SỐ PHÙ HỢP ===== */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-sky-50/60 via-white to-blue-50/40 border border-sky-200/70 text-center relative overflow-hidden group shadow-2xs h-full">
          {/* Subtle grid background */}
          <div className="absolute inset-0  opacity-20 pointer-events-none" />

          <div className="w-full flex items-center justify-between pb-2 mb-1 border-b border-sky-100">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              Chỉ Số Phù Hợp
            </span>
            <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-black flex items-center justify-center flex-shrink-0">
              %
            </span>
          </div>

          {/* Precision Circular HUD Mini Gauge */}
          <div className="relative w-28 h-28 sm:w-30 sm:h-30 flex items-center justify-center my-2">
            {/* Halo pulse */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-sky-400/20 via-blue-500/10 to-indigo-500/15 blur-sm" />

            {/* Sweep radar cone */}
            <div className="absolute inset-2 rounded-full overflow-hidden pointer-events-none">
              <div
                className="w-full h-full rounded-full animate-radar-sweep"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(56, 189, 248, 0.08) 310deg, rgba(14, 165, 233, 0.35) 360deg)',
                }}
              />
            </div>

            {/* Orbit tick ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/40 animate-orbit-slow pointer-events-none" />

            {/* SVG Progress Circle */}
            <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 100 100">
              {/* Compass ticks */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#bae6fd"
                strokeWidth="1.2"
                fill="transparent"
                strokeDasharray="1 9"
                opacity="0.8"
              />
              {/* Base track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#e2e8f0"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Progress */}
              <motion.circle
                cx="50"
                cy="50"
                r="38"
                stroke="url(#aiCardGrad)"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 5px rgba(14, 165, 233, 0.75))' }}
              />
              <defs>
                <linearGradient id="aiCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Core Glass */}
            <div className="absolute inset-4 rounded-full bg-white/95 backdrop-blur-sm border border-sky-200/80 shadow-md flex flex-col items-center justify-center z-20">
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight leading-none">
                {numericScore}%
              </span>
              <span className="text-[8px] font-black uppercase text-sky-600 tracking-wider mt-0.5">
                MATCH
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-1">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black border ${status.bg} ${status.color} ${status.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
              <span>{status.label}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">
            Hồ sơ có mức độ đáp ứng cao với các vị trí công việc đề xuất.
          </p>
        </div>

        {/* ===== Ô 2 (GIỮA 1): ĐIỂM MẠNH ===== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-emerald-50/70 to-emerald-50/30 border border-emerald-200/80 flex flex-col justify-between hover:border-emerald-300 transition-all shadow-2xs h-full">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-200/60">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                Điểm Mạnh
              </span>
              {/* Badge số đồng bộ */}
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-black flex items-center justify-center flex-shrink-0">
                {strengths?.length || 0}
              </span>
            </div>

            <div className="space-y-2.5">
              {strengths && strengths.length > 0 ? (
                strengths.map((str, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                    <p className="text-xs font-bold text-slate-700 leading-snug break-words">
                      {str}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Đang cập nhật phân tích...</p>
              )}
            </div>
          </div>
          
          <div className="pt-2 mt-4 border-t border-emerald-200/40 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Lợi thế cạnh tranh vượt trội</span>
          </div>
        </div>

        {/* ===== Ô 3 (GIỮA 2): CẦN TỐI ƯU ===== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-rose-50/60 to-rose-50/20 border border-rose-200/70 flex flex-col justify-between hover:border-rose-300 transition-all shadow-2xs h-full">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-rose-200/60">
              <span className="text-xs font-black text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                Cần Tối Ưu
              </span>
              {/* Badge số đồng bộ */}
              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 text-[11px] font-black flex items-center justify-center flex-shrink-0">
                {weaknesses?.length || 0}
              </span>
            </div>

            <div className="space-y-2.5">
              {weaknesses && weaknesses.length > 0 ? (
                weaknesses.map((wk, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    <p className="text-xs font-bold text-slate-700 leading-snug break-words">
                      {wk}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Hồ sơ không có điểm yếu lớn.</p>
              )}
            </div>
          </div>

          <div className="pt-2 mt-4 border-t border-rose-200/40 text-[10px] font-bold text-rose-700 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Gợi ý hoàn thiện từ AI</span>
          </div>
        </div>

        {/* ===== Ô 4 (CUỐI): KỸ NĂNG BỔ SUNG (ĐỒNG BỘ 100% TIÊU ĐỀ & BADGE SỐ TRÒN) ===== */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-sky-50/70 via-blue-50/30 to-indigo-50/40 border border-sky-200/80 flex flex-col justify-between hover:border-sky-300 transition-all shadow-2xs h-full">
          <div>
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-sky-200/70">
              <span className="text-xs font-black text-sky-800 uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                <Cpu className="w-4 h-4 text-sky-600 flex-shrink-0" />
                Kỹ Năng Bổ Sung
              </span>
              {/* Badge số đồng bộ: chỉ hiển thị số tròn 2 như ô 2 và 3, không còn chữ gợi ý bị rớt dòng */}
              <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-black flex items-center justify-center flex-shrink-0">
                {missingSkills?.length || 0}
              </span>
            </div>

            <div className="space-y-2">
              {missingSkills && missingSkills.length > 0 ? (
                missingSkills.map((sk, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 rounded-xl bg-white/90 border border-sky-200/70 shadow-2xs hover:border-sky-300 hover:bg-sky-50/50 transition-all"
                  >
                    <div className="w-5 h-5 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 text-[10px] font-black mt-0.5">
                      {i + 1}
                    </div>
                    <span className="text-xs font-bold text-slate-800 break-words leading-tight flex-1">
                      {sk}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Đã đáp ứng đầy đủ kỹ năng cốt lõi.</p>
              )}
            </div>
          </div>

          <div className="pt-2 mt-4 border-t border-sky-200/50 text-[10px] font-bold text-sky-700 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-600" />
              Nâng tỷ lệ trúng tuyển +35%
            </span>
            <span className="text-blue-600 font-extrabold">CareerGo AI</span>
          </div>
        </div>

      </div>
    </div>
  );
}
