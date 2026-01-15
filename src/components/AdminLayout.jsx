import React from "react";
import { Box, Toolbar, CssBaseline } from "@mui/material";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

const drawerWidth = 280;

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
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
          ml: 0,
          p: 3,
          bgcolor: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        {/* Spacer cho Header */}
        <Toolbar />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
