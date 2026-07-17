import React from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

const DesiredRoadmapInput = ({ value, onChange }) => (
  <Box>
    <Typography variant="body2" fontWeight={600} color="#475569" mb={1}>
      Lộ trình mong muốn
    </Typography>

    <FormControl fullWidth>
      <Select
        displayEmpty
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 1.2,
            }}
          >
            <CalendarMonth sx={{ color: "#2563eb", fontSize: 18 }} />
          </Box>
        }
        sx={{
          height: 48,
          borderRadius: "10px",
          bgcolor: "#ffffff",
          fontSize: "0.9rem",
          fontWeight: 600,
          mb: 2,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dbe3ef",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bfdbfe",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#3b82f6",
            borderWidth: "1px",
          },
        }}
      >
        <MenuItem value="">Chọn thời gian</MenuItem>
        <MenuItem value="1 tháng">1 tháng</MenuItem>
        <MenuItem value="2 tháng">2 tháng</MenuItem>
        <MenuItem value="3 tháng">3 tháng</MenuItem>
        <MenuItem value="6 tháng">6 tháng</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

export default DesiredRoadmapInput;