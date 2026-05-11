import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/axios";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  CircularProgress,
  Pagination,
  TextField,
  InputAdornment,
  Stack,
  Avatar,
  Tooltip,
  IconButton,
  FormControl,
  InputLabel,
  Button,
  Divider
} from "@mui/material";

import {
  Search,
  Refresh,
  Description,
  Person,
  Work
} from "@mui/icons-material";

import HRLayout from "../../components/HRLayout";
import { useToast } from "../../contexts/ToastContext";

const STATUS_OPTIONS = [
  "ALL",
  "PENDING",
  "REVIEWING",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED"
];

const STATUS_COLOR = {
  PENDING: "default",
  REVIEWING: "info",
  INTERVIEW: "warning",
  ACCEPTED: "success",
  REJECTED: "error"
};

export default function HRApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);

  const [updatingId, setUpdatingId] = useState(null);

  const rowsPerPage = 5;

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

      const res = await api.get(
        "/api/hr/applications",
        getAuthHeader()
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);

      showToast(
        "Không thể tải danh sách ứng viên",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      setUpdatingId(applicationId);

      await api.put(
        `/api/hr/applications/${applicationId}/status`,
        null,
        {
          params: {
            status: newStatus
          },
          ...getAuthHeader()
        }
      );

      setApplications(prev =>
        prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );

      showToast(
        "Cập nhật trạng thái thành công",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast(
        "Cập nhật trạng thái thất bại",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // FILTER + SEARCH
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchStatus =
        statusFilter === "ALL" ||
        app.status === statusFilter;

      const keyword =
        searchKeyword.toLowerCase();

      const matchSearch =
        app.jobTitle?.toLowerCase().includes(keyword) ||
        app.location?.toLowerCase().includes(keyword) ||
        app.userId?.toString().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [applications, statusFilter, searchKeyword]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredApplications.length / rowsPerPage
  );

  const paginatedApplications =
    filteredApplications.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
    );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchKeyword]);

  if (loading) {
    return (
      <HRLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress />
        </Box>
      </HRLayout>
    );
  }

  return (
    <HRLayout>
      <Box p={3}>
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 4,
            background:
              "linear-gradient(to right, #1976d2, #42a5f5)",
            color: "white"
          }}
        >
          <Typography
            variant="h4"
            fontWeight={700}
          >
            Quản lý ứng viên
          </Typography>

          <Typography mt={1}>
            Theo dõi trạng thái ứng tuyển và
            quản lý ứng viên hiệu quả
          </Typography>
        </Paper>

        {/* FILTER */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row"
            }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <TextField
              size="small"
              placeholder="Tìm theo job, địa điểm, user..."
              value={searchKeyword}
              onChange={e =>
                setSearchKeyword(e.target.value)
              }
              sx={{ width: 320 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }}
            />

            <Stack direction="row" spacing={2}>
              <FormControl size="small">
                <InputLabel>
                  Lọc trạng thái
                </InputLabel>

                <Select
                  value={statusFilter}
                  label="Lọc trạng thái"
                  onChange={e =>
                    setStatusFilter(e.target.value)
                  }
                  sx={{ minWidth: 180 }}
                >
                  {STATUS_OPTIONS.map(status => (
                    <MenuItem
                      key={status}
                      value={status}
                    >
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchApplications}
              >
                Làm mới
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 4,
            overflow: "hidden"
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  bgcolor: "#1976d2"
                }}
              >
                <TableCell sx={{ color: "white" }}>
                  STT
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  Ứng viên
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  Công việc
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  CV
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  Ngày ứng tuyển
                </TableCell>

                <TableCell sx={{ color: "white" }}>
                  Trạng thái
                </TableCell>

                <TableCell
                  align="center"
                  sx={{ color: "white" }}
                >
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedApplications.length ===
              0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{ py: 6 }}
                  >
                    <Typography color="text.secondary">
                      Không có dữ liệu ứng viên
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedApplications.map(
                  (app, index) => (
                    <TableRow
                      key={app.applicationId}
                      hover
                    >
                      {/* STT */}
                      <TableCell>
                        {(page - 1) *
                          rowsPerPage +
                          index +
                          1}
                      </TableCell>
<TableCell>
  <Stack
    direction="row"
    spacing={2}
    alignItems="center"
  >
    <Avatar
      sx={{
        bgcolor: "#1976d2",
        width: 45,
        height: 45,
        fontWeight: 700
      }}
    >
      {app.fullName?.charAt(0)}
    </Avatar>

    <Box>
      <Typography fontWeight={700}>
        {app.fullName}
      </Typography>

      {/* <Typography
        variant="body2"
        color="text.secondary"
      >
        {app.email}
      </Typography> */}
    </Box>
  </Stack>
</TableCell>

                      {/* JOB */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography
                            fontWeight={700}
                          >
                            {app.jobTitle}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Work
                              sx={{
                                fontSize: 16,
                                color:
                                  "text.secondary"
                              }}
                            />

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {app.location}
                            </Typography>
                          </Stack>
                        </Stack>
                      </TableCell>

                      {/* CV */}
                      <TableCell>
                        <Tooltip title="Mở CV">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={
                              <Description />
                            }
                            href={`http://localhost:8080/uploads/cv/${app.cvFileUrl}`}
                            target="_blank"
                          >
                            Xem CV
                          </Button>
                        </Tooltip>
                      </TableCell>

                      {/* DATE */}
                      <TableCell>
                        {new Date(
                          app.appliedAt
                        ).toLocaleDateString(
                          "vi-VN"
                        )}
                      </TableCell>

                      {/* STATUS */}
                      <TableCell>
                        <Chip
                          label={app.status}
                          color={
                            STATUS_COLOR[
                              app.status
                            ]
                          }
                          sx={{
                            fontWeight: 700,
                            minWidth: 110
                          }}
                        />
                      </TableCell>

                      {/* ACTION */}
                      <TableCell align="center">
                        <Select
                          size="small"
                          value={app.status}
                          disabled={
                            updatingId ===
                            app.applicationId
                          }
                          onChange={e =>
                            updateStatus(
                              app.applicationId,
                              e.target.value
                            )
                          }
                          sx={{
                            minWidth: 160
                          }}
                        >
                          {STATUS_OPTIONS.filter(
                            s => s !== "ALL"
                          ).map(status => (
                            <MenuItem
                              key={status}
                              value={status}
                            >
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    </TableRow>
                  )
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* FOOTER */}
        <Paper
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 3
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row"
            }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            <Typography color="text.secondary">
              Tổng ứng viên:{" "}
              <strong>
                {filteredApplications.length}
              </strong>
            </Typography>

            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) =>
                setPage(value)
              }
              color="primary"
            />
          </Stack>
        </Paper>
      </Box>
    </HRLayout>
  );
}