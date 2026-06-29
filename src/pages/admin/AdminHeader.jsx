import {
  AppBar, Toolbar, Typography, Box, Avatar,
  Menu, MenuItem, IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmDialog from "../../components/LogoutConfirmDialog";
import { getCurrentUser } from "../../services/currentUser";
import ProfileDialog from "./ProfileDialog";

const drawerWidth = 260; // Đồng bộ với sidebar

export default function AdminHeader() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        // Dự phòng trường hợp backend bọc data trong res.data.data
        const userData = res.data.data || res.data;
        setUser(userData);
      })
      .catch(err => console.error("Lỗi lấy user:", err));
  }, []);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem("token");
    showToast("Đăng xuất thành công!", "success");
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };

  return (
    <>
      <AppBar
  position="fixed"
  elevation={0}
  sx={{
    bgcolor: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)", // BÓNG NHẸ
    borderBottom: "1px solid #f1f5f9",
    width: { sm: `calc(100% - ${drawerWidth}px)` },
    ml: { sm: `${drawerWidth}px` },
  }}
>

        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography fontWeight="bold"></Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography mr={1}>{user.fullName}</Typography>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
<Avatar src={user.avatarUrl || user.avatar}>                  {user.fullName?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => {
                  setOpenProfile(true);
                  setAnchorEl(null);
                }}>
                  Thông tin tài khoản
                </MenuItem>
                <MenuItem onClick={() => {
                  setLogoutDialogOpen(true);
                  setAnchorEl(null);
                }} sx={{ color: "red" }}>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <ProfileDialog
        open={openProfile}
        onClose={() => setOpenProfile(false)}
        user={user}
        onUpdated={setUser}
      />
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}