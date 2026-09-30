import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  ShieldCheck,
  ArrowRight,
  Flame
} from "lucide-react";

export default function EmployerPricing({ onOpenRegister }) {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      id: "starter",
      title: "Gói Khởi Nghiệp (Starter)",
      badge: "DÙNG THỬ MIỄN PHÍ",
      price: "0",
      unit: "Miễn phí trải nghiệm",
      desc: "Phù hợp cho doanh nghiệp vừa thành lập hoặc có nhu cầu tuyển dụng ít.",
      popular: false,
      features: [
        "Đăng tối đa 3 tin tuyển dụng",
        "Tiếp nhận tối đa 50 hồ sơ ứng viên",
        "Sàng lọc hồ sơ cơ bản",
        "Hỗ trợ qua email trong 24h",
      ],
      buttonText: "Bắt đầu miễn phí",
      buttonStyle: "bg-slate-100 hover:bg-slate-200 text-slate-800",
    },
    {
      id: "pro",
      title: "Gói Chuyên Nghiệp (Pro Enterprise)",
      badge: "ĐƯỢC 80% DOANH NGHIỆP LỰA CHỌN",
      price: isAnnual ? "790.000" : "990.000",
      unit: isAnnual ? "VNĐ / tháng (Trả theo năm)" : "VNĐ / tháng",
      desc: "Giải pháp toàn diện tối ưu hóa toàn bộ quy trình tuyển dụng bằng công nghệ AI.",
      popular: true,
      features: [
        "Đăng không giới hạn tin tuyển dụng",
        "AI ATS Screening & Xếp hạng chuẩn xác",
        "Mô phỏng phỏng vấn & Rubric đánh giá tự động",
        "Gợi ý Top ứng viên theo thuật toán AI Match",
        "Quản lý Pipeline Kanban kéo thả thông minh",
        "Xuất báo cáo PDF & Excel không giới hạn",
        "Chuyên viên hỗ trợ riêng 24/7",
      ],
      buttonText: "Đăng ký gói Pro",
      buttonStyle:
        "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25",
    },
    {
      id: "enterprise",
      title: "Gói Tập Đoàn (Custom Tailored)",
      badge: "DOANH NGHIỆP LỚN",
      price: "Liên hệ",
      unit: "Giải pháp theo nhu cầu",
      desc: "Thiết kế riêng cho tập đoàn có quy mô tuyển dụng lớn và yêu cầu tích hợp API chuyên sâu.",
      popular: false,
      features: [
        "Toàn bộ tính năng của gói Pro",
        "Tích hợp RESTful API với SAP / Workday / Base",
        "Đào tạo AI Model riêng theo tiêu chuẩn công ty",
        "SLA cam kết hoạt động 99.99%",
        "Hợp đồng pháp lý & Hóa đơn VAT đầy đủ",
      ],
      buttonText: "Liên hệ tư vấn",
      buttonStyle: "bg-slate-900 hover:bg-black text-white",
    },
  ];

  return (
    <div id="pricing-section" className="py-20 bg-slate-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs font-bold text-blue-700 mb-3">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>BẢNG GIÁ DỊCH VỤ MINH BẠCH</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Chọn Gói Tuyển Dụng Phù Hợp Cho Bạn
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            Linh hoạt nâng cấp hoặc hủy bất cứ lúc nào. Không phí ẩn.
          </p>

          {/* Billing Switch */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                !isAnnual ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Thanh toán Hàng tháng
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                isAnnual ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Thanh toán Theo năm</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black">
                Tiết kiệm 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ y: -8 }}
              className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? "bg-white border-2 border-blue-500 shadow-2xl shadow-blue-500/15"
                  : "bg-white border border-slate-200 shadow-md shadow-slate-900/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black tracking-wider uppercase shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>{plan.badge}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-900">{plan.title}</h3>
                </div>

                <div className="my-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {plan.price}
                    </span>
                    {plan.price !== "0" && plan.price !== "Liên hệ" && (
                      <span className="text-xs font-bold text-slate-500">VNĐ</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{plan.unit}</p>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 mb-6 font-medium leading-relaxed">
                  {plan.desc}
                </p>

                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <span className="text-xs font-black text-slate-900 block mb-2">Tính năng bao gồm:</span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 font-semibold">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenRegister(plan.title)}
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-2 ${plan.buttonStyle}`}
                >
                  <span>{plan.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
