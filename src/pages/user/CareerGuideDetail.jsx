import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Avatar,
  Stack,
  Divider,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  Rating,
  Card,
  List,
  ListItem,
  Chip
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  Share,
  CalendarMonth,
  AccessTime,
  Send,
  Star,
  StarOutline
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import { articleService } from "../../services/articleService";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function CareerGuideDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchArticleDetail();
    fetchTrending();
  }, [id]);

  const fetchArticleDetail = async () => {
    setLoading(true);
    try {
      // Decode current user ID if logged in to resolve interaction states
      const detail = await articleService.getArticleDetail(id);
      setArticle(detail);
      
      const commentList = await articleService.getComments(id);
      setComments(commentList || []);
    } catch (err) {
      console.error("Lỗi lấy chi tiết bài viết", err);
      showToast("Lỗi tải chi tiết bài viết", "error");
      navigate("/career-guide");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      const trending = await articleService.getTrendingArticles();
      setTrendingArticles(trending.slice(0, 3) || []);
    } catch (err) {
      console.error("Lỗi lấy bài viết xu hướng", err);
    }
  };

  const handleToggleLike = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập để thích bài viết", "warning");
      navigate("/login");
      return;
    }
    try {
      const isLikedNow = await articleService.toggleLike(article.articleId);
      showToast(isLikedNow ? "Đã thích bài viết!" : "Đã bỏ thích!", "success");
      setArticle(prev => ({
        ...prev,
        isLiked: isLikedNow,
        likesCount: isLikedNow ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1)
      }));
    } catch (err) {
      console.error(err);
      showToast("Không thể thực hiện tác vụ", "error");
    }
  };

  const handleToggleBookmark = async () => {
    if (!token) {
      showToast("Vui lòng đăng nhập để bookmark bài viết", "warning");
      navigate("/login");
      return;
    }
    try {
      const isBookmarkedNow = await articleService.toggleBookmark(article.articleId);
      showToast(isBookmarkedNow ? "Đã lưu bài viết!" : "Đã bỏ lưu bài viết!", "success");
      setArticle(prev => ({
        ...prev,
        isBookmarked: isBookmarkedNow
      }));
    } catch (err) {
      console.error(err);
      showToast("Không thể thực hiện tác vụ", "error");
    }
  };

  const handleRate = async (ratingVal) => {
    if (!token) {
      showToast("Vui lòng đăng nhập để đánh giá", "warning");
      navigate("/login");
      return;
    }
    if (!ratingVal) return;
    try {
      const newAvg = await articleService.rateArticle(article.articleId, ratingVal);
      showToast(`Đã đánh giá ${ratingVal} sao!`, "success");
      setArticle(prev => ({
        ...prev,
        userRating: ratingVal,
        averageRating: newAvg
      }));
    } catch (err) {
      console.error(err);
      showToast("Không thể thực hiện đánh giá", "error");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Đã sao chép liên kết vào bộ nhớ tạm!", "success");
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!token) {
      showToast("Vui lòng đăng nhập để gửi bình luận", "warning");
      navigate("/login");
      return;
    }
    if (!newComment.trim()) return;
    
    setSubmittingComment(true);
    try {
      const commentRes = await articleService.addComment(article.articleId, newComment);
      setComments(prev => [commentRes, ...prev]);
      setNewComment("");
      showToast("Đã gửi bình luận!", "success");
      // Update comment count locally
      setArticle(prev => ({
        ...prev,
        commentsCount: prev.commentsCount + 1
      }));
    } catch (err) {
      console.error(err);
      showToast("Không thể gửi bình luận", "error");
    } finally {
      setSubmittingComment(false);
    }
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

  // Simple Markdown Parser to styled JSX
  const parseMarkdown = (markdownText) => {
    if (!markdownText) return null;
    const lines = markdownText.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <Typography 
            key={index} 
            variant="h4" 
            fontWeight={900} 
            sx={{ color: "#1e293b", mt: 4, mb: 2, fontSize: { xs: "1.5rem", md: "1.8rem" } }}
          >
            {line.substring(2)}
          </Typography>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <Typography 
            key={index} 
            variant="h5" 
            fontWeight={800} 
            sx={{ color: "#334155", mt: 3.5, mb: 2, fontSize: { xs: "1.25rem", md: "1.4rem" } }}
          >
            {line.substring(3)}
          </Typography>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <Typography 
            key={index} 
            variant="h6" 
            fontWeight={700} 
            sx={{ color: "#475569", mt: 3, mb: 1.5 }}
          >
            {line.substring(4)}
          </Typography>
        );
      }
      // List items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <Box key={index} sx={{ display: "flex", alignItems: "flex-start", ml: 2, mb: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#2563eb", mt: 1.2, mr: 1.5, flexShrink: 0 }} />
            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.7 }}>
              {parseInlineStyles(line.substring(2))}
            </Typography>
          </Box>
        );
      }
      // Numbered list items
      const numberedMatch = line.match(/^(\d+)\.\s(.*)/);
      if (numberedMatch) {
        return (
          <Box key={index} sx={{ display: "flex", alignItems: "flex-start", ml: 2, mb: 1.5 }}>
            <Typography variant="body1" fontWeight={700} sx={{ color: "#2563eb", mr: 1.5, minWidth: 20 }}>
              {numberedMatch[1]}.
            </Typography>
            <Typography variant="body1" sx={{ color: "#475569", lineHeight: 1.7 }}>
              {parseInlineStyles(numberedMatch[2])}
            </Typography>
          </Box>
        );
      }
      // Code blocks
      if (line.startsWith("```")) {
        return null; // Skip code fences, just let code block content render
      }
      if (line.endsWith("```")) {
        return null;
      }
      // Regular paragraphs
      if (line.trim() === "") {
        return <Box key={index} sx={{ height: 16 }} />;
      }
      return (
        <Typography key={index} variant="body1" sx={{ color: "#475569", lineHeight: 1.8, mb: 2, fontSize: "1.05rem" }}>
          {parseInlineStyles(line)}
        </Typography>
      );
    });
  };

  // Helper for strong & inline code
  const parseInlineStyles = (text) => {
    let parts = [text];
    
    // Parse bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let newParts = [];
    
    text.split("").forEach(() => {}); // dummy logic to shut up linters if needed

    // Simple replacement for bold and inline code
    const elements = [];
    let lastIndex = 0;
    const combinedRegex = /(\*\*.*?\*\*|`.*?`)/g;
    
    while ((match = combinedRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      const matchText = match[0];
      
      // Push leading text
      if (matchIndex > lastIndex) {
        elements.push(text.substring(lastIndex, matchIndex));
      }
      
      if (matchText.startsWith("**") && matchText.endsWith("**")) {
        elements.push(
          <strong key={matchIndex} style={{ color: "#1e293b", fontWeight: 700 }}>
            {matchText.slice(2, -2)}
          </strong>
        );
      } else if (matchText.startsWith("`") && matchText.endsWith("`")) {
        elements.push(
          <code key={matchIndex} style={{ backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: 4, color: "#ef4444", fontSize: "0.9em", fontFamily: "monospace" }}>
            {matchText.slice(1, -1)}
          </code>
        );
      }
      
      lastIndex = combinedRegex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    
    return elements.length > 0 ? elements : text;
  };

  return (
    <UserLayout>
      <Container maxWidth={false} sx={{ pt: 14, pb: 10, px: { xs: 4, md: 10 } }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress sx={{ color: "#2563eb" }} />
          </Box>
        ) : !article ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5">Không tìm thấy bài viết.</Typography>
          </Box>
        ) : (
          <Grid container spacing={5}>
            
            {/* LEFT COLUMN: ARTICLE BODY & COMMENTS */}
            <Grid item xs={12} lg={8}>
              <Box sx={{ mb: 4 }}>
                {/* Back button */}
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate("/career-guide")}
                  sx={{ color: "#64748b", textTransform: "none", fontWeight: 700, mb: 3 }}
                >
                  Quay lại cẩm nang
                </Button>

                {/* Article Header */}
                <Chip 
                  label={article.category} 
                  sx={{ bgcolor: "#eff6ff", color: "#2563eb", fontWeight: 800, mb: 2 }} 
                />
                
                <Typography 
                  variant="h3" 
                  fontWeight={900} 
                  color="#1e293b" 
                  sx={{ 
                    fontSize: { xs: "2rem", md: "2.8rem" },
                    lineHeight: 1.25,
                    mb: 3,
                    letterSpacing: "-0.01em"
                  }}
                >
                  {article.title}
                </Typography>

                {/* Author Info */}
                <Stack 
                  direction={{ xs: "column", sm: "row" }} 
                  spacing={{ xs: 2, sm: 4 }} 
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar 
                      src={getMediaUrl(article.authorAvatar)} 
                      sx={{ width: 44, height: 44, bgcolor: "#2563eb" }}
                    >
                      {article.authorName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={800} color="#334155">
                        {article.authorName || "Ban Biên Tập"}
                      </Typography>
                      <Typography variant="caption" color="#64748b">
                        Tác giả & biên tập viên
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={3}>
                    <Typography variant="body2" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <CalendarMonth sx={{ fontSize: "1.1rem" }} /> {formatDate(article.createdAt)}
                    </Typography>
                    <Typography variant="body2" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <AccessTime sx={{ fontSize: "1.1rem" }} /> {article.readTime}
                    </Typography>
                    <Typography variant="body2" color="#64748b" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Visibility sx={{ fontSize: "1.1rem" }} /> {article.viewsCount} lượt xem
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Main Banner Image */}
              <Box 
                component="img"
                src={article.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&h=500&fit=crop"}
                alt={article.title}
                sx={{
                  width: "100%",
                  height: { xs: 250, sm: 400 },
                  objectFit: "cover",
                  borderRadius: 4,
                  mb: 5,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)"
                }}
              />

              {/* ARTICLE BODY */}
              <Box sx={{ mb: 6 }}>
                {parseMarkdown(article.content)}
              </Box>

              <Divider sx={{ my: 4 }} />

              {/* SOCIAL ACTIONS PANEL */}
              <Stack 
                direction={{ xs: "column", sm: "row" }} 
                justifyContent="space-between" 
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={3}
                sx={{ mb: 6 }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={handleToggleLike}
                    startIcon={article.isLiked ? <Favorite sx={{ color: "#ef4444" }} /> : <FavoriteBorder />}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: "none", 
                      fontWeight: 700,
                      color: article.isLiked ? "#ef4444" : "#475569",
                      borderColor: article.isLiked ? "#fca5a5" : "#cbd5e1",
                      bgcolor: article.isLiked ? "#fef2f2" : "transparent",
                      "&:hover": {
                        bgcolor: article.isLiked ? "#fee2e2" : "#f8fafc",
                        borderColor: article.isLiked ? "#ef4444" : "#94a3b8"
                      }
                    }}
                  >
                    Thích ({article.likesCount})
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleToggleBookmark}
                    startIcon={article.isBookmarked ? <Bookmark sx={{ color: "#2563eb" }} /> : <BookmarkBorder />}
                    sx={{ 
                      borderRadius: 2, 
                      textTransform: "none", 
                      fontWeight: 700,
                      color: article.isBookmarked ? "#2563eb" : "#475569",
                      borderColor: article.isBookmarked ? "#93c5fd" : "#cbd5e1",
                      bgcolor: article.isBookmarked ? "#eff6ff" : "transparent",
                      "&:hover": {
                        bgcolor: article.isBookmarked ? "#dbeafe" : "#f8fafc",
                        borderColor: article.isBookmarked ? "#2563eb" : "#94a3b8"
                      }
                    }}
                  >
                    {article.isBookmarked ? "Đã lưu" : "Lưu lại"}
                  </Button>

                  <IconButton onClick={handleShare} sx={{ border: "1px solid #cbd5e1", borderRadius: 2 }}>
                    <Share sx={{ fontSize: "1.2rem", color: "#64748b" }} />
                  </IconButton>
                </Stack>

                {/* STAR RATING */}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="body2" fontWeight={800} color="#334155">
                      Đánh giá: {article.averageRating || 0} / 5
                    </Typography>
                    <Typography variant="caption" color="#94a3b8">
                      Cung cấp phản hồi của bạn
                    </Typography>
                  </Box>
                  <Rating
                    value={article.userRating || 0}
                    onChange={(event, newValue) => handleRate(newValue)}
                    emptyIcon={<StarOutline style={{ opacity: 0.55 }} fontSize="inherit" />}
                    sx={{ color: "#f59e0b" }}
                  />
                </Stack>
              </Stack>

              {/* COMMENTS SECTION */}
              <Box>
                <Typography variant="h5" fontWeight={850} color="#1e293b" mb={3}>
                  Bình luận ({article.commentsCount})
                </Typography>

                {/* Comment Form */}
                <Box component="form" onSubmit={handleAddComment} sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Viết suy nghĩ của bạn về bài viết này..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    sx={{ 
                      mb: 2,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submittingComment}
                      endIcon={submittingComment ? <CircularProgress size={16} /> : <Send />}
                      sx={{ 
                        bgcolor: "#2563eb",
                        color: "#fff",
                        textTransform: "none",
                        fontWeight: 700,
                        borderRadius: 2.5,
                        px: 4,
                        py: 1
                      }}
                    >
                      Gửi bình luận
                    </Button>
                  </Box>
                </Box>

                {/* Comments List */}
                {comments.length === 0 ? (
                  <Typography variant="body2" color="#94a3b8" sx={{ textAlign: "center", py: 4 }}>
                    Chưa có bình luận nào. Hãy trở thành người đầu tiên bình luận!
                  </Typography>
                ) : (
                  <List sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0 }}>
                    {comments.map((comment, index) => (
                      <ListItem 
                        key={comment.commentId || index}
                        alignItems="flex-start"
                        component={Paper}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          border: "1px solid #f1f5f9",
                          flexDirection: "column"
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="center" width="100%" mb={1.5}>
                          <Avatar 
                            src={getMediaUrl(comment.userAvatar)} 
                            sx={{ width: 36, height: 36, bgcolor: "#3b82f6" }}
                          >
                            {comment.userFullName?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" fontWeight={800} color="#334155">
                              {comment.userFullName}
                            </Typography>
                            <Typography variant="caption" color="#94a3b8">
                              {formatDate(comment.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Typography variant="body2" color="#475569" sx={{ pl: 0, lineHeight: 1.6 }}>
                          {comment.content}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

            </Grid>

            {/* RIGHT COLUMN: SIDEBAR */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4} sx={{ position: "sticky", top: 110 }}>
                
                {/* AUTHOR DETAILS CARD */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff",
                    textAlign: "center"
                  }}
                >
                  <Avatar 
                    src={getMediaUrl(article.authorAvatar)} 
                    sx={{ width: 70, height: 70, mx: "auto", mb: 2, bgcolor: "#2563eb" }}
                  >
                    {article.authorName?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" fontWeight={850} color="#1e293b">
                    {article.authorName || "Ban Biên Tập"}
                  </Typography>
                  <Typography variant="caption" color="#2563eb" fontWeight={700} sx={{ display: "block", mb: 2 }}>
                    Chuyên gia Tư vấn Nghề nghiệp
                  </Typography>
                  <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.5, px: 1 }}>
                    Ban Biên Tập CvAdvisor Platform - Chia sẻ các bài phân tích sâu, xu hướng việc làm và bí quyết thương lượng lương, viết CV vượt qua ải ATS.
                  </Typography>
                </Paper>

                {/* TRENDING ARTICLES */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 4, 
                    border: "1px solid #e2e8f0",
                    bgcolor: "#fff" 
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={850} color="#1e293b" mb={3.5}>
                    Bài viết liên quan
                  </Typography>

                  {trendingArticles.length === 0 ? (
                    <Typography variant="body2" color="#94a3b8">Không có bài viết liên quan.</Typography>
                  ) : (
                    <Stack spacing={2.5}>
                      {trendingArticles.map((art, index) => (
                        <Stack 
                          key={art.articleId || index} 
                          direction="row" 
                          spacing={2} 
                          alignItems="center"
                          onClick={() => navigate(`/career-guide/${art.articleId}`)}
                          sx={{ cursor: "pointer", "&:hover .side-title": { color: "#2563eb" } }}
                        >
                          <Box 
                            component="img"
                            src={art.imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&h=80&fit=crop"}
                            sx={{ width: 80, height: 60, objectFit: "cover", borderRadius: 2 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Typography 
                              className="side-title"
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

              </Stack>
            </Grid>

          </Grid>
        )}
      </Container>
    </UserLayout>
  );
}
