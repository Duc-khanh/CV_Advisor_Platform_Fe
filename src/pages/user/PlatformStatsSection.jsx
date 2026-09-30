import React, { useState, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  Award,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function PlatformStatsSection() {
  const stats = [
    {
      value: "98.5%",
      label: "Tỷ Lệ Vượt Qua ATS",
      description: "Hồ sơ tối ưu bởi AI được các hệ thống tuyển dụng chấp thuận",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      color: "from-emerald-500 to-teal-600",
    },
    {
      value: "35,000+",
      label: "Hồ Sơ Được Cố Vấn",
      description: "Ứng viên đã phân tích và hoàn thiện CV trên toàn quốc",
      icon: <Users className="w-5 h-5 text-sky-600" />,
      color: "from-sky-500 to-blue-600",
    },
    {
      value: "1,200+",
      label: "Doanh Nghiệp Tuyển Dụng",
      description: "Tập đoàn công nghệ và ngân hàng kết nối tìm kiếm nhân sự",
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      color: "from-blue-600 to-indigo-600",
    },
    {
      value: "3.2x",
      label: "Tốc Độ Nhận Offer",
      description: "Rút ngắn thời gian từ lúc ứng tuyển đến khi phỏng vấn",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: "from-amber-500 to-orange-500",
    },
  ];

  // Dynamic simulated live activity ticker items
  const liveActivities = [
    "Ứng viên tại Hà Nội vừa hoàn tất tối ưu CV Java Backend • Độ tương thích 98% AI Match",
    "FPT Software vừa đăng tuyển 5 vị trí Senior Cloud DevOps (AWS / K8s)",
    "Ứng viên tại TP.HCM vừa nhận lịch phỏng vấn vị trí Product Owner qua CareerGo",
    "Techcombank vừa mở tuyển 10 vị trí Data Engineer & Business Analyst",
    "Một ứng viên đạt điểm đánh giá kỹ năng 96/100 chuẩn ATS quốc tế",
  ];

  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [liveActivities.length]);

  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        
        {/* ===== LIVE ACTIVITY TICKER PILL ===== */}
        <div className="flex justify-center mb-9">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs max-w-2xl text-center">
            <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex-shrink-0">
              LIVE PULSE
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-bold text-slate-700 truncate">
              {liveActivities[currentActivityIndex]}
            </span>
          </div>
        </div>

        {/* ===== 4 STATS COUNTER CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.07 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl bg-slate-50/70 hover:bg-white shadow-xs hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between cursor-default"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center mb-4">
                  {stat.icon}
                </div>

                <h3 className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tracking-tight`}>
                  {stat.value}
                </h3>

                <h4 className="text-sm font-black text-slate-900 mt-2">
                  {stat.label}
                </h4>

                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  {stat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-black text-slate-400">
                <Sparkles className="w-3 h-3 text-sky-500" />
                <span>Số liệu thực tế 2026</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Box>
  );
}
