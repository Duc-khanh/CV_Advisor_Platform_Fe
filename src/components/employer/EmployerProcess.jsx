import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileEdit,
  Cpu,
  UserCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Building2,
    title: "Tạo Hồ Sơ Doanh Nghiệp",
    desc: "Đăng ký nhanh chóng và xác thực thông tin công ty chỉ trong 2 phút để bắt đầu xây dựng thương hiệu tuyển dụng.",
  },
  {
    step: "02",
    icon: FileEdit,
    title: "Đăng Tin Tuyển Dụng AI",
    desc: "Nhập yêu cầu vị trí hoặc tải JD có sẵn, hệ thống AI sẽ tự động chuẩn hóa từ khóa và đề xuất mức lương cạnh tranh.",
  },
  {
    step: "03",
    icon: Cpu,
    title: "AI Tự Động Sàng Lọc & Xếp Hạng",
    desc: "Thuật toán quét hàng ngàn CV, tự động bóc tách kỹ năng, kinh nghiệm và chấm điểm độ phù hợp chính xác đến 96%.",
  },
  {
    step: "04",
    icon: UserCheck,
    title: "Phỏng Vấn & Hoàn Tất Tuyển Dụng",
    desc: "Dễ dàng lên lịch phỏng vấn tập trung, đánh giá theo tiêu chuẩn doanh nghiệp và gửi thư mời làm việc chỉ với 1 click.",
  },
];

export default function EmployerProcess() {
  return (
    <div className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>QUY TRÌNH TINH GỌN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Tuyển Dụng Nhân Tài Chưa Bao Giờ Nhanh Đến Thế
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Chuyển đổi quy trình tuyển dụng thủ công tốn thời gian thành chu trình tự động hóa thông minh cùng CareerGo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className="group relative p-6 sm:p-7 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-blue-400 hover:bg-white shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center shadow-xs transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300 group-hover:text-blue-600 transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <span>Bước {idx + 1} của quy trình</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
