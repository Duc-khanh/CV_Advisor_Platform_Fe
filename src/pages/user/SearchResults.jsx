import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import HeroSection from "./HeroSection";
import JobListSection from "./JobListSection";
import { useToast } from "../../contexts/ToastContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const navigate = useNavigate();
  const query = useQuery();
  const showToast = useToast();

  const [searchQuery, setSearchQuery] = useState({
    keyword: query.get("keyword") || "",
    location: query.get("location") || "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
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
      const res = await axios.get("http://localhost:8080/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      return new Set(res.data.map((job) => job.jobId));
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích:", err);
      return new Set();
    }
  };

  const fetchJobs = async (keyword, location) => {
    setLoading(true);
    const authHeader = getAuthHeader();
    const favoriteIdsFromServer = await fetchFavoriteIds(authHeader);

    try {
      const response = await axios.get("http://localhost:8080/api/public/jobs", {
        params: { keyword, location, page: 0, size: 50 },
        headers: authHeader || {},
      });

      // Backend trả về Spring Page object: { content: [...], totalPages, ... }
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
      console.error("Lỗi khi lấy danh sách công việc:", error);
      showToast("Không thể tải kết quả tìm kiếm", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const keyword = q.get("keyword") || "";
    const locationQ = q.get("location") || "";
    setSearchQuery({ keyword, location: locationQ });
    fetchJobs(keyword, locationQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useLocation().search]);

  const handleSearch = (e) => {
    e && e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.keyword) params.set("keyword", searchQuery.keyword);
    if (searchQuery.location) params.set("location", searchQuery.location);
    navigate(`/search?${params.toString()}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const section = document.getElementById("job-list-section");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
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
