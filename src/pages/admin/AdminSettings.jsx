import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  RadioGroup,
  Radio,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  Cpu,
  FolderArchive,
  ShieldCheck,
  Mail,
  Sliders,
  Sparkles,
  Save,
  RotateCcw,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";
import api from "../../services/axios";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [settings, setSettings] = useState({
    ai: {
      strategy: "free_first",
      primaryFreeModel: "meta-llama/llama-3.3-70b-instruct:free",
      fallbackModel: "google/gemini-1.5-flash",
      temperature: 0.4,
      topP: 0.9,
      maxTokens: 4096,
      safetyLevel: "BLOCK_LOW",
      autoFallbackOnQuota: true,
      availableFreeModels: [
        { id: "meta-llama/llama-3.3-70b-instruct:free", name: "Meta LLaMA 3.3 70B (Miễn phí - Rất thông minh)", provider: "Meta / OpenRouter" },
        { id: "google/gemma-2-9b-it:free", name: "Google Gemma 2 9B (Miễn phí - Phản hồi siêu tốc)", provider: "Google / OpenRouter" },
        { id: "deepseek/deepseek-r1:free", name: "DeepSeek R1 Reasoning (Miễn phí - Suy luận sâu)", provider: "DeepSeek / OpenRouter" },
        { id: "qwen/qwen-2.5-72b-instruct:free", name: "Qwen 2.5 72B (Miễn phí - Đa ngôn ngữ)", provider: "Alibaba / OpenRouter" },
        { id: "mistralai/mistral-7b-instruct:free", name: "Mistral 7B Instruct (Miễn phí)", provider: "Mistral AI" }
      ]
    },
    storage: {
      maxCvFileSizeMb: 10,
      maxAvatarFileSizeMb: 3,
      allowedExtensions: [".pdf", ".docx", ".doc"],
      storagePath: "uploads/cv",
      autoCleanupDays: 90
    },
    security: {
      jwtExpirationHours: 24,
      passwordMinLength: 8,
      requireSpecialChar: false,
      maxLoginAttempts: 5,
      lockoutDurationMinutes: 15
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      senderName: "CV Advisor Platform",
      senderEmail: "no-reply@cvadvisor.vn",
      notifyCandidateOnApply: true,
      notifyHrOnNewCandidate: true,
      notifyOnAccountAction: true
    },
    general: {
      platformName: "CV Advisor Platform",
      supportEmail: "support@cvadvisor.vn",
      hotline: "1900 6868",
      maintenanceMode: false,
      maintenanceMessage: "Hệ thống đang tiến hành nâng cấp hạ tầng định kỳ. Xin quý khách vui lòng quay lại sau ít phút!"
    }
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/settings");
      if (res && res.data) {
        setSettings((prev) => ({
          ...prev,
          ...res.data,
          ai: { ...prev.ai, ...(res.data.ai || {}) },
          storage: { ...prev.storage, ...(res.data.storage || {}) },
          security: { ...prev.security, ...(res.data.security || {}) },
          email: { ...prev.email, ...(res.data.email || {}) },
          general: { ...prev.general, ...(res.data.general || {}) },
        }));
      }
    } catch (err) {
      console.error("Lỗi khi tải cài đặt hệ thống:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.post("/api/admin/settings", settings);
      setSnackbar({ open: true, message: "Đã lưu toàn bộ cấu hình hệ thống thành công!", severity: "success" });
    } catch (err) {
      console.error("Lỗi khi lưu cài đặt:", err);
      setSnackbar({ open: true, message: "Lỗi khi lưu cài đặt: " + (err.response?.data?.message || err.message), severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTestAi = async () => {
    try {
      setTestingAi(true);
      setTestResult(null);
      const modelToTest = settings.ai.strategy === "gemini_only"
        ? settings.ai.fallbackModel
        : settings.ai.primaryFreeModel;

      const res = await api.post("/api/admin/settings/test-ai", { model: modelToTest });
      if (res && res.data) {
        setTestResult(res.data);
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.response?.data?.message || err.message,
        latencyMs: 0
      });
    } finally {
      setTestingAi(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Tiêu đề & Các nút thao tác */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}
          >
            Cài Đặt Hệ Thống & Cấu Hình Tham Số
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Kiểm soát mô hình AI, kết hợp mô hình miễn phí, hạn mức tệp và chính sách bảo mật.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            onClick={fetchSettings}
            disabled={loading || saving}
            startIcon={<RotateCcw size={16} />}
            sx={{
              borderRadius: "10px",
              borderColor: "#e2e8f0",
              color: "#334155",
              bgcolor: "#fff",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
            }}
          >
            Khôi phục
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || saving}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
            sx={{
              borderRadius: "10px",
              bgcolor: "#2563eb",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </Stack>
      </Stack>

      {/* Banner Khuyến nghị AI Hybrid */}
      <Alert
        severity="info"
        icon={<Sparkles size={20} color="#2563eb" />}
        sx={{
          mb: 3,
          borderRadius: "14px",
          bgcolor: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1e40af",
          "& .MuiAlert-message": { fontSize: "0.9rem" },
        }}
      >
        <b>Chiến lược kết hợp AI Tiết kiệm chi phí:</b> Hệ thống mặc định ưu tiên sử dụng các mô hình AI mã nguồn mở <b>Miễn phí 100% (0đ)</b> như <i>LLaMA 3.3 70B, Gemma 2 9B, DeepSeek R1</i>. Khi chạm giới hạn Rate Limit hoặc gặp lỗi, hệ thống tự động chuyển tiếp (Fallback) sang <b>Google Gemini 1.5 Flash</b>, đảm bảo tính liên tục 24/7 mà không tốn chi phí vô ích!
      </Alert>

      {/* Navigation Tabs */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #f1f5f9",
          bgcolor: "#fff",
          mb: 3,
          p: 0.5,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              minHeight: 48,
              borderRadius: "12px",
              color: "#64748b",
              "&.Mui-selected": {
                color: "#2563eb",
                bgcolor: "#eff6ff",
              },
            },
            "& .MuiTabs-indicator": { display: "none" },
          }}
        >
          <Tab icon={<Cpu size={18} />} iconPosition="start" label="Cấu hình AI & Hybrid Fallback" />
          <Tab icon={<FolderArchive size={18} />} iconPosition="start" label="Hồ Sơ & Lưu Trữ CV" />
          <Tab icon={<ShieldCheck size={18} />} iconPosition="start" label="Bảo Mật & Xác Thực" />
          <Tab icon={<Mail size={18} />} iconPosition="start" label="Email & Thông Báo" />
          <Tab icon={<Sliders size={18} />} iconPosition="start" label="Chung & Bảo Trì" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={40} />
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: "16px",
            border: "1px solid #f1f5f9",
            bgcolor: "#fff",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
          }}
        >
          {/* TAB 0: CẤU HÌNH AI & HYBRID FALLBACK */}
          {activeTab === 0 && (
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
                  Chiến Lược Điều Phối AI Engine
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
                  Lựa chọn cách thức kết hợp giữa các mô hình miễn phí và mô hình Gemini thương mại.
                </Typography>

                <RadioGroup
                  value={settings.ai.strategy}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      ai: { ...settings.ai, strategy: e.target.value },
                    })
                  }
                >
                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1.5,
                      borderRadius: "12px",
                      borderColor: settings.ai.strategy === "free_first" ? "#2563eb" : "#e2e8f0",
                      bgcolor: settings.ai.strategy === "free_first" ? "#eff6ff" : "#fff",
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                      <FormControlLabel
                        value="free_first"
                        control={<Radio color="primary" />}
                        label={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              🌟 Ưu tiên mô hình Free (0đ) → Tự động Fallback sang Gemini khi hết lượt (Khuyên dùng)
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              Tiết kiệm 95% chi phí. Dùng model mã nguồn mở miễn phí trước, khi lỗi hoặc quá tải (Rate limit) sẽ tự chuyển sang Gemini 1.5 Flash.
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      mb: 1.5,
                      borderRadius: "12px",
                      borderColor: settings.ai.strategy === "gemini_only" ? "#2563eb" : "#e2e8f0",
                      bgcolor: settings.ai.strategy === "gemini_only" ? "#eff6ff" : "#fff",
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                      <FormControlLabel
                        value="gemini_only"
                        control={<Radio color="primary" />}
                        label={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              Chỉ sử dụng Google Gemini 1.5 Flash (Độ ổn định cao nhất)
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              Tất cả các tác vụ đều gọi trực tiếp Google Gemini chính thống, thời gian phản hồi siêu tốc.
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>

                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: "12px",
                      borderColor: settings.ai.strategy === "free_only" ? "#2563eb" : "#e2e8f0",
                      bgcolor: settings.ai.strategy === "free_only" ? "#eff6ff" : "#fff",
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
                      <FormControlLabel
                        value="free_only"
                        control={<Radio color="primary" />}
                        label={
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                              Chỉ sử dụng các mô hình Miễn phí (Tiết kiệm 100% ngân sách)
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#64748b" }}>
                              Hoàn toàn không mất chi phí API, tự động luân phiên giữa các model free (LLaMA 3.3, Gemma 2, DeepSeek).
                            </Typography>
                          </Box>
                        }
                      />
                    </CardContent>
                  </Card>
                </RadioGroup>
              </Box>

              <Divider />

              {/* Lựa chọn Models */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="free-model-label">Mô hình Miễn phí Chính (Primary Free Model)</InputLabel>
                    <Select
                      labelId="free-model-label"
                      value={settings.ai.primaryFreeModel}
                      label="Mô hình Miễn phí Chính (Primary Free Model)"
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ai: { ...settings.ai, primaryFreeModel: e.target.value },
                        })
                      }
                      sx={{ borderRadius: "10px" }}
                    >
                      {(settings.ai.availableFreeModels || []).map((m) => (
                        <MenuItem key={m.id} value={m.id}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{m.name}</Typography>
                            <Typography variant="caption" sx={{ color: "#94a3b8" }}>{m.id} • {m.provider}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="fallback-model-label">Mô hình Dự phòng (Fallback Model)</InputLabel>
                    <Select
                      labelId="fallback-model-label"
                      value={settings.ai.fallbackModel}
                      label="Mô hình Dự phòng (Fallback Model)"
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ai: { ...settings.ai, fallbackModel: e.target.value },
                        })
                      }
                      sx={{ borderRadius: "10px" }}
                    >
                      <MenuItem value="google/gemini-1.5-flash">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Google Gemini 1.5 Flash (Khuyên dùng)</Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>Tốc độ cao, chi phí thấp, context 1M</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="google/gemini-2.0-flash-lite">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Google Gemini 2.0 Flash Lite</Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>Model mới nhất, độ trễ cực thấp</Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem value="google/gemini-1.5-pro">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>Google Gemini 1.5 Pro</Typography>
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>Phân tích chuyên sâu cho bài toán khó</Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Nút kiểm tra AI trực tiếp */}
              <Box sx={{ p: 2.5, bgcolor: "#f8fafc", borderRadius: "14px", border: "1px solid #e2e8f0" }}>
                <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Kiểm Tra Kết Nối Mô Hình AI Trực Tiếp
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Gửi một yêu cầu thử nghiệm thực tế đến mô hình đang chọn để đo độ trễ và kiểm tra tính khả dụng.
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={handleTestAi}
                    disabled={testingAi}
                    startIcon={testingAi ? <CircularProgress size={16} /> : <Zap size={16} />}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: "#2563eb",
                      color: "#2563eb",
                      bgcolor: "#fff",
                    }}
                  >
                    {testingAi ? "Đang gửi request..." : "Kiểm tra kết nối ngay"}
                  </Button>
                </Stack>

                {testResult && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: testResult.success ? "#ecfdf5" : "#fef2f2", borderRadius: "10px", border: testResult.success ? "1px solid #a7f3d0" : "1px solid #fecaca" }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      {testResult.success ? <CheckCircle size={18} color="#059669" /> : <AlertCircle size={18} color="#dc2626" />}
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: testResult.success ? "#065f46" : "#991b1b" }}>
                        {testResult.success ? "Kiểm tra thành công!" : "Kiểm tra thất bại!"}
                      </Typography>
                      {testResult.latencyMs > 0 && (
                        <Chip label={`${testResult.latencyMs}ms`} size="small" color={testResult.success ? "success" : "error"} sx={{ fontWeight: 700 }} />
                      )}
                    </Stack>
                    <Typography variant="body2" sx={{ color: testResult.success ? "#047857" : "#b91c1c", fontSize: "0.85rem" }}>
                      {testResult.sampleResponse || testResult.message}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Tinh chỉnh tham số sinh AI */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mb: 2 }}>
                  Tham Số Sinh Nội Dung (Hyperparameters)
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#334155", mb: 1 }}>
                      Temperature: {settings.ai.temperature} (Độ sáng tạo / Nhất quán)
                    </Typography>
                    <Slider
                      value={settings.ai.temperature}
                      min={0.0}
                      max={1.0}
                      step={0.05}
                      valueLabelDisplay="auto"
                      onChange={(e, val) =>
                        setSettings({ ...settings, ai: { ...settings.ai, temperature: val } })
                      }
                      sx={{ color: "#2563eb" }}
                    />
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      💡 Khuyên dùng <b>0.4</b> để nhận xét đánh giá CV khách quan, tránh ảo giác.
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Max Output Tokens"
                      type="number"
                      value={settings.ai.maxTokens}
                      onChange={(e) =>
                        setSettings({ ...settings, ai: { ...settings.ai, maxTokens: parseInt(e.target.value) || 4096 } })
                      }
                      helperText="Giới hạn độ dài tối đa của phản hồi AI (Mặc định 4096)"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Stack>
          )}

          {/* TAB 1: HỒ SƠ & LƯU TRỮ CV */}
          {activeTab === 1 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Giới Hạn Tệp Tin & Lưu Trữ Hồ Sơ
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Dung lượng tối đa file CV (MB)"
                    type="number"
                    value={settings.storage.maxCvFileSizeMb}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storage: { ...settings.storage, maxCvFileSizeMb: parseInt(e.target.value) || 10 },
                      })
                    }
                    helperText="Khuyên dùng 10MB để ứng viên tải tệp PDF/Docx chứa portfolio"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Dung lượng ảnh đại diện / Logo (MB)"
                    type="number"
                    value={settings.storage.maxAvatarFileSizeMb}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storage: { ...settings.storage, maxAvatarFileSizeMb: parseInt(e.target.value) || 3 },
                      })
                    }
                    helperText="Giới hạn tệp ảnh tải lên cho Avatar và Logo công ty"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Thư mục lưu trữ (Storage Path)"
                    value={settings.storage.storagePath}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storage: { ...settings.storage, storagePath: e.target.value },
                      })
                    }
                    helperText="Đường dẫn lưu file trên máy chủ hoặc bucket"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tự động dọn dẹp file tạm (Ngày)"
                    type="number"
                    value={settings.storage.autoCleanupDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        storage: { ...settings.storage, autoCleanupDays: parseInt(e.target.value) || 90 },
                      })
                    }
                    helperText="Tự động xóa các file CV bị từ chối hoặc quá thời hạn"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* TAB 2: BẢO MẬT & XÁC THỰC */}
          {activeTab === 2 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Chính Sách Bảo Mật & Phiên Đăng Nhập
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Thời hạn sống của JWT Token (Giờ)"
                    type="number"
                    value={settings.security.jwtExpirationHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, jwtExpirationHours: parseInt(e.target.value) || 24 },
                      })
                    }
                    helperText="Thời gian phiên đăng nhập duy trì trước khi cần đăng nhập lại"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Độ dài mật khẩu tối thiểu"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, passwordMinLength: parseInt(e.target.value) || 8 },
                      })
                    }
                    helperText="Độ dài ký tự bắt buộc khi người dùng đổi hoặc tạo mật khẩu"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Số lần đăng nhập sai tối đa"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) || 5 },
                      })
                    }
                    helperText="Chống tấn công Brute-force: Khóa tạm sau số lần nhập sai"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Thời gian khóa tạm (Phút)"
                    type="number"
                    value={settings.security.lockoutDurationMinutes}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, lockoutDurationMinutes: parseInt(e.target.value) || 15 },
                      })
                    }
                    helperText="Thời gian tài khoản phải đợi trước khi được thử lại"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* TAB 3: EMAIL & THÔNG BÁO */}
          {activeTab === 3 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Máy Chủ Gửi Mail (SMTP) & Luồng Thông Báo Tự Động
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="SMTP Host"
                    value={settings.email.smtpHost}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, smtpHost: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="SMTP Port"
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, smtpPort: parseInt(e.target.value) || 587 } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tên hiển thị người gửi"
                    value={settings.email.senderName}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, senderName: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email gửi đi (Sender Email)"
                    value={settings.email.senderEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, email: { ...settings.email, senderEmail: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 1.5 }}>
                  Bật / Tắt Các Email Thông Báo Tự Động
                </Typography>
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.email.notifyCandidateOnApply}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: { ...settings.email, notifyCandidateOnApply: e.target.checked },
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Gửi email xác nhận ngay khi ứng viên nộp CV ứng tuyển thành công"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.email.notifyHrOnNewCandidate}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: { ...settings.email, notifyHrOnNewCandidate: e.target.checked },
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Gửi email cho nhà tuyển dụng (HR) khi có hồ sơ ứng tuyển mới vào công việc"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.email.notifyOnAccountAction}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            email: { ...settings.email, notifyOnAccountAction: e.target.checked },
                          })
                        }
                        color="primary"
                      />
                    }
                    label="Gửi email thông báo khi tài khoản được kích hoạt, duyệt doanh nghiệp hoặc đổi mật khẩu"
                  />
                </Stack>
              </Box>
            </Stack>
          )}

          {/* TAB 4: CHUNG & BẢO TRÌ */}
          {activeTab === 4 && (
            <Stack spacing={3}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Thông Tin Nền Tảng & Chế Độ Bảo Trì Hệ Thống
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Tên nền tảng"
                    value={settings.general.platformName}
                    onChange={(e) =>
                      setSettings({ ...settings, general: { ...settings.general, platformName: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Hotline hỗ trợ"
                    value={settings.general.hotline}
                    onChange={(e) =>
                      setSettings({ ...settings, general: { ...settings.general, hotline: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email liên hệ / hỗ trợ"
                    value={settings.general.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, general: { ...settings.general, supportEmail: e.target.value } })
                    }
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                  />
                </Grid>
              </Grid>

              <Divider />

              <Box sx={{ p: 2.5, bgcolor: settings.general.maintenanceMode ? "#fffbeb" : "#f8fafc", borderRadius: "14px", border: settings.general.maintenanceMode ? "1px solid #fde68a" : "1px solid #e2e8f0" }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.general.maintenanceMode}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, maintenanceMode: e.target.checked },
                        })
                      }
                      color="warning"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: settings.general.maintenanceMode ? "#b45309" : "#1e293b" }}>
                        Kích hoạt Chế độ Bảo trì (Maintenance Mode)
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        Khi bật: Người dùng và nhà tuyển dụng sẽ thấy thông báo bảo trì, chỉ tài khoản Admin mới đăng nhập được.
                      </Typography>
                    </Box>
                  }
                />

                {settings.general.maintenanceMode && (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Nội dung thông báo bảo trì hiển thị cho người dùng"
                      value={settings.general.maintenanceMessage}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: { ...settings.general, maintenanceMessage: e.target.value },
                        })
                      }
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>
                )}
              </Box>
            </Stack>
          )}
        </Paper>
      )}

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: "10px", fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
