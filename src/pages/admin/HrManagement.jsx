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
  toggleUserStatus,
  approveHr
} from "../../services/adminUserService";
import UserForm from "./UserForm";
import { useToast } from "../../contexts/ToastContext";
import ConfirmDialog from "../../components/ConfirmDialog";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function HrManagement() {
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
    role: "HR",
    enabled: "",
    page: 0,
    size: 10,
  });

  const loadUsers = useCallback(async () => {
    try {
      const params = {
        ...filters,
        enabled: filters.enabled === "" ? null : filters.enabled === "true",
      };
      const data = await getUsers(params);
      setUsers(data.content || []);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      showToast("Lỗi tải danh sách nhà tuyển dụng", "error");
    }
  }, [filters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 0,
    }));
  };

  const handleChangePage = (event, newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleChangeRowsPerPage = (event) => {
    setFilters((prev) => ({
      ...prev,
      size: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.userId || selectedUser.id, formData);
        showToast("Cập nhật tài khoản HR thành công!", "success");
      } else {
        await createUser(formData);
        showToast("Tạo tài khoản HR thành công!", "success");
      }
      setOpen(false);
      loadUsers();
    } catch (error) {
      showToast("Thao tác thất bại! Vui lòng kiểm tra lại thông tin.", "error");
    }
  };

  const handleToggleStatus = (user) => {
    const action = user.enabled ? "KHÓA" : "MỞ";
    const type = user.enabled ? "danger" : "success";
    setConfirmConfig({
      title: "Xác nhận thay đổi trạng thái",
      message: `Bạn có chắc muốn ${action} tài khoản nhà tuyển dụng này không?`,
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

  const handleApproveHr = (user, status) => {
    const actionLabel = status === "APPROVED" ? "phê duyệt" : "từ chối";
    const type = status === "APPROVED" ? "success" : "danger";
    setConfirmConfig({
      title: "Xác nhận duyệt tài khoản",
      message: `Bạn có chắc muốn ${actionLabel} yêu cầu đăng ký của nhà tuyển dụng này không?`,
      type: type,
      confirmText: status === "APPROVED" ? "Phê duyệt" : "Từ chối",
      onConfirm: async () => {
        try {
          await approveHr(user.userId || user.id, status);
          showToast(`Đã ${actionLabel} tài khoản thành công!`, "success");
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
      <Box 
        sx={{ 
          width: "100%", 
          margin: "0 auto",
          pt: 0,
          px: { xs: 2, md: 4 },
          display: "block" 
        }}
      >
        <Stack spacing={3}>
          
          {/* HEADER */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            sx={{ mt: 2 }}
          >
            <Typography variant="h4" fontWeight={800} color="#1e293b">
              Quản lý Nhà tuyển dụng (HR)
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
              Thêm HR
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
          <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 3, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: "#f8fafc" }}>
                  <TableRow>
                    <TableCell align="center" width="70" sx={{ fontWeight: 700, color: "#475569" }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Người dùng</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Vai trò</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>Trạng thái</TableCell>
                    <TableCell align="right" sx={{ pr: 3, fontWeight: 700, color: "#475569" }}>Hành động</TableCell>
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
                            {u.companyName && (
                              <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                                Cty: {u.companyName}
                              </Typography>
                            )}
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell><Chip label={u.role} size="small" variant="outlined" /></TableCell>
                      <TableCell>
                        {u.role === "HR" && u.hrApprovalStatus === "PENDING" ? (
                          <Chip
                            label="Chờ duyệt"
                            color="warning"
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        ) : u.role === "HR" && u.hrApprovalStatus === "REJECTED" ? (
                          <Chip
                            label="Từ chối"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        ) : (
                          <Chip
                            label={u.enabled ? "Hoạt động" : "Đã khóa"}
                            color={u.enabled ? "success" : "error"}
                            size="small"
                            sx={{ fontWeight: 700 }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {u.role === "HR" && u.hrApprovalStatus === "PENDING" ? (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                sx={{ textTransform: "none", fontWeight: 700 }}
                                onClick={() => handleApproveHr(u, "APPROVED")}
                              >
                                Duyệt
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                sx={{ textTransform: "none", fontWeight: 700 }}
                                onClick={() => handleApproveHr(u, "REJECTED")}
                              >
                                Từ chối
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="small" onClick={() => { setSelectedUser({ ...u, role: "HR" }); setOpen(true); }}>Sửa</Button>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color={u.enabled ? "error" : "success"}
                                onClick={() => handleToggleStatus(u)}
                              >
                                {u.enabled ? "Khóa" : "Mở"}
                              </Button>
                            </>
                          )}
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

          {/* DIALOG */}
          <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle fontWeight={800}>{selectedUser ? "Cập nhật Nhà tuyển dụng" : "Thêm Nhà tuyển dụng"}</DialogTitle>
            <DialogContent dividers>
              <UserForm initialData={selectedUser ? { ...selectedUser, role: "HR" } : { role: "HR" }} onSubmit={handleSubmit} onCancel={() => setOpen(false)} />
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
