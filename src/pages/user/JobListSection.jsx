import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  IconButton,
  Pagination,
  Link,
  Grid,
} from "@mui/material";
import { Favorite, FavoriteBorder, ArrowForward, Room } from "@mui/icons-material";
import { getMediaUrl } from "../../utils/urlHelpers";

const getTimeAgo = (createdAt) => {
  if (!createdAt) return "Gần đây";
  try {
    const createdDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${Math.max(1, diffMins)} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else {
      return `${diffDays} ngày trước`;
    }
  } catch (e) {
    return "Gần đây";
  }
};

const getJobBadge = (job) => {
  const createdDate = new Date(job.createdAt || 0);
  const now = new Date();
  const diffMs = now - createdDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  
  if (diffDays <= 3 || job.jobId % 5 === 1) {
    return { label: "New", color: "#22c55e", bg: "#f0fdf4" };
  } else if ((job.viewCount && job.viewCount >= 5) || job.jobId % 5 === 0) {
    return { label: "Hot", color: "#ef4444", bg: "#fef2f2" };
  }
  return null;
};

export default function JobListSection({
  jobs = [],
  currentPage = 1,
  jobsPerPage = 12,
  loading,
  onShowAllJobs,
  handleToggleFavorite,
  handlePageChange,
  navigate,
  isHomePage = false,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [localPage, setLocalPage] = useState(1);

  // Reset page when tab or jobs list changes
  useEffect(() => {
    setLocalPage(1);
  }, [activeTab, jobs]);

  // Filter & Sort jobs based on selected tab
  let processedJobs = [...jobs];

  if (activeTab === "new") {
    processedJobs.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } else if (activeTab === "hot") {
    processedJobs.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  } else if (activeTab === "recommend") {
    processedJobs = processedJobs.filter(j => {
      const skills = j.requiredSkills ? j.requiredSkills.map(s => s.toLowerCase()) : [];
      return (
        skills.includes("java") || 
        skills.includes("react") || 
        skills.includes("reactjs") || 
        skills.includes("nodejs") || 
        skills.includes("golang") || 
        (j.salaryRange && j.salaryRange.includes("triệu") && parseInt(j.salaryRange) >= 25)
      );
    });
    // Fallback to all if no match
    if (processedJobs.length === 0) {
      processedJobs = [...jobs];
    }
  }

  // Local Pagination calculations
  const indexOfLastJob = localPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = processedJobs.slice(indexOfFirstJob, indexOfLastJob);
  const pageCount = Math.max(1, Math.ceil(processedJobs.length / jobsPerPage));

  const handleLocalPageChange = (event, value) => {
    setLocalPage(value);
    if (handlePageChange) {
      handlePageChange(event, value);
    } else {
      const section = document.getElementById("job-list-section");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const themeColor = "#2563eb";
  const themeHover = "#eff6ff";
  const themeBorder = "#dbeafe";

  return (
    <Box id="job-list-section" sx={{ py: 8, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        {/* Header and Tabs Stack */}
        <Stack
          direction={{ xs: "column", lg: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", lg: "center" }}
          spacing={3}
          sx={{ mb: 5 }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={{ xs: 2, md: 5 }}
            sx={{ width: { xs: "100%", lg: "auto" } }}
          >
            <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ whiteSpace: "nowrap" }}>
              Việc làm nổi bật
            </Typography>

            {/* Custom Premium Tabs switcher */}
            <Stack
              direction="row"
              spacing={3}
              sx={{
                borderBottom: "1px solid #e2e8f0",
                pb: 0.5,
                width: { xs: "100%", md: "auto" },
                overflowX: "auto",
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {[
                { id: "all", label: "Tất cả" },
                { id: "new", label: "Việc làm mới" },
                { id: "hot", label: "Việc làm hot" },
                { id: "recommend", label: "Gợi ý cho bạn" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <Box
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    sx={{
                      cursor: "pointer",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.92rem",
                      color: isActive ? themeColor : "#64748b",
                      position: "relative",
                      pb: 1,
                      transition: "0.2s",
                      whiteSpace: "nowrap",
                      "&:hover": {
                        color: themeColor,
                      },
                      "&::after": isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: "2.5px",
                            backgroundColor: themeColor,
                            borderRadius: "2px",
                          }
                        : {},
                    }}
                  >
                    {tab.label}
                  </Box>
                );
              })}
            </Stack>
          </Stack>

          {isHomePage && onShowAllJobs && (
            <Link
              onClick={onShowAllJobs}
              underline="none"
              sx={{
                color: themeColor,
                fontWeight: 800,
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
                alignSelf: { xs: "flex-end", lg: "center" },
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Xem tất cả việc làm <ArrowForward sx={{ fontSize: 16 }} />
            </Link>
          )}
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={650}>
              Đang tải danh sách công việc nổi bật...
            </Typography>
          </Box>
        ) : currentJobs.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <Typography variant="body1" color="text.secondary" fontWeight={650}>
              Không tìm thấy việc làm phù hợp.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            {currentJobs.map((job) => {
              const badge = getJobBadge(job);
              return (
                <Grid item key={job.jobId} sx={{ display: "contents" }}>
                  <Paper
                    elevation={0}
                    onClick={() => navigate(`/job/${job.jobId}`)}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      minHeight: 220,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      position: "relative",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        borderColor: themeColor,
                        boxShadow: "0 12px 30px rgba(37,99,235,0.06)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {/* Badge hot / new at top right */}
                    {badge && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          px: 1.5,
                          py: 0.3,
                          borderRadius: "100px",
                          bgcolor: badge.bg,
                          color: badge.color,
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {badge.label}
                      </Box>
                    )}

                    {/* Logo and Job Info Header */}
                    <Stack direction="row" spacing={1.8} alignItems="flex-start" sx={{ mb: 2.5, pr: badge ? 5 : 0 }}>
                      <Avatar
                        src={getMediaUrl(job.companyLogo)}
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "10px",
                          flexShrink: 0,
                          fontSize: "1rem",
                          fontWeight: 800,
                          color: themeColor,
                        }}
                      >
                        {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
                      </Avatar>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 800,
                            color: "#0f172a",
                            lineHeight: 1.3,
                            mb: 0.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            "&:hover": { color: themeColor },
                          }}
                        >
                          {job.title}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: "0.78rem",
                            color: "#64748b",
                            fontWeight: 600,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {job.companyName}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Salary and Location */}
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 2 }}>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#ef4444" }}>
                        {job.salaryRange || "Thỏa thuận"}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: "#64748b" }}>
                        <Room sx={{ fontSize: 15 }} />
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                          {job.location ? job.location.split(",").pop().trim() : "Toàn quốc"}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Skill Chips */}
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 0.5, mb: 2.5 }}>
                      {job.requiredSkills &&
                        job.requiredSkills.slice(0, 3).map((skill, index) => (
                          <Chip
                            key={index}
                            label={skill}
                            size="small"
                            sx={{
                              height: 22,
                              bgcolor: "#eff6ff",
                              color: themeColor,
                              fontWeight: 700,
                              fontSize: "0.75rem",
                              borderRadius: "6px",
                            }}
                          />
                        ))}
                    </Stack>

                    {/* Timeago and Favorite Icon */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mt: "auto",
                        pt: 1.5,
                        borderTop: "1px dashed #e2e8f0",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>
                        {getTimeAgo(job.createdAt)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(e, job.jobId, job.isFavorite);
                        }}
                        sx={{
                          width: 32,
                          height: 32,
                          color: job.isFavorite ? "#ef4444" : "#94a3b8",
                          bgcolor: "transparent",
                          flexShrink: 0,
                          "&:hover": {
                            bgcolor: "#fef2f2",
                            color: "#ef4444",
                          },
                        }}
                      >
                        {job.isFavorite ? (
                          <Favorite sx={{ fontSize: 18 }} />
                        ) : (
                          <FavoriteBorder sx={{ fontSize: 18 }} />
                        )}
                      </IconButton>
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Centered Pagination */}
        {pageCount > 1 && (
          <Stack alignItems="center" sx={{ mt: 6 }}>
            <Pagination
              count={pageCount}
              page={localPage}
              onChange={handleLocalPageChange}
              color="primary"
              size="large"
              disabled={processedJobs.length === 0}
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 700,
                },
                "& .Mui-selected": {
                  bgcolor: `${themeColor} !important`,
                  color: "#ffffff !important",
                  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                },
                "& .MuiPaginationItem-root:hover": {
                  bgcolor: themeHover,
                },
              }}
            />
          </Stack>
        )}
      </Container>
    </Box>
  );
}