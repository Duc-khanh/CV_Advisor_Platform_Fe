import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Fade,
  Divider,
  MenuList,
} from "@mui/material";
import {
  NotificationsNone,
  ChatBubbleOutline,
  KeyboardArrowDown,
  FavoriteBorder,
  AssignmentTurnedIn,
  Search,
  Person,
  Home,
  FilePresent,
  Work,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmDialog from "../../components/LogoutConfirmDialog";
import { getCurrentUser } from "../../services/currentUser";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function CandidateHeader() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  // ===== USER STATE =====
  const [user, setUser] = useState(null);

  // ===== MENU VIỆC LÀM =====
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // ===== MENU USER =====
  const [anchorUser, setAnchorUser] = useState(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const openUserMenu = Boolean(anchorUser);

  const showToast = useToast();

  // ===== FETCH USER =====

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((res) => {
          const userData = res.data.data || res.data;
          setUser(userData);
        })
        .catch((err) => {
          const status = err.response?.status;
          if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
          }
          console.error("Lỗi khi tải thông tin user:", err);
        });
    }
  }, [token, navigate]);

  // ===== GET INITIALS =====
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (
      words[0][0].toUpperCase() +
      words[words.length - 1][0].toUpperCase()
    );
  };

  // ===== HANDLER =====
  const handleClickJob = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorUser(null);
  };

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem("token");
    showToast("Đăng xuất thành công!", "success");
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };

  const goTo = (path) => {
    navigate(path);
    handleCloseMenu();
    handleCloseUserMenu();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        color: "black",
        boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", px: 3 }}>
        <Box sx={{ width: "100%", maxWidth: "1440px" }}>
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minHeight: 64,
            }}
          >
            {/* LOGO */}
            <Box
              onClick={() => navigate("/")}
              sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
                }}
              >
                H
              </Box>
              <Typography
                variant="h5"
                fontWeight="900"
                sx={{
                  color: "#0f172a",
                  letterSpacing: "0.5px",
                }}
              >
                Recruit<Box component="span" sx={{ color: "#2563eb" }}></Box>
              </Typography>
            </Box>

            {/* RIGHT SIDE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              
              {/* MENU */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
                <Typography
                  onClick={() => goTo("/cv-analysis")}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#475569",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#2563eb" },
                    transition: "color 0.2s",
                  }}
                >
                  Phân tích CV
                </Typography>
                
                <Typography
                  onClick={() => goTo("/cv-builder")}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#475569",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#2563eb" },
                    transition: "color 0.2s",
                  }}
                >
                  Tạo CV
                </Typography>

                <Typography
                  onClick={() => goTo("/career-roadmap")}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#475569",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#2563eb" },
                    transition: "color 0.2s",
                  }}
                >
                  Lộ trình học tập
                </Typography>

                <Typography
                  onClick={() => goTo("/career-guide")}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#475569",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#2563eb" },
                    transition: "color 0.2s",
                  }}
                >
                  Cẩm nang
                </Typography>

                <Typography
                  onClick={() => goTo("/for-employers")}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "#475569",
                    fontSize: "0.9rem",
                    "&:hover": { color: "#2563eb" },
                    transition: "color 0.2s",
                  }}
                >
                  Nhà tuyển dụng
                </Typography>
              </Box>

              {/* USER */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderLeft: "1px solid #e2e8f0",
                  pl: 2.5,
                }}
              >
                {/* AVATAR */}
                <Avatar
                  src={getMediaUrl(user?.avatarUrl || user?.avatar)}
                  onClick={handleOpenUserMenu}
                  sx={{
                    bgcolor: "#2563eb",
                    width: 34,
                    height: 34,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    boxShadow: "0 2px 6px rgba(37,99,235,0.15)",
                  }}
                >
                  {!user?.avatarUrl && !user?.avatar && getInitials(user?.fullName)}
                </Avatar>

               {/* LOGIN BUTTON - chỉ hiện khi chưa đăng nhập */}
{!isLoggedIn && (
  <Button
    size="small"
    onClick={() => navigate("/login")}
    sx={{
      fontWeight: 800,
      textTransform: "none",
      color: "#ffffff",
      bgcolor: "#2563eb",
      px: 2.5,
      py: 0.8,
      borderRadius: "20px",
      boxShadow: "0 4px 10px rgba(37,99,235,0.2)",
      "&:hover": {
        bgcolor: "#1d4ed8",
      },
      transition: "all 0.2s ease",
    }}
  >
    Đăng nhập
  </Button>
)}
              </Box>
            </Box>
          </Toolbar>
        </Box>
      </Box>

      {/* MENU VIỆC LÀM */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 240,
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        {/* <Box sx={{ px: 2, py: 1.5 }}>
          <Typography fontWeight={700} sx={{ mb: 1 }}>
            Chọn tính năng
          </Typography>
        </Box> */}
        <Divider />
        <MenuItem onClick={() => goTo("/")}> 
          <Search fontSize="small" sx={{ mr: 1 }} /> Tìm việc
        </MenuItem>
        <MenuItem onClick={() => goTo("/favorite-jobs")}>
          <FavoriteBorder fontSize="small" sx={{ mr: 1 }} /> Việc làm yêu thích
        </MenuItem>
        <MenuItem onClick={() => goTo("/applied-jobs")}>
          <AssignmentTurnedIn fontSize="small" sx={{ mr: 1 }} /> Việc làm đã ứng tuyển
        </MenuItem>
      </Menu>

      {/* MENU USER */}
      <Menu
        anchorEl={anchorUser}
        open={openUserMenu}
        onClose={handleCloseUserMenu}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 280,
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar
            src={getMediaUrl(user?.avatarUrl || user?.avatar)}
            sx={{ bgcolor: "#2563eb", width: 44, height: 44, fontSize: "1rem" }}
          >
            {!user?.avatarUrl && !user?.avatar && getInitials(user?.fullName)}
          </Avatar>
          <Box>
            <Typography fontWeight={800} fontSize="0.95rem">
              {user?.fullName || "Người dùng"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email || "Chưa có email"}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <MenuList dense>
          <MenuItem onClick={() => goTo("/profile?tab=overview")}>
            <Home fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Tổng quan
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=attached_cv")}>
            <FilePresent fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Hồ sơ đính kèm
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=profile_itviec")}>
            <Person fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Hồ sơ ITviec
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=my_jobs")}>
            <Work fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Việc làm của tôi
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=email_subscribe")}>
            <AssignmentTurnedIn fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Đăng ký nhận email
          </MenuItem>
          <MenuItem onClick={() => goTo("/profile?tab=settings")}>
            <Settings fontSize="small" sx={{ mr: 1.5, color: "#64748b" }} /> Cài đặt
          </MenuItem>
        </MenuList>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={() => {
              setLogoutDialogOpen(true);
              setAnchorUser(null);
            }}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </AppBar>
  );
}