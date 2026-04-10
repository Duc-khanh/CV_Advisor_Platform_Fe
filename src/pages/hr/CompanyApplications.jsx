import React, { useEffect, useState } from "react";
import axios from "axios";
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
  CircularProgress
} from "@mui/material";

const STATUS_OPTIONS = [
  "PENDING",
  "REVIEWED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED"
];

const STATUS_COLOR = {
  PENDING: "default",
  REVIEWED: "info",
  INTERVIEW: "warning",
  ACCEPTED: "success",
  REJECTED: "error"
};

export default function HRApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚠️ Tạm thời – sau này backend lấy HR từ JWT
  const companyId = 1;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8080/api/hr/applications",
        {
          params: { companyId },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setApplications(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert("Bạn không có quyền HR");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/hr/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setApplications(prev =>
        prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus }
            : app
        )
      );
    } catch (err) {
      console.error(err);
      alert("Cập nhật trạng thái thất bại");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Danh sách ứng viên
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ứng viên</TableCell>
              <TableCell>Job</TableCell>
              <TableCell>CV</TableCell>
              <TableCell>Ngày ứng tuyển</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {applications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Chưa có ứng viên nào
                </TableCell>
              </TableRow>
            )}

            {applications.map(app => (
              <TableRow key={app.applicationId} hover>
                <TableCell>#{app.userId}</TableCell>

                <TableCell>
                  <Typography fontWeight={600}>
                    {app.jobTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.location}
                  </Typography>
                </TableCell>

                <TableCell>
                  <a
                    href={`http://localhost:8080/uploads/cv/${app.cvFileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Xem CV
                  </a>
                </TableCell>

                <TableCell>
                  {new Date(app.appliedAt).toLocaleDateString("vi-VN")}
                </TableCell>

                <TableCell>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={app.status}
                      color={STATUS_COLOR[app.status]}
                      size="small"
                    />

                    <Select
                      size="small"
                      value={app.status}
                      onChange={e =>
                        updateStatus(app.applicationId, e.target.value)
                      }
                    >
                      {STATUS_OPTIONS.map(status => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
