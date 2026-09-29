import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Collapse,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Building2,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import AIAnalysisCard from './AIAnalysisCard';
import { loadCvAnalysis, clearCvAnalysis, getCurrentUserId } from '../../services/cv/cvAnalysisStorage';

export default function LastCvAnalysisSection() {
  const navigate = useNavigate();
  const [lastAnalysis, setLastAnalysis] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const userId = getCurrentUserId();
    setIsLoggedIn(!!userId);

    const data = loadCvAnalysis();
    setLastAnalysis(data || null);
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    clearCvAnalysis();
    setLastAnalysis(null);
  };

  /* ── 1. GIAO DIỆN KHI CHƯA CÓ PHÂN TÍCH (EMPTY STATE BANNER CÔNG NGHỆ) ── */
  if (!lastAnalysis) {
    return (
      <Container maxWidth={false} sx={{ mt: 6, mb: 6, px: { xs: 3, sm: 6, md: 8, lg: 10 }, position: 'relative', zIndex: 10 }}>
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-sky-50/70 via-white to-blue-50/70 p-6 sm:p-9 shadow-xl shadow-sky-950/5">
          {/* Subtle tech background elements */}
          <div className="absolute inset-0  opacity-25 pointer-events-none" />
          <div className="absolute top-0 right-10 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
            {/* Left Column: Icon AI & Copy */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 flex-shrink-0 group">
                <Cpu className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500" />
                </span>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-sky-200 text-sky-700 text-xs font-black shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>AI CAREER ADVISOR ENGINE</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Tăng Tốc Tìm Việc Với Báo Cáo Phân Tích CV Chuyên Sâu
                </h3>
                <p className="text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
                  {isLoggedIn
                    ? 'Tải lên CV để hệ thống AI rà soát kỹ năng, đo lường độ tương thích và đề xuất các vị trí công việc tối ưu nhất cho bạn.'
                    : 'Đăng nhập và phân tích hồ sơ để nhận báo cáo chỉ số năng lực và việc làm phù hợp từ trí tuệ nhân tạo.'}
                </p>
              </div>
            </div>

            {/* Right Column: Action Buttons & Highlights */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => navigate(isLoggedIn ? '/cv-analysis' : '/login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoggedIn ? 'Phân tích CV ngay' : 'Đăng nhập để phân tích'}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  Tạo tài khoản
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  /* ── 2. GIAO DIỆN KHI ĐÃ CÓ KẾT QUẢ PHÂN TÍCH (HIGH-TECH DASHBOARD) ── */
  const createdDate = lastAnalysis.createdAt
    ? new Date(lastAnalysis.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '';

  const analysisScore = lastAnalysis.analysis?.score ?? lastAnalysis.analysis?.overallScore ?? null;

  return (
    <Container maxWidth={false} sx={{ mt: 6, mb: 6, px: { xs: 3, sm: 6, md: 8, lg: 10 }, position: 'relative', zIndex: 10 }}>
      <div className="relative rounded-[32px] bg-white shadow-2xl shadow-sky-950/10 overflow-hidden transition-all duration-300">
        
        {/* ===== HIGH-TECH HEADER BAR ===== */}
        <div
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="relative px-5 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 cursor-pointer select-none text-white overflow-hidden transition-all"
        >
          {/* Subtle tech grid over header */}
          <div className="absolute inset-0  opacity-15 pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-80 h-32 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left: AI Icon + Title + Meta */}
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Cpu className="w-5 h-5 text-cyan-200 animate-pulse" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                    Kết Quả Phân Tích CV Gần Nhất
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-300/40 text-emerald-200 text-[10px] font-black uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE REPORT
                  </span>
                </div>
                {createdDate && (
                  <p className="text-xs text-sky-100 font-medium mt-0.5 flex items-center gap-1.5">
                    <span>Đã phân tích ngày {createdDate}</span>
                    <span>•</span>
                    <span className="text-cyan-200 font-bold">CareerGo AI Engine</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Metric Pills + Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between md:justify-end">
              
              {/* Score pill */}
              {analysisScore !== null && (
                <div className="px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-1.5 text-xs font-black">
                  <span className="text-sky-200">Điểm số:</span>
                  <span className="text-white text-sm">{analysisScore}%</span>
                </div>
              )}

              {/* Strengths count */}
              {lastAnalysis.analysis?.strengths?.length > 0 && (
                <div className="hidden sm:flex px-2.5 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-300/30 items-center gap-1 text-xs font-bold text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{lastAnalysis.analysis.strengths.length} thế mạnh</span>
                </div>
              )}

              {/* 3 Action Icon Buttons: Bỏ hoàn toàn nền và viền thô kệch, icon trắng thanh mảnh tinh tế */}
              <div className="flex items-center gap-1.5">
                <Tooltip title="Phân tích lại CV" arrow placement="top">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/cv-analysis');
                    }}
                    className="w-9 h-9 rounded-full bg-transparent hover:bg-white/20 text-white/90 hover:text-white transition-all flex items-center justify-center cursor-pointer border-none shadow-none active:scale-90 group"
                    aria-label="Phân tích lại CV"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <RotateCw className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white group-hover:rotate-180 transition-transform duration-500" />
                  </button>
                </Tooltip>

                <Tooltip title="Xóa báo cáo này" arrow placement="top">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="w-9 h-9 rounded-full bg-transparent hover:bg-white/20 text-white/90 hover:text-rose-200 transition-all flex items-center justify-center cursor-pointer border-none shadow-none active:scale-90 group"
                    aria-label="Xóa báo cáo"
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                  </button>
                </Tooltip>

                <Tooltip title={isCollapsed ? 'Mở rộng báo cáo' : 'Thu gọn báo cáo'} arrow placement="top">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCollapsed((prev) => !prev);
                    }}
                    className="w-9 h-9 rounded-full bg-transparent hover:bg-white/20 text-white/90 hover:text-white transition-all flex items-center justify-center cursor-pointer border-none shadow-none active:scale-90"
                    aria-label={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
                    style={{ background: 'transparent', border: 'none' }}
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                    ) : (
                      <ChevronUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                    )}
                  </button>
                </Tooltip>
              </div></div>

          </div>
        </div>

        {/* ===== THÔNG BÁO GỌN GÀNG KHI ĐANG COLLAPSED ===== */}
        {isCollapsed && (
          <div
            onClick={() => setIsCollapsed(false)}
            className="px-6 py-3 bg-gradient-to-r from-sky-50 to-blue-50/60 border-t border-sky-100 flex items-center justify-between cursor-pointer hover:bg-sky-100/60 transition-all text-xs text-slate-700 font-bold"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Báo cáo đang thu gọn • Nhấn để xem chi tiết phân tích và gợi ý việc làm</span>
            </div>
            <span className="text-blue-600 font-black flex items-center gap-1">
              Xem chi tiết <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>
        )}

        {/* ===== COLLAPSIBLE BODY CHI TIẾT ===== */}
        <Collapse in={!isCollapsed} timeout="auto" unmountOnExit={false}>
          <div className="p-5 sm:p-8 space-y-6">
            
            {/* 1. COMPONENT BÁO CÁO NĂNG LỰC AI (HIGH-TECH MINI RADAR) */}
            <AIAnalysisCard {...lastAnalysis.analysis} />

            {/* 2. TÓM TẮT ĐÁNH GIÁ CHUYÊN MÔN (AI SUMMARY TERMINAL) */}
            {lastAnalysis.summary && (
              <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-50/80 via-white to-blue-50/60 border border-sky-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-sky-100">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight">
                    Tóm Tắt Đánh Giá Chuyên Môn
                  </h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 ml-auto">
                    AI INSIGHT
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {lastAnalysis.summary}
                </p>
              </div>
            )}

            {/* 3. DANH SÁCH VIỆC LÀM ĐỀ XUẤT PHÙ HỢP (HIGH-TECH JOB CARDS GRID) */}
            {lastAnalysis.recommendedJobs?.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 tracking-tight">
                        Việc Làm Đề Xuất Cho Bạn
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Dựa trên phân tích tương thích từ CV của bạn
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-black">
                    {Math.min(lastAnalysis.recommendedJobs.length, 4)} vị trí tối ưu
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {lastAnalysis.recommendedJobs.slice(0, 4).map((job, idx) => {
                    const jobId = job.jobId || job.id;
                    const companyInitial =
                      job.companyName?.charAt(0)?.toUpperCase() ||
                      job.title?.charAt(0)?.toUpperCase() ||
                      'J';

                    return (
                      <div
                        key={jobId || idx}
                        onClick={() => jobId && navigate(`/job/${jobId}`)}
                        className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          {/* Top: Avatar & Badges */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-50 to-blue-100 border border-sky-200/60 text-blue-700 flex items-center justify-center font-black text-sm shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform">
                              {companyInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-black text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                {job.title || job.jobTitle || 'Công việc đề xuất'}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span>{job.companyName || job.company || 'Doanh nghiệp'}</span>
                              </p>
                            </div>
                          </div>

                          {/* Chips */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[90px]">
                                {job.location ? job.location.split(',').pop().trim() : 'Toàn quốc'}
                              </span>
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {job.jobType || 'Toàn thời gian'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Salary & Button */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-xs font-black text-emerald-600 truncate">
                            {job.salaryRange || 'Thỏa thuận'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (jobId) navigate(`/job/${jobId}`);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 group-hover:bg-blue-600 text-sky-700 group-hover:text-white font-extrabold text-[11px] transition-all flex items-center gap-0.5 flex-shrink-0"
                          >
                            <span>Chi tiết</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {lastAnalysis.recommendedJobs.length > 4 && (
                  <div className="text-center mt-4">
                    <button
                      onClick={() => navigate('/cv-analysis')}
                      className="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem thêm {lastAnalysis.recommendedJobs.length - 4} việc làm đề xuất khác</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </Collapse>

      </div>
    </Container>
  );
}
