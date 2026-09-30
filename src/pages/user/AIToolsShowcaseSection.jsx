import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Cpu,
  FileCheck2,
  Compass,
  TrendingUp,
  MessageSquareCode,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart3,
  Layers,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIToolsShowcaseSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const tools = [
    {
      id: "ats-scanner",
      tabTitle: "AI ATS Scanner",
      badge: "CÔNG NGHỆ QUÉT ATS 2026",
      title: "Rà Soát & Chấm Điểm CV Chuẩn ATS",
      description:
        "Thuật toán AI phân tích cấu trúc, mật độ từ khóa chuyên ngành và phát hiện lỗi ngữ nghĩa tiềm ẩn khiến CV của bạn bị loại trước khi đến tay nhà tuyển dụng.",
      actionText: "Thử phân tích CV ngay",
      actionLink: "/cv-analysis",
      icon: <FileCheck2 className="w-5 h-5 text-sky-600" />,
      features: [
        "Kiểm tra 40+ tiêu chí định dạng chuẩn ATS",
        "Gợi ý bổ sung từ khóa kỹ thuật còn thiếu",
        "Đo lường chỉ số tác động (Impact Score) từng dự án",
      ],
      previewContent: {
        score: 94,
        scoreLabel: "Đạt chuẩn ATS xuất sắc",
        metrics: [
          { label: "Mật độ từ khóa chuyên ngành", val: "96%", status: "success" },
          { label: "Cấu trúc & Định dạng chuẩn", val: "92%", status: "success" },
          { label: "Số liệu định lượng thành tích", val: "88%", status: "warning" },
        ],
        tips: "Nên bổ sung thêm số liệu % tối ưu hiệu năng vào dự án Microservices.",
      },
    },
    {
      id: "skill-gap",
      tabTitle: "Phân Tích Kỹ Năng",
      badge: "SKILL GAP RADAR",
      title: "Đo Lường Khoảng Trống Năng Lực",
      description:
        "So sánh trực tiếp kỹ năng hiện tại trong hồ sơ của bạn với yêu cầu thực tế của thị trường tuyển dụng để tìm ra những mắt xích kỹ thuật cần bổ sung.",
      actionText: "Xem lộ trình học tập",
      actionLink: "/learning-path",
      icon: <Compass className="w-5 h-5 text-blue-600" />,
      features: [
        "So khớp kỹ năng với 5.000+ tin tuyển dụng thực tế",
        "Đề xuất công nghệ cần học để tăng 30-50% mức lương",
        "Cung cấp checklist khóa học và dự án thực chiến",
      ],
      previewContent: {
        targetRole: "Senior Java & Cloud Architect",
        matchedSkills: ["Spring Boot", "MySQL", "RESTful API", "Docker", "Git"],
        missingSkills: ["Kubernetes", "Kafka Streaming", "AWS ECS"],
        salaryPotential: "35 - 55 Triệu VNĐ",
      },
    },
    {
      id: "ai-interview",
      tabTitle: "Phỏng Vấn AI",
      badge: "MOCK INTERVIEW AI COACH",
      title: "Luyện Phỏng Vấn Giả Lập Cùng AI",
      description:
        "Tập dượt các câu hỏi phỏng vấn kỹ thuật và tình huống hóc búa, nhận phản hồi tức thì về sự rõ ràng, độ tự tin và tính chính xác chuyên môn.",
      actionText: "Luyện phỏng vấn AI ngay",
      actionLink: "/ai-interview",
      icon: <MessageSquareCode className="w-5 h-5 text-indigo-600" />,
      features: [
        "Bộ câu hỏi tùy biến theo đúng Job Description mục tiêu",
        "Chấm điểm câu trả lời theo công thức STAR chuẩn quốc tế",
        "Đánh giá điểm mạnh và góc nhìn cần cải thiện tức thì",
      ],
      previewContent: {
        question: "Làm thế nào bạn giải quyết bài toán nghẽn cổ chai (bottleneck) trong kiến trúc phân tán?",
        aiFeedback: "Câu trả lời nêu rõ nguyên nhân DB lock và giải pháp Redis Cache rất tốt. Nên nhấn mạnh thêm về cơ chế Circuit Breaker.",
        confidenceScore: 89,
      },
    },
    {
      id: "salary-predictor",
      tabTitle: "Dự Báo Thu Nhập",
      badge: "MARKET BENCHMARKING",
      title: "Dự Đoán Mức Lương & Lộ Trình Thăng Tiến",
      description:
        "Dựa trên dữ liệu thực tế từ hàng nghìn offer việc làm, AI định giá chính xác giá trị của bạn trên thị trường và vạch ra lộ trình để chạm mốc thu nhập mơ ước.",
      actionText: "Khám phá việc làm lương cao",
      actionLink: "/search",
      icon: <TrendingUp className="w-5 h-5 text-cyan-600" />,
      features: [
        "Biểu đồ phân phối lương theo năm kinh nghiệm & Tech Stack",
        "Dự báo mức tăng trưởng thu nhập trong 2 - 3 năm tới",
        "Đề xuất top 10 công ty trả đãi ngộ cao nhất cho vị trí của bạn",
      ],
      previewContent: {
        currentEstimate: "28.5 - 35 Triệu",
        potentialNextLevel: "45 - 60 Triệu",
        keyCatalysts: ["Thành thạo Kubernetes & Cloud Native", "Kinh nghiệm thiết kế High Concurrency System"],
      },
    },
  ];

  const currentTool = tools[activeTab];

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
              Bộ Công Cụ Cố Vấn Nghề Nghiệp AI
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Nâng Tầm Sự Nghiệp Với{" "}
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hệ Thống Trí Tuệ Nhân Tạo
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
            Từ quét lỗi CV, bổ sung kỹ năng còn thiếu đến dự báo mức lương mục tiêu — CareerGo trang bị đầy đủ công nghệ để bạn luôn dẫn đầu trong mọi đợt tuyển dụng.
          </p>
        </div>

        {/* ===== INTERACTIVE TAB SWITCHER (4 TOOLS) ===== */}
        <div className="flex items-center justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-100/80 rounded-2xl gap-1 overflow-x-auto max-w-full">
            {tools.map((tool, index) => {
              const isActive = activeTab === index;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-blue-700 shadow-md shadow-slate-200/60 font-black"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <div className={`${isActive ? "scale-110" : "opacity-70"} transition-all`}>
                    {tool.icon}
                  </div>
                  <span>{tool.tabTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== TOOL SHOWCASE CARD & LIVE MOCKUP ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-[32px] bg-gradient-to-br from-slate-50/90 via-white to-sky-50/40 p-6 sm:p-10 shadow-xs hover:shadow-xl transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Information & Feature Bullets */}
              <div className="lg:col-span-6 space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-100/70 text-sky-800 text-[11px] font-black tracking-wide">
                  <Sparkles className="w-3 h-3 text-sky-600" />
                  <span>{currentTool.badge}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {currentTool.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {currentTool.description}
                </p>

                {/* Feature Bullet Points */}
                <div className="space-y-2.5 pt-2">
                  {currentTool.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-700">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Call To Action Button */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(currentTool.actionLink)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all cursor-pointer active:scale-95 group"
                  >
                    <span>{currentTool.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: Visual Interactive Live Mockup Terminal */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                  
                  {/* Top Bar of Mockup */}
                  <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-mono font-bold text-slate-400 ml-1.5">
                        ai_terminal_engine.v2
                      </span>
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      ● LIVE PREVIEW
                    </span>
                  </div>

                  {/* Dynamic Mockup Body Based on Selected Tool */}
                  {currentTool.id === "ats-scanner" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70">
                        <div>
                          <p className="text-[11px] font-black text-sky-700 uppercase">Điểm Số Tương Thích ATS</p>
                          <p className="text-2xl font-black text-slate-900 mt-0.5">
                            {currentTool.previewContent.score}/100
                          </p>
                        </div>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-lg">
                          {currentTool.previewContent.scoreLabel}
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {currentTool.previewContent.metrics.map((m, i) => (
                          <div key={i} className="flex items-center justify-between text-xs font-bold text-slate-700 p-2 rounded-lg bg-slate-50">
                            <span>{m.label}</span>
                            <span className="font-mono font-black text-blue-600">{m.val}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/60 text-xs font-bold text-amber-800 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{currentTool.previewContent.tips}</span>
                      </div>
                    </div>
                  )}

                  {currentTool.id === "skill-gap" && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-blue-50/70">
                        <p className="text-[11px] font-black text-blue-700 uppercase">Vị trí mục tiêu</p>
                        <p className="text-base font-black text-slate-900 mt-0.5">
                          {currentTool.previewContent.targetRole}
                        </p>
                        <p className="text-xs font-bold text-emerald-600 mt-1">
                          Mức thu nhập kỳ vọng: {currentTool.previewContent.salaryPotential}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-black text-slate-500 mb-2">Kỹ năng bạn đã sở hữu:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentTool.previewContent.matchedSkills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-black flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-black text-rose-500 mb-2">Kỹ năng AI khuyến nghị học thêm:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {currentTool.previewContent.missingSkills.map((s, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 text-xs font-black flex items-center gap-1">
                              <Zap className="w-3 h-3 text-rose-500" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentTool.id === "ai-interview" && (
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Câu hỏi phỏng vấn mô phỏng</p>
                        <p className="text-xs sm:text-sm font-black text-slate-800 mt-1 leading-snug">
                          "{currentTool.previewContent.question}"
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-black text-indigo-700">AI Mentor Feedback</span>
                          <span className="text-xs font-black text-indigo-700">
                            Điểm độ tin cậy: {currentTool.previewContent.confidenceScore}%
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-700 leading-relaxed">
                          {currentTool.previewContent.aiFeedback}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        <span>Sẵn sàng cho buổi tập dượt tiếp theo</span>
                      </div>
                    </div>
                  )}

                  {currentTool.id === "salary-predictor" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Định giá năng lực hiện tại</p>
                          <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                            {currentTool.previewContent.currentEstimate}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-emerald-50">
                          <p className="text-[10px] font-black text-emerald-600 uppercase">Mốc thu nhập tiềm năng</p>
                          <p className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">
                            {currentTool.previewContent.potentialNextLevel}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-black text-slate-600">Đòn bẩy kỹ thuật để bứt phá thu nhập:</p>
                        {currentTool.previewContent.keyCatalysts.map((c, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-sky-50 text-xs font-bold text-sky-800 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-sky-600 flex-shrink-0" />
                            <span>{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
