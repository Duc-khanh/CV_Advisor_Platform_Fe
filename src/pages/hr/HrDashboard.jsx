import { useEffect, useState } from "react";
import { Grid, CircularProgress, Box, Typography } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import HRFeatureSection from "../../components/hr/HRFeatureSection";
import HRQuickActions from "../../components/hr/HRQuickActions";
import HRLayout from "../../layouts/HRLayout";
import HrDashboardStats from "../../components/hr/HrDashboardStats";
import api from "../../services/axios";

export default function HrDashboard() {
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [acceptRate, setAcceptRate] = useState("0%");
  const [loading, setLoading] = useState(true);
  const [applicationsByDate, setApplicationsByDate] = useState([]);
  const [topJobs, setTopJobs] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [jobsRes, applicationsRes] = await Promise.all([
          api.get("/api/hr/jobs"),
          api.get("/api/hr/applications"),
        ]);

        const jobs = jobsRes.data || [];
        const applications = applicationsRes.data || [];

        setJobsCount(Array.isArray(jobs) ? jobs.length : 0);
        setApplicationsCount(Array.isArray(applications) ? applications.length : 0);

        const interviewApps = applications.filter((app) => app.status === "INTERVIEW");
        setInterviewCount(interviewApps.length);

        const acceptedApps = applications.filter((app) => app.status === "ACCEPTED");
        const rate = applications.length
          ? Math.round((acceptedApps.length / applications.length) * 100)
          : 0;
        setAcceptRate(`${rate}%`);

        // Calculate Applications by Date
        const dateCounts = {};
        applications.forEach(app => {
          if (app.appliedAt) {
            const date = new Date(app.appliedAt).toLocaleDateString('vi-VN');
            dateCounts[date] = (dateCounts[date] || 0) + 1;
          }
        });
        const dateData = Object.keys(dateCounts).map(date => ({
          date,
          count: dateCounts[date]
        })).sort((a, b) => {
          const partsA = a.date.split('/');
          const partsB = b.date.split('/');
          if (partsA.length === 3 && partsB.length === 3) {
             const [d1, m1, y1] = partsA;
             const [d2, m2, y2] = partsB;
             return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
          }
          return 0;
        });
        setApplicationsByDate(dateData);

        // Calculate Jobs with most candidates
        const jobCounts = {};
        applications.forEach(app => {
          if (app.jobTitle) {
            jobCounts[app.jobTitle] = (jobCounts[app.jobTitle] || 0) + 1;
          }
        });
        const jobData = Object.keys(jobCounts).map(title => ({
          title: title.length > 25 ? title.substring(0, 25) + '...' : title,
          originalTitle: title,
          count: jobCounts[title]
        })).sort((a, b) => b.count - a.count).slice(0, 5); // top 5
        setTopJobs(jobData);
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
          <Box sx={{
            position: "fixed", inset: 0, zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            bgcolor: "rgba(255,255,255,0.6)"
          }}>
            <CircularProgress />
          </Box>
        )}

        {/* 1. Header Section */}
        {/* <Box sx={{ 
          p: { xs: 3, md: 4 }, mb: 4, bgcolor: "#ffffff", borderRadius: 4, 
          border: "1px solid #f1f5f9", boxShadow: "0 12px 40px rgba(15, 23, 42, 0.04)" 
        }}>
          <Typography variant="h4" fontWeight={800} color="text.primary" mb={1}>
            Bảng điều khiển tuyển dụng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng quay trở lại! Dưới đây là tình hình tuyển dụng mới nhất của doanh nghiệp.
          </Typography>
        </Box> */}

        {/* 2. Stats Section (Đưa lên trên biểu đồ) */}
        <Box sx={{ mb: 4 }}>
          <HrDashboardStats
          
            jobsCount={jobsCount}
            applicationsCount={applicationsCount}
            interviewCount={interviewCount}
            acceptRate={acceptRate}
            loading={loading}
          />
        </Box>

        {/* 3. Charts Section */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" }, 
          gap: 3, 
          mb: 4 
        }}>
          <Box sx={{ 
            p: 3, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)", minHeight: 460, width: "100%", boxSizing: "border-box" 
          }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Ứng tuyển theo ngày</Typography>
            <Box sx={{ height: 420, width: "100%" }}>
              <ResponsiveContainer>
                <LineChart data={applicationsByDate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "#e2e8f0" }} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

          <Box sx={{ 
            p: 3, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #f1f5f9",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)", minHeight: 460, width: "100%", boxSizing: "border-box" 
          }}>
            <Typography variant="h6" fontWeight={700} mb={3}>Công việc thu hút nhất</Typography>
            <Box sx={{ height: 420, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={topJobs} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="title" type="category" width={140} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{fill: "#f8fafc"}}
                    contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>

        {/* 4. Feature & Quick Actions */}
        <HRFeatureSection />
        <HRQuickActions />
      </Box>
    </HRLayout>
  );
}
