// import { AppBar, Toolbar, Typography, Button, Box, Avatar } from "@mui/material";
// import { Logout } from "@mui/icons-material";

// export default function AdminHeader() {
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "white", color: "black", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography variant="h6" fontWeight="bold">Hệ Thống Tuyển Dụng</Typography>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Avatar sx={{ bgcolor: "#1e7ba4" }}>A</Avatar>
//           {/* <Button variant="outlined" color="error" size="small" startIcon={<Logout />} onClick={handleLogout}>
//             Đăng xuất
//           </Button> */}
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }

import {
  AppBar, Toolbar, Typography, Box, Avatar,
  Menu, MenuItem, IconButton
} from "@mui/material";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/currentUser";
import ProfileDialog from "./ProfileDialog";

export default function AdminHeader() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    getCurrentUser().then(res => setUser(res.data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "white", color: "black" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Hệ Thống Tuyển Dụng</Typography>

          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography mr={1}>{user.fullName}</Typography>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar src={user.avatarUrl}>
                  {user.fullName?.charAt(0)}
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
                <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
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
    </>
  );
}
