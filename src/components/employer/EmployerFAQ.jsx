import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Headphones,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

const faqs = [
  {
    q: "Hệ thống AI của CareerGo chấm điểm và xếp hạng ứng viên như thế nào?",
    a: "Hệ thống AI Recruit sử dụng mô hình học máy chuyên sâu để phân tích văn bản CV, so khớp 40+ tiêu chí kỹ năng, kinh nghiệm thực chiến và bằng cấp tương thích với bản mô tả công việc (JD). Điểm số Match Score được tính toán theo thời gian thực (chỉ mất ~0.2 giây/CV) với tỷ lệ chuẩn xác lên đến 96%."
  },
  {
    q: "Dữ liệu ứng viên và thông tin nội bộ của doanh nghiệp có được bảo mật không?",
    a: "CareerGo cam kết bảo mật 100% dữ liệu theo tiêu chuẩn quốc tế ISO/IEC 27001 và quy định bảo vệ dữ liệu cá nhân. Mọi thông tin ứng viên, mức lương và ghi chú phỏng vấn đều được mã hóa đầu cuối và không bao giờ chia sẻ cho bên thứ ba."
  },
  {
    q: "Doanh nghiệp có thể dùng thử trước khi trả phí không?",
    a: "Hoàn toàn có! Doanh nghiệp có thể bắt đầu với gói Starter miễn phí hoặc đăng ký dùng thử 7 ngày toàn bộ tính năng cao cấp của gói Professional (không yêu cầu thẻ tín dụng)."
  },
  {
    q: "CareerGo có hỗ trợ tích hợp với hệ thống HRIS/ATS hiện có của chúng tôi không?",
    a: "Có, với gói Enterprise, chúng tôi cung cấp RESTful API và tài liệu SDK hoàn chỉnh để kết nối dữ liệu ứng viên trực tiếp với các hệ thống quản trị nhân sự nội bộ (như SAP, Workday, BambooHR, Base HRM)."
  },
  {
    q: "Tôi có thể xuất dữ liệu báo cáo tuyển dụng ra định dạng nào?",
    a: "Hệ thống hỗ trợ xuất báo cáo phân tích hiệu suất tuyển dụng, chi phí trên mỗi lượt tuyển và bảng danh sách ứng viên đạt chuẩn ra định dạng Excel (.xlsx) và PDF chỉ với 1 click."
  }
];

export default function EmployerFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Heading & Support Contact Card */}
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>GIẢI ĐÁP THẮC MẮC</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Câu Hỏi Thường Gặp Của Doanh Nghiệp
            </h2>

            <p className="mt-4 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
              Giải đáp mọi băn khoăn về quy trình đăng tin, tính chính xác của công nghệ AI ATS và chính sách bảo mật dữ liệu nhân sự.
            </p>

            {/* Support Card */}
            <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200/80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Cần tư vấn trực tiếp 1:1?</h4>
                  <p className="text-xs text-slate-500 font-semibold">Đội ngũ chuyên viên B2B sẵn sàng 24/7</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200/60 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Hotline Doanh Nghiệp: 1900 6868</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Email: enterprise@careergo.vn</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-slate-50/80 border-blue-400 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform flex-shrink-0 ${
                        isOpen ? "bg-blue-600 text-white rotate-180" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-200/60 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
