import { Box } from "@mui/material";

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw", // Đảm bảo chiếm hết chiều ngang
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        overflow: "hidden", // Tránh xuất hiện thanh cuộn lạ
      }}
    >
      {children}
    </Box>
  );
}