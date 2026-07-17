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
    <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, position: "relative" }}>
      {items.map((item) => (
        <Box
          key={item.to}
          component={NavLink}
          to={item.to}
          style={{ textDecoration: "none" }}
          sx={{ position: "relative", px: 0.5, '&:hover .hover-preview': { opacity: 0.3 } }}
        >
          {({ isActive }) => (
            <Box sx={{ position: "relative", px: 0.5 }}>
              <motion.span
                initial={false}
                animate={{
                  color: isActive ? "#2563EB" : "#475569",
                  opacity: isActive ? 1 : 0.95,
                  scale: isActive ? 1.03 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30, duration: 0.35 }}
                style={{ display: "inline-block", cursor: "pointer", fontSize: "0.9rem" }}
              >
                <Typography component="span" sx={{ fontWeight: isActive ? 600 : 700, px: 0.6 }}>
                  {item.label}
                </Typography>
              </motion.span>

              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: -8,
                    height: 3,
                    borderRadius: 9999,
                    background: "linear-gradient(90deg,#3b82f6,#2563eb)",
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 35, duration: 0.38 }}
                />
              )}

              <Box
                className="hover-preview"
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: -8,
                  height: 3,
                  borderRadius: 9999,
                  bgcolor: "#2563eb",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s ease",
                }}
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default React.memo(Navbar);
