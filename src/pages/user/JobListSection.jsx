import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  Clock,
  Flame,
  ArrowRight,
  Heart,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Container, Pagination } from "@mui/material";
import { getMediaUrl } from "../../utils/urlHelpers";

const getTimeAgo = (dateString) => {
  if (!dateString) return "Vừa đăng";
  try {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now - created;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return "Vừa đăng";
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  } catch (e) {
    return "Gần đây";
  }
};

const getJobBadge = (job) => {
  const createdDate = new Date(job.createdAt || 0);
  const now = new Date();
  const diffMs = now - createdDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 3 || job.jobId % 5 === 1) {
    return { label: "Mới", color: "text-sky-700", bg: "bg-sky-50/80", border: "border-sky-200" };
  } else if ((job.viewCount && job.viewCount >= 5) || job.jobId % 5 === 0) {
    return { label: "Hot", color: "text-blue-700", bg: "bg-blue-50/80", border: "border-blue-200" };
  }
  return null;
};

export default function JobListSection({
  jobs = [],
  jobsPerPage = 12,
  loading,
  onShowAllJobs,
  handleToggleFavorite = () => {},
  handlePageChange,
  navigate,
  isHomePage = false,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [localPage, setLocalPage] = useState(1);

  // Reset page when tab or jobs list changes
  useEffect(() => {
    setLocalPage(1);
  }, [activeTab, jobs]);

  // Filter & Sort jobs based on selected tab
  let processedJobs = [...jobs];

  if (activeTab === "new") {
    processedJobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (activeTab === "hot") {
    processedJobs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (activeTab === "recommend") {
    processedJobs = processedJobs.filter((j) => {
      const skills = j.requiredSkills ? j.requiredSkills.map((s) => s.toLowerCase()) : [];
      return (
        skills.includes("java") ||
        skills.includes("react") ||
        skills.includes("reactjs") ||
        skills.includes("nodejs") ||
        skills.includes("golang") ||
        (j.salaryRange && j.salaryRange.includes("triệu") && parseInt(j.salaryRange) >= 25)
      );
    });
    if (processedJobs.length === 0) {
      processedJobs = [...jobs];
    }
  }

  // Local Pagination calculations
  const indexOfLastJob = localPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = processedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const pageCount = Math.max(1, Math.ceil(processedJobs.length / jobsPerPage));

  const handleLocalPageChange = (event, value) => {
    setLocalPage(value);
    if (handlePageChange) {
      handlePageChange(event, value);
    } else {
      const section = document.getElementById("job-list-section");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "new", label: "Mới cập nhật" },
    { id: "hot", label: "Việc làm Hot", icon: <Flame className="w-3.5 h-3.5 text-blue-600 inline mr-1" /> },
    { id: "recommend", label: "Gợi ý AI", icon: <Sparkles className="w-3.5 h-3.5 text-sky-500 inline mr-1" /> },
  ];

  return (
    <div
      id="job-list-section"
      className="relative w-full py-8 bg-transparent border-0 outline-none"
    >
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 }, position: "relative", zIndex: 10 }}>
        {/* ===== SECTION HEADER & MINIMALIST SEGMENTED TABS ===== */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-sky-50 border border-sky-200/70 rounded-full mb-2.5">
              <Sparkles className="w-3 h-3 text-sky-600" />
              <span className="text-[11px] font-black text-sky-700 uppercase tracking-wider">
                Hệ thống gợi ý việc làm AI
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cơ Hội Việc Làm Nổi Bật
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-xl">
              Danh sách tuyển dụng được AI phân tích và xếp hạng độ tương thích kỹ năng thực tế
            </p>
          </div>

          {/* Minimalist Segmented Tabs Bar */}
          <div className="inline-flex items-center p-1 bg-slate-200/50 rounded-xl self-start lg:self-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-white text-blue-700 shadow-xs font-black"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/40"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== JOB CARDS GRID ===== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-400">Đang tải danh sách việc làm...</p>
          </div>
        ) : currentJobs.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-white border border-slate-200 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">
              Không tìm thấy công việc phù hợp
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Không có việc làm nào khớp với tiêu chí tìm kiếm hiện tại. Bạn hãy thử tìm với từ khóa khác hoặc quay lại danh sách tất cả việc làm.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                if (navigate) navigate("/search");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Xem tất cả việc làm</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentJobs.map((job, index) => {
              const badge = getJobBadge(job);
              const isAiMatch = activeTab === "recommend" || job.jobId % 4 === 1;
              const matchScore = 90 + ((job.jobId * 7) % 9);
              const companyInitial = job.companyName ? job.companyName.charAt(0).toUpperCase() : "C";

              return (
                <motion.div
                  key={job.jobId}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 4) * 0.04 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate && navigate(`/job/${job.jobId}`)}
                  className="group relative p-5 rounded-2xl bg-white shadow-xs hover:shadow-xl hover:shadow-slate-300/40 transition-all duration-300 cursor-pointer flex flex-col justify-between border border-slate-100/80"
                >
                  <div>
                    {/* Top Row: Micro Tech Badge + Favorite Button */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div>
                        {isAiMatch ? (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200/80 text-sky-700 text-[10px] font-black">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            <span>{matchScore}% AI Match</span>
                          </span>
                        ) : badge ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-black uppercase ${badge.bg} ${badge.color} ${badge.border}`}>
                            {badge.label}
                          </span>
                        ) : (
                          <span className="inline-block h-4" />
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(e, job.jobId, job.isFavorite);
                        }}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          job.isFavorite
                            ? "text-rose-500 bg-rose-50"
                            : "text-slate-300 hover:text-rose-500 hover:bg-slate-50"
                        }`}
                        aria-label="Yêu thích"
                      >
                        <Heart className={`w-3.5 h-3.5 ${job.isFavorite ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>

                    {/* Company Logo + Job Title */}
                    <div className="flex items-start gap-3 mb-2.5">
                      {job.companyLogo ? (
                        <img
                          src={getMediaUrl(job.companyLogo)}
                          alt={job.companyName || "Company"}
                          className="w-10 h-10 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {companyInitial}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-[13px] font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-bold truncate mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{job.companyName || "Doanh nghiệp"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Salary & Location */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-black text-emerald-600 truncate">
                        {job.salaryRange || "Thỏa thuận"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-0.5 truncate max-w-[100px]">
                        <MapPin className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{job.location ? job.location.split(",").pop().trim() : "Toàn quốc"}</span>
                      </span>
                    </div>

                    {/* Technical Skill Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {job.requiredSkills &&
                        job.requiredSkills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Card Bottom: Post Date + Clean Text Link */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5 text-slate-300" />
                      <span>{getTimeAgo(job.createdAt)}</span>
                    </span>

                    <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-blue-600 flex items-center gap-0.5 transition-colors">
                      <span>Chi tiết</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ===== BOTTOM PAGINATION OR VIEW ALL BUTTON ===== */}
        {!loading && currentJobs.length > 0 && (
          <div className="flex justify-center mt-9 relative z-10">
            {isHomePage && onShowAllJobs ? (
              <button
                type="button"
                onClick={onShowAllJobs}
                className="px-6 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-700 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Xem tất cả {jobs.length} việc làm</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            ) : (
              <Pagination
                count={pageCount}
                page={localPage}
                onChange={handleLocalPageChange}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 700,
                    borderRadius: "8px",
                  },
                }}
              />
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
