import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import UserLayout from "../../components/UserLayout";
import { getCurrentUser, updateCurrentUser } from "../../services/currentUser";
import { useToast } from "../../contexts/ToastContext";

export default function UserProfile() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    bio: "",
    skills: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const data = res.data.data || res.data;
        setForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || data.mobile || "",
          headline: data.headline || data.title || "",
          location: data.location || data.address || "",
          bio: data.bio || data.about || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills || "",
        });
        setAvatarPreview(data.avatar || "");
      } catch (err) {
        console.error("Không lấy được thông tin người dùng:", err);
        showToast("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      headline: form.headline,
      location: form.location,
      bio: form.bio,
      skills: form.skills
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      await updateCurrentUser(payload, avatarFile);
      showToast("Cập nhật hồ sơ thành công.", "success");
      setAvatarFile(null);
    } catch (err) {
      console.error("Cập nhật hồ sơ thất bại:", err);
      showToast(
        err.response?.data?.message || "Không thể cập nhật hồ sơ, vui lòng thử lại.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <UserLayout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={1}>
          Hồ sơ ứng viên
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Cập nhật thông tin cá nhân để AI và nhà tuyển dụng dễ dàng kết nối với bạn hơn.
        </Typography>

        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: "1px solid #e2e8f0" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
                  <Avatar
                    src={avatarPreview}
                    sx={{ width: 96, height: 96, fontSize: "1.5rem", bgcolor: "#4f46e5" }}
                  >
                    {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>
                      Ảnh đại diện
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Chọn ảnh để hiển thị trên hồ sơ ứng viên.
                    </Typography>
                    <Button variant="outlined" component="label" sx={{ textTransform: "none" }}>
                      Chọn ảnh
                      <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    </Button>
                  </Box>
                </Box>

                <TextField
                  fullWidth
                  name="fullName"
                  label="Họ và tên"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  name="phone"
                  label="Số điện thoại"
                  value={form.phone}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="headline"
                  label="Tiêu đề hồ sơ"
                  placeholder="Ví dụ: Frontend Developer chuyên React.js"
                  value={form.headline}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="location"
                  label="Nơi làm việc mong muốn"
                  value={form.location}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="skills"
                  label="Kỹ năng chính"
                  placeholder="React, JavaScript, Node.js, SQL"
                  value={form.skills}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  name="bio"
                  label="Giới thiệu bản thân"
                  multiline
                  rows={5}
                  value={form.bio}
                  onChange={handleChange}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={saving}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    {saving ? "Đang lưu..." : "Lưu hồ sơ"}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Paper>
      </Box>
    </UserLayout>
  );
}
