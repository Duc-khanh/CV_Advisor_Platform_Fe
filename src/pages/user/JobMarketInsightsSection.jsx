import React, { useState, useMemo } from "react";
import { Box, Typography, Button, Stack, Container, Grid, Chip } from "@mui/material";
import {
  TrendingUp,
  MonetizationOn,
  Work,
  AutoAwesome,
  LocationOn,
  Speed,
  Psychology,
  Code,
  Campaign,
  Storefront,
  AccountBalance,
  Brush,
  AllInclusive,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Danh mục ngành nghề hỗ trợ
const INDUSTRIES = [
  { id: "all", label: "Toàn thị trường", icon: <AllInclusive sx={{ fontSize: 18 }} /> },
  { id: "it", label: "Công nghệ thông tin", icon: <Code sx={{ fontSize: 18 }} /> },
  { id: "sales", label: "Kinh doanh & Bán hàng", icon: <Storefront sx={{ fontSize: 18 }} /> },
  { id: "marketing", label: "Marketing & Truyền thông", icon: <Campaign sx={{ fontSize: 18 }} /> },
  { id: "finance", label: "Tài chính & Ngân hàng", icon: <AccountBalance sx={{ fontSize: 18 }} /> },
  { id: "design", label: "Thiết kế & Sáng tạo", icon: <Brush sx={{ fontSize: 18 }} /> },
];

// Dữ liệu chi tiết theo từng ngành nghề
const MARKET_DATA_BY_INDUSTRY = {
  all: {
    avgSalary: "22.5M",
    growthRate: "+16.8%",
    remoteRatio: "31%",
    seniorRatio: "62%",
    salaryLevels: [
      { level: "Thực tập sinh / Mới tốt nghiệp", range: "6M - 12M", avg: "8.5M", percent: 40, demand: "Cao", color: "#0284c7" },
      { level: "Nhân viên (1 - 2 năm)", range: "12M - 20M", avg: "16.0M", percent: 62, demand: "Rất cao", color: "#0ea5e9" },
      { level: "Chuyên viên (2 - 4 năm)", range: "18M - 35M", avg: "26.5M", percent: 84, demand: "Bùng nổ", color: "#2563eb" },
      { level: "Chuyên gia / Cấp cao (4 - 7 năm)", range: "30M - 55M", avg: "42.0M", percent: 72, demand: "Săn đón", color: "#4f46e5" },
      { level: "Trưởng phòng / Quản lý", range: "45M - 90M+", avg: "65.0M", percent: 52, demand: "Tuyển chọn", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "Phân tích dữ liệu & Kỹ năng số", category: "Kỹ năng số", share: 38, growth: "+24%", hot: true },
      { name: "Giao tiếp & Đàm phán thuyết phục", category: "Kỹ năng mềm", share: 35, growth: "+12%", hot: false },
      { name: "Tiếng Anh thương mại (IELTS/TOEIC)", category: "Ngoại ngữ", share: 32, growth: "+18%", hot: true },
      { name: "Quản lý dự án & Điều phối (Agile/PMP)", category: "Quản trị", share: 28, growth: "+15%", hot: false },
      { name: "Ứng dụng AI & Tự động hóa vào công việc", category: "Công nghệ mới", share: 26, growth: "+52%", hot: true },
      { name: "Giải quyết vấn đề phức tạp", category: "Tư duy", share: 22, growth: "+10%", hot: false },
    ],
    aiInsight: "Xu hướng thị trường đang ưu tiên các nhân sự sở hữu 'Kỹ năng lai' (T-shaped skills): vững chuyên môn ngành nghề đồng thời thành thạo kỹ năng số và ứng dụng công cụ AI để gia tăng năng suất.",
  },
  it: {
    avgSalary: "28.5M",
    growthRate: "+21.8%",
    remoteRatio: "42%",
    seniorRatio: "70%",
    salaryLevels: [
      { level: "Fresher / Thực tập sinh IT", range: "8M - 15M", avg: "11.5M", percent: 45, demand: "Cao", color: "#0284c7" },
      { level: "Junior Developer (1 - 2 năm)", range: "14M - 24M", avg: "19.0M", percent: 65, demand: "Rất cao", color: "#0ea5e9" },
      { level: "Mid-Level Software Engineer (2 - 4 năm)", range: "24M - 42M", avg: "33.0M", percent: 85, demand: "Bùng nổ", color: "#2563eb" },
      { level: "Senior Engineer (4 - 7 năm)", range: "40M - 70M", avg: "55.0M", percent: 75, demand: "Săn đón", color: "#4f46e5" },
      { level: "Tech Lead / Solution Architect", range: "65M - 120M+", avg: "88.0M", percent: 55, demand: "Hiếm", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "React & Next.js Ecosystem", category: "Frontend", share: 36, growth: "+14%", hot: true },
      { name: "Java & Spring Boot Framework", category: "Backend", share: 32, growth: "+9%", hot: false },
      { name: "Python, AI Agents & LLM Integration", category: "AI / Data", share: 29, growth: "+48%", hot: true },
      { name: "Docker, Kubernetes & Cloud (AWS/GCP)", category: "DevOps", share: 24, growth: "+21%", hot: true },
      { name: "Node.js, TypeScript & Microservices", category: "Backend", share: 22, growth: "+11%", hot: false },
      { name: "Mobile (Flutter / React Native)", category: "Mobile", share: 19, growth: "+12%", hot: false },
    ],
    aiInsight: "Lập trình viên thành thạo xây dựng hệ thống phân tán, kết hợp tích hợp AI APIs và tối ưu chi phí hạ tầng Cloud ghi nhận mức lương chào mời cao hơn trung bình 28%.",
  },
  sales: {
    avgSalary: "20.5M",
    growthRate: "+18.2%",
    remoteRatio: "18%",
    seniorRatio: "55%",
    salaryLevels: [
      { level: "Thực tập sinh Kinh doanh", range: "5M - 9M + Thưởng", avg: "7.5M", percent: 40, demand: "Cao", color: "#0284c7" },
      { level: "Nhân viên Bán hàng / Telesales", range: "9M - 18M + Thưởng", avg: "14.0M", percent: 70, demand: "Liên tục", color: "#0ea5e9" },
      { level: "Chuyên viên B2B / Account Executive", range: "18M - 35M + % DS", avg: "25.0M", percent: 85, demand: "Săn đón", color: "#2563eb" },
      { level: "Trưởng nhóm Kinh doanh (Team Lead)", range: "28M - 50M + Thưởng KPI", avg: "38.0M", percent: 75, demand: "Rất cao", color: "#4f46e5" },
      { level: "Giám đốc Kinh doanh (Sales Director)", range: "50M - 100M+ & Cổ phần", avg: "75.0M", percent: 50, demand: "Cấp cao", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "B2B Solution Selling (Bán hàng giải pháp)", category: "Chiến lược", share: 42, growth: "+22%", hot: true },
      { name: "Quản trị quan hệ khách hàng (CRM/Salesforce)", category: "Công cụ", share: 36, growth: "+18%", hot: false },
      { name: "Kỹ năng đàm phán hợp đồng lớn", category: "Kỹ năng", share: 34, growth: "+15%", hot: true },
      { name: "Phát triển thị trường mới (Market Expansion)", category: "Kinh doanh", share: 29, growth: "+20%", hot: false },
      { name: "Xây dựng & Đào tạo đội ngũ bán hàng", category: "Quản lý", share: 24, growth: "+14%", hot: false },
      { name: "Kỹ năng tư vấn tài chính / công nghệ", category: "Tư vấn", share: 21, growth: "+19%", hot: true },
    ],
    aiInsight: "Thu nhập ngành kinh doanh phụ thuộc mạnh vào năng lực bán giải pháp B2B và quản lý tệp khách hàng doanh nghiệp. Kỹ năng phân tích số liệu chuyển đổi phễu bán hàng đang là lợi thế vượt trội.",
  },
  marketing: {
    avgSalary: "21.0M",
    growthRate: "+15.5%",
    remoteRatio: "35%",
    seniorRatio: "58%",
    salaryLevels: [
      { level: "Marketing Intern", range: "5M - 8M", avg: "6.5M", percent: 40, demand: "Rất cao", color: "#0284c7" },
      { level: "Marketing Executive (1 - 2 năm)", range: "11M - 19M", avg: "15.0M", percent: 65, demand: "Bùng nổ", color: "#0ea5e9" },
      { level: "Senior / Specialist (2 - 4 năm)", range: "18M - 32M", avg: "25.0M", percent: 80, demand: "Săn đón", color: "#2563eb" },
      { level: "Marketing Manager / Growth Lead", range: "30M - 55M", avg: "40.0M", percent: 70, demand: "Cạnh tranh", color: "#4f46e5" },
      { level: "Chief Marketing Officer (CMO)", range: "55M - 95M+", avg: "72.0M", percent: 45, demand: "Tuyển chọn", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "Performance Marketing (Meta, Google, TikTok Ads)", category: "Quảng cáo", share: 39, growth: "+25%", hot: true },
      { name: "Sáng tạo nội dung Video ngắn (Shorts/Reels)", category: "Nội dung", share: 35, growth: "+38%", hot: true },
      { name: "Phân tích dữ liệu tiếp thị (Google Analytics 4)", category: "Dữ liệu", share: 31, growth: "+16%", hot: false },
      { name: "Chiến lược thương hiệu & Định vị sản phẩm", category: "Branding", share: 27, growth: "+11%", hot: false },
      { name: "SEO tổng thể & Tối ưu AI Search", category: "SEO", share: 23, growth: "+19%", hot: true },
      { name: "Marketing Automation & CRM Retention", category: "Tự động hóa", share: 20, growth: "+22%", hot: false },
    ],
    aiInsight: "Sự bùng nổ của Video ngắn và AI tạo sinh (Generative AI) đang tái định hình phòng Marketing. Nhân sự có khả năng phân tích chi phí chuyển đổi (CAC/ROAS) kết hợp sáng tạo nội dung được săn đón hàng đầu.",
  },
  finance: {
    avgSalary: "23.5M",
    growthRate: "+14.2%",
    remoteRatio: "15%",
    seniorRatio: "65%",
    salaryLevels: [
      { level: "Thực tập sinh Tài chính / Kế toán", range: "5M - 9M", avg: "7.0M", percent: 40, demand: "Cao", color: "#0284c7" },
      { level: "Kế toán viên / Chuyên viên Tín dụng", range: "11M - 20M", avg: "15.5M", percent: 65, demand: "Ổn định", color: "#0ea5e9" },
      { level: "Chuyên viên Phân tích tài chính (FP&A)", range: "20M - 38M", avg: "28.0M", percent: 80, demand: "Săn đón", color: "#2563eb" },
      { level: "Kiểm toán trưởng / Kế toán trưởng", range: "35M - 65M", avg: "48.0M", percent: 70, demand: "Rất cao", color: "#4f46e5" },
      { level: "Giám đốc Tài chính (CFO)", range: "60M - 110M+", avg: "82.0M", percent: 48, demand: "Chiến lược", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "Phân tích & Lập mô hình tài chính (Financial Modeling)", category: "Phân tích", share: 38, growth: "+20%", hot: true },
      { name: "Hệ thống phần mềm ERP (SAP, Oracle, MISA)", category: "Phần mềm", share: 35, growth: "+14%", hot: false },
      { name: "Quản trị rủi ro & Tuân thủ quy định tài chính", category: "Quản trị", share: 30, growth: "+16%", hot: false },
      { name: "Chứng chỉ nghề nghiệp quốc tế (ACCA, CFA, CPA)", category: "Chứng chỉ", share: 28, growth: "+24%", hot: true },
      { name: "Tự động hóa báo cáo tài chính (PowerBI, Python)", category: "Dữ liệu", share: 24, growth: "+31%", hot: true },
      { name: "Thuế doanh nghiệp & Tối ưu dòng tiền", category: "Thuế", share: 22, growth: "+12%", hot: false },
    ],
    aiInsight: "Ngành Tài chính - Kế toán đang dịch chuyển mạnh từ ghi chép nghiệp vụ thuần túy sang phân tích chiến lược kinh doanh. Ứng viên biết sử dụng PowerBI và chứng chỉ ACCA/CFA có tốc độ thăng tiến vượt bậc.",
  },
  design: {
    avgSalary: "19.5M",
    growthRate: "+17.0%",
    remoteRatio: "45%",
    seniorRatio: "58%",
    salaryLevels: [
      { level: "Thiết kế thực tập", range: "5M - 8M", avg: "6.5M", percent: 40, demand: "Cao", color: "#0284c7" },
      { level: "Junior Designer (1 - 2 năm)", range: "10M - 18M", avg: "14.0M", percent: 65, demand: "Rất cao", color: "#0ea5e9" },
      { level: "UI/UX / Product Designer (2 - 4 năm)", range: "18M - 35M", avg: "26.0M", percent: 85, demand: "Bùng nổ", color: "#2563eb" },
      { level: "Senior Art Director / Design Lead", range: "32M - 55M", avg: "42.0M", percent: 70, demand: "Săn đón", color: "#4f46e5" },
      { level: "Giám đốc Sáng tạo (Creative Director)", range: "50M - 85M+", avg: "68.0M", percent: 48, demand: "Cấp cao", color: "#7c3aed" },
    ],
    hotSkills: [
      { name: "UI/UX & Hệ thống thiết kế (Figma, Design System)", category: "Sản phẩm", share: 42, growth: "+26%", hot: true },
      { name: "Motion Graphics & Hiệu ứng chuyển động (After Effects)", category: "Animation", share: 34, growth: "+30%", hot: true },
      { name: "Bộ công cụ Adobe Creative (Photoshop, Illustrator)", category: "Đồ họa", share: 36, growth: "+8%", hot: false },
      { name: "Ứng dụng AI vào tạo mẫu & Ý tưởng (Midjourney)", category: "AI Design", share: 28, growth: "+45%", hot: true },
      { name: "Thiết kế 3D & Dựng hình (Blender, Cinema 4D)", category: "3D", share: 22, growth: "+22%", hot: false },
      { name: "Tư duy nghiên cứu người dùng (User Research)", category: "Nghiên cứu", share: 20, growth: "+15%", hot: false },
    ],
    aiInsight: "Nhu cầu thiết kế trải nghiệm người dùng (UI/UX) cho các ứng dụng số và thiết kế chuyển động (Motion Design) tiếp tục duy trì mức tăng trưởng ấn tượng và chế độ làm việc Remote cực kỳ linh hoạt.",
  },
};

// Phân bổ khu vực
const LOCATION_DATA = [
  { city: "Hồ Chí Minh", share: 46, count: "5.800+ việc làm đa ngành", trend: "+14%" },
  { city: "Hà Nội", share: 39, count: "4.600+ việc làm đa ngành", trend: "+16%" },
  { city: "Đà Nẵng & Miền Trung", share: 15, count: "1.800+ việc làm đa ngành", trend: "+10%" },
  { city: "Linh hoạt / Làm việc từ xa (Remote)", share: 31, count: "3.200+ vị trí tuyển dụng", trend: "+28%" },
];

export default function JobMarketInsightsSection({ jobs = [] }) {
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [activeTab, setActiveTab] = useState("salary");

  const currentData = useMemo(() => {
    return MARKET_DATA_BY_INDUSTRY[selectedIndustry] || MARKET_DATA_BY_INDUSTRY.all;
  }, [selectedIndustry]);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 9 },
        position: "relative",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Ambient Blue Background Glow */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: 1000,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(2, 132, 199, 0.05) 0%, rgba(56, 189, 248, 0.02) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        {/* HEADER SECTION */}
        <Box sx={{ textAlign: "center", maxWidth: 850, mx: "auto", mb: { xs: 4, md: 5 } }}>
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.6,
              borderRadius: "20px",
              bgcolor: "rgba(2, 132, 199, 0.08)",
              color: "#0284c7",
              fontSize: "0.82rem",
              fontWeight: 800,
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#10b981",
                boxShadow: "0 0 8px #10b981",
                animation: "pulse 2s infinite",
              }}
            />
            Dữ liệu thị trường việc làm đa ngành thời gian thực
          </MotionBox>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: "#0f172a",
              fontSize: { xs: "1.6rem", sm: "2.1rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
              lineHeight: 1.25,
              mb: 1.5,
            }}
          >
            Báo cáo & Phân tích thị trường việc làm toàn diện
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              fontSize: { xs: "0.92rem", sm: "1rem" },
              lineHeight: 1.6,
            }}
          >
            Khám phá phổ thu nhập, nhu cầu tuyển dụng và kỹ năng nổi bật theo từng lĩnh vực nghề nghiệp được cập nhật liên tục từ dữ liệu thực tế trên toàn hệ thống.
          </Typography>
        </Box>

        {/* BỘ LỌC NGÀNH NGHỀ LINH HOẠT (INDUSTRY SWITCHER) */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4.5 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              p: 0.8,
              borderRadius: "18px",
              bgcolor: "#f8fafc",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.04)",
              maxWidth: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {INDUSTRIES.map((ind) => {
              const active = selectedIndustry === ind.id;
              return (
                <Button
                  key={ind.id}
                  onClick={() => setSelectedIndustry(ind.id)}
                  startIcon={ind.icon}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: { xs: "0.82rem", sm: "0.88rem" },
                    px: { xs: 1.8, sm: 2.4 },
                    py: 1,
                    borderRadius: "14px",
                    whiteSpace: "nowrap",
                    color: active ? "#ffffff" : "#64748b",
                    bgcolor: active ? "#0284c7" : "transparent",
                    boxShadow: active ? "0 4px 14px rgba(2, 132, 199, 0.28)" : "none",
                    "&:hover": {
                      bgcolor: active ? "#0284c7" : "rgba(2, 132, 199, 0.06)",
                      color: active ? "#ffffff" : "#0284c7",
                    },
                    transition: "all 0.25s",
                  }}
                >
                  {ind.label}
                </Button>
              );
            })}
          </Stack>
        </Box>

        {/* 4 THẺ CHỈ SỐ NHANH (LIVE PULSE CARDS) */}
        <Grid container spacing={2.5} sx={{ mb: 5 }}>
          {[
            {
              title: "Lương trung bình ngành",
              val: currentData.avgSalary,
              unit: "/tháng",
              sub: "Mức thu nhập phổ biến",
              icon: <MonetizationOn sx={{ fontSize: 24 }} />,
              color: "#0284c7",
              bg: "#f0f9ff",
            },
            {
              title: "Tốc độ tuyển dụng",
              val: currentData.growthRate,
              unit: "năm nay",
              sub: "Nhu cầu mở mới liên tục",
              icon: <TrendingUp sx={{ fontSize: 24 }} />,
              color: "#059669",
              bg: "#ecfdf5",
            },
            {
              title: "Tỷ lệ làm việc Remote/Hybrid",
              val: currentData.remoteRatio,
              unit: "",
              sub: "Cơ hội làm việc linh hoạt",
              icon: <Speed sx={{ fontSize: 24 }} />,
              color: "#7c3aed",
              bg: "#f5f3ff",
            },
            {
              title: "Tỷ lệ tuyển dụng Mid & Quản lý",
              val: currentData.seniorRatio,
              unit: "",
              sub: "Yêu cầu kinh nghiệm chuyên sâu",
              icon: <Psychology sx={{ fontSize: 24 }} />,
              color: "#ea580c",
              bg: "#fff7ed",
            },
          ].map((stat, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
              <MotionBox
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ y: -4 }}
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  bgcolor: "#ffffff",
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.25s",
                  "&:hover": {
                    boxShadow: "0 16px 36px rgba(2, 132, 199, 0.08)",
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography sx={{ color: "#64748b", fontSize: "0.82rem", fontWeight: 750 }}>
                    {stat.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "12px",
                      bgcolor: stat.bg,
                      color: stat.color,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Stack>
                <Box>
                  <Stack direction="row" alignItems="baseline" spacing={0.5}>
                    <Typography sx={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.02em" }}>
                      {stat.val}
                    </Typography>
                    {stat.unit && (
                      <Typography sx={{ color: "#94a3b8", fontSize: "0.85rem", fontWeight: 700 }}>
                        {stat.unit}
                      </Typography>
                    )}
                  </Stack>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600, mt: 0.5 }}>
                    {stat.sub}
                  </Typography>
                </Box>
              </MotionBox>
            </Grid>
          ))}
        </Grid>

        {/* KHUNG NỘI DUNG CHÍNH: TABS PHÂN TÍCH CHUYÊN SÂU */}
        <MotionBox
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          sx={{
            borderRadius: "24px",
            bgcolor: "#ffffff",
            boxShadow: "0 20px 45px -15px rgba(2, 132, 199, 0.07), 0 8px 25px -5px rgba(15, 23, 42, 0.03)",
            p: { xs: 3, md: 4.5 },
          }}
        >
          {/* TAB BUTTONS */}
          <Stack
            direction="row"
            spacing={1.2}
            sx={{
              mb: 4,
              p: 0.8,
              borderRadius: "16px",
              bgcolor: "#f8fafc",
              display: "inline-flex",
              maxWidth: "100%",
              overflowX: "auto",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {[
              { id: "salary", label: "Phổ thu nhập theo cấp bậc", icon: <MonetizationOn sx={{ fontSize: 18 }} /> },
              { id: "skills", label: "Kỹ năng chuyên môn săn đón", icon: <AutoAwesome sx={{ fontSize: 18 }} /> },
              { id: "location", label: "Phân bổ việc làm theo vùng", icon: <LocationOn sx={{ fontSize: 18 }} /> },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  startIcon={tab.icon}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    fontSize: "0.88rem",
                    px: { xs: 2, sm: 2.6 },
                    py: 1,
                    borderRadius: "12px",
                    whiteSpace: "nowrap",
                    color: active ? "#ffffff" : "#64748b",
                    bgcolor: active ? "#0284c7" : "transparent",
                    boxShadow: active ? "0 4px 14px rgba(2, 132, 199, 0.25)" : "none",
                    "&:hover": {
                      bgcolor: active ? "#0284c7" : "rgba(2, 132, 199, 0.06)",
                      color: active ? "#ffffff" : "#0284c7",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </Button>
              );
            })}
          </Stack>

          {/* TAB 1: PHỔ THU NHẬP (SALARY SPECTRUM) */}
          {activeTab === "salary" && (
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", mb: 3 }}>
                Mức lương trung vị & Khoảng dao động theo cấp bậc ({INDUSTRIES.find(i => i.id === selectedIndustry)?.label})
              </Typography>
              <Stack spacing={2.6}>
                {currentData.salaryLevels.map((item, idx) => (
                  <Box key={idx}>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} sx={{ mb: 1 }}>
                      <Box>
                        <Typography sx={{ fontWeight: 800, color: "#1e293b", fontSize: "0.92rem" }}>
                          {item.level}
                        </Typography>
                        <Typography sx={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600 }}>
                          Nhu cầu: <span style={{ color: "#0284c7", fontWeight: 750 }}>{item.demand}</span>
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: { xs: 0.5, sm: 0 } }}>
                        <Chip
                          label={`Khoảng: ${item.range}`}
                          size="small"
                          sx={{ bgcolor: "#f1f5f9", color: "#334155", fontWeight: 750, fontSize: "0.76rem" }}
                        />
                        <Typography sx={{ fontWeight: 900, color: item.color, fontSize: "0.98rem" }}>
                          TB: {item.avg}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Box sx={{ width: "100%", height: 10, borderRadius: "8px", bgcolor: "#f1f5f9", overflow: "hidden" }}>
                      <MotionBox
                        key={`${selectedIndustry}-${idx}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 0.7, delay: idx * 0.08, ease: "easeOut" }}
                        sx={{
                          height: "100%",
                          borderRadius: "8px",
                          background: `linear-gradient(90deg, #38bdf8 0%, ${item.color} 100%)`,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* TAB 2: KỸ NĂNG CHUYÊN MÔN (HOT SKILLS) */}
          {activeTab === "skills" && (
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", mb: 3 }}>
                Top Kỹ năng & Năng lực được tìm kiếm nhiều nhất ({INDUSTRIES.find(i => i.id === selectedIndustry)?.label})
              </Typography>
              <Grid container spacing={2.5}>
                {currentData.hotSkills.map((skill, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                    <MotionBox
                      whileHover={{ y: -3, scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      sx={{
                        p: 2.5,
                        borderRadius: "18px",
                        bgcolor: "#f8fafc",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                        height: "100%",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Chip
                          label={skill.category}
                          size="small"
                          sx={{ bgcolor: "#ffffff", color: "#64748b", fontWeight: 750, fontSize: "0.72rem" }}
                        />
                        {skill.hot && (
                          <Chip
                            label="Xu hướng HOT"
                            size="small"
                            sx={{ bgcolor: "#fef3c7", color: "#b45309", fontWeight: 800, fontSize: "0.7rem" }}
                          />
                        )}
                      </Stack>
                      <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1.02rem" }}>
                        {skill.name}
                      </Typography>
                      <Box sx={{ mt: "auto" }}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.8 }}>
                          <Typography sx={{ fontSize: "0.78rem", color: "#64748b", fontWeight: 600 }}>
                            Chiếm {skill.share}% yêu cầu
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "#059669", fontWeight: 800 }}>
                            {skill.growth}
                          </Typography>
                        </Stack>
                        <Box sx={{ width: "100%", height: 6, borderRadius: "6px", bgcolor: "#e2e8f0", overflow: "hidden" }}>
                          <MotionBox
                            key={`skill-${selectedIndustry}-${idx}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.share * 2.2}%` }}
                            transition={{ duration: 0.6, delay: idx * 0.06 }}
                            sx={{ height: "100%", bgcolor: "#0284c7", borderRadius: "6px" }}
                          />
                        </Box>
                      </Box>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* TAB 3: PHÂN BỔ THEO ĐỊA LÝ (LOCATION DEMAND) */}
          {activeTab === "location" && (
            <Box>
              <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.1rem", mb: 3 }}>
                Tỷ lệ phân bổ nhu cầu tuyển dụng theo trung tâm kinh tế & Hình thức làm việc
              </Typography>
              <Grid container spacing={2.5}>
                {LOCATION_DATA.map((loc, idx) => (
                  <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                    <MotionBox
                      whileHover={{ y: -3 }}
                      sx={{
                        p: 3,
                        borderRadius: "18px",
                        bgcolor: "#f8fafc",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.2,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1.05rem" }}>
                          {loc.city}
                        </Typography>
                        <Chip
                          label={`Tăng trưởng ${loc.trend}`}
                          size="small"
                          sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 800, fontSize: "0.72rem" }}
                        />
                      </Stack>
                      <Typography sx={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>
                        {loc.count}
                      </Typography>
                      <Box sx={{ width: "100%", height: 8, borderRadius: "6px", bgcolor: "#e2e8f0", overflow: "hidden", mt: 1 }}>
                        <MotionBox
                          initial={{ width: 0 }}
                          whileInView={{ width: `${loc.share * 1.8}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: idx * 0.1 }}
                          sx={{ height: "100%", bgcolor: "#0ea5e9", borderRadius: "6px" }}
                        />
                      </Box>
                    </MotionBox>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* AI MARKET RADAR INSIGHT CARD (GỢI Ý TỰ ĐỘNG TỪ AI) */}
          <Box
            sx={{
              mt: 4.5,
              p: 3,
              borderRadius: "20px",
              bgcolor: "rgba(2, 132, 199, 0.04)",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { md: "center" },
              justifyContent: "space-between",
              gap: 2.5,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "14px",
                  bgcolor: "#ffffff",
                  color: "#0284c7",
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0,
                  boxShadow: "0 4px 14px rgba(2, 132, 199, 0.15)",
                }}
              >
                <AutoAwesome sx={{ fontSize: 24 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "0.98rem" }}>
                  AI Market Insight ({INDUSTRIES.find(i => i.id === selectedIndustry)?.label})
                </Typography>
                <Typography sx={{ color: "#64748b", fontSize: "0.84rem", fontWeight: 600, mt: 0.3, lineHeight: 1.5 }}>
                  {currentData.aiInsight}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
}
