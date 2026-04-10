import React from "react";
import { 
  Box, Container, Typography, Paper, TextField, 
  InputAdornment, Divider, Button 
} from "@mui/material";
import { Search, LocationOn } from "@mui/icons-material";

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
  return (
    <Box sx={{ 
      width: "100%", 
      bgcolor: "#f8faff", 
      pt: 12, 
      pb: 18, 
      borderBottom: "1px solid #eff6ff" 
    }}>
      <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            fontWeight="900" 
            sx={{ color: "#1e293b", mb: 2, fontSize: { xs: '2.5rem', md: '4rem' } }}
          >
            Tìm việc làm <span style={{ color: '#6366f1' }}>thông minh</span> hơn với AI
          </Typography>

          <Paper 
            elevation={0} 
            sx={{ 
              p: 1.5, 
              borderRadius: 6, 
              display: 'flex', 
              gap: 1, 
              maxWidth: 1100, 
              mx: 'auto', 
              border: '1px solid #e2e8f0', 
              flexDirection: { xs: 'column', md: 'row' } 
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
                    <Search sx={{ ml: 2, color: '#6366f1' }} />
                  </InputAdornment>
                ) 
              }}
              sx={{ px: 2, py: 1 }}
            />

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ display: { xs: 'none', md: 'block' } }} 
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
                    <LocationOn sx={{ ml: 2, color: '#94a3b8' }} />
                  </InputAdornment>
                ) 
              }}
              sx={{ px: 2, py: 1, width: { xs: '100%', md: 350 } }}
            />

            <Button 
              onClick={onSearch} 
              variant="contained" 
              sx={{ 
                px: 8, 
                py: 2, 
                borderRadius: 5, 
                bgcolor: '#6366f1', 
                fontWeight: 800,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#4f46e5' }
              }}
            >
              Tìm kiếm ngay
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;