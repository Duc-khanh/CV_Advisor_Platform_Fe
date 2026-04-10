import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Stack, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Select, FormControl, InputLabel,
  TablePagination, Chip, InputAdornment, Avatar,
  Typography, Paper, Box
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import {
  getUsers,
  createUser,
  updateUser,
  toggleUserStatus
} from "../../services/adminUserService";
import UserForm from "./UserForm";
import AdminLayout from "../../components/AdminLayout";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    enabled: "",
    page: 0,
    size: 5,
  });

  const loadUsers = useCallback(async () => {
    try {
      const params = {
        ...filters,
        enabled: filters.enabled === ""
          ? null
          : filters.enabled === "true",
      };
      const data = await getUsers(params);
      setUsers(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      console.error("Lỗi load user:", error);
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 0 }));
  };

  const handleChangePage = (_, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (e) => {
    setFilters((prev) => ({
      ...prev,
      size: parseInt(e.target.value, 10),
      page: 0,
    }));
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.userId || selectedUser.id, formData);
      } else {
        await createUser(formData);
      }
      setOpen(false);
      loadUsers();
    } catch {
      alert("Thao tác thất bại!");
    }
  };

  const handleToggleStatus = async (user) => {
    const action = user.enabled ? "KHÓA" : "MỞ";
    if (window.confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) {
      await toggleUserStatus(user.userId || user.id);
      loadUsers();
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={3}>

          {/* HEADER */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" fontWeight={800} color="#1e293b">
              Quản lý người dùng
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedUser(null);
                setOpen(true);
              }}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Thêm User
            </Button>
          </Stack>

          {/* FILTER */}
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <TextField
                name="search"
                size="small"
                placeholder="Tìm tên hoặc email..."
                value={filters.search}
                onChange={handleFilterChange}
                sx={{ width: 320 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Quyền</InputLabel>
                <Select
                  name="role"
                  value={filters.role}
                  label="Quyền"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="enabled"
                  value={filters.enabled}
                  label="Trạng thái"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Đã khóa</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* TABLE */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Họ tên</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Hành động</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((u, index) => (
                  <TableRow key={u.userId || u.id} hover>
                    <TableCell align="center">
                      {filters.page * filters.size + index + 1}
                    </TableCell>
                    <TableCell>
                      <Avatar
                        src={u.avatar ? `http://localhost:8080${u.avatar}` : ""}
                        sx={{ width: 42, height: 42 }}
                      >
                        {u.fullName?.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell fontWeight={600}>{u.fullName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={u.role} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.enabled ? "Hoạt động" : "Đã khóa"}
                        color={u.enabled ? "success" : "error"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedUser(u);
                            setOpen(true);
                          }}
                        >
                          Sửa
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color={u.enabled ? "error" : "success"}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {u.enabled ? "Khóa" : "Mở"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={totalElements}
              page={filters.page}
              rowsPerPage={filters.size}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Số hàng:"
            />
          </Paper>

          {/* DIALOG */}
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle fontWeight={800}>
              {selectedUser ? "Cập nhật User" : "Thêm User"}
            </DialogTitle>
            <DialogContent dividers>
              <UserForm
                initialData={selectedUser}
                onSubmit={handleSubmit}
                onCancel={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>

        </Stack>
      </Box>
    </AdminLayout>
  );
}
