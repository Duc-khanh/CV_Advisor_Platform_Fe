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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
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
  RoomOutlined
} from "@mui/icons-material";

export default function UserInterviewsTab({ setActiveTab }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Phân trang
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const fetchInterviews = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/user/jobs/apply/my-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : [];
      const list = data.filter(
        (app) => app.status === "INTERVIEW" || app.interview
      );
      setInterviews(list);
    } catch (err) {
      console.error("Lỗi lấy danh sách lịch phỏng vấn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  const formatDateTime = (val) => {
    if (!val) return "Chưa xác định";
    try {
      const d = new Date(val);
      return `${d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} ngày ${d.toLocaleDateString("vi-VN")}`;
    } catch {
      return String(val);
    }
  };

  return (
    <Stack spacing={3}>
      {/* HEADER CARD */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CalendarMonth sx={{ color: "#0284c7", fontSize: 28 }} />
              <Typography variant="h5" fontWeight={900} color="#0f172a" sx={{ fontSize: "1.35rem" }}>
                Lịch phỏng vấn của tôi
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", fontSize: "0.82rem" }}>
              Bạn có {interviews.length} buổi phỏng vấn đã được lên lịch
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              if (setActiveTab) setActiveTab("my_jobs");
            }}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#0284c7",
              borderColor: "#bae6fd",
              borderRadius: 2,
              "&:hover": { borderColor: "#0284c7", bgcolor: "#f0f9ff" }
            }}
          >
            Quay lại việc làm của tôi
          </Button>
        </Stack>
      </Paper>

      {/* BẢNG LỊCH PHỎNG VẤN */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#0284c7" }} />
        </Box>
      ) : interviews.length === 0 ? (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px dashed #e2e8f0",
            borderRadius: 4,
            bgcolor: "#f8fafc",
          }}
        >
          <EventAvailable sx={{ fontSize: 56, color: "#cbd5e1", mb: 1.5 }} />
          <Typography variant="h6" fontWeight={700} color="#64748b" sx={{ fontSize: "1rem" }}>
            Hiện tại bạn chưa có lịch hẹn phỏng vấn nào.
          </Typography>
          <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: "block" }}>
            Khi nhà tuyển dụng gửi lời mời phỏng vấn, lịch hẹn sẽ tự động xuất hiện tại đây.
          </Typography>
        </Paper>
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
          <TableContainer>
            <Table size="medium">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 60 }}>
                    STT
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#475569" }}>
                    Vị trí & Công ty
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#475569", width: 170 }}>
                    Vòng phỏng vấn
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#475569", width: 190 }}>
                    Thời gian
                  </TableCell>
                  <TableCell sx={{ fontWeight: 800, color: "#475569", width: 160 }}>
                    Hình thức
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 140, py: 1.8 }}>
                    Thao tác
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {interviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((app, idx) => {
                    const iv = app.interview;
                    const isOnline = iv?.interviewType !== "OFFLINE";
                    const meetLink = iv?.locationOrLink;

                    return (
                      <TableRow key={app.applicationId} hover>
                        <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b" }}>
                          {page * rowsPerPage + idx + 1}
                        </TableCell>
                        <TableCell>
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
                          {app.job?.location && (
                            <Typography variant="caption" color="#64748b" sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, mt: 0.4, whiteSpace: "nowrap" }}>
                              <RoomOutlined sx={{ fontSize: 13, color: "#94a3b8" }} />
                              {app.job.location}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={iv?.roundName || "Phỏng vấn tuyển dụng"}
                            size="small"
                            sx={{ bgcolor: "#f0f9ff", color: "#0369a1", fontWeight: 700, borderRadius: 1.5 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={700} color="#0f172a">
                            {formatDateTime(iv?.startTime)}
                          </Typography>
                        </TableCell>
                        <TableCell>
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
                              <Tooltip title="Vào phòng họp trực tuyến (Google Meet / Zoom)" arrow>
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={meetLink.startsWith("http") ? meetLink : `https://${meetLink}`}
                                  target="_blank"
                                  sx={{
                                    color: "white",
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
                            <Tooltip title="Xem chi tiết lịch hẹn" arrow>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedApp(app);
                                  setOpenModal(true);
                                }}
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
            count={interviews.length}
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
        </Paper>
      )}

      {/* DETAIL MODAL */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
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
          <IconButton onClick={() => setOpenModal(false)} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 3 }}>
          {selectedApp?.interview && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: "#f0f9ff", borderRadius: 2, border: "1px solid #bae6fd" }}>
                <Typography variant="subtitle1" fontWeight={800} color="#0369a1">
                  {selectedApp.job?.title}
                </Typography>
                <Typography variant="body2" color="#0284c7" fontWeight={600}>
                  {selectedApp.job?.companyName}
                </Typography>
                <Typography variant="caption" display="block" color="#64748b" sx={{ mt: 0.5 }}>
                  Vòng: <strong>{selectedApp.interview.roundName || "Phỏng vấn tuyển dụng"}</strong>
                </Typography>
              </Box>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <AccessTime sx={{ color: "#0284c7", fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#64748b">Thời gian bắt đầu</Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {formatDateTime(selectedApp.interview.startTime)}
                    </Typography>
                  </Box>
                </Stack>

                {selectedApp.interview.endTime && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <AccessTime sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="#64748b">Thời gian kết thúc (dự kiến)</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {formatDateTime(selectedApp.interview.endTime)}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  {selectedApp.interview.interviewType === "OFFLINE" ? (
                    <LocationOn sx={{ color: "#e11d48", fontSize: 20, mt: 0.2 }} />
                  ) : (
                    <VideoCameraFront sx={{ color: "#0284c7", fontSize: 20, mt: 0.2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="#64748b">
                      Hình thức & {selectedApp.interview.interviewType === "OFFLINE" ? "Địa điểm" : "Link cuộc họp"}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {selectedApp.interview.interviewType === "OFFLINE"
                        ? "Phỏng vấn trực tiếp tại văn phòng"
                        : "Phỏng vấn trực tuyến (Online Meeting)"}
                    </Typography>

                    {selectedApp.interview.locationOrLink ? (
                      selectedApp.interview.interviewType === "OFFLINE" ? (
                        <Typography
                          variant="body2"
                          color="#334155"
                          sx={{ mt: 0.5, bgcolor: "#f8fafc", p: 1, borderRadius: 1.5, border: "1px solid #e2e8f0" }}
                        >
                          {selectedApp.interview.locationOrLink}
                        </Typography>
                      ) : (
                        <Box sx={{ mt: 1.5 }}>
                          <Button
                            variant="contained"
                            component="a"
                            href={
                              selectedApp.interview.locationOrLink.startsWith("http")
                                ? selectedApp.interview.locationOrLink
                                : `https://${selectedApp.interview.locationOrLink}`
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
                                selectedApp.interview.locationOrLink.startsWith("http")
                                  ? selectedApp.interview.locationOrLink
                                  : `https://${selectedApp.interview.locationOrLink}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: "#0284c7", fontWeight: 600 }}
                            >
                              {selectedApp.interview.locationOrLink}
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

                {selectedApp.interview.interviewerName && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Person sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="#64748b">Người phỏng vấn</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {selectedApp.interview.interviewerName}
                        {selectedApp.interview.interviewerEmail ? ` (${selectedApp.interview.interviewerEmail})` : ""}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                {selectedApp.interview.notes && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Notes sx={{ color: "#64748b", fontSize: 20, mt: 0.2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#64748b">Ghi chú từ Nhà tuyển dụng</Typography>
                      <Box sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0", mt: 0.5 }}>
                        <Typography variant="body2" color="#334155">
                          {selectedApp.interview.notes}
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
          <Button onClick={() => setOpenModal(false)} variant="outlined" sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
