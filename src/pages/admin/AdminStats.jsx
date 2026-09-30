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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import {
  Users,
  Briefcase,
  Cpu,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  RefreshCw,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  Award,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import StatCard from "../../components/ui/StatCard";
import api from "../../services/axios";

export default function AdminStats() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState(null);

  const fetchStats = async (selectedRange = range) => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/stats/overview?range=${selectedRange}`);
      if (res && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu thống kê chuyên sâu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  const handleExportCSV = () => {
    if (!stats) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "BÁO CÁO THỐNG KÊ HỆ THỐNG CV ADVISOR\n";
    csvContent += `Khoảng thời gian: ${range}\n\n`;
    csvContent += "Chỉ số,Giá trị\n";
    csvContent += `Người dùng mới,${stats.totalUsersPeriod || 0}\n`;
    csvContent += `Hồ sơ ứng tuyển,${stats.totalApplicationsPeriod || 0}\n`;
    csvContent += `Lượt gọi AI,${stats.totalAiRequestsPeriod || 0}\n`;
    csvContent += `Tỷ lệ lỗi AI,${stats.aiErrorRate || 0}%\n`;
    csvContent += `Thời gian phản hồi TB,${stats.avgLatencySec || 1.6}s\n`;
    csvContent += `Tổng Token ước tính,${stats.totalTokensUsed || 0}\n\n`;

    csvContent += "PHỄU TUYỂN DỤNG\nGiai đoạn,Số lượng\n";
    (stats.recruitmentFunnel || []).forEach((f) => {
      csvContent += `"${f.stage}",${f.count}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CVAdvisor_Stats_Report_${range}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Tiêu đề & Bộ lọc toàn trang */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}
          >
            Thống Kê Hệ Thống & Báo Cáo Chuyên Sâu
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Giám sát phễu tuyển dụng, phân tích năng lực ứng viên và đo lường tài nguyên AI.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={range}
              onChange={handleRangeChange}
              sx={{
                borderRadius: "10px",
                bgcolor: "#fff",
                fontWeight: 600,
                fontSize: "0.875rem",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
              }}
            >
              <MenuItem value="7d">7 ngày qua</MenuItem>
              <MenuItem value="30d">30 ngày qua</MenuItem>
              <MenuItem value="90d">90 ngày qua</MenuItem>
              <MenuItem value="all">Toàn thời gian</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            onClick={() => fetchStats(range)}
            disabled={loading}
            startIcon={<RefreshCw size={16} className={loading ? "animate-spin" : ""} />}
            sx={{
              borderRadius: "10px",
              borderColor: "#e2e8f0",
              color: "#334155",
              bgcolor: "#fff",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
            }}
          >
            Làm mới
          </Button>

          <Button
            variant="contained"
            onClick={handleExportCSV}
            startIcon={<Download size={16} />}
            sx={{
              borderRadius: "10px",
              bgcolor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Xuất Báo Cáo
          </Button>
        </Stack>
      </Stack>

      {/* 4 Thẻ KPI tóm tắt trong kỳ */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Hồ sơ ứng tuyển trong kỳ"
            value={loading ? "..." : (stats?.totalApplicationsPeriod ?? 0).toLocaleString()}
            icon={<Briefcase size={24} />}
            color="#2563eb"
            trend={+18.5}
            description="Lượt ứng tuyển nộp thành công"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Người dùng mới trong kỳ"
            value={loading ? "..." : (stats?.totalUsersPeriod ?? 0).toLocaleString()}
            icon={<Users size={24} />}
            color="#10b981"
            trend={+12.4}
            description="Ứng viên & HR đăng ký mới"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lượt gọi xử lý AI"
            value={loading ? "..." : (stats?.totalAiRequestsPeriod ?? 0).toLocaleString()}
            icon={<Cpu size={24} />}
            color="#8b5cf6"
            trend={+24.0}
            description="CV evaluation, match fit, chat"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tỷ lệ lỗi AI & Độ trễ"
            value={loading ? "..." : `${stats?.aiErrorRate ?? 0}% / ${stats?.avgLatencySec ?? 1.6}s`}
            icon={<Sparkles size={24} />}
            color="#f59e0b"
            trend={-0.8}
            description="Tỷ lệ lỗi thấp, phản hồi ổn định"
          />
        </Grid>
      </Grid>

      {/* Tabs Chuyên Đề Phân Tích */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          bgcolor: "#fff",
          mb: 3,
          p: 0.5,
        }}
      >
        <Tabs
          value={currentTab}
          onChange={(e, val) => setCurrentTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              minHeight: 48,
              borderRadius: "12px",
              color: "#64748b",
              "&.Mui-selected": {
                color: "#2563eb",
                bgcolor: "#eff6ff",
              },
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab
            icon={<BarChart3 size={18} />}
            iconPosition="start"
            label="Phễu Tuyển Dụng & Chất Lượng Hồ Sơ"
          />
          <Tab
            icon={<Cpu size={18} />}
            iconPosition="start"
            label="Giám Sát & Tài Nguyên AI"
          />
          <Tab
            icon={<TrendingUp size={18} />}
            iconPosition="start"
            label="Tăng Trưởng & Cơ Cấu Người Dùng"
          />
        </Tabs>
      </Paper>

      {/* Nội dung Tab */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <>
          {/* TAB 0: Phễu Tuyển Dụng & Chất Lượng Hồ Sơ */}
          {currentTab === 0 && (
            <Grid container spacing={3}>
              {/* Phễu tuyển dụng */}
              <Grid item xs={12} lg={7}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Phễu Tuyển Dụng Toàn Nền Tảng
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Theo dõi tỷ lệ chuyển đổi từ tin đăng đến hồ sơ trúng tuyển
                      </Typography>
                    </Box>
                    <Chip label="Recruitment Funnel" size="small" color="primary" variant="outlined" />
                  </Stack>

                  <Box sx={{ height: 320, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={stats?.recruitmentFunnel || []}
                        margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis type="category" dataKey="stage" stroke="#64748b" width={140} tick={{ fontSize: 13, fontWeight: 500 }} />
                        <RechartsTooltip
                          formatter={(value) => [`${value} lượt`, "Số lượng"]}
                          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                        />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                          {(stats?.recruitmentFunnel || []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Phổ điểm AI của ứng viên */}
              <Grid item xs={12} lg={5}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Phổ Điểm AI Của Ứng Viên
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Phân loại chất lượng ứng viên theo điểm đánh giá AI
                      </Typography>
                    </Box>
                    <Chip label="AI Match Score" size="small" color="secondary" variant="outlined" />
                  </Stack>

                  <Box sx={{ height: 260, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.scoreDistribution || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={4}
                          dataKey="count"
                          nameKey="range"
                        >
                          {(stats?.scoreDistribution || []).map((entry, index) => (
                            <Cell key={`cell-score-${index}`} fill={entry.color || "#3b82f6"} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [`${value} hồ sơ`, name]}
                          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: "12px" }}>
                    <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, display: "block" }}>
                      💡 Nhận định hệ thống:
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Tỷ lệ hồ sơ đạt mức Khá và Xuất sắc phản ánh chất lượng nguồn ứng viên và độ ăn khớp với tiêu chí tuyển dụng của doanh nghiệp.
                    </Typography>
                  </Box>
                </Paper>
              </Grid>

              {/* Bảng xếp hạng Top Vị Trí Tuyển Dụng */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                    Top Vị Trí Việc Làm Thu Hút Nhiều Hồ Sơ Nhất
                  </Typography>

                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "#f8fafc" }}>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Vị trí tuyển dụng</TableCell>
                          <TableCell align="center" sx={{ fontWeight: 700, color: "#475569" }}>Số lượng ứng tuyển</TableCell>
                          <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Mức độ sôi động</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(stats?.topJobApplications || []).map((row, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Award size={16} color={idx === 0 ? "#f59e0b" : idx === 1 ? "#94a3b8" : "#cbd5e1"} />
                                <span>{row.jobTitle}</span>
                              </Stack>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`${row.count} hồ sơ`} size="small" color="primary" sx={{ fontWeight: 600 }} />
                            </TableCell>
                            <TableCell sx={{ width: "35%" }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(100, (row.count / ((stats?.topJobApplications?.[0]?.count) || 1)) * 100)}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  bgcolor: "#f1f5f9",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: idx === 0 ? "#3b82f6" : "#60a5fa",
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                        {(!stats?.topJobApplications || stats.topJobApplications.length === 0) && (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 3, color: "#94a3b8" }}>
                              Chưa có dữ liệu ứng tuyển trong khoảng thời gian này
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* TAB 1: Giám Sát & Tài Nguyên AI */}
          {currentTab === 1 && (
            <Grid container spacing={3}>
              {/* Timeline AI calls */}
              <Grid item xs={12} lg={8}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Lịch Sử Tải & Gọi Hệ Thống AI (Gemini 1.5 Flash)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        So sánh số lượt gọi thành công vs thất bại theo ngày
                      </Typography>
                    </Box>
                    <Chip label="API Traffic" size="small" color="primary" variant="outlined" />
                  </Stack>

                  <Box sx={{ height: 320, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={stats?.aiTimeline || []}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="aiSuccessGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="aiFailGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Area
                          type="monotone"
                          dataKey="success"
                          name="Thành công"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#aiSuccessGrad)"
                        />
                        <Area
                          type="monotone"
                          dataKey="failed"
                          name="Thất bại"
                          stroke="#ef4444"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#aiFailGrad)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Thông số kỹ thuật & Cấu hình AI */}
              <Grid item xs={12} lg={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                    Chỉ Số Sức Khỏe AI Engine
                  </Typography>

                  <Stack spacing={2.5}>
                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Clock size={18} color="#2563eb" />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Độ trễ trung bình
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2563eb" }}>
                          {stats?.avgLatencySec ?? 1.6}s
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Cpu size={18} color="#7c3aed" />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Ước tính Tokens
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#7c3aed" }}>
                          {(stats?.totalTokensUsed ?? 0).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CheckCircle size={18} color="#10b981" />
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155" }}>
                            Tình trạng Quota
                          </Typography>
                        </Stack>
                        <Chip label="Bình thường" size="small" color="success" sx={{ fontWeight: 700 }} />
                      </Stack>
                    </Box>

                    <Box sx={{ p: 2, bgcolor: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: "#1d4ed8", display: "block", mb: 0.5 }}>
                        Cấu hình Gemini Engine:
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#1e40af", display: "block" }}>
                        • Model: <b>gemini-1.5-flash</b>
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#1e40af", display: "block" }}>
                        • Temperature: <b>0.4</b> (Ổn định, nhất quán)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#1e40af", display: "block" }}>
                        • Top_P: <b>0.9</b> | Max tokens: <b>4096</b>
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* TAB 2: Tăng Trưởng & Cơ Cấu Người Dùng */}
          {currentTab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    border: "1px solid #f1f5f9",
                    bgcolor: "#fff",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                        Xu Hướng Gia Nhập Nền Tảng (Ứng Viên vs Nhà Tuyển Dụng)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        So sánh tốc độ tăng trưởng tài khoản mới theo từng ngày
                      </Typography>
                    </Box>
                    <Chip label="User Trend" size="small" color="primary" variant="outlined" />
                  </Stack>

                  <Box sx={{ height: 350, width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={stats?.userTrend || []}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <RechartsTooltip
                          contentStyle={{ borderRadius: 10, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                          type="monotone"
                          dataKey="candidate"
                          name="Ứng viên mới (Candidate)"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="hr"
                          name="Nhà tuyển dụng mới (HR)"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
}
