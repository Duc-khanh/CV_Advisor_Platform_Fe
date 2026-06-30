import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Link,
} from "@mui/material";
import { Close, Star, Room, Favorite, FavoriteBorder, Language, Phone, Email } from "@mui/icons-material";
import axios from "axios";
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

export default function CompanyDetailModal({ company, open, onClose, navigate, handleToggleFavorite }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && company?.companyId) {
      const fetchCompanyJobs = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          const response = await axios.get(`http://localhost:8080/api/public/companies/${company.companyId}/jobs`, {
            headers,
          });
          setJobs(response.data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách việc làm của công ty:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCompanyJobs();
    }
  }, [open, company]);

  if (!company) return null;

  const themeColor = "#2563eb";
  const themeHover = "#eff6ff";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth scroll="paper" PaperProps={{ sx: { borderRadius: "20px" } }}>
      <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}>
        <IconButton onClick={onClose} sx={{ bgcolor: "#f1f5f9", "&:hover": { bgcolor: "#e2e8f0" } }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {/* Company Header Banner */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="flex-start" sx={{ mb: 4 }}>
          <Avatar
            src={getMediaUrl(company.logoUrl)}
            variant="rounded"
            sx={{
              width: 90,
              height: 90,
              bgcolor: "#ffffff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "16px",
              boxShadow: "0 6px 16px rgba(0,0,0,0.04)",
            }}
          >
            {company.companyName.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ mb: 1 }}>
              {company.companyName}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 2 }}>
              <Star sx={{ fontSize: 18, color: "#f59e0b" }} />
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 800, color: "#475569" }}>
                {company.rating} (Đánh giá)
              </Typography>
            </Stack>

            <Grid container spacing={2} sx={{ color: "#475569" }}>
              <Grid item xs={12} md={6}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Room sx={{ fontSize: 18, color: themeColor }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{company.address}</Typography>
                </Stack>
              </Grid>
              {company.websiteUrl && (
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Language sx={{ fontSize: 18, color: themeColor }} />
                    <Link href={company.websiteUrl} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "0.875rem", fontWeight: 700, color: themeColor, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                      {company.websiteUrl}
                    </Link>
                  </Stack>
                </Grid>
              )}
              {company.phone && (
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone sx={{ fontSize: 18, color: themeColor }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{company.phone}</Typography>
                  </Stack>
                </Grid>
              )}
              {company.email && (
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Email sx={{ fontSize: 18, color: themeColor }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{company.email}</Typography>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </Box>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Company Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a" sx={{ mb: 1.5 }}>
            Giới thiệu công ty
          </Typography>
          <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.7, whiteSpace: "pre-line", fontSize: "0.9rem" }}>
            {company.description || "Chưa có bài viết giới thiệu chi tiết cho doanh nghiệp này."}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Active Jobs Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a" sx={{ mb: 3 }}>
            Vị trí đang tuyển dụng ({jobs.length})
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress size={36} sx={{ color: themeColor }} />
            </Box>
          ) : jobs.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center", bgcolor: "#f8fafc", borderRadius: "12px" }}>
              <Typography variant="body2" color="text.secondary" fontWeight={650}>
                Hiện tại công ty chưa đăng tuyển cơ hội việc làm nào.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {jobs.map((job) => (
                <Grid item key={job.jobId} xs={12} sm={6} md={4}>
                  <Paper
                    elevation={0}
                    onClick={() => {
                      onClose();
                      navigate(`/job/${job.jobId}`);
                    }}
                    sx={{
                      p: 2.5,
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      minHeight: 180,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-start",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: themeColor,
                        boxShadow: "0 12px 30px rgba(37,99,235,0.06)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0, mb: 2 }}>
                      <Typography
                        sx={{
                          fontSize: "0.95rem",
                          fontWeight: 800,
                          color: "#0f172a",
                          lineHeight: 1.3,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          "&:hover": { color: themeColor },
                        }}
                      >
                        {job.title}
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5 }}>
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
                      <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.5 }}>
                        {job.requiredSkills &&
                          job.requiredSkills.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{
                                height: 20,
                                bgcolor: "#eff6ff",
                                color: themeColor,
                                fontWeight: 700,
                                fontSize: "0.72rem",
                                borderRadius: "5px",
                              }}
                            />
                          ))}
                      </Stack>
                    </Box>

                    {/* Footer Row */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        mt: "auto",
                        pt: 1.2,
                        borderTop: "1px dashed #e2e8f0",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
                        {getTimeAgo(job.createdAt)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleToggleFavorite) {
                            handleToggleFavorite(e, job.jobId, job.isFavorite);
                            setJobs((prev) =>
                              prev.map((item) =>
                                item.jobId === job.jobId ? { ...item, isFavorite: !item.isFavorite } : item
                              )
                            );
                          }
                        }}
                        sx={{
                          width: 28,
                          height: 28,
                          color: job.isFavorite ? "#ef4444" : "#94a3b8",
                          "&:hover": {
                            bgcolor: "#fef2f2",
                            color: "#ef4444",
                          },
                        }}
                      >
                        {job.isFavorite ? (
                          <Favorite sx={{ fontSize: 16 }} />
                        ) : (
                          <FavoriteBorder sx={{ fontSize: 16 }} />
                        )}
                      </IconButton>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
