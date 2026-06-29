import React from "react";
import { Paper, Typography, Box, Stack } from "@mui/material";
import { 
  TimelineOutlined, 
  InfoOutlined 
} from "@mui/icons-material";
import RoadmapItemCard from "./RoadmapItemCard";

const RoadmapSection = ({ roadmap }) => {
  const phases = roadmap.learningPath || roadmap.roadmap || [];

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      {/* Tiêu đề chính */}
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 4, pl: 1 }}>
        <TimelineOutlined sx={{ color: "#2563eb", fontSize: 28 }} />
        <Typography variant="h5" fontWeight={900} color="#1e293b">
          Lộ trình học tập đề xuất
        </Typography>
      </Stack>

      <Box sx={{ position: "relative" }}>
        {/* Đường line nối (Timeline) */}
        <Box
          sx={{
            position: "absolute",
            left: 20,
            top: 20,
            bottom: 20,
            width: "2px",
            borderLeft: "2px dashed #e2e8f0",
            display: { xs: "none", sm: "block" },
          }}
        />

        <Stack spacing={4}>
          {phases.map((phase, index) => (
            <RoadmapItemCard 
              key={index} 
              phase={phase} 
              index={index} 
              isLast={index === phases.length - 1}
            />
          ))}
        </Stack>
      </Box>

      {/* Phần Lưu ý ở cuối */}
      <Paper
        elevation={0}
        sx={{
          mt: 4,
          p: 2.5,
          borderRadius: "16px",
          bgcolor: "#eff6ff",
          border: "1px solid #dbeafe",
          display: "flex",
          gap: 2,
          alignItems: "flex-start"
        }}
      >
        <InfoOutlined sx={{ color: "#2563eb", mt: 0.2 }} />
        <Box>
          <Typography variant="body2" color="#1e293b" fontWeight={700} sx={{ mb: 0.5 }}>
            Lưu ý:
          </Typography>
          <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>
            Lộ trình được AI đề xuất dựa trên phân tích CV của bạn và xu hướng thị trường. 
            Bạn có thể tùy chỉnh thứ tự hoặc thời gian học cho phù hợp với mục tiêu cá nhân.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RoadmapSection;