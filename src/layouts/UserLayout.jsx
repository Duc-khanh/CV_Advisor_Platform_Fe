// UserLayout.jsx
import React, { useMemo, useRef, useEffect } from "react";
import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import CandidateHeader from "../pages/user/CandidateHeader.jsx";
import UserFooter from "../pages/user/UserFooter.jsx";
import ScrollToTopButton from "../components/common/ScrollToTopButton.jsx";
// import CareerAssistant from "../components/career/CareerAssistant.jsx"; // Tạm thời ẩn tính năng nhắn tin / trợ lý AI nổi

const UserLayout = () => {
  const location = useLocation();
  const header = useMemo(() => <CandidateHeader />, []);
  const isFirstMount = useRef(true);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  const isCvBuilder = location.pathname === "/cv-builder";
  const isHomePage = location.pathname === "/";
  const isForEmployers = location.pathname.startsWith("/for-employers");
  const isFullWidth = isCvBuilder || isHomePage || isForEmployers;

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {header}

      <Box sx={{ flex: 1, py: isFullWidth ? 0 : 3 }}>
        <Container
          maxWidth={false}
          disableGutters={isFullWidth}
          sx={{ px: isFullWidth ? 0 : { xs: 2, sm: 4, md: 6 } }}
        >
          {isCvBuilder ? (
            <Outlet />
          ) : (
            <AnimatePresence initial={false}>
              <Motion.div
                key={location.pathname}
                initial={isFirstMount.current ? false : { opacity: 0.95 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ width: "100%" }}
              >
                <Outlet />
              </Motion.div>
            </AnimatePresence>
          )}
        </Container>
      </Box>

      {!isCvBuilder && <UserFooter />}
      
      {/* Nút cuộn lên đầu trang khi lướt xuống */}
      <ScrollToTopButton />

      {/* Tạm thời ẩn widget nhắn tin / trợ lý nổi theo yêu cầu */}
      {/* {!isCvBuilder && <CareerAssistant />} */}
    </Box>
  );
};

export default React.memo(UserLayout);
