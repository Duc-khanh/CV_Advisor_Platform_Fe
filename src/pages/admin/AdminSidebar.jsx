import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  People,
  Business,
  Assessment,
  Settings,
  Logout,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const drawerWidth = 280;

export default function AdminSidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin", color: "#0ea5e9" },
    { text: "Quản lý Người dùng", icon: <People />, path: "/admin/users", color: "#8b5cf6" },
    { text: "Quản lý Công ty", icon: <Business />, path: "/admin/companies", color: "#10b981" },
    { text: "Thống kê", icon: <Assessment />, path: "/admin/stats", color: "#f59e0b" },
    { text: "Cài đặt", icon: <Settings />, path: "/admin/settings", color: "#64748b" },
  ];

  const drawerContent = (
    <>
      {/* LOGO / TITLE
      <Toolbar sx={{ mb: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1e7ba4",
            letterSpacing: 1,
          }}
        >
          ADMIN PANEL
        </Typography>
      </Toolbar> */}

      {/* MENU */}
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const active = location.pathname.startsWith(item.path);

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile && handleDrawerToggle) handleDrawerToggle();
                  }}
                  sx={{
                    borderRadius: 2.5,
                    border: "1.5px solid",
                    borderColor: active ? item.color : `${item.color}15`,
                    bgcolor: active ? `${item.color}10` : "#ffffff",
                    color: active ? item.color : "#64748b",
                    transition: "all 0.25s ease",
                    "& .MuiListItemIcon-root": {
                      color: item.color,
                      minWidth: 40,
                    },
                    "&:hover": {
                      bgcolor: `${item.color}08`,
                      borderColor: item.color,
                      color: item.color,
                      transform: "translateX(4px)",
                      boxShadow: `0 4px 12px ${item.color}15`,
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* LOGOUT */}
      <Box sx={{ p: 2, pb: 3 }}>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            py: 1.2,
            color: "#f87171",
            borderColor: "#fee2e2",
            bgcolor: "#ffffff",
            borderWidth: "1.5px",
            "&:hover": {
              bgcolor: "#fef2f2",
              borderColor: "#f87171",
              color: "#ef4444",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(248,113,113,0.15)",
            },
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </>
  );

  return (
   <Drawer
  variant="permanent"
  sx={{
  
    flexShrink: 0,
    left: 0,
    top: 0,
    ml:"144px",

    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      mt: "64px",        // né Header
      height: "calc(100% - 64px)",
    },
  }}
>
  {drawerContent}
</Drawer>

  );
}
