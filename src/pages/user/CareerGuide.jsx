import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardMedia, CardContent,
  Chip, Stack, TextField, InputAdornment, Button, Pagination,
  Select, MenuItem, FormControl, InputLabel, Avatar, Divider,
  Paper, CircularProgress, IconButton
} from "@mui/material";
import {
  Search, Visibility, Favorite, FavoriteBorder, Bookmark, BookmarkBorder,
  AccessTime, CalendarMonth, TrendingUp, Email, LocalOffer
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
  const [category, setCategory] = useState("Tất cả");
  const [searchVal, setSearchVal] = useState("");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const size = 6;
  const token = localStorage.getItem("token");

  useEffect(() => { fetchArticles(); }, [category, query, sortBy, page]);
  useEffect(() => { fetchSidebarData(); }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticlesPublic({ category: category === "Tất cả" ? "" : category, query, page: page - 1, size, sortBy });
      setArticles(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showToast("Lỗi tải danh sách bài viết", "error");
    } finally { setLoading(false); }
  };

  const fetchSidebarData = async () => {
    setLoadingSidebar(true);
    try {
      const [trending, tags] = await Promise.all([articleService.getTrendingArticles(), articleService.getPopularTags()]);
      setTrendingArticles(trending || []);
      setPopularTags(tags || []);
    } catch (err) { console.error(err); }
    finally { setLoadingSidebar(false); }
  };

  const handleSearchSubmit = (e) => { e.preventDefault(); setQuery(searchVal); setPage(1); };
  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };
  const handleSortChange = (e) => { setSortBy(e.target.value); setPage(1); };

  const handleToggleBookmark = async (e, articleId) => {
    e.stopPropagation();
    if (!token) { showToast("Vui lòng đăng nhập để bookmark bài viết", "warning"); navigate("/login"); return; }
    try {
      const v = await articleService.toggleBookmark(articleId);
      showToast(v ? "Đã lưu vào cẩm nang!" : "Đã bỏ lưu bài viết!", "success");
      setArticles(prev => prev.map(a => a.articleId === articleId ? { ...a, isBookmarked: v } : a));
    } catch { showToast("Không thể thực hiện tác vụ", "error"); }
  };

  const handleToggleLike = async (e, articleId) => {
    e.stopPropagation();
    if (!token) { showToast("Vui lòng đăng nhập để thích bài viết", "warning"); navigate("/login"); return; }
    try {
      const v = await articleService.toggleLike(articleId);
      showToast(v ? "Đã thích bài viết!" : "Đã bỏ thích!", "success");
      setArticles(prev => prev.map(a => a.articleId === articleId ? { ...a, isLiked: v, likesCount: v ? a.likesCount + 1 : Math.max(0, a.likesCount - 1) } : a));
    } catch { showToast("Không thể thực hiện tác vụ", "error"); }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast("Đăng ký nhận bài viết thành công!", "success");
    setNewsletterEmail("");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const featuredArticle = page === 1 && !query ? (articles.find(a => a.isPinned) || articles[0]) : null;
  const regularArticles = featuredArticle ? articles.filter(a => a.articleId !== featuredArticle.articleId) : articles;

  const TrendingSidebar = ({ fixedHeight = false }) => (
    <Paper elevation={0} sx={{ p: "20px", borderRadius: "18px", border: "1px solid #e2e8f0", bgcolor: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", height: fixedHeight ? { md: "300px" } : "auto", display: "flex", flexDirection: "column" }}>
      <Typography variant="h6" fontWeight={800} color="#1e293b" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "16px" }}>
        <TrendingUp sx={{ color: "#2563eb", fontSize: "20px" }} /> Bài viết xu hướng
      </Typography>
      {loadingSidebar ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}><CircularProgress size={24} sx={{ color: "#2563eb" }} /></Box>
      ) : trendingArticles.length === 0 ? (
        <Typography variant="body2" color="#94a3b8">Chưa có bài viết xu hướng.</Typography>
      ) : (
        <Box sx={{ flex: 1, overflowY: fixedHeight ? "auto" : "visible" }}>
          <Stack spacing={2}>
            {trendingArticles.map((art, i) => (
              <Stack key={art.articleId || i} direction="row" spacing={1.5} alignItems="center" onClick={() => navigate(`/career-guide/${art.articleId}`)} sx={{ cursor: "pointer", "&:hover .tt": { color: "#2563eb" } }}>
                <Typography fontWeight={800} sx={{ color: "#3b82f6", minWidth: "22px", fontSize: "14px" }}>{String(i + 1).padStart(2, "0")}</Typography>
                <Box component="img" src={art.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=120&h=80&fit=crop"} alt={art.title} sx={{ width: 56, height: 42, borderRadius: "8px", objectFit: "cover", flexShrink: 0 }} />
                <Box sx={{ minWidth: 0 }}>
                  <Typography className="tt" variant="body2" fontWeight={700} color="#1e293b" sx={{ fontSize: "13px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", transition: "color 0.2s" }}>{art.title}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>
      )}
    </Paper>
  );

  return (
    <UserLayout>
      {/* HERO */}
      <Box sx={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%)", color: "#fff", pt: { xs: 8, md: 10 }, pb: { xs: 6, md: 8 }, position: "relative", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", top: "-20%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.04)", filter: "blur(50px)", pointerEvents: "none" }} />
        <Container maxWidth="xl" sx={{ px: "24px" }}>
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography variant="h1" fontWeight={900} sx={{ mb: 1.5, fontSize: { xs: "26px", md: "32px" }, letterSpacing: "-0.02em" }}>
                Cẩm Nang <span style={{ color: "#93c5fd" }}>Nghề Nghiệp</span>
              </Typography>
              <Typography sx={{ color: "#dbeafe", mb: 3, lineHeight: 1.6, fontSize: "15px", maxWidth: 580 }}>
                Trang bị kiến thức tìm việc, kinh nghiệm viết CV, trả lời phỏng vấn chuẩn ATS và các bí quyết phát triển sự nghiệp hiệu quả.
              </Typography>
              <Box component="form" onSubmit={handleSearchSubmit} sx={{ maxWidth: 520 }}>
                <TextField fullWidth variant="outlined" placeholder="Tìm kiếm bài viết, chủ đề nghề nghiệp..."
                  value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Search sx={{ color: "#94a3b8" }} /></InputAdornment>,
                    endAdornment: <InputAdornment position="end"><Button type="submit" variant="contained" sx={{ bgcolor: "#2563eb", color: "#fff", textTransform: "none", fontWeight: 700, borderRadius: 2, px: 2.5, "&:hover": { bgcolor: "#1d4ed8" } }}>Tìm kiếm</Button></InputAdornment>,
                    sx: { bgcolor: "rgba(255,255,255,0.95)", borderRadius: 3, pr: 1, "& .MuiOutlinedInput-notchedOutline": { border: "none" } }
                  }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: "none", md: "block" }, textAlign: "center" }}>
              <Box component="img" src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=480&h=320&fit=crop" alt="Career Guide" sx={{ width: "100%", maxWidth: 420, borderRadius: 5, boxShadow: "0 20px 40px rgba(0,0,0,0.2)", transform: "rotate(-1.5deg)" }} />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CATEGORY FILTER */}
      <Box sx={{ borderBottom: "1px solid #e2e8f0", bgcolor: "#fff", py: 1.5 }}>
        <Container maxWidth="xl" sx={{ px: "24px" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Box sx={{ display: "flex", flexWrap: "nowrap", overflowX: "auto", gap: "10px", pb: 0.5, "&::-webkit-scrollbar": { height: 3 }, "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 4 } }}>
              {STATIC_CATEGORIES.map(cat => (
                <Chip key={cat} label={cat} clickable onClick={() => handleCategoryChange(cat)} sx={{ height: "34px", px: 0.5, fontSize: "13px", fontWeight: category === cat ? 700 : 500, flexShrink: 0, bgcolor: category === cat ? "#2563eb" : "#f1f5f9", color: category === cat ? "#fff" : "#475569", "&:hover": { bgcolor: category === cat ? "#1d4ed8" : "#e2e8f0" }, transition: "all 0.18s" }} />
              ))}
            </Box>
            <FormControl size="small" sx={{ minWidth: 150, flexShrink: 0 }}>
              <InputLabel>Sắp xếp</InputLabel>
              <Select value={sortBy} label="Sắp xếp" onChange={handleSortChange} sx={{ borderRadius: 2, fontSize: "13px" }}>
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="views">Xem nhiều nhất</MenuItem>
                <MenuItem value="likes">Yêu thích nhất</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ mt: "32px", mb: "60px", px: "24px" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}><CircularProgress sx={{ color: "#2563eb" }} /></Box>
        ) : (
          <Box>
            {/* ROW 1: Featured + Trending (page 1, no search) */}
            {featuredArticle && (
              <Grid container spacing={3} sx={{ mb: "32px" }}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Card elevation={0} onClick={() => navigate(`/career-guide/${featuredArticle.articleId}`)} sx={{ height: { md: "300px" }, borderRadius: "20px", border: "1px solid #e2e8f0", display: "flex", flexDirection: { xs: "column", md: "row" }, cursor: "pointer", overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.06)", "&:hover": { borderColor: "#2563eb", transform: "translateY(-3px)", boxShadow: "0 12px 28px rgba(37,99,235,0.1)" }, transition: "all 0.25s ease" }}>
                    <Box sx={{ width: { xs: "100%", md: "55%" }, height: { xs: 200, md: "100%" }, flexShrink: 0 }}>
                      <CardMedia component="img" image={featuredArticle.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop"} alt={featuredArticle.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <CardContent sx={{ width: { xs: "100%", md: "45%" }, p: { xs: 2, md: "24px" }, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 0 }}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap" gap={0.5}>
                          <Chip label="Nổi bật" size="small" sx={{ bgcolor: "#fee2e2", color: "#ef4444", fontWeight: 700, fontSize: "11px", height: 22 }} />
                          <Chip label={featuredArticle.category} size="small" sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 700, fontSize: "11px", height: 22 }} />
                          <Typography variant="caption" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.4, fontSize: "12px" }}>
                            <AccessTime sx={{ fontSize: "13px" }} />{featuredArticle.readTime}
                          </Typography>
                        </Stack>
                        <Typography fontWeight={800} color="#1e293b" sx={{ fontSize: "20px", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 1, "&:hover": { color: "#2563eb" } }}>{featuredArticle.title}</Typography>
                        <Typography variant="body2" color="#475569" sx={{ fontSize: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.5 }}>{featuredArticle.description}</Typography>
                      </Box>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={getMediaUrl(featuredArticle.authorAvatar)} sx={{ width: 28, height: 28, bgcolor: "#3b82f6", fontSize: "12px" }}>{featuredArticle.authorName?.charAt(0)}</Avatar>
                          <Box>
                            <Typography fontWeight={700} color="#334155" sx={{ fontSize: "12px", lineHeight: 1.2 }}>{featuredArticle.authorName || "Ban Biên Tập"}</Typography>
                            <Typography variant="caption" color="#94a3b8" sx={{ fontSize: "11px" }}>{formatDate(featuredArticle.createdAt)}</Typography>
                          </Box>
                        </Stack>
                        <Stack direction="row">
                          <IconButton size="small" onClick={e => handleToggleLike(e, featuredArticle.articleId)} sx={{ color: featuredArticle.isLiked ? "#ef4444" : "#94a3b8" }}>{featuredArticle.isLiked ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}</IconButton>
                          <IconButton size="small" onClick={e => handleToggleBookmark(e, featuredArticle.articleId)} sx={{ color: featuredArticle.isBookmarked ? "#2563eb" : "#94a3b8" }}>{featuredArticle.isBookmarked ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}</IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TrendingSidebar fixedHeight />
                </Grid>
              </Grid>
            )}

            {/* ROW 2: Latest articles (left) + Sidebar (right) */}
            <Grid container spacing={3}>
              {/* LEFT */}
              <Grid size={{ xs: 12, md: 8 }}>
                {articles.length === 0 ? (
                  <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                    <Typography fontWeight={700} color="#1e293b" sx={{ fontSize: "22px", mb: 1 }}>Không tìm thấy bài viết nào</Typography>
                    <Typography color="#64748b" sx={{ fontSize: "15px" }}>Thử thay đổi từ khóa hoặc bộ lọc.</Typography>
                  </Paper>
                ) : (
                  <Box>
                    <Typography fontWeight={850} color="#1e293b" sx={{ fontSize: "22px", mb: 2.5 }}>
                      {query ? `Kết quả tìm kiếm cho "${query}"` : "Bài viết mới nhất"}
                    </Typography>
                    {/* 3 cards per row: xs=12, sm=6, lg=4 */}
                    <Grid container spacing={2}>
                      {regularArticles.map((art, idx) => (
                        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={art.articleId || idx}>
                          <Card elevation={0} onClick={() => navigate(`/career-guide/${art.articleId}`)} sx={{ height: "260px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", display: "flex", flexDirection: "column", cursor: "pointer", overflow: "hidden", transition: "all 0.22s ease", "&:hover": { borderColor: "#2563eb", transform: "translateY(-3px)", boxShadow: "0 12px 24px rgba(37,99,235,0.08)" } }}>
                            <Box sx={{ position: "relative", flexShrink: 0 }}>
                              <CardMedia component="img" height="130" image={art.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop"} alt={art.title} sx={{ objectFit: "cover" }} />
                              <Chip label={art.category} size="small" sx={{ position: "absolute", top: 8, left: 8, bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", color: "#1e3a8a", fontWeight: 700, fontSize: "11px", height: 20 }} />
                            </Box>
                            <CardContent sx={{ p: "12px 14px", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <Box>
                                <Typography fontWeight={800} color="#1e293b" sx={{ fontSize: "14px", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 0.5, "&:hover": { color: "#2563eb" } }}>{art.title}</Typography>
                                <Typography variant="body2" color="#64748b" sx={{ fontSize: "12px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4 }}>{art.description}</Typography>
                              </Box>
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Typography variant="caption" color="#94a3b8" sx={{ display: "flex", alignItems: "center", gap: 0.3, fontSize: "11px" }}><AccessTime sx={{ fontSize: "12px" }} />{art.readTime}</Typography>
                                  <Typography variant="caption" color="#94a3b8" sx={{ display: "flex", alignItems: "center", gap: 0.3, fontSize: "11px" }}><Visibility sx={{ fontSize: "12px" }} />{art.viewsCount || 0}</Typography>
                                </Stack>
                                <Stack direction="row">
                                  <IconButton size="small" onClick={e => handleToggleLike(e, art.articleId)} sx={{ color: art.isLiked ? "#ef4444" : "#94a3b8", p: "4px" }}>{art.isLiked ? <Favorite sx={{ fontSize: "15px" }} /> : <FavoriteBorder sx={{ fontSize: "15px" }} />}</IconButton>
                                  <IconButton size="small" onClick={e => handleToggleBookmark(e, art.articleId)} sx={{ color: art.isBookmarked ? "#2563eb" : "#94a3b8", p: "4px" }}>{art.isBookmarked ? <Bookmark sx={{ fontSize: "15px" }} /> : <BookmarkBorder sx={{ fontSize: "15px" }} />}</IconButton>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    {totalPages > 1 && (
                      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                        <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" sx={{ "& .MuiPaginationItem-root": { fontWeight: 700 } }} />
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>

              {/* RIGHT SIDEBAR */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack spacing={2.5} sx={{ mt: { md: "52px" } }}>
                  {!featuredArticle && <TrendingSidebar />}


                  {/* Popular Tags */}
                  <Paper elevation={0} sx={{ p: "20px", borderRadius: "18px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                    <Typography fontWeight={800} color="#1e293b" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "16px" }}>
                      <LocalOffer sx={{ color: "#2563eb", fontSize: "18px" }} />Chủ đề phổ biến
                    </Typography>
                    {loadingSidebar ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}><CircularProgress size={22} sx={{ color: "#2563eb" }} /></Box>
                    ) : popularTags.length === 0 ? (
                      <Typography variant="body2" color="#94a3b8">Chưa có chủ đề nào.</Typography>
                    ) : (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {popularTags.map((tag, i) => (
                          <Chip key={tag[0] || i} label={`${tag[0]} (${tag[1]})`} variant="outlined" onClick={() => handleCategoryChange(tag[0])} sx={{ borderRadius: "8px", fontWeight: 600, fontSize: "12px", borderColor: category === tag[0] ? "#2563eb" : "#e2e8f0", bgcolor: category === tag[0] ? "#eff6ff" : "transparent", color: category === tag[0] ? "#2563eb" : "#475569", "&:hover": { bgcolor: "#f0f7ff", borderColor: "#2563eb" } }} />
                        ))}
                      </Box>
                    )}
                  </Paper>

                  {/* Newsletter */}
                  <Paper elevation={0} sx={{ p: "20px", borderRadius: "18px", bgcolor: "#1e3a8a", color: "#fff", position: "relative", overflow: "hidden" }}>
                    <Box sx={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
                    <Typography fontWeight={800} mb={1} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "16px" }}>
                      <Email sx={{ fontSize: "18px" }} />Nhận bài viết mới nhất
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#93c5fd", mb: 2, lineHeight: 1.5, fontSize: "13px" }}>
                      Đăng ký để không bỏ lỡ các chia sẻ về nghề nghiệp và phát triển sự nghiệp.
                    </Typography>
                    <Box component="form" onSubmit={handleNewsletterSubmit}>
                      <TextField fullWidth size="small" placeholder="Địa chỉ email của bạn" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: "8px", fontSize: "13px", "& fieldset": { border: "none" } } }} />
                      <Button fullWidth type="submit" variant="contained" sx={{ bgcolor: "#f59e0b", color: "#1e3a8a", fontWeight: 800, textTransform: "none", borderRadius: "8px", fontSize: "14px", "&:hover": { bgcolor: "#d97706" } }}>Đăng ký ngay</Button>
                    </Box>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </UserLayout>
  );
}
  