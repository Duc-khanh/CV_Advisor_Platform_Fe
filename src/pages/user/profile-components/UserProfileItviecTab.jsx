import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  IconButton,
  Divider,
  Chip,
  Avatar,
} from "@mui/material";
import {
  Edit,
  Add,
  Delete,
  Mail,
  Phone,
  Cake,
  Wc,
  Room,
  Language,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../utils/urlHelpers";

export default function UserProfileItviecTab({
  user,
  openBasicDialog,
  openBioDialog,
  openAddProjectDialog,
  openEditProjectDialog,
  handleProjectDelete,
  openAddEduDialog,
  openEditEduDialog,
  handleEduDelete,
  openAddExpDialog,
  openEditExpDialog,
  handleExpDelete,
  openSkillDialog,
}) {
  return (
    <Stack spacing={3}>
      {/* 1. Header Card (Basic info) */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          position: "relative",
          bgcolor: "#ffffff",
        }}
      >
        <IconButton
          onClick={openBasicDialog}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            border: "1px solid #fee2e2",
            color: "#ef4444",
            "&:hover": { bgcolor: "#fee2e2" },
          }}
        >
          <Edit fontSize="small" />
        </IconButton>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "center", mb: 3 }}>
          <Avatar
            src={getMediaUrl(user.avatarUrl || user.avatar)}
            sx={{ width: 76, height: 76, fontSize: "1.8rem", bgcolor: "#db2777", fontWeight: 700 }}
          >
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : "?"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#0f172a" mb={0.5} sx={{ fontSize: "1.3rem" }}>
              {user.fullName || "Tên ứng viên"}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {user.headline || "Cập nhật chức danh hiện tại"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Info Grid - Styled as 3 columns (sm={4}) */}
        <Grid container spacing={2.5}>
          {[
            { icon: <Mail fontSize="small" sx={{ color: "#64748b" }} />, label: user.email || "Chưa cập nhật email" },
            { icon: <Phone fontSize="small" sx={{ color: "#64748b" }} />, label: user.phone || "Chưa cập nhật SĐT" },
            { icon: <Cake fontSize="small" sx={{ color: "#64748b" }} />, label: user.birthday || "Chưa cập nhật ngày sinh" },
            { icon: <Wc fontSize="small" sx={{ color: "#64748b" }} />, label: user.gender || "Chưa cập nhật giới tính" },
            { icon: <Room fontSize="small" sx={{ color: "#64748b" }} />, label: user.location || "Chưa cập nhật địa chỉ" },
            {
              icon: <Language fontSize="small" sx={{ color: "#64748b" }} />,
              label: user.personalLink ? (
                <a
                  href={user.personalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#ef4444", textDecoration: "none", fontWeight: 700 }}
                >
                  Link cá nhân
                </a>
              ) : (
                "Chưa cập nhật link cá nhân"
              ),
            },
          ].map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                {item.icon}
                <Typography variant="body2" color="#334155" fontWeight={600} sx={{ fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={typeof item.label === "string" ? item.label : ""}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* 2. Giới thiệu bản thân Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          position: "relative",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a">
            Giới thiệu bản thân
          </Typography>
          <IconButton
            onClick={openBioDialog}
            sx={{ border: "1px solid #f1f5f9", color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="#475569" sx={{ whiteSpace: "pre-line", lineHeight: 1.6, fontSize: "0.875rem" }}>
          {user.bio || "Chia sẻ tóm tắt về bản thân, thế mạnh nổi bật và mục tiêu nghề nghiệp của bạn."}
        </Typography>
      </Paper>

      {/* 3. Dự án nổi bật Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a">
            Dự án nổi bật
          </Typography>
          <IconButton
            onClick={openAddProjectDialog}
            sx={{ border: "1px solid #fee2e2", color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
        {user.projects.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            Thêm dự án nổi bật mà bạn đã tham gia hoặc tự phát triển.
          </Typography>
        ) : (
          <Stack spacing={3} divider={<Divider />}>
            {user.projects.map((proj) => (
              <Box key={proj.id} sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => openEditProjectDialog(proj)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleProjectDelete(proj.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" fontWeight={800} color="#0f172a" mb={0.5} sx={{ fontSize: "0.95rem" }}>
                  {proj.name}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "block", mb: 1 }}>
                  Vai trò: {proj.role} {proj.technologies && `| Công nghệ: ${proj.technologies}`}
                </Typography>
                <Typography variant="body2" color="#475569" sx={{ mb: 1, lineHeight: 1.5, fontSize: "0.85rem" }}>
                  {proj.description}
                </Typography>
                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#ef4444", textDecoration: "none", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Xem chi tiết dự án →
                  </a>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* 4. Học vấn Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a">
            Học vấn
          </Typography>
          <IconButton
            onClick={openAddEduDialog}
            sx={{ border: "1px solid #fee2e2", color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
        {user.education.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            Chia sẻ quá trình và trình độ học vấn của bạn.
          </Typography>
        ) : (
          <Stack spacing={3} divider={<Divider />}>
            {user.education.map((edu) => (
              <Box key={edu.id} sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => openEditEduDialog(edu)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleEduDelete(edu.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ fontSize: "0.95rem" }}>
                  {edu.school}
                </Typography>
                <Typography variant="body2" color="#475569" fontWeight={600} mt={0.5} sx={{ fontSize: "0.85rem" }}>
                  {edu.degree}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Năm tốt nghiệp: {edu.graduationDate}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* 5. Kinh nghiệm làm việc Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a">
            Kinh nghiệm làm việc
          </Typography>
          <IconButton
            onClick={openAddExpDialog}
            sx={{ border: "1px solid #fee2e2", color: "#ef4444", "&:hover": { bgcolor: "#fee2e2" } }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Box>
        {user.experience.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            Mô tả kinh nghiệm làm việc thực tế cùng các thành tựu của bạn.
          </Typography>
        ) : (
          <Stack spacing={3} divider={<Divider />}>
            {user.experience.map((exp) => (
              <Box key={exp.id} sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute", right: 0, top: 0, display: "flex", gap: 1 }}>
                  <IconButton size="small" color="primary" onClick={() => openEditExpDialog(exp)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleExpDelete(exp.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="body2" fontWeight={800} color="#0f172a" mb={0.5} sx={{ fontSize: "0.95rem" }}>
                  {exp.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={750} sx={{ display: "block", mb: 1 }}>
                  {exp.company} ({exp.startDate} - {exp.endDate || "Hiện tại"})
                </Typography>
                <Typography variant="body2" color="#475569" sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>

      {/* 6. Kỹ năng Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={850} color="#0f172a">
            Kỹ năng
          </Typography>
          <IconButton
            onClick={openSkillDialog}
            sx={{ border: "1px solid #f1f5f9", color: "#64748b", "&:hover": { bgcolor: "#f1f5f9" } }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Box>
        {user.skills.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.875rem" }}>
            Thêm các kỹ năng kỹ thuật chính (Ví dụ: React, Java, Node.js).
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {user.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                sx={{
                  bgcolor: "#f1f5f9",
                  color: "#334155",
                  fontWeight: 700,
                  borderRadius: 2,
                  px: 1.5,
                  fontSize: "0.8rem",
                }}
              />
            ))}
          </Box>
        )}
      </Paper>
    </Stack>
  );
}
