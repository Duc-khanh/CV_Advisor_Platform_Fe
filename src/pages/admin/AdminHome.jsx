import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import {
  Users,
  Building2,
  Briefcase,
  Sparkles,
  RefreshCw,
  TrendingUp,
  PieChart as PieIcon,
  BarChart3,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatCard from "../../components/ui/StatCard";
import AdminFeatureSection from "../../components/admin/AdminFeatureSection";
import AdminQuickActions from "../../components/admin/AdminQuickActions";
import api from "../../services/axios";

// Bảng màu cho biểu đồ tròn Vai trò
const ROLE_COLORS = {
  "Ứng viên (Candidate)": "#3b82f6",  // Xanh dương
  "Nhà tuyển dụng (HR)": "#10b981",    // Xanh lục
  "Quản trị viên (Admin)": "#8b5cf6", // Tím
};

// Bảng màu cho biểu đồ cột Tính năng AI
const AI_BAR_COLORS = ["#2563eb", "#0d9488", "#0284c7", "#7c3aed", "#f59e0b"];

// Bảng màu cho biểu đồ tròn Ngành nghề
const INDUSTRY_COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#64748b",
];

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCandidates: 0,
    totalHr: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalAiRequests: 0,
    aiSuccessRate: 100,
    userGrowth: [],
    roleDistribution: [],
    aiFeatureUsage: [],
    industryDistribution: [],
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/dashboard/stats");
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải thống kê Admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5, pb: 4 }}>
      {/* 1. HEADER SECTION */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1e293b">
            Bảng điều khiển quản trị
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Báo cáo phân tích toàn diện người dùng, hoạt động tuyển dụng và vận hành AI hệ thống
          </Typography>
        </Box>

        <Tooltip title="Làm mới dữ liệu thống kê" arrow>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={18} />}
            onClick={fetchStats}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              textTransform: "none",
              borderColor: "#cbd5e1",
              color: "#475569",
              "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
            }}
          >
            Làm mới
          </Button>
        </Tooltip>
      </Stack>

      {/* 2. TOP KPI CARDS */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng người dùng"
            value={stats.totalUsers?.toLocaleString("vi-VN") || "0"}
            icon={<Users size={24} />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Doanh nghiệp đối tác"
            value={stats.totalCompanies?.toLocaleString("vi-VN") || "0"}
            icon={<Building2 size={24} />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tin tuyển dụng"
            value={stats.totalJobs?.toLocaleString("vi-VN") || "0"}
            icon={<Briefcase size={24} />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Xử lý AI (Thành công)"
            value={`${stats.totalAiRequests?.toLocaleString("vi-VN") || "0"} (${stats.aiSuccessRate}%)`}
            icon={<Sparkles size={24} />}
            color="#8b5cf6"
          />
        </Grid>
      </Grid>

      {/* 3. CHARTS GRID (2 HÀNG x 2 CỘT HIỆN ĐẠI) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
          gap: 3,
        }}
      >
        {/* BIỂU ĐỒ 1: BIỂU ĐỒ MIỀN (AREA CHART) - TĂNG TRƯỞNG NGƯỜI DÙNG */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            minHeight: 440,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Tăng trưởng người dùng
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Số lượng tài khoản đăng ký mới theo thời gian
              </Typography>
            </Box>
            <Chip
              label="Biểu đồ miền"
              size="small"
              sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <CircularProgress size={32} sx={{ color: "#2563eb" }} />
            ) : stats.userGrowth && stats.userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.userGrowth} margin={{ top: 10, right: 25, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="adminUserGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      fontWeight: 600,
                    }}
                    formatter={(val) => [`${val} người dùng`, "Đăng ký mới"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#adminUserGrowth)"
                    activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2, fill: "#3b82f6" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có dữ liệu tăng trưởng người dùng
              </Typography>
            )}
          </Box>
        </Paper>

        {/* BIỂU ĐỒ 2: BIỂU ĐỒ TRÒN DẠNG DONUT (PIE CHART) - CƠ CẤU VAI TRÒ */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            minHeight: 440,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Cơ cấu người dùng theo vai trò
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tỷ lệ phân bổ giữa Ứng viên, Nhà tuyển dụng và Quản trị
              </Typography>
            </Box>
            <Chip
              label="Phân bổ vai trò"
              size="small"
              sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <CircularProgress size={32} sx={{ color: "#10b981" }} />
            ) : stats.roleDistribution && stats.roleDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.roleDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {stats.roleDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-role-${index}`}
                        fill={ROLE_COLORS[entry.name] || INDUSTRY_COLORS[index % INDUSTRY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      fontWeight: 600,
                    }}
                    formatter={(val, name) => [`${val} tài khoản`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(val) => (
                      <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.82rem" }}>
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có dữ liệu phân bổ vai trò
              </Typography>
            )}
          </Box>
        </Paper>

        {/* BIỂU ĐỒ 3: BIỂU ĐỒ CỘT (BAR CHART) - SỬ DỤNG TÍNH NĂNG AI */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            minHeight: 440,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Sử dụng tính năng AI nền tảng
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tổng số lượt gọi API theo từng phân hệ trí tuệ nhân tạo
              </Typography>
            </Box>
            <Chip
              label="Phân hệ AI"
              size="small"
              sx={{ bgcolor: "#faf5ff", color: "#7c3aed", fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <CircularProgress size={32} sx={{ color: "#7c3aed" }} />
            ) : stats.aiFeatureUsage && stats.aiFeatureUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.aiFeatureUsage} layout="vertical" margin={{ top: 10, right: 30, left: 15, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      fontWeight: 600,
                    }}
                    formatter={(val, name, item) => [`${val} lượt yêu cầu`, item.payload.name]}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                    {stats.aiFeatureUsage.map((entry, index) => (
                      <Cell key={`cell-aibar-${index}`} fill={AI_BAR_COLORS[index % AI_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có dữ liệu sử dụng tính năng AI
              </Typography>
            )}
          </Box>
        </Paper>

        {/* BIỂU ĐỒ 4: BIỂU ĐỒ TRÒN DẠNG DONUT (PIE CHART) - PHÂN BỐ DOANH NGHIỆP THEO NGÀNH NGHỀ */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
            minHeight: 440,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Doanh nghiệp theo lĩnh vực ngành nghề
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cơ cấu các công ty đối tác tham gia tuyển dụng
              </Typography>
            </Box>
            <Chip
              label="Ngành nghề"
              size="small"
              sx={{ bgcolor: "#fef3c7", color: "#d97706", fontWeight: 700, fontSize: "0.75rem" }}
            />
          </Stack>

          <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {loading ? (
              <CircularProgress size={32} sx={{ color: "#f59e0b" }} />
            ) : stats.industryDistribution && stats.industryDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.industryDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="48%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {stats.industryDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-ind-${index}`}
                        fill={INDUSTRY_COLORS[index % INDUSTRY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      fontWeight: 600,
                    }}
                    formatter={(val, name) => [`${val} doanh nghiệp`, name]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(val) => (
                      <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.82rem" }}>
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có dữ liệu phân bố ngành nghề
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* 4. FEATURE SECTIONS & QUICK ACTIONS */}
      <AdminFeatureSection />
      <AdminQuickActions />
    </Box>
  );
}
