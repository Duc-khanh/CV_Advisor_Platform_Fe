import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import {
  Sparkles,
  Quote,
  Star,
  CheckCircle2,
  Building2,
  TrendingUp,
  Award,
} from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Nguyễn Tuấn Anh",
      role: "Senior Java Backend Engineer",
      company: "FPT Software",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=faces",
      highlight: "Tăng 40% thu nhập sau khi tối ưu CV",
      quote:
        "Trước đây mình rải hàng chục CV nhưng ít khi qua được vòng hồ sơ. Nhờ CareerGo AI chỉ ra các từ khóa ATS bị thiếu và cấu trúc lại các dự án Microservices, mình nhận được 4 lời mời phỏng vấn chỉ trong tuần đầu tiên!",
      rating: 5,
      impactBadge: "96% AI Match",
    },
    {
      name: "Trần Thị Mai Phương",
      role: "Data Analyst & BI Specialist",
      company: "Techcombank",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=faces",
      highlight: "Tìm được việc mơ ước trong 2 tuần",
      quote:
        "Tính năng Skill Gap Radar của CareerGo cực kỳ chính xác! Mình biết chính xác bản thân đang thiếu kỹ năng Power BI nâng cao và SQL Optimization. Bổ sung xong hồ sơ là match ngay vị trí tại Techcombank.",
      rating: 5,
      impactBadge: "ATS Score 95",
    },
    {
      name: "Lê Hoàng Long",
      role: "Cloud DevOps Engineer",
      company: "VNG Corporation",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces",
      highlight: "Tự tin 100% trong phỏng vấn kỹ thuật",
      quote:
        "Bộ câu hỏi mô phỏng phỏng vấn của trợ lý ảo CareerGo rất sát với thực tế phỏng vấn tại các Big Tech. Nhờ các góp ý phản xạ chuyên môn mà mình đã đàm phán thành công mức đãi ngộ vượt mong đợi.",
      rating: 5,
      impactBadge: "Offer 45 Triệu",
    },
  ];

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Soft Ambient Light */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Câu Chuyện Thành Công
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Nhân Tài Bứt Phá Sự Nghiệp{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Cùng CareerGo
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 max-w-xl leading-relaxed">
              Lắng nghe chia sẻ thực tế từ các kỹ sư, chuyên gia công nghệ đã chinh phục nhà tuyển dụng hàng đầu nhờ trợ lực của AI.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-black text-amber-600 bg-amber-50 px-3.5 py-2 rounded-xl">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>4.9/5 Đánh giá hài lòng</span>
          </div>
        </div>

        {/* ===== 3 TESTIMONIAL CARDS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.09 }}
              whileHover={{ y: -6 }}
              className="group relative p-6 sm:p-7 rounded-3xl bg-white shadow-xs hover:shadow-2xl hover:shadow-sky-500/12 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Header: Stars + Impact Badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    {item.impactBadge}
                  </span>
                </div>

                {/* Highlight Title */}
                <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors mb-2">
                  "{item.highlight}"
                </h4>

                {/* Quote Text */}
                <p className="text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Bottom: User Profile Info */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover shadow-2xs border border-slate-100"
                />

                <div className="min-w-0 flex-1">
                  <h5 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-bold truncate">
                    {item.role}
                  </p>
                  <p className="text-[10px] text-blue-600 font-extrabold flex items-center gap-1 mt-0.5">
                    <Building2 className="w-2.5 h-2.5" />
                    <span>Hiện tại tại {item.company}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Box>
  );
}
