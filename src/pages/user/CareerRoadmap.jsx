import React from "react";
import { Box, Container, Grid, Typography, Button, Stack, LinearProgress } from "@mui/material";

const CareerRoadmap = () => {
  // Bạn có thể nhận data qua props nếu muốn dữ liệu động
  const skills = [
    { name: "Docker & Containerization", progress: 80 },
    { name: "AWS Cloud Practitioner", progress: 45 },
    { name: "System Design", progress: 30 },
  ];

  return (
    <Box sx={{ bgcolor: "#0f172a", py: 15, color: "white", width: "100%" }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 12 } }}>
        <Grid container spacing={10} alignItems="center">
          {/* Cột bên trái: Nội dung giới thiệu */}
          <Grid item xs={12} md={6}>
            <Typography variant="h3" fontWeight="900" mb={3}>
              Nâng cấp sự nghiệp với AI Mentor
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.7, mb: 6 }}>
              Nhận đề xuất lộ trình học tập dựa trên CV của bạn và xu hướng thị trường.
            </Typography>
            <Button 
              variant="contained" 
              sx={{ 
                bgcolor: '#6366f1', 
                px: 6, 
                py: 2, 
                borderRadius: 4, 
                fontWeight: 800,
                '&:hover': { bgcolor: '#4f46e5' } 
              }}
            >
              Bắt đầu ngay
            </Button>
          </Grid>

          {/* Cột bên phải: Card kỹ năng AI */}
          <Grid item xs={12} md={6}>
            <Box 
              sx={{ 
                p: 5, 
                bgcolor: 'rgba(255,255,255,0.03)', 
                borderRadius: 6, 
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Typography variant="h6" color="#6366f1" fontWeight="800" mb={4}>
                KỸ NĂNG KHUYẾN NGHỊ
              </Typography>
              
              <Stack spacing={4}>
                {skills.map((skill, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" mb={1}>
                      <Typography fontWeight="700">{skill.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.6 }}>{skill.progress}%</Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={skill.progress} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5, 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#6366f1',
                          borderRadius: 5
                        }
                      }} 
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CareerRoadmap;