import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  Container, Typography, Box, Stack, Avatar, 
  Paper, CircularProgress, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, FormControl, InputLabel, Select, MenuItem 
} from "@mui/material";
import { ArrowForward, WorkHistoryOutlined, Description, Visibility, FilterList } from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";

export default function AppliedJobs() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ----- STATE PHÂN TRANG & LỌC -----
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("ALL"); // Mặc định là tất cả

  const fetchAppliedJobs = async (status = "ALL") => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      // Xây dựng URL với Query Parameter
      const query = status !== "ALL" ? `?status=${status}` : "";
      const res = await axios.get(`http://localhost:8080/api/user/jobs/apply/my-applications${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedJobs(res.data);
      setPage(0); // Reset về trang đầu khi lọc
    } catch (err) {
      console.error("Lỗi lấy danh sách ứng tuyển", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
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

  const getStatusChip = (status) => {
    const statusMap = {
      "PENDING": { label: "Đang chờ", bgcolor: "#fef3c7", textColor: "#92400e" },
      "REVIEWING": { label: "Đang xem xét", bgcolor: "#e0f2fe", textColor: "#075985" },
      "ACCEPTED": { label: "Đã trúng tuyển", bgcolor: "#dcfce7", textColor: "#166534" },
      "REJECTED": { label: "Từ chối", bgcolor: "#fee2e2", textColor: "#991b1b" },
    };
    const config = statusMap[status] || { label: status, bgcolor: "#f1f5f9", textColor: "#475569" };
    return <Chip label={config.label} size="small" sx={{ fontWeight: 700, bgcolor: config.bgcolor, color: config.textColor, borderRadius: 1 }} />;
  };

  return (
    <UserLayout>
      <Box sx={{ bgcolor: "#f8faff", pt: 10, pb: 6, borderBottom: "1px solid #eff6ff" }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'flex-end' }} spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight="900" sx={{ color: "#1e293b", mb: 1 }}>
                Quản lý <span style={{ color: '#6366f1' }}>đơn ứng tuyển</span>
              </Typography>
              <Typography variant="body1" sx={{ color: "#64748b" }}>
                Bạn có {appliedJobs.length} đơn ứng tuyển {statusFilter !== "ALL" ? `trạng thái ${statusFilter}` : ""}
              </Typography>
            </Box>
            <Button onClick={() => navigate("/")} endIcon={<ArrowForward />} variant="outlined" sx={{ color: '#6366f1', borderColor: '#6366f1', textTransform: 'none', fontWeight: 700 }}>
              Tìm thêm việc làm
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, minHeight: '60vh' }}>
        
        {/* THANH BỘ LỌC (FILTER BAR) */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="status-filter-label" sx={{ fontWeight: 600 }}>Trạng thái đơn</InputLabel>
                <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Trạng thái đơn"
                    onChange={handleFilterChange}
                    startAdornment={<FilterList sx={{ mr: 1, color: '#64748b', fontSize: 20 }} />}
                    sx={{ borderRadius: 2, bgcolor: 'white' }}
                >
                    <MenuItem value="ALL">Tất cả đơn</MenuItem>
                    <MenuItem value="PENDING">Đang chờ</MenuItem>
                    <MenuItem value="REVIEWING">Đang xem xét</MenuItem>
                    <MenuItem value="ACCEPTED">Đã trúng tuyển</MenuItem>
                    <MenuItem value="REJECTED">Từ chối</MenuItem>
                </Select>
            </FormControl>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
        ) : appliedJobs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, bgcolor: '#f8fafc', borderRadius: 4, border: '2px dashed #e2e8f0' }}>
             <WorkHistoryOutlined sx={{ fontSize: 60, color: '#cbd5e1', mb: 2 }} />
             <Typography variant="h6" color="#64748b">Không tìm thấy đơn ứng tuyển nào phù hợp.</Typography>
             {statusFilter !== "ALL" && (
                 <Button onClick={() => handleFilterChange({target: {value: "ALL"}})} sx={{ mt: 1, textTransform: 'none' }}>Xóa bộ lọc</Button>
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
                    <TableCell align="right" sx={{ fontWeight: 800, color: "#475569" }}>Thao tác</TableCell>
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
                            <Avatar src={app.job.companyLogo} variant="rounded" sx={{ width: 40, height: 40, bgcolor: "#f1f5f9", color: "#6366f1", fontSize: '0.9rem', fontWeight: 800 }}>
                              {app.job.companyName?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={700} color="#1e293b">{app.job.title}</Typography>
                              <Typography variant="caption" color="#64748b" sx={{ textTransform: 'uppercase' }}>{app.job.companyName}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#475569">{new Date(app.applyDate).toLocaleDateString('vi-VN')}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>{app.job.salaryRange || "Thỏa thuận"}</Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(app.status)}</TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Button size="small" startIcon={<Visibility />} onClick={() => navigate(`/user/job/${app.job.jobId}`)} sx={{ textTransform: 'none', fontWeight: 600 }}>
                              Chi tiết
                            </Button>
                            <Button 
                                size="small" 
                                color="inherit" 
                                startIcon={<Description />} 
                                onClick={() => window.open(`http://localhost:8080/uploads/cv/${app.cvFileUrl}`, '_blank')}
                                sx={{ textTransform: 'none', color: '#64748b' }}
                            >
                                CV
                            </Button>
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
    </UserLayout>
  );
}