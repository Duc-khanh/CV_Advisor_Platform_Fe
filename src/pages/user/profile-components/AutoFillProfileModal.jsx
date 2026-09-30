import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stack,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Chip,
  Divider,
  Alert,
  Paper,
  Avatar,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  CloudUpload,
  AutoAwesome,
  CheckCircle,
  Close,
  Person,
  Phone,
  Email,
  Cake,
  Room,
  Language,
  Work,
  School,
  Code,
  FolderOpen,
  FilePresent,
  Refresh,
} from "@mui/icons-material";
import api from "../../../services/axios";
import { cvService } from "../../../services/user";

const STEPS = ["Chọn CV", "AI phân tích", "Xem trước & Áp dụng"];

export default function AutoFillProfileModal({ open, onClose, onApply }) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [existingCvs, setExistingCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(null);
  const [loadingCvs, setLoadingCvs] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(0);
        setMode(null);
        setUploadedFile(null);
        setSelectedCvId(null);
        setParsedData(null);
        setError("");
        setParsing(false);
      }, 300);
    }
  }, [open]);

  useEffect(() => {
    if (mode === "existing" && open) {
      setLoadingCvs(true);
      cvService
        .getUserCV()
        .then((data) => {
          const items = Array.isArray(data)
            ? data
            : data?.files || data?.cvs || data?.data || (data ? [data] : []);
          const list = Array.isArray(items) ? items : [];
          setExistingCvs(list);
          if (list.length > 0) {
            setSelectedCvId(list[0].cvId || list[0].id);
          }
        })
        .catch(() => setExistingCvs([]))
        .finally(() => setLoadingCvs(false));
    }
  }, [mode, open]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setError("");
  };

  const handleParse = async () => {
    setError("");
    setParsing(true);
    setStep(1);
    try {
      const formData = new FormData();
      if (mode === "upload" && uploadedFile) {
        formData.append("cv", uploadedFile);
      } else if (mode === "existing" && selectedCvId) {
        formData.append("cvId", selectedCvId);
      } else {
        throw new Error("Vui lòng chọn hoặc tải lên CV trước.");
      }
      const response = await api.post("/api/v1/ai/parse-profile-from-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });
      setParsedData(response.data);
      setStep(2);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Không thể phân tích CV. Vui lòng thử lại.";
      setError(msg);
      setStep(0);
    } finally {
      setParsing(false);
    }
  };

  const handleApply = async () => {
    if (!parsedData) return;
    setApplyLoading(true);
    try {
      await onApply(parsedData);
      onClose();
    } finally {
      setApplyLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={parsing || applyLoading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: "0 20px 60px rgba(2,132,199,0.15)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
          color: "#fff",
          py: 2.5,
          px: 3,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 38, height: 38 }}>
          <AutoAwesome sx={{ fontSize: 20 }} />
        </Avatar>
        <Box flex={1}>
          <Typography variant="subtitle1" fontWeight={800} sx={{ lineHeight: 1.2 }}>
            Điền hồ sơ tự động bằng AI
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            AI sẽ trích xuất thông tin từ CV của bạn
          </Typography>
        </Box>
        {!parsing && !applyLoading && (
          <IconButton onClick={onClose} sx={{ color: "#fff", opacity: 0.8 }}>
            <Close fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Stepper activeStep={step} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .MuiStepLabel-label": { fontSize: "0.72rem", fontWeight: 700 },
                  "& .MuiStepIcon-root.Mui-active": { color: "#0284c7" },
                  "& .MuiStepIcon-root.Mui-completed": { color: "#16a34a" },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <DialogContent sx={{ px: 3, pb: 1 }}>
        {step === 0 && (
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
            )}

            <Paper
              onClick={() => { setMode("upload"); setSelectedCvId(null); }}
              sx={{
                p: 2,
                borderRadius: 3,
                border: mode === "upload" ? "2px solid #0284c7" : "1.5px dashed #e2e8f0",
                cursor: "pointer",
                bgcolor: mode === "upload" ? "#f0f9ff" : "#fafbfc",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#0284c7", bgcolor: "#f0f9ff" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0284c7", width: 44, height: 44 }}>
                  <CloudUpload />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">Tải lên CV mới</Typography>
                  <Typography variant="caption" color="text.secondary">Hỗ trợ PDF (khuyên dùng), DOC, DOCX</Typography>
                </Box>
                {mode === "upload" && <CheckCircle sx={{ color: "#0284c7", fontSize: 22 }} />}
              </Stack>

              {mode === "upload" && (
                <Box mt={2}>
                  <Box
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: "2px dashed #bae6fd",
                      borderRadius: 2.5,
                      p: 2.5,
                      textAlign: "center",
                      cursor: "pointer",
                      bgcolor: "#f8feff",
                      "&:hover": { bgcolor: "#e0f2fe" },
                      transition: "0.2s",
                    }}
                  >
                    {uploadedFile ? (
                      <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
                        <FilePresent sx={{ color: "#0284c7" }} />
                        <Typography variant="body2" fontWeight={700} color="#0284c7" sx={{ wordBreak: "break-all" }}>
                          {uploadedFile.name}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                          sx={{ color: "#ef4444" }}
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Stack>
                    ) : (
                      <>
                        <CloudUpload sx={{ fontSize: 36, color: "#93c5fd", mb: 0.5 }} />
                        <Typography variant="body2" color="#64748b" fontWeight={600}>
                          Kéo thả hoặc <span style={{ color: "#0284c7", fontWeight: 800 }}>click để chọn file</span>
                        </Typography>
                      </>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Box>
                </Box>
              )}
            </Paper>

            <Paper
              onClick={() => { setMode("existing"); setUploadedFile(null); if (existingCvs.length > 0 && !selectedCvId) { setSelectedCvId(existingCvs[0].cvId || existingCvs[0].id); } }}
              sx={{
                p: 2,
                borderRadius: 3,
                border: mode === "existing" ? "2px solid #0284c7" : "1.5px dashed #e2e8f0",
                cursor: "pointer",
                bgcolor: mode === "existing" ? "#f0f9ff" : "#fafbfc",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#0284c7", bgcolor: "#f0f9ff" },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0284c7", width: 44, height: 44 }}>
                  <FolderOpen />
                </Avatar>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={800} color="#0f172a">Chọn từ CV đã đính kèm</Typography>
                  <Typography variant="caption" color="text.secondary">Dùng CV PDF bạn đã upload vào hệ thống</Typography>
                </Box>
                {mode === "existing" && <CheckCircle sx={{ color: "#0284c7", fontSize: 22 }} />}
              </Stack>

              {mode === "existing" && (
                <Box mt={2}>
                  {loadingCvs ? (
                    <Box textAlign="center" py={1.5}>
                      <CircularProgress size={24} sx={{ color: "#0284c7" }} />
                    </Box>
                  ) : existingCvs.length === 0 ? (
                    <Alert severity="info" sx={{ borderRadius: 2, fontSize: "0.78rem" }}>
                      Bạn chưa có CV nào đính kèm. Hãy thử upload CV mới.
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      {existingCvs.map((cv) => {
                        const id = cv.cvId || cv.id;
                        const isSelected = selectedCvId === id;
                        return (
                          <Box
                            key={id}
                            onClick={(e) => { e.stopPropagation(); setSelectedCvId(id); setError(""); }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: 1.2,
                              borderRadius: 2,
                              border: isSelected ? "1.5px solid #0284c7" : "1.5px solid #e2e8f0",
                              bgcolor: isSelected ? "#e0f2fe" : "#fff",
                              cursor: "pointer",
                              "&:hover": { bgcolor: "#f0f9ff" },
                              transition: "0.2s",
                            }}
                          >
                            <FilePresent sx={{ color: "#0284c7", fontSize: 20 }} />
                            <Typography variant="body2" fontWeight={700} flex={1} color="#0f172a" noWrap>
                              {cv.fileName || cv.name || ("CV #" + id)}
                            </Typography>
                            {isSelected && <CheckCircle sx={{ color: "#0284c7", fontSize: 18 }} />}
                          </Box>
                        );
                      })}
                    </Stack>
                  )}
                </Box>
              )}
            </Paper>
          </Stack>
        )}

        {step === 1 && (
          <Box textAlign="center" py={5}>
            <Avatar sx={{ width: 80, height: 80, mx: "auto", mb: 2.5, bgcolor: "#e0f2fe", color: "#0284c7" }}>
              <AutoAwesome sx={{ fontSize: 36 }} />
            </Avatar>
            <Typography variant="h6" fontWeight={800} color="#0f172a" mb={1}>AI đang phân tích CV...</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Quá trình này có thể mất 15-30 giây. Vui lòng đợi.</Typography>
            <LinearProgress
              sx={{
                maxWidth: 260, mx: "auto", borderRadius: 5, height: 6,
                bgcolor: "#e0f2fe", "& .MuiLinearProgress-bar": { bgcolor: "#0284c7" },
              }}
            />
          </Box>
        )}

        {step === 2 && parsedData && (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2, fontSize: "0.8rem" }}>
              AI đã trích xuất thành công! Kiểm tra và bấm <strong>"Áp dụng vào hồ sơ"</strong>.
            </Alert>

            <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
              <Typography variant="subtitle2" fontWeight={800} color="#0284c7" mb={1.5}>Thông tin cơ bản</Typography>
              <Stack spacing={1}>
                {[
                  { icon: <Person fontSize="small" />, label: "Họ tên", value: parsedData.fullName },
                  { icon: <Work fontSize="small" />, label: "Chức danh", value: parsedData.headline },
                  { icon: <Phone fontSize="small" />, label: "SĐT", value: parsedData.phone },
                  { icon: <Email fontSize="small" />, label: "Email", value: parsedData.email },
                  { icon: <Room fontSize="small" />, label: "Địa chỉ", value: parsedData.location },
                  { icon: <Cake fontSize="small" />, label: "Ngày sinh", value: parsedData.birthday },
                  { icon: <Language fontSize="small" />, label: "Link cá nhân", value: parsedData.personalLink },
                ].filter((f) => f.value && String(f.value).trim()).map((f, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                    <Box sx={{ color: "#64748b", mt: 0.2, minWidth: 18 }}>{f.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: "block" }}>{f.label}</Typography>
                      <Typography variant="body2" color="#0f172a" fontWeight={600} sx={{ fontSize: "0.82rem" }}>{f.value}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>

            {parsedData.bio && (
              <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Typography variant="subtitle2" fontWeight={800} color="#0284c7" mb={1}>Giới thiệu bản thân</Typography>
                <Typography variant="body2" color="#334155" sx={{ fontSize: "0.82rem", lineHeight: 1.6 }}>{parsedData.bio}</Typography>
              </Paper>
            )}

            {parsedData.skills?.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Code fontSize="small" sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" fontWeight={800} color="#0284c7">Kỹ năng ({parsedData.skills.length})</Typography>
                </Stack>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                  {parsedData.skills.map((s, i) => (
                    <Chip key={i} label={s} size="small" sx={{ bgcolor: "#f0f9ff", color: "#0284c7", fontWeight: 700, fontSize: "0.72rem" }} />
                  ))}
                </Box>
              </Paper>
            )}

            {parsedData.education?.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <School fontSize="small" sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" fontWeight={800} color="#0284c7">Học vấn ({parsedData.education.length})</Typography>
                </Stack>
                <Stack spacing={1.2} divider={<Divider />}>
                  {parsedData.education.map((edu, i) => (
                    <Box key={i}>
                      <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ fontSize: "0.83rem" }}>{edu.school}</Typography>
                      <Typography variant="caption" color="#64748b" sx={{ display: "block" }}>
                        {edu.degree}{edu.graduationDate ? (" • " + edu.graduationDate) : ""}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {parsedData.experience?.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <Work fontSize="small" sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" fontWeight={800} color="#0284c7">Kinh nghiệm ({parsedData.experience.length})</Typography>
                </Stack>
                <Stack spacing={1.2} divider={<Divider />}>
                  {parsedData.experience.map((exp, i) => (
                    <Box key={i}>
                      <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ fontSize: "0.83rem" }}>{exp.title}</Typography>
                      <Typography variant="caption" color="#64748b" sx={{ display: "block" }}>
                        {exp.company}{exp.startDate ? (" • " + exp.startDate + " - " + (exp.endDate || "Hiện tại")) : ""}
                      </Typography>
                      {exp.description && (
                        <Typography variant="caption" color="#475569" sx={{ display: "block", mt: 0.3, lineHeight: 1.5 }}>
                          {exp.description.length > 120 ? exp.description.slice(0, 120) + "..." : exp.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {parsedData.projects?.length > 0 && (
              <Paper sx={{ p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                  <FolderOpen fontSize="small" sx={{ color: "#0284c7" }} />
                  <Typography variant="subtitle2" fontWeight={800} color="#0284c7">Dự án ({parsedData.projects.length})</Typography>
                </Stack>
                <Stack spacing={1.2} divider={<Divider />}>
                  {parsedData.projects.map((proj, i) => (
                    <Box key={i}>
                      <Typography variant="body2" fontWeight={800} color="#0f172a" sx={{ fontSize: "0.83rem" }}>{proj.name}</Typography>
                      {proj.technologies && (
                        <Typography variant="caption" color="#64748b" sx={{ display: "block" }}>{proj.technologies}</Typography>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f1f5f9", gap: 1 }}>
        {step === 0 && (
          <>
            <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}>Hủy</Button>
            <Button
              variant="contained"
              disabled={
                !mode ||
                (mode === "upload" && !uploadedFile) ||
                (mode === "existing" && !selectedCvId)
              }
              onClick={handleParse}
              startIcon={<AutoAwesome />}
              sx={{
                bgcolor: "#0284c7", textTransform: "none", fontWeight: 800,
                borderRadius: 2.5, px: 3, "&:hover": { bgcolor: "#0369a1" },
              }}
            >
              Bắt đầu phân tích
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <Button
              onClick={() => { setStep(0); setParsedData(null); setError(""); }}
              startIcon={<Refresh />}
              sx={{ textTransform: "none", color: "#64748b", fontWeight: 700 }}
            >
              Thử lại
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              disabled={applyLoading}
              startIcon={applyLoading ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
              sx={{
                bgcolor: "#16a34a", textTransform: "none", fontWeight: 800,
                borderRadius: 2.5, px: 3, "&:hover": { bgcolor: "#15803d" },
              }}
            >
              {applyLoading ? "Đang áp dụng..." : "Áp dụng vào hồ sơ"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
