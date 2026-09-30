import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  Zap,
  CheckCircle2,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomeCTASection({ onCreateCv }) {
  const navigate = useNavigate();

  const handleExploreJobs = () => {
    const jobSection = document.getElementById("job-list-section");
    if (jobSection) {
      jobSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/search");
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff", position: "relative" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700 p-8 sm:p-12 text-white shadow-2xl shadow-blue-600/20"
        >
          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-400/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            {/* Left Column: Icon + Headline + Subtitle + Micro Perks */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 flex-1 min-w-0">
              {/* High-tech Icon Box */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-xl flex-shrink-0 group">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-200 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400" />
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-cyan-200 text-xs font-black">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  <span>BẮT ĐẦU SỰ NGHIỆP CÙNG AI CAREERGO</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Sẵn Sàng Chinh Phục{" "}
                  <span className="text-cyan-200">Công Việc Mơ Ước?</span>
                </h2>

                <p className="text-xs sm:text-sm text-sky-100 font-medium max-w-xl leading-relaxed">
                  Tạo hồ sơ năng lực chuẩn ATS, nhận gợi ý việc làm tối ưu và phân tích năng lực từ trí tuệ nhân tạo hoàn toàn miễn phí.
                </p>

                {/* 3 Micro Perks */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-[11px] font-bold text-sky-100">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-300" />
                    <span>98% Độ tương thích AI</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tạo CV chỉ trong 2 phút</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Miễn phí 100% trọn đời</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: 2 Call To Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={onCreateCv}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-sky-50 text-blue-700 hover:text-blue-800 font-black text-sm shadow-xl shadow-blue-900/20 hover:shadow-2xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
              >
                <Sparkles className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform" />
                <span>Tạo hồ sơ với AI miễn phí</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={handleExploreJobs}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/30 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Briefcase className="w-4 h-4 text-cyan-200" />
                <span>Khám phá việc làm</span>
              </button>
            </div>
          </div>
        </motion.div>
      </Container>
    </Box>
  );
}
