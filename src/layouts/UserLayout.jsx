// UserLayout.jsx
import React, { useMemo } from "react";
import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import CandidateHeader from "../pages/user/CandidateHeader.jsx";
import UserFooter from "../pages/user/UserFooter.jsx";
import CareerAssistant from "../components/career/CareerAssistant.jsx";

const UserLayout = () => {
  const location = useLocation();
  const header = useMemo(() => <CandidateHeader />, []);

  const isCvBuilder = location.pathname === "/cv-builder";

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {header}

      <Box sx={{ flex: 1, py: isCvBuilder ? 0 : 4 }}>
        <Container maxWidth={false} disableGutters={isCvBuilder} sx={{ px: isCvBuilder ? 0 : { xs: 4, md: 10 } }}>
          <AnimatePresence mode="wait" initial={false}>
            <Motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
              style={{ width: "100%" }}
            >
              <Outlet />
            </Motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      {!location.pathname.startsWith("/for-employers") && !isCvBuilder && <UserFooter />}
      {!location.pathname.startsWith("/for-employers") && <CareerAssistant />}
    </Box>
  );
};

export default React.memo(UserLayout);
