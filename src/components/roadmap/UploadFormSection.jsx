import React, { useRef, useState } from "react";
import {
  UploadCloud,
  FileCheck,
  Briefcase,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  FileText,
} from "lucide-react";

const suggestionTags = [
  "Java Backend",
  "Frontend React",
  "Data Analyst",
  "Tester / QA",
  "DevOps Engineer",
];

const roadmapDurations = [
  "3 tháng (Cấp tốc)",
  "6 tháng (Tiêu chuẩn)",
  "1 năm (Dài hạn)",
];

const UploadFormSection = ({
  cvFile,
  targetRole,
  desiredRoadmap,
  error,
  isAnalyzing,
  onFileUpload,
  onTargetRoleChange,
  onDesiredRoadmapChange,
  onAnalyze,
  onReset,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTagClick = (tag) => {
    onTargetRoleChange(tag);
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
    if (droppedFile) {
      onFileUpload({ target: { files: [droppedFile] } });
    }
  };

  const isCtaDisabled = isAnalyzing || !cvFile || !targetRole?.trim();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/95 rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-5 sm:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300">
      {/* KHUNG NHẬP LIỆU: BỐ CỤC 2 CỘT CÓ MŨI TÊN LIÊN KẾT Ở GIỮA */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-stretch gap-4 md:gap-5">
        {/* ================= CỘT 1: ĐIỂM XUẤT PHÁT (NĂNG LỰC HIỆN TẠI) ================= */}
        <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          {/* Header Cột 1 */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-extrabold text-xs">
                1
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Năng Lực Hiện Tại
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium pl-8">
              Điểm xuất phát từ hồ sơ của bạn
            </p>
          </div>

          {/* Khung upload CV (Dropzone) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-h-[190px] rounded-2xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
              isDragging
                ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                : cvFile
                ? "border-emerald-300 bg-emerald-50/20"
                : "border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept=".pdf,application/pdf"
              onChange={onFileUpload}
            />

            {!cvFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-100 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs mb-2">
                  <UploadCloud className="w-6 h-6 text-blue-600" />
                </div>

                <p className="font-bold text-slate-800 text-xs sm:text-sm">
                  Tải lên CV (PDF)
                </p>

                <p className="text-[11px] text-slate-500 font-medium max-w-[220px] mt-1 mb-2">
                  AI sẽ đọc kỹ năng và kinh nghiệm bạn đang có
                </p>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-bold">
                  <FileText className="w-3 h-3 text-blue-600" />
                  Định dạng PDF (tối đa 5MB)
                </span>
              </div>
            ) : (
              /* Trạng thái đã chọn file */
              <div className="w-full flex flex-col justify-between h-full text-left p-1">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[11px] font-extrabold text-emerald-700 mb-0.5">
                      ✓ Đã tải lên thành công
                    </span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {cvFile.name}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                      {(cvFile.size / 1024 / 1024).toFixed(2)} MB • File PDF
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-700">
                    Sẵn sàng phân tích
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline"
                  >
                    Đổi file khác
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= MŨI TÊN LIÊN KẾT Ở GIỮA ================= */}
        <div className="flex items-center justify-center py-1 md:py-0">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shadow-xs">
            <ArrowRight className="w-4 h-4 hidden md:block" />
            <ArrowDown className="w-4 h-4 md:hidden" />
          </div>
        </div>

        {/* ================= CỘT 2: ĐÍCH ĐẾN (MỤC TIÊU MONG MUỐN) ================= */}
        <div className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          {/* Header Cột 2 */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-extrabold text-xs">
                2
              </span>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                Mục Tiêu Mong Muốn
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium pl-8">
              Vị trí & thời gian bạn hướng tới
            </p>
          </div>

          {/* Form Fields Cột 2 */}
          <div className="flex-1 flex flex-col justify-between gap-3">
            {/* Vị trí mục tiêu */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Vị trí nghề nghiệp mục tiêu (*)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="VD: Fullstack Developer, Data Engineer..."
                  value={targetRole}
                  onChange={(e) => onTargetRoleChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>

              {/* Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-slate-400">Gợi ý:</span>
                {suggestionTags.map((tag) => {
                  const isSelected = targetRole === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thời gian dự kiến */}
            <div className="mt-1">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Thời gian học tập dự kiến (*)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={desiredRoadmap || "6 tháng (Tiêu chuẩn)"}
                  onChange={(e) => onDesiredRoadmapChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-slate-900 bg-white cursor-pointer"
                >
                  {roadmapDurations.map((dur) => (
                    <option key={dur} value={dur} className="font-medium text-slate-800">
                      {dur}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ================= 3. NÚT HÀNH ĐỘNG CHÍNH (CTA) ================= */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={onAnalyze}
          disabled={isCtaDisabled}
          className={`w-full sm:w-auto sm:min-w-[320px] py-3.5 px-8 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all duration-300 shadow-md ${
            isCtaDisabled
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:from-blue-700 hover:via-indigo-700 hover:to-sky-700 text-white shadow-blue-500/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:scale-[0.99]"
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>AI đang phân tích & lập lộ trình...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-white" />
              <span>Tạo lộ trình học tập cùng AI</span>
            </>
          )}
        </button>

        {/* Security & Confidentiality */}
        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Dữ liệu được bảo mật tối đa và chỉ sử dụng để xây dựng lộ trình học tập cá nhân.</span>
        </div>
      </div>
    </div>
  );
};

export default UploadFormSection;
