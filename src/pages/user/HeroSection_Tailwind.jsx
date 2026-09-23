import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  TrendingUp,
  Building2,
  CheckCircle,
  Menu,
  Settings,
} from 'lucide-react';

// ============= NAVBAR COMPONENT =============
const NavBar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Phân tích CV', href: '/cv-analysis' },
    { label: 'Tạo CV', href: '/cv-builder' },
    { label: 'Lộ trình học tập', href: '/career-roadmap' },
    { label: 'Cẩm nang', href: '/career-guide' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-xl text-slate-900 hidden sm:inline">CareerGo</span>
        </Link>

        {/* Center Menu - Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-slate-600 font-medium hover:text-blue-600 transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Employer Button + Avatar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/for-employers')}
            className="px-4 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm whitespace-nowrap"
          >
            Nhà tuyển dụng
          </button>
          <button className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center hover:shadow-md transition-shadow">
            <span className="text-white font-bold text-sm">A</span>
          </button>
          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>
    </nav>
  );
};

// ============= GLASSMORPHISM DASHBOARD =============
const AIMatchingDashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full relative"
    >
      {/* Background Glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main Glass Card */}
      <div className="bg-white/90 backdrop-blur-xl border border-slate-200/70 shadow-2xl shadow-blue-900/5 rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 group">
        {/* Badge + Main Job Card */}
        <div className="mb-7">
          {/* AI Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-2 mb-5 w-fit"
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200/70 rounded-full shadow-sm">
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-emerald-100"
              ></motion.span>
              <span className="text-xs font-bold text-emerald-800">AI CV Match</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                92% Phù hợp
              </span>
            </span>
          </motion.div>

          {/* Job Card Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="space-y-3.5"
          >
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              Frontend Developer (React/Next.js)
            </h3>
            <div className="text-sm sm:text-base text-slate-600 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
                <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                TechCorp Vietnam
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                Hồ Chí Minh
              </span>
            </div>

            {/* Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 mb-1.5">
                <span>Độ tương thích hồ sơ</span>
                <span className="text-blue-600 font-bold">92%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5 border border-slate-200/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '92%' }}
                  transition={{ duration: 1.2, ease: 'easeOut', delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-full shadow-sm"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metrics Grid - To rõ hơn, thoáng hơn, cân đối với giao diện */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Metric 1: New Jobs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 sm:p-5 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all group/card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600">Việc làm mới</span>
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
              </div>
            </div>
            <p className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">1.248+</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold">
              <span>↑ 14%</span>
              <span className="font-medium text-emerald-600">tuần này</span>
            </div>
          </motion.div>

          {/* Metric 2: Verified Companies */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            whileHover={{ y: -3, scale: 1.01 }}
            className="p-4 sm:p-5 bg-gradient-to-br from-purple-50/80 via-white to-purple-50/30 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all group/card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600">Doanh nghiệp</span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5 flex-shrink-0" />
              </div>
            </div>
            <p className="font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">568+</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-xs font-semibold">
              <span>Đang tuyển dụng</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ============= MAIN HERO SECTION =============
const HeroSection = ({ searchQuery = {}, setSearchQuery = () => {}, onSearch = () => {} }) => {
  const [keyword, setKeyword] = useState(searchQuery?.keyword || '');
  const [location, setLocation] = useState(searchQuery?.location || '');
  const navigate = useNavigate();

  const popularTags = [
    'Marketing',
    'Kế toán',
    'IT',
    'Thiết kế',
    'Kinh doanh',
  ];

  const handleSearch = () => {
    setSearchQuery({ keyword, location });
    onSearch?.();
    navigate('/search');
  };

  const handleTagClick = (tag) => {
    setKeyword(tag);
    setSearchQuery({ keyword: tag, location });
    navigate('/search');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50/50 pt-10 pb-16 relative overflow-hidden">
      {/* Background Blurs */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-12 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl pointer-events-none"
      ></motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-200/5 rounded-full blur-3xl pointer-events-none"
      ></motion.div>

      {/* Navbar */}
      <NavBar />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* ===== LEFT SECTION: Search + Tags ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-4"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-2">
                Tìm công việc phù hợp
                <br />
                <span className="text-blue-600">
                  Phát triển sự nghiệp
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-base sm:text-lg text-slate-600 font-medium mb-6 max-w-lg leading-relaxed"
            >
              Hàng ngàn cơ hội việc làm từ các công ty uy tín. Tìm công việc phù hợp với kỹ năng và đam mê của bạn.
            </motion.p>

            {/* Search Bar - Thu gọn ô địa điểm, cho nút vào trong trọn vẹn */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-6 w-full"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 bg-white p-2.5 sm:p-2 rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-200/70 hover:shadow-2xl transition-all">
                {/* Input 1: Keyword (Vị trí, kỹ năng, công ty...) chiếm phần lớn */}
                <div className="flex-[1.5] min-w-0 flex items-center px-3.5 py-3 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-xl focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:shadow-sm transition-all">
                  <Search className="w-5 h-5 text-slate-400 mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Vị trí, kỹ năng, công ty..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Input 2: Location (Địa điểm) - Thu gọn vừa vặn, không bị dài quá */}
                <div className="w-full sm:w-44 md:w-48 lg:w-52 min-w-0 flex-shrink-0 flex items-center px-3.5 py-3 bg-slate-50/80 hover:bg-slate-50 focus-within:bg-white rounded-xl focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:shadow-sm transition-all">
                  <MapPin className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Địa điểm"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-slate-400 font-medium"
                  />
                </div>

                {/* Button: Nằm gọn gàng bên trong khung tìm kiếm, không bị lòi ra ngoài */}
                <motion.button
                  onClick={handleSearch}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-shrink-0 px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 text-white font-bold text-sm sm:text-base rounded-xl shadow-md shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:from-blue-700 hover:to-indigo-700 transition-all whitespace-nowrap cursor-pointer flex items-center justify-center"
                >
                  Tìm việc ngay
                </motion.button>
              </div>
            </motion.div>

            {/* Popular Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              <p className="text-sm font-bold text-slate-600 mb-3">Tìm kiếm phổ biến:</p>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-xs font-bold hover:bg-blue-100 hover:text-blue-700 active:bg-blue-200 transition-all cursor-pointer"
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ===== RIGHT SECTION: AI Matching Dashboard (Dịch sang phải, to hơn & cân đối hơn) ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden lg:flex items-center justify-end"
          >
            <div className="w-full max-w-lg xl:max-w-xl">
              <AIMatchingDashboard />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
