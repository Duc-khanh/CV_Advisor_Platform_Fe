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

import HrJobForm from "./HrJobForm";
import HrJobDetail from "./HrJobDetail";

import HRLayout from "../../components/HRLayout";

import {
  getMyJobs,
  deleteJob
} from "../../services/hrJobService";

import { useToast } from "../../contexts/ToastContext";

const DEFAULT_IMAGE =
  "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg";

const API_BASE_URL = "http://localhost:8080";

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

  const handleDelete = async (jobId) => {

    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa tin tuyển dụng này?"
      )
    ) return;

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

      console.error(error);

      showToast(
        "Xóa thất bại",
        "error"
      );
    }
  };

  /* ================= RENDER ================= */

  return (

    <HRLayout>

      <Stack spacing={3}>

        {/* HEADER */}

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

        {/* SEARCH */}

        <Stack
          direction="row"
          spacing={2}
        >

          <TextField
            size="small"
            placeholder="Tìm theo tiêu đề..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

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
              Tất cả kinh nghiệm
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

                <TableRow>

                  <TableCell align="center">
                    <b>STT</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Hình ảnh</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Tiêu đề</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Kinh nghiệm</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Mô tả</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Ngày đăng</b>
                  </TableCell>

                  <TableCell align="center">
                    <b>Hành động</b>
                  </TableCell>

                </TableRow>

              </TableHead>

              <TableBody>

                {paginatedJobs.length === 0 && (

                  <TableRow>

                    <TableCell
                      colSpan={7}
                      align="center"
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
                        src={
                          job.imageUrl
                            ? `${API_BASE_URL}${job.imageUrl}`
                            : DEFAULT_IMAGE
                        }
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
                          onClick={() =>
                            setViewJob(job)
                          }
                        >
                          <VisibilityOutlinedIcon />
                        </IconButton>

                        <IconButton
                          color="warning"
                          onClick={() =>
                            handleOpenEdit(job)
                          }
                        >
                          <EditOutlinedIcon />
                        </IconButton>

                        <IconButton
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

        {/* PAGINATION */}

        {totalPages > 1 && (

          <Stack alignItems="center">

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

    </HRLayout>
  );
}