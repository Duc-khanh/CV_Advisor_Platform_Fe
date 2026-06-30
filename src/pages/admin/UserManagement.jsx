import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
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
import { useToast } from "../../contexts/ToastContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function UserManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const showToast = useToast();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "info",
    confirmText: "Xác nhận",
    onConfirm: () => {},
  });

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    enabled: "",
    page: 0,
    size: 10,
  });
  

  const loadUsers = useCallback(async () => {
    try {
      const params = {
        ...filters,
        enabled: filters.enabled === "" ? null : filters.enabled === "true",
        excludeHr: true,
      };
      const data = await getUsers(params);
      setUsers(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      showToast("Lỗi tải danh sách người dùng", "error");
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Tự động mở Dialog Thêm người dùng nếu có tín hiệu từ trang khác
  useEffect(() => {
    if (location.state?.action === "addUser") {
      setSelectedUser(null);
      setOpen(true);
      // Xóa state an toàn bằng React Router để khi F5 không bị mở lại form
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

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
        showToast("Cập nhật người dùng thành công!", "success");
      } else {
        await createUser(formData);
        showToast("Thêm người dùng thành công!", "success");
      }
      setOpen(false);
      loadUsers();
    } catch {
      showToast("Thao tác thất bại!", "error");
    }
  };

  const handleToggleStatus = (user) => {
    const action = user.enabled ? "KHÓA" : "MỞ";
    const type = user.enabled ? "danger" : "success";
    setConfirmConfig({
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn có chắc muốn ${action} tài khoản này không?`,
      type: type,
      confirmText: action,
      onConfirm: async () => {
        try {
          await toggleUserStatus(user.userId || user.id);
          showToast(`Đã ${action.toLowerCase()} tài khoản thành công!`, "success");
          loadUsers();
        } catch (error) {
          showToast("Thao tác thất bại!", "error");
        }
      }
    });
    setConfirmOpen(true);
  };


  return (
    <>
      {/* CĂN CHỈNH TẠI ĐÂY */}
      <Box 
        sx={{ 
          width: "100%", 
          margin: "0 auto",   // CĂN GIỮA MÀN HÌNH
          pt: 0,              // ĐẨY LÊN TRÊN CÙNG
          px: { xs: 2, md: 4 }, // Khoảng đệm hai bên để không dính sát lề
          display: "block" 
        }}
      >
        <Stack spacing={3}>
          
          {/* HEADER */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mt: 2 }} // Khoảng cách nhỏ với đỉnh trang
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
                bgcolor: "#3b82f6"
              }}
            >
              Thêm User
            </Button>
          </Stack>

          {/* FILTER */}
          <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap gap={2}>
              <TextField
                name="search"
                size="small"
                placeholder="Tìm tên hoặc email..."
                value={filters.search}
                onChange={handleFilterChange}
                sx={{ flexGrow: 1, minWidth: "250px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Quyền</InputLabel>
                <Select name="role" value={filters.role} label="Quyền" onChange={handleFilterChange}>
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="USER">USER</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select name="enabled" value={filters.enabled} label="Trạng thái" onChange={handleFilterChange}>
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Đã khóa</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {/* TABLE */}
          <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
            <Box sx={{ width: '100%', overflowX: 'auto' }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Người dùng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vai trò</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u, index) => (
                    <TableRow key={u.userId || u.id} hover>
                      <TableCell align="center">{filters.page * filters.size + index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={getMediaUrl(u.avatar)}>
                            {u.fullName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={600}>{u.fullName}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Chip label={u.role} size="small" variant="outlined" /></TableCell>
                      <TableCell>
                        <Chip
                          label={u.enabled ? "Hoạt động" : "Đã khóa"}
                          color={u.enabled ? "success" : "error"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Button size="small" onClick={() => { setSelectedUser(u); setOpen(true); }}>Sửa</Button>
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
            </Box>
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

          {/* DIALOG giữ nguyên logic */}
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle fontWeight={800}>{selectedUser ? "Cập nhật User" : "Thêm User"}</DialogTitle>
            <DialogContent dividers>
              <UserForm initialData={selectedUser} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
            </DialogContent>
          </Dialog>

          {/* CONFIRM DIALOG */}
          <ConfirmDialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={confirmConfig.onConfirm}
            title={confirmConfig.title}
            message={confirmConfig.message}
            type={confirmConfig.type}
            confirmText={confirmConfig.confirmText}
          />

        </Stack>
      </Box>
    </>
  );
}