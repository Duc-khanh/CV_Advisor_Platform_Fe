import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  IconButton
} from "@mui/material";
import {
  Search,
  Visibility,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  AccessTime,
  CalendarMonth,
  TrendingUp,
  Email,
  ArrowForward,
  LocalOffer
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import { articleService } from "../../services/articleService";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";

const STATIC_CATEGORIES = ["Tất cả", "Viết CV", "Phỏng vấn", "Tìm việc", "Thương lượng lương", "Kỹ năng", "Định hướng"];

export default function CareerGuide() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [articles, setArticles] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  
  // Filtering & Pagination state
  const [category, setCategory] = useState("Tất cả");
  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const size = 6;

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArticles();
  }, [category, query, sortBy, page]);

  useEffect(() => {
    fetchSidebarData();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticlesPublic({
        category: category === "Tất cả" ? "" : category,
        query,
        page: page - 1,
        size,
        sortBy
      });
      setArticles(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi lấy danh sách bài viết", err);
      showToast("Lỗi tải danh sách bài viết", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchSidebarData = async () => {
    setLoadingSidebar(true);
    try {
      const [trending, tags] = await Promise.all([
        articleService.getTrendingArticles(),
        articleService.getPopularTags()
      ]);
      setTrendingArticles(trending || []);
      setPopularTags(tags || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu sidebar", err);
    } finally {
      setLoadingSidebar(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery(searchVal);
    setPage(1);
  };

  const handleCategoryChange = (catName) => {
    setCategory(catName);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handleToggleBookmark = async (e, articleId) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vui lòng đăng nhập để bookmark bài viết", "warning");
      navigate("/login");
      return;
    }
    try {
      const isBookmarkedNow = await articleService.toggleBookmark(articleId);
      showToast(isBookmarkedNow ? "Đã lưu vào cẩm nang!" : "Đã bỏ lưu bài viết!", "success");
      // Update local state
      setArticles(prev => prev.map(art => 
        art.articleId === articleId ? { ...art, isBookmarked: isBookmarkedNow } : art
      ));
    } catch (err) {
      console.error(err);
      showToast("Không thể thực hiện tác vụ", "error");
    }
  };

  const handleToggleLike = async (e, articleId) => {
    e.stopPropagation();
    if (!token) {
      showToast("Vui lòng đăng nhập để thích bài viết", "warning");
      navigate("/login");
      return;
    }
    try {
      const isLikedNow = await articleService.toggleLike(articleId);
      showToast(isLikedNow ? "Đã thích bài viết!" : "Đã bỏ thích!", "success");
      // Update local state
      setArticles(prev => prev.map(art => 
        art.articleId === articleId ? { 
          ...art, 
          isLiked: isLikedNow, 
          likesCount: isLikedNow ? art.likesCount + 1 : Math.max(0, art.likesCount - 1) 
        } : art
      ));
    } catch (err) {
      console.error(err);
      showToast("Không thể thực hiện tác vụ", "error");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast("Đăng ký nhận bài viết thành công!", "success");
    setNewsletterEmail("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  // Pinned/Featured article (first article that is pinned, or first article of page 1 if none pinned)
  const featuredArticle = articles.find(art => art.isPinned) || articles[0];
  const regularArticles = featuredArticle 
    ? articles.filter(art => art.articleId !== featuredArticle.articleId)
    : articles;

  return (
    <UserLayout>
      {/* 1. HERO BANNER */}
      <Box 
        sx={{ 
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
          color: "#fff",
          pt: 12,
          pb: 8,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Decorative elements */}
        <Box 
          sx={{ 
            position: "absolute", 
            top: "-20%", 
            right: "-10%", 
            width: "400px", 
            height: "400px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            filter: "blur(50px)"
          }} 
        />
        <Box 
          sx={{ 
            position: "absolute", 
            bottom: "-30%", 
            left: "-5%", 
            width: "350px", 
            height: "350px", 
            borderRadius: "50%", 
            background: "rgba(59, 130, 246, 0.2)",
            filter: "blur(60px)"
          }} 
        />

        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                fontWeight={900} 
                sx={{ 
                  mb: 2, 
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  letterSpacing: "-0.02em"
                }}
              >
                Cẩm Nang <span style={{ color: "#93c5fd" }}>Nghề Nghiệp</span>
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#dbeafe", 
                  fontWeight: 400, 
                  mb: 4,
                  maxWidth: "600px",
                  lineHeight: 1.6
                }}
              >
                Trang bị kiến thức tìm việc, kinh nghiệm viết CV, trả lời phỏng vấn chuẩn ATS và các bí quyết phát triển sự nghiệp hiệu quả.
              </Typography>
              
              {/* Search Bar */}
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: "550px" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Tìm kiếm bài viết, chủ đề nghề nghiệp..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#94a3b8" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button 
                          type="submit"
                          variant="contained" 
                          sx={{ 
                            bgcolor: "#2563eb", 
                            color: "#fff",
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 3,
                            "&:hover": { bgcolor: "#1d4ed8" }
                          }}
                        >
                          Tìm kiếm
                        </Button>
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: 3,
                      pr: 1,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" }
                    }
                  }}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: "none", md: "block" }, textAlign: "center" }}>
              <Box 
                component="img"
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&h=350&fit=crop"
                alt="Career Guide banner"
                sx={{
                  width: "100%",
                  maxWidth: "450px",
                  borderRadius: 6,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transform: "rotate(-1deg)"
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. FILTER & CATEGORIES */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0", bgcolor: "#fff", py: 2 }}>
        <Container maxWidth={false} sx={{ px: { xs: 4, md: 10 } }}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            justifyContent="space-between" 
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            {/* Category selection */}
            <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: { xs: 1, sm: 0 }, width: "100%" }}>
              {STATIC_CATEGORIES.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  clickable
                  onClick={() => handleCategoryChange(cat)}
                  sx={{
                    px: 1,
                    fontWeight: category === cat ? 700 : 500,
                    bgcolor: category === cat ? "#2563eb" : "#f1f5f9",
                    color: category === cat ? "#fff" : "#475569",
                    "&:hover": {
                      bgcolor: category === cat ? "#1d4ed8" : "#e2e8f0"
                    },
                    transition: "all 0.2s"
                  }}
                />
              ))}
            </Stack>

            {/* Sorting */}
            <FormControl size="small" sx={{ minWidth: 160, alignSelf: "flex-end" }}>
              <InputLabel id="sort-label">Sắp xếp theo</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sắp xếp theo"
                onChange={handleSortChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="views">Xem nhiều nhất</MenuItem>
                <MenuItem value="likes">Yêu thích nhất</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Container>
      </Box>

      {/* 3. MAIN CONTENT GRID */}
      <Container maxWidth={false} sx={{ py: 6, px: { xs: 4, md: 10 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#2563eb" }} />
          </Box>
        ) : (
          <Grid container spacing={5}>
            
            {/* LEFT COLUMN: ARTICLES */}
            <Grid item xs={12} lg={8}>
              {articles.length === 0 ? (
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 8, 
                    textAlign: "center", 
                    borderRadius: 4, 
                    border: "1px dashed #cbd5e1" 
                  }}
                >
                  <Typography variant="h5" fontWeight={700} color="#1e293b" mb={1}>
                    Không tìm thấy bài viết nào
                  </Typography>
                  <Typography color="#64748b">
                    Thử thay đổi từ khóa hoặc bộ lọc để tìm kiếm bài viết khác.
                  </Typography>
                </Paper>
              ) : (
                <Box>
                  {/* FEATURED POST (ONLY ON PAGE 1 & WITH NO SEARCH QUERY) */}
                  {page === 1 && !query && featuredArticle && (
                    <Card 
                      elevation={0}
                      onClick={() => navigate(`/career-guide/${featuredArticle.articleId}`)}
                      sx={{ 
                        mb: 6,
                        borderRadius: 4, 
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        cursor: "pointer",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#2563eb",
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 25px -5px rgba(37,99,235,0.05)"
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop"}
                        alt={featuredArticle.title}
                        sx={{ 
                          width: { xs: "100%", md: "50%" },
                          height: { xs: 260, md: "100%" },
                          minHeight: { md: 320 }
                        }}
                      />
                      <CardContent 
                        sx={{ 
                          width: { xs: "100%", md: "50%" }, 
                          p: 4, 
                          display: "flex", 
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <Box>
                          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                            <Chip 
                              label="Nổi bật" 
                              size="small"
                              sx={{ 
                                bgcolor: "#fee2e2", 
                                color: "#ef4444", 
                                fontWeight: 800,
                                fontSize: "0.75rem"
                              }} 
                            />
                            <Chip 
                              label={featuredArticle.category} 
                              size="small"
                              sx={{ 
                                bgcolor: "#eff6ff", 
                                color: "#2563eb", 
                                fontWeight: 700,
                                fontSize: "0.75rem"
                              }} 
                            />
                            <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <AccessTime sx={{ fontSize: "0.95rem" }} /> {featuredArticle.readTime}
                            </Typography>
                          </Stack>

                          <Typography 
                            variant="h4" 
                            fontWeight={800} 
                            color="#1e293b"
                            gutterBottom
                            sx={{ 
                              fontSize: { xs: "1.5rem", md: "1.8rem" },
                              lineHeight: 1.3,
                              "&:hover": { color: "#2563eb" }
                            }}
                          >
                            {featuredArticle.title}
                          </Typography>
                          
                          <Typography 
                            color="#475569" 
                            sx={{ 
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 3,
                              lineHeight: 1.6
                            }}
                          >
                            {featuredArticle.description}
                          </Typography>
                        </Box>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar 
                              src={getMediaUrl(featuredArticle.authorAvatar)} 
                              sx={{ width: 36, height: 36, bgcolor: "#3b82f6" }}
                            >
                              {featuredArticle.authorName?.charAt(0).toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={700} color="#334155">
                                {featuredArticle.authorName || "Ban Biên Tập"}
                              </Typography>
                              <Typography variant="caption" color="#94a3b8">
                                {formatDate(featuredArticle.createdAt)}
                              </Typography>
                            </Box>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleToggleLike(e, featuredArticle.articleId)}
                              sx={{ color: featuredArticle.isLiked ? "#ef4444" : "#94a3b8" }}
                            >
                              {featuredArticle.isLiked ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={(e) => handleToggleBookmark(e, featuredArticle.articleId)}
                              sx={{ color: featuredArticle.isBookmarked ? "#2563eb" : "#94a3b8" }}
                            >
                              {featuredArticle.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  )}

                  {/* REGULAR ARTICLES LISTING */}
                  <Typography variant="h5" fontWeight={850} color="#1e293b" mb={3}>
                    {query ? `Kết quả tìm kiếm cho "${query}"` : "Bài viết mới nhất"}
                  </Typography>

                  <Grid container spacing={3.5}>
                    {regularArticles.map((art, idx) => (
                      <Grid item xs={12} sm={6} key={art.articleId || idx}>
                        <Card 
                          elevation={0}
                          onClick={() => navigate(`/career-guide/${art.articleId}`)}
                          sx={{ 
                            height: "100%",
                            borderRadius: 4, 
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            flexDirection: "column",
                            cursor: "pointer",
                            transition: "all 0.25s ease",
                            overflow: "hidden",
                            "&:hover": {
                              borderColor: "#2563eb",
                              transform: "translateY(-4px)",
                              boxShadow: "0 15px 30px rgba(0,0,0,0.05)"
                            }
                          }}
                        >
                          <Box sx={{ position: "relative" }}>
                            <CardMedia
                              component="img"
                              height="200"
                              image={art.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"}
                              alt={art.title}
                            />
                            <Chip 
                              label={art.category} 
                              size="small"
                              sx={{ 
                                position: "absolute",
                                top: 16,
                                left: 16,
                                bgcolor: "rgba(255, 255, 255, 0.9)", 
                                backdropFilter: "blur(4px)",
                                color: "#1e3a8a", 
                                fontWeight: 800,
                                fontSize: "0.7rem",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                              }} 
                            />
                          </Box>

                          <CardContent sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <Box>
                              <Stack direction="row" spacing={2} alignItems="center" mb={1.5}>
                                <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <CalendarMonth sx={{ fontSize: "0.9rem" }} /> {formatDate(art.createdAt)}
                                </Typography>
                                <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                  <AccessTime sx={{ fontSize: "0.9rem" }} /> {art.readTime}
                                </Typography>
                              </Stack>

                              <Typography 
                                variant="h6" 
                                fontWeight={800} 
                                color="#1e293b" 
                                gutterBottom
                                sx={{ 
                                  fontSize: "1.1rem",
                                  lineHeight: 1.4,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "2.8em",
                                  "&:hover": { color: "#2563eb" }
                                }}
                              >
                                {art.title}
                              </Typography>

                              <Typography 
                                variant="body2" 
                                color="#64748b"
                                sx={{ 
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  mb: 3,
                                  lineHeight: 1.5
                                }}
                              >
                                {art.description}
                              </Typography>
                            </Box>

                            <Box>
                              <Divider sx={{ mb: 2 }} />
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={2.5} alignItems="center">
                                  <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Visibility sx={{ fontSize: "0.95rem" }} /> {art.viewsCount || 0}
                                  </Typography>
                                  <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    <Favorite sx={{ fontSize: "0.95rem", color: art.isLiked ? "#ef4444" : "#94a3b8" }} /> {art.likesCount || 0}
                                  </Typography>
                                </Stack>

                                <Stack direction="row" spacing={0.5}>
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => handleToggleLike(e, art.articleId)}
                                    sx={{ color: art.isLiked ? "#ef4444" : "#94a3b8" }}
                                  >
                                    {art.isLiked ? <Favorite /> : <FavoriteBorder />}
                                  </IconButton>
                                  <IconButton 
                                    size="small" 
                                    onClick={(e) => handleToggleBookmark(e, art.articleId)}
                                    sx={{ color: art.isBookmarked ? "#2563eb" : "#94a3b8" }}
                                  >
                                    {art.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                                  </IconButton>
                                </Stack>
                              </Stack>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                      <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={(e, value) => setPage(value)}
                        color="primary"
                        sx={{
                          "& .MuiPaginationItem-root": {
                            fontWeight: 700,
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            </Grid>

            {/* RIGHT COLUMN: SIDEBAR */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                
                {/* TRENDING SIDEBAR CARD */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff" 
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={850} 
                    color="#1e293b" 
                    mb={3}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <TrendingUp sx={{ color: "#2563eb" }} /> Bài viết nổi bật tuần qua
                  </Typography>

                  {loadingSidebar ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                      <CircularProgress size={24} sx={{ color: "#2563eb" }} />
                    </Box>
                  ) : trendingArticles.length === 0 ? (
                    <Typography variant="body2" color="#94a3b8">Chưa có bài viết xu hướng.</Typography>
                  ) : (
                    <Stack spacing={2.5}>
                      {trendingArticles.map((art, index) => (
                        <Stack 
                          key={art.articleId || index} 
                          direction="row" 
                          spacing={2} 
                          alignItems="flex-start"
                          onClick={() => navigate(`/career-guide/${art.articleId}`)}
                          sx={{ cursor: "pointer", "&:hover .art-title": { color: "#2563eb" } }}
                        >
                          <Typography 
                            variant="h4" 
                            fontWeight={900} 
                            sx={{ 
                              color: "#dbeafe", 
                              lineHeight: 1, 
                              fontSize: "2rem",
                              width: "35px"
                            }}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              className="art-title"
                              variant="subtitle2" 
                              fontWeight={800} 
                              color="#334155"
                              sx={{ 
                                lineHeight: 1.3, 
                                mb: 0.5,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                transition: "color 0.2s"
                              }}
                            >
                              {art.title}
                            </Typography>
                            <Typography variant="caption" color="#94a3b8" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Visibility sx={{ fontSize: "0.85rem" }} /> {art.viewsCount} lượt xem
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* POPULAR TAGS CARD */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff" 
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={850} 
                    color="#1e293b" 
                    mb={2.5}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <LocalOffer sx={{ color: "#2563eb", fontSize: "1.2rem" }} /> Chủ đề phổ biến
                  </Typography>

                  {loadingSidebar ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                      <CircularProgress size={24} sx={{ color: "#2563eb" }} />
                    </Box>
                  ) : popularTags.length === 0 ? (
                    <Typography variant="body2" color="#94a3b8">Chưa có chủ đề nào.</Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {popularTags.map((tag, index) => (
                        <Chip
                          key={tag[0] || index}
                          label={`${tag[0]} (${tag[1]})`}
                          variant="outlined"
                          onClick={() => handleCategoryChange(tag[0])}
                          sx={{ 
                            borderRadius: 2, 
                            fontWeight: 600,
                            borderColor: category === tag[0] ? "#2563eb" : "#cbd5e1",
                            bgcolor: category === tag[0] ? "#eff6ff" : "transparent",
                            color: category === tag[0] ? "#2563eb" : "#475569",
                            "&:hover": {
                              bgcolor: "#f8fafc",
                              borderColor: "#2563eb"
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Paper>

                {/* NEWSLETTER NEWS */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    borderRadius: 4, 
                    bgcolor: "#1e3a8a",
                    color: "#fff",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <Box 
                    sx={{ 
                      position: "absolute", 
                      top: "-20%", 
                      right: "-20%", 
                      width: "150px", 
                      height: "150px", 
                      borderRadius: "50%", 
                      background: "rgba(255,255,255,0.05)" 
                    }} 
                  />
                  
                  <Typography variant="h6" fontWeight={850} mb={1.5} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Email /> Nhận tin tức mới nhất
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#93c5fd", mb: 3, lineHeight: 1.5 }}>
                    Đăng ký để không bỏ lỡ các chia sẻ kỹ thuật, cẩm nang viết CV và trả lời phỏng vấn mới nhất từ các chuyên gia.
                  </Typography>
                  
                  <Box component="form" onSubmit={handleNewsletterSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Địa chỉ email của bạn"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      sx={{ 
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#fff",
                          borderRadius: 2,
                          "& fieldset": { border: "none" }
                        }
                      }}
                    />
                    <Button 
                      fullWidth 
                      type="submit"
                      variant="contained" 
                      sx={{ 
                        bgcolor: "#f59e0b",
                        color: "#1e3a8a",
                        fontWeight: 800,
                        textTransform: "none",
                        borderRadius: 2,
                        "&:hover": { bgcolor: "#d97706", color: "#fff" }
                      }}
                    >
                      Đăng ký ngay
                    </Button>
                  </Box>
                </Paper>
                
              </Stack>
            </Grid>

          </Grid>
        )}
      </Container>
    </UserLayout>
  );
}
