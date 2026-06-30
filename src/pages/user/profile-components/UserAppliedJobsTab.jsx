import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Avatar,
  Paper,
  CircularProgress,
  Button,
  Grid,
  Select,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import {
  InfoOutlined,
  KeyboardArrowDown,
  MonetizationOnOutlined,
  RoomOutlined,
  WorkOutline,
  Favorite,
} from "@mui/icons-material";
import { useToast } from "../../../contexts/ToastContext";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserAppliedJobsTab({
  appliedCount = 0,
  savedCount = 0,
}) {
  const [subTab, setSubTab] = useState("applied"); // 'applied' | 'saved' | 'viewed'
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        "http://localhost:8080/api/user/jobs/apply/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppliedJobs(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng tuyển", err);
    }
  };

  const fetchSavedJobs = async () => {
    const authHeader = getAuthHeader();
    try {
      const res = await axios.get("http://localhost:8080/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      setSavedJobs(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích", err);
    }
  };

  const handleToggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    const authHeader = getAuthHeader();
    try {
      await axios.delete(`http://localhost:8080/api/user/jobs/favorite/${jobId}`, {
        headers: authHeader,
      });
      setSavedJobs((prev) => prev.filter((job) => job.jobId !== jobId));
      showToast("Đã bỏ lưu tin tuyển dụng!", "success");
    } catch (err) {
      console.error("Lỗi xóa yêu thích:", err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchAppliedJobs(), fetchSavedJobs()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Mock Viewed Jobs (Đã xem gần đây)
  const mockViewedJobs = [
    {
      jobId: 101,
      title: "Senior Java Engineer (Spring Boot, Microservices)",
      companyName: "FPT Software",
      location: "Hà Nội • Tại văn phòng",
      salaryRange: "35-50 triệu",
      viewedDate: "Xem vào 22/05/2026",
    },
    {
      jobId: 102,
      title: "Frontend Developer (ReactJS / TailwindCSS)",
      companyName: "VNG Corporation",
      location: "TP Hồ Chí Minh • Từ xa",
      salaryRange: "25-38 triệu",
      viewedDate: "Xem vào 21/05/2026",
    },
    {
      jobId: 103,
      title: "AI Specialist / Python Software Architect",
      companyName: "VinAI Research",
      location: "Hà Nội • Linh hoạt",
      salaryRange: "50-80 triệu",
      viewedDate: "Xem vào 20/05/2026",
    },
  ];

  return (
    <Stack spacing={3.5}>
      {/* HEADER CARD WITH TABS */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="h5" fontWeight={900} color="#0f172a" mb={3} sx={{ fontSize: "1.4rem" }}>
          Việc làm của tôi
        </Typography>

        {/* Tab Links Row */}
        <Stack direction="row" spacing={3} sx={{ borderBottom: "1.5px solid #f1f5f9", pb: 0 }}>
          {/* Tab 1: Đã ứng tuyển */}
          <Box
            onClick={() => setSubTab("applied")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "applied" ? "#ef4444" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            <Typography variant="subtitle2" fontWeight={subTab === "applied" ? 850 : 650}>
              Đã ứng tuyển
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.1,
                borderRadius: "10px",
                bgcolor: subTab === "applied" ? "#ef4444" : "#f1f5f9",
                color: subTab === "applied" ? "#ffffff" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              {appliedJobs.length || appliedCount}
            </Box>
            {subTab === "applied" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2.5px",
                  bgcolor: "#ef4444",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Tab 2: Đã lưu */}
          <Box
            onClick={() => setSubTab("saved")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "saved" ? "#ef4444" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            <Typography variant="subtitle2" fontWeight={subTab === "saved" ? 850 : 650}>
              Đã lưu
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.1,
                borderRadius: "10px",
                bgcolor: subTab === "saved" ? "#ef4444" : "#f1f5f9",
                color: subTab === "saved" ? "#ffffff" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              {savedJobs.length || savedCount}
            </Box>
            {subTab === "saved" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2.5px",
                  bgcolor: "#ef4444",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Tab 3: Đã xem gần đây */}
          <Box
            onClick={() => setSubTab("viewed")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "viewed" ? "#ef4444" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            <Typography variant="subtitle2" fontWeight={subTab === "viewed" ? 850 : 650}>
              Đã xem gần đây
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.1,
                borderRadius: "10px",
                bgcolor: subTab === "viewed" ? "#ef4444" : "#f1f5f9",
                color: subTab === "viewed" ? "#ffffff" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              20
            </Box>
            {subTab === "viewed" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2.5px",
                  bgcolor: "#ef4444",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>
        </Stack>
      </Paper>

      {/* FILTER & INFO BAR */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        spacing={2}
        sx={{ px: 1 }}
      >
        <Stack direction="row" spacing={1} alignItems="center" color="#64748b">
          <InfoOutlined fontSize="small" sx={{ color: "#94a3b8" }} />
          <Typography variant="caption" sx={{ fontSize: "0.8rem", fontWeight: 550 }}>
            {subTab === "applied" && "Các công việc bạn đã ứng tuyển được lưu trữ trong 12 tháng gần đây."}
            {subTab === "saved" && "Các công việc bạn đã lưu để xem lại hoặc ứng tuyển sau."}
            {subTab === "viewed" && "Các công việc bạn đã chủ động tìm hiểu và xem thông tin gần đây."}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="caption" color="text.secondary" fontWeight={700}>
            Sắp xếp theo:
          </Typography>
          <Select
            value="newest"
            size="small"
            IconComponent={KeyboardArrowDown}
            sx={{
              bgcolor: "white",
              borderRadius: 2.5,
              fontWeight: 700,
              fontSize: "0.8rem",
              minWidth: 180,
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
              border: "1px solid #e2e8f0",
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            <MenuItem value="newest" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Ngày ứng tuyển gần nhất</MenuItem>
            <MenuItem value="oldest" sx={{ fontSize: "0.8rem", fontWeight: 600 }}>Cũ nhất</MenuItem>
          </Select>
        </Stack>
      </Stack>

      {/* TABS CONTENT MANAGER */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#ef4444" }} />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          {/* ==================== SUB-TAB: ĐÃ ỨNG TUYỂN ==================== */}
          {subTab === "applied" &&
            (appliedJobs.length === 0 ? (
              <Paper sx={{ p: 6, textCenter: "center", border: "1px dashed #e2e8f0", borderRadius: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>Bạn chưa ứng tuyển công việc nào gần đây.</Typography>
              </Paper>
            ) : (
              appliedJobs.map((app) => {
                const isFailed = app.status === "REJECTED";
                const isPending = app.status === "PENDING";
                const isReviewed = app.status === "REVIEWING" || app.status === "ACCEPTED";

                return (
                  <Paper
                    key={app.applicationId}
                    sx={{
                      borderRadius: 4,
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      bgcolor: "#ffffff",
                      boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
                      transition: "0.25s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
                      },
                    }}
                  >
                    {/* Top Job Details section */}
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2} alignItems="center">
                        {/* Logo */}
                        <Grid item>
                          <Avatar
                            src={getMediaUrl(app.job.companyLogo)}
                            variant="rounded"
                            sx={{ width: 62, height: 62, bgcolor: "#f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
                          >
                            {app.job.companyName?.charAt(0).toUpperCase()}
                          </Avatar>
                        </Grid>

                        {/* Mid Info */}
                        <Grid item xs={12} sm sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body1"
                            fontWeight={850}
                            color="#0f172a"
                            mb={0.5}
                            sx={{
                              fontSize: "0.98rem",
                              cursor: "pointer",
                              "&:hover": { color: "#ef4444" },
                            }}
                            onClick={() => navigate(`/job/${app.job.jobId}`)}
                          >
                            {app.job.title}
                          </Typography>
                          <Typography variant="body2" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.75rem", mb: 1 }}>
                            {app.job.companyName}
                          </Typography>

                          <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748b" }}>
                              <RoomOutlined sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={600}>{app.job.location || "Toàn quốc"}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#16a34a" }}>
                              <MonetizationOnOutlined sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={800}>{app.job.salaryRange || "Thỏa thuận"}</Typography>
                            </Box>
                          </Stack>
                        </Grid>

                        {/* Right Actions */}
                        <Grid item xs={12} sm="auto" sx={{ textAlign: { sm: "right" } }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={600}>
                            Ứng tuyển vào {new Date(app.applyDate).toLocaleDateString("vi-VN")}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/job/${app.job.jobId}`)}
                            sx={{
                              borderColor: "#e2e8f0",
                              color: "#475569",
                              bgcolor: "#f8fafc",
                              textTransform: "none",
                              fontWeight: 800,
                              borderRadius: 2,
                              fontSize: "0.8rem",
                              px: 2,
                              py: 0.7,
                              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f1f5f9" },
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Bottom Status bar matching screenshot design */}
                    {isReviewed && (
                      <Box sx={{ bgcolor: "#f0fdf4", py: 1.2, px: 3, borderTop: "1px solid #dcfce7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" fontWeight={800} color="#16a34a" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          ✓ Nhà tuyển dụng đã xem hồ sơ
                        </Typography>
                        <KeyboardArrowDown sx={{ color: "#16a34a", fontSize: 18 }} />
                      </Box>
                    )}

                    {isFailed && (
                      <Box sx={{ bgcolor: "#f8fafc", py: 1.2, px: 3, borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" fontWeight={800} color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          ⊖ Gửi hồ sơ không thành công
                        </Typography>
                        <KeyboardArrowDown sx={{ color: "#64748b", fontSize: 18 }} />
                      </Box>
                    )}

                    {isPending && (
                      <Box sx={{ bgcolor: "#fffbeb", py: 1.2, px: 3, borderTop: "1px solid #fef3c7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="caption" fontWeight={800} color="#d97706" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                          ⌛ Hồ sơ đang trong hàng chờ
                        </Typography>
                        <KeyboardArrowDown sx={{ color: "#d97706", fontSize: 18 }} />
                      </Box>
                    )}
                  </Paper>
                );
              })
            ))}

          {/* ==================== SUB-TAB: ĐÃ LƯU (SAVED) ==================== */}
          {subTab === "saved" &&
            (savedJobs.length === 0 ? (
              <Paper sx={{ p: 6, textCenter: "center", border: "1px dashed #e2e8f0", borderRadius: 4, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary" fontWeight={600}>Bạn chưa lưu công việc nào gần đây.</Typography>
              </Paper>
            ) : (
              savedJobs.map((job) => (
                <Paper
                  key={job.jobId}
                  sx={{
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                    p: 3,
                    bgcolor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
                    transition: "0.25s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
                    },
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Logo */}
                    <Grid item>
                      <Avatar
                        src={getMediaUrl(job.companyLogo)}
                        variant="rounded"
                        sx={{ width: 62, height: 62, bgcolor: "#f1f5f9" }}
                      >
                        {job.companyName?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Grid>

                    {/* Mid Info */}
                    <Grid item xs={12} sm sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        fontWeight={850}
                        color="#0f172a"
                        mb={0.5}
                        sx={{
                          fontSize: "0.98rem",
                          cursor: "pointer",
                          "&:hover": { color: "#ef4444" },
                        }}
                        onClick={() => navigate(`/job/${job.jobId}`)}
                      >
                        {job.title}
                      </Typography>
                      <Typography variant="body2" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.75rem", mb: 1 }}>
                        {job.companyName}
                      </Typography>

                      <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748b" }}>
                          <RoomOutlined sx={{ fontSize: 16 }} />
                          <Typography variant="caption" fontWeight={600}>{job.location || "Toàn quốc"}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#16a34a" }}>
                          <MonetizationOnOutlined sx={{ fontSize: 16 }} />
                          <Typography variant="caption" fontWeight={800}>{job.salaryRange || "Thỏa thuận"}</Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    {/* Right Actions */}
                    <Grid item xs={12} sm="auto" sx={{ textAlign: { sm: "right" } }}>
                      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent={{ xs: "flex-start", sm: "flex-end" }}>
                        <IconButton
                          onClick={(e) => handleToggleFavorite(e, job.jobId)}
                          sx={{
                            border: "1px solid #fee2e2",
                            color: "#ef4444",
                            bgcolor: "#fff5f5",
                            "&:hover": { bgcolor: "#fee2e2" },
                          }}
                        >
                          <Favorite fontSize="small" />
                        </IconButton>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => navigate(`/job/${job.jobId}`)}
                          sx={{
                            bgcolor: "#ef4444",
                            textTransform: "none",
                            fontWeight: 800,
                            borderRadius: 2.5,
                            fontSize: "0.8rem",
                            px: 2.5,
                            py: 0.8,
                            "&:hover": { bgcolor: "#dc2626" },
                          }}
                        >
                          Ứng tuyển ngay
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              ))
            ))}

          {/* ==================== SUB-TAB: ĐÃ XEM GẦN ĐÂY (VIEWED) ==================== */}
          {subTab === "viewed" &&
            mockViewedJobs.map((job) => (
              <Paper
                key={job.jobId}
                sx={{
                  borderRadius: 4,
                  border: "1px solid #e2e8f0",
                  p: 3,
                  bgcolor: "#ffffff",
                  boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
                  transition: "0.25s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.03)",
                  },
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  {/* Logo */}
                  <Grid item>
                    <Avatar variant="rounded" sx={{ width: 62, height: 62, bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800 }}>
                      {job.companyName?.charAt(0).toUpperCase()}
                    </Avatar>
                  </Grid>

                  {/* Mid Info */}
                  <Grid item xs={12} sm sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      fontWeight={850}
                      color="#0f172a"
                      mb={0.5}
                      sx={{
                        fontSize: "0.98rem",
                        cursor: "pointer",
                        "&:hover": { color: "#ef4444" },
                      }}
                      onClick={() => navigate(`/job/${job.jobId}`)}
                    >
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", fontSize: "0.75rem", mb: 1 }}>
                      {job.companyName}
                    </Typography>

                    <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#64748b" }}>
                        <RoomOutlined sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600}>{job.location || "Toàn quốc"}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#16a34a" }}>
                        <MonetizationOnOutlined sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={800}>{job.salaryRange || "Thỏa thuận"}</Typography>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Right Actions */}
                  <Grid item xs={12} sm="auto" sx={{ textAlign: { sm: "right" } }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1} fontWeight={600}>
                      {job.viewedDate}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate(`/job/${job.jobId}`)}
                      sx={{
                        borderColor: "#e2e8f0",
                        color: "#2563eb",
                        bgcolor: "#f0f7ff",
                        textTransform: "none",
                        fontWeight: 800,
                        borderRadius: 2,
                        fontSize: "0.8rem",
                        px: 2,
                        py: 0.7,
                        "&:hover": { borderColor: "#cbd5e1", bgcolor: "#e0f2fe" },
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
        </Stack>
      )}
    </Stack>
  );
}
