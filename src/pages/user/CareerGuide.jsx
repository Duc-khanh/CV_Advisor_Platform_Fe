import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  TrendingUp,
  FileText,
  MessagesSquare,
  Briefcase,
  Cpu,
  Compass,
  Clock,
  Eye,
  Heart,
  Bookmark,
  ArrowRight,
  CheckCircle2,
  Tag,
  Mail,
  Download,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Filter,
  Layers,
  Flame,
  Bot,
  Check,
  Zap,
  FolderDown,
  ShieldCheck,
  Award,
  Play,
  RotateCcw,
  Headphones,
  Sliders,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Lightbulb
} from "lucide-react";
import { articleService } from "../../services/company/articleService";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";
import "./CareerGuide.css";

const CATEGORIES = [
  { label: "Tất cả", icon: Sparkles, queryKey: "" },
  { label: "Viết CV", icon: FileText, queryKey: "Viết CV" },
  { label: "Phỏng vấn", icon: MessagesSquare, queryKey: "Phỏng vấn" },
  { label: "Tìm việc", icon: Briefcase, queryKey: "Tìm việc" },
  { label: "Thương lượng lương", icon: TrendingUp, queryKey: "Thương lượng lương" },
  { label: "Kỹ năng", icon: Cpu, queryKey: "Kỹ năng" },
  { label: "Định hướng", icon: Compass, queryKey: "Định hướng" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất", icon: Clock },
  { value: "views", label: "Xem nhiều nhất", icon: Eye },
  { value: "likes", label: "Được yêu thích nhất", icon: Heart },
];

const QUICK_TAGS = [
  "CV chuẩn ATS",
  "Phỏng vấn STAR",
  "Đàm phán lương +30%",
  "Kinh doanh & Marketing",
  "Tài chính & Quản trị",
  "Kỹ năng mềm 2026",
];

const INDUSTRY_DOMAINS = [
  {
    id: "tech",
    label: "Công Nghệ & IT",
    icon: Cpu,
    salaryRange: "18M - 65M VNĐ",
    hotSkills: ["System Design", "Cloud / DevOps", "AI Prompting", "Clean Architecture"],
    color: "from-blue-600 to-indigo-600",
    filterKey: "Kỹ năng",
    badge: "Xu hướng bùng nổ",
  },
  {
    id: "business",
    label: "Kinh Doanh & Bán Hàng",
    icon: Target,
    salaryRange: "15M - 50M VNĐ + Thưởng",
    hotSkills: ["B2B Solution Selling", "Đàm phán thương vụ", "CRM Mastery", "Account Management"],
    color: "from-amber-500 to-orange-600",
    filterKey: "Tìm việc",
    badge: "Nhu cầu tuyển lớn",
  },
  {
    id: "marketing",
    label: "Marketing & Truyền Thông",
    icon: Sparkles,
    salaryRange: "14M - 45M VNĐ",
    hotSkills: ["Performance Media", "Brand Strategy", "Data Analytics", "Content & Growth"],
    color: "from-purple-500 to-pink-600",
    filterKey: "Viết CV",
    badge: "Đòi hỏi sáng tạo",
  },
  {
    id: "finance",
    label: "Tài Chính & Kế Toán",
    icon: DollarSign,
    salaryRange: "16M - 55M VNĐ",
    hotSkills: ["Financial Modeling", "Kiểm toán / IFRS", "Risk Management", "ERP (SAP/Oracle)"],
    color: "from-emerald-500 to-teal-600",
    filterKey: "Thương lượng lương",
    badge: "Ổn định & Bền vững",
  },
  {
    id: "management",
    label: "Quản Trị & Nhân Sự",
    icon: Users,
    salaryRange: "15M - 48M VNĐ",
    hotSkills: ["Talent Acquisition", "Total Rewards", "HR Tech", "Văn hóa doanh nghiệp"],
    color: "from-sky-500 to-cyan-600",
    filterKey: "Phỏng vấn",
    badge: "Cầu nối chiến lược",
  },
];

const READINESS_QUESTIONS = [
  {
    id: "q1",
    label: "CV đã định lượng kết quả và có từ khóa khớp bản mô tả công việc (JD)?",
    hint: "Tránh viết chung chung, hãy dùng số liệu (doanh thu tăng %, thời gian giảm %).",
  },
  {
    id: "q2",
    label: "Đã chuẩn bị 3 câu chuyện thực tế theo cấu trúc phỏng vấn STAR?",
    hint: "Situation (Tình huống) → Task (Nhiệm vụ) → Action (Hành động) → Result (Kết quả).",
  },
  {
    id: "q3",
    label: "Đã khảo sát thang lương thị trường trước khi bước vào vòng đàm phán?",
    hint: "Xác định rõ mức sàn mong muốn và cấu trúc Total Compensation (Lương cứng + Thưởng + Quyền lợi).",
  },
  {
    id: "q4",
    label: "Đã chuẩn bị ít nhất 3 câu hỏi sâu ngược lại cho nhà tuyển dụng?",
    hint: "Hỏi về mục tiêu 6 tháng của team, thách thức lớn nhất và lộ trình thăng tiến nội bộ.",
  },
];

const CURATED_SERIES = [
  {
    id: "series-interview",
    badge: "5 Chuyên đề • Đa ngành nghề",
    title: "Nghệ Thuật Chinh Phục Vòng Phỏng Vấn & Đánh Giá Năng Lực",
    desc: "Phương pháp xử lý tình huống thực tế, giải quyết case study và làm chủ bộ câu hỏi STAR thuyết phục mọi nhà tuyển dụng.",
    category: "Phỏng vấn",
    accent: "bg-blue-100 text-blue-700",
  },
  {
    id: "series-cv",
    badge: "4 Chuyên đề • Chuẩn ATS Quốc Tế",
    title: "Chiến Lược Viết CV Chuẩn ATS Cho Mọi Ngành Nghề",
    desc: "Kỹ thuật tối ưu từ khóa khớp với bản mô tả công việc (JD), định lượng thành tựu và thiết kế cấu trúc chuyên nghiệp.",
    category: "Viết CV",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "series-salary",
    badge: "3 Chuyên đề • Thực chiến",
    title: "Nghệ Thuật Đàm Phán Lương & Tổng Thu Nhập (Total Rewards)",
    desc: "Nắm bắt thang lương thị trường, đàm phán thưởng, phụ cấp, lộ trình xét lương và xử lý offer khéo léo.",
    category: "Thương lượng lương",
    accent: "bg-amber-100 text-amber-700",
  },
];

const FREE_TOOLKITS = [
  {
    title: "Cheat Sheet: 50 Câu Hỏi Phỏng Vấn STAR Chuẩn Mọi Vị Trí",
    format: "PDF (12 Trang)",
    downloads: "16.8k lượt tải",
  },
  {
    title: "Checklist: 100+ Động Từ Hành Động (Action Verbs) Chuẩn ATS",
    format: "PDF & Sheet",
    downloads: "12.4k lượt tải",
  },
  {
    title: "Kịch Bản Email Đàm Phán Offer Song Ngữ Anh - Việt",
    format: "DOCX / PDF",
    downloads: "14.1k lượt tải",
  },
];

export default function CareerGuide() {
  const navigate = useNavigate();
  const showToast = useToast();

  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSidebar, setLoadingSidebar] = useState(true);

  const [category, setCategory] = useState("Tất cả");
  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Custom Dropdown State
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  // Interactive Industry Domain Tab
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRY_DOMAINS[0]);

  // Interactive Career Readiness Assessment state
  const [checkedQuestions, setCheckedQuestions] = useState({});

  const size = 6;
  const token = localStorage.getItem("token");

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch articles on filter change
  useEffect(() => {
    fetchArticles();
  }, [category, query, sortBy, page]);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const activeCat = category === "Tất cả" ? "" : category;
      const data = await articleService.getArticlesPublic({
        category: activeCat,
        query,
        page: page - 1,
        size,
        sortBy,
      });
      setArticles(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch {
      showToast("Không thể tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarData = async () => {
    setLoadingSidebar(true);
    try {
      const [trending, tags] = await Promise.all([
        articleService.getTrendingArticles(),
        articleService.getPopularTags(),
      ]);
      setTrendingArticles(trending || []);
      const normalizedTags = (Array.isArray(tags) ? tags : [])
        .map((tag) => {
          if (Array.isArray(tag)) return { name: tag[0], count: tag[1] };
          if (tag && typeof tag === "object") {
            return {
              name: tag.name ?? tag.category ?? tag.label,
              count: tag.count ?? tag.total ?? 0,
            };
          }
          if (typeof tag === "string") return { name: tag, count: 0 };
          return null;
        })
        .filter((tag) => tag?.name);
      setPopularTags(normalizedTags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSidebar(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchVal.trim());
    setPage(1);
  };

  const handleQuickTagClick = (tag) => {
    setSearchVal(tag);
    setQuery(tag);
    setPage(1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setIsSortOpen(false);
    setPage(1);
  };

  const handleToggleBookmark = async (e, articleId) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vui lòng đăng nhập để lưu bài viết vào cẩm nang", "warning");
      navigate("/login");
      return;
    }
    try {
      const v = await articleService.toggleBookmark(articleId);
      showToast(v ? "Đã lưu vào cẩm nang của bạn!" : "Đã gỡ bài viết khỏi cẩm nang!", "success");
      setArticles((prev) =>
        prev.map((a) => (a.articleId === articleId ? { ...a, isBookmarked: v } : a))
      );
    } catch {
      showToast("Không thể thực hiện tác vụ lúc này", "error");
    }
  };

  const handleToggleLike = async (e, articleId) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vui lòng đăng nhập để thích bài viết", "warning");
      navigate("/login");
      return;
    }
    try {
      const v = await articleService.toggleLike(articleId);
      showToast(v ? "Đã thêm vào mục yêu thích!" : "Đã bỏ thích!", "success");
      setArticles((prev) =>
        prev.map((a) =>
          a.articleId === articleId
            ? {
                ...a,
                isLiked: v,
                likesCount: v ? (a.likesCount || 0) + 1 : Math.max(0, (a.likesCount || 0) - 1),
              }
            : a
        )
      );
    } catch {
      showToast("Không thể thực hiện tác vụ lúc này", "error");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      showToast("Vui lòng nhập địa chỉ email hợp lệ", "warning");
      return;
    }
    setIsSubscribed(true);
    showToast("Đăng ký nhận bản tin CareerGo thành công!", "success");
    setNewsletterEmail("");
  };

  const handleDownloadToolkit = (toolkit) => {
    showToast(`Đang chuẩn bị tài liệu: ${toolkit.title}...`, "info");
    setTimeout(() => {
      showToast(`Tải xuống thành công: ${toolkit.title}`, "success");
    }, 1200);
  };

  const toggleCheckQuestion = (id) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const checkedCount = Object.values(checkedQuestions).filter(Boolean).length;
  const readinessScore = Math.round((checkedCount / READINESS_QUESTIONS.length) * 100);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentSortOption = SORT_OPTIONS.find((s) => s.value === sortBy) || SORT_OPTIONS[0];
  const CurrentSortIcon = currentSortOption.icon;

  const featuredArticle =
    page === 1 && !query ? articles.find((a) => a.isPinned) || articles[0] : null;
  const regularArticles = featuredArticle
    ? articles.filter((a) => a.articleId !== featuredArticle.articleId)
    : articles;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 relative selection:bg-blue-100 selection:text-blue-900 pb-20">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-indigo-50/20 to-transparent pointer-events-none -z-0 blur-3xl" />
      <div className="absolute top-24 left-1/6 w-80 h-80 bg-sky-200/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-36 right-1/6 w-96 h-96 bg-indigo-200/25 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* ================= 1. DYNAMIC HIGH-TECH HERO WITH FLOATING SATELLITES ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 shadow-xs text-xs font-bold text-blue-700 mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span className="tracking-wide">CAREERGO AI KNOWLEDGE ENGINE 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight"
            >
              Cẩm Nang Nghề Nghiệp &{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                Trí Tuệ Định Hướng
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-3.5 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl"
            >
              Kho kiến thức thực chiến đa ngành từ các chuyên gia nhân sự và hệ thống AI — Tối ưu CV chuẩn ATS,
              làm chủ phỏng vấn, thương lượng lương và kiến tạo lộ trình thăng tiến sự nghiệp vững vàng.
            </motion.p>

            {/* Smart Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-400 focus-within:border-blue-600 shadow-lg shadow-blue-900/5 transition-all duration-200 p-1.5 max-w-xl"
              >
                <div className="pl-3.5 pr-2 text-slate-400">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Bạn đang muốn tìm hiểu điều gì? (VD: Viết CV Marketing, Phỏng vấn STAR, Deal lương...)"
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium py-2.5"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchVal("");
                      setQuery("");
                    }}
                    className="px-2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all duration-200 cursor-pointer flex-shrink-0"
                >
                  <span>Tìm kiếm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Keyword Chips */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 text-xs">
                <span className="text-slate-400 font-semibold inline-flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" /> Xu hướng:
                </span>
                {QUICK_TAGS.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickTagClick(t)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 shadow-2xs transition-all font-medium cursor-pointer"
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Interactive Animated Tech Satellite Mockup */}
          <div className="lg:col-span-5 relative py-6">
            <div className="relative w-full max-w-md mx-auto">
              {/* Glowing Aura behind mockup */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-sky-400/20 rounded-full blur-2xl -z-10 animate-pulse" />

              {/* Satellite 1: Top-Right Floating Match Rate Card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 z-20 flex items-center gap-2.5 px-3.5 py-2 bg-white/95 backdrop-blur-xl rounded-2xl border border-blue-200/90 shadow-xl shadow-blue-500/10 cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-extrabold text-slate-800 leading-tight">AI Matching</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">&lt; 0.25s</span>
                  </div>
                  {/* Mini Soundwave Animation */}
                  <div className="flex items-end gap-0.5 h-2.5 mt-1">
                    {[40, 85, 100, 60, 90, 50, 75].map((h, i) => (
                      <motion.span
                        key={i}
                        animate={{ height: [`${h * 0.3}%`, `${h}%`, `${h * 0.3}%`] }}
                        transition={{ duration: 1 + (i % 3) * 0.2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-1 bg-blue-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Satellite 2: Bottom-Left Verified Realtime Insight */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                className="absolute -bottom-5 -left-3 z-20 flex items-center gap-2.5 px-3.5 py-2.5 bg-white/95 backdrop-blur-xl rounded-2xl border border-emerald-200 shadow-xl shadow-emerald-500/10 cursor-default"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-800 leading-tight">Chuẩn ATS Quốc Tế</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[10px] text-slate-500 font-semibold">Khớp 98% tiêu chí HR</span>
                  </div>
                </div>
              </motion.div>

              {/* Main Holographic Center Card */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs font-black text-slate-800">Cố Vấn Định Hướng AI</span>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                    Live Feed
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      01
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Phương pháp STAR trong phỏng vấn</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Cấu trúc trả lời giúp tăng 40% khả năng thuyết phục HR.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      02
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Chiến lược thương lượng lương</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Kỹ thuật đàm phán Total Comp tăng 25-35% thu nhập.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                      03
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Bộ lọc từ khóa ATS 2026</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Định lượng thành tựu và khớp từ khóa JD chuẩn xác.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold">500+ Hướng dẫn thực chiến</span>
                  <span className="text-blue-600 font-bold flex items-center gap-1">
                    Cập nhật mới <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Tech Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-5xl mx-auto mb-14">
          <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-2xl font-black text-slate-900">500+</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Bài viết tuyển chọn</div>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-2xl font-black text-blue-600">120K+</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Lượt đọc & ứng dụng</div>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-2xl font-black text-emerald-600">98.6%</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Đánh giá hữu ích thực tế</div>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
            <div className="text-2xl font-black text-indigo-600">AI Daily</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Dữ liệu tuyển dụng đa ngành</div>
          </motion.div>
        </div>

        {/* ================= 2. INTERACTIVE CAREER READINESS QUIZ (TÍNH NĂNG MỚI SIÊU SINH ĐỘNG) ================= */}
        <div className="mb-14 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 text-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-blue-200/90 shadow-xl shadow-blue-900/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Interactive Checklist */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-black mb-3">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>INTERACTIVE CAREER ASSESSMENT</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                Kiểm Tra Mức Độ Sẵn Sàng Ứng Tuyển & Phỏng Vấn (60 Giây)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Tích chọn những tiêu chí bạn đã hoàn thành để hệ thống AI đánh giá mức độ sẵn sàng hồ sơ:
              </p>

              <div className="space-y-2.5 mt-5">
                {READINESS_QUESTIONS.map((q) => {
                  const isChecked = !!checkedQuestions[q.id];
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleCheckQuestion(q.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? "bg-blue-50 border-blue-400 shadow-xs"
                          : "bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                          isChecked ? "bg-blue-500 text-white" : "border-2 border-slate-500"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{q.label}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{q.hint}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Dynamic Live Score Meter & Instant Advice */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-blue-200/80 shadow-md text-center">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                Chỉ Số Sẵn Sàng Của Bạn
              </span>
              <div className="my-4 flex items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-blue-50 border-4 border-blue-500 shadow-inner">
                  <div className="text-center">
                    <span className="text-4xl font-black text-blue-600">{readinessScore}%</span>
                    <span className="block text-[10px] text-blue-700 font-black uppercase mt-0.5">
                      {readinessScore === 100
                        ? "Tuyệt vời!"
                        : readinessScore >= 50
                        ? "Khá tốt"
                        : "Cần cải thiện"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs mx-auto">
                {readinessScore === 100
                  ? "Hồ sơ của bạn đã sẵn sàng ứng tuyển vào các vị trí hàng đầu!"
                  : `Bạn đã hoàn thành ${checkedCount}/${READINESS_QUESTIONS.length} tiêu chuẩn then chốt. Hãy bổ sung các mục còn lại để tự tin nhận offer cao.`}
              </p>

              <div className="mt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate("/cv-analysis")}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Phân tích CV bằng AI ngay</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/mock-interview")}
                  className="w-full py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MessagesSquare className="w-4 h-4 text-emerald-400" />
                  <span>Luyện phỏng vấn thử cùng AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. INTERACTIVE INDUSTRY DOMAIN EXPLORER (KHÁM PHÁ ĐA NGÀNH NGHỀ) ================= */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Khám Phá Thị Trường Theo Ngành Nghề</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Thang Lương & Kỹ Năng Nổi Bật Theo Từng Lĩnh Vực
              </h3>
            </div>
          </div>

          {/* Industry Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
            {INDUSTRY_DOMAINS.map((domain) => {
              const Icon = domain.icon;
              const isSelected = selectedIndustry.id === domain.id;
              return (
                <button
                  key={domain.id}
                  type="button"
                  onClick={() => setSelectedIndustry(domain)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex-shrink-0 ${
                    isSelected
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-500"}`} />
                  <span>{domain.label}</span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Industry Insight Showcase Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndustry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-lg shadow-blue-900/5 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold mb-1.5">
                    {selectedIndustry.badge}
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900">
                    Lộ Trình & Tiêu Chuẩn Tuyển Dụng: {selectedIndustry.label}
                  </h4>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Mức lương kỳ vọng: {selectedIndustry.salaryRange}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange(selectedIndustry.filterKey)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Xem cẩm nang</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Bộ kỹ năng và tiêu chuẩn được các nhà tuyển dụng tìm kiếm nhiều nhất:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustry.hotSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= 4. FEATURED SPOTLIGHT & TRENDING RADAR ================= */}
        {featuredArticle && !query && page === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
            {/* Featured Big Spotlight Card (8 cols) */}
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/career-guide/${featuredArticle.articleId}`)}
              className="lg:col-span-8 group relative bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col md:flex-row"
            >
              {/* Image container */}
              <div className="md:w-7/12 relative overflow-hidden bg-slate-100 min-h-[220px] md:min-h-[320px]">
                <img
                  src={
                    featuredArticle.imageUrl ||
                    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop"
                  }
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-black uppercase tracking-wider shadow-md">
                    <Flame className="w-3.5 h-3.5 animate-pulse" /> Tiêu điểm
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold shadow-xs">
                    {featuredArticle.category}
                  </span>
                </div>
              </div>

              {/* Content details */}
              <div className="md:w-5/12 p-5 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-2.5">
                    <span className="inline-flex items-center gap-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {featuredArticle.readTime || "5 phút đọc"}
                    </span>
                    <span>•</span>
                    <span>{formatDate(featuredArticle.createdAt)}</span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {featuredArticle.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                      {featuredArticle.authorAvatar ? (
                        <img
                          src={getMediaUrl(featuredArticle.authorAvatar)}
                          alt="author"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        featuredArticle.authorName?.charAt(0) || "C"
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-none">
                        {featuredArticle.authorName || "Ban Biên Tập CareerGo"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Cố vấn chuyên môn</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(e, featuredArticle.articleId)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        featuredArticle.isLiked
                          ? "bg-red-50 text-red-600"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                      }`}
                      title="Thích bài viết"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          featuredArticle.isLiked ? "fill-red-600" : ""
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleToggleBookmark(e, featuredArticle.articleId)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        featuredArticle.isBookmarked
                          ? "bg-blue-50 text-blue-600"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-500"
                      }`}
                      title="Lưu vào cẩm nang"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          featuredArticle.isBookmarked ? "fill-blue-600" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trending Radar (Top 5 Ranking) (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-blue-900/5 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">Bài Viết Xu Hướng</h3>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Top 5
                  </span>
                </div>

                <div className="space-y-3">
                  {trendingArticles.slice(0, 5).map((trend, idx) => {
                    const rankColors = [
                      "bg-amber-100 text-amber-700 border-amber-300 font-black",
                      "bg-slate-200 text-slate-700 border-slate-300 font-bold",
                      "bg-orange-100 text-orange-800 border-orange-300 font-bold",
                      "bg-slate-100 text-slate-500 border-slate-200 font-medium",
                      "bg-slate-100 text-slate-500 border-slate-200 font-medium",
                    ];
                    return (
                      <div
                        key={trend.articleId || idx}
                        onClick={() => navigate(`/career-guide/${trend.articleId}`)}
                        className="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                            rankColors[idx] || rankColors[3]
                          }`}
                        >
                          0{idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {trend.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span>{trend.category}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-0.5">
                              <Eye className="w-3 h-3 text-slate-400" />
                              {trend.viewsCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSortSelect("views")}
                  className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer py-1"
                >
                  Xem tất cả bài đọc nhiều nhất →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. ALL ARTICLES FEED WITH CLEAN INTEGRATED FILTER (HOÀN TOÀN KHÔNG BỊ STICKY ĐÈ LÊN MÀN HÌNH) ================= */}
        <div className="mb-14">
          {/* Integrated Filter Bar: Non-sticky, natural scroll flow */}
          <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-md shadow-slate-900/5 mb-8">
            {/* Row 1: Section Title & Custom Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Khám Phá Theo Chủ Đề
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold border border-blue-200/60">
                  {category}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  ({articles.length} bài viết)
                </span>
              </div>

              {/* Custom Sort Dropdown */}
              <div className="relative" ref={sortDropdownRef}>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Filter className="w-3.5 h-3.5 text-blue-600" /> Sắp xếp theo:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/90 hover:border-blue-400 shadow-2xs transition-all duration-200 cursor-pointer"
                  >
                    <CurrentSortIcon className="w-4 h-4 text-blue-600" />
                    <span>{currentSortOption.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        isSortOpen ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Floating Menu */}
                {isSortOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-xl shadow-blue-900/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                      Tiêu chí sắp xếp
                    </div>
                    {SORT_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = sortBy === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleSortSelect(opt.value)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50 text-blue-700 font-extrabold"
                              : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className={`w-4 h-4 ${isSelected ? "text-blue-600" : "text-slate-400"}`}
                            />
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Full-Width Category Navigation Pills (Zero overlap, generous spacing) */}
            <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-0.5 scrollbar-none w-full">
              {CATEGORIES.map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = category === cat.label;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCategoryChange(cat.label)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-[1.02]"
                        : "bg-slate-100/90 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Articles & Compact Balanced Sidebar */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-sm font-medium text-slate-500">Đang tải kiến thức sự nghiệp...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT: ARTICLES GRID (8 cols) */}
              <div className="lg:col-span-8">
                {articles.length === 0 ? (
                  <div className="p-12 text-center rounded-3xl border-2 border-dashed border-slate-200 bg-white">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">Không tìm thấy bài viết nào</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                      Hãy thử tìm kiếm với từ khóa khác hoặc bấm nút "Tất cả" để xem danh mục đầy đủ.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategory("Tất cả");
                        setSearchVal("");
                        setQuery("");
                      }}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition cursor-pointer"
                    >
                      Đặt lại bộ lọc
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-black text-slate-900">
                        {query ? `Kết quả tìm kiếm cho "${query}"` : "Bài Viết Tuyển Chọn"}
                      </h3>
                      <span className="text-xs font-semibold text-slate-500">
                        Trang {page} / {totalPages}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {regularArticles.map((art, idx) => (
                        <motion.div
                          key={art.articleId || idx}
                          whileHover={{ y: -4 }}
                          onClick={() => navigate(`/career-guide/${art.articleId}`)}
                          className="group bg-white rounded-2xl border border-slate-200/90 shadow-md shadow-slate-900/5 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Media with overlay badge */}
                            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                              <img
                                src={
                                  art.imageUrl ||
                                  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop"
                                }
                                alt={art.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-blue-700 text-xs font-bold shadow-xs">
                                {art.category}
                              </span>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 sm:p-5">
                              <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2 font-medium">
                                <span className="inline-flex items-center gap-1 text-slate-500">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {art.readTime || "4 phút đọc"}
                                </span>
                                <span>•</span>
                                <span>{formatDate(art.createdAt)}</span>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                                {art.title}
                              </h4>

                              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                                {art.description}
                              </p>
                            </div>
                          </div>

                          {/* Card Footer */}
                          <div className="p-4 sm:p-5 pt-0 mt-auto">
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>{art.viewsCount || 0}</span>
                              </div>

                              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleLike(e, art.articleId)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    art.isLiked
                                      ? "text-red-500 bg-red-50"
                                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                  }`}
                                  title="Thích"
                                >
                                  <Heart
                                    className={`w-3.5 h-3.5 ${
                                      art.isLiked ? "fill-red-500" : ""
                                    }`}
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleBookmark(e, art.articleId)}
                                  className={`p-1.5 rounded-lg transition cursor-pointer ${
                                    art.isBookmarked
                                      ? "text-blue-600 bg-blue-50"
                                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                  }`}
                                  title="Lưu"
                                >
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      art.isBookmarked ? "fill-blue-600" : ""
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                          type="button"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Trang trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPage(num)}
                            className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer ${
                              page === num
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                                : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {num}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          Trang sau
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: COMPACT BALANCED SIDEBAR (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* WIDGET 1: AI ECOSYSTEM SHORTCUT */}
                <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/60 text-slate-900 border-2 border-blue-200/80 shadow-lg shadow-blue-900/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>HỆ SINH THÁI AI CAREERGO</span>
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    Kiểm Tra & Chuẩn Bị Sự Nghiệp Toàn Diện
                  </h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Sử dụng các công cụ trí tuệ nhân tạo độc quyền để nâng cao cơ hội trúng tuyển.
                  </p>

                  <div className="space-y-2 mt-4">
                    <button
                      type="button"
                      onClick={() => navigate("/cv-analysis")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/90 hover:border-blue-300 shadow-2xs transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-slate-800">Phân tích CV chuẩn ATS</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/mock-interview")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/90 hover:border-blue-300 shadow-2xs transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MessagesSquare className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-slate-800">Luyện Phỏng vấn AI giả lập</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/career-roadmap")}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/90 hover:border-blue-300 shadow-2xs transition text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">Lộ trình học tập & thăng tiến</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                </div>

                {/* WIDGET 2: POPULAR TOPICS / TAG CLOUD */}
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-blue-900/5 p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <h4 className="text-sm font-black text-slate-900">Chủ Đề Phổ Biến</h4>
                  </div>

                  {loadingSidebar ? (
                    <div className="flex justify-center py-4">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : popularTags.length === 0 ? (
                    <p className="text-xs text-slate-400">Đang cập nhật thẻ chủ đề...</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {popularTags.map((tag, i) => {
                        const isSelected = category === tag.name;
                        return (
                          <button
                            key={tag.name || i}
                            type="button"
                            onClick={() => handleCategoryChange(tag.name)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            <span>#{tag.name}</span>
                            {tag.count > 0 && (
                              <span className="ml-1 text-[10px] opacity-70">({tag.count})</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================= 6. CURATED CAREER PATHWAYS (FULL-WIDTH 3 CARDS) ================= */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Bộ Sưu Tập Tuyển Chọn</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Chuyên Đề Lộ Trình Sự Nghiệp Thực Chiến
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CURATED_SERIES.map((series) => (
              <motion.div
                key={series.id}
                whileHover={{ y: -4 }}
                onClick={() => handleCategoryChange(series.category)}
                className="group relative rounded-3xl p-6 bg-white border border-slate-200/90 shadow-lg shadow-blue-900/5 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3.5 ${series.accent}`}
                  >
                    {series.badge}
                  </span>
                  <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {series.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {series.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Khám phá chuyên đề</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= 7. FREE CAREER TOOLKITS (FULL-WIDTH 3 COLUMNS) ================= */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kho Tài Liệu Độc Quyền</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Tài Nguyên Ứng Tuyển & Mẫu Tải Về Miễn Phí
              </h3>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Cập nhật hàng tháng
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FREE_TOOLKITS.map((tool, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                onClick={() => handleDownloadToolkit(tool)}
                className="group p-5 rounded-3xl bg-white hover:bg-blue-50/40 border border-slate-200/90 hover:border-blue-400 shadow-md shadow-slate-900/5 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-3.5 group-hover:scale-110 transition-transform">
                    <Download className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {tool.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1.5">
                    <span>{tool.format}</span>
                    <span>•</span>
                    <span>{tool.downloads}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Tải về miễn phí</span>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-blue-600 text-slate-600 group-hover:text-white flex items-center justify-center transition">
                    <Download className="w-3.5 h-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= 8. FULL-WIDTH CYBER NEWSLETTER BANNER ================= */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-blue-200 mb-3.5">
                <Mail className="w-3.5 h-3.5 text-amber-300" />
                <span>BẢN TIN SỰ NGHIỆP TUẦN TỪ CAREERGO</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Đón Đầu Cơ Hội Việc Làm & Xu Hướng Tuyển Dụng 2026
              </h3>
              <p className="text-sm text-blue-100 mt-2 max-w-xl leading-relaxed">
                Nhận các bài viết chiến lược, checklist phỏng vấn và báo cáo đãi ngộ đa ngành nghề được chọn lọc gửi trực tiếp vào hộp thư của bạn vào thứ 2 hàng tuần.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-blue-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  100% Hoàn toàn miễn phí
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  Bảo mật email tuyệt đối
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Hủy đăng ký bất cứ lúc nào
                </span>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleNewsletterSubmit} className="bg-white/10 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/20 shadow-xl">
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Nhập địa chỉ email để nhận tài liệu & bản tin:
                </label>
                <div className="space-y-3">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm uppercase tracking-wide shadow-lg shadow-amber-500/25 transition cursor-pointer"
                  >
                    {isSubscribed ? "Đã đăng ký nhận tin!" : "Đăng ký nhận ngay"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
