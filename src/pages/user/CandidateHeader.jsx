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
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../services/currentUser";

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
  const openUserMenu = Boolean(anchorUser);

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
    localStorage.removeItem("token");
    window.location.href = "/login";
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
            <Typography
              variant="h5"
              fontWeight="900"
              onClick={() => navigate("/")}
              sx={{ color: "#6366f1", cursor: "pointer" }}
            >
              AI RECRUIT
            </Typography>

            {/* RIGHT SIDE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              
              {/* MENU */}
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
                <Typography
                  onClick={handleClickJob}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: openMenu ? "#6366f1" : "inherit",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  Việc làm <KeyboardArrowDown fontSize="small" />
                </Typography>

                <Typography
                  onClick={() => goTo("/user/cv-analysis")}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "inherit",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  Phân tích CV
                </Typography>
                
                <Typography
                  onClick={() => goTo("/user/cv-builder")}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "inherit",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  Tạo CV
                </Typography>

                <Typography
                  onClick={() => goTo("/user/career-roadmap")}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "inherit",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  Lộ trình học tập
                </Typography>

                {/* <Typography
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    "&:hover": { color: "#6366f1" },
                  }}
                >
                  Cộng đồng
                </Typography> */}
              </Box>

              {/* ICON */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <NotificationsNone sx={{ color: "#64748b", cursor: "pointer" }} />
                <ChatBubbleOutline sx={{ color: "#64748b", cursor: "pointer" }} />
              </Box>

              {/* USER */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderLeft: "1px solid #e2e8f0",
                  pl: 2,
                }}
              >
                {/* AVATAR */}
                <Avatar
                  src={user?.avatar}
                  onClick={handleOpenUserMenu}
                  sx={{
                    bgcolor: "#6366f1",
                    width: 32,
                    height: 32,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {!user?.avatar && getInitials(user?.fullName)}
                </Avatar>

                {/* LOGIN / LOGOUT */}
                <Button
                  size="small"
                  onClick={() => {
                    if (isLoggedIn) handleLogout();
                    else navigate("/login");
                  }}
                  sx={{
                    fontWeight: 700,
                    textTransform: "none",
                    color: isLoggedIn ? "#ef4444" : "#6366f1",
                  }}
                >
                  {isLoggedIn ? "ĐĂNG XUẤT" : "ĐĂNG NHẬP"}
                </Button>
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
        <MenuItem onClick={() => goTo("/user")}> 
          <Search fontSize="small" sx={{ mr: 1 }} /> Tìm việc
        </MenuItem>
        <MenuItem onClick={() => goTo("/user/favorite-jobs")}>
          <FavoriteBorder fontSize="small" sx={{ mr: 1 }} /> Việc làm yêu thích
        </MenuItem>
        <MenuItem onClick={() => goTo("/user/applied-jobs")}>
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
            src={user?.avatar}
            sx={{ bgcolor: "#6366f1", width: 44, height: 44, fontSize: "1rem" }}
          >
            {!user?.avatar && getInitials(user?.fullName)}
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
          <MenuItem onClick={() => goTo("/user/profile") }>
            <Person fontSize="small" sx={{ mr: 1 }} /> Hồ sơ cá nhân
          </MenuItem>
          <MenuItem onClick={() => goTo("/user/favorite-jobs")}> 
            <FavoriteBorder fontSize="small" sx={{ mr: 1 }} /> Việc làm yêu thích
          </MenuItem>
          <MenuItem onClick={() => goTo("/user/applied-jobs")}> 
            <AssignmentTurnedIn fontSize="small" sx={{ mr: 1 }} /> Việc làm đã ứng tuyển
          </MenuItem>
          <MenuItem onClick={() => goTo("/user/cv-analysis")}> 
            <Search fontSize="small" sx={{ mr: 1 }} /> Phân tích CV
          </MenuItem>
        </MenuList>

        <Divider />

        <Box sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Đăng xuất
          </Button>
        </Box>
      </Menu>
    </AppBar>
  );
}