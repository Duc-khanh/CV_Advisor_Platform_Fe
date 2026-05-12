  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import CareerRoadmap from "./CareerRoadmap";
  import { useNavigate } from "react-router-dom";
  import { 
    Box, Grid, Typography, Button, Container, 
    Stack, Paper, IconButton, Avatar, Pagination, Chip, Divider
  } from "@mui/material";
  import { 
    FavoriteBorder, Favorite, Code, Brush, Campaign, 
    AccountBalance, Work, ArrowForward, CheckCircle
  } from "@mui/icons-material";
  import UserLayout from "../../components/UserLayout";
  import LastCvAnalysisSection from "./LastCvAnalysisSection";
  import HeroSection from "./HeroSection";
  import { migrateLegacyStorage } from "../../services/cvAnalysisStorage";
  import { useToast } from "../../contexts/ToastContext";

  export default function UserHome() {
    const navigate = useNavigate();
    const showToast = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ keyword: "", location: "" });
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  // Migration: xoá key cũ `lastCvAnalysis` và chuyển sang key theo userId
  useEffect(() => { migrateLegacyStorage(); }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFavoriteIds = async (authHeader) => {
    if (!authHeader) return new Set();
    try {
      const res = await axios.get("http://localhost:8080/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      return new Set(res.data.map((job) => job.jobId));
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
      return new Set();
    }
  };

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 12;
    const handleViewAll = () => {
    // Đặt lại trang hiện tại về 1
    setCurrentPage(1);
    // Cập nhật số lượng công việc trên 1 trang bằng tổng số công việc
    // Bạn có thể dùng một con số rất lớn hoặc chính xác là jobs.length
    const totalJobs = jobs.length;
    
    // Nếu bạn muốn hiển thị toàn bộ trên một danh sách dài:
    // Bạn cần sửa lại biến jobsPerPage thành một state hoặc đơn giản là logic dưới đây
  };

    /* ===== FETCH DANH SÁCH CÔNG VIỆC ===== */
    const fetchJobs = async () => {
      setLoading(true);
      const authHeader = getAuthHeader();
      const favoriteIdsFromServer = await fetchFavoriteIds(authHeader);
      try {
        const response = await axios.get("http://localhost:8080/api/public/jobs", {
          params: {
            keyword: searchQuery.keyword,
            location: searchQuery.location,
          },
          headers: authHeader || {},
        });
        const jobsWithFavorite = response.data.map((job) => ({
          ...job,
          isFavorite: favoriteIdsFromServer.has(job.jobId),
        }));
        setJobs(jobsWithFavorite);
        setFavoriteIds(favoriteIdsFromServer);
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


    /* ===== LOGIC TOGGLE FAVORITE ===== */
    const handleToggleFavorite = async (e, jobId, currentFavoriteStatus) => {
      e.stopPropagation();
      
      const authHeader = getAuthHeader();
      if (!authHeader) {
        showToast("Vui lòng đăng nhập để thực hiện chức năng này", "warning");
        navigate("/login");
        return;
      }

      if (currentFavoriteStatus) {
        // === BỎ YÊU THÍCH ===
        try {
          await axios.delete(
            `http://localhost:8080/api/user/jobs/favorite/${jobId}`,
            { headers: authHeader }
          );
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.jobId === jobId ? { ...job, isFavorite: false } : job
            )
          );
          setFavoriteIds((prevIds) => {
            const nextIds = new Set(prevIds);
            nextIds.delete(jobId);
            return nextIds;
          });
          showToast("Đã bỏ khỏi danh sách yêu thích", "info");
        } catch (err) {
          console.error("Lỗi bỏ yêu thích:", err);
          showToast("Không thể thực hiện thao tác", "error");
        }
      } else {
        // === THÊM YÊU THÍCH ===
        try {
          await axios.post(
            `http://localhost:8080/api/user/jobs/favorite/add/${jobId}`,
            null,
            { headers: authHeader }
          );
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job.jobId === jobId ? { ...job, isFavorite: true } : job
            )
          );
          setFavoriteIds((prevIds) => {
            const nextIds = new Set(prevIds);
            nextIds.add(jobId);
            return nextIds;
          });
          showToast("Đã thêm vào danh sách yêu thích! ❤️", "success");
        } catch (err) {
          if (err.response?.status === 409) {
            showToast("Công việc đã có trong danh sách việc làm yêu thích", "warning");
          } else {
            console.error("Lỗi thêm yêu thích:", err);
            showToast("Không thể thực hiện thao tác", "error");
          }
        }
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

    const jobCategories = [
      { title: "Công nghệ thông tin", icon: <Code fontSize="large" />, count: "1,200+" },
      { title: "Thiết kế & Nghệ thuật", icon: <Brush fontSize="large" />, count: "450+" },
      { title: "Marketing & PR", icon: <Campaign fontSize="large" />, count: "800+" },
      { title: "Tài chính & Ngân hàng", icon: <AccountBalance fontSize="large" />, count: "600+" },
    ];

    return (
      <UserLayout>
        {/* 1. HERO SECTION */}
        <HeroSection 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onSearch={handleSearch} 
        />

        {/* 2. AI ANALYSIS SECTION */}
        <LastCvAnalysisSection />

        {/* NEW SECTION: JOB CATEGORIES */}
        <Box sx={{ py: 8, bgcolor: '#ffffff' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="800" textAlign="center" sx={{ mb: 2, color: '#0f172a' }}>
              Khám Phá Ngành Nghề Nổi Bật
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ mb: 6, color: '#64748b' }}>
              Tìm kiếm cơ hội nghề nghiệp trong các lĩnh vực hàng đầu
            </Typography>
            
            <Grid container spacing={3}>
              {jobCategories.map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 4,
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#4f46e5',
                        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.15)',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <Box sx={{ color: '#4f46e5', mb: 2 }}>{category.icon}</Box>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {category.count} việc làm
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 3. DANH SÁCH VIỆC LÀM - REDESIGNED */}
        <Box id="job-list-section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
          <Container maxWidth="xl">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
              <Box>
                <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: '#0f172a' }}>
                  Cơ hội dành riêng cho bạn
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Được AI đề xuất dựa trên kỹ năng và mục tiêu của bạn
                </Typography>
              </Box>
              <Button 
  onClick={() => {
    setCurrentPage(1);
    // Cách nhanh nhất: Đặt jobsPerPage thành tổng số lượng jobs
    // Nhưng vì jobsPerPage là hằng số, ta sẽ dùng cách thay đổi logic hiển thị
    setSearchQuery(prev => ({ ...prev })); // Trigger re-render nếu cần
    
    // Để đơn giản, ta sẽ dùng một cờ (flag) hoặc tăng count lên rất lớn
    window.showAllJobs = true; // Một mẹo nhanh hoặc dùng State
    fetchJobs(); // Gọi lại fetch để đảm bảo data mới nhất và bỏ phân trang
  }}
  endIcon={<ArrowForward />} 
  sx={{ color: '#4f46e5', fontWeight: 600, display: { xs: 'none', sm: 'flex' } }}
>
  Xem tất cả
</Button>
            </Box>

<Grid container spacing={3} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' } }}>
            {currentJobs.map((job) => (
              <Box key={job.jobId}>
                <Paper
                  onClick={() => navigate(`/user/job/${job.jobId}`)}
                  elevation={0}
                  sx={{
                    height: '100%',          // ← tất cả card cùng chiều cao trong hàng
                    minHeight: '160px',      // ← cố định chiều cao tối thiểu để các ô đều nhau
                    width: '100%',           // ← đảm bảo chiều rộng lấp đầy container
                    p: 2.5,
                    borderRadius: 4,
                    cursor: "pointer",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: 'border-box',  // ← đảm bảo padding không làm lệch width
                    bgcolor: '#ffffff',
                    "&:hover": {
                      borderColor: "#4f46e5",
                      transform: "translateY(-5px)",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)"
                    }
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                    {job.companyLogo ? (
                      <Avatar
                        src={job.companyLogo}
                        variant="rounded"
                        sx={{ width: 48, height: 48, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{ width: 48, height: 48, flexShrink: 0, bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 800 }}
                      >
                        {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
                      </Avatar>
                    )}

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      {/* Tiêu đề: tối đa 2 dòng, overflow ẩn */}
                      <Typography
                        fontWeight={700}
                        title={job.title}
                        sx={{
                          fontSize: "0.95rem",
                          lineHeight: 1.4,
                          height: "2.8rem",      
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          color: '#1e293b',
                          wordBreak: 'break-word' 
                        }}
                      >
                        {job.title}
                      </Typography>

                      {/* Tên công ty: 1 dòng, cắt bằng ellipsis */}
                      <Typography
                        variant="body2"
                        title={job.companyName}
                        sx={{
                          mt: 0.5,
                          color: "#64748b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block"
                        }}
                      >
                        {job.companyName || "\u00A0"}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Chip tags */}
                  <Box sx={{ mb: 2, overflow: 'hidden' }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        overflowX: 'auto',
                        flexWrap: 'nowrap',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' }
                      }}
                    >
                      <Chip
                        label={job.location ? job.location.split(',').pop().trim() : "Toàn quốc"}
                        size="small"
                        sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0 }}
                      />
                      <Chip
                        label={job.jobType || "Toàn thời gian"}
                        size="small"
                        sx={{ bgcolor: '#f1f5f9', color: '#475569', fontWeight: 500, borderRadius: 2, flexShrink: 0 }}
                      />
                    </Stack>
                  </Box>

                  {/* Lương + Favorite – luôn ở cuối card */}
                  <Box sx={{ mt: 'auto' }}>
                    <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        fontWeight="800"
                        sx={{
                          color: '#10b981',
                          fontSize: '0.95rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 'calc(100% - 44px)' // nhường chỗ cho nút icon
                        }}
                      >
                        {job.salaryRange || "Thỏa thuận"}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => handleToggleFavorite(e, job.jobId, job.isFavorite)}
                        sx={{
                          flexShrink: 0,
                          border: "1px solid #e2e8f0",
                          color: job.isFavorite ? "#ef4444" : "#94a3b8",
                          bgcolor: job.isFavorite ? "#fef2f2" : "transparent",
                          "&:hover": { bgcolor: "#fee2e2", color: "#ef4444", borderColor: '#fca5a5' },
                        }}
                      >
                        {job.isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            ))}
          </Grid>

            {/* PHÂN TRANG */}
            <Stack alignItems="center" sx={{ mt: 8 }}>
              <Pagination 
                count={Math.ceil(jobs.length / jobsPerPage)} 
                page={currentPage} 
                onChange={handlePageChange} 
                color="primary"
                size="large"
                sx={{ '& .Mui-selected': { bgcolor: '#4f46e5 !important' } }}
              />
            </Stack>
          </Container>
        </Box>

        {/* NEW SECTION: HOW IT WORKS */}
        <Box sx={{ py: 10, bgcolor: '#ffffff' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="800" textAlign="center" sx={{ mb: 2, color: '#0f172a' }}>
              Quy Trình Hoạt Động
            </Typography>
            <Typography variant="body1" textAlign="center" sx={{ mb: 8, color: '#64748b' }}>
              3 bước đơn giản để tìm được công việc mơ ước của bạn
            </Typography>

            <Grid container spacing={4} sx={{ position: 'relative' }}>
              {/* Optional: Add a connecting line between steps on desktop */}
              <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: '50px', left: '15%', right: '15%', height: '2px', bgcolor: '#e2e8f0', zIndex: 0 }} />

              {[
                { step: 1, title: "Tạo CV Profile", desc: "Điền thông tin và tạo hồ sơ chuyên nghiệp của bạn." },
                { step: 2, title: "AI Phân Tích", desc: "Hệ thống AI tự động đánh giá và tìm công việc phù hợp nhất." },
                { step: 3, title: "Ứng Tuyển & Nhận Việc", desc: "Nộp CV bằng 1 click và chờ phản hồi từ nhà tuyển dụng." }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index} sx={{ position: 'relative', zIndex: 1 }}>
                  <Stack alignItems="center" textAlign="center">
                    <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: '#4f46e5', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, boxShadow: '0 10px 20px rgba(79, 70, 229, 0.3)', border: '6px solid #ffffff' }}>
                      <Typography variant="h4" fontWeight="900">{item.step}</Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 1, color: '#1e293b' }}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 250 }}>{item.desc}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>


        {/* NEW SECTION: CALL TO ACTION */}
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#4f46e5', position: 'relative', overflow: 'hidden' }}>
          <Box sx={{ position: "absolute", top: "-50%", right: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)" }} />
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#ffffff', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
              Sẵn sàng nâng tầm sự nghiệp?
            </Typography>
            <Typography variant="h6" sx={{ color: '#e0e7ff', mb: 5, fontWeight: 400 }}>
              Hàng ngàn nhà tuyển dụng đang chờ đợi hồ sơ của bạn. Hãy để AI giúp bạn kết nối với họ ngay hôm nay.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button 
  onClick={() => navigate("/user/cv-builder")} // Sử dụng navigate đã khai báo ở đầu file
  variant="contained" 
  size="large" 
  sx={{ 
    bgcolor: '#ffffff', 
    color: '#4f46e5', 
    fontWeight: 800, 
    px: 5, 
    py: 2, 
    borderRadius: 50, 
    '&:hover': { bgcolor: '#f8fafc' } 
  }}
>
  Tạo CV Ngay
</Button>
              <Button variant="outlined" size="large" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#ffffff', fontWeight: 800, px: 5, py: 2, borderRadius: 50, '&:hover': { borderColor: '#ffffff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Tìm Việc Làm
              </Button>
            </Stack>
          </Container>
        </Box>

      </UserLayout>
    );
  }