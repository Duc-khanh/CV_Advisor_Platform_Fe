import { AppBar, Toolbar, Typography, Button, Box, Avatar, Container } from "@mui/material";
import { Logout, NotificationsNone, ChatBubbleOutline } from "@mui/icons-material";

export default function CandidateHeader() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", color: "black", boxShadow: "0 1px 0px rgba(0,0,0,0.05)" }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
          <Typography variant="h5" fontWeight="900" sx={{ color: "#6366f1", letterSpacing: -1 }}>
            AI RECRUIT
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
              {["Việc làm", "Công ty", "Phân tích CV", "Cộng đồng"].map((item) => (
                <Typography key={item} sx={{ fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', "&:hover": { color: "#6366f1" } }}>
                  {item}
                </Typography>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <NotificationsNone sx={{ color: "#64748b" }} />
              <ChatBubbleOutline sx={{ color: "#64748b" }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, borderLeft: "1px solid #e2e8f0", pl: 2 }}>
              <Avatar sx={{ bgcolor: "#6366f1", width: 32, height: 32 }}>NA</Avatar>
              <Button color="inherit" size="small" onClick={handleLogout} sx={{ fontWeight: 700, textTransform: 'none' }}>
                ĐĂNG NHẬP
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}