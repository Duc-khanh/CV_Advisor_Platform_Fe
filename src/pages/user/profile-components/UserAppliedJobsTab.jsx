import React, { useEffect, useState } from "react";
import api from "../../../services/axios";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  Paper,
  CircularProgress,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Modal,
  Alert,
  Tooltip
} from "@mui/material";
import {
  CalendarMonth,
  AccessTime,
  LocationOn,
  VideoCameraFront,
  Person,
  Notes,
  OpenInNew,
  Close,
  EventAvailable,
  Visibility,
  Description,
  DeleteOutline,
  WorkOutline,
  FilterList,
  RoomOutlined,
  MonetizationOnOutlined,
  InfoOutlined,
  Download
} from "@mui/icons-material";
import { useToast } from "../../../contexts/ToastContext";
import { getCvUrl } from "../../../utils/urlHelpers";

export default function UserAppliedJobsTab({
  appliedCount = 0,
  savedCount = 0,
  setActiveTab
}) {
  const [subTab, setSubTab] = useState("applied"); // 'applied' | 'interviews' | 'saved' | 'viewed'
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----- PHÂN TRANG & BỘ LỌC TRẠNG THÁI -----
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ----- MODAL XEM CHI TIẾT LỊCH PHỎNG VẤN -----
  const [selectedInterviewApp, setSelectedInterviewApp] = useState(null);
  const [openInterviewModal, setOpenInterviewModal] = useState(false);

  // ----- MODAL XEM CV ĐÃ NỘP (DÙNG BLOB URL ĐẢM BẢO GỬI ĐỦ TOKEN) -----
  const [viewCvUrl, setViewCvUrl] = useState(null);
  const [openCvModal, setOpenCvModal] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);

  const navigate = useNavigate();
  const showToast = useToast();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const fetchAppliedJobs = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/user/jobs/apply/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng tuyển", err);
    }
  };

  const fetchSavedJobs = async () => {
    const authHeader = getAuthHeader();
    try {
      const res = await api.get("/api/user/jobs/favorite/all", {
        headers: authHeader,
      });
      setSavedJobs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách yêu thích", err);
    }
  };

  const handleToggleFavorite = async (e, jobId) => {
    e.stopPropagation();
    const authHeader = getAuthHeader();
    try {
      await api.delete(`/api/user/jobs/favorite/${jobId}`, {
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

  // Xử lý chuyển Sub-Tab
  const handleSubTabChange = (newTab) => {
    setSubTab(newTab);
    setPage(0);
  };

  // Mở modal lịch hẹn
  const handleViewInterview = (app) => {
    setSelectedInterviewApp(app);
    setOpenInterviewModal(true);
  };

  // Mở modal xem CV - Sử dụng axios api.get với responseType 'blob' để truyền đầy đủ Header Token
  const handleViewCv = async (cvFileUrl) => {
    if (!cvFileUrl) {
      showToast("Không tìm thấy đường dẫn file CV", "warning");
      return;
    }
    setOpenCvModal(true);
    setCvLoading(true);
    setViewCvUrl(null);

    try {
      const url = cvFileUrl.startsWith("/") ? cvFileUrl : `/${cvFileUrl}`;
      const response = await api.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf",
      });
      const blobUrl = URL.createObjectURL(blob);
      setViewCvUrl(blobUrl);
    } catch (err) {
      console.error("Lỗi tải CV:", err);
      showToast("Không thể tải file CV. Vui lòng kiểm tra lại quyền truy cập.", "error");
    } finally {
      setCvLoading(false);
    }
  };

  const handleCloseCvModal = () => {
    if (viewCvUrl && viewCvUrl.startsWith("blob:")) {
      URL.revokeObjectURL(viewCvUrl);
    }
    setViewCvUrl(null);
    setOpenCvModal(false);
  };

  const formatDateTime = (val) => {
    if (!val) return "Chưa xác định";
    try {
      const d = new Date(val);
      return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ngày ${d.toLocaleDateString("vi-VN")}`;
    } catch {
      return String(val);
    }
  };

  // Danh sách các đơn có lịch phỏng vấn
  const interviewJobs = appliedJobs.filter(
    (app) => app.status === "INTERVIEW" || app.interview
  );

  // Danh sách đơn ứng tuyển đã lọc theo trạng thái
  const filteredAppliedJobs = appliedJobs.filter((app) => {
    if (statusFilter === "ALL") return true;
    return app.status?.toUpperCase() === statusFilter.toUpperCase();
  });

  // Danh sách việc làm đã xem gần đây (lấy từ localStorage thực tế)
  const [viewedJobs, setViewedJobs] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('recent_viewed_jobs') || '[]');
      setViewedJobs(Array.isArray(stored) ? stored : []);
    } catch {
      setViewedJobs([]);
    }
  }, [subTab]);

  // Helper render Chip trạng thái căn giữa
  const getStatusChip = (status, interview) => {
    const statusMap = {
      "PENDING": { label: "Chờ xử lý", bgcolor: "#fef3c7", textColor: "#92400e" },
      "REVIEWED": { label: "Đã xem hồ sơ", bgcolor: "#f1f5f9", textColor: "#475569" },
      "REVIEWING": { label: "Đang xem xét", bgcolor: "#e0f2fe", textColor: "#0369a1" },
      "INTERVIEW": { label: "Mời phỏng vấn", bgcolor: "#e0f2fe", textColor: "#0284c7" },
      "ACCEPTED": { label: "Đã trúng tuyển", bgcolor: "#dcfce7", textColor: "#166534" },
      "REJECTED": { label: "Từ chối", bgcolor: "#fee2e2", textColor: "#991b1b" },
    };
    const key = (status || "").toUpperCase();
    const config = statusMap[key] || { label: status || "Chờ xử lý", bgcolor: "#f1f5f9", textColor: "#475569" };

    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}>
        <Chip
          label={config.label}
          size="small"
          sx={{ fontWeight: 700, bgcolor: config.bgcolor, color: config.textColor, borderRadius: 1.5, px: 0.8 }}
        />
        {interview?.startTime && (
          <Typography variant="caption" sx={{ color: "#0284c7", fontWeight: 700, fontSize: "0.73rem", whiteSpace: "nowrap" }}>
            ⏰ {new Date(interview.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}{" - "}{new Date(interview.startTime).toLocaleDateString("vi-VN")}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
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
        <Stack direction="row" spacing={3} sx={{ borderBottom: "1.5px solid #f1f5f9", pb: 0, overflowX: "auto" }}>
          {/* Tab 1: Đã ứng tuyển */}
          <Box
            onClick={() => handleSubTabChange("applied")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "applied" ? "#0284c7" : "#64748b",
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
                bgcolor: subTab === "applied" ? "#0284c7" : "#f1f5f9",
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
                  bgcolor: "#0284c7",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Tab 2: Lịch phỏng vấn */}
          <Box
            onClick={() => handleSubTabChange("interviews")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "interviews" ? "#0284c7" : "#64748b",
              transition: "all 0.2s ease",
            }}
          >
            <Typography variant="subtitle2" fontWeight={subTab === "interviews" ? 850 : 650}>
              Lịch phỏng vấn
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.1,
                borderRadius: "10px",
                bgcolor: subTab === "interviews" ? "#0284c7" : "#f1f5f9",
                color: subTab === "interviews" ? "#ffffff" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              {interviewJobs.length}
            </Box>
            {subTab === "interviews" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2.5px",
                  bgcolor: "#0284c7",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Tab 3: Đã lưu */}
          <Box
            onClick={() => handleSubTabChange("saved")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "saved" ? "#0284c7" : "#64748b",
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
                bgcolor: subTab === "saved" ? "#0284c7" : "#f1f5f9",
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
                  bgcolor: "#0284c7",
                  borderRadius: "2px",
                }}
              />
            )}
          </Box>

          {/* Tab 4: Đã xem gần đây */}
          <Box
            onClick={() => handleSubTabChange("viewed")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              pb: 2,
              cursor: "pointer",
              position: "relative",
              color: subTab === "viewed" ? "#0284c7" : "#64748b",
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
                bgcolor: subTab === "viewed" ? "#0284c7" : "#f1f5f9",
                color: subTab === "viewed" ? "#ffffff" : "#64748b",
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              {viewedJobs.length}
            </Box>
            {subTab === "viewed" && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: -1,
                  left: 0,
                  width: "100%",
                  height: "2.5px",
                  bgcolor: "#0284c7",
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
          <InfoOutlined fontSize="small" sx={{ color: "#0284c7" }} />
          <Typography variant="caption" sx={{ fontSize: "0.82rem", fontWeight: 600 }}>
            {subTab === "applied" && "Danh sách các công việc bạn đã nộp hồ sơ ứng tuyển."}
            {subTab === "interviews" && "Danh sách các buổi phỏng vấn đã được nhà tuyển dụng lên lịch."}
            {subTab === "saved" && "Các công việc bạn đã lưu để xem lại hoặc ứng tuyển sau."}
            {subTab === "viewed" && "Các công việc bạn đã chủ động tìm hiểu và xem thông tin gần đây."}
          </Typography>
        </Stack>

        {subTab === "applied" && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="status-filter-label" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
              Lọc theo trạng thái
            </InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Lọc theo trạng thái"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              startAdornment={<FilterList sx={{ mr: 1, color: "#0284c7", fontSize: 18 }} />}
              sx={{ borderRadius: 2, bgcolor: "white", fontSize: "0.85rem", fontWeight: 700 }}
            >
              <MenuItem value="ALL">Tất cả ({appliedJobs.length})</MenuItem>
              <MenuItem value="PENDING">Chờ xử lý</MenuItem>
              <MenuItem value="REVIEWING">Đang xem xét</MenuItem>
              <MenuItem value="INTERVIEW">Mời phỏng vấn</MenuItem>
              <MenuItem value="ACCEPTED">Đã trúng tuyển</MenuItem>
              <MenuItem value="REJECTED">Từ chối</MenuItem>
            </Select>
          </FormControl>
        )}
      </Stack>

      {/* BẢNG DỮ LIỆU & PHÂN TRANG */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#0284c7" }} />
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            bgcolor: "#ffffff",
          }}
        >
          {/* ==================== 1. BẢNG: ĐÃ ỨNG TUYỂN ==================== */}
          {subTab === "applied" && (
            <>
              {filteredAppliedJobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <WorkOutline sx={{ fontSize: 50, color: "#cbd5e1", mb: 1.5 }} />
                  <Typography variant="body1" fontWeight={700} color="#64748b">
                    Không tìm thấy đơn ứng tuyển nào phù hợp.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 60, py: 1.8 }}>
                            STT
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 260, py: 1.8 }}>
                            Vị trí & Công ty
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 120, py: 1.8 }}>
                            Ngày nộp
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 140, py: 1.8 }}>
                            Mức lương
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 180, py: 1.8 }}>
                            Trạng thái
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 160, py: 1.8 }}>
                            Thao tác
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredAppliedJobs
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((app, idx) => (
                            <TableRow key={app.applicationId} hover>
                              <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b", verticalAlign: "middle" }}>
                                {page * rowsPerPage + idx + 1}
                              </TableCell>
                              <TableCell sx={{ verticalAlign: "middle" }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={800}
                                  color="#0f172a"
                                  sx={{
                                    cursor: "pointer",
                                    "&:hover": { color: "#0284c7" },
                                    display: "inline-block",
                                  }}
                                  onClick={() => navigate(`/job/${app.job?.jobId}`)}
                                >
                                  {app.job?.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="#64748b"
                                  fontWeight={700}
                                  sx={{ textTransform: "uppercase", mt: 0.3 }}
                                >
                                  {app.job?.companyName}
                                </Typography>
                                {app.job?.location && (
                                  <Typography variant="caption" color="#64748b" sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, mt: 0.4, whiteSpace: "nowrap" }}>
                                    <RoomOutlined sx={{ fontSize: 13, color: "#94a3b8" }} />
                                    {app.job.location}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Typography variant="body2" color="#475569" fontWeight={600}>
                                  {new Date(app.applyDate).toLocaleDateString("vi-VN")}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Typography variant="body2" color="#16a34a" fontWeight={700}>
                                  {app.job?.salaryRange || "Thỏa thuận"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                {getStatusChip(app.status, app.interview)}
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Stack direction="row" spacing={0.8} justifyContent="center" alignItems="center">
                                  {app.interview && (
                                    <Tooltip title="Xem lịch hẹn phỏng vấn" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleViewInterview(app)}
                                        sx={{
                                          color: "#0284c7",
                                          bgcolor: "#f0f9ff",
                                          border: "1px solid #bae6fd",
                                          p: "6px",
                                          "&:hover": { bgcolor: "#e0f2fe", borderColor: "#0284c7" },
                                        }}
                                      >
                                        <CalendarMonth sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                  {app.interview?.locationOrLink && app.interview?.interviewType !== "OFFLINE" && (
                                    <Tooltip title="Vào phòng họp trực tuyến (Google Meet / Zoom)" arrow>
                                      <IconButton
                                        size="small"
                                        component="a"
                                        href={app.interview.locationOrLink.startsWith("http") ? app.interview.locationOrLink : `https://${app.interview.locationOrLink}`}
                                        target="_blank"
                                        sx={{
                                          color: "#ffffff",
                                          background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                                          p: "6px",
                                          boxShadow: "0 2px 6px rgba(14,165,233,0.3)",
                                          "&:hover": { background: "linear-gradient(135deg, #0284c7, #1d4ed8)" },
                                        }}
                                      >
                                        <VideoCameraFront sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}



                                  {app.cvFileUrl && (
                                    <Tooltip title="Xem lại file CV đã nộp" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleViewCv(app.cvFileUrl)}
                                        sx={{
                                          color: "#475569",
                                          bgcolor: "#f8fafc",
                                          border: "1px solid #e2e8f0",
                                          p: "6px",
                                          "&:hover": { color: "#2563eb", borderColor: "#2563eb", bgcolor: "#eff6ff" },
                                        }}
                                      >
                                        <Description sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredAppliedJobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                  />
                </>
              )}
            </>
          )}

          {/* ==================== 2. BẢNG: LỊCH PHỎNG VẤN ==================== */}
          {subTab === "interviews" && (
            <>
              {interviewJobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <EventAvailable sx={{ fontSize: 50, color: "#cbd5e1", mb: 1.5 }} />
                  <Typography variant="body1" fontWeight={700} color="#64748b">
                    Bạn chưa có lịch hẹn phỏng vấn nào gần đây.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 60, py: 1.8 }}>
                            STT
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 240, py: 1.8 }}>
                            Vị trí & Công ty
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 170, py: 1.8 }}>
                            Vòng phỏng vấn
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 180, py: 1.8 }}>
                            Thời gian
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 160, py: 1.8 }}>
                            Hình thức
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 90, py: 1.8 }}>
                            Thao tác
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {interviewJobs
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((app, idx) => {
                            const iv = app.interview;
                            const isOnline = iv?.interviewType !== "OFFLINE";
                            const meetLink = iv?.locationOrLink;

                            return (
                              <TableRow key={app.applicationId} hover>
                                <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b", verticalAlign: "middle" }}>
                                  {page * rowsPerPage + idx + 1}
                                </TableCell>
                                <TableCell sx={{ verticalAlign: "middle" }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={800}
                                    color="#0f172a"
                                    sx={{ cursor: "pointer", "&:hover": { color: "#0284c7" } }}
                                    onClick={() => navigate(`/job/${app.job?.jobId}`)}
                                  >
                                    {app.job?.title}
                                  </Typography>
                                  <Typography variant="caption" display="block" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", mt: 0.3 }}>
                                    {app.job?.companyName}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                  <Chip
                                    label={iv?.roundName || "Phỏng vấn tuyển dụng"}
                                    size="small"
                                    sx={{ bgcolor: "#f0f9ff", color: "#0369a1", fontWeight: 700, borderRadius: 1.5 }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                  <Typography variant="body2" fontWeight={700} color="#0f172a">
                                    {formatDateTime(iv?.startTime)}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                  <Chip
                                    icon={isOnline ? <VideoCameraFront sx={{ fontSize: "16px !important" }} /> : <LocationOn sx={{ fontSize: "16px !important" }} />}
                                    label={isOnline ? "Trực tuyến" : "Tại văn phòng"}
                                    size="small"
                                    sx={{
                                      bgcolor: isOnline ? "#e0f2fe" : "#ffe4e6",
                                      color: isOnline ? "#0284c7" : "#e11d48",
                                      fontWeight: 700,
                                      borderRadius: 1.5,
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                  <Stack direction="row" spacing={0.8} justifyContent="center" alignItems="center">
                                    {isOnline && meetLink && (
                                      <Tooltip title="Vào phòng họp trực tuyến" arrow>
                                        <IconButton
                                          size="small"
                                          component="a"
                                          href={meetLink.startsWith("http") ? meetLink : `https://${meetLink}`}
                                          target="_blank"
                                          sx={{
                                            color: "white",
                                            background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                                            p: "6px",
                                            "&:hover": { background: "linear-gradient(135deg, #0284c7, #1d4ed8)" },
                                          }}
                                        >
                                          <VideoCameraFront sx={{ fontSize: 18 }} />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    <Tooltip title="Xem chi tiết lịch hẹn" arrow>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleViewInterview(app)}
                                        sx={{
                                          color: "#0284c7",
                                          bgcolor: "#f0f9ff",
                                          border: "1px solid #bae6fd",
                                          p: "6px",
                                          "&:hover": { borderColor: "#0284c7", bgcolor: "#e0f2fe" },
                                        }}
                                      >
                                        <CalendarMonth sx={{ fontSize: 18 }} />
                                      </IconButton>
                                    </Tooltip>

                                  </Stack>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={interviewJobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                  />
                </>
              )}
            </>
          )}

          {/* ==================== 3. BẢNG: ĐÃ LƯU ==================== */}
          {subTab === "saved" && (
            <>
              {savedJobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="body1" fontWeight={700} color="#64748b">
                    Bạn chưa lưu công việc nào gần đây.
                  </Typography>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 60, py: 1.8 }}>
                            STT
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 260, py: 1.8 }}>
                            Vị trí & Công ty
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 170, py: 1.8 }}>
                            Địa điểm
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 150, py: 1.8 }}>
                            Mức lương
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 90, py: 1.8 }}>
                            Thao tác
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {savedJobs
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((job, idx) => (
                            <TableRow key={job.jobId} hover>
                              <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b", verticalAlign: "middle" }}>
                                {page * rowsPerPage + idx + 1}
                              </TableCell>
                              <TableCell sx={{ verticalAlign: "middle" }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={850}
                                  color="#0f172a"
                                  sx={{ cursor: "pointer", "&:hover": { color: "#0284c7" } }}
                                  onClick={() => navigate(`/job/${job.jobId}`)}
                                >
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" display="block" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", mt: 0.3 }}>
                                  {job.companyName}
                                </Typography>
                              </TableCell>
                              <TableCell align="left" sx={{ verticalAlign: "middle" }}>
                                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
                                  <RoomOutlined sx={{ fontSize: 16, color: "#64748b", flexShrink: 0 }} />
                                  <Typography variant="body2" color="#334155" fontWeight={500} sx={{ whiteSpace: "nowrap" }}>
                                    {job.location || "Toàn quốc"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Typography variant="body2" color="#16a34a" fontWeight={700}>
                                  {job.salaryRange || "Thỏa thuận"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Stack direction="row" spacing={0.8} justifyContent="center" alignItems="center">

                                  <Tooltip title="Bỏ lưu việc làm này" arrow>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={(e) => handleToggleFavorite(e, job.jobId)}
                                      sx={{
                                        bgcolor: "#fff1f2",
                                        border: "1px solid #fecdd3",
                                        p: "6px",
                                        "&:hover": { bgcolor: "#fee2e2" },
                                      }}
                                    >
                                      <DeleteOutline sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={savedJobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                  />
                </>
              )}
            </>
          )}

          {/* ==================== 4. BẢNG: ĐÃ XEM GẦN ĐÂY ==================== */}
          {/* ==================== 4. BẢNG: ĐÃ XEM GẦN ĐÂY ==================== */}
          {subTab === "viewed" && (
            <>
              {viewedJobs.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <WorkOutline sx={{ fontSize: 50, color: "#cbd5e1", mb: 1.5 }} />
                  <Typography variant="body1" fontWeight={700} color="#64748b" mb={1}>
                    Bạn chưa xem công việc nào gần đây.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/jobs")}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700, borderColor: "#0284c7", color: "#0284c7", mt: 1 }}
                  >
                    Khám phá việc làm ngay
                  </Button>
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: "#f8fafc" }}>
                        <TableRow>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 60, py: 1.8 }}>
                            STT
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 260, py: 1.8 }}>
                            Vị trí & Công ty
                          </TableCell>
                          <TableCell align="left" sx={{ fontWeight: 800, color: "#475569", minWidth: 170, py: 1.8 }}>
                            Địa điểm
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 150, py: 1.8 }}>
                            Mức lương
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 140, py: 1.8 }}>
                            Ngày xem
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {viewedJobs
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((job, idx) => (
                            <TableRow key={job.jobId} hover>
                              <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b", verticalAlign: "middle" }}>
                                {page * rowsPerPage + idx + 1}
                              </TableCell>
                              <TableCell sx={{ verticalAlign: "middle" }}>
                                <Typography
                                  variant="body2"
                                  fontWeight={850}
                                  color="#0f172a"
                                  sx={{ cursor: "pointer", "&:hover": { color: "#0284c7" } }}
                                  onClick={() => navigate(`/job/${job.jobId}`)}
                                >
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" display="block" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", mt: 0.3 }}>
                                  {job.companyName}
                                </Typography>
                              </TableCell>
                              <TableCell align="left" sx={{ verticalAlign: "middle" }}>
                                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
                                  <RoomOutlined sx={{ fontSize: 16, color: "#64748b", flexShrink: 0 }} />
                                  <Typography variant="body2" color="#334155" fontWeight={500} sx={{ whiteSpace: "nowrap" }}>
                                    {job.location || "Toàn quốc"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Typography variant="body2" color="#16a34a" fontWeight={700}>
                                  {job.salaryRange || "Thỏa thuận"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ verticalAlign: "middle" }}>
                                <Typography variant="body2" color="#64748b">
                                  {job.viewedDate || "Gần đây"}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={viewedJobs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    sx={{ borderTop: "1px solid #e2e8f0" }}
                  />
                </>
              )}
            </>
          )}
        </Paper>
      )}

      {/* DIALOG CHI TIẾT LỊCH PHỎNG VẤN */}
      <Dialog
        open={openInterviewModal}
        onClose={() => setOpenInterviewModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
            color: "white",
            py: 2.2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CalendarMonth sx={{ fontSize: 24 }} />
            <Typography variant="h6" fontWeight={800}>
              Thông tin chi tiết lịch phỏng vấn
            </Typography>
          </Stack>
          <IconButton onClick={() => setOpenInterviewModal(false)} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 3 }}>
          {selectedInterviewApp?.interview && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: "#f0f9ff", borderRadius: 2, border: "1px solid #bae6fd" }}>
                <Typography variant="subtitle1" fontWeight={800} color="#0369a1">
                  {selectedInterviewApp.job?.title}
                </Typography>
                <Typography variant="body2" color="#0284c7" fontWeight={600}>
                  {selectedInterviewApp.job?.companyName}
                </Typography>
                <Typography variant="caption" display="block" color="#64748b" sx={{ mt: 0.5 }}>
                  Vòng: <strong>{selectedInterviewApp.interview.roundName || "Phỏng vấn tuyển dụng"}</strong>
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <AccessTime sx={{ color: "#0284c7", fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#64748b">Thời gian bắt đầu</Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {formatDateTime(selectedInterviewApp.interview.startTime)}
                    </Typography>
                  </Box>
                </Stack>

                {selectedInterviewApp.interview.endTime && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <AccessTime sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="#64748b">Thời gian kết thúc (dự kiến)</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {formatDateTime(selectedInterviewApp.interview.endTime)}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  {selectedInterviewApp.interview.interviewType === "OFFLINE" ? (
                    <LocationOn sx={{ color: "#e11d48", fontSize: 20, mt: 0.2 }} />
                  ) : (
                    <VideoCameraFront sx={{ color: "#0284c7", fontSize: 20, mt: 0.2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="#64748b">
                      Hình thức & {selectedInterviewApp.interview.interviewType === "OFFLINE" ? "Địa điểm" : "Link cuộc họp"}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {selectedInterviewApp.interview.interviewType === "OFFLINE"
                        ? "Phỏng vấn trực tiếp tại văn phòng"
                        : "Phỏng vấn trực tuyến (Online Meeting)"}
                    </Typography>

                    {selectedInterviewApp.interview.locationOrLink ? (
                      selectedInterviewApp.interview.interviewType === "OFFLINE" ? (
                        <Typography
                          variant="body2"
                          color="#334155"
                          sx={{ mt: 0.5, bgcolor: "#f8fafc", p: 1, borderRadius: 1.5, border: "1px solid #e2e8f0" }}
                        >
                          {selectedInterviewApp.interview.locationOrLink}
                        </Typography>
                      ) : (
                        <Box sx={{ mt: 1.5 }}>
                          <Button
                            variant="contained"
                            component="a"
                            href={
                              selectedInterviewApp.interview.locationOrLink.startsWith("http")
                                ? selectedInterviewApp.interview.locationOrLink
                                : `https://${selectedInterviewApp.interview.locationOrLink}`
                            }
                            target="_blank"
                            startIcon={<OpenInNew />}
                            sx={{
                              background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                              color: "white",
                              fontWeight: 800,
                              textTransform: "none",
                              borderRadius: 2,
                              px: 2.5,
                              py: 0.8,
                              boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
                              "&:hover": {
                                background: "linear-gradient(135deg, #0284c7, #1d4ed8)",
                              },
                            }}
                          >
                            👉 Tham gia phỏng vấn ngay
                          </Button>
                          <Typography variant="caption" display="block" color="#64748b" sx={{ mt: 0.8, wordBreak: "break-all" }}>
                            Đường dẫn:{" "}
                            <a
                              href={
                                selectedInterviewApp.interview.locationOrLink.startsWith("http")
                                  ? selectedInterviewApp.interview.locationOrLink
                                  : `https://${selectedInterviewApp.interview.locationOrLink}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#0284c7", fontWeight: 600 }}
                            >
                              {selectedInterviewApp.interview.locationOrLink}
                            </a>
                          </Typography>
                        </Box>
                      )
                    ) : (
                      <Typography variant="caption" color="#e11d48" sx={{ mt: 0.5, display: "block", fontStyle: "italic" }}>
                        Nhà tuyển dụng sẽ gửi link cuộc họp trước giờ bắt đầu.
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {selectedInterviewApp.interview.interviewerName && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Person sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="#64748b">Người phỏng vấn</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {selectedInterviewApp.interview.interviewerName}
                        {selectedInterviewApp.interview.interviewerEmail ? ` (${selectedInterviewApp.interview.interviewerEmail})` : ""}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                {selectedInterviewApp.interview.notes && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Notes sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#64748b">Ghi chú từ Nhà tuyển dụng</Typography>
                      <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0", mt: 0.5 }}>
                        <Typography variant="body2" color="#334155">
                          {selectedInterviewApp.interview.notes}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                )}
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 2, fontSize: "0.82rem" }}>
                Vui lòng chuẩn bị trang phục lịch sự và kiểm tra kết nối mạng, micro, camera trước giờ phỏng vấn ít nhất 5-10 phút.
              </Alert>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3, borderTop: "1px solid #e2e8f0", bgcolor: "#f8fafc" }}>
          <Button onClick={() => setOpenInterviewModal(false)} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* CV VIEWER MODAL - DÙNG BLOB URL CÓ XÁC THỰC */}
      <Modal open={openCvModal} onClose={handleCloseCvModal}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "80%", lg: "1000px" }, height: "90vh", bgcolor: "background.paper",
          borderRadius: 3, boxShadow: 24, display: "flex", flexDirection: "column", overflow: "hidden"
        }}>
          <Box sx={{ p: 2, px: 3, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #eee", bgcolor: "#ffffff" }}>
            <Typography variant="h6" fontWeight={800} color="#0f172a">Xem lại CV đã ứng tuyển</Typography>
            <IconButton onClick={handleCloseCvModal} sx={{ color: "#64748b" }}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, p: 0, bgcolor: "#f1f5f9" }}>
            {cvLoading ? (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" gap={2}>
                <CircularProgress sx={{ color: "#0284c7" }} />
                <Typography variant="body2" color="#64748b" fontWeight={600}>
                  Đang tải dữ liệu hồ sơ CV...
                </Typography>
              </Box>
            ) : viewCvUrl ? (
              <iframe 
                src={viewCvUrl} 
                width="100%" 
                height="100%" 
                style={{ border: "none" }} 
                title="CV Preview" 
              />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body2" color="#ef4444" fontWeight={600}>
                  Không thể nạp dữ liệu CV.
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2, px: 3, borderTop: "1px solid #eee", display: "flex", justifyContent: "flex-end", bgcolor: "white", gap: 1.5 }}>
            <Button variant="outlined" onClick={handleCloseCvModal} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}>
              Đóng
            </Button>
            {viewCvUrl && (
              <Button 
                variant="contained" 
                component="a" 
                href={viewCvUrl} 
                target="_blank" 
                download="my-cv.pdf"
                startIcon={<Download />}
                sx={{ 
                  bgcolor: "#0284c7", 
                  textTransform: "none", 
                  fontWeight: 700, 
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#0369a1" } 
                }}
              >
                Tải xuống
              </Button>
            )}
          </Box>
        </Box>
      </Modal>

    </Stack>
  );
}
