import { useEffect, useState, useCallback } from "react";
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  Button, Stack, Dialog, DialogTitle, DialogContent,
  TextField, MenuItem, Select, FormControl, InputLabel,
  Chip, InputAdornment, Typography, Paper, Box, IconButton,
  Checkbox, FormControlLabel, Card, CardMedia, CardContent,
  CircularProgress, Grid, Avatar, TablePagination
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

import { articleService } from "../../services/articleService";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function ArticleManagement() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const showToast = useToast();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("Viết CV");
  const [formReadTime, setFormReadTime] = useState("5 phút đọc");
  const [formPinned, setFormPinned] = useState(false);
  const [formStatus, setFormStatus] = useState("PUBLISHED");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await articleService.getArticlesAdmin();
      setArticles(data || []);
    } catch (error) {
      showToast("Lỗi tải danh sách cẩm nang", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  // Client-side filtering logic
  useEffect(() => {
    let result = [...articles];

    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      result = result.filter(art => 
        art.title?.toLowerCase().includes(lower) || 
        art.description?.toLowerCase().includes(lower)
      );
    }

    if (selectedCategory !== "") {
      result = result.filter(art => art.category === selectedCategory);
    }

    if (selectedStatus !== "") {
      result = result.filter(art => art.status === selectedStatus);
    }

    setFilteredArticles(result);
    setPage(0);
  }, [articles, searchTerm, selectedCategory, selectedStatus]);

  const handleOpenDialog = (article = null) => {
    if (article) {
      setSelectedArticle(article);
      setFormTitle(article.title || "");
      setFormDesc(article.description || "");
      setFormContent(article.content || "");
      setFormCategory(article.category || "Viết CV");
      setFormReadTime(article.readTime || "5 phút đọc");
      setFormPinned(article.pinned || false);
      setFormStatus(article.status || "PUBLISHED");
      setFormImageUrl(article.imageUrl || "");
      setImagePreview(article.imageUrl ? getMediaUrl(article.imageUrl) : "");
    } else {
      setSelectedArticle(null);
      setFormTitle("");
      setFormDesc("");
      setFormContent("");
      setFormCategory("Viết CV");
      setFormReadTime("5 phút đọc");
      setFormPinned(false);
      setFormStatus("PUBLISHED");
      setFormImageUrl("");
      setImagePreview("");
    }
    setImageFile(null);
    setOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;
    setUploadingImage(true);
    try {
      const res = await articleService.uploadArticleImage(imageFile);
      setFormImageUrl(res.imageUrl);
      showToast("Tải ảnh lên thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi tải ảnh lên", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim() || !formContent.trim()) {
      showToast("Vui lòng điền đầy đủ tiêu đề, mô tả ngắn và nội dung bài viết", "warning");
      return;
    }

    let finalImageUrl = formImageUrl;
    
    // Automatically upload image if selected but not uploaded yet
    if (imageFile && !formImageUrl) {
      setUploadingImage(true);
      try {
        const res = await articleService.uploadArticleImage(imageFile);
        finalImageUrl = res.imageUrl;
      } catch (err) {
        showToast("Lỗi tải ảnh lên tự động", "error");
        setUploadingImage(false);
        return;
      }
      setUploadingImage(false);
    }

    const payload = {
      title: formTitle,
      description: formDesc,
      content: formContent,
      category: formCategory,
      readTime: formReadTime,
      pinned: formPinned,
      status: formStatus,
      imageUrl: finalImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
    };

    try {
      if (selectedArticle) {
        await articleService.updateArticle(selectedArticle.articleId, payload);
        showToast("Cập nhật bài viết thành công!", "success");
      } else {
        await articleService.createArticle(payload);
        showToast("Thêm bài viết thành công!", "success");
      }
      setOpen(false);
      loadArticles();
    } catch (error) {
      showToast("Thao tác thất bại", "error");
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
      try {
        await articleService.deleteArticle(articleId);
        showToast("Xóa bài viết thành công", "success");
        loadArticles();
      } catch (err) {
        showToast("Lỗi xóa bài viết", "error");
      }
    }
  };

  const handleTogglePinned = async (article) => {
    const payload = {
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.category,
      readTime: article.readTime,
      pinned: !article.pinned,
      status: article.status,
      imageUrl: article.imageUrl
    };
    try {
      await articleService.updateArticle(article.articleId, payload);
      showToast(payload.pinned ? "Đã ghim bài viết lên đầu trang!" : "Đã bỏ ghim bài viết!", "success");
      loadArticles();
    } catch (err) {
      showToast("Không thể thay đổi trạng thái ghim", "error");
    }
  };

  const handleQuickStatusChange = async (article, newStatus) => {
    const payload = {
      title: article.title,
      description: article.description,
      content: article.content,
      category: article.category,
      readTime: article.readTime,
      pinned: article.pinned,
      status: newStatus,
      imageUrl: article.imageUrl
    };
    try {
      await articleService.updateArticle(article.articleId, payload);
      showToast(`Đã chuyển trạng thái bài viết thành ${newStatus === "PUBLISHED" ? "Công khai" : newStatus === "HIDDEN" ? "Ẩn" : "Nháp"}!`, "success");
      loadArticles();
    } catch (err) {
      showToast("Không thể cập nhật trạng thái bài viết", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PUBLISHED": return "success";
      case "HIDDEN": return "warning";
      case "DRAFT": return "default";
      default: return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PUBLISHED": return "Công khai";
      case "HIDDEN": return "Ẩn";
      case "DRAFT": return "Nháp";
      default: return status;
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

  return (
    <Box sx={{ width: "100%", margin: "0 auto", px: { xs: 2, md: 4 }, display: "block" }}>
      <Stack spacing={3}>
        
        {/* HEADER */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          sx={{ mt: 2 }}
        >
          <Typography variant="h4" fontWeight={800} color="#1e293b">
            Quản lý Cẩm nang
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              borderRadius: 2.5,
              px: 3,
              py: 1.2,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1d4ed8" }
            }}
          >
            Thêm bài viết
          </Button>
        </Stack>

        {/* FILTER BAR */}
        <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap gap={2}>
            <TextField
              size="small"
              placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, minWidth: "250px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Chủ đề</InputLabel>
              <Select
                value={selectedCategory}
                label="Chủ đề"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Viết CV">Viết CV</MenuItem>
                <MenuItem value="Phỏng vấn">Phỏng vấn</MenuItem>
                <MenuItem value="Tìm việc">Tìm việc</MenuItem>
                <MenuItem value="Thương lượng lương">Thương lượng lương</MenuItem>
                <MenuItem value="Kỹ năng">Kỹ năng</MenuItem>
                <MenuItem value="Định hướng">Định hướng</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={selectedStatus}
                label="Trạng thái"
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="PUBLISHED">Công khai</MenuItem>
                <MenuItem value="HIDDEN">Ẩn</MenuItem>
                <MenuItem value="DRAFT">Nháp</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* LISTING TABLE */}
        <Paper sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>STT</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Bài viết</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Chủ đề</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Lượt xem</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Yêu thích</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>Ghim</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <CircularProgress sx={{ color: "#2563eb" }} />
                    </TableCell>
                  </TableRow>
                ) : filteredArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Typography color="#64748b">Không tìm thấy bài viết nào.</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredArticles
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((art, index) => (
                      <TableRow key={art.articleId} hover>
                        <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar 
                              src={getMediaUrl(art.imageUrl)} 
                              variant="rounded" 
                              sx={{ width: 44, height: 44, bgcolor: "#eff6ff" }}
                            />
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="subtitle2" fontWeight={700} sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {art.title}
                              </Typography>
                              <Typography variant="caption" color="#64748b" sx={{ overflow: "hidden", textOverflow: "ellipsis", display: "block", whiteSpace: "nowrap" }}>
                                {art.description}
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        
                        <TableCell>
                          <Chip label={art.category} size="small" sx={{ bgcolor: "#f1f5f9", color: "#334155", fontWeight: 600 }} />
                        </TableCell>
                        
                        <TableCell align="center">{art.viewsCount || 0}</TableCell>
                        
                        <TableCell align="center">{art.likesCount || 0}</TableCell>
                        
                        <TableCell align="center">
                          <IconButton onClick={() => handleTogglePinned(art)} sx={{ color: art.pinned ? "#ef4444" : "#94a3b8" }}>
                            {art.pinned ? <PushPinIcon /> : <PushPinOutlinedIcon />}
                          </IconButton>
                        </TableCell>
                        
                        <TableCell>
                          <FormControl size="small" variant="standard" sx={{ minWidth: 100 }}>
                            <Select
                              value={art.status}
                              onChange={(e) => handleQuickStatusChange(art, e.target.value)}
                              sx={{ 
                                fontSize: "0.85rem", 
                                fontWeight: 700,
                                color: art.status === "PUBLISHED" ? "#10b981" : art.status === "HIDDEN" ? "#f59e0b" : "#64748b"
                              }}
                            >
                              <MenuItem value="PUBLISHED" sx={{ color: "#10b981", fontWeight: 700 }}>Công khai</MenuItem>
                              <MenuItem value="HIDDEN" sx={{ color: "#f59e0b", fontWeight: 700 }}>Ẩn</MenuItem>
                              <MenuItem value="DRAFT" sx={{ color: "#64748b", fontWeight: 700 }}>Nháp</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        
                        <TableCell>{formatDate(art.createdAt)}</TableCell>
                        
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton size="small" onClick={() => handleOpenDialog(art)} sx={{ color: "#2563eb" }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => handleDelete(art.articleId)} sx={{ color: "#ef4444" }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </Box>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredArticles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Số hàng mỗi trang:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
          />
        </Paper>

        {/* DIALOG ADD/EDIT FORM */}
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
          <DialogTitle fontWeight={900} sx={{ borderBottom: "1px solid #e2e8f0", pb: 2 }}>
            {selectedArticle ? "Cập nhật bài viết" : "Thêm bài viết cẩm nang mới"}
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              
              <TextField
                fullWidth
                label="Tiêu đề bài viết"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                required
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2.5 }
                }}
              />

              <TextField
                fullWidth
                label="Mô tả ngắn (Description)"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                multiline
                rows={2}
                required
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 2.5 }
                }}
              />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Chủ đề</InputLabel>
                    <Select
                      value={formCategory}
                      label="Chủ đề"
                      onChange={(e) => setFormCategory(e.target.value)}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="Viết CV">Viết CV</MenuItem>
                      <MenuItem value="Phỏng vấn">Phỏng vấn</MenuItem>
                      <MenuItem value="Tìm việc">Tìm việc</MenuItem>
                      <MenuItem value="Thương lượng lương">Thương lượng lương</MenuItem>
                      <MenuItem value="Kỹ năng">Kỹ năng</MenuItem>
                      <MenuItem value="Định hướng">Định hướng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Thời gian đọc (ví dụ: 5 phút đọc)"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: 2.5 }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={formStatus}
                      label="Trạng thái"
                      onChange={(e) => setFormStatus(e.target.value)}
                      sx={{ borderRadius: 2.5 }}
                    >
                      <MenuItem value="PUBLISHED">Công khai (Published)</MenuItem>
                      <MenuItem value="HIDDEN">Ẩn (Hidden)</MenuItem>
                      <MenuItem value="DRAFT">Bản nháp (Draft)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* COVER IMAGE CHOOSE & UPLOAD */}
              <Box sx={{ border: "1px dashed #cbd5e1", borderRadius: 3, p: 3, bgcolor: "#f8fafc" }}>
                <Typography variant="subtitle2" fontWeight={800} color="#334155" mb={2}>
                  Ảnh bìa bài viết
                </Typography>
                
                <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
                  {imagePreview && (
                    <Card sx={{ maxWidth: 160, borderRadius: 2 }}>
                      <CardMedia
                        component="img"
                        height="90"
                        image={imagePreview}
                        alt="Preview"
                        sx={{ objectFit: "cover" }}
                      />
                    </Card>
                  )}
                  
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: "none" }}
                      id="article-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="article-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2, mr: 2 }}
                      >
                        Chọn ảnh
                      </Button>
                    </label>

                    {imageFile && (
                      <Button
                        variant="contained"
                        onClick={handleUploadImage}
                        disabled={uploadingImage}
                        sx={{ 
                          textTransform: "none", 
                          fontWeight: 700, 
                          borderRadius: 2, 
                          bgcolor: "#10b981", 
                          "&:hover": { bgcolor: "#059669" } 
                        }}
                      >
                        {uploadingImage ? "Đang tải lên..." : "Tải lên máy chủ"}
                      </Button>
                    )}
                    
                    <Typography variant="caption" display="block" color="#64748b" mt={1}>
                      Định dạng hỗ trợ: JPG, PNG, WEBP. Dung lượng tối đa: 5MB.
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    color="primary"
                  />
                }
                label="Ghim bài viết này lên nổi bật đầu trang"
              />

              <TextField
                fullWidth
                label="Nội dung bài viết (Hỗ trợ định dạng Markdown)"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                multiline
                rows={10}
                required
                placeholder="# Tiêu đề lớn&#10;## Tiêu đề nhỏ&#10;- Ý chính 1&#10;- Ý chính 2&#10;**Chữ in đậm**"
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: 3, fontFamily: "monospace" }
                }}
              />

              {/* ACTION BUTTONS */}
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outlined"
                  sx={{ borderRadius: 2, px: 3, textTransform: "none", fontWeight: 700 }}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={uploadingImage}
                  sx={{ 
                    borderRadius: 2, 
                    px: 4, 
                    textTransform: "none", 
                    fontWeight: 700, 
                    bgcolor: "#2563eb",
                    "&:hover": { bgcolor: "#1d4ed8" }
                  }}
                >
                  Lưu bài viết
                </Button>
              </Stack>

            </Box>
          </DialogContent>
        </Dialog>

      </Stack>
    </Box>
  );
}
