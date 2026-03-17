// UserLayout.jsx
import React from "react";
import { Box, Container } from "@mui/material";
import CandidateHeader from "../pages/user/CandidateHeader"; // Giả sử CandidateHeader nằm trong cùng thư mục
import UserFooter from "../pages/user/UserFooter"; // Footer mới sẽ tạo ở bước 2

const UserLayout = ({ children }) => {
  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header cố định */}
      <CandidateHeader />

      {/* Main content - Linh hoạt cho từng trang */}
      <Box sx={{ flex: 1, py: 4 }}> {/* py: 4 để thêm padding trên/dưới */}
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          {children}
        </Container>
      </Box>

      {/* Footer cố định */}
      <UserFooter />
    </Box>
  );
};

export default UserLayout;