import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { label: "Phân tích CV", to: "/cv-analysis" },
  { label: "Tạo CV", to: "/cv-builder" },
  { label: "Lộ trình học tập", to: "/career-roadmap" },
  { label: "Cẩm nang", to: "/career-guide" },
  { label: "Nhà tuyển dụng", to: "/for-employers" },
];

function Navbar() {
  const items = useMemo(() => navItems, []);

  return (
    <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: { md: 1, lg: 1.8 }, position: "relative" }}>
      {items.map((item) => (
        <Box
          key={item.to}
          component={NavLink}
          to={item.to}
          style={{ textDecoration: "none" }}
          sx={{ position: "relative" }}
        >
          {({ isActive }) => (
            <Box
              sx={{
                position: "relative",
                px: 1.2,
                py: 0.8,
                borderRadius: "10px",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "rgba(37,99,235,0.06)",
                },
              }}
            >
              <motion.span
                initial={false}
                animate={{
                  color: isActive ? "#2563EB" : "#334155",
                  fontWeight: isActive ? 800 : 600,
                }}
                transition={{ duration: 0.2 }}
                style={{ display: "inline-block", cursor: "pointer", fontSize: "0.88rem", whiteSpace: "nowrap" }}
              >
                {item.label}
              </motion.span>

              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: "absolute",
                    left: "12%",
                    right: "12%",
                    bottom: 0,
                    height: 2.5,
                    borderRadius: 9999,
                    background: "linear-gradient(90deg, #3b82f6, #2563eb)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35, duration: 0.35 }}
                />
              )}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default React.memo(Navbar);
