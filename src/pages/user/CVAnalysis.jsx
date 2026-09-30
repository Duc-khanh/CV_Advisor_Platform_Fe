import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap,
  Target,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  FileCheck,
  Building2,
  MapPin,
  Coins,
  TrendingUp,
  Award,
  Layers,
  Briefcase,
} from "lucide-react";
import AIAnalysisCard from "./AIAnalysisCard";
import api from "../../services/axios";
import { getPublicJobs } from "../../services/job/publicJobService";
import { useToast } from "../../contexts/ToastContext";
import { saveCvAnalysis } from "../../services/cv/cvAnalysisStorage";

export default function CVAnalysis() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const showToast = useToast();
  const [result, setResult] = useState(null);
  const [summary, setSummary] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const resultsRef = useRef(null);

  const formatFileSize = (size) => {
    if (!size) return "0 KB";
    return `${(size / 1024).toFixed(1)} KB`;
  };

  const extractKeywords = (analysis, summaryText) => {
    const keywordSources = [
      summaryText || "",
      analysis?.strengths?.join(" ") || "",
      analysis?.weaknesses?.join(" ") || "",
      analysis?.missingSkills?.join(" ") || "",
    ];

    const rawText = keywordSources.join(" ").toLowerCase();

    return Array.from(
      new Set(
        rawText
          .replace(/[^a-zA-Z0-9\s]+/g, " ")
          .split(/\s+/)
          .filter((word) => word.length >= 3)
      )
    ).slice(0, 35);
  };

  const scoreJobMatch = (job, keywords) => {
    const text = [
      job.title,
      job.companyName,
      job.location,
      job.jobType,
      job.salaryRange,
      job.candidateRequirements,
      job.description,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return keywords.reduce((score, keyword) => {
      return score + (text.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  };

  const buildRecommendedJobs = (jobs, analysis, summaryText) => {
    if (!jobs?.length) return [];

    const keywords = extractKeywords(analysis, summaryText);

    const scored = jobs.map((job) => ({
      job,
      score: scoreJobMatch(job, keywords),
    }));

    const sorted = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.job);

    if (sorted.length >= 4) return sorted.slice(0, 4);

    return jobs.slice(0, 4);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      showToast("Chỉ hỗ trợ tải lên file định dạng PDF.", "warning");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("Dung lượng file PDF tối đa là 5MB.", "warning");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  };

  const handleRemoveFile = (e) => {
    e?.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      showToast("Vui lòng chọn hoặc kéo thả file CV PDF trước khi phân tích.", "warning");
      return;
    }

    setUploading(true);
    setResult(null);
    setRecommendedJobs([]);

    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await api.post("/api/v1/ai/evaluate-cv", formData);
      const data = res.data;

      const analysis = {
        score: Number(data.analysis?.score ?? data.score ?? 0),
        strengths: data.analysis?.strengths ?? data.strengths ?? [],
        weaknesses: data.analysis?.weaknesses ?? data.weaknesses ?? [],
        missingSkills: data.analysis?.missingSkills ?? data.missingSkills ?? [],
      };

      const summaryText = data.analysis?.summary || data.summary || "";

      setResult(analysis);
      setSummary(summaryText);

      setLoadingJobs(true);

      try {
        const jobs = await getPublicJobs();
        const matchedJobs = buildRecommendedJobs(jobs, analysis, summaryText);
        setRecommendedJobs(matchedJobs);

        saveCvAnalysis({
          analysis,
          summary: summaryText,
          recommendedJobs: matchedJobs,
        });

        // Tự động cuộn mượt xuống phần kết quả
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      } finally {
        setLoadingJobs(false);
      }
    } catch (err) {
      const responseData = err.response?.data;
      const rawMessage =
        typeof responseData?.message === "string"
          ? responseData.message
          : typeof responseData === "string"
          ? responseData
          : err.message || "";
      const normalized = rawMessage.toLowerCase();
      const quotaExceeded =
        err.response?.status === 429 ||
        responseData?.code === "AI_QUOTA_EXCEEDED" ||
        normalized.includes("more credits") ||
        normalized.includes("openrouter_credits") ||
        normalized.includes('"code":402');
      const message = quotaExceeded
        ? "AI đã hết hạn mức sử dụng. Vui lòng nạp thêm credit OpenRouter rồi thử lại."
        : rawMessage && rawMessage.length <= 180
        ? rawMessage
        : "Không thể phân tích CV lúc này. Vui lòng thử lại sau.";

      showToast(message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 relative selection:bg-blue-100 selection:text-blue-900 pb-16">
      {/* Ambient Radial Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-50/60 via-indigo-50/30 to-transparent pointer-events-none -z-0 blur-3xl" />
      <div className="absolute top-24 left-1/4 w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-36 right-1/4 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10">
        {/* ================= SYNCHRONIZED 3D GLASSMORPHISM AI ENGINE CARDS (SÁT VÀO TRONG, HẠ THẤP, GỌN GÀNG) ================= */}
        {/* LEFT SIDE: Input - 3D Holographic CV Scanner */}
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

              {/* Document Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div>
                      <div className="w-14 h-2 rounded-full bg-slate-300" />
                      <div className="w-9 h-1.5 rounded-full bg-blue-400 mt-1" />
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[9px] font-black border border-blue-100">
                    CV SCAN
                  </span>
                </div>

                {/* Document Abstract Content Lines */}
                <div className="space-y-1.5 mb-2.5">
                  <div className="w-full h-1.5 rounded-full bg-slate-200/80" />
                  <div className="w-5/6 h-1.5 rounded-full bg-slate-200/70" />
                  <div className="w-4/5 h-1.5 rounded-full bg-slate-200/80" />
                </div>

                {/* Extracted Skill Tags */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600 text-[9px] font-bold border border-slate-200/60">React</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600 text-[9px] font-bold border border-slate-200/60">Java</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600 text-[9px] font-bold border border-slate-200/60">Docker</span>
                </div>
              </div>

              {/* Bottom ATS Match Indicator */}
              <div className="p-2 rounded-xl bg-white/95 border border-emerald-200/90 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-slate-800">ATS 98%</span>
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
                <Cpu className="w-5 h-5 text-indigo-600" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Output - 3D Holographic AI Job Match Report */}
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
                      <p className="text-[10px] font-black text-slate-800 leading-tight">AI MATCH</p>
                      <p className="text-[8.5px] font-bold text-indigo-500">Khớp việc làm</p>
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[9px] font-black border border-purple-100">
                    TOP FIT
                  </span>
                </div>

                {/* Mini Job Result Match 1 */}
                <div className="p-1.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 mb-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-800 truncate">Senior Frontend</span>
                    <span className="text-[9px] font-black text-indigo-600">99%</span>
                  </div>
                  <span className="text-[8.5px] font-bold text-slate-500">$2,000 - $3,500/tháng</span>
                </div>

                {/* Mini Job Result Match 2 */}
                <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-slate-700 truncate">Fullstack Engineer</span>
                    <span className="text-[9px] font-black text-emerald-600">96%</span>
                  </div>
                  <span className="text-[8.5px] font-bold text-slate-500">35+ Vị trí tuyển</span>
                </div>
              </div>

              {/* Bottom Match Ready Badge */}
              <div className="p-2 rounded-xl bg-white/95 border border-indigo-200/90 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-[11px] font-black text-indigo-950">35+ Đề xuất</span>
                </div>
                <span className="text-[9px] font-extrabold text-indigo-600">Sẵn sàng →</span>
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
        {/* ================= 1. HERO HEADER ================= */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 shadow-xs backdrop-blur-xs text-xs font-bold text-blue-700 mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="tracking-wide">AI CV ADVISOR & MATCHING ENGINE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Phân Tích CV Chuyên Sâu{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              Bằng Trí Tuệ Nhân Tạo
            </span>
          </h1>

          <p className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto">
            Tải lên CV để hệ thống tự động bóc tách kỹ năng, phát hiện điểm mạnh - điểm yếu và gợi ý công việc phù hợp theo tiêu chuẩn ATS quốc tế.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              Đánh giá chuẩn ATS
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Bóc tách Hard & Soft Skills
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/80 border border-slate-200/60">
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Gợi ý việc làm thực tế
            </span>
          </div>
        </div>

        {/* ================= 2. UPLOAD & DROPZONE CARD ================= */}
        <div className="max-w-2xl mx-auto bg-white/95 rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-4 sm:p-7 backdrop-blur-md relative overflow-hidden transition-all duration-300">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-9 text-center cursor-pointer transition-all duration-300 ${
              isDragging
                ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                : file
                ? "border-emerald-300 bg-emerald-50/20"
                : "border-slate-300 hover:border-blue-500 bg-slate-50/40 hover:bg-blue-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleFileChange}
            />

            {!file ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-100 border border-blue-200 text-blue-600 flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-blue-600 stroke-[1.8]" />
                </div>

                <p className="text-sm sm:text-base font-bold text-slate-800">
                  Kéo & thả file PDF vào đây hoặc
                </p>

                <button
                  type="button"
                  className="mt-3 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Chọn file từ máy tính</span>
                </button>

                <p className="mt-3 text-xs text-slate-400 font-medium">
                  Hỗ trợ định dạng PDF (tối đa 5MB)
                </p>
              </div>
            ) : (
              /* Selected file state */
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-emerald-200/90 shadow-sm text-left">
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      {formatFileSize(file.size)} • Định dạng PDF •{" "}
                      <span className="text-emerald-600 font-bold">Sẵn sàng phân tích</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                  >
                    Đổi file khác
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={uploading || !file}
            onClick={handleAnalyze}
            className={`w-full mt-4 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md ${
              uploading || !file
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:via-indigo-700 hover:to-sky-700 text-white shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-[0.99]"
            }`}
          >
            {uploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>AI đang bóc tách và phân tích hồ sơ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white" />
                <span>Bắt đầu phân tích CV</span>
              </>
            )}
          </button>

          {/* Security & Confidentiality */}
          <div className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>File của bạn được bảo mật tuyệt đối và chỉ sử dụng cho mục đích phân tích năng lực cá nhân.</span>
          </div>
        </div>

        {/* ================= 3. THREE FEATURE HIGHLIGHT CARDS ================= */}
        {!result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 sm:mt-10 max-w-4xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Chuẩn Hóa ATS Quốc Tế
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Kiểm tra định dạng, độ tương thích bộ lọc tự động và mật độ từ khóa theo tiêu chuẩn tuyển dụng hiện đại.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Radar Lỗ Hổng Năng Lực
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Bóc tách chi tiết kỹ năng chuyên môn, kỹ năng mềm và chỉ ra các lỗ hổng kiến thức cần bổ sung ngay.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-sky-300 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Ghép Nối Việc Làm Real-time
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Thuật toán ghép nối đề xuất ngay các vị trí công việc có độ khớp cao nhất từ hệ thống việc làm mở tuyển.
              </p>
            </div>
          </div>
        )}

        {/* ================= 4. RESULTS SECTION ================= */}
        {result && (
          <div ref={resultsRef} className="mt-10 space-y-6 animate-fade-in">
            {/* Component Báo cáo Năng lực AI chuẩn Mini HUD Radar */}
            <AIAnalysisCard {...result} />

            {/* AI Summary Terminal */}
            {summary && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-sky-50/80 via-white to-blue-50/60 border border-sky-200/80 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-sky-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      Tóm Tắt Đánh Giá Chuyên Môn
                    </h4>
                  </div>
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                    AI SUMMARY
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                  {summary}
                </p>
              </div>
            )}

            {/* Recommended Jobs Grid */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 tracking-tight">
                      Gợi Ý Việc Làm Tương Thích
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Các cơ hội nghề nghiệp tối ưu dựa trên hồ sơ vừa phân tích
                    </p>
                  </div>
                </div>
                {recommendedJobs.length > 0 && (
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    {Math.min(recommendedJobs.length, 4)} vị trí hàng đầu
                  </span>
                )}
              </div>

              {loadingJobs ? (
                <div className="py-10 text-center text-xs font-bold text-slate-400 flex flex-col items-center gap-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                  <span>Đang quét và tính toán độ tương thích việc làm từ hệ thống...</span>
                </div>
              ) : recommendedJobs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendedJobs.slice(0, 4).map((job, idx) => {
                    const jobId = job.jobId || job.id;
                    const companyInitial =
                      job.companyName?.charAt(0)?.toUpperCase() ||
                      job.title?.charAt(0)?.toUpperCase() ||
                      "J";

                    return (
                      <div
                        key={jobId || idx}
                        onClick={() => jobId && navigate(`/job/${jobId}`)}
                        className="group p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-100 border border-blue-200/80 text-blue-700 flex items-center justify-center font-black text-sm shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform">
                              {companyInitial}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-black text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                                {job.title || job.jobTitle || "Công việc đề xuất"}
                              </h5>
                              <p className="text-[11px] text-slate-500 font-bold truncate mt-0.5 flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                <span className="truncate">{job.companyName || job.company || "Doanh nghiệp"}</span>
                              </p>
                            </div>
                          </div>

                          {job.location && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold mb-2">
                              <MapPin className="w-2.5 h-2.5 text-slate-400" />
                              <span className="truncate">{job.location}</span>
                            </span>
                          )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                          <span className="text-xs font-black text-emerald-600 truncate flex items-center gap-1">
                            <Coins className="w-3 h-3 text-emerald-500" />
                            {job.salaryRange || "Thỏa thuận"}
                          </span>
                          <span className="text-[11px] font-extrabold text-blue-600 group-hover:text-blue-700 flex items-center gap-0.5">
                            Chi tiết
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  Chưa tìm thấy gợi ý việc làm phù hợp trong cơ sở dữ liệu.
                </div>
              )}
            </div>

            {/* Quick Action: Re-upload / Upload another */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setFile(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Phân tích CV khác</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
