import React from "react";
import { Box, Toolbar, CssBaseline } from "@mui/material";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

const drawerWidth = 280;

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <CssBaseline />

      {/* HEADER */}
      <AdminHeader drawerWidth={drawerWidth} />

      {/* SIDEBAR */}
      <AdminSidebar drawerWidth={drawerWidth} />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Đảm bảo chiếm hết phần còn lại
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Toolbar này đóng vai trò là phần đệm dưới Header */}
        <Toolbar /> 

        {/* Nội dung thực tế */}
        <Box 
          sx={{ 
            p: { xs: 2, md: 4 }, // Padding linh hoạt theo thiết bị
            flexGrow: 1,         // Giúp box này giãn hết chiều cao còn lại
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}