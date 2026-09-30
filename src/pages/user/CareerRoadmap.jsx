import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Box, Container, Stack, Grid } from "@mui/material";
import { Sparkles, Target, Cpu, TrendingUp, RefreshCw, CheckCircle2, GraduationCap, Award, Zap, BookOpen, Layers } from "lucide-react";
import { evaluateCvFile, generateCareerRoadmap } from "../../services/ai/aiService";
import {
  HeaderSection,
  UploadFormSection,
  EvaluationCard,
  SkillAnalysisCard,
  RoadmapSection,
  MarketTrendsSection,
} from "../../components/roadmap";

const CareerRoadmap = () => {
  const [cvFile, setCvFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [desiredRoadmap, setDesiredRoadmap] = useState("6 tháng (Tiêu chuẩn)");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");
  const resultsRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Dung lượng file PDF tối đa là 5MB.");
        setCvFile(null);
        return;
      }
      setCvFile(file);
      setError("");
    } else {
      setError("Vui lòng chọn file CV định dạng PDF.");
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      setError("Vui lòng tải lên CV của bạn trước khi phân tích");
      return;
    }
    if (!targetRole.trim()) {
      setError("Vui lòng nhập vị trí nghề nghiệp mục tiêu");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setEvaluation(null);
    setRoadmap(null);

    try {
      const evaluationResult = await evaluateCvFile(cvFile, targetRole.trim());
      setEvaluation(evaluationResult);

      const roadmapResult = await generateCareerRoadmap(cvFile, targetRole.trim(), desiredRoadmap.trim());
      setRoadmap(roadmapResult);

      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.";
      setError(message);
      console.error("Lỗi phân tích CV:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCvFile(null);
    setTargetRole("");
    setDesiredRoadmap("6 tháng (Tiêu chuẩn)");
    setEvaluation(null);
    setRoadmap(null);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative selection:bg-blue-100 selection:text-blue-900 pb-16">
      {/* Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent pointer-events-none -z-0 blur-3xl" />
      <div className="absolute top-24 left-1/4 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-36 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-8 relative z-10">
        {/* ================= SYNCHRONIZED 3D GLASSMORPHISM AI ENGINE CARDS (CAREER ROADMAP) ================= */}
        {/* LEFT SIDE: Input - Skill Gap Analysis Card */}
        <div className="hidden xl:block absolute left-2 xl:left-8 2xl:left-14 top-14 pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [-4, -1.5, -4],
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.8 },
              scale: { duration: 0.8 },
              rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
            }}
            className="relative w-46 h-64"
          >
            {/* Soft Cyan/Blue Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-500/20 rounded-3xl blur-2xl" />

            {/* 3D Glassmorphism Document Sheet */}
            <div className="relative w-full h-full rounded-2xl bg-white/90 border border-blue-200/90 shadow-2xl shadow-blue-600/10 p-3.5 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
              {/* Animated Laser Scanning Line */}
              <motion.div
                animate={{ y: [0, 210, 0] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_16px_3px_rgba(34,211,238,0.9)] z-30"
              />

              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                      <Cpu className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 leading-tight">SKILL GAP</p>
                      <p className="text-[8.5px] font-bold text-blue-600">Bóc tách lỗ hổng</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-black border border-blue-100">
                    AI AUDIT
                  </span>
                </div>

                {/* Skill Progression & Gap Items */}
                <div className="space-y-1.5 mb-2">
                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-[9px] font-extrabold text-slate-700 mb-0.5">
                      <span>System Design</span>
                      <span className="text-amber-600 font-black">Cần bổ sung</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-amber-500 h-1 rounded-full w-[45%]" />
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex justify-between text-[9px] font-extrabold text-slate-700 mb-0.5">
                      <span>Cloud Architecture</span>
                      <span className="text-blue-600 font-black">Level 2/4</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                      <div className="bg-blue-500 h-1 rounded-full w-[65%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Gap Summary Indicator */}
              <div className="p-2 rounded-xl bg-white/95 border border-emerald-200/90 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-slate-800">Sẵn sàng 75%</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            {/* Floating 3D AI Chip Accessory */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, 180, 360] }}
              transition={{
                y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 20, ease: "linear" },
              }}
              className="absolute -bottom-4 -right-2 w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20"
            >
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Output - 3D Holographic Milestone Roadmap Card */}
        <div className="hidden xl:block absolute right-2 xl:right-8 2xl:right-14 top-14 pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: [4, 1.5, 4],
              y: [0, -12, 0],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.2 },
              scale: { duration: 0.8, delay: 0.2 },
              rotate: { repeat: Infinity, duration: 6.5, ease: "easeInOut" },
              y: { repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 0.2 },
            }}
            className="relative w-46 h-64"
          >
            {/* Soft Purple/Indigo Glow Halo */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 via-indigo-500/15 to-blue-500/20 rounded-3xl blur-2xl" />

            {/* 3D Glassmorphism Match Report Card */}
            <div className="relative w-full h-full rounded-2xl bg-white/90 border border-indigo-200/90 shadow-2xl shadow-indigo-600/10 p-3.5 backdrop-blur-xl overflow-hidden flex flex-col justify-between">
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xs">
                      <Target className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-800 leading-tight">AI ROADMAP</p>
                      <p className="text-[8.5px] font-bold text-indigo-500">Lộ trình 6 Tháng</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[9px] font-black border border-purple-100">
                    AI PLAN
                  </span>
                </div>

                {/* Timeline Mini Milestones */}
                <div className="space-y-1.5 mb-1.5">
                  <div className="p-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-800">Tháng 1-2: Core Arch</span>
                      <span className="text-[9px] font-black text-indigo-600">Giai đoạn 1</span>
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-500">Nền tảng & Data Pipeline</span>
                  </div>

                  <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-700">Tháng 3-6: Real Project</span>
                      <span className="text-[9px] font-black text-emerald-600">Giai đoạn 2</span>
                    </div>
                    <span className="text-[8.5px] font-bold text-slate-500">Fullstack Capstone</span>
                  </div>
                </div>
              </div>

              {/* Bottom Roadmap Ready Badge */}
              <div className="p-2 rounded-xl bg-white/95 border border-indigo-200/90 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-indigo-950">Lộ trình sẵn sàng</span>
                </div>
                <span className="text-[9px] font-extrabold text-indigo-600">Khám phá →</span>
              </div>
            </div>

            {/* Floating 3D Award/Milestone Badge */}
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
              transition={{
                y: { repeat: Infinity, duration: 4.5, ease: "easeInOut" },
                rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" },
              }}
              className="absolute -bottom-4 -left-2 w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 p-0.5 shadow-lg shadow-orange-500/20"
            >
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-500" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Header Section */}
        <HeaderSection />

        {/* Input Form Section */}
        <div className="mt-2">
          <UploadFormSection
            cvFile={cvFile}
            targetRole={targetRole}
            desiredRoadmap={desiredRoadmap}
            error={error}
            isAnalyzing={isAnalyzing}
            onFileUpload={handleFileUpload}
            onTargetRoleChange={setTargetRole}
            onDesiredRoadmapChange={setDesiredRoadmap}
            onAnalyze={handleAnalyze}
            onReset={handleReset}
          />
        </div>

        {/* ================= 3 FEATURE HIGHLIGHT CARDS (BEFORE RESULT) ================= */}
        {!roadmap && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 sm:mt-10 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Phân Tích Lỗ Hổng Năng Lực
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                So khớp kỹ năng hiện tại trong CV với mô tả công việc (JD) vị trí mong muốn để nhận diện chính xác khoảng cách chuyên môn.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Lộ Trình Từng Giai Đoạn
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Chia nhỏ hành trình theo từng mốc thời gian rõ ràng, kèm danh sách công nghệ cốt lõi và bài tập thực hành ứng dụng.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Xu Hướng & Nhu Cầu Thị Trường
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Cập nhật độ cạnh tranh, mức lương trung bình và yêu cầu thực tế từ các doanh nghiệp tuyển dụng hàng đầu.
              </p>
            </div>
          </div>
        )}

        {/* ================= RESULTS SECTION ================= */}
        {evaluation && roadmap && (
          <div ref={resultsRef} className="mt-12 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-5">
                <EvaluationCard
                  evaluation={evaluation}
                  targetRole={targetRole}
                  desiredRoadmap={desiredRoadmap}
                />
              </div>
              <div className="lg:col-span-7">
                <SkillAnalysisCard evaluation={evaluation} />
              </div>
            </div>

            <RoadmapSection roadmap={roadmap} />
            <MarketTrendsSection roadmap={roadmap} />

            {/* Quick Action: Reset / Plan Another */}
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Thiết lập lộ trình mục tiêu khác</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerRoadmap;
