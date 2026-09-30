import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Container, Typography, Chip, Button, Stack } from "@mui/material";
import { Clear, SearchOff } from "@mui/icons-material";
import api from "../../services/axios";
import HeroSection from "./HeroSection";
import JobListSection from "./JobListSection";
import { useToast } from "../../contexts/ToastContext";

export default function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const searchParams = new URLSearchParams(location.search);
  const initialKeyword = searchParams.get("keyword") || "";
  const initialLocation = searchParams.get("location") || "";

  const [searchQuery, setSearchQuery] = useState({
    keyword: initialKeyword,
    location: initialLocation,
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setFavoriteIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return { Authorization: `Bearer ${token}` };
  };

  const fetchFavoriteIds = async (authHeader) => {
    if (!authHeader) return new Set();
    try {
      const res = await api.get("/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      return new Set(res.data.map((job) => job.jobId));
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
      return new Set();
    }
  };

  const fetchJobs = useCallback(async (kw, loc) => {
    setLoading(true);
    const authHeader = getAuthHeader();
    const favoriteIdsFromServer = await fetchFavoriteIds(authHeader);

    try {
      const params = { page: 0, size: 50 };
      if (kw && kw.trim()) params.keyword = kw.trim();
      if (loc && loc.trim()) params.location = loc.trim();

      const response = await api.get("/api/public/jobs", {
        params,
        headers: authHeader || {},
      });

      const jobList = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      const jobsWithFavorite = jobList.map((job) => ({
        ...job,
        isFavorite: favoriteIdsFromServer.has(job.jobId),
      }));

      setJobs(jobsWithFavorite);
      setFavoriteIds(favoriteIdsFromServer);
      setCurrentPage(1);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách việc làm:", error);
      showToast("Không thể tải kết quả tìm kiếm", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const kw = q.get("keyword") || "";
    const loc = q.get("location") || "";
    setSearchQuery({ keyword: kw, location: loc });
    fetchJobs(kw, loc);
  }, [location.search, fetchJobs]);

  const handleClearFilters = () => {
    navigate("/search");
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const section = document.getElementById("job-list-section");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hasFilter = Boolean(searchQuery.keyword || searchQuery.location);

  return (
    <>
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Container maxWidth="xl" sx={{ mt: 2, mb: 1 }}>
        {hasFilter && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              p: 2,
              borderRadius: 3,
              bgcolor: "#f8fafc",
              border: "1px solid #e2e8f0",
              mb: 2,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="#475569" fontWeight={600}>
                Kết quả tìm kiếm cho:
              </Typography>
              {searchQuery.keyword && (
                <Chip
                  label={`Từ khóa: "${searchQuery.keyword}"`}
                  size="small"
                  sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, border: "1px solid #bfdbfe" }}
                />
              )}
              {searchQuery.location && (
                <Chip
                  label={`Địa điểm: "${searchQuery.location}"`}
                  size="small"
                  sx={{ bgcolor: "#f1f5f9", color: "#334155", fontWeight: 700, border: "1px solid #cbd5e1" }}
                />
              )}
              <Typography variant="body2" color="#0f172a" fontWeight={800} sx={{ ml: 1 }}>
                ({jobs.length} việc làm phù hợp)
              </Typography>
            </Stack>

            <Button
              size="small"
              variant="outlined"
              color="inherit"
              startIcon={<Clear sx={{ fontSize: 16 }} />}
              onClick={handleClearFilters}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.8rem",
                borderRadius: 2,
                color: "#64748b",
              }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        )}
      </Container>

      <JobListSection
        jobs={jobs}
        currentPage={currentPage}
        jobsPerPage={jobsPerPage}
        loading={loading}
        onShowAllJobs={() => {}}
        handleToggleFavorite={() => {}}
        handlePageChange={handlePageChange}
        navigate={navigate}
      />
    </>
  );
}
