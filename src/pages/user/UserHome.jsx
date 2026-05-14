import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Code,
  Brush,
  Campaign,
  AccountBalance,
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import LastCvAnalysisSection from "./LastCvAnalysisSection";
import HeroSection from "./HeroSection";
import JobCategoriesSection from "./JobCategoriesSection";
import JobListSection from "./JobListSection";
import HowItWorksSection from "./HowItWorksSection";
import HomeCTASection from "./HomeCTASection";
import { migrateLegacyStorage } from "../../services/cvAnalysisStorage";
import { useToast } from "../../contexts/ToastContext";

export default function UserHome() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({ keyword: "", location: "" });
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const jobsPerPage = showAllJobs ? Math.max(jobs.length, 12) : 12;

  const handleShowAllJobs = () => {
    setShowAllJobs(true);
    setCurrentPage(1);
  };

  useEffect(() => {
    migrateLegacyStorage();
  }, []);

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

  const handleToggleFavorite = async (e, jobId, currentFavoriteStatus) => {
    e.stopPropagation();

    const authHeader = getAuthHeader();
    if (!authHeader) {
      showToast("Vui lòng đăng nhập để thực hiện chức năng này", "warning");
      navigate("/login");
      return;
    }

    if (currentFavoriteStatus) {
      try {
        await axios.delete(`http://localhost:8080/api/user/jobs/favorite/${jobId}`, {
          headers: authHeader,
        });

        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.jobId === jobId ? { ...job, isFavorite: false } : job))
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
      try {
        await axios.post(`http://localhost:8080/api/user/jobs/favorite/add/${jobId}`, null, {
          headers: authHeader,
        });

        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.jobId === jobId ? { ...job, isFavorite: true } : job))
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    const section = document.getElementById("job-list-section");
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowAllJobs(false);
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
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
      <LastCvAnalysisSection />
      <JobCategoriesSection jobCategories={jobCategories} />
      <JobListSection
        jobs={jobs}
        currentPage={currentPage}
        jobsPerPage={jobsPerPage}
        loading={loading}
        onShowAllJobs={handleShowAllJobs}
        handleToggleFavorite={handleToggleFavorite}
        handlePageChange={handlePageChange}
        navigate={navigate}
      />
      <HowItWorksSection />
      <HomeCTASection onCreateCv={() => navigate("/user/cv-builder")} />
    </UserLayout>
  );
}
