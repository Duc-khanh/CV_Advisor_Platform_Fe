// UserLayout.jsx
import React, { useMemo } from "react";
import { Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CandidateHeader from "../pages/user/CandidateHeader.jsx";
import UserFooter from "../pages/user/UserFooter.jsx";

const UserLayout = () => {
  const location = useLocation();
  const header = useMemo(() => <CandidateHeader />, []);

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column" }}>
      {header}

      <Box sx={{ flex: 1, py: 4 }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: "easeInOut" }}
              style={{ width: "100%" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>

      <UserFooter />
    </Box>
  );
};

export default React.memo(UserLayout);