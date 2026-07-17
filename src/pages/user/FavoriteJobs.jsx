import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Box, Stack, Avatar, 
  IconButton, Paper, CircularProgress, Button, Divider 
} from "@mui/material";
import { Favorite, ArrowForward, FavoriteBorder } from "@mui/icons-material";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function FavoriteJobs() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

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
      // Äáº£m báº£o dá»¯ liá»‡u tá»« server luÃ´n hiá»ƒn thá»‹ tráº¡ng thÃ¡i Ä‘Ã£ lÆ°u
      const favoriteData = res.data.map(job => ({ ...job, isFavorite: true }));
      setFavorites(favoriteData);
    } catch (err) {
      console.error("Lá»—i láº¥y danh sÃ¡ch yÃªu thÃ­ch", err);
      showToast("Lá»—i táº£i danh sÃ¡ch yÃªu thÃ­ch", "error");
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
      await axios.delete(`http://localhost:8080/api/user/jobs/favorite/${jobId}`, {
        headers: authHeader,
      });
      // XÃ³a khá»i danh sÃ¡ch hiá»ƒn thá»‹ ngay láº­p tá»©c Ä‘á»ƒ ngÆ°á»i dÃ¹ng tháº¥y káº¿t quáº£
      setFavorites((prev) => prev.filter((job) => job.jobId !== jobId));
      showToast("ÄÃ£ bá» lÆ°u tin!", "success");
    } catch (err) {
      console.error("Lá»—i xÃ³a yÃªu thÃ­ch:", err);
      showToast("Lá»—i bá» lÆ°u tin", "error");
    }
  };

  return (
    <>
      {/* 1. HEADER SECTION - Äá»“ng bá»™ vá»›i tone mÃ u trang chá»§ */}
      <Box sx={{ bgcolor: "#f8faff", pt: 12, pb: 8, borderBottom: "1px solid #eff6ff" }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography variant="h3" fontWeight="900" sx={{ color: "#1e293b", mb: 1 }}>
                CÃ´ng viá»‡c <span style={{ color: '#2563eb' }}>Ä‘Ã£ lÆ°u</span>
              </Typography>
              <Typography variant="h6" sx={{ color: "#64748b", fontWeight: 500 }}>
                {loading ? "Äang táº£i..." : `Báº¡n Ä‘ang quan tÃ¢m ${favorites.length} cÆ¡ há»™i nghá» nghiá»‡p`}
              </Typography>
            </Box>
            <Button 
              onClick={() => navigate("/")} 
              startIcon={<ArrowForward />}
              sx={{ color: '#2563eb', fontWeight: 800, mb: 1, textTransform: 'none' }}
            >
              Tiáº¿p tá»¥c khÃ¡m phÃ¡
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* 2. MAIN CONTENT AREA */}
      <Container maxWidth={false} sx={{ py: 10, px: { xs: 4, md: 10 }, minHeight: '60vh' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#2563eb' }} />
          </Box>
        ) : favorites.length === 0 ? (
          /* TRáº NG THÃI CHÆ¯A CÃ“ CÃ”NG VIá»†C YÃŠU THÃCH */
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
                Danh sÃ¡ch yÃªu thÃ­ch trá»‘ng
              </Typography>
              <Typography color="#64748b" mb={4} sx={{ maxWidth: 400, mx: 'auto' }}>
                CÃ³ váº» nhÆ° báº¡n chÆ°a lÆ°u cÃ´ng viá»‡c nÃ o. HÃ£y quay láº¡i trang chá»§ Ä‘á»ƒ tÃ¬m kiáº¿m nhá»¯ng cÆ¡ há»™i phÃ¹ há»£p nháº¥t!
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate("/")}
                sx={{ bgcolor: '#2563eb', px: 4, py: 1.5, borderRadius: 4, fontWeight: 800 }}
              >
                TÃ¬m viá»‡c ngay
              </Button>
            </Paper>
          </Box>
        ) : (
          /* HIá»‚N THá»Š DANH SÃCH (DÃ¹ng Ä‘Ãºng form 7cm cá»§a trang Home) */
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
            {favorites.map((job) => (
              <Paper
                key={job.jobId}
                onClick={() => navigate(`/job/${job.jobId}`)}
                sx={{
                  width: '10cm', minWidth: '10cm', maxWidth: '10cm',
                  p: 2.5, borderRadius: 4, cursor: "pointer",
                  border: "1px solid #e5e7eb", transition: "all 0.25s ease",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  "&:hover": { 
                    borderColor: "#2563eb", 
                    transform: "translateY(-5px)", 
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.1)" 
                  }
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {job.companyLogo ? (
                    <Avatar src={getMediaUrl(job.companyLogo)} variant="rounded" sx={{ width: 50, height: 50 }} />
                  ) : (
                    <Avatar variant="rounded" sx={{ width: 50, height: 50, bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800 }}>
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
                      <Typography variant="caption" fontWeight="700">{job.salaryRange || "Thá»a thuáº­n"}</Typography>
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
    </>
  );
}
