import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Pagination,
} from "@mui/material";
import { Favorite, FavoriteBorder, ArrowForward } from "@mui/icons-material";

export default function JobListSection({
  jobs,
  currentPage,
  jobsPerPage,
  loading,
  onShowAllJobs,
  handleToggleFavorite,
  handlePageChange,
  navigate,
}) {
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const pageCount = Math.max(1, Math.ceil(jobs.length / jobsPerPage));

  return (
    <Box id="job-list-section" sx={{ py: 10, bgcolor: "#f8fafc" }}>
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ mb: 1, color: "#0f172a" }}>
              Cơ hội dành riêng cho bạn
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Được AI đề xuất dựa trên kỹ năng và mục tiêu của bạn
            </Typography>
          </Box>
          <Button
            onClick={onShowAllJobs}
            endIcon={<ArrowForward />}
            sx={{ color: "#4f46e5", fontWeight: 600, display: { xs: "none", sm: "flex" } }}
          >
            Xem tất cả
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } }}>
          {loading ? (
            <Typography sx={{ width: "100%", textAlign: "center", py: 6, color: "#475569" }}>
              Đang tải danh sách công việc...
            </Typography>
          ) : currentJobs.length === 0 ? (
            <Typography sx={{ width: "100%", textAlign: "center", py: 6, color: "#475569" }}>
              Không tìm thấy việc làm phù hợp.
            </Typography>
          ) : (
            currentJobs.map((job) => (
              <Box key={job.jobId}>
                <Paper
                  onClick={() => navigate(`/user/job/${job.jobId}`)}
                  elevation={0}
                  sx={{
                    height: "100%",
                    height: "210px",
                    width: "100%",
                    p: 2.5,
                    borderRadius: 4,
                    cursor: "pointer",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                    bgcolor: "#ffffff",
                    "&:hover": {
                      borderColor: "#4f46e5",
                      transform: "translateY(-5px)",
                      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)",
                    },
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
                    {job.companyLogo ? (
                      <Avatar
                        src={job.companyLogo}
                        variant="rounded"
                        sx={{ width: 48, height: 48, flexShrink: 0, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
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
                          color: "#1e293b",
                          wordBreak: "break-word",
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        title={job.companyName}
                        sx={{
                          mt: 0.5,
                          color: "#64748b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "block",
                        }}
                      >
                        {job.companyName || "\u00A0"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{ mb: 2, overflow: "hidden" }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        overflowX: "auto",
                        flexWrap: "nowrap",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": { display: "none" },
                      }}
                    >
                      <Chip
                        label={job.location ? job.location.split(",").pop().trim() : "Toàn quốc"}
                        size="small"
                        sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 500, borderRadius: 2, flexShrink: 0 }}
                      />
                      <Chip
                        label={job.jobType || "Toàn thời gian"}
                        size="small"
                        sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 500, borderRadius: 2, flexShrink: 0 }}
                      />
                    </Stack>
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Divider sx={{ mb: 1, borderColor: "#f1f5f9" }} />
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography
                        fontWeight="800"
                        sx={{
                          color: "#10b981",
                          fontSize: "0.95rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "calc(100% - 44px)",
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
                          "&:hover": { bgcolor: "#fee2e2", color: "#ef4444", borderColor: "#fca5a5" },
                        }}
                      >
                        {job.isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                      </IconButton>
                    </Stack>
                  </Box>
                </Paper>
              </Box>
            ))
          )}
        </Grid>

        <Stack alignItems="center" sx={{ mt: 8 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            disabled={jobs.length === 0}
            sx={{ "& .Mui-selected": { bgcolor: "#4f46e5 !important" } }}
          />
        </Stack>
      </Container>
    </Box>
  );
}
