import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Box, Stack, Avatar, 
  IconButton, Paper, CircularProgress, Button, Divider 
} from "@mui/material";
import { Favorite, ArrowForward, FavoriteBorder } from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";

export default function FavoriteJobs() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchFavorites = async () => {
    setLoading(true);
    const authHeader = getAuthHeader();
    try {
      const res = await axios.get("http://localhost:8080/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      // Đảm bảo dữ liệu từ server luôn hiển thị trạng thái đã lưu
      const favoriteData = res.data.map(job => ({ ...job, isFavorite: true }));
      setFavorites(favoriteData);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    const authHeader = getAuthHeader();
    try {
      await axios.post(`http://localhost:8080/api/user/jobs/favorite/${jobId}`, null, {
        headers: authHeader,
      });
      // Xóa khỏi danh sách hiển thị ngay lập tức để người dùng thấy kết quả
      setFavorites((prev) => prev.filter((job) => job.jobId !== jobId));
    } catch (err) {
      console.error("Lỗi xóa yêu thích:", err);
    }
  };

  return (
    <UserLayout>
      {/* 1. HEADER SECTION - Đồng bộ với tone màu trang chủ */}
      <Box sx={{ bgcolor: "#f8faff", pt: 12, pb: 8, borderBottom: "1px solid #eff6ff" }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography variant="h3" fontWeight="900" sx={{ color: "#1e293b", mb: 1 }}>
                Công việc <span style={{ color: '#6366f1' }}>đã lưu</span>
              </Typography>
              <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 500 }}>
                {loading ? "Đang tải..." : `Bạn đang quan tâm ${favorites.length} cơ hội nghề nghiệp`}
              </Typography>
            </Box>
            <Button 
              onClick={() => navigate("/")} 
              startIcon={<ArrowForward />}
              sx={{ color: '#6366f1', fontWeight: 800, mb: 1, textTransform: 'none' }}
            >
              Tiếp tục khám phá
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 2. MAIN CONTENT AREA */}
      <Container maxWidth={false} sx={{ py: 10, px: { xs: 4, md: 10 }, minHeight: '60vh' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#6366f1' }} />
          </Box>
        ) : favorites.length === 0 ? (
          /* TRẠNG THÁI CHƯA CÓ CÔNG VIỆC YÊU THÍCH */
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 6, 
                display: 'inline-block', 
                borderRadius: 8, 
                bgcolor: 'transparent',
                border: '2px dashed #e2e8f0' 
              }}
            >
              <Avatar sx={{ bgcolor: '#f1f5f9', width: 80, height: 80, mx: 'auto', mb: 3 }}>
                  <FavoriteBorder sx={{ fontSize: 40, color: '#94a3b8' }} />
              </Avatar>
              <Typography variant="h5" fontWeight="800" color="#1e293b" mb={1}>
                Danh sách yêu thích trống
              </Typography>
              <Typography color="#64748b" mb={4} sx={{ maxWidth: 400, mx: 'auto' }}>
                Có vẻ như bạn chưa lưu công việc nào. Hãy quay lại trang chủ để tìm kiếm những cơ hội phù hợp nhất!
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate("/")}
                sx={{ bgcolor: '#6366f1', px: 4, py: 1.5, borderRadius: 4, fontWeight: 800 }}
              >
                Tìm việc ngay
              </Button>
            </Paper>
          </Box>
        ) : (
          /* HIỂN THỊ DANH SÁCH (Dùng đúng form 7cm của trang Home) */
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {favorites.map((job) => (
              <Paper
                key={job.jobId}
                onClick={() => navigate(`/user/job/${job.jobId}`)}
                sx={{
                  width: '10cm', minWidth: '10cm', maxWidth: '10cm',
                  p: 2.5, borderRadius: 4, cursor: "pointer",
                  border: "1px solid #e5e7eb", transition: "all 0.25s ease",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  "&:hover": { 
                    borderColor: "#6366f1", 
                    transform: "translateY(-5px)", 
                    boxShadow: "0 10px 25px rgba(99, 102, 241, 0.1)" 
                  }
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
                    <Typography variant="caption" sx={{ color: "#64748b", display: "block", textTransform: "uppercase" }}>
                      {job.companyName}
                    </Typography>
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
                    onClick={(e) => handleToggleFavorite(e, job.jobId)}
                    sx={{
                      border: "1px solid #f1f5f9",
                      color: "#ef4444", 
                      bgcolor: "#fee2e2",
                      "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                    }}
                  >
                    <Favorite fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </UserLayout>
  );
}