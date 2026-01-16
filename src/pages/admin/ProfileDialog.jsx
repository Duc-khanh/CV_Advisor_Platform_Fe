import {
  Dialog, DialogTitle, DialogContent,
  TextField, Button, Avatar, Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { updateCurrentUser } from "../../services/currentUser";

export default function ProfileDialog({ open, onClose, user, onUpdated }) {
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (user) setFullName(user.fullName || "");
  }, [user]);

  if (!user) return null;

  const handleSubmit = async () => {
    try {
      const res = await updateCurrentUser(
        { fullName },
        avatar
      );
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
        <Stack spacing={2} mt={1}>
          <Avatar
            src={avatar ? URL.createObjectURL(avatar) : user.avatar}
            sx={{ width: 80, height: 80, mx: "auto" }}
          />

          <Button component="label" variant="outlined">
            Đổi ảnh đại diện
            <input hidden type="file" onChange={e => setAvatar(e.target.files[0])} />
          </Button>

          <TextField
            label="Họ tên"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            fullWidth
          />

        <TextField
  value={user.email ?? ""}
  onChange={(e) =>
    setUser({ ...user, email: e.target.value })
  }
/>


          <Button variant="contained" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
