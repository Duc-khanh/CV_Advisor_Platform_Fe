import { Box, Toolbar } from "@mui/material";
import HRSidebar from "../pages/hr/HRSidebar";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminFooter from "../pages/admin/AdminFooter";

export default function HRLayout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f8fafb",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      <AdminHeader />
      <HRSidebar />

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* đẩy content xuống dưới header */}
        <Toolbar />

        {/* CONTENT */}
        <Box sx={{ px: { xs: 2, md: 4, lg: 6 }, py: 3, flexGrow: 1 }}>
          {children}
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}
