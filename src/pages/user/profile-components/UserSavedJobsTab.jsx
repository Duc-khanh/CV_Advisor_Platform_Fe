import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Avatar,
  IconButton,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { Favorite, ArrowForward, FavoriteBorder } from "@mui/icons-material";
import { useToast } from "../../../contexts/ToastContext";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserSavedJobsTab() {
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
      const favoriteData = res.data.map((job) => ({ ...job, isFavorite: true }));
      setFavorites(favoriteData);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích", err);
      showToast("Lỗi tải danh sách yêu thích", "error");
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
      setFavorites((prev) => prev.filter((job) => job.jobId !== jobId));
      showToast("Đã bỏ lưu tin!", "success");
    } catch (err) {
      console.error("Lỗi xóa yêu thích:", err);
      showToast("Lỗi bỏ lưu tin", "error");
    }
  };

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
        minHeight: "50vh",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h6" fontWeight="800" sx={{ color: "#1e293b", mb: 0.5 }}>
            Công việc <span style={{ color: "#ef4444" }}>đã lưu</span>
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {loading ? "Đang tải..." : `Bạn đang quan tâm ${favorites.length} cơ hội nghề nghiệp`}
          </Typography>
        </Box>
        <Button
          onClick={() => navigate("/")}
          endIcon={<ArrowForward />}
          variant="outlined"
          size="small"
          sx={{
            color: "#ef4444",
            borderColor: "#ef4444",
            textTransform: "none",
            fontWeight: 700,
            "&:hover": { borderColor: "#dc2626", bgcolor: "#fff5f5" },
          }}
        >
          Tiếp tục khám phá
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#ef4444" }} />
        </Box>
      ) : favorites.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Box
            sx={{
              p: 5,
              display: "inline-block",
              borderRadius: 8,
              bgcolor: "transparent",
              border: "2px dashed #e2e8f0",
            }}
          >
            <Avatar sx={{ bgcolor: "#f1f5f9", width: 64, height: 64, mx: "auto", mb: 2 }}>
              <FavoriteBorder sx={{ fontSize: 32, color: "#94a3b8" }} />
            </Avatar>
            <Typography variant="subtitle1" fontWeight="800" color="#1e293b" mb={1}>
              Danh sách yêu thích trống
            </Typography>
            <Typography variant="body2" color="#64748b" mb={3} sx={{ maxWidth: 320, mx: "auto" }}>
              Có vẻ như bạn chưa lưu công việc nào. Hãy khám phá thêm cơ hội mới!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ bgcolor: "#ef4444", px: 3, py: 1.2, borderRadius: 2.5, fontWeight: 800, "&:hover": { bgcolor: "#dc2626" } }}
            >
              Tìm việc ngay
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favorites.map((job) => (
            <Grid item xs={12} sm={6} key={job.jobId}>
              <Paper
                onClick={() => navigate(`/job/${job.jobId}`)}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  cursor: "pointer",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  "&:hover": {
                    borderColor: "#ef4444",
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(239, 68, 68, 0.08)",
                  },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                  {job.companyLogo ? (
                    <Avatar src={getMediaUrl(job.companyLogo)} variant="rounded" sx={{ width: 44, height: 44 }} />
                  ) : (
                    <Avatar
                      variant="rounded"
                      sx={{ width: 44, height: 44, bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800 }}
                    >
                      {job.companyName?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      fontWeight={700}
                      sx={{
                        fontSize: "0.95rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.3,
                        mb: 0.5,
                      }}
                    >
                      {job.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "#64748b", display: "block", textTransform: "uppercase", fontWeight: 600 }}
                    >
                      {job.companyName}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mt="auto">
                  <Stack direction="row" spacing={1}>
                    <Box sx={{ bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5 }}>
                      <Typography variant="caption" fontWeight="700">
                        {job.salaryRange || "Thỏa thuận"}
                      </Typography>
                    </Box>
                    <Box sx={{ bgcolor: "#f1f5f9", px: 1, py: 0.5, borderRadius: 1.5 }}>
                      <Typography variant="caption" fontWeight="700">
                        {job.location?.split(",").pop()}
                      </Typography>
                    </Box>
                  </Stack>

                  <IconButton
                    size="small"
                    onClick={(e) => handleToggleFavorite(e, job.jobId)}
                    sx={{
                      border: "1px solid #fee2e2",
                      color: "#ef4444",
                      bgcolor: "#fff5f5",
                      "&:hover": { bgcolor: "#fee2e2", color: "#ef4444" },
                    }}
                  >
                    <Favorite fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
}
