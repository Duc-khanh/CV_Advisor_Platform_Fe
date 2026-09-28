import { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Typography,
  TextField,
  MenuItem,
  IconButton,
  Button,
  CircularProgress,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Tooltip,
  Avatar,
  TablePagination
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

import HrJobForm from "../../components/forms/HrJobForm";
import HrJobDetail from "../../components/hr/HrJobDetail";
import HRLayout from "../../layouts/HRLayout";
import { getMyJobs, deleteJob } from "../../services/job/hrJobService";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";

const DEFAULT_IMAGE =
  "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg";

export default function HrJobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openModal, setOpenModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);
  const showToast = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "info",
    confirmText: "Xác nhận",
    onConfirm: () => {},
  });

  /* ================= LOAD JOB ================= */
  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await getMyJobs({
        keyword,
        experienceLevel: experience === "ALL" ? null : experience,
      });
      setJobs(data || []);
    } catch (error) {
      console.error(error);
      showToast("Không thể tải danh sách công việc", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [keyword, experience]);

  /* ================= PAGINATION ================= */
  const paginatedJobs = jobs.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ================= HANDLERS ================= */
  const handleOpenCreate = () => {
    setEditingJob(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setOpenModal(true);
  };

  const handleDelete = (jobId) => {
    setConfirmConfig({
      title: "Xác nhận xóa tin tuyển dụng",
      message: "Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác.",
      type: "danger",
      confirmText: "Xóa tin",
      onConfirm: async () => {
        try {
          await deleteJob(jobId);
          setJobs((prev) => prev.filter((item) => item.jobId !== jobId));
          showToast("Xóa tin tuyển dụng thành công", "success");
        } catch (error) {
          console.error(error);
          showToast("Xóa thất bại", "error");
        }
      },
    });
    setConfirmOpen(true);
  };

  const handleRefresh = async () => {
    await loadJobs();
    showToast("Làm mới danh sách thành công", "success");
  };

  return (
    <HRLayout>
      <Box sx={{ width: "100%", margin: "0 auto", pt: 0, px: { xs: 1, md: 2 } }}>
        <Stack spacing={3}>
          {/* HEADER (ĐỒNG BỘ VỚI ADMIN) */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mt: 1 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800} color="#1e293b">
                Quản lý tin tuyển dụng
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Theo dõi trạng thái tuyển dụng và quản lý các tin tuyển dụng hiệu quả
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: "none",
                  borderColor: "#cbd5e1",
                  color: "#475569",
                  "&:hover": { borderColor: "#94a3b8", bgcolor: "#f8fafc" },
                }}
              >
                Làm mới
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreate}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "#2d6a4f",
                  "&:hover": { bgcolor: "#1b4332" },
                  boxShadow: "0 4px 12px rgba(45,106,79,0.25)",
                }}
              >
                Đăng tin mới
              </Button>
            </Stack>
          </Stack>

          {/* FILTER CARD (ĐỒNG BỘ VỚI ADMIN) */}
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Tìm kiếm theo tiêu đề công việc, địa điểm..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                sx={{ flexGrow: 1, minWidth: "260px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Kinh nghiệm</InputLabel>
                <Select
                  value={experience}
                  label="Kinh nghiệm"
                  onChange={(e) => {
                    setExperience(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="ALL">Tất cả kinh nghiệm</MenuItem>
                  <MenuItem value="INTERN">Intern</MenuItem>
                  <MenuItem value="FRESHER">Fresher</MenuItem>
                  <MenuItem value="JUNIOR">Junior</MenuItem>
                  <MenuItem value="MID">Mid-level</MenuItem>
                  <MenuItem value="SENIOR">Senior</MenuItem>
                  <MenuItem value="LEAD">Lead / Manager</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* TABLE (ĐỒNG BỘ VỚI ADMIN) */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={10}>
                <CircularProgress sx={{ color: "#2d6a4f" }} />
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
                          Công việc
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                          Kinh nghiệm
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                          Mô tả tóm tắt
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                          Ngày đăng
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: "#475569" }}>
                          Hành động
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paginatedJobs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                            <Typography color="text.secondary">
                              Không tìm thấy tin tuyển dụng nào phù hợp
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedJobs.map((job, index) => (
                          <TableRow key={job.jobId} hover sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                            {/* STT */}
                            <TableCell align="center" sx={{ color: "#64748b", fontWeight: 500 }}>
                              {(page - 1) * rowsPerPage + index + 1}
                            </TableCell>

                            {/* CÔNG VIỆC + HÌNH ẢNH */}
                            <TableCell>
                              <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar
                                  variant="rounded"
                                  src={job.imageUrl ? getMediaUrl(job.imageUrl) : DEFAULT_IMAGE}
                                  sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: "#f1f5f9"
                                  }}
                                  imgProps={{
                                    onError: (e) => { e.target.src = DEFAULT_IMAGE; }
                                  }}
                                />
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={700} color="#1e293b">
                                    {job.title}
                                  </Typography>
                                  {job.location && (
                                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                                      {job.location}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>

                            {/* KINH NGHIỆM */}
                            <TableCell>
                              <Chip
                                label={job.experienceLevel || "Không yêu cầu"}
                                size="small"
                                variant="outlined"
                                sx={{
                                  fontWeight: 600,
                                  color: "#2d6a4f",
                                  borderColor: "#2d6a4f40",
                                  bgcolor: "#2d6a4f08",
                                }}
                              />
                            </TableCell>

                            {/* MÔ TẢ */}
                            <TableCell>
                              <Tooltip title={job.description || ""}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    maxWidth: 260,
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    color: "#475569",
                                  }}
                                >
                                  {job.description || "—"}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            {/* NGÀY ĐĂNG */}
                            <TableCell sx={{ color: "#64748b", fontSize: "0.875rem" }}>
                              {job.createdAt
                                ? new Date(job.createdAt).toLocaleDateString("vi-VN")
                                : "—"}
                            </TableCell>

                            {/* HÀNH ĐỘNG (ICON BUTTONS ĐỒNG BỘ VỚI ADMIN) */}
                            <TableCell align="right">
                              <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="Xem chi tiết">
                                  <IconButton
                                    size="small"
                                    onClick={() => setViewJob(job)}
                                    sx={{
                                      bgcolor: "#eff6ff",
                                      color: "#2563eb",
                                      "&:hover": { bgcolor: "#dbeafe" },
                                    }}
                                  >
                                    <VisibilityOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Chỉnh sửa tin">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOpenEdit(job)}
                                    sx={{
                                      bgcolor: "#f0fdf4",
                                      color: "#16a34a",
                                      "&:hover": { bgcolor: "#dcfce7" },
                                    }}
                                  >
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa tin">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDelete(job.jobId)}
                                    sx={{
                                      bgcolor: "#fef2f2",
                                      color: "#dc2626",
                                      "&:hover": { bgcolor: "#fee2e2" },
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </Box>

                {/* PAGINATION (ĐỒNG BỘ VỚI ADMIN) */}
                <TablePagination
                  component="div"
                  count={jobs.length}
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

        {/* MODAL FORM TẠO/SỬA */}
        {openModal && (
          <HrJobForm
            open={openModal}
            onClose={() => setOpenModal(false)}
            onSaved={loadJobs}
            editingJob={editingJob}
          />
        )}

        {/* MODAL CHI TIẾT */}
        {viewJob && (
          <HrJobDetail
            job={viewJob}
            open={Boolean(viewJob)}
            onClose={() => setViewJob(null)}
          />
        )}

        {/* DIALOG XÁC NHẬN */}
        <ConfirmDialog
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={confirmConfig.onConfirm}
          title={confirmConfig.title}
          message={confirmConfig.message}
          type={confirmConfig.type}
          confirmText={confirmConfig.confirmText}
        />
      </Box>
    </HRLayout>
  );
}
