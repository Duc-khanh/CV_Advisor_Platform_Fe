import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
import { Logout } from "@mui/icons-material";

export default function AdminHeader() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "white", color: "black", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">Hệ Thống Tuyển Dụng</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "#1e7ba4" }}>A</Avatar>
          {/* <Button variant="outlined" color="error" size="small" startIcon={<Logout />} onClick={handleLogout}>
            Đăng xuất
          </Button> */}
        </Box>
      </Toolbar>
    </AppBar>
  );
}