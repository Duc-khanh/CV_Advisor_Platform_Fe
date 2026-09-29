import React, { useEffect, useState } from "react";
import api from "../../services/axios";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Box, Stack, Avatar, 
  Paper, CircularProgress, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, FormControl, InputLabel, Select, MenuItem,
  Modal, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip,
  Alert
} from "@mui/material";
import { 
  ArrowForward, WorkHistoryOutlined, Description, Visibility, 
  FilterList, Close, CalendarMonth, VideoCameraFront, LocationOn, 
  AccessTime, Person, Notes, OpenInNew
} from "@mui/icons-material";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl, getCvUrl } from "../../utils/urlHelpers";

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showToast = useToast();

  // ----- STATE PHÂN TRANG & LỌC -----
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("ALL"); // Mặc định là tất cả

  // ----- STATE XEM CV -----
  const [viewCvUrl, setViewCvUrl] = useState(null);
  const [openCvModal, setOpenCvModal] = useState(false);

  // ----- STATE XEM CHI TIẾT LỊCH PHỎNG VẤN -----
  const [selectedInterviewApp, setSelectedInterviewApp] = useState(null);
  const [openInterviewModal, setOpenInterviewModal] = useState(false);

  const [cvLoading, setCvLoading] = useState(false);

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
      showToast("Không thể tải file CV. Vui lòng thử lại sau.", "error");
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

  const handleViewInterview = (app) => {
    setSelectedInterviewApp(app);
    setOpenInterviewModal(true);
  };

  const fetchAppliedJobs = async (status = "ALL") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      // Xây dựng URL với Query Parameter
      const query = status !== "ALL" ? `?status=${status}` : "";
      const res = await api.get(`/api/user/jobs/apply/my-applications${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(res.data);
      setPage(0); // Reset về trang đầu khi lọc
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng tuyển", err);
      showToast("Lỗi tải danh sách ứng tuyển", "error");
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  // Xử lý khi thay đổi Filter
  const handleFilterChange = (event) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    fetchAppliedJobs(newStatus);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
    const config = statusMap[key] || { label: status, bgcolor: "#f1f5f9", textColor: "#475569" };

    return (
      <Box>
        <Chip 
          label={config.label} 
          size="small" 
          sx={{ fontWeight: 700, bgcolor: config.bgcolor, color: config.textColor, borderRadius: 1.5, px: 0.5 }} 
        />
        {interview?.startTime && (
          <Typography variant="caption" display="block" sx={{ color: "#0284c7", fontWeight: 700, mt: 0.5, fontSize: "0.72rem" }}>
            {new Date(interview.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}{" - "}{new Date(interview.startTime).toLocaleDateString("vi-VN")}
          </Typography>
        )}
      </Box>
    );
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

  return (
    <>
      <Box sx={{ bgcolor: "#f8faff", pt: 10, pb: 6, borderBottom: "1px solid #eff6ff" }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight="900" sx={{ color: "#1e293b", mb: 1 }}>
                Quản lý <span style={{ color: '#0284c7' }}>đơn ứng tuyển</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                Bạn có {appliedJobs.length} đơn ứng tuyển {statusFilter !== "ALL" ? `trạng thái ${statusFilter}` : ""}
              </Typography>
            </Box>
            <Button 
              onClick={() => navigate("/")} 
              endIcon={<ArrowForward />} 
              variant="outlined" 
              sx={{ color: '#0284c7', borderColor: '#0284c7', textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
            >
              Tìm thêm việc làm
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, minHeight: '60vh' }}>
        
        {/* THANH BỘ LỌC (FILTER BAR) */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="status-filter-label" sx={{ fontWeight: 600 }}>Trạng thái đơn</InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Trạng thái đơn"
                    onChange={handleFilterChange}
                    startAdornment={<FilterList sx={{ mr: 1, color: '#0284c7', fontSize: 20 }} />}
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                >
                    <MenuItem value="ALL">Tất cả đơn ({appliedJobs.length})</MenuItem>
                    <MenuItem value="PENDING">Chờ xử lý</MenuItem>
                    <MenuItem value="REVIEWING">Đang xem xét</MenuItem>
                    <MenuItem value="INTERVIEW">Mời phỏng vấn</MenuItem>
                    <MenuItem value="ACCEPTED">Đã trúng tuyển</MenuItem>
                    <MenuItem value="REJECTED">Từ chối</MenuItem>
                </Select>
            </FormControl>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress sx={{ color: '#0284c7' }} /></Box>
        ) : appliedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4, border: '2px dashed #e2e8f0' }}>
             <WorkHistoryOutlined sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
             <Typography variant="h6" color="#64748b">Không tìm thấy đơn ứng tuyển nào phù hợp.</Typography>
             {statusFilter !== "ALL" && (
                 <Button onClick={() => handleFilterChange({target: {value: "ALL"}})} sx={{ mt: 1, textTransform: 'none', color: '#0284c7' }}>
                   Xóa bộ lọc
                 </Button>
             )}
          </Box>
        ) : (
          <Paper elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: 3, overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: '60px' }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Thông tin công việc</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Ngày nộp</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Lương</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: "#475569" }}>Trạng thái</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: "#475569", width: 160, py: 1.8 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appliedJobs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((app, index) => (
                      <TableRow key={app.applicationId} hover>
                        <TableCell align="center" sx={{ fontWeight: 600, color: "#64748b" }}>
                          {page * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar src={getMediaUrl(app.job?.companyLogo)} variant="rounded" sx={{ width: 42, height: 42, bgcolor: "#f0f9ff", color: "#0284c7", fontSize: '0.95rem', fontWeight: 800 }}>
                              {app.job?.companyName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={700} color="#1e293b" sx={{ cursor: 'pointer', '&:hover': { color: '#0284c7' } }} onClick={() => navigate(`/job/${app.job?.jobId}`)}>
                                {app.job?.title}
                              </Typography>
                              <Typography variant="caption" color="#64748b" sx={{ textTransform: 'uppercase', fontWeight: 600 }}>
                                {app.job?.companyName}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#475569">
                            {new Date(app.applyDate).toLocaleDateString('vi-VN')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600} color="#059669">
                            {app.job?.salaryRange || "Thỏa thuận"}
                          </Typography>
                        </TableCell>
                        <TableCell>
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
                              <Tooltip title="Vào phòng họp trực tuyến" arrow>
                                <IconButton
                                  size="small"
                                  component="a"
                                  href={app.interview.locationOrLink.startsWith("http") ? app.interview.locationOrLink : `https://${app.interview.locationOrLink}`}
                                  target="_blank"
                                  sx={{
                                    color: "#ffffff",
                                    background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
                                    p: "6px",
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
              count={appliedJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Số dòng mỗi trang:"
              sx={{ borderTop: "1px solid #e2e8f0" }}
            />
          </Paper>
        )}
      </Container>

      {/* MODAL CHI TIẾT LỊCH PHỎNG VẤN */}
      <Dialog 
        open={openInterviewModal} 
        onClose={() => setOpenInterviewModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', 
          color: 'white', 
          py: 2.2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <CalendarMonth sx={{ fontSize: 24 }} />
            <Typography variant="h6" fontWeight={800}>Thông tin lịch phỏng vấn</Typography>
          </Stack>
          <IconButton onClick={() => setOpenInterviewModal(false)} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3, pt: 3 }}>
          {selectedInterviewApp?.interview && (
            <Stack spacing={2.5} sx={{ mt: 1 }}>
              <Box sx={{ p: 2, bgcolor: '#f0f9ff', borderRadius: 2, border: '1px solid #bae6fd' }}>
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
                  <AccessTime sx={{ color: '#0284c7', fontSize: 20, mt: 0.2 }} />
                  <Box>
                    <Typography variant="caption" color="#64748b">Thời gian bắt đầu</Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {formatDateTime(selectedInterviewApp.interview.startTime)}
                    </Typography>
                  </Box>
                </Stack>

                {selectedInterviewApp.interview.endTime && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <AccessTime sx={{ color: '#64748b', fontSize: 20, mt: 0.2 }} />
                    <Box>
                      <Typography variant="caption" color="#64748b">Thời gian kết thúc (dự kiến)</Typography>
                      <Typography variant="body2" fontWeight={600} color="#334155">
                        {formatDateTime(selectedInterviewApp.interview.endTime)}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  {selectedInterviewApp.interview.interviewType === 'OFFLINE' ? (
                    <LocationOn sx={{ color: '#e11d48', fontSize: 20, mt: 0.2 }} />
                  ) : (
                    <VideoCameraFront sx={{ color: '#0284c7', fontSize: 20, mt: 0.2 }} />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="#64748b">
                      Hình thức & {selectedInterviewApp.interview.interviewType === 'OFFLINE' ? "Địa điểm" : "Link cuộc họp"}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      {selectedInterviewApp.interview.interviewType === 'OFFLINE' ? "Phỏng vấn trực tiếp tại văn phòng" : "Phỏng vấn trực tuyến (Online)"}
                    </Typography>

                    {selectedInterviewApp.interview.locationOrLink ? (
                      selectedInterviewApp.interview.interviewType === 'OFFLINE' ? (
                        <Typography variant="body2" color="#334155" sx={{ mt: 0.5, bgcolor: '#f8fafc', p: 1, borderRadius: 1.5, border: '1px solid #e2e8f0' }}>
                          {selectedInterviewApp.interview.locationOrLink}
                        </Typography>
                      ) : (
                        <Box sx={{ mt: 1.5 }}>
                          <Button
                            variant="contained"
                            component="a"
                            href={selectedInterviewApp.interview.locationOrLink.startsWith('http') ? selectedInterviewApp.interview.locationOrLink : `https://${selectedInterviewApp.interview.locationOrLink}`}
                            target="_blank"
                            startIcon={<OpenInNew />}
                            sx={{
                              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                              color: 'white',
                              fontWeight: 800,
                              textTransform: 'none',
                              borderRadius: 2,
                              px: 2.5,
                              py: 0.8,
                              boxShadow: '0 4px 12px rgba(14,165,233,0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #0284c7, #1d4ed8)',
                              }
                            }}
                          >
                            👉 Tham gia phỏng vấn ngay
                          </Button>
                          <Typography variant="caption" display="block" color="#64748b" sx={{ mt: 0.8, wordBreak: 'break-all' }}>
                            Đường dẫn: <a href={selectedInterviewApp.interview.locationOrLink.startsWith('http') ? selectedInterviewApp.interview.locationOrLink : `https://${selectedInterviewApp.interview.locationOrLink}`} target="_blank" rel="noreferrer" style={{ color: '#0284c7', fontWeight: 600 }}>
                              {selectedInterviewApp.interview.locationOrLink}
                            </a>
                          </Typography>
                        </Box>
                      )
                    ) : (
                      <Typography variant="caption" color="#e11d48" sx={{ mt: 0.5, display: 'block', fontStyle: 'italic' }}>
                        Nhà tuyển dụng sẽ gửi link cuộc họp trước giờ bắt đầu.
                      </Typography>
                    )}
                  </Box>
                </Stack>

                {selectedInterviewApp.interview.interviewerName && (
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Person sx={{ color: '#64748b', fontSize: 20, mt: 0.2 }} />
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
                    <Notes sx={{ color: '#64748b', fontSize: 20, mt: 0.2 }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="#64748b">Ghi chú từ Nhà tuyển dụng</Typography>
                      <Box sx={{ bgcolor: '#f8fafc', p: 1.5, borderRadius: 2, border: '1px solid #e2e8f0', mt: 0.5 }}>
                        <Typography variant="body2" color="#334155">
                          {selectedInterviewApp.interview.notes}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                )}
              </Stack>

              <Alert severity="info" sx={{ borderRadius: 2, fontSize: '0.82rem' }}>
                Vui lòng chuẩn bị trang phục lịch sự và kiểm tra micro, camera trước giờ phỏng vấn ít nhất 5-10 phút.
              </Alert>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, px: 3, borderTop: '1px solid #e2e8f0', bgcolor: '#f8fafc' }}>
          <Button onClick={() => setOpenInterviewModal(false)} variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* CV VIEWER MODAL */}
      <Modal open={openCvModal} onClose={handleCloseCvModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: { xs: '95%', md: '80%', lg: '1000px' }, height: '90vh', bgcolor: 'background.paper',
          borderRadius: 3, boxShadow: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" fontWeight={700}>Xem CV của bạn</Typography>
            <IconButton onClick={handleCloseCvModal}><Close /></IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, p: 0, bgcolor: '#f1f5f9' }}>
            {viewCvUrl ? (
              <iframe 
                src={viewCvUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }} 
                title="CV Preview" 
              />
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <CircularProgress />
              </Box>
            )}
          </Box>
          <Box sx={{ p: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', bgcolor: 'white' }}>
            <Button variant="outlined" onClick={handleCloseCvModal} sx={{ mr: 2 }}>Đóng</Button>
            <Button variant="contained" component="a" href={viewCvUrl} target="_blank" download>Tải xuống</Button>
          </Box>
        </Box>
      </Modal>

    </>
  );
}
