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
  Pagination,
  IconButton,
  Button,
  CircularProgress,
  Box
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";

import HrJobForm from "./HrJobForm";
import HrJobDetail from "./HrJobDetail";

import HRLayout from "../../components/HRLayout";

import {
  getMyJobs,
  deleteJob
} from "../../services/hrJobService";

import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";
import ConfirmDialog from "../../components/ConfirmDialog";

const DEFAULT_IMAGE =
  "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg";

const PAGE_SIZE = 5;

export default function HrJobManagement() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [experience, setExperience] = useState("ALL");
  const [page, setPage] = useState(1);

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
        experienceLevel:
          experience === "ALL"
            ? null
            : experience
      });

      setJobs(data || []);

    } catch (error) {

      console.error(error);

      showToast(
        "Không thể tải danh sách công việc",
        "error"
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadJobs();

  }, [keyword, experience]);

  /* ================= PAGINATION ================= */

  const totalPages =
    Math.ceil(jobs.length / PAGE_SIZE);

  const paginatedJobs = jobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= HANDLER ================= */

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
          setJobs(prev =>
            prev.filter(
              item => item.jobId !== jobId
            )
          );
          showToast(
            "Xóa tin tuyển dụng thành công",
            "success"
          );
        } catch (error) {
          console.error(error);
          showToast(
            "Xóa thất bại",
            "error"
          );
        }
      }
    });
    setConfirmOpen(true);
  };

  const handleRefresh = async () => {
    await loadJobs();
    showToast("Làm mới danh sách thành công", "success");
  };

  /* ================= RENDER ================= */

  return (

    <HRLayout>

      <Stack spacing={3}>

        {/* BLUE BANNER */}
        <Box
          sx={{
            backgroundColor: "#0066CC",
            borderRadius: "8px",
            padding: "16px 20px",
            color: "white"
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Theo dõi trạng thái tuyển dụng và quản lý các tin tuyển dụng hiệu quả
          </Typography>
        </Box>

        {/* HEADER WITH CREATE BUTTON */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Typography
            variant="h5"
            fontWeight={800}
          >
            Quản lý tin tuyển dụng
          </Typography>

          <Button
            variant="contained"
            onClick={handleOpenCreate}
          >
            Đăng tin
          </Button>

        </Stack>

        {/* SEARCH & FILTER ROW */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
        >

          <TextField
            size="small"
            placeholder="Tìm theo job, địa điểm, user..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            sx={{ flex: 1 }}
          />

          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            Lọc trạng thái
          </Typography>

          <TextField
            size="small"
            select
            value={experience}
            onChange={(e) =>
              setExperience(e.target.value)
            }
            sx={{ width: 200 }}
          >

            <MenuItem value="ALL">
              ALL
            </MenuItem>

            <MenuItem value="INTERN">
              Intern
            </MenuItem>

            <MenuItem value="MID">
              Mid
            </MenuItem>

            <MenuItem value="SENIOR">
              Senior
            </MenuItem>

          </TextField>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{ whiteSpace: "nowrap" }}
          >
            LÀM MỚI
          </Button>

        </Stack>

        {/* LOADING */}

        {loading ? (

          <Box
            display="flex"
            justifyContent="center"
            py={10}
          >
            <CircularProgress />
          </Box>

        ) : (

          <Paper elevation={3}>

            <Table>

              <TableHead>

                <TableRow
                  sx={{
                    backgroundColor: "#0066CC",
                    "& th": {
                      backgroundColor: "#0066CC",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "14px"
                    }
                  }}
                >

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    STT
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Hình ảnh
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Tiêu đề
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Kinh nghiệm
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Mô tả
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Ngày đăng
                  </TableCell>

                  <TableCell align="center" sx={{ color: "white", fontWeight: 700 }}>
                    Hành động
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {paginatedJobs.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      align="center"
                      sx={{ padding: "20px" }}
                    >

                      Không có tin tuyển dụng

                    </TableCell>

                  </TableRow>
                )}

                {paginatedJobs.map((job, index) => (

                  <TableRow
                    key={job.jobId}
                    hover
                  >

                    <TableCell align="center">

                      {(page - 1) *
                        PAGE_SIZE +
                        index +
                        1}

                    </TableCell>

                    <TableCell align="center">

                      <img
                        src={job.imageUrl ? getMediaUrl(job.imageUrl) : DEFAULT_IMAGE}
                        alt="job"
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 8,
                          objectFit: "cover"
                        }}
                        onError={(e) => {
                          e.target.src =
                            DEFAULT_IMAGE;
                        }}
                      />

                    </TableCell>

                    <TableCell align="center">
                      {job.title}
                    </TableCell>

                    <TableCell align="center">
                      {job.experienceLevel}
                    </TableCell>

                    <TableCell align="center">

                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 250,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                          mx: "auto"
                        }}
                      >
                        {job.description}
                      </Typography>

                    </TableCell>

                    <TableCell align="center">

                      {new Date(
                        job.createdAt
                      ).toLocaleDateString("vi-VN")}

                    </TableCell>

                    <TableCell align="center">

                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >

                        <IconButton
                          size="small"
                          onClick={() =>
                            setViewJob(job)
                          }
                        >
                          <VisibilityOutlinedIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() =>
                            handleOpenEdit(job)
                          }
                        >
                          <EditOutlinedIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(job.jobId)
                          }
                        >
                          <DeleteOutlineIcon />
                        </IconButton>

                      </Stack>

                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>

            </Table>

          </Paper>
        )}

        {/* PAGINATION INFO & CONTROLS */}

        {!loading && jobs.length > 0 && (
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="body2">
              Tổng công việc: {jobs.length}
            </Typography>
            
            {totalPages > 1 && (
              <Stack alignItems="center" width="100%">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) =>
                    setPage(value)
                  }
                />
              </Stack>
            )}
          </Stack>
        )}

      </Stack>

      {/* DETAIL */}

      <HrJobDetail
        job={viewJob}
        open={Boolean(viewJob)}
        onClose={() => setViewJob(null)}
      />

      {/* FORM */}

      {openModal && (

        <HrJobForm

          job={editingJob}

          onClose={() =>
            setOpenModal(false)
          }

          onSuccess={async () => {

            await loadJobs();

            setOpenModal(false);

            showToast(
              editingJob
                ? "Cập nhật thành công"
                : "Đăng tin thành công",
              "success"
            );
          }}
        />
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        confirmText={confirmConfig.confirmText}
      />

    </HRLayout>
  );
}
