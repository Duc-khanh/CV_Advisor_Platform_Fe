import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Zap,
  Target,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  Calendar,
  Download,
  Share2,
  ChevronRight,
  TrendingUp,
  Award,
  Layers,
  Bot,
  Clock
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

const SAMPLE_CANDIDATES = [
  {
    id: "cand-1",
    name: "Nguyễn Hoàng Nam",
    role: "Senior Fullstack Engineer",
    exp: "5 năm kinh nghiệm",
    score: 96,
    scoreLabel: "Khớp xuất sắc với JD",
    salaryExpectation: "35 - 45 triệu",
    avatar: "HN",
    matchedSkills: ["React / TypeScript", "Node.js", "Docker & Kubernetes", "System Design", "CI/CD"],
    missingSkills: ["AWS Serverless", "GraphQL"],
    aiSummary: "Ứng viên có nền tảng vững chắc về kiến trúc hệ thống phân tán, xử lý tải cao và kinh nghiệm dẫn dắt team 4 người. Điểm nổi bật là dự án tối ưu hiệu năng Microservices giảm 40% latency.",
    keyStrength: "Kiến trúc hệ thống & tối ưu tải",
  },
  {
    id: "cand-2",
    name: "Phạm Quỳnh Trang",
    role: "Senior Product Manager",
    exp: "4 năm kinh nghiệm",
    score: 93,
    scoreLabel: "Đạt chuẩn vượt trội",
    salaryExpectation: "30 - 40 triệu",
    avatar: "QT",
    matchedSkills: ["Agile / Scrum", "Data Analytics (SQL)", "User Research", "Roadmapping", "A/B Testing"],
    missingSkills: ["B2B SaaS Enterprise"],
    aiSummary: "Kinh nghiệm thực chiến phát triển sản phẩm B2C đạt 2M+ người dùng hoạt động. Tư duy dữ liệu sắc bén, có chứng chỉ PMP và khả năng làm việc liên phòng ban hiệu quả.",
    keyStrength: "Tư duy sản phẩm hướng dữ liệu & tăng trưởng",
  },
  {
    id: "cand-3",
    name: "Trần Minh Đức",
    role: "Growth Marketing Lead",
    exp: "6 năm kinh nghiệm",
    score: 89,
    scoreLabel: "Khớp yêu cầu chuyên môn",
    salaryExpectation: "28 - 38 triệu",
    avatar: "MĐ",
    matchedSkills: ["Performance Marketing", "SEO / SEM", "Marketing Automation", "Budget Management", "CAC/LTV Optimization"],
    missingSkills: ["Branding PR Quốc Tế"],
    aiSummary: "Đã quản lý ngân sách quảng cáo hơn 10 tỷ VNĐ/năm với ROAS trung bình 4.2x. Mạnh về thiết lập phễu chuyển đổi tự động và tối ưu hóa chi phí thu hút khách hàng mới.",
    keyStrength: "Tối ưu hóa phễu chuyển đổi số & ROAS",
  },
];

export default function EmployerAiDemo({ onOpenRegister }) {
  const [selectedCandidate, setSelectedCandidate] = useState(SAMPLE_CANDIDATES[0]);
  const showToast = useToast();

  const handleAction = (msg) => {
    if (showToast && typeof showToast.info === "function") {
      showToast.info(msg);
    } else if (showToast && typeof showToast === "function") {
      showToast(msg);
    }
    if (onOpenRegister) {
      onOpenRegister();
    }
  };

  return (
    <div id="ai-recruitment-demo" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-3">
            <Bot className="w-4 h-4 text-blue-600" />
            <span>TRẢI NGHIỆM TRỰC QUAN AI SCREENING SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Thử Nghiệm Cách AI Sàng Lọc & Đánh Giá Hồ Sơ
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Chọn một trong các ứng viên mẫu dưới đây để xem cách hệ thống phân tích từ khóa, so khớp năng lực và xuất báo cáo độ tương thích tự động.
          </p>
        </div>

        {/* Candidate Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          {SAMPLE_CANDIDATES.map((cand) => {
            const isSelected = selectedCandidate.id === cand.id;
            return (
              <button
                key={cand.id}
                type="button"
                onClick={() => setSelectedCandidate(cand)}
                className={`flex items-center gap-3 px-4 sm:px-5 py-3 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-102"
                    : "bg-slate-50 border-slate-200/80 text-slate-700 hover:border-blue-300 hover:bg-white"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black ${
                    isSelected ? "bg-white text-blue-600" : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {cand.avatar}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-extrabold leading-tight">{cand.name}</div>
                  <div className={`text-[11px] font-medium ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                    {cand.role}
                  </div>
                </div>
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {cand.score}% Match
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Live Scorecard Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCandidate.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-9 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 border-2 border-blue-200/80 shadow-xl shadow-blue-900/5"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Scorecard Summary (7 cols) */}
              <div className="lg:col-span-7">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md">
                      {selectedCandidate.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {selectedCandidate.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {selectedCandidate.role} • {selectedCandidate.exp}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 font-bold block">Kỳ vọng lương:</span>
                    <span className="text-xs sm:text-sm font-black text-emerald-600">
                      {selectedCandidate.salaryExpectation}
                    </span>
                  </div>
                </div>

                {/* AI Executive Summary */}
                <div className="my-5 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-black text-blue-700 mb-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Nhận xét tóm tắt từ AI Recruit:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {selectedCandidate.aiSummary}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Thế mạnh cốt lõi: {selectedCandidate.keyStrength}</span>
                  </div>
                </div>

                {/* Skills Matched and Gaps */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-black text-emerald-700 flex items-center gap-1 mb-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Kỹ năng khớp với yêu cầu tuyển dụng (Matched):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.matchedSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-xs font-bold"
                        >
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-black text-amber-700 flex items-center gap-1 mb-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Kỹ năng cần bổ sung / phỏng vấn thêm:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCandidate.missingSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-800 text-xs font-bold"
                        >
                          ⚠ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Scorecard Actions & Radial Meter (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-blue-200/80 shadow-md text-center">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Chỉ Số Khớp Hồ Sơ (Match Score)
                </span>

                <div className="my-5 flex items-center justify-center">
                  <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-blue-50 border-4 border-blue-500 shadow-inner">
                    <div className="text-center">
                      <span className="text-4xl sm:text-5xl font-black text-blue-600">
                        {selectedCandidate.score}%
                      </span>
                      <span className="block text-[10px] text-blue-700 font-extrabold uppercase mt-0.5">
                        {selectedCandidate.scoreLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => handleAction(`Mời phỏng vấn ứng viên ${selectedCandidate.name}`)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Lên lịch phỏng vấn ngay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction(`Tải báo cáo chi tiết CV của ${selectedCandidate.name}`)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span>Tải hồ sơ & báo cáo ATS (PDF)</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Xử lý & phân tích bởi AI Engine chỉ mất 0.19 giây</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
