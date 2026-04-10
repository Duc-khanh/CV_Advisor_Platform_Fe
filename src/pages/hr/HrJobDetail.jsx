import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  Divider,
  Chip,
  Grid
} from "@mui/material";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

const API_BASE_URL = "http://localhost:8080";
const DEFAULT_IMAGE =
  "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg";

export default function HrJobDetail({ job, open, onClose }) {
  if (!job) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* ===== TITLE ===== */}
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "1.6rem",
          color: "#1976d2",
          textAlign: "center",
          fontFamily: "'Roboto', sans-serif"
        }}
      >
        Chi Tiết Tin Tuyển Dụng
      </DialogTitle>

      {/* ===== CONTENT ===== */}
      <DialogContent dividers>
        <Grid container spacing={4}>
          {/* ===== LEFT: IMAGE ===== */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%"
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 280 }}>
                <img
                  src={
                    job.imageUrl
                      ? `${API_BASE_URL}${job.imageUrl}`
                      : DEFAULT_IMAGE
                  }
                  alt="job"
                  onError={(e) => (e.target.src = DEFAULT_IMAGE)}
                  style={{
                    width: "100%",
                    height: "220px",
                    borderRadius: "16px",
                    objectFit: "cover",
                    display: "block",
                    margin: "0 auto",
                    boxShadow: "0px 6px 24px rgba(0,0,0,0.18)",
                    border: "1px solid #eee"
                  }}
                />
              </Box>
            </Box>
          </Grid>

          {/* ===== RIGHT: DETAIL ===== */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Title */}
              <Box>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {job.title}
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Chip
                    label={job.experienceLevel}
                    color="primary"
                    size="small"
                  />
                  <Chip
                    label={job.jobType}
                    color="success"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Box>

              <Divider />

              {/* Quick info */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnOutlinedIcon fontSize="small" />
                    <Typography variant="body1">
                      <b>Địa điểm:</b>{" "}
                      {job.location || "Chưa cập nhật"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoneyOutlinedIcon fontSize="small" />
                    <Typography variant="body1">
                      <b>Lương:</b>{" "}
                      {job.salaryRange || "Thỏa thuận"}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <PersonOutlineOutlinedIcon fontSize="small" />
                    <Typography variant="body1">
                      <b>Số lượng:</b> {job.vacancies} ứng viên
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WorkOutlineOutlinedIcon fontSize="small" />
                    <Typography variant="body1">
                      <b>Hình thức:</b> {job.jobType}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>

              <Divider />

              {/* Description */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Mô tả công việc
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    color: "text.secondary",
                    lineHeight: 1.7
                  }}
                >
                  {job.description}
                </Typography>
              </Box>

              {/* Requirements */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Yêu cầu ứng viên
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-line",
                    color: "text.secondary",
                    lineHeight: 1.7
                  }}
                >
                  {job.candidateRequirements || "Không có yêu cầu cụ thể"}
                </Typography>
              </Box>

              {/* Skills */}
              <Box>
                <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                  Kỹ năng cần thiết
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {Array.isArray(job.requiredSkills) &&
                  job.requiredSkills.length > 0 ? (
                    job.requiredSkills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" />
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      Chưa cập nhật kỹ năng
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />

              {/* Dates */}
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={600}>
                  📅 <b>Ngày đăng:</b>{" "}
                  {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                </Typography>

                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="error"
                >
                  ⏰ <b>Hạn nộp:</b>{" "}
                  {job.expiredAt
                    ? new Date(job.expiredAt).toLocaleDateString("vi-VN")
                    : "Liên hệ"}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ===== ACTIONS ===== */}
      <DialogActions sx={{ p: 2, bgcolor: "#f9f9f9" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
        >
          Đóng 
        </Button>
      </DialogActions>
    </Dialog>
  );
}
