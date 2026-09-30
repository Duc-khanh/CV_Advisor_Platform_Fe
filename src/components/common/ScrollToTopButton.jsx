import React, { useState, useEffect } from "react";
import { Fab, Zoom, Tooltip } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom in={visible}>
      <Tooltip title="Lên đầu trang" placement="left" arrow>
        <Fab
          onClick={scrollToTop}
          size="medium"
          aria-label="Scroll to top"
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 28 },
            right: { xs: 20, sm: 28 },
            zIndex: 1000,
            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
            color: "#ffffff",
            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.35)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              boxShadow: "0 12px 30px rgba(37, 99, 235, 0.45)",
              transform: "translateY(-3px)",
            },
            "&:active": {
              transform: "translateY(0)",
            },
          }}
        >
          <KeyboardArrowUp sx={{ fontSize: 28 }} />
        </Fab>
      </Tooltip>
    </Zoom>
  );
}
