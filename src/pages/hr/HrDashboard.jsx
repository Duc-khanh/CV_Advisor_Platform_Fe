import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Paper,
  Chip
} from "@mui/material";
import {
  AreaChart, Area,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import HRFeatureSection from "../../components/hr/HRFeatureSection";
import HRQuickActions from "../../components/hr/HRQuickActions";
import HRLayout from "../../layouts/HRLayout";
import HrDashboardStats from "../../components/hr/HrDashboardStats";
import api from "../../services/axios";

// Bảng màu cho biểu đồ tròn Phù hợp AI
const FIT_COLORS = {
  "Rất phù hợp (≥80%)": "#10b981", // Xanh lá
  "Phù hợp (60-79%)": "#3b82f6",   // Xanh dương
  "Ít phù hợp (<60%)": "#f59e0b",   // Vàng cam
  "Chưa đánh giá": "#94a3b8"       // Xám
};

// Bảng màu cho biểu đồ tròn Trạng thái tuyển dụng
const STATUS_COLORS = {
  "Chờ xử lý": "#64748b",
  "Phỏng vấn": "#0284c7",
  "Đã tuyển": "#16a34a",
  "Từ chối": "#ef4444",
  "Đang xem xét": "#8b5cf6"
};

const BAR_COLORS = ["#0ea5e9", "#2563eb", "#0284c7", "#3b82f6", "#6366f1"];

export default function HrDashboard() {
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [acceptRate, setAcceptRate] = useState("0%");
  const [loading, setLoading] = useState(true);

  // Dữ liệu các biểu đồ
  const [applicationsByDate, setApplicationsByDate] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [fitDistribution, setFitDistribution] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [jobsRes, applicationsRes] = await Promise.all([
          api.get("/api/hr/jobs"),
          api.get("/api/hr/applications?size=1000"),
        ]);

        const jobs = Array.isArray(jobsRes.data)
          ? jobsRes.data
          : (jobsRes.data?.content || []);

        const appRaw = applicationsRes.data;
        let applications = [];
        if (Array.isArray(appRaw)) {
          applications = appRaw;
        } else if (Array.isArray(appRaw?.content)) {
          applications = appRaw.content;
        } else if (Array.isArray(appRaw?.data)) {
          applications = appRaw.data;
        }

        const totalApplications = appRaw?.totalElements != null
          ? appRaw.totalElements
          : applications.length;

        setJobsCount(jobs.length);
        setApplicationsCount(totalApplications);

        const interviewApps = applications.filter((app) => app.status === "INTERVIEW");
        setInterviewCount(interviewApps.length);

        const acceptedApps = applications.filter((app) => app.status === "ACCEPTED");
        const rate = totalApplications
          ? Math.round((acceptedApps.length / totalApplications) * 100)
          : 0;
        setAcceptRate(`${rate}%`);

        // 1. Biểu đồ miền: Ứng tuyển theo ngày (AreaChart)
        const dateCounts = {};
        applications.forEach((app) => {
          if (app.appliedAt) {
            const date = new Date(app.appliedAt).toLocaleDateString("vi-VN");
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          }
        });
        const dateData = Object.keys(dateCounts)
          .map((date) => ({
            date,
            count: dateCounts[date],
          }))
          .sort((a, b) => {
            const partsA = a.date.split("/");
            const partsB = b.date.split("/");
            if (partsA.length === 3 && partsB.length === 3) {
              const dA = new Date(Number(partsA[2]), Number(partsA[1]) - 1, Number(partsA[0]));
              const dB = new Date(Number(partsB[2]), Number(partsB[1]) - 1, Number(partsB[0]));
              return dA - dB;
            }
            return 0;
          });
        setApplicationsByDate(dateData);

        // 2. Biểu đồ cột: Công việc thu hút nhất (BarChart)
        const jobCounts = {};
        applications.forEach((app) => {
          const title = app.jobTitle || "Khác";
          jobCounts[title] = (jobCounts[title] || 0) + 1;
        });
        const jobData = Object.keys(jobCounts)
          .map((title) => ({
            title: title.length > 22 ? title.substring(0, 22) + "..." : title,
            originalTitle: title,
            count: jobCounts[title],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        setTopJobs(jobData);

        // 3. Biểu đồ tròn: Phân bố độ phù hợp AI (Donut PieChart)
        let highFit = 0;
        let medFit = 0;
        let lowFit = 0;
        let unrated = 0;

        applications.forEach((app) => {
          const score = app.aiFit?.score;
          if (score == null) {
            unrated++;
          } else if (score >= 80) {
            highFit++;
          } else if (score >= 60) {
            medFit++;
          } else {
            lowFit++;
          }
        });

        const fitData = [
          { name: "Rất phù hợp (≥80%)", value: highFit, color: FIT_COLORS["Rất phù hợp (≥80%)"] },
          { name: "Phù hợp (60-79%)", value: medFit, color: FIT_COLORS["Phù hợp (60-79%)"] },
          { name: "Ít phù hợp (<60%)", value: lowFit, color: FIT_COLORS["Ít phù hợp (<60%)"] },
          { name: "Chưa đánh giá", value: unrated, color: FIT_COLORS["Chưa đánh giá"] },
        ].filter((item) => item.value > 0);
        setFitDistribution(fitData);

        // 4. Biểu đồ tròn: Phân bổ trạng thái hồ sơ (Donut PieChart)
        const statusMap = {
          PENDING: { name: "Chờ xử lý", count: 0, color: STATUS_COLORS["Chờ xử lý"] },
          INTERVIEW: { name: "Phỏng vấn", count: 0, color: STATUS_COLORS["Phỏng vấn"] },
          ACCEPTED: { name: "Đã tuyển", count: 0, color: STATUS_COLORS["Đã tuyển"] },
          REJECTED: { name: "Từ chối", count: 0, color: STATUS_COLORS["Từ chối"] },
          REVIEWING: { name: "Đang xem xét", count: 0, color: STATUS_COLORS["Đang xem xét"] },
          REVIEWED: { name: "Đang xem xét", count: 0, color: STATUS_COLORS["Đang xem xét"] },
        };

        applications.forEach((app) => {
          const st = (app.status || "PENDING").toUpperCase();
          if (statusMap[st]) {
            statusMap[st].count++;
          } else {
            statusMap.PENDING.count++;
          }
        });

        const statusData = Object.values(statusMap)
          .filter((item, index, self) => item.count > 0 && self.findIndex(t => t.name === item.name) === index)
          .map((item) => ({
            name: item.name,
            value: item.count,
            color: item.color,
          }));
        setStatusDistribution(statusData);

      } catch (err) {
        console.error("Không thể tải thống kê HR dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <HRLayout>
      <Box sx={{ position: "relative", pb: 5 }}>
        {/* Loading Overlay */}
        {loading && (
          <Box
            sx={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(255,255,255,0.6)",
            }}
          >
            <CircularProgress sx={{ color: "#0ea5e9" }} />
          </Box>
        )}

        {/* 1. Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} color="#1e293b">
            Thống kê tổng quan
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Báo cáo phân tích thời gian thực về dữ liệu ứng viên, hiệu suất tuyển dụng và đánh giá AI
          </Typography>
        </Box>

        {/* 2. Stats Section (4 KPI Cards) */}
        <Box sx={{ mb: 4 }}>
          <HrDashboardStats
            jobsCount={jobsCount}
            applicationsCount={applicationsCount}
            interviewCount={interviewCount}
            acceptRate={acceptRate}
            loading={loading}
          />
        </Box>

        {/* 3. CHARTS GRID (2 HÀNG x 2 CỘT HIỆN ĐẠI) */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" },
            gap: 3,
            mb: 4,
          }}
        >
          {/* BIỂU ĐỒ 1: BIỂU ĐỒ MIỀN (AREA CHART) - XU HƯỚNG ỨNG TUYỂN THEO THỜI GIAN */}
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
                  Xu hướng ứng tuyển
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Số lượng hồ sơ nộp theo từng mốc ngày
                </Typography>
              </Box>
              
            </Stack>

            <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {applicationsByDate.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationsByDate} margin={{ top: 10, right: 25, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
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
                      formatter={(val) => [`${val} hồ sơ`, "Số lượng ứng tuyển"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#2563eb"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#areaGradient)"
                      activeDot={{ r: 7, stroke: "#ffffff", strokeWidth: 2, fill: "#2563eb" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu ứng tuyển theo ngày
                </Typography>
              )}
            </Box>
          </Paper>

          {/* BIỂU ĐỒ 2: BIỂU ĐỒ TRÒN DẠNG DONUT (PIE CHART) - PHÂN BỐ ĐỘ PHÙ HỢP AI */}
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
                  Phân bố độ phù hợp AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tỷ lệ đánh giá mức độ tương thích của ứng viên
                </Typography>
              </Box>
              <Chip label="Đánh giá AI" size="small" sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700, fontSize: "0.75rem" }} />
            </Stack>

            <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {fitDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={fitDistribution}
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
                      {fitDistribution.map((entry, index) => (
                        <Cell key={`cell-fit-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        fontWeight: 600,
                      }}
                      formatter={(val, name) => [`${val} ứng viên`, name]}
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
                  Chưa có dữ liệu đánh giá độ phù hợp AI
                </Typography>
              )}
            </Box>
          </Paper>

          {/* BIỂU ĐỒ 3: BIỂU ĐỒ CỘT (BAR CHART) - CÔNG VIỆC THU HÚT NHẤT */}
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
                  Công việc thu hút nhất
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Top các vị trí nhận được nhiều hồ sơ ứng tuyển
                </Typography>
              </Box>
              <Chip label="Top vị trí" size="small" sx={{ bgcolor: "#f0fdf4", color: "#16a34a", fontWeight: 700, fontSize: "0.75rem" }} />
            </Stack>

            <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {topJobs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topJobs} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                    <YAxis
                      dataKey="title"
                      type="category"
                      width={140}
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
                      formatter={(val, name, item) => [`${val} ứng viên`, item.payload.originalTitle || "Vị trí"]}
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={26}>
                      {topJobs.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Chưa có dữ liệu công việc thu hút
                </Typography>
              )}
            </Box>
          </Paper>

          {/* BIỂU ĐỒ 4: BIỂU ĐỒ TRÒN DẠNG DONUT (PIE CHART) - PHÂN BỔ TRẠNG THÁI TUYỂN DỤNG */}
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
                  Trạng thái quy trình tuyển dụng
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tỷ lệ chuyển đổi hồ sơ trong phễu tuyển dụng
                </Typography>
              </Box>
              <Chip label="Phễu tuyển dụng" size="small" sx={{ bgcolor: "#faf5ff", color: "#9333ea", fontWeight: 700, fontSize: "0.75rem" }} />
            </Stack>

            <Box sx={{ height: 350, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {statusDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
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
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-status-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                        fontWeight: 600,
                      }}
                      formatter={(val, name) => [`${val} hồ sơ`, name]}
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
                  Chưa có dữ liệu trạng thái tuyển dụng
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>

        {/* 4. Feature & Quick Actions */}
        <HRFeatureSection />
        <HRQuickActions />
      </Box>
    </HRLayout>
  );
}
