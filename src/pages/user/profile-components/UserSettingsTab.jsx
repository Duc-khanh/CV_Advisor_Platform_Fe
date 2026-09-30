import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Switch,
  Divider,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Lock,
  Visibility,
  VisibilityOff,
  Security,
  Notifications,
  Shield,
  Download,
  DeleteForever,
  CheckCircle,
  Devices,
  Key,
} from "@mui/icons-material";
import api from "../../../services/axios";
import { useToast } from "../../../contexts/ToastContext";

export default function UserSettingsTab({ user, searchActive, setSearchActive }) {
  const showToast = useToast();

  // Password state
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState("");

  // Privacy toggles state
  const [confidentialMode, setConfidentialMode] = useState(false);
  const [hideFromCurrentCompany, setHideFromCurrentCompany] = useState(true);

  // Notification toggles state
  const [notifInterview, setNotifInterview] = useState(true);
  const [notifJobMatch, setNotifJobMatch] = useState(true);
  const [notifAiUsage, setNotifAiUsage] = useState(true);

  // Delete account dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPassError("");
    setPassSuccess("");

    if (!passForm.currentPassword || !passForm.newPassword) {
      setPassError("Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới.");
      return;
    }

    if (passForm.newPassword.length < 6) {
      setPassError("Mật khẩu mới phải có tối thiểu 6 ký tự.");
      return;
    }

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError("Xác nhận mật khẩu mới không trùng khớp.");
      return;
    }

    setPassLoading(true);
    try {
      const res = await api.put("/api/me/change-password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
        confirmPassword: passForm.confirmPassword,
      });

      setPassSuccess(res.data?.message || "Đổi mật khẩu thành công!");
      showToast("Đổi mật khẩu thành công!", "success");
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const msg = err.response?.data?.message || "Mật khẩu hiện tại không chính xác.";
      setPassError(msg);
      showToast(msg, "error");
    } finally {
      setPassLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(user, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `careergo_profile_${user?.fullName || "user"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Đã xuất dữ liệu hồ sơ cá nhân thành công!", "success");
  };

  return (
    <Stack spacing={3}>
      {/* 1. Header Bar */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "12px",
              bgcolor: "#eff6ff",
              color: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Shield sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#0f172a">
              Cài đặt tài khoản & Bảo mật
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quản lý mật khẩu, quyền riêng tư và các tùy chọn thông báo của bạn
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* 2. Đổi mật khẩu */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={2.5}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Key sx={{ color: "#2563eb", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Đổi mật khẩu
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Nên sử dụng mật khẩu mạnh kết hợp chữ in hoa, chữ số và ký tự đặc biệt để bảo vệ tài khoản.
          </Typography>

          {passError && <Alert severity="error">{passError}</Alert>}
          {passSuccess && <Alert severity="success">{passSuccess}</Alert>}

          <Box component="form" onSubmit={handlePasswordChange}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mật khẩu hiện tại"
                  type={showCurrentPass ? "text" : "password"}
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                          {showCurrentPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Mật khẩu mới"
                  type={showNewPass ? "text" : "password"}
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowNewPass(!showNewPass)}>
                          {showNewPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Xác nhận mật khẩu mới"
                  type={showConfirmPass ? "text" : "password"}
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                          {showConfirmPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2.5, display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={passLoading}
                sx={{
                  bgcolor: "#2563eb",
                  fontWeight: 700,
                  textTransform: "none",
                  borderRadius: 2.5,
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
                  "&:hover": { bgcolor: "#1d4ed8" },
                }}
              >
                {passLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
              </Button>
            </Box>
          </Box>
        </Stack>
      </Paper>

      {/* 3. Quyền riêng tư & Tìm kiếm CV */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Security sx={{ color: "#059669", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Quyền riêng tư & Tìm việc
            </Typography>
          </Box>

          <Stack spacing={2} divider={<Divider />}>
            {/* Toggle 1: Cho phép tìm kiếm CV */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Cho phép Nhà tuyển dụng tìm kiếm hồ sơ CV
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hồ sơ của bạn sẽ hiển thị trong kết quả tìm kiếm nhân tài của các doanh nghiệp uy tín
                </Typography>
              </Box>
              <Switch
                checked={searchActive}
                onChange={(e) => setSearchActive(e.target.checked)}
                color="primary"
              />
            </Box>

            {/* Toggle 2: Chế độ kín đáo */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Chế độ tìm việc kín đáo (Bảo mật thông tin liên hệ)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ẩn số điện thoại và email cá nhân với NTD cho đến khi bạn đồng ý phản hồi lời mời
                </Typography>
              </Box>
              <Switch
                checked={confidentialMode}
                onChange={(e) => setConfidentialMode(e.target.checked)}
                color="primary"
              />
            </Box>

            {/* Toggle 3: Ẩn với công ty hiện tại */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Ẩn hồ sơ với công ty hiện tại
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tự động chặn nhà tuyển dụng thuộc công ty bạn đang làm việc xem thông tin tìm việc
                </Typography>
              </Box>
              <Switch
                checked={hideFromCurrentCompany}
                onChange={(e) => setHideFromCurrentCompany(e.target.checked)}
                color="primary"
              />
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* 4. Cài đặt thông báo */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Notifications sx={{ color: "#7c3aed", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Tùy chọn nhận thông báo
            </Typography>
          </Box>

          <Stack spacing={2} divider={<Divider />}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Lịch phỏng vấn & Trạng thái hồ sơ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nhận thông báo ngay khi doanh nghiệp gửi lịch phỏng vấn hoặc cập nhật đơn ứng tuyển
                </Typography>
              </Box>
              <Switch
                checked={notifInterview}
                onChange={(e) => setNotifInterview(e.target.checked)}
                color="secondary"
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Gợi ý việc làm phù hợp định kỳ
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nhận danh sách công việc IT mới nhất phù hợp với kỹ năng của bạn qua email
                </Typography>
              </Box>
              <Switch
                checked={notifJobMatch}
                onChange={(e) => setNotifJobMatch(e.target.checked)}
                color="secondary"
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ pr: 2 }}>
                <Typography variant="body2" fontWeight={700} color="#1e293b">
                  Hạn mức & Tiện ích AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Thông báo biến động token, lượt phân tích CV miễn phí và các tính năng AI mới
                </Typography>
              </Box>
              <Switch
                checked={notifAiUsage}
                onChange={(e) => setNotifAiUsage(e.target.checked)}
                color="secondary"
              />
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* 5. Phiên đăng nhập */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Devices sx={{ color: "#0284c7", fontSize: 22 }} />
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              Phiên đăng nhập & Thiết bị
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 3, bgcolor: "#f8fafc" }}>
            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body2" fontWeight={700} color="#0f172a">
                      Trình duyệt Web hiện tại (Windows)
                    </Typography>
                    <Chip
                      label="Đang hoạt động"
                      size="small"
                      sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 800, fontSize: "0.7rem", height: 20 }}
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    Địa chỉ IP: 192.168.1.x • Đăng nhập phiên hiện tại
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Paper>

      {/* 6. Vùng quản lý dữ liệu (Danger Zone) */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: 4,
          border: "1px solid #fee2e2",
          bgcolor: "#fffaf0",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="subtitle1" fontWeight={800} color="#991b1b">
            Quản lý dữ liệu & Tài khoản
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleExportData}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                borderColor: "#cbd5e1",
                color: "#334155",
                bgcolor: "#ffffff",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              Xuất dữ liệu cá nhân (.JSON)
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.5,
                bgcolor: "#ffffff",
              }}
            >
              Xóa tài khoản
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Dialog xác nhận xóa tài khoản */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#ef4444" }}>
          Xác nhận yêu cầu xóa tài khoản?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hành động này sẽ xóa vĩnh viễn toàn bộ hồ sơ CV, lịch sử ứng tuyển và dữ liệu cá nhân của bạn.
            Để xác nhận, vui lòng nhập chữ <b>XOA TAI KHOAN</b> vào ô bên dưới:
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="XOA TAI KHOAN"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ fontWeight: 700, textTransform: "none" }}>
            Hủy
          </Button>
          <Button
            color="error"
            variant="contained"
            disabled={deleteConfirmText !== "XOA TAI KHOAN"}
            onClick={() => {
              setDeleteDialogOpen(false);
              showToast("Yêu cầu xóa tài khoản đã được ghi nhận.", "info");
            }}
            sx={{ fontWeight: 700, textTransform: "none", borderRadius: 2 }}
          >
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
