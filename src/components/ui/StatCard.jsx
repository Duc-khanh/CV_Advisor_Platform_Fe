import React from "react";
import { Paper, Typography, Box } from "@mui/material";

export default function StatCard({ title, value, icon, color = "#3b82f6" }) {
  const resolvedColor = color && color.startsWith("#") ? color : "#3b82f6";

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (typeof icon === "function") {
      const IconComp = icon;
      return <IconComp size={24} />;
    }
    return null;
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        borderRadius: 4, 
        display: "flex", 
        alignItems: "center", 
        gap: 2.5, 
        bgcolor: "white",
        border: "1px solid #f1f5f9",
        transition: "transform 0.2s",
        "&:hover": { transform: "translateY(-5px)" }
      }}
    >
      <Box sx={{ 
        p: 1.5, 
        borderRadius: 3, 
        bgcolor: `${resolvedColor}15`, 
        color: resolvedColor,
        display: "flex"
      }}>
        {renderIcon()}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="500">{title}</Typography>
        <Typography variant="h5" fontWeight="800" color="#1e293b">{value}</Typography>
      </Box>
    </Paper>
  );
}
