import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Divider,
  Button,
  Stack,
  Chip,
  Grid,
} from "@mui/material";
import {
  Search,
  LocationOn,
  TrendingUp,
  Business,
  People,
} from "@mui/icons-material";

const HeroSection = ({ searchQuery, setSearchQuery, onSearch }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const keyword = searchQuery.keyword?.trim();
      const location = searchQuery.location?.trim();

      if (keyword || location) {
        onSearch();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [searchQuery.keyword, searchQuery.location, onSearch]);

  return (
    <Box
      sx={{
        width: "100%",
        background:
          "radial-gradient(circle at 80% 20%, #eff6ff 0%, #ffffff 50%)",
        pt: { xs: 8, md: 10 },
        pb: { xs: 10, md: 12 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "12%",
          right: "4%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          border: "1.5px dashed rgba(59,130,246,0.12)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          top: "6%",
          right: "-2%",
          width: "560px",
          height: "560px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.03) 0%, rgba(255,255,255,0) 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={5} alignItems="center">
          <Grid item xs={12} md={6.5} lg={7}>
            <Typography
              variant="h1"
              fontWeight={900}
              sx={{
                color: "#0f172a",
                mb: 2.5,
                fontSize: { xs: "2.3rem", sm: "3.2rem", md: "3.8rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              Tìm công việc phù hợp
              <br />
              <Box
                component="span"
                sx={{
                  color: "#2563eb",
                  position: "relative",
                  display: "inline-block",
                }}
              >
                Phát triển sự nghiệp
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#475569",
                mb: 5,
                fontSize: "1.05rem",
                lineHeight: 1.6,
                maxWidth: "580px",
                fontWeight: 500,
              }}
            >
              Hàng ngàn cơ hội việc làm từ các công ty uy tín.
              <br />
              Tìm công việc phù hợp với kỹ năng và đam mê của bạn.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 0.9,
                borderRadius: "16px",
                display: "flex",
                gap: 1,
                border: "1px solid #cbd5e1",
                boxShadow:
                  "0 15px 35px -5px rgba(59,130,246,0.04), 0 5px 15px rgba(0,0,0,0.01)",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                bgcolor: "#ffffff",
                mb: 3.5,
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Vị trí công việc, kỹ năng, công ty..."
                value={searchQuery.keyword}
                onChange={(e) =>
                  setSearchQuery({
                    ...searchQuery,
                    keyword: e.target.value,
                  })
                }
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search
                        sx={{
                          ml: 0.5,
                          color: "#94a3b8",
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  px: 1,
                  py: 0.2,
                  "& .MuiInputBase-root": {
                    height: 42,
                    fontSize: "0.92rem",
                  },
                }}
              />

              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  display: { xs: "none", sm: "block" },
                  my: 1,
                  borderColor: "#cbd5e1",
                }}
              />

              <TextField
                variant="standard"
                placeholder="Tất cả địa điểm"
                value={searchQuery.location}
                onChange={(e) =>
                  setSearchQuery({
                    ...searchQuery,
                    location: e.target.value,
                  })
                }
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn
                        sx={{
                          ml: 0.5,
                          color: "#94a3b8",
                          fontSize: 20,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  px: 1,
                  py: 0.2,
                  width: { xs: "100%", sm: 240 },
                  "& .MuiInputBase-root": {
                    height: 42,
                    fontSize: "0.92rem",
                  },
                }}
              />

              <Button
                onClick={onSearch}
                variant="contained"
                sx={{
                  px: 3.5,
                  py: 1.2,
                  minHeight: 42,
                  width: { xs: "100%", sm: "auto" },
                  borderRadius: "12px",
                  background: "#2563eb",
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  textTransform: "none",
                  boxShadow: "0 6px 16px rgba(37,99,235,0.18)",
                  "&:hover": {
                    background: "#1d4ed8",
                    boxShadow: "0 8px 20px rgba(37,99,235,0.28)",
                  },
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                Tìm việc ngay
              </Button>
            </Paper>

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ gap: 1 }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                }}
              >
                Tìm kiếm phổ biến:
              </Typography>

              {["Marketing", "Kế toán", "IT", "Thiết kế", "Kinh doanh"].map(
                (tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    clickable
                    onClick={() => {
                      setSearchQuery({
                        ...searchQuery,
                        keyword: tag,
                      });
                    }}
                    sx={{
                      color: "#475569",
                      borderColor: "#e2e8f0",
                      bgcolor: "#f8fafc",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      px: 0.5,
                      py: 1.5,
                      "&:hover": {
                        bgcolor: "#f1f5f9",
                        borderColor: "#cbd5e1",
                      },
                    }}
                  />
                )
              )}
            </Stack>
          </Grid>

          <Grid
            item
            xs={12}
            md={5.5}
            lg={5}
            sx={{
              display: "flex",
              justifyContent: "center",
              position: "relative",
              mt: { xs: 4, md: 0 },
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: { xs: "320px", sm: "400px", md: "430px" },
                height: { xs: "320px", sm: "400px", md: "430px" },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                  boxShadow: "0 15px 40px rgba(59,130,246,0.08)",
                }}
              />

              <Box
                component="img"
                src="/hero_candidate_blue_portrait.png"
                alt="HireAI Candidate"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "88%",
                  height: "auto",
                  zIndex: 2,
                }}
              />

              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "10%",
                  left: "-12%",
                  zIndex: 3,
                  p: 1.8,
                  borderRadius: 3.5,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2.5,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp sx={{ fontSize: 20 }} />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                    display="block"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    Việc làm phù hợp
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={900}
                    color="#0f172a"
                    sx={{ fontSize: "0.85rem", mb: 0.5 }}
                  >
                    1.248
                  </Typography>
                  <Typography
                    variant="caption"
                    color="#22c55e"
                    fontWeight={750}
                    display="block"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    ↑ 12% tuần này
                  </Typography>
                </Box>

                <Box sx={{ ml: 1, display: "flex", alignItems: "center" }}>
                  <svg width="50" height="20" viewBox="0 0 50 20" fill="none">
                    <path
                      d="M2 18C10 14 15 2 22 6C29 10 35 1 48 3"
                      stroke="#3b82f6"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  top: "35%",
                  right: "-12%",
                  zIndex: 3,
                  p: 1.5,
                  borderRadius: 3.5,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2.5,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Business sx={{ fontSize: 20 }} />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                    display="block"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    Công ty uy tín
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={900}
                    color="#0f172a"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    568+
                    <Box
                      component="span"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.65rem",
                        ml: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Đang tuyển dụng
                    </Box>
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  position: "absolute",
                  bottom: "10%",
                  right: "-5%",
                  zIndex: 3,
                  p: 1.5,
                  borderRadius: 3.5,
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: "#ffffff",
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2.5,
                    bgcolor: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <People sx={{ fontSize: 20 }} />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={750}
                    display="block"
                    sx={{ fontSize: "0.65rem" }}
                  >
                    Ứng viên thành công
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={900}
                    color="#0f172a"
                    sx={{ fontSize: "0.85rem" }}
                  >
                    12.5K+
                    <Box
                      component="span"
                      sx={{
                        color: "#64748b",
                        fontSize: "0.65rem",
                        ml: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Đã tìm được việc
                    </Box>
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection; 