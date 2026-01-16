import { Box, Toolbar } from "@mui/material";
import HRSidebar from "../pages/hr/HRSidebar";
import AdminHeader from "../pages/admin/AdminHeader";
import AdminFooter from "../pages/admin/AdminFooter";

export default function HRLayout({ children }) {
  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafb", minHeight: "100vh", width: "100vw" }}>
      <AdminHeader />
      <HRSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          width: { sm: `calc(100% - 280px)` },
        }}
      >
        <Toolbar />

        {/* CONTENT */}
        <Box sx={{ p: { xs: 2, md: 5 }, flexGrow: 1 }}>
          {children}
        </Box>

        <AdminFooter />
      </Box>
    </Box>
  );
}
