import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, 
  ListItemText, Toolbar, Typography, Box, Button, Divider 
} from "@mui/material";
import { 
  Dashboard, PostAdd, Groups, EventNote, Settings, Logout 
} from "@mui/icons-material";

const drawerWidth = 280;

export default function HRSidebar() {
  const handleLogout = () => {
    // Xóa token và chuyển hướng về trang login
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/hr", color: "#2d6a4f" }, // Xanh lá đậm
    { text: "Tin tuyển dụng", icon: <PostAdd />, path: "/hr/jobs", color: "#0077b6" }, // Xanh dương
    { text: "Ứng viên", icon: <Groups />, path: "/hr/candidates", color: "#d97706" }, // Cam
    { text: "Lịch phỏng vấn", icon: <EventNote />, path: "/hr/interviews", color: "#7209b7" }, // Tím
    { text: "Cài đặt", icon: <Settings />, path: "/hr/settings", color: "#64748b" }, // Xám Slate
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: "border-box", 
          bgcolor: "#ffffff", // Chuyển về nền trắng thuần
          borderRight: "1px solid #edf2f7",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Phần trên: Logo và Menu */}
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2d6a4f", letterSpacing: 1 }}>
            HR RECRUITER
          </Typography>
        </Toolbar>
        
        <Box sx={{ overflow: "auto" }}>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 1.5 }}>
                <ListItemButton 
                  onClick={() => window.location.href = item.path}
                  sx={{ 
                    borderRadius: 2.5, 
                    border: "1.5px solid",
                    borderColor: `${item.color}15`, // Viền mặc định cực nhạt
                    bgcolor: "#ffffff",
                    color: "#64748b",
                    transition: "all 0.25s ease",
                    "& .MuiListItemIcon-root": { color: item.color, minWidth: 40 },
                    "&:hover": { 
                      bgcolor: `${item.color}08`, // Nền nhạt khi hover
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
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 600 }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>

      {/* Phần dưới: Nút Đăng xuất đồng bộ phong cách */}
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
            color: "#f87171", // Màu đỏ nhạt
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
    </Drawer>
  );
}