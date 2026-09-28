import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Toolbar, Typography, Box, Button, Divider 
} from "@mui/material";
import { 
  Dashboard, PostAdd, Groups, EventNote, Settings, Logout, AutoAwesome, Business
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useToast } from "../../contexts/ToastContext";
import LogoutConfirmDialog from "../dialogs/LogoutConfirmDialog";

const drawerWidth = 260; // Đồng bộ 260px với AdminHeader & AdminSidebar

export default function HRSidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const showToast = useToast();

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem("token");
    showToast("Đăng xuất thành công!", "success");
    setTimeout(() => {
      navigate("/login");
    }, 400);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/hr_dashboard", color: "#2d6a4f" }, 
    { text: "Hạn mức AI", icon: <AutoAwesome />, path: "/hr/ai-usage", color: "#2563eb" },
    { text: "Tin tuyển dụng", icon: <PostAdd />, path: "/hr/jobs", color: "#0077b6" }, 
    { text: "Ứng viên", icon: <Groups />, path: "/hr/applications", color: "#d97706" }, 
    { text: "Lịch phỏng vấn", icon: <EventNote />, path: "/hr/interviews", color: "#7209b7" }, 
    { text: "Cài đặt", icon: <Settings />, path: "/hr/settings", color: "#64748b" }, 
  ];

  const drawerContent = (
    <>
      {/* BRAND / LOGO & MENU */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Toolbar
          sx={{
            mb: 2,
            px: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 1.2,
            cursor: "pointer",
          }}
          onClick={() => navigate("/hr_dashboard")}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #10b981, #2d6a4f)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: "0 2px 6px rgba(45,106,79,0.25)",
            }}
          >
            <Business sx={{ fontSize: 20 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#2d6a4f",
              letterSpacing: 1,
            }}
          >
            HR RECRUITER
          </Typography>
        </Toolbar>

        <Box sx={{ overflow: "auto", flexGrow: 1 }}>
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
                      "& .MuiListItemIcon-root": { color: item.color, minWidth: 40 },
                      "&:hover": { 
                        bgcolor: `${item.color}08`,
                        borderColor: item.color,
                        color: item.color,
                        transform: "translateX(4px)",
                        boxShadow: `0 4px 12px ${item.color}15`,
                      } 
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ fontSize: "0.9rem", fontWeight: 600 }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>

      {/* Nút đăng xuất đồng bộ */}
      <Box sx={{ p: 2, pb: 3 }}>
        <Divider sx={{ mb: 2, opacity: 0.6 }} />
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Logout />}
          onClick={() => setLogoutDialogOpen(true)}
          sx={{
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            py: 1.2,
            color: "#f87171",
            borderColor: "#fee2e2", 
            bgcolor: "#ffffff",
            borderWidth: "1.5px",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#fef2f2", 
              borderColor: "#f87171",
              borderWidth: "1.5px",
              color: "#ef4444",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(248, 113, 113, 0.15)"
            }
          }}
        >
          Đăng xuất
        </Button>
      </Box>
    </>
  );

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
          "& .MuiDrawer-paper": { 
            width: drawerWidth, 
            boxSizing: "border-box", 
            bgcolor: "#ffffff",
            borderRight: "1px solid #edf2f7",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <LogoutConfirmDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
