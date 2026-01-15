import { 
  Box, Grid, Typography, Button, Container, TextField, 
  InputAdornment, Stack, Paper, Divider, Chip, LinearProgress 
} from "@mui/material";
import { 
  Search, CloudUpload, LocationOn, AutoAwesome 
} from "@mui/icons-material";
import CandidateHeader from "./CandidateHeader";
import AIAnalysisCard from "./AIAnalysisCard";
import AdminFooter from "../admin/AdminFooter";

export default function UserHome() {
  const aiData = {
    score: 85,
    strengths: ["Kỹ năng ReactJS tốt", "Kinh nghiệm làm việc nhóm", "Tư duy logic mạnh"],
    weaknesses: ["Thiếu chứng chỉ tiếng Anh", "Ít dự án về Cloud Deploy"],
    missingSkills: ["Docker", "Kubernetes", "AWS Certified", "IELTS 6.5+"]
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", minHeight: "100vh", width: "100%" }}>
      <CandidateHeader />

      {/* 1. HERO SECTION - TRÀN MÀN HÌNH */}
      <Box sx={{ 
        width: "100%",
        bgcolor: "#f8faff", 
        pt: 12, pb: 18, 
        borderBottom: "1px solid #eff6ff",
        backgroundImage: "radial-gradient(circle at 90% 10%, #e0e7ff 0%, transparent 20%)" 
      }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" fontWeight="900" sx={{ color: "#1e293b", mb: 2, letterSpacing: -2, fontSize: { xs: '2.5rem', md: '4rem' } }}>
              Tìm việc làm <span style={{ color: '#6366f1' }}>thông minh</span> hơn với AI
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 850, mx: 'auto', fontSize: '1.25rem' }}>
              Hệ thống tự động phân tích CV và kết nối bạn với những cơ hội phù hợp nhất dựa trên năng lực thực tế của chính bạn.
            </Typography>

            {/* THANH TÌM KIẾM TO RỘNG */}
            <Paper elevation={0} sx={{ 
              p: 1.5, borderRadius: 6, display: 'flex', gap: 1, 
              boxShadow: '0 25px 60px rgba(99, 102, 241, 0.1)',
              maxWidth: 1100, mx: 'auto', border: '1px solid #e2e8f0',
              flexDirection: { xs: 'column', md: 'row' }
            }}>
              <TextField 
                fullWidth variant="standard" placeholder="Vị trí ứng tuyển, kỹ năng..." 
                InputProps={{ 
                  disableUnderline: true, 
                  startAdornment: <InputAdornment position="start"><Search sx={{ml: 2, color: '#6366f1'}} /></InputAdornment> 
                }}
                sx={{ px: 2, py: 1 }}
              />
              <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />
              <TextField 
                variant="standard" placeholder="Địa điểm" 
                InputProps={{ 
                  disableUnderline: true, 
                  startAdornment: <InputAdornment position="start"><LocationOn sx={{ml: 2, color: '#94a3b8'}} /></InputAdornment> 
                }}
                sx={{ px: 2, py: 1, width: { xs: '100%', md: 350 } }}
              />
              <Button variant="contained" sx={{ px: 8, py: 2, borderRadius: 5, bgcolor: '#6366f1', fontWeight: 800, textTransform: 'none', fontSize: '1.1rem' }}>
                Tìm kiếm ngay
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>

      {/* 2. AI ANALYSIS SECTION - TRÀN RỘNG NHƯNG NỔI LÊN TRÊN */}
      <Container maxWidth={false} sx={{ mt: -10, mb: 12, px: { xs: 4, md: 10 }, position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
            <AIAnalysisCard {...aiData} />
        </Box>
      </Container>

      {/* 3. VIỆC LÀM GỢI Ý - TRÀN RỘNG */}
      <Container maxWidth={false} sx={{ mb: 15, px: { xs: 4, md: 10 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
              <AutoAwesome sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography variant="subtitle2" fontWeight="900" color="#6366f1" sx={{ letterSpacing: 2, textTransform: 'uppercase' }}>AI Matching Performance</Typography>
            </Stack>
            <Typography variant="h3" fontWeight="900" sx={{ color: '#1e293b' }}>Cơ hội dành riêng cho bạn</Typography>
          </Box>
          <Button variant="outlined" sx={{ fontWeight: 800, color: '#6366f1', borderRadius: 3, px: 4, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
            Xem tất cả việc làm →
          </Button>
        </Stack>

        <Grid container spacing={4}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} key={item}>
              <Paper variant="outlined" sx={{ 
                p: 4, borderRadius: 5, transition: '0.4s', 
                "&:hover": { borderColor: '#6366f1', transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }, 
                cursor: 'pointer', border: '1px solid #e2e8f0' 
              }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" fontWeight="900" sx={{ mb: 1 }}>Senior Frontend Developer (ReactJS / Next.js)</Typography>
                    <Typography variant="h6" color="#6366f1" fontWeight="700" sx={{ mb: 2 }}>Tập đoàn Công nghệ Toàn cầu • $2500 - $4000</Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap">
                      {["React", "TypeScript", "AI Integration", "Tailwind"].map(tag => (
                        <Chip key={tag} label={tag} sx={{ fontWeight: 600, bgcolor: '#f1f5f9' }} />
                      ))}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' }, mt: { xs: 3, md: 0 } }}>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        icon={<AutoAwesome sx={{ fontSize: '1rem !important', color: '#0369a1 !important' }} />}
                        label="95% MATCH SCORE" 
                        sx={{ bgcolor: '#e0f2fe', color: '#0369a1', fontWeight: 900, px: 2, py: 2.5 }} 
                      />
                    </Box>
                    <Button variant="contained" disableElevation sx={{ borderRadius: 3, bgcolor: '#1e293b', px: 5, py: 1.5, fontWeight: 700, textTransform: 'none' }}>
                        Ứng tuyển ngay
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 4. LỘ TRÌNH PHÁT TRIỂN - TRÀN MÀN HÌNH MÀU TỐI */}
      <Box sx={{ bgcolor: "#0f172a", py: 15, color: "white", width: "100%" }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 12 } }}>
          <Grid container spacing={10} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight="900" mb={3} sx={{ lineHeight: 1.2 }}>Nâng cấp sự nghiệp <br/>với AI Mentor</Typography>
              <Typography variant="h6" sx={{ opacity: 0.7, mb: 6, lineHeight: 1.6 }}>
                Dựa trên phân tích CV sâu, AI nhận thấy bạn chỉ cần bổ sung kỹ năng <b>Docker</b> và <b>AWS Cloud</b> để có thể tiếp cận các vị trí Senior với mức lương cao hơn 40%.
              </Typography>
              <Button variant="contained" sx={{ bgcolor: '#6366f1', px: 6, py: 2, borderRadius: 4, fontWeight: 800, fontSize: '1.1rem', '&:hover': { bgcolor: '#4f46e5' } }}>
                Khám phá lộ trình học tập
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
                <Box sx={{ p: 5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                   <Typography variant="h6" color="#6366f1" fontWeight="800" mb={4} sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>Kỹ năng AI khuyến nghị</Typography>
                   <Stack spacing={4}>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography fontWeight="700" variant="body1">Docker & Containerization</Typography>
                            <Typography color="#6366f1" fontWeight="900">Mức độ ưu tiên: Cao</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={10} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', "& .MuiLinearProgress-bar": { bgcolor: '#6366f1' } }} />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography fontWeight="700" variant="body1">AWS Cloud Practitioner</Typography>
                            <Typography color="#6366f1" fontWeight="900">Mức độ ưu tiên: Trung bình</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={45} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(255,255,255,0.1)', "& .MuiLinearProgress-bar": { bgcolor: '#6366f1' } }} />
                      </Box>
                   </Stack>
                </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <AdminFooter />
    </Box>
  );
}