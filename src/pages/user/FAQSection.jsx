import React, { useState } from "react";
import { Box, Container, Collapse } from "@mui/material";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "Hệ thống AI phân tích CV của CareerGo hoạt động như thế nào?",
      a: "CareerGo tích hợp mô hình ngôn ngữ lớn (LLM) và thuật toán ATS Matching để phân tích cấu trúc, nhận diện kỹ năng công nghệ, kinh nghiệm thực chiến và đo lường mật độ từ khóa. Hệ thống sau đó đối chiếu với cơ sở dữ liệu hàng nghìn JD tuyển dụng thực tế để chấm điểm tương thích và đưa ra gợi ý chỉnh sửa cụ thể.",
    },
    {
      q: "CV tạo hoặc tối ưu bởi CareerGo có vượt qua được các phần mềm ATS quốc tế không?",
      a: "Hoàn toàn có! Tất cả các mẫu CV trên CareerGo đều tuân thủ các nguyên tắc vàng của hệ thống ATS (Applicant Tracking System): cấu trúc phân tầng rõ ràng, phông chữ tiêu chuẩn, không dùng bảng biểu phức tạp che khuất từ khóa, và hỗ trợ xuất file PDF chuẩn hóa định dạng dữ liệu máy đọc được.",
    },
    {
      q: "Dữ liệu hồ sơ cá nhân và CV của tôi có được bảo mật an toàn không?",
      a: "CareerGo cam kết bảo mật 100% dữ liệu cá nhân theo tiêu chuẩn bảo vệ dữ liệu hiện đại. Hồ sơ và CV của bạn chỉ được chia sẻ tới các nhà tuyển dụng khi bạn chủ động ứng tuyển. Dữ liệu huấn luyện AI được mã hóa và ẩn danh hóa hoàn toàn.",
    },
    {
      q: "Làm thế nào để nhận được gợi ý việc làm có độ tương thích trên 95%?",
      a: "Để đạt điểm match tối đa, bạn hãy tải lên CV chi tiết nhất có thể hoặc sử dụng tính năng 'Tạo CV với AI'. Điền đầy đủ kỹ năng công nghệ (Tech Stack), năm kinh nghiệm thực chiến và các dự án tiêu biểu. AI sẽ tự động phân tích và ưu tiên đề xuất các cơ hội sát với năng lực của bạn nhất.",
    },
    {
      q: "Nền tảng CareerGo có hoàn toàn miễn phí cho người tìm việc không?",
      a: "Có, toàn bộ các tính năng cốt lõi dành cho ứng viên: Tìm kiếm việc làm, Tạo CV chuẩn ATS, Phân tích CV bằng AI và Theo dõi lịch phỏng vấn đều được cung cấp miễn phí 100% trọn đời.",
    },
    {
      q: "CareerGo có hỗ trợ chuẩn bị phỏng vấn kỹ thuật và đàm phán lương không?",
      a: "Có! Bạn có thể sử dụng góc 'Cẩm nang nghề nghiệp' và tính năng AI Mock Interview để luyện tập các câu hỏi phỏng vấn hóc búa, tham khảo mức lương trung vị trên thị trường để tự tin đàm phán đãi ngộ tốt nhất với nhà tuyển dụng.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <Box sx={{ py: 9, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
              Giải Đáp Thắc Mắc Thường Gặp
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Bạn Có Câu Hỏi?{" "}
            <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CareerGo Sẵn Sàng Trả Lời
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2 leading-relaxed">
            Mọi điều bạn cần biết về cơ chế hoạt động của AI, cách tối ưu hồ sơ và quyền lợi của người tìm việc trên nền tảng.
          </p>
        </div>

        {/* ===== ACCORDION LIST (CHUẨN MINIMALIST & MƯỢT MÀ) ===== */}
        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className={`rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? "bg-sky-50/60 shadow-xs"
                    : "bg-slate-50/70 hover:bg-slate-100/70"
                }`}
                onClick={() => toggleFaq(idx)}
              >
                {/* Accordion Header */}
                <div className="p-4 sm:p-5 flex items-center justify-between gap-4 select-none">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-white text-blue-600 font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {idx + 1}
                    </span>
                    <h3 className={`text-xs sm:text-[14px] font-black tracking-tight leading-snug transition-colors ${
                      isOpen ? "text-blue-700" : "text-slate-800"
                    }`}>
                      {faq.q}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    isOpen ? "bg-blue-600 text-white rotate-180" : "bg-white text-slate-400"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Accordion Collapsible Body */}
                <Collapse in={isOpen} timeout="auto">
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-slate-600 font-medium leading-relaxed pl-13">
                    {faq.a}
                  </div>
                </Collapse>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Box>
  );
}
