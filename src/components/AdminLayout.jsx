import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminSidebar from "../pages/admin/AdminSidebar";

const drawerWidth = 260;

export default function AdminLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <CssBaseline />

      {/* HEADER */}
      <AdminHeader handleDrawerToggle={handleDrawerToggle} />

      {/* SIDEBAR */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <AdminSidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Né header */}
        <Toolbar />

        {/* CONTENT WRAPPER */}
        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 2, sm: 3 },   
            py: 2,
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}