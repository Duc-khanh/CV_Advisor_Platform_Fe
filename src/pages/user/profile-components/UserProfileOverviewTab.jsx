import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Stack,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  ChevronRight,
  Description,
  Visibility,
  FilePresent,
  ArrowForward,
  AutoAwesome,
  Download,
  WorkOutline,
  BookmarkBorder,
  MailOutline,
  CloudUpload,
} from "@mui/icons-material";
import { getCvUrl, getMediaUrl } from "../../../utils/urlHelpers";
import { cvService } from "../../../services/user";

export default function UserProfileOverviewTab({
  user,
  completionPercent,
  setActiveTab,
  appliedJobsCount = 0,
  savedJobsCount = 0,
  inviteCount = 0,
}) {
  const [attachedCvs, setAttachedCvs] = useState([]);
  const [loadingCvs, setLoadingCvs] = useState(true);

  useEffect(() => {
    let active = true;
    const loadAttachedCvs = async () => {
      setLoadingCvs(true);
      try {
        const response = await cvService.getUserCV();
        const items = Array.isArray(response)
          ? response
          : response?.files || response?.cvs || response?.data || (response ? [response] : []);
        if (active) setAttachedCvs(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Không thể tải CV đính kèm ở trang tổng quan:", error);
        if (active) setAttachedCvs([]);
      } finally {
        if (active) setLoadingCvs(false);
      }
    };
    loadAttachedCvs();
    return () => { active = false; };
  }, []);

  const getFileName = (cv) => {
    return cv.fileName || cv.name || cv.originalName || cv.title || "CV của bạn";
  };

  const getFileSizeText = (cv) => {
    const fileSize = cv.size || cv.fileSize || cv.metadata?.size;
    if (!fileSize || typeof fileSize !== "number") return null;
    return `${(fileSize / 1024 / 1024).toFixed(1)} MB`;
  };

  const getFileUpdateDate = (cv) => {
    const dateValue = cv.updatedAt || cv.modifiedAt || cv.uploadedAt || cv.createdAt || cv.timestamp;
    if (!dateValue) return "Gần đây";
    const date = new Date(dateValue);
    return date.toLocaleDateString("vi-VN");
  };

  const handleOpenFile = async (cv, shouldDownload = false) => {
    const id = cv.id || cv.cvId || cv.fileId || cv._id;
    if (!id) {
      const rawUrl = cv.fileUrl || cv.cvFileUrl || cv.url || cv.path;
      if (rawUrl) {
        const fullUrl = getCvUrl(rawUrl);
        window.open(fullUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }
    try {
      const blob = await cvService.getCVFile(id);
      const objectUrl = URL.createObjectURL(blob);
      if (shouldDownload) {
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = getFileName(cv);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        window.open(objectUrl, "_blank", "noopener,noreferrer");
      }
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (error) {
      console.error("Lỗi khi mở CV:", error);
      const rawUrl = cv.fileUrl || cv.cvFileUrl || cv.url || cv.path;
      if (rawUrl) {
        window.open(getCvUrl(rawUrl), "_blank", "noopener,noreferrer");
      }
    }
  };

  const initials = user.fullName
    ? user.fullName
        .trim()
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "K";

  return (
    <Stack spacing={3}>
      {/* 1. Header Card (Basic info summary) */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          {/* Avatar circle */}
          <Avatar
            src={getMediaUrl(user.avatarUrl || user.avatar)}
            sx={{
              width: 72,
              height: 72,
              background: "linear-gradient(135deg, #0284c7, #2563eb)",
              color: "#ffffff",
              fontSize: "1.8rem",
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(2,132,199,0.25)",
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h5" fontWeight={850} color="#0f172a" mb={0.5}>
              {user.fullName || "Tên ứng viên"}
            </Typography>

            <Stack spacing={0.5}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <AutoAwesome sx={{ fontSize: 16, color: "#0284c7" }} />
                <Typography variant="body2" fontWeight={600} color="#475569">
                  {user.headline || "Chưa cập nhật chức danh"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#64748b" }}>
                <Description sx={{ fontSize: 16, color: "#94a3b8" }} />
                <Typography variant="body2" color="#64748b">
                  {user.email || "nguyenkhanh2561990@gmail.com"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Button
            onClick={() => setActiveTab("profile_itviec")}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: "none",
              color: "#0284c7",
              fontWeight: 800,
              fontSize: "0.875rem",
              borderRadius: 2,
              px: 2,
              py: 0.8,
              bgcolor: "#f0f9ff",
              border: "1px solid #bae6fd",
              "&:hover": { bgcolor: "#e0f2fe", borderColor: "#0284c7" },
            }}
          >
            Cập nhật hồ sơ
          </Button>
        </Box>
      </Paper>

      {/* 2. "Nhà tuyển dụng xem CV" banner (Light blue theme matching admin) */}
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.02)",
          border: "1.5px solid #bae6fd",
          background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)",
          position: "relative",
        }}
      >
        {/* NEW badge */}
        <Box
          sx={{
            position: "absolute",
            top: 14,
            right: 16,
            px: 1,
            py: 0.2,
            borderRadius: "6px",
            bgcolor: "#e0f2fe",
            border: "1px solid #bae6fd",
            color: "#0284c7",
            fontWeight: 800,
            fontSize: "0.68rem",
            letterSpacing: "0.05em",
          }}
        >
          MỚI
        </Box>

        <Box sx={{ display: "flex", gap: 2.5, alignItems: "center" }}>
          {/* Left badge */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              bgcolor: "#e0f2fe",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #bae6fd",
              flexShrink: 0,
            }}
          >
            <Typography variant="h6" fontWeight={900} color="#0284c7" sx={{ lineHeight: 1 }}>
              0
            </Typography>
            <Typography variant="caption" fontWeight={700} color="#0369a1" sx={{ fontSize: "0.55rem" }}>
              lượt xem
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" fontWeight={800} color="#0369a1" mb={0.4}>
              Nhà tuyển dụng xem CV
            </Typography>
            <Typography variant="body2" color="#475569" sx={{ fontSize: "0.85rem", lineHeight: 1.4 }}>
              CV ẩn danh của bạn được các nhà tuyển dụng xem khi tìm kiếm ứng viên tiềm năng.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 3. Hồ sơ đính kèm của bạn */}
      <Paper sx={{ p: 3, borderRadius: 4, boxShadow: "0 1px 3px rgba(15,23,42,0.05)", border: "1px solid #e2e8f0", bgcolor: "#ffffff" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Hồ sơ đính kèm của bạn
            </Typography>
            <Typography variant="caption" color="#64748b" sx={{ fontSize: "0.8rem" }}>
              CV mới nhất dùng khi ứng tuyển trên CareerGo / CvAdvisor
            </Typography>
          </Box>
          <Button
            onClick={() => setActiveTab("attached_cv")}
            endIcon={<ChevronRight />}
            sx={{
              textTransform: "none",
              color: "#0284c7",
              fontWeight: 800,
              fontSize: "0.85rem",
              "&:hover": { bgcolor: "#f0f9ff" },
            }}
          >
            Quản lý hồ sơ
          </Button>
        </Stack>

        {loadingCvs ? (
          <Box sx={{ minHeight: 90, display: "grid", placeItems: "center", bgcolor: "#f8fafc", borderRadius: 3 }}>
            <CircularProgress size={24} sx={{ color: "#0284c7" }} />
          </Box>
        ) : attachedCvs.length > 0 ? (
          <Stack spacing={1.5}>
            {attachedCvs.slice(0, 2).map((cv, idx) => {
              const fileName = getFileName(cv);
              const fileSizeText = getFileSizeText(cv);
              const updateDate = getFileUpdateDate(cv);
              const isDefault = idx === 0;

              return (
                <Box
                  key={cv.id || cv.cvId || idx}
                  sx={{
                    p: 2.2,
                    border: "1px solid #e2e8f0",
                    borderRadius: 3,
                    bgcolor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    transition: "all .2s ease",
                    "&:hover": {
                      borderColor: "#bae6fd",
                      bgcolor: "#f0f9ff",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        width: 46,
                        height: 46,
                        borderRadius: 2.5,
                        bgcolor: "#e0f2fe",
                        border: "1px solid #bae6fd",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FilePresent sx={{ color: "#0284c7", fontSize: 26 }} />
                    </Box>

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography
                          variant="body2"
                          fontWeight={800}
                          color="#0f172a"
                          noWrap
                          sx={{
                            cursor: "pointer",
                            "&:hover": { color: "#0284c7" },
                          }}
                          onClick={() => handleOpenFile(cv, false)}
                        >
                          {fileName}
                        </Typography>
                        {isDefault && (
                          <Chip
                            label="CV chính"
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.68rem",
                              fontWeight: 800,
                              bgcolor: "#e0f2fe",
                              color: "#0369a1",
                              border: "1px solid #bae6fd",
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="caption" color="#64748b" sx={{ display: "block", mt: 0.4 }}>
                        Cập nhật lần cuối: {updateDate} {fileSizeText ? `• ${fileSizeText}` : ""}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility sx={{ fontSize: 16 }} />}
                      onClick={() => handleOpenFile(cv, false)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        borderRadius: 2,
                        color: "#0284c7",
                        bgcolor: "#ffffff",
                        borderColor: "#bae6fd",
                        "&:hover": { bgcolor: "#e0f2fe", borderColor: "#0284c7" },
                      }}
                    >
                      Xem CV
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Download sx={{ fontSize: 16 }} />}
                      onClick={() => handleOpenFile(cv, true)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        borderRadius: 2,
                        color: "#475569",
                        bgcolor: "#ffffff",
                        borderColor: "#e2e8f0",
                        "&:hover": { bgcolor: "#f1f5f9", borderColor: "#94a3b8" },
                      }}
                    >
                      Tải về
                    </Button>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box
            sx={{
              p: 3.5,
              textAlign: "center",
              bgcolor: "#f8fafc",
              border: "1.5px dashed #cbd5e1",
              borderRadius: 3,
            }}
          >
            <Typography variant="body2" fontWeight={700} color="#334155" mb={0.5}>
              Bạn chưa có CV đính kèm nào trên hệ thống
            </Typography>
            <Typography variant="caption" color="#64748b" display="block" mb={2}>
              Tải CV định dạng PDF hoặc DOCX để ứng tuyển nhanh chóng hơn.
            </Typography>
            <Button
              onClick={() => setActiveTab("attached_cv")}
              variant="contained"
              startIcon={<CloudUpload />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: "#0284c7",
                "&:hover": { bgcolor: "#0369a1" },
              }}
            >
              Tải CV lên ngay
            </Button>
          </Box>
        )}
      </Paper>

      {/* 4. "Hồ sơ tuyển dụng" box (completeness and templates preview) */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={2}>
          Hồ sơ tuyển dụng
        </Typography>

        <Grid container spacing={3} alignItems="center">
          {/* Half ring completeness SVG gauge */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-start" } }}>
              <Box sx={{ position: "relative", width: 110, height: 110, display: "flex", justifyContent: "center" }}>
                {/* SVG circular progress */}
                <svg width="110" height="110" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#e0f2fe"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#0284c7"
                    strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * completionPercent) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight={900} color="#0284c7" sx={{ lineHeight: 1 }}>
                    {completionPercent}%
                  </Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ fontSize: "0.6rem" }}>
                    hoàn thành
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Description text */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box>
              <Typography variant="body2" color="#475569" mb={1} sx={{ lineHeight: 1.5 }}>
                Nâng cấp hồ sơ của bạn lên <strong style={{ color: "#0284c7" }}>70%</strong> để mở khóa các mẫu CV chuyên nghiệp và thu hút nhà tuyển dụng.
              </Typography>
              <Button
                onClick={() => setActiveTab("profile_itviec")}
                endIcon={<ChevronRight />}
                sx={{
                  textTransform: "none",
                  color: "#0284c7",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  p: 0,
                  "&:hover": { bgcolor: "transparent", color: "#0369a1" },
                }}
              >
                Nâng cấp hồ sơ
              </Button>
            </Box>
          </Grid>

          {/* Previews of CV template thumbnails */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end", flexWrap: "wrap" }}>
              {/* Sample template 1 */}
              <Box
                sx={{
                  width: 54,
                  height: 72,
                  borderRadius: 1,
                  border: "1px solid #cbd5e1",
                  bgcolor: "#f1f5f9",
                  backgroundImage: "url('https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=200')",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                }}
              />
              {/* Sample template 2 */}
              <Box
                sx={{
                  width: 54,
                  height: 72,
                  borderRadius: 1,
                  border: "1px solid #cbd5e1",
                  bgcolor: "#f1f5f9",
                  backgroundImage: "url('https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200')",
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
                }}
              />
              {/* Explore action template */}
              <Box
                onClick={() => setActiveTab("profile_itviec")}
                sx={{
                  width: 60,
                  height: 72,
                  borderRadius: 1.5,
                  border: "1.5px dashed #bae6fd",
                  bgcolor: "#f0f9ff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  p: 0.5,
                  transition: "0.2s",
                  "&:hover": { bgcolor: "#e0f2fe" },
                }}
              >
                <IconButton size="small" sx={{ bgcolor: "#0284c7", color: "#ffffff", width: 22, height: 22, p: 0, mb: 0.5, "&:hover": { bgcolor: "#0369a1" } }}>
                  <ArrowForward sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography variant="caption" color="#0369a1" fontWeight={800} align="center" sx={{ fontSize: "0.55rem", lineHeight: 1.1 }}>
                  Khám phá mẫu CV
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 5. "Hoạt động của bạn" box */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Typography variant="subtitle1" fontWeight={800} color="#0f172a" mb={2.5}>
          Hoạt động của bạn
        </Typography>

        <Grid container spacing={2.5}>
          {/* Applied jobs block */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              onClick={() => setActiveTab("my_jobs")}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#f0f9ff",
                border: "1.5px solid #bae6fd",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(2, 132, 199, 0.12)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#0369a1" mb={1} sx={{ fontSize: "0.85rem" }}>
                Việc làm đã ứng tuyển
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#0284c7">
                {appliedJobsCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -5,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                }}
              >
                <WorkOutline sx={{ fontSize: 85, color: "#0284c7" }} />
              </Box>
            </Paper>
          </Grid>

          {/* Saved jobs block */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              onClick={() => setActiveTab("my_jobs")}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#f8fafc",
                border: "1.5px solid #cbd5e1",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(15, 23, 42, 0.08)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#334155" mb={1} sx={{ fontSize: "0.85rem" }}>
                Việc làm đã lưu
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#0f172a">
                {savedJobsCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -5,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                }}
              >
                <BookmarkBorder sx={{ fontSize: 85, color: "#475569" }} />
              </Box>
            </Paper>
          </Grid>

          {/* Invitations block */}
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper
              onClick={() => setActiveTab("invites")}
              sx={{
                p: 2.5,
                borderRadius: 3.5,
                bgcolor: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 6px 15px rgba(16, 185, 129, 0.12)",
                },
              }}
            >
              <Typography variant="body2" fontWeight={800} color="#166534" mb={1} sx={{ fontSize: "0.85rem" }}>
                Lời mời công việc
              </Typography>
              <Typography variant="h3" fontWeight={900} color="#10b981">
                {inviteCount} <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>&gt;</span>
              </Typography>
              <Box
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -5,
                  opacity: 0.12,
                  transform: "rotate(-15deg)",
                }}
              >
                <MailOutline sx={{ fontSize: 85, color: "#10b981" }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  );
}
