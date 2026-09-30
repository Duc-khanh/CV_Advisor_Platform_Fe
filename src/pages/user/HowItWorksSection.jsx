import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import {
  Sparkles,
  Cpu,
  Target,
  Rocket,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function HowItWorksSection() {
  const points = [
    {
      step: "01",
      title: "Phân Tích CV Bằng AI",
      desc: "Trí tuệ nhân tạo quét sâu kỹ năng, rà soát lỗ hổng và chấm điểm độ tương thích chuẩn ATS tức thì.",
      icon: <Cpu className="w-6 h-6 text-sky-600" />,
      tag: "AI ATS Audit",
      gradient: "from-sky-50 to-blue-50",
    },
    {
      step: "02",
      title: "Gợi Ý Việc Làm Chuẩn Xác",
      desc: "Thuật toán so khớp kỹ năng thực tế với hàng nghìn JD tuyển dụng, lọc ra cơ hội có độ phù hợp từ 90%+.",
      icon: <Target className="w-6 h-6 text-blue-600" />,
      tag: "Match 98%",
      gradient: "from-blue-50 to-indigo-50",
    },
    {
      step: "03",
      title: "Hệ Sinh Thái Việc Làm Đa Dạng",
      desc: "Kết nối trực tiếp cùng 1.200+ doanh nghiệp và tập đoàn công nghệ hàng đầu, cập nhật vị trí mới liên tục.",
      icon: <Rocket className="w-6 h-6 text-indigo-600" />,
      tag: "10,000+ Jobs",
      gradient: "from-indigo-50 to-cyan-50",
    },
    {
      step: "04",
      title: "Định Hướng & Thăng Tiến",
      desc: "Cung cấp lộ trình trau dồi kỹ năng trọng điểm, bí quyết phỏng vấn và cẩm nang phát triển sự nghiệp bền vững.",
      icon: <TrendingUp className="w-6 h-6 text-cyan-600" />,
      tag: "Career Growth",
      gradient: "from-cyan-50 to-sky-50",
    },
  ];

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Subtle Tech Blue Lighting */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Giá Trị Vượt Trội Cùng AI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Tại Sao Nhân Tài Chọn{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CareerGo?
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl leading-relaxed">
              Nền tảng cố vấn nghề nghiệp thông minh, đồng hành cùng bạn từ khâu tối ưu hóa hồ sơ năng lực đến lúc nhận offer công việc lý tưởng.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-black text-slate-400 bg-slate-50 px-3.5 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Cam kết miễn phí 100% cho ứng viên</span>
          </div>
        </div>

        {/* ===== 4 FEATURE CARDS GRID (CÂN ĐỐI, HIỆN ĐẠI, THỜI THƯỢNG) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
          {points.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative p-6 rounded-3xl bg-white shadow-xs hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-0" />

              <div>
                {/* Top Row: Icon Box + Step Tag Number */}
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <div
                    className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${point.gradient} border border-sky-200/70 flex items-center justify-center shadow-2xs group-hover:scale-108 group-hover:border-sky-300 transition-all duration-300`}
                  >
                    {point.icon}
                  </div>

                  <span className="font-mono text-xl font-black text-slate-200 group-hover:text-blue-500/30 transition-colors select-none">
                    {point.step}
                  </span>
                </div>

                {/* Badge Tag */}
                <div className="relative z-10 mb-2">
                  <span className="text-[10px] font-black text-sky-700 bg-sky-50 border border-sky-200/70 px-2 py-0.5 rounded-full inline-block">
                    {point.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {point.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-500 font-medium mt-2 leading-relaxed">
                    {point.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Feature Line */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors relative z-10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trải nghiệm mượt mà & chính xác</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Box>
  );
}
