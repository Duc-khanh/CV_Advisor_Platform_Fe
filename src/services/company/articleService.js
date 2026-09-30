import api from "../axios";

export const articleService = {
  // Public Space API
  getArticlesPublic: async (params) => {
    const res = await api.get("/api/public/articles", { params });
    return res.data;
  },

  getTrendingArticles: async () => {
    const res = await api.get("/api/public/articles/trending");
    return res.data;
  },

  getPopularTags: async () => {
    const res = await api.get("/api/public/articles/tags");
    return res.data;
  },

  getArticleDetail: async (id) => {
    const res = await api.get(`/api/public/articles/${id}`);
    return res.data;
  },

  getComments: async (id) => {
    const res = await api.get(`/api/public/articles/${id}/comments`);
    return res.data;
  },

  // User Actions (Authenticated)
  toggleLike: async (id) => {
    const res = await api.post(`/api/user/articles/${id}/like`);
    return res.data; // returns boolean (liked status)
  },

  toggleBookmark: async (id) => {
    const res = await api.post(`/api/user/articles/${id}/bookmark`);
    return res.data; // returns boolean (bookmarked status)
  },

  addComment: async (id, content) => {
    const res = await api.post(`/api/user/articles/${id}/comment`, { content });
    return res.data;
  },

  rateArticle: async (id, ratingValue) => {
    const res = await api.post(`/api/user/articles/${id}/rate`, { ratingValue });
    return res.data; // returns new average rating
  },

  getBookmarkedArticles: async () => {
    const res = await api.get("/api/user/articles/bookmarked");
    return res.data;
  },

  // Admin Actions (Authenticated Admin)
  getArticlesAdmin: async () => {
    const res = await api.get("/api/admin/articles");
    return res.data;
  },

  createArticle: async (data) => {
    const res = await api.post("/api/admin/articles", data);
    return res.data;
  },

  updateArticle: async (id, data) => {
    const res = await api.put(`/api/admin/articles/${id}`, data);
    return res.data;
  },

  deleteArticle: async (id) => {
    const res = await api.delete(`/api/admin/articles/${id}`);
    return res.data;
  },

  uploadArticleImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/api/admin/articles/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};
