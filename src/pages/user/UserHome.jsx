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
import TopCompaniesSection from "./TopCompaniesSection";
import CompanyDetailModal from "./CompanyDetailModal";
import CareerGuideSection from "./CareerGuideSection";
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
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = showAllJobs ? Math.max(jobs.length, 12) : 12;

  // Selected company state for detail view modal
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setCompanyModalOpen(true);
  };

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
          page: 0,
          size: 50,
        },
        headers: authHeader || {},
      });

      // Backend trả về Spring Page object: { content: [...], totalPages, totalElements, ... }
      const jobList = Array.isArray(response.data)
        ? response.data
        : response.data?.content ?? [];

      const jobsWithFavorite = jobList.map((job) => ({
        ...job,
        isFavorite: favoriteIdsFromServer.has(job.jobId),
      }));

      setJobs(jobsWithFavorite);
      setTotalPages(response.data?.totalPages ?? 1);
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
    e && e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.keyword) params.set("keyword", searchQuery.keyword);
    if (searchQuery.location) params.set("location", searchQuery.location);
    setShowAllJobs(false);
    navigate(`/search?${params.toString()}`);
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
      
      {/* Job list with filter tabs */}
      <JobListSection
        jobs={jobs}
        currentPage={currentPage}
        jobsPerPage={jobsPerPage}
        loading={loading}
        onShowAllJobs={handleShowAllJobs}
        handleToggleFavorite={handleToggleFavorite}
        handlePageChange={handlePageChange}
        navigate={navigate}
        isHomePage={true}
      />

      {/* Top Recruiting Companies from database */}
      <TopCompaniesSection onCompanyClick={handleCompanyClick} />

      {/* Career handbook guide articles */}
      <CareerGuideSection />

      <HowItWorksSection />
      <HomeCTASection onCreateCv={() => navigate("/cv-builder")} />

      {/* Company Detail popup modal */}
      <CompanyDetailModal
        company={selectedCompany}
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        navigate={navigate}
        handleToggleFavorite={handleToggleFavorite}
      />
    </UserLayout>
  );
}
