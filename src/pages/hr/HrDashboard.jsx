import { useEffect, useState } from "react";
import { Grid, CircularProgress, Box, Typography } from "@mui/material";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import HRFeatureSection from "./HRFeatureSection";
import HRQuickActions from "./HRQuickActions";
import HRLayout from "../../components/HRLayout";
import HrDashboardStats from "./HrDashboardStats";
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
        <Box sx={{ 
          p: { xs: 3, md: 4 }, mb: 4, bgcolor: "#ffffff", borderRadius: 4, 
          border: "1px solid #f1f5f9", boxShadow: "0 12px 40px rgba(15, 23, 42, 0.04)" 
        }}>
          <Typography variant="h4" fontWeight={800} color="text.primary" mb={1}>
            Bảng điều khiển tuyển dụng
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Chào mừng quay trở lại! Dưới đây là tình hình tuyển dụng mới nhất của doanh nghiệp.
          </Typography>
        </Box>

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
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)", minHeight: 420 
            }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Ứng tuyển theo ngày</Typography>
              <Box sx={{ height: 340, width: "100%" }}>
                <ResponsiveContainer>
                  <LineChart data={applicationsByDate}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ 
              p: 3, bgcolor: "#ffffff", borderRadius: 4, border: "1px solid #f1f5f9",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)", minHeight: 420 
            }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Công việc thu hút nhất</Typography>
              <Box sx={{ height: 340, width: "100%" }}>
                <ResponsiveContainer>
                  <BarChart data={topJobs} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="title" type="category" width={120} tick={{ fontSize: 11 }} />
                    <RechartsTooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* 4. Feature & Quick Actions */}
        <HRFeatureSection />
        <HRQuickActions />
      </Box>
    </HRLayout>
  );
}
