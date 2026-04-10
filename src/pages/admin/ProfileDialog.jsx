import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, Avatar, Stack, Box 
} from "@mui/material";
import { useEffect, useState } from "react";
import { updateCurrentUser } from "../../services/currentUser";

export default function ProfileDialog({ open, onClose, user, onUpdated }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || ""
      });
      setPreviewUrl(user.avatar || "");
    }
  }, [user]);

  if (!user) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await updateCurrentUser(formData, avatarFile);
      onUpdated(res.data);
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Cập nhật thất bại");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thông tin tài khoản</DialogTitle>
      <DialogContent>
        <Stack spacing={3} mt={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Avatar src={previewUrl} sx={{ width: 100, height: 100 }} />
            <Button component="label" variant="outlined" size="small">
              Đổi ảnh đại diện
              <input hidden type="file" accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
          <TextField
            label="Họ tên"
            value={formData.fullName}
            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={formData.email}
            disabled // Thường email không nên cho sửa trực tiếp nếu là username
            fullWidth
          />
          <Button variant="contained" onClick={handleSubmit}>Lưu thay đổi</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 