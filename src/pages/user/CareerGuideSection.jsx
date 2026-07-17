import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  Stack,
  Skeleton,
} from "@mui/material";
import { ArrowForward, AccessTime } from "@mui/icons-material";
import { articleService } from "../../services/company/articleService";

const themeColor = "#2563eb";

export default function CareerGuideSection() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await articleService.getArticlesPublic({
          page: 0,
          size: 3,
          sortBy: "newest",
        });
        setArticles((data.content || []).slice(0, 3));
      } catch (err) {
        console.error("Lỗi tải cẩm nang:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const handleCardClick = (articleId) => {
    navigate(`/career-guide/${articleId}`);
  };

  const handleViewAll = () => {
    navigate("/career-guide");
  };

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={900} color="#0f172a">
            Cẩm nang nghề nghiệp
          </Typography>

          <Box
            onClick={handleViewAll}
            sx={{
              color: themeColor,
              fontWeight: 800,
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Xem tất cả bài viết <ArrowForward sx={{ fontSize: 16 }} />
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid
                  key={i}
                  sx={{ display: "flex", flexBasis: "calc(33.3333% - 20px)", maxWidth: "calc(33.3333% - 20px)", flexGrow: 0 }}
                >
                  <Paper elevation={0} sx={{ p: 1.2, borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", flex: 1, gap: 1.25, minHeight: 100 }}>
                    <Skeleton variant="rounded" width={60} height={60} sx={{ borderRadius: "10px", flexShrink: 0 }} />
                    <Stack sx={{ flex: 1 }} spacing={0.8}>
                      <Skeleton variant="text" width="90%" height={18} />
                      <Skeleton variant="text" width="70%" height={14} />
                      <Skeleton variant="text" width="40%" height={12} />
                    </Stack>
                  </Paper>
                </Grid>
              ))
            : articles.map((article) => (
                <Grid
                  key={article.articleId}
                  sx={{ display: "flex", flexBasis: "calc(33.3333% - 20px)", maxWidth: "calc(33.3333% - 20px)", flexGrow: 0 }}
                >
                  <Paper
                    elevation={0}
                    onClick={() => handleCardClick(article.articleId)}
                    sx={{
                      p: 1.2,
                      borderRadius: "16px",
                      border: "1px solid #e2e8f0",
                      bgcolor: "#ffffff",
                      display: "flex",
                      flex: 1,
                      gap: 1.25,
                      minHeight: 100,
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        borderColor: themeColor,
                        boxShadow: "0 10px 26px rgba(37,99,235,0.06)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {/* Thumbnail */}
                    <Box
                      component="img"
                      src={article.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=120&fit=crop"}
                      alt={article.title}
                      sx={{ width: 60, height: 60, borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                    />

                    {/* Info */}
                    <Stack justifyContent="space-between" sx={{ flex: 1, minWidth: 0 }}>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight={800}
                          color="#0f172a"
                          sx={{
                            fontSize: "0.92rem",
                            lineHeight: 1.3,
                            mb: 0.8,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="#64748b"
                          sx={{
                            fontSize: "0.78rem",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {article.description}
                        </Typography>
                      </Box>

                      {/* Footer */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                        <Chip
                          label={article.category || "Nghề nghiệp"}
                          size="small"
                          sx={{ height: 20, bgcolor: "#eff6ff", color: themeColor, fontWeight: 700, fontSize: "0.7rem", borderRadius: "5px" }}
                        />
                        <Typography sx={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 650, display: "flex", alignItems: "center", gap: 0.3 }}>
                          <AccessTime sx={{ fontSize: "12px" }} />
                          {article.readTime || "5 phút đọc"}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}
