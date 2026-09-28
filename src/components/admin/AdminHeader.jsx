import {
  AppBar, Toolbar, Typography, Box, Avatar,
  Menu, MenuItem, IconButton
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmDialog from "../dialogs/LogoutConfirmDialog";
import { getCurrentUser } from "../../services/user/currentUser";
import ProfileDialog from "../dialogs/ProfileDialog";

const drawerWidth = 260; // Đồng bộ với sidebar

export default function AdminHeader({ handleDrawerToggle }) {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    getCurrentUser()
      .then(res => {
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
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          borderBottom: "1px solid #edf2f7",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 64 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {handleDrawerToggle && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography mr={1} sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#334155" }}>
                {user.fullName}
              </Typography>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
                <Avatar
                  src={user.avatarUrl || user.avatar}
                  sx={{ width: 36, height: 36, bgcolor: "#0ea5e9", fontSize: "0.95rem" }}
                >
                  {user.fullName?.charAt(0)}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    mt: 1,
                    minWidth: 160,
                  }
                }}
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
                }} sx={{ color: "#ef4444" }}>
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
