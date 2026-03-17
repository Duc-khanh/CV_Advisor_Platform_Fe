import React, { useState } from 'react';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import AdminSidebar from '../pages/admin/AdminSidebar';
import AdminHeader from "../pages/admin/AdminHeader";
import AdminFooter from "../pages/admin/AdminFooter";

const drawerWidth = 260; // Chiều rộng sidebar cố định

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Chiếm toàn bộ chiều cao của drawer
      }}
    >
      {/* Sidebar chính - Mở rộng để đẩy footer xuống dưới */}
      <Box sx={{ flexGrow: 1 }}>
        <AdminSidebar />
      </Box>
      
      {/* Footer của sidebar - Luôn ở cuối */}
      {/* <AdminFooter /> */}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
       
      {/* Header toàn layout */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <AdminHeader onDrawerToggle={handleDrawerToggle} />
      </Box>
      
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Drawer cho mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        {/* Drawer cố định cho desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Khu vực nội dung chính */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;