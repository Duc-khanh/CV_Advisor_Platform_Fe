// import React, { useState } from 'react';
// import {
//   Box,
//   Drawer,
//   CssBaseline,
//   Toolbar,
// } from '@mui/material';
// import { Menu as MenuIcon } from '@mui/icons-material';
// import AdminSidebar from '../pages/admin/AdminSidebar';
// import AdminHeader from "../pages/admin/AdminHeader";
// import AdminFooter from "../pages/admin/AdminFooter";

// const drawerWidth = 260; // Chiều rộng sidebar cố định

// const AdminLayout = ({ children }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const drawer = (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         height: '100%', // Chiếm toàn bộ chiều cao của drawer
//       }}
//     >
//       {/* Sidebar chính - Mở rộng để đẩy footer xuống dưới */}
//       <Box sx={{ flexGrow: 1 }}>
//         <AdminSidebar />
//       </Box>
      
//       {/* Footer của sidebar - Luôn ở cuối */}
//       {/* <AdminFooter /> */}
//     </Box>
//   );

//   return (
//     <Box sx={{ display: 'flex' }}>
//       <CssBaseline />
       
//       {/* Header toàn layout */}
//       <Box
//         sx={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           zIndex: 1100,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//           ml: { sm: `${drawerWidth}px` },
//         }}
//       >
//         <AdminHeader onDrawerToggle={handleDrawerToggle} />
//       </Box>
      
//       {/* Sidebar */}
//       <Box
//         component="nav"
//         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
//         aria-label="mailbox folders"
//       >
//         {/* Drawer cho mobile */}
//         <Drawer
//           variant="temporary"
//           open={mobileOpen}
//           onClose={handleDrawerToggle}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           sx={{
//             display: { xs: 'block', sm: 'none' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//         >
//           {drawer}
//         </Drawer>
//         {/* Drawer cố định cho desktop */}
//         <Drawer
//           variant="permanent"
//           sx={{
//             display: { xs: 'none', sm: 'block' },
//             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
//           }}
//           open
//         >
//           {drawer}
//         </Drawer>
//       </Box>

//       {/* Khu vực nội dung chính */}
//       <Box
//         component="main"
//         sx={{
//           flexGrow: 1,
//           p: 3,
//           width: { sm: `calc(100% - ${drawerWidth}px)` },
//         }}
//       >
//         <Toolbar />
//         {children}
//       </Box>
//     </Box>
//   );
// };

// export default AdminLayout;



import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

const drawerWidth = 260; // Đồng bộ với Header và Sidebar của bạn

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      {/* 1. HEADER (APPBAR) */}
      <AdminHeader handleDrawerToggle={handleDrawerToggle} />

      {/* 2. SIDEBAR (DRAWER) */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <AdminSidebar 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle} 
        />
      </Box>

      {/* 3. NỘI DUNG CHÍNH (MAIN CONTENT) */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Toolbar này đóng vai trò là "khoảng trống" để đẩy nội dung xuống dưới Header (né Header fixed) */}
        <Toolbar /> 

        {/* Nội dung thực tế của các trang con (AdminHome, AdminUsers, v.v.) */}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}