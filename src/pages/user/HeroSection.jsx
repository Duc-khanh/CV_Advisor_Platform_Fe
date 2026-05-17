import React from "react";
import { 
  Box, Container, Typography, Paper, TextField, 
  InputAdornment, Divider, Button, Stack, Chip, Grid
} from "@mui/material";
import { Search, LocationOn, TrendingUp, Business, People } from "@mui/icons-material";

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <Box sx={{ 
      width: "100%", 
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
      pt: { xs: 12, md: 16 }, 
      pb: { xs: 16, md: 20 }, 
      borderBottom: "1px solid #e0e7ff",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background circles */}
      <Box sx={{ position: "absolute", top: "-10%", left: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(255,255,255,0) 70%)" }} />
      <Box sx={{ position: "absolute", bottom: "-20%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0) 70%)" }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h1" 
            fontWeight="900" 
            sx={{ color: "#0f172a", mb: 2, fontSize: { xs: '2.5rem', md: '4rem' }, lineHeight: 1.2 }}
          >
            Tìm việc làm <Box component="span" sx={{ color: '#4f46e5', position: 'relative', display: 'inline-block' }}>
              thông minh
              <svg style={{ position: 'absolute', bottom: -5, left: 0, width: '100%', height: '12px' }} viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,10 Q50,20 100,5" stroke="#818cf8" strokeWidth="4" fill="none" strokeLinecap="round"/>
              </svg>
            </Box> hơn với AI
          </Typography>
          <Typography variant="h6" sx={{ color: "#475569", mb: 5, fontWeight: 400, maxWidth: "700px", mx: "auto" }}>
            Kết nối bạn với hàng ngàn cơ hội việc làm mơ ước. Dùng AI phân tích CV và tìm công việc phù hợp nhất.
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 1.5, md: 1 }, 
              borderRadius: { xs: 4, md: 50 }, 
              display: 'flex', 
              gap: 1, 
              maxWidth: 900, 
              mx: 'auto', 
              border: '1px solid #cbd5e1', 
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <TextField 
              fullWidth 
              variant="standard" 
              placeholder="Vị trí ứng tuyển, kỹ năng..." 
              value={searchQuery.keyword}
              onChange={(e) => setSearchQuery({ ...searchQuery, keyword: e.target.value })}
              InputProps={{ 
                disableUnderline: true, 
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ ml: 2, color: '#64748b' }} />
                  </InputAdornment>
                ) 
              }}
              sx={{ px: 2, py: { xs: 1, md: 1.5 } }}
            />

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ display: { xs: 'none', md: 'block' }, my: 1 }} 
            />
            
            <Divider 
              orientation="horizontal" 
              flexItem 
              sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }} 
            />

            <TextField 
              variant="standard" 
              placeholder="Địa điểm" 
              value={searchQuery.location}
              onChange={(e) => setSearchQuery({ ...searchQuery, location: e.target.value })}
              InputProps={{ 
                disableUnderline: true, 
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn sx={{ ml: 2, color: '#64748b' }} />
                  </InputAdornment>
                ) 
              }}
              sx={{ px: 2, py: { xs: 1, md: 1.5 }, width: { xs: '100%', md: 350 } }}
            />

            <Button 
              onClick={onSearch} 
              variant="contained" 
              size="large"
              sx={{ 
                px: { xs: 0, md: 6 }, 
                py: { xs: 2, md: 2 }, 
                width: { xs: '100%', md: 'auto' },
                borderRadius: { xs: 3, md: 50 }, 
                bgcolor: '#4f46e5', 
                fontWeight: 700,
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)',
                '&:hover': { bgcolor: '#4338ca', transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)' },
                transition: 'all 0.2s'
              }}
            >
              Tìm việc
            </Button>
          </Paper>

          {/* Popular Searches */}
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={4} flexWrap="wrap" useFlexGap>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>Gợi ý:</Typography>
            {['ReactJS', 'Marketing', 'Designer', 'Data Analyst', 'Java'].map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                variant="outlined" 
                size="small" 
                clickable
                onClick={() => setSearchQuery({ ...searchQuery, keyword: tag })}
                sx={{ 
                  color: '#475569', 
                  borderColor: '#cbd5e1', 
                  bgcolor: '#ffffff',
                  '&:hover': { bgcolor: '#f1f5f9', borderColor: '#94a3b8' } 
                }} 
              />
            ))}
          </Stack>

        </Box>

        {/* Quick Statistics */}
        <Grid container spacing={4} justifyContent="center" sx={{ mt: { xs: 4, md: 8 }, maxWidth: 800, mx: "auto" }}>
          <Grid item xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(79, 70, 229, 0.1)', color: '#4f46e5' }}>
                <TrendingUp fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="800" color="#1e293b">10K+</Typography>
              <Typography variant="body2" color="#64748b" fontWeight="500">Việc làm mới</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <Business fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="800" color="#1e293b">5K+</Typography>
              <Typography variant="body2" color="#64748b" fontWeight="500">Công ty uy tín</Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                <People fontSize="large" />
              </Box>
              <Typography variant="h4" fontWeight="800" color="#1e293b">100K+</Typography>
              <Typography variant="body2" color="#64748b" fontWeight="500">Ứng viên</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;