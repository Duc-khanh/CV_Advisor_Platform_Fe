import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";
import { getCvUrl } from "../../utils/urlHelpers";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Button,
  Modal,
  TablePagination
} from "@mui/material";

import {
  Search,
  Refresh,
  PictureAsPdf,
  Close,
  AutoAwesome
} from "@mui/icons-material";

import HRLayout from "../../layouts/HRLayout";
import { useToast } from "../../contexts/ToastContext";

// Bỏ "REVIEWING" (Đang xem xét) ở bộ lọc và thao tác theo yêu cầu của user
const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED"
];

const ACTION_STATUS_OPTIONS = [
  "PENDING",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED"
];

const STATUS_LABELS = {
  PENDING: "Chờ xử lý",
  INTERVIEW: "Phỏng vấn",
  ACCEPTED: "Đã tuyển",
  REJECTED: "Từ chối",
  REVIEWED: "Đã xem",
  REVIEWING: "Đang xem xét"
};

const STATUS_COLOR = {
  PENDING: "default",
  INTERVIEW: "warning",
  ACCEPTED: "success",
  REJECTED: "error",
  REVIEWED: "info",
  REVIEWING: "info"
};

const formatDate = (val) => {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch {
    return "—";
  }
};

export default function HRApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showToast = useToast();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [fitFilter, setFitFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [updatingId, setUpdatingId] = useState(null);

  const [viewCvUrl, setViewCvUrl] = useState(null);
  const [openCvModal, setOpenCvModal] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);

  const [fitLoadingId, setFitLoadingId] = useState(null);
  const [fitModalData, setFitModalData] = useState(null);
  const [openFitModal, setOpenFitModal] = useState(false);

  const handleViewCv = async (cvFileUrl) => {
    if (!cvFileUrl) return;
    setOpenCvModal(true);
    setCvLoading(true);
    setViewCvUrl(null);

    try {
      const url = cvFileUrl.startsWith("/") ? cvFileUrl : `/${cvFileUrl}`;
      const response = await api.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "application/pdf"
      });
      const blobUrl = URL.createObjectURL(blob);
      setViewCvUrl(blobUrl);
    } catch (err) {
      console.error("Lỗi tải CV:", err);
      showToast("Không thể tải file CV. Vui lòng kiểm tra lại quyền hoặc thử lại sau.", "error");
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

  useEffect(() => {
    fetchApplications();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/hr/applications", getAuthHeader());

      const raw = res?.data;
      let list = [];
      if (Array.isArray(raw)) {
        list = raw;
      } else if (Array.isArray(raw?.data)) {
        list = raw.data;
      } else if (Array.isArray(raw?.content)) {
        list = raw.content;
      } else if (Array.isArray(raw?.applications)) {
        list = raw.applications;
      }

      setApplications(list);
    } catch (err) {
      console.error(err);
      const errMsg =
        err?.response?.data?.message ||
        "Không thể tải danh sách ứng viên. Vui lòng kiểm tra lại quyền truy cập hoặc kết nối mạng.";
      setError(errMsg);
      setApplications([]);
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const getFitStatus = (score) => {
    if (score == null) {
      return { label: "Chưa đánh giá", color: "default" };
    }
    if (score >= 80) {
      return { label: "Rất phù hợp", color: "success" };
    }
    if (score >= 60) {
      return { label: "Phù hợp", color: "warning" };
    }
    return { label: "Ít phù hợp", color: "error" };
  };

  const evaluateCandidateFit = async (application) => {
    try {
      setFitLoadingId(application.applicationId);
      const jobDescription =
        application.jobDescription ||
        application.description ||
        application.jobTitle ||
        "";

      const res = await api.post(
        `/api/hr/applications/${application.applicationId}/fit`,
        { jobDescription },
        getAuthHeader()
      );

      const aiFit = res.data;

      setApplications((prev) =>
        prev.map((app) =>
          app.applicationId === application.applicationId
            ? { ...app, aiFit }
            : app
        )
      );

      setFitModalData({
        application,
        aiFit
      });
      setOpenFitModal(true);

      showToast("Đánh giá độ phù hợp ứng viên thành công", "success");
    } catch (err) {
      console.error(err);
      const errMsg =
        err?.response?.data?.message ||
        "Đánh giá ứng viên thất bại. Vui lòng thử lại sau.";
      showToast(errMsg, "error");
    } finally {
      setFitLoadingId(null);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    if (!applicationId || !newStatus) return;
    const targetStatus = newStatus.toUpperCase();

    try {
      setUpdatingId(applicationId);

      // Cập nhật optimistic ngay lập tức để giao diện đổi màu và giá trị tức thì
      setApplications((prev) =>
        prev.map((app) => {
          if (app.applicationId === applicationId || app.id === applicationId) {
            return { ...app, status: targetStatus };
          }
          return app;
        })
      );

      await api.put(
        `/api/hr/applications/${applicationId}/status`,
        { status: targetStatus },
        {
          params: { status: targetStatus },
          ...getAuthHeader()
        }
      );

      showToast("Cập nhật trạng thái thành công", "success");
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
      // Nếu lỗi thì tải lại từ server để rollback
      fetchApplications();
      const errMsg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "Cập nhật trạng thái thất bại";
      showToast(errMsg, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // FILTER + SEARCH
  const filteredApplications = useMemo(() => {
    if (!Array.isArray(applications)) return [];
    return applications.filter((app) => {
      if (!app) return false;

      const matchStatus =
        statusFilter === "ALL" ||
        app.status?.toUpperCase() === statusFilter?.toUpperCase();

      let matchFit = true;
      const score = app.aiFit?.score;
      if (fitFilter === "HIGH") {
        matchFit = score != null && score >= 80;
      } else if (fitFilter === "MEDIUM") {
        matchFit = score != null && score >= 60 && score < 80;
      } else if (fitFilter === "LOW") {
        matchFit = score != null && score < 60;
      } else if (fitFilter === "UNRATED") {
        matchFit = score == null;
      }

      if (!matchStatus || !matchFit) return false;

      const keyword = (searchKeyword || "").trim().toLowerCase();
      if (!keyword) return true;

      const matchSearch =
        (app.fullName?.toLowerCase() || "").includes(keyword) ||
        (app.candidateName?.toLowerCase() || "").includes(keyword) ||
        (app.name?.toLowerCase() || "").includes(keyword) ||
        (app.jobTitle?.toLowerCase() || "").includes(keyword) ||
        (app.location?.toLowerCase() || "").includes(keyword) ||
        (app.email?.toLowerCase() || "").includes(keyword) ||
        (app.userId?.toString() || "").includes(keyword);

      return matchSearch;
    });
  }, [applications, statusFilter, fitFilter, searchKeyword]);

  const paginatedApplications = filteredApplications.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, fitFilter, searchKeyword]);

  return (
    <HRLayout>
      <Box sx={{ width: "100%", margin: "0 auto", pt: 0, px: { xs: 1, md: 2 } }}>
        <Stack spacing={3}>
          {/* HEADER GỌN GÀNG */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" fontWeight={800} color="#1e293b">
              Quản lý ứng viên
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Theo dõi hồ sơ ứng tuyển, phân tích độ phù hợp và cập nhật trạng thái tuyển dụng
            </Typography>
          </Box>

          {/* FILTER CARD (ĐỒNG BỘ VỚI ADMIN) */}
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Tìm theo tên ứng viên, vị trí, email..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                sx={{ width: { xs: "100%", sm: 280, md: 320 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={statusFilter}
                  label="Trạng thái"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Tất cả trạng thái</MenuItem>
                  <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                  <MenuItem value="INTERVIEW">Phỏng vấn</MenuItem>
                  <MenuItem value="ACCEPTED">Đã tuyển</MenuItem>
                  <MenuItem value="REJECTED">Từ chối</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Mức độ phù hợp</InputLabel>
                <Select
                  value={fitFilter}
                  label="Mức độ phù hợp"
                  onChange={(e) => setFitFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Tất cả mức độ</MenuItem>
                  <MenuItem value="HIGH">Rất phù hợp (≥ 80%)</MenuItem>
                  <MenuItem value="MEDIUM">Phù hợp (60% - 79%)</MenuItem>
                  <MenuItem value="LOW">Ít phù hợp (&lt; 60%)</MenuItem>
                  <MenuItem value="UNRATED">Chưa đánh giá</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* TABLE (ĐỒNG BỘ VỚI ADMIN) */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress sx={{ color: "#0ea5e9" }} />
              </Box>
            ) : (
              <>
                <Box sx={{ width: "100%", overflowX: "auto" }}>
                  <Table>
                    <TableHead sx={{ bgcolor: "#f8fafc" }}>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 60 }}>
                          STT
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                          Ứng viên
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                          Vị trí ứng tuyển
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 90 }}>
                          Hồ sơ
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", width: 110 }}>
                          Ngày nộp
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 140 }}>
                          Độ phù hợp
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569", width: 110 }}>
                          Trạng thái
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700, color: "#475569", width: 130 }}>
                          Thao tác
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {error ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                            <Stack spacing={1.5} alignItems="center">
                              <Typography color="error.main" fontWeight={600}>
                                {error}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Refresh />}
                                onClick={fetchApplications}
                              >
                                Thử lại
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ) : paginatedApplications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                            <Typography color="text.secondary">
                              Không tìm thấy ứng viên nào phù hợp
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedApplications.map((app, index) => {
                          const candidateName =
                            app.fullName ||
                            app.candidateName ||
                            app.name ||
                            "Ứng viên";
                          const avatarChar =
                            candidateName.trim().charAt(0).toUpperCase() || "U";
                          const currentStatus = app.status || "PENDING";

                          return (
                            <TableRow key={app.applicationId || index} hover sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                              {/* STT */}
                              <TableCell align="center" sx={{ color: "#64748b", fontWeight: 500 }}>
                                {(page - 1) * rowsPerPage + index + 1}
                              </TableCell>

                              {/* ỨNG VIÊN */}
                              <TableCell>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Avatar
                                    sx={{
                                      bgcolor: "#0ea5e9",
                                      width: 40,
                                      height: 40,
                                      fontWeight: 700,
                                      fontSize: "0.95rem"
                                    }}
                                  >
                                    {avatarChar}
                                  </Avatar>
                                  <Box>
                                    <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                      {candidateName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                                      {app.email || "—"}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>

                              {/* VỊ TRÍ ỨNG TUYỂN (BỎ ĐỊA CHỈ Ở DƯỚI THEO YÊU CẦU) */}
                              <TableCell>
                                <Typography variant="subtitle2" fontWeight={600} color="#1e293b">
                                  {app.jobTitle || "—"}
                                </Typography>
                              </TableCell>

                              {/* HỒ SƠ CV (CHỈ HIỂN THỊ ICON ĐÚNG VÀ BỎ TEXT) */}
                              <TableCell align="center">
                                <Tooltip title={app.cvFileUrl ? "Xem trước hồ sơ CV ứng viên" : "Chưa có file CV"} arrow>
                                  <span>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewCv(app.cvFileUrl)}
                                      disabled={!app.cvFileUrl}
                                      sx={{
                                        bgcolor: "#f1f5f9",
                                        color: "#0284c7",
                                        border: "1px solid #e2e8f0",
                                        borderRadius: 2,
                                        p: 0.8,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          bgcolor: "#e0f2fe",
                                          borderColor: "#38bdf8",
                                          color: "#0369a1",
                                          transform: "translateY(-1px)",
                                          boxShadow: "0 2px 8px rgba(2, 132, 199, 0.2)",
                                        },
                                        "&.Mui-disabled": {
                                          bgcolor: "#f8fafc",
                                          color: "#cbd5e1",
                                        },
                                      }}
                                    >
                                      <PictureAsPdf sx={{ fontSize: 20 }} />
                                    </IconButton>
                                  </span>
                                </Tooltip>
                              </TableCell>

                              {/* NGÀY NỘP */}
                              <TableCell sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                                {formatDate(app.appliedAt)}
                              </TableCell>

                              {/* ĐỘ PHÙ HỢP (LỒNG XEM CHI TIẾT VÀO % CHIP, NÚT ĐÁNH GIÁ CHỈ ĐỂ LẠI ICON) */}
                              <TableCell align="center">
                                {app.aiFit?.score != null ? (
                                  <Tooltip
                                    title={`Độ phù hợp: ${app.aiFit.score}% - Nhấn để xem chi tiết phân tích AI`}
                                    arrow
                                  >
                                    <Chip
                                      label={`${app.aiFit.score}% ${getFitStatus(app.aiFit.score).label}`}
                                      color={getFitStatus(app.aiFit.score).color}
                                      size="small"
                                      onClick={() => {
                                        setFitModalData({
                                          application: app,
                                          aiFit: app.aiFit
                                        });
                                        setOpenFitModal(true);
                                      }}
                                      sx={{
                                        fontWeight: 700,
                                        fontSize: "0.8rem",
                                        cursor: "pointer",
                                        px: 0.5,
                                        py: 1.8,
                                        borderRadius: 2,
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                          transform: "scale(1.05)",
                                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                          filter: "brightness(0.95)"
                                        }
                                      }}
                                    />
                                  </Tooltip>
                                ) : (
                                  <Tooltip title="Nhấn để AI đánh giá mức độ phù hợp" arrow>
                                    <span>
                                      <IconButton
                                        size="small"
                                        onClick={() => evaluateCandidateFit(app)}
                                        disabled={fitLoadingId === app.applicationId}
                                        sx={{
                                          bgcolor: "#eff6ff",
                                          color: "#2563eb",
                                          border: "1px solid #bfdbfe",
                                          borderRadius: 2,
                                          p: 0.8,
                                          transition: "all 0.2s ease",
                                          "&:hover": {
                                            bgcolor: "#dbeafe",
                                            borderColor: "#3b82f6",
                                            transform: "translateY(-1px)",
                                            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
                                          },
                                        }}
                                      >
                                        {fitLoadingId === app.applicationId ? (
                                          <CircularProgress size={18} color="inherit" />
                                        ) : (
                                          <AutoAwesome sx={{ fontSize: 20 }} />
                                        )}
                                      </IconButton>
                                    </span>
                                  </Tooltip>
                                )}
                              </TableCell>

                              {/* TRẠNG THÁI */}
                              <TableCell>
                                <Tooltip title={`Trạng thái hiện tại: ${STATUS_LABELS[currentStatus] || currentStatus}`} arrow>
                                  <Chip
                                    label={STATUS_LABELS[currentStatus] || currentStatus}
                                    color={STATUS_COLOR[currentStatus] || "default"}
                                    size="small"
                                    sx={{ fontWeight: 700 }}
                                  />
                                </Tooltip>
                              </TableCell>

                              {/* THAO TÁC (GỌN GÀNG, BỎ ĐANG XEM XÉT) */}
                              <TableCell align="center">
                                <Select
                                  size="small"
                                  value={ACTION_STATUS_OPTIONS.includes(currentStatus) ? currentStatus : "PENDING"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val !== currentStatus) {
                                      updateStatus(app.applicationId, val);
                                    }
                                  }}
                                  sx={{
                                    width: 120,
                                    height: 34,
                                    borderRadius: 2,
                                    fontSize: "0.82rem",
                                    bgcolor: "#ffffff",
                                    fontWeight: 600,
                                    "& .MuiSelect-select": {
                                      py: 0.6,
                                      px: 1.2,
                                    },
                                  }}
                                >
                                  {ACTION_STATUS_OPTIONS.map((status) => (
                                    <MenuItem key={status} value={status} sx={{ fontSize: "0.82rem", fontWeight: 500 }}>
                                      {STATUS_LABELS[status] || status}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </Box>

                {/* PAGINATION (ĐỒNG BỘ VỚI ADMIN) */}
                <TablePagination
                  component="div"
                  count={filteredApplications.length}
                  page={page - 1}
                  onPageChange={(e, newPage) => setPage(newPage + 1)}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Số dòng mỗi trang:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} trong ${count}`
                  }
                  sx={{
                    borderTop: "1px solid #f1f5f9",
                    color: "#64748b",
                  }}
                />
              </>
            )}
          </Paper>
        </Stack>

        {/* CV VIEWER MODAL */}
        <Modal open={openCvModal} onClose={handleCloseCvModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", md: "85%", lg: "1000px" },
              height: "90vh",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #edf2f7",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                Xem trước CV ứng viên
              </Typography>
              <IconButton onClick={handleCloseCvModal}>
                <Close />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, p: 0, bgcolor: "#f1f5f9" }}>
              {cvLoading ? (
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" gap={2}>
                  <CircularProgress sx={{ color: "#0ea5e9" }} />
                  <Typography variant="body2" color="text.secondary">
                    Đang tải tài liệu CV...
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
                  <Typography color="text.secondary">Không tìm thấy tài liệu CV để hiển thị.</Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid #edf2f7",
                display: "flex",
                justifyContent: "flex-end",
                bgcolor: "white",
                gap: 1.5,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCloseCvModal}
                sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
              >
                Đóng
              </Button>
              <Button
                variant="contained"
                component="a"
                href={viewCvUrl || "#"}
                target="_blank"
                download="CV_UngVien.pdf"
                disabled={!viewCvUrl}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#0ea5e9",
                  "&:hover": { bgcolor: "#0284c7" },
                }}
              >
                Tải xuống
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* AI FIT DETAIL MODAL */}
        <Modal open={openFitModal} onClose={() => setOpenFitModal(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", md: "620px" },
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "background.paper",
              borderRadius: 3,
              boxShadow: 24,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AutoAwesome sx={{ color: "#2563eb", fontSize: 24 }} />
                <Typography variant="h6" fontWeight={800} color="#1e293b">
                  Đánh giá mức độ phù hợp
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenFitModal(false)}>
                <Close />
              </IconButton>
            </Box>

            {fitModalData?.aiFit ? (
              <Stack spacing={2.5}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    bgcolor: "#f8fafc",
                    border: "1px solid #edf2f7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600} color="#475569">
                    Điểm tương thích công việc:
                  </Typography>
                  <Chip
                    label={`${fitModalData.aiFit.score ?? 0}% - ${getFitStatus(fitModalData.aiFit.score).label}`}
                    color={getFitStatus(fitModalData.aiFit.score).color}
                    sx={{ fontWeight: 800, fontSize: "0.9rem" }}
                  />
                </Box>

                {fitModalData.aiFit.summary && (
                  <Box>
                    <Typography fontWeight={700} color="#1e293b" mb={0.75}>
                      Nhận xét tổng quan
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", lineHeight: 1.6, bgcolor: "#f8fafc", p: 1.5, borderRadius: 2 }}
                    >
                      {fitModalData.aiFit.summary}
                    </Typography>
                  </Box>
                )}

                {Array.isArray(fitModalData.aiFit.strengths) &&
                  fitModalData.aiFit.strengths.length > 0 && (
                    <Box>
                      <Typography fontWeight={700} color="#16a34a" mb={1}>
                        Điểm mạnh nổi bật
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {fitModalData.aiFit.strengths.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#16a34a", borderColor: "#86efac", bgcolor: "#f0fdf4" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {Array.isArray(fitModalData.aiFit.weaknesses) &&
                  fitModalData.aiFit.weaknesses.length > 0 && (
                    <Box>
                      <Typography fontWeight={700} color="#ea580c" mb={1}>
                        Điểm cần bổ sung / cải thiện
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {fitModalData.aiFit.weaknesses.map((item, index) => (
                          <Chip
                            key={index}
                            label={item}
                            size="small"
                            variant="outlined"
                            sx={{ color: "#ea580c", borderColor: "#fed7aa", bgcolor: "#fff7ed" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                {fitModalData.aiFit.recommendations && (
                  <Box>
                    <Typography fontWeight={700} color="#2563eb" mb={0.75}>
                      Đề xuất cho nhà tuyển dụng
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#475569", lineHeight: 1.6, bgcolor: "#eff6ff", p: 1.5, borderRadius: 2 }}
                    >
                      {fitModalData.aiFit.recommendations}
                    </Typography>
                  </Box>
                )}
              </Stack>
            ) : (
              <Typography color="text.secondary">Không có dữ liệu đánh giá.</Typography>
            )}
          </Box>
        </Modal>
      </Box>
    </HRLayout>
  );
}
