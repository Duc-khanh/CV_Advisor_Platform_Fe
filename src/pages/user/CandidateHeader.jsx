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
} from "@mui/material";
import {
  NotificationsNone,
  ChatBubbleOutline,
  KeyboardArrowDown,
  FavoriteBorder,
  AssignmentTurnedIn,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
      fetch("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((err) => console.error(err));
    }
  }, [token]);

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

                {["Phân tích CV", "Cộng đồng"].map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      fontWeight: 600,
                      cursor: "pointer",
                      "&:hover": { color: "#6366f1" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
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
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleCloseMenu}>
        <MenuItem onClick={() => goTo("/jobs")}>
          <Search fontSize="small" /> Tìm việc
        </MenuItem>
        <MenuItem onClick={() => goTo("/user/favorite-jobs")}>
          <FavoriteBorder fontSize="small" /> Yêu thích
        </MenuItem>
        <MenuItem onClick={() => goTo("/user/applied-jobs")}>
          <AssignmentTurnedIn fontSize="small" /> Đã ứng tuyển
        </MenuItem>
      </Menu>

      {/* MENU USER */}
      <Menu
        anchorEl={anchorUser}
        open={openUserMenu}
        onClose={handleCloseUserMenu}
      >
        <MenuItem disabled>
          {user?.fullName || "User"}
        </MenuItem>

        <MenuItem onClick={() => goTo("/profile")}>
          Thông tin tài khoản
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          Đăng xuất
        </MenuItem>
      </Menu>
    </AppBar>
  );
}