import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid,
  Box,
  Stack,
  Typography
} from "@mui/material";
import { createJob, updateJob } from "../../services/hrJobService";
const DEFAULT_IMAGE = "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg";
const API_BASE_URL = "http://localhost:8080";

export default function HrJobForm({ job, onClose, onSuccess }) {
  /* ================= STATE ================= */
  const [form, setForm] = useState({
    title: "",
    experienceLevel: "",
    description: "",
    candidateRequirements: "",
    location: "",
    salaryRange: "",
    jobType: "Full-time",
    vacancies: 1,
    requiredSkills: "",
    expiredAt: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= EFFECT ================= */
  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "",
        experienceLevel: job.experienceLevel || "",
        description: job.description || "",
        candidateRequirements: job.candidateRequirements || "",
        location: job.location || "",
        salaryRange: job.salaryRange || "",
        jobType: job.jobType || "Full-time",
        vacancies: job.vacancies || 1,
        requiredSkills: Array.isArray(job.requiredSkills)
          ? job.requiredSkills.join(", ")
          : "",
        expiredAt: job.expiredAt ? job.expiredAt.slice(0, 10) : "",
      });
      setPreview(job.imageUrl || null);
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'vacancies') formData.append(key, Number(form[key]));
        else if (key === 'expiredAt') formData.append(key, form[key] ? `${form[key]}T23:59:59` : "");
        else if (key !== 'requiredSkills') formData.append(key, form[key]);
      });

      form.requiredSkills.split(",").map(s => s.trim()).filter(Boolean)
        .forEach(skill => formData.append("requiredSkills", skill));

      if (imageFile) formData.append("image", imageFile);

      if (job) await updateJob(job.jobId, formData);
      else await createJob(formData);
      
      onSuccess();
    } catch (err) {
      console.error("Lỗi khi lưu job:", err);
      alert("Không thể lưu tin tuyển dụng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md" onClose={onClose} scroll="paper">
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.2rem" }}>
        {job ? "Cập nhật tin tuyển dụng" : "Đăng tin tuyển dụng mới"}
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" id="job-form" onSubmit={handleSubmit}>
          <Stack spacing={2.5} mt={1}>
            <TextField
              label="Tiêu đề công việc"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              select
              label="Kinh nghiệm"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              required
              fullWidth
              size="small"
            >
              <MenuItem value="INTERN">Intern</MenuItem>
              <MenuItem value="MID">Mid</MenuItem>
              <MenuItem value="SENIOR">Senior</MenuItem>
            </TextField>

            <TextField
              multiline
              rows={3}
              label="Mô tả công việc"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              fullWidth
              size="small"
            />

            {/* Hàng: Địa điểm & Mức lương - Chia đều 50/50, tổng chiều dài bằng các ô khác */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                label="Địa điểm"
                name="location"
                value={form.location}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Mức lương"
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{ flex: 1 }}
              />
            </Box>

            {/* Hàng: Hình thức & Số lượng - Chia đều 50/50, tổng chiều dài bằng các ô khác */}
            <Box sx={{ display: 'flex', gap: 2, width: '100%', flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                select
                label="Hình thức"
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                fullWidth
                size="small"
                sx={{ flex: 1 }}
              >
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Part-time">Part-time</MenuItem>
              </TextField>
              <TextField
                type="number"
                label="Số lượng tuyển"
                name="vacancies"
                value={form.vacancies}
                onChange={handleChange}
                fullWidth
                size="small"
                inputProps={{ min: 1 }}
                sx={{ flex: 1 }}
              />
            </Box>

            <TextField
              label="Yêu cầu ứng viên"
              name="candidateRequirements"
              value={form.candidateRequirements}
              onChange={handleChange}
              multiline
              rows={2}
              fullWidth
              size="small"
            />

            <TextField
              label="Kỹ năng (cách nhau bằng dấu phẩy)"
              name="requiredSkills"
              value={form.requiredSkills}
              onChange={handleChange}
              fullWidth
              size="small"
            />

            <TextField
              type="date"
              label="Hạn nộp"
              name="expiredAt"
              value={form.expiredAt}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              size="small"
            />

            {/* PHẦN ẢNH: Đã thu nhỏ lại */}
            <Box sx={{ border: "1px dashed #ccc", p: 2, borderRadius: 1, textAlign: 'center' }}>
              <Button variant="outlined" component="label" size="small" sx={{ mb: 1 }}>
                Chọn ảnh công việc
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>

              {preview && (
                <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 0.5 }}>
                    Xem trước ảnh:
                  </Typography>
                  <img
                  src={
                    preview 
                      ? (preview.startsWith("blob:") ? preview : `${API_BASE_URL}${preview}`) 
                      : DEFAULT_IMAGE
                  }
                  alt="preview"
                  style={{ 
                    width: "150px", 
                    height: "150px",
                    borderRadius: "4px", 
                    objectFit: "cover",
                    border: "1px solid #eee"
                  }}
                  onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
                />
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading} size="small">HỦY</Button>
        <Button type="submit" form="job-form" variant="contained" disabled={loading} size="small">
          {loading ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}