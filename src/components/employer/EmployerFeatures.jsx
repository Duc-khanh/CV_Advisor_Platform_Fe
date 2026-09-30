import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Cpu,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Users,
  Compass
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Đăng Tin Thông Minh & Tối Ưu JD",
    desc: "AI hỗ trợ viết mô tả công việc (JD) chuẩn hóa theo ngành nghề, tự động đề xuất từ khóa để tối ưu lượng tiếp cận ứng viên chất lượng.",
    color: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50 text-blue-700",
    highlights: ["Gợi ý kỹ năng cần có theo thị trường", "Tối ưu hóa SEO tin tuyển dụng", "Tiết kiệm 70% thời gian soạn JD"],
  },
  {
    icon: Cpu,
    title: "AI ATS Screening & Xếp Hạng Tự Động",
    desc: "Thuật toán trí tuệ nhân tạo quét, bóc tách và đo lường độ phù hợp của từng hồ sơ với yêu cầu công việc chỉ trong 0.2 giây.",
    color: "from-indigo-600 to-sky-600",
    bgLight: "bg-indigo-50 text-indigo-700",
    highlights: ["Chấm điểm % tương thích thời gian thực", "Phát hiện kỹ năng ẩn & kinh nghiệm thực chiến", "Lọc tự động hồ sơ không phù hợp"],
  },
  {
    icon: Layers,
    title: "Quản Lý Pipeline Tuyển Dụng Tập Trung",
    desc: "Bảng Kanban trực quan giúp quản trị toàn bộ hành trình ứng viên từ tiếp nhận hồ sơ, phỏng vấn đến khi phát hành thư mời nhận việc.",
    color: "from-purple-600 to-pink-600",
    bgLight: "bg-purple-50 text-purple-700",
    highlights: ["Giao diện kéo thả Kanban tiện lợi", "Ghi chú & chấm điểm phỏng vấn theo team", "Tự động gửi email thông báo trạng thái"],
  },
  {
    icon: BarChart3,
    title: "Báo Cáo Phân Tích & Dự Báo Tuyển Dụng",
    desc: "Hệ thống thống kê trực quan cung cấp bức tranh toàn diện về chi phí tuyển dụng, thời gian tuyển dụng (Time-to-Hire) và tỷ lệ chuyển đổi.",
    color: "from-emerald-600 to-teal-600",
    bgLight: "bg-emerald-50 text-emerald-700",
    highlights: ["Đo lường hiệu quả từng kênh tuyển dụng", "Báo cáo chi phí trên mỗi nhân sự", "Xuất báo cáo PDF/Excel chỉ với 1 click"],
  },
];

export default function EmployerFeatures() {
  return (
    <div className="py-20 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>TÍNH NĂNG DOANH NGHIỆP TOÀN DIỆN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Bộ Công Cụ Tuyển Dụng AI Đột Phá
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Mọi tính năng được thiết kế chuyên biệt để giải quyết các nút thắt lớn nhất trong quy trình tuyển mộ của doanh nghiệp hiện đại.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group p-7 sm:p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400 shadow-md shadow-slate-900/5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${item.bgLight} group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      Module 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-medium">
                    {item.desc}
                  </p>

                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                    {item.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
