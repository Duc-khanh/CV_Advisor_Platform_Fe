import React, { useState, useEffect } from "react";
import axios from "axios";
import CareerRoadmap from "./CareerRoadmap";
import { useNavigate } from "react-router-dom";
import { 
  Box, Grid, Typography, Button, Container, TextField, 
  InputAdornment, Stack, Paper, Divider, LinearProgress, 
  IconButton, Avatar, Pagination 
} from "@mui/material";
import { 
  Search, LocationOn, AutoAwesome, FavoriteBorder, Favorite 
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import AIAnalysisCard from "./AIAnalysisCard";
import HeroSection from "./HeroSection";

export default function UserHome() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ keyword: "", location: "" });

  // LOGIC PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const aiData = {
    score: 85,
    strengths: ["Kỹ năng ReactJS tốt", "Kinh nghiệm làm việc nhóm", "Tư duy logic mạnh"],
    weaknesses: ["Thiếu chứng chỉ tiếng Anh", "Ít dự án về Cloud Deploy"],
    missingSkills: ["Docker", "Kubernetes", "AWS Certified", "IELTS 6.5+"]
  };

  /* ===== HÀM LẤY AUTH HEADER (Đồng bộ với JobDetail) ===== */
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  /* ===== FETCH DANH SÁCH CÔNG VIỆC ===== */
  const fetchJobs = async () => {
    setLoading(true);
    const authHeader = getAuthHeader(); 
    try {
      const response = await axios.get("http://localhost:8080/api/public/jobs", {
        params: {
          keyword: searchQuery.keyword,
          location: searchQuery.location
        },
        headers: authHeader || {} // Gửi token để nhận trạng thái isFavorite từ server
      });
      setJobs(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách công việc:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  /* ===== LOGIC TOGGLE FAVORITE (Đồng bộ với JobDetail) ===== */
  const handleToggleFavorite = async (e, jobId, currentFavoriteStatus) => {
    e.stopPropagation(); // Ngăn sự kiện click Paper chuyển sang trang chi tiết
    
    const authHeader = getAuthHeader();
    if (!authHeader) {
      alert("Vui lòng đăng nhập để thực hiện chức năng này");
      navigate("/login");
      return;
    }

    try {
      // Gọi đúng API endpoint mà JobDetail đang sử dụng
      await axios.post(
        `http://localhost:8080/api/user/jobs/favorite/${jobId}`,
        null,
        { headers: authHeader }
      );

      // Cập nhật state jobs cục bộ để giao diện thay đổi ngay lập tức
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.jobId === jobId ? { ...job, isFavorite: !currentFavoriteStatus } : job
        )
      );
    } catch (err) {
      console.error("Lỗi toggle favorite:", err);
      alert("Không thể thực hiện thao tác");
    }
  };

  // Logic phân trang
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const section = document.getElementById('job-list-section');
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <UserLayout>
      {/* 1. HERO SECTION */}
     <HeroSection 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearch={handleSearch} 
      />

      {/* 2. AI ANALYSIS SECTION */}
      <Container maxWidth={false} sx={{ mt: -10, mb: 12, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
        <AIAnalysisCard {...aiData} />
      </Container>

      {/* 3. DANH SÁCH VIỆC LÀM */}
      <Container id="job-list-section" maxWidth={false} sx={{ mb: 15, px: { xs: 4, md: 10 } }}>
        <Typography variant="h3" fontWeight="900" textAlign="center" sx={{ mb: 6, color: '#1e293b' }}>
          Cơ hội dành riêng cho bạn
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
          {currentJobs.map((job) => (
            <Paper
              key={job.jobId}
              onClick={() => navigate(`/user/job/${job.jobId}`)}
              sx={{
                width: '7cm', minWidth: '7cm', maxWidth: '7cm',
                p: 2.5, borderRadius: 4, cursor: "pointer",
                border: "1px solid #e5e7eb", transition: "all 0.25s ease",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                "&:hover": { borderColor: "#6366f1", transform: "translateY(-5px)", boxShadow: "0 10px 25px rgba(99, 102, 241, 0.1)" }
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {job.companyLogo ? (
                  <Avatar src={job.companyLogo} variant="rounded" sx={{ width: 50, height: 50 }} />
                ) : (
                  <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 800 }}>
                    {job.companyName?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography fontWeight={700} sx={{ fontSize: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.6em" }}>
                    {job.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block", textTransform: "uppercase" }}>{job.companyName}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" alignItems="center" justifyContent="space-between" mt={3}>
                <Stack direction="row" spacing={1}>
                  <Box sx={{ bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5 }}>
                    <Typography variant="caption" fontWeight="700">{job.salaryRange || "Thỏa thuận"}</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5 }}>
                    <Typography variant="caption" fontWeight="700">{job.location?.split(',').pop()}</Typography>
                  </Box>
                </Stack>

                <IconButton
                  size="small"
                  onClick={(e) => handleToggleFavorite(e, job.jobId, job.isFavorite)}
                  sx={{
                    border: "1px solid #f1f5f9",
                    color: job.isFavorite ? "#ef4444" : "#94a3b8",
                    bgcolor: job.isFavorite ? "#fee2e2" : "transparent",
                    "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                  }}
                >
                  {job.isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                </IconButton>
              </Stack>
            </Paper>
          ))}
        </Box>

        {/* PHÂN TRANG */}
        <Stack alignItems="center" sx={{ mt: 8 }}>
          <Pagination 
            count={Math.ceil(jobs.length / jobsPerPage)} 
            page={currentPage} 
            onChange={handlePageChange} 
            color="primary"
            sx={{ '& .Mui-selected': { bgcolor: '#6366f1 !important' } }}
          />
        </Stack>
      </Container>

      {/* 4. LỘ TRÌNH PHÁT TRIỂN */}
<CareerRoadmap />
    </UserLayout>
  );
}