import { useState } from "react";
import { TextField, Button, Stack, MenuItem } from "@mui/material";

export default function UserForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    password: "",
    role: initialData?.role || "USER",
    avatar: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // 1. Tạo JSON object cho thông tin text
    const userData = {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      password: form.password,
    };

    // 2. Gắn vào 'data' kèm theo Blob type application/json
    formData.append(
      "data",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );

    // 3. Gắn file vào 'avatar'
    if (form.avatar) {
      formData.append("avatar", form.avatar);
    }

    onSubmit(formData);
  };

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <TextField
        name="fullName"
        label="Họ tên"
        fullWidth
        value={form.fullName}
        onChange={handleChange}
        required
      />

      <TextField
        name="email"
        label="Email"
        type="email"
        fullWidth
        value={form.email}
        onChange={handleChange}
        required
      />

      {!initialData && (
        <TextField
          name="password"
          label="Mật khẩu"
          type="password"
          fullWidth
          onChange={handleChange}
          required
        />
      )}

      <TextField
        select
        name="role"
        label="Quyền"
        fullWidth
        value={form.role}
        onChange={handleChange}
      >
        <MenuItem value="USER">USER</MenuItem>
        <MenuItem value="HR">HR</MenuItem>
        <MenuItem value="ADMIN">ADMIN</MenuItem>
      </TextField>

      <Button variant="outlined" component="label" fullWidth>
        {form.avatar ? `Đã chọn: ${form.avatar.name}` : "Upload Avatar"}
        <input type="file" hidden name="avatar" onChange={handleChange} accept="image/*" />
      </Button>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button onClick={onCancel} variant="text" color="inherit">Hủy</Button>
        <Button type="submit" variant="contained">Lưu</Button>
      </Stack>
    </Stack>
  );
}