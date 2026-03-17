import React, { useState } from "react"; // Thêm useState
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
  Logout,
  NotificationsNone,
  ChatBubbleOutline,
  KeyboardArrowDown,
  FavoriteBorder,
  AssignmentTurnedIn,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

export default function CandidateHeader() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const isLoggedIn = !!token;
  
  // State quản lý Menu Việc làm
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleClickJob = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Hàm điều hướng tiện lợi
  const goTo = (path) => {
    navigate(path);
    handleCloseMenu();
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
            <Typography
              variant="h5"
              fontWeight="900"
              onClick={() => navigate("/")}
              sx={{ color: "#6366f1", letterSpacing: -1, cursor: "pointer" }}
            >
              AI RECRUIT
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
                
                {/* MỤC VIỆC LÀM CÓ DROPDOWN */}
                <Typography
                  onClick={handleClickJob}
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
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

                {/* CÁC MỤC KHÁC GIỮ NGUYÊN */}
                {["Phân tích CV", "Cộng đồng"].map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      "&:hover": { color: "#6366f1" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <NotificationsNone sx={{ color: "#64748b", cursor: "pointer" }} />
                <ChatBubbleOutline sx={{ color: "#64748b", cursor: "pointer" }} />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  borderLeft: "1px solid #e2e8f0",
                  pl: 2,
                }}
              >
                <Avatar sx={{ bgcolor: "#6366f1", width: 32, height: 32, fontSize: "0.8rem" }}>
                  NA
                </Avatar>
                <Button
  size="small"
  onClick={() => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      navigate("/login");
    }
  }}
  sx={{
    fontWeight: 700,
    textTransform: "none",
    color: isLoggedIn ? "#ef4444" : "#6366f1"
  }}
>
  {isLoggedIn ? "ĐĂNG XUẤT" : "ĐĂNG NHẬP"}
</Button>
              </Box>
            </Box>
          </Toolbar>
        </Box>
      </Box>

      {/* MENU THẢ XUỐNG CHO PHẦN VIỆC LÀM */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        TransitionComponent={Fade}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 2,
            mt: 1,
            minWidth: 220,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            border: "1px solid #f1f5f9",
          }
        }}
      >
        <MenuItem onClick={() => goTo("/jobs")} sx={{ py: 1.5, gap: 1.5 }}>
          <Search fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>Tìm việc làm</Typography>
        </MenuItem>

        <MenuItem onClick={() => goTo("/user/favorite-jobs")} sx={{ py: 1.5, gap: 1.5 }}>
          <FavoriteBorder fontSize="small" color="action" />
          <Typography variant="body2" fontWeight={500}>Việc làm đã lưu (Yêu thích)</Typography>
        </MenuItem>

        <MenuItem onClick={() => goTo("/user/applied-jobs")} sx={{ py: 1.5, gap: 1.5 }}>
    <AssignmentTurnedIn fontSize="small" color="action" />
    <Typography variant="body2" fontWeight={500}>
      Việc làm đã ứng tuyển
    </Typography>
  </MenuItem>

        <MenuItem onClick={() => goTo("/companies")} sx={{ py: 1.5, gap: 1.5 }}>
          <Box sx={{ width: 20, height: 20, bgcolor: "#e2e8f0", borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>🏢</Box>
          <Typography variant="body2" fontWeight={500}>Danh sách công ty</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
}