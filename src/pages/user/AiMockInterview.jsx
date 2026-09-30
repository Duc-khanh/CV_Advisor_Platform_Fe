import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  TextField,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Sparkles,
  Cpu,
  Mic,
  MicOff,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Award,
  ChevronRight,
  ChevronLeft,
  FileText,
  Upload,
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert,
  Zap,
  Copy,
  Check,
  MessageSquare,
  Target,
  UserCheck,
  Flame,
  BarChart3,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { generateAiInterview, evaluateAiInterview } from "../../services/ai/aiService";
import { useToast } from "../../contexts/ToastContext";

const MotionBox = motion(Box);

const LEVELS = [
  "Thực tập / Mới tốt nghiệp",
  "Junior (1 - 2 năm)",
  "Mid-Level (2 - 4 năm)",
  "Senior (4 - 7 năm)",
  "Lead / Quản lý",
];

const INTERVIEW_TYPES = [
  { id: "technical", label: "Chuyên môn & Kỹ thuật", desc: "Đào sâu công nghệ, kiến trúc và xử lý bài toán thực tế" },
  { id: "star", label: "Tình huống hành vi (STAR)", desc: "Xử lý xung đột, giao tiếp và kỹ năng giải quyết vấn đề" },
  { id: "general", label: "Phỏng vấn tổng hợp", desc: "Cân bằng giữa kỹ năng cứng và độ phù hợp văn hóa" },
  { id: "english", label: "Phỏng vấn tiếng Anh", desc: "Đánh giá phản xạ giao tiếp chuyên nghiệp bằng tiếng Anh" },
];

// Helper trích xuất phần trăm từ chuỗi STAR (VD: "85% - Bối cảnh rõ ràng..." -> 85)
const extractPercentage = (str, fallback = 80) => {
  if (!str) return fallback;
  const match = str.match(/(\d{1,3})\s*%/);
  if (match) {
    const val = parseInt(match[1], 10);
    return isNaN(val) ? fallback : Math.min(100, Math.max(0, val));
  }
  return fallback;
};

// Clean text khỏi các ký tự rác như <unk>
const cleanCandidateText = (text) => {
  if (!text) return "";
  return text.replace(/<unk>/gi, "").replace(/\s+/g, " ").trim();
};

export default function AiMockInterview() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showToast = useToast();

  // Phase: 'setup' | 'interview' | 'evaluating' | 'result'
  const [phase, setPhase] = useState("setup");

  // Setup Form State
  const [cvFile, setCvFile] = useState(null);
  const [targetRole, setTargetRole] = useState(searchParams.get("role") || "");
  const [jobDescription, setJobDescription] = useState(searchParams.get("jd") || "");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (2 - 4 năm)");
  const [interviewType, setInterviewType] = useState("Chuyên môn & Kỹ thuật");
  const [questionCount, setQuestionCount] = useState(5);
  const [isInitializing, setIsInitializing] = useState(false);

  // Interview Session State
  const [session, setSession] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // [{ questionId, question, category, userAnswer }]
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Voice Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const baseAnswerRef = useRef("");

  // Validation States
  const [inputError, setInputError] = useState("");
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [unansweredList, setUnansweredList] = useState([]);

  // Evaluation Result State
  const [evaluation, setEvaluation] = useState(null);
  const [selectedQuestionTab, setSelectedQuestionTab] = useState("all");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Timer interval effect
  useEffect(() => {
    let interval = null;
    if (phase === "interview") {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Setup Web Speech API (Đã khắc phục hoàn toàn lỗi lặp chuỗi và token <unk>)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = interviewType === "Phỏng vấn tiếng Anh" ? "en-US" : "vi-VN";

      recognition.onresult = (event) => {
        let finalChunk = "";
        let interimChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || "";
          if (item.isFinal) {
            finalChunk += text + " ";
          } else {
            interimChunk += text;
          }
        }

        const combined = (baseAnswerRef.current + " " + finalChunk + interimChunk)
          .replace(/<unk>/gi, "")
          .replace(/\s+/g, " ")
          .trim();

        setCurrentAnswer(combined);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [interviewType]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToast("Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng dùng Chrome hoặc Edge!", "warning");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      baseAnswerRef.current = cleanCandidateText(currentAnswer);
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast("Đang lắng nghe... Hãy trả lời to và rõ ràng!", "info");
      } catch (err) {
        console.error(err);
      }
    }
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  // 1. Handle Start Interview
  const handleStartInterview = async () => {
    if (!targetRole.trim() && !cvFile) {
      showToast("Vui lòng nhập vị trí ứng tuyển hoặc tải lên CV của bạn!", "warning");
      return;
    }

    setIsInitializing(true);
    try {
      const res = await generateAiInterview(
        cvFile,
        targetRole.trim() || "Chuyên viên chuyên môn",
        jobDescription.trim(),
        experienceLevel,
        interviewType,
        questionCount
      );

      if (!res.questions || res.questions.length === 0) {
        throw new Error("Không nhận được câu hỏi từ AI");
      }

      setSession(res);
      setCurrentIndex(0);
      setCurrentAnswer("");
      baseAnswerRef.current = "";
      setTimerSeconds(0);

      const initialAnswers = res.questions.map((q) => ({
        questionId: q.id,
        question: q.question,
        category: q.category,
        userAnswer: "",
      }));
      setAnswers(initialAnswers);

      setPhase("interview");
      showToast("Buổi phỏng vấn đã bắt đầu! Chúc bạn thể hiện thật tốt.", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "Không thể khởi tạo buổi phỏng vấn. Vui lòng thử lại!", "error");
    } finally {
      setIsInitializing(false);
    }
  };

  // 2. Chuyển sang câu hỏi tiếp theo
  const handleNextQuestion = (skipValidation = false) => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const cleaned = cleanCandidateText(currentAnswer);

    // Kiểm tra nếu chưa nhập gì mà không bấm bỏ qua
    if (!skipValidation && (!cleaned || cleaned.trim().length < 5)) {
      setInputError("Vui lòng nhập hoặc nói câu trả lời của bạn trước khi sang câu tiếp theo!");
      showToast("Vui lòng trả lời câu hỏi này trước khi chuyển tiếp!", "warning");
      return;
    }

    setInputError("");
    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: cleaned,
    };
    setAnswers(updated);

    if (currentIndex < session.questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCurrentAnswer(updated[nextIdx]?.userAnswer || "");
      baseAnswerRef.current = updated[nextIdx]?.userAnswer || "";
      setShowHint(false);
    }
  };

  // 3. Quay lại câu hỏi trước
  const handlePrevQuestion = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    setInputError("");
    const cleaned = cleanCandidateText(currentAnswer);
    const updated = [...answers];
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: cleaned,
    };
    setAnswers(updated);

    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setCurrentAnswer(updated[prevIdx]?.userAnswer || "");
      baseAnswerRef.current = updated[prevIdx]?.userAnswer || "";
      setShowHint(false);
    }
  };

  // 4. Submit all answers for evaluation
  const handleSubmitInterview = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const cleaned = cleanCandidateText(currentAnswer);
    const finalAnswers = [...answers];
    finalAnswers[currentIndex] = {
      ...finalAnswers[currentIndex],
      userAnswer: cleaned,
    };
    setAnswers(finalAnswers);

    // TÌM TẤT CẢ CÁC CÂU HỎI CHƯA TRẢ LỜI
    const missing = [];
    for (let i = 0; i < finalAnswers.length; i++) {
      const ans = finalAnswers[i]?.userAnswer;
      if (!ans || ans.trim().length < 5) {
        missing.push({
          index: i + 1,
          question: finalAnswers[i]?.question || session.questions[i]?.question,
        });
      }
    }

    // NẾU CÓ CÂU CHƯA TRẢ LỜI: HIỆN MODAL CẢNH BÁO TRỰC TIẾP
    if (missing.length > 0) {
      setUnansweredList(missing);
      setValidationModalOpen(true);
      return;
    }

    // Nếu đã hoàn thành đầy đủ tất cả câu hỏi
    executeEvaluation(finalAnswers);
  };

  const executeEvaluation = async (finalAnswers) => {
    setValidationModalOpen(false);
    setPhase("evaluating");
    window.scrollTo({ top: 0, behavior: "smooth" });

    try {
      const res = await evaluateAiInterview(
        session.targetRole || targetRole,
        session.experienceLevel || experienceLevel,
        finalAnswers
      );
      setEvaluation(res);
      setPhase("result");
      showToast("Đã hoàn tất đánh giá phỏng vấn!", "success");
    } catch (err) {
      console.error(err);
      showToast("Không thể đánh giá kết quả. Vui lòng thử lại!", "error");
      setPhase("interview");
    }
  };

  // Copy model answer helper
  const handleCopyModelAnswer = (text, index) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    showToast("Đã sao chép câu trả lời mẫu điểm 10 vào bộ nhớ đệm!", "success");
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2500);
  };

  return (
    <Box sx={{ minHeight: "90vh", py: { xs: 4, md: 6 }, bgcolor: "#ffffff", position: "relative" }}>
      {/* Background Tech Glows */}
      <Box
        sx={{
          position: "absolute",
          top: "2%",
          right: "8%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          left: "5%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, rgba(2, 132, 199, 0.03) 50%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* ======================================================== */}
        {/* PHASE 1: SETUP BUỔI PHỎNG VẤN */}
        {/* ======================================================== */}
        {phase === "setup" && (
          <MotionBox initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Box sx={{ textAlign: "center", maxWidth: 750, mx: "auto", mb: 5 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.6,
                  borderRadius: "20px",
                  bgcolor: "rgba(2, 132, 199, 0.08)",
                  color: "#0284c7",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  mb: 2,
                }}
              >
                <Sparkles size={16} />
                <span>AI Interview Simulator · Chuẩn Phương Pháp STAR</span>
              </Box>

              <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", mb: 2 }}>
                Luyện Phỏng Vấn Với{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Trí Tuệ Nhân Tạo
                </Box>
              </Typography>

              <Typography sx={{ color: "#64748b", fontSize: "1.05rem", lineHeight: 1.6 }}>
                Mô phỏng chân thực quy trình phỏng vấn của nhà tuyển dụng. Nhận diện giọng nói theo thời gian thực và nhận ngay báo cáo đánh giá chuyên sâu kèm câu trả lời mẫu điểm 10.
              </Typography>
            </Box>

            {/* Setup Form Container */}
            <Box
              sx={{
                maxWidth: 900,
                mx: "auto",
                bgcolor: "#ffffff",
                borderRadius: "28px",
                p: { xs: 3, md: 5 },
                boxShadow: "0 20px 45px -15px rgba(2, 132, 199, 0.08), 0 8px 25px -5px rgba(15, 23, 42, 0.04)",
              }}
            >
              <Grid container spacing={4}>
                {/* Cột trái: Tải CV & Vị trí */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={3}>
                    {/* Tải CV */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1 }}>
                        1. Tải lên CV của bạn (Tùy chọn)
                      </Typography>
                      <Typography sx={{ color: "#64748b", fontSize: "0.8rem", mb: 1.5 }}>
                        AI sẽ soi chiếu từng dự án và công nghệ trong CV để đặt câu hỏi sát thực tế nhất.
                      </Typography>

                      <Box
                        component="label"
                        sx={{
                          border: "2px dashed #cbd5e1",
                          borderRadius: "18px",
                          p: 3,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          bgcolor: cvFile ? "rgba(2, 132, 199, 0.03)" : "#f8fafc",
                          transition: "all 0.2s",
                          "&:hover": { borderColor: "#0284c7", bgcolor: "rgba(2, 132, 199, 0.03)" },
                        }}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          hidden
                          onChange={(e) => {
                            if (e.target.files?.[0]) setCvFile(e.target.files[0]);
                          }}
                        />
                        {cvFile ? (
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <FileText size={24} className="text-sky-600" />
                            <Box>
                              <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.9rem" }}>
                                {cvFile.name}
                              </Typography>
                              <Typography sx={{ color: "#10b981", fontSize: "0.75rem", fontWeight: 700 }}>
                                Đã nạp CV thành công ✓
                              </Typography>
                            </Box>
                          </Stack>
                        ) : (
                          <>
                            <Upload size={24} className="text-slate-400 mb-2" />
                            <Typography sx={{ fontWeight: 700, color: "#334155", fontSize: "0.88rem" }}>
                              Bấm để chọn file PDF CV
                            </Typography>
                            <Typography sx={{ color: "#94a3b8", fontSize: "0.75rem" }}>
                              Hỗ trợ định dạng .pdf (Tối đa 10MB)
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Vị trí ứng tuyển */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1 }}>
                        2. Vị trí công việc mục tiêu <Box component="span" sx={{ color: "#ef4444" }}>*</Box>
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="VD: Senior Backend Engineer (Java / Spring), Chuyên viên Digital Marketing..."
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "14px",
                            bgcolor: "#f8fafc",
                            fontSize: "0.92rem",
                          },
                        }}
                      />
                    </Box>

                    {/* Mô tả công việc (JD) */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1 }}>
                        3. Mô tả công việc / Yêu cầu tuyển dụng (JD)
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        placeholder="Dán nội dung JD hoặc yêu cầu cụ thể của công ty bạn sắp phỏng vấn..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "14px",
                            bgcolor: "#f8fafc",
                            fontSize: "0.92rem",
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Grid>

                {/* Cột phải: Cấp bậc & Loại phỏng vấn */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={3}>
                    {/* Cấp bậc */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1.2 }}>
                        4. Cấp bậc kinh nghiệm của bạn
                      </Typography>
                      <Grid container spacing={1.5}>
                        {LEVELS.map((lvl) => (
                          <Grid key={lvl} size={{ xs: 6 }}>
                            <Box
                              onClick={() => setExperienceLevel(lvl)}
                              sx={{
                                p: 1.5,
                                borderRadius: "14px",
                                bgcolor: experienceLevel === lvl ? "rgba(2, 132, 199, 0.08)" : "#f8fafc",
                                border: experienceLevel === lvl ? "1.5px solid #0284c7" : "1.5px solid transparent",
                                cursor: "pointer",
                                textAlign: "center",
                                fontWeight: 750,
                                color: experienceLevel === lvl ? "#0284c7" : "#334155",
                                fontSize: "0.82rem",
                                transition: "all 0.15s",
                                "&:hover": { bgcolor: "rgba(2, 132, 199, 0.05)" },
                              }}
                            >
                              {lvl}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>

                    {/* Hình thức phỏng vấn */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1.2 }}>
                        5. Mục tiêu phỏng vấn
                      </Typography>
                      <Stack spacing={1.2}>
                        {INTERVIEW_TYPES.map((type) => {
                          const isSel = interviewType === type.label;
                          return (
                            <Box
                              key={type.id}
                              onClick={() => setInterviewType(type.label)}
                              sx={{
                                p: 2,
                                borderRadius: "16px",
                                bgcolor: isSel ? "rgba(2, 132, 199, 0.06)" : "#f8fafc",
                                border: isSel ? "1.5px solid #0284c7" : "1.5px solid transparent",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              <Typography sx={{ fontWeight: 800, color: isSel ? "#0284c7" : "#0f172a", fontSize: "0.9rem" }}>
                                {type.label}
                              </Typography>
                              <Typography sx={{ color: "#64748b", fontSize: "0.78rem", mt: 0.3 }}>
                                {type.desc}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>

                    {/* Số lượng câu hỏi */}
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", mb: 1.2 }}>
                        6. Thời lượng buổi phỏng vấn
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        {[
                          { count: 3, label: "3 câu hỏi (Nhanh ~ 10 phút)" },
                          { count: 5, label: "5 câu hỏi (Chuẩn ~ 20 phút)" },
                        ].map((c) => (
                          <Box
                            key={c.count}
                            onClick={() => setQuestionCount(c.count)}
                            sx={{
                              flex: 1,
                              p: 1.8,
                              borderRadius: "14px",
                              bgcolor: questionCount === c.count ? "rgba(2, 132, 199, 0.06)" : "#f8fafc",
                              border: questionCount === c.count ? "1.5px solid #0284c7" : "1.5px solid transparent",
                              cursor: "pointer",
                              textAlign: "center",
                              fontWeight: 800,
                              color: questionCount === c.count ? "#0284c7" : "#334155",
                              fontSize: "0.85rem",
                            }}
                          >
                            {c.label}
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>

              {/* Nút Bắt Đầu */}
              <Box sx={{ mt: 5, textAlign: "center" }}>
                <Button
                  variant="contained"
                  disabled={isInitializing}
                  onClick={handleStartInterview}
                  startIcon={isInitializing ? <CircularProgress size={20} color="inherit" /> : <Zap size={20} />}
                  sx={{
                    px: 6,
                    py: 1.6,
                    borderRadius: "16px",
                    fontWeight: 850,
                    fontSize: "1.05rem",
                    textTransform: "none",
                    background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                    boxShadow: "0 10px 30px rgba(2, 132, 199, 0.35)",
                    "&:hover": {
                      boxShadow: "0 14px 36px rgba(2, 132, 199, 0.5)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  {isInitializing ? "AI Đang Soạn Kịch Bản Phỏng Vấn..." : "Bắt Đầu Buổi Phỏng Vấn Ngay"}
                </Button>
              </Box>
            </Box>
          </MotionBox>
        )}

        {/* ======================================================== */}
        {/* PHASE 2: PHÒNG PHỎNG VẤN ẢO TƯƠNG TÁC (INTERVIEW ROOM) */}
        {/* ======================================================== */}
        {phase === "interview" && session && (
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Top Bar: Progress & Timer */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: "20px",
                bgcolor: "#ffffff",
                boxShadow: "0 8px 30px rgba(15, 23, 42, 0.04)",
                mb: 3.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: "rgba(2, 132, 199, 0.08)",
                    color: "#0284c7",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Cpu size={22} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1rem" }}>
                    {session.sessionTitle}
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 600 }}>
                    {session.targetRole} · {session.experienceLevel}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Clock size={18} className="text-slate-400" />
                  <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem", fontVariantNumeric: "tabular-nums" }}>
                    {formatTimer(timerSeconds)}
                  </Typography>
                </Stack>
                <Box
                  sx={{
                    px: 2,
                    py: 0.6,
                    borderRadius: "12px",
                    bgcolor: "rgba(2, 132, 199, 0.08)",
                    color: "#0284c7",
                    fontWeight: 850,
                    fontSize: "0.85rem",
                  }}
                >
                  Câu {currentIndex + 1} / {session.questions.length}
                </Box>
              </Stack>
            </Box>

            {/* Linear Progress */}
            <LinearProgress
              variant="determinate"
              value={((currentIndex + 1) / session.questions.length) * 100}
              sx={{
                mb: 3.5,
                height: 6,
                borderRadius: 3,
                bgcolor: "#e2e8f0",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(90deg, #0284c7, #2563eb)",
                  borderRadius: 3,
                },
              }}
            />

            {/* Quick Question Stepper / Jump Navigation */}
            <Box sx={{ mb: 3, display: "flex", gap: 1.2, flexWrap: "wrap", alignItems: "center" }}>
              <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: "#64748b", mr: 1 }}>
                Danh sách câu hỏi:
              </Typography>
              {session.questions.map((q, idx) => {
                const isAnswered = (idx === currentIndex ? currentAnswer : answers[idx]?.userAnswer)?.trim()?.length >= 5;
                const isCurr = idx === currentIndex;
                return (
                  <Chip
                    key={idx}
                    label={`Câu ${idx + 1} ${isAnswered ? "✓" : ""}`}
                    onClick={() => {
                      if (idx === currentIndex) return;
                      if (isListening) {
                        recognitionRef.current?.stop();
                        setIsListening(false);
                      }
                      const cln = cleanCandidateText(currentAnswer);
                      const up = [...answers];
                      up[currentIndex] = { ...up[currentIndex], userAnswer: cln };
                      setAnswers(up);
                      setCurrentIndex(idx);
                      setCurrentAnswer(up[idx]?.userAnswer || "");
                      baseAnswerRef.current = up[idx]?.userAnswer || "";
                      setShowHint(false);
                    }}
                    clickable
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      bgcolor: isCurr ? "#0284c7" : isAnswered ? "rgba(16, 185, 129, 0.1)" : "#ffffff",
                      color: isCurr ? "#ffffff" : isAnswered ? "#059669" : "#64748b",
                      border: isCurr ? "1.5px solid #0284c7" : isAnswered ? "1.5px solid rgba(16, 185, 129, 0.4)" : "1.5px solid #e2e8f0",
                      boxShadow: isCurr ? "0 4px 12px rgba(2, 132, 199, 0.3)" : "none",
                      "&:hover": {
                        bgcolor: isCurr ? "#0369a1" : isAnswered ? "rgba(16, 185, 129, 0.2)" : "#f1f5f9",
                      },
                    }}
                  />
                );
              })}
            </Box>

            {/* Main Question Card */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "26px",
                bgcolor: "#ffffff",
                boxShadow: "0 12px 35px rgba(15, 23, 42, 0.04)",
                mb: 3.5,
                position: "relative",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                <Chip
                  label={session.questions[currentIndex]?.category || "Kỹ năng chuyên môn"}
                  sx={{
                    bgcolor: "rgba(2, 132, 199, 0.08)",
                    color: "#0284c7",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    borderRadius: "10px",
                  }}
                />
                {session.questions[currentIndex]?.competencyEvaluated && (
                  <Chip
                    label={`Đánh giá: ${session.questions[currentIndex]?.competencyEvaluated}`}
                    sx={{
                      bgcolor: "#f1f5f9",
                      color: "#475569",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                      borderRadius: "10px",
                    }}
                  />
                )}
              </Stack>

              <Typography variant="h5" sx={{ fontWeight: 850, color: "#0f172a", lineHeight: 1.5, mb: 3 }}>
                {session.questions[currentIndex]?.question}
              </Typography>

              {/* Gợi ý trả lời */}
              <Box>
                <Button
                  size="small"
                  onClick={() => setShowHint(!showHint)}
                  startIcon={<Lightbulb size={16} />}
                  sx={{
                    color: "#d97706",
                    fontWeight: 800,
                    fontSize: "0.82rem",
                    textTransform: "none",
                    p: 0,
                    mb: showHint ? 1.5 : 0,
                    "&:hover": { bgcolor: "transparent", color: "#b45309" },
                  }}
                >
                  {showHint ? "Ẩn gợi ý cấu trúc STAR" : "Xem gợi ý phương pháp trả lời (STAR)"}
                </Button>

                {showHint && (
                  <MotionBox
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    sx={{
                      p: 2.2,
                      borderRadius: "16px",
                      bgcolor: "rgba(245, 158, 11, 0.07)",
                      border: "1px dashed rgba(245, 158, 11, 0.3)",
                      color: "#92400e",
                      fontSize: "0.85rem",
                      lineHeight: 1.6,
                      fontWeight: 600,
                    }}
                  >
                    💡 {session.questions[currentIndex]?.starTip || "Áp dụng mô hình STAR: Nêu rõ Bối cảnh (Situation) -> Nhiệm vụ (Task) -> Hành động kỹ thuật đã làm (Action) -> Kết quả định lượng (Result)."}
                  </MotionBox>
                )}
              </Box>
            </Box>

            {/* Answer Input Area */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: "26px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                mb: 4,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 800, color: "#0f172a", fontSize: "0.95rem" }}>
                  Câu trả lời của bạn:
                </Typography>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  {currentAnswer && (
                    <Button
                      size="small"
                      onClick={() => {
                        setCurrentAnswer("");
                        baseAnswerRef.current = "";
                      }}
                      sx={{ textTransform: "none", color: "#64748b", fontWeight: 700, fontSize: "0.78rem" }}
                    >
                      Xóa nhập lại
                    </Button>
                  )}

                  {/* NÚT THU ÂM BẰNG GIỌNG NÓI (VOICE STT) */}
                  <Button
                    onClick={toggleListening}
                    startIcon={isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      borderRadius: "12px",
                      px: 2,
                      py: 0.8,
                      bgcolor: isListening ? "#fee2e2" : "#f1f5f9",
                      color: isListening ? "#b91c1c" : "#0284c7",
                      "&:hover": {
                        bgcolor: isListening ? "#fecaca" : "#e2e8f0",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    {isListening ? "Đang thu âm (Bấm dừng)" : "Trả lời bằng giọng nói"}
                  </Button>
                </Stack>
              </Stack>

              {/* Visualizer sóng âm khi đang ghi âm */}
              {isListening && (
                <Box
                  sx={{
                    mb: 2,
                    p: 1.5,
                    borderRadius: "14px",
                    bgcolor: "rgba(239, 68, 68, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#ef4444", animation: "pulse 1s infinite" }} />
                  <Typography sx={{ color: "#ef4444", fontSize: "0.82rem", fontWeight: 750 }}>
                    Hệ thống đang lắng nghe và chuyển âm thanh thành văn bản...
                  </Typography>
                </Box>
              )}

              <TextField
                fullWidth
                multiline
                rows={6}
                placeholder="Gõ câu trả lời của bạn hoặc bấm nút Micro bên trên để nói trực tiếp..."
                value={currentAnswer}
                error={Boolean(inputError)}
                helperText={inputError}
                onChange={(e) => {
                  setCurrentAnswer(e.target.value);
                  baseAnswerRef.current = e.target.value;
                  if (inputError) setInputError("");
                }}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    bgcolor: Boolean(inputError) ? "rgba(239, 68, 68, 0.03)" : "#f8fafc",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    "& fieldset": {
                      borderColor: Boolean(inputError) ? "#ef4444" : undefined,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#dc2626",
                    fontWeight: 750,
                    fontSize: "0.8rem",
                    mt: 1,
                  },
                }}
              />

              {/* Word Count & Status Pill */}
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5 }}>
                <Typography sx={{ color: "#94a3b8", fontSize: "0.78rem", fontWeight: 600 }}>
                  Gợi ý: Trình bày bối cảnh (Situation), nhiệm vụ (Task), hành động (Action) và kết quả (Result).
                </Typography>
                <Chip
                  size="small"
                  label={
                    currentAnswer.trim().length === 0
                      ? "Chưa trả lời"
                      : `${currentAnswer.trim().split(/\s+/).length} từ · ${
                          currentAnswer.trim().split(/\s+/).length >= 30
                            ? "Độ dài tốt ✓"
                            : "Khá ngắn (nên bổ sung chi tiết)"
                        }`
                  }
                  sx={{
                    bgcolor: currentAnswer.trim().length >= 80 ? "rgba(16, 185, 129, 0.1)" : currentAnswer.trim().length > 0 ? "rgba(2, 132, 199, 0.08)" : "#f1f5f9",
                    color: currentAnswer.trim().length >= 80 ? "#059669" : currentAnswer.trim().length > 0 ? "#0284c7" : "#94a3b8",
                    fontWeight: 750,
                    fontSize: "0.75rem",
                    borderRadius: "8px",
                  }}
                />
              </Stack>
            </Box>

            {/* Bottom Actions Bar */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Button
                variant="outlined"
                disabled={currentIndex === 0}
                onClick={handlePrevQuestion}
                startIcon={<ChevronLeft size={18} />}
                sx={{
                  fontWeight: 800,
                  borderRadius: "14px",
                  textTransform: "none",
                  px: 3,
                  py: 1.2,
                  borderColor: "#cbd5e1",
                  color: "#475569",
                }}
              >
                Câu trước
              </Button>

              <Stack direction="row" spacing={1.5} alignItems="center">
                {currentIndex < session.questions.length - 1 && (!currentAnswer || currentAnswer.trim().length < 5) && (
                  <Button
                    variant="text"
                    onClick={() => handleNextQuestion(true)}
                    sx={{
                      fontWeight: 750,
                      borderRadius: "12px",
                      textTransform: "none",
                      px: 2,
                      color: "#64748b",
                      fontSize: "0.82rem",
                      "&:hover": { color: "#d97706", bgcolor: "rgba(245, 158, 11, 0.08)" },
                    }}
                  >
                    Bỏ qua câu này →
                  </Button>
                )}

                {currentIndex < session.questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => handleNextQuestion(false)}
                    endIcon={<ChevronRight size={18} />}
                    sx={{
                      fontWeight: 800,
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 3.5,
                      py: 1.2,
                      bgcolor: "#0284c7",
                      "&:hover": { bgcolor: "#0369a1" },
                    }}
                  >
                    Lưu & Câu tiếp theo
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmitInterview}
                    endIcon={<Send size={18} />}
                    sx={{
                      fontWeight: 850,
                      borderRadius: "14px",
                      textTransform: "none",
                      px: 4,
                      py: 1.2,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      boxShadow: "0 8px 24px rgba(16, 185, 129, 0.35)",
                      "&:hover": {
                        boxShadow: "0 12px 28px rgba(16, 185, 129, 0.45)",
                      },
                    }}
                  >
                    Nộp Bài & Nhận Báo Cáo
                  </Button>
                )}
              </Stack>
            </Box>
          </MotionBox>
        )}

        {/* ======================================================== */}
        {/* PHASE: EVALUATING LOADING SCREEN */}
        {/* ======================================================== */}
        {phase === "evaluating" && (
          <Box sx={{ py: 14, textAlign: "center" }}>
            <Box sx={{ position: "relative", width: 100, height: 100, mx: "auto", mb: 4 }}>
              <CircularProgress
                size={100}
                thickness={3}
                sx={{
                  color: "#0284c7",
                  position: "absolute",
                  left: 0,
                  top: 0,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  color: "#0284c7",
                }}
              >
                <Brain size={40} className="animate-pulse" />
              </Box>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1.5 }}>
              AI Đang Chấm Điểm & Phân Tích Buổi Phỏng Vấn...
            </Typography>
            <Typography sx={{ color: "#64748b", fontSize: "1rem", maxWidth: 600, mx: "auto", mb: 4 }}>
              Đang đối chiếu câu trả lời với phương pháp STAR, đánh giá kỹ năng chuyên môn và soạn thảo câu trả lời mẫu điểm 10.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              {["1. Chuẩn hóa câu trả lời", "2. Đánh giá STAR", "3. Tạo Model Answer"].map((step, idx) => (
                <Chip
                  key={idx}
                  label={step}
                  sx={{
                    bgcolor: "rgba(2, 132, 199, 0.08)",
                    color: "#0284c7",
                    fontWeight: 750,
                    borderRadius: "10px",
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* ======================================================== */}
        {/* PHASE 3: BẢNG KẾT QUẢ ĐÁNH GIÁ (SCORECARD & FEEDBACK) */}
        {/* ======================================================== */}
        {phase === "result" && evaluation && (
          <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Top Toolbar Navigation */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Button
                onClick={() => {
                  setPhase("setup");
                  setSession(null);
                  setEvaluation(null);
                  setCurrentAnswer("");
                  baseAnswerRef.current = "";
                }}
                startIcon={<RotateCcw size={16} />}
                sx={{
                  fontWeight: 800,
                  color: "#64748b",
                  textTransform: "none",
                  borderRadius: "12px",
                  "&:hover": { color: "#0284c7", bgcolor: "rgba(2, 132, 199, 0.05)" },
                }}
              >
                Tạo buổi phỏng vấn mới
              </Button>

              <Chip
                icon={<Sparkles size={14} />}
                label="Báo cáo được khởi tạo bởi AI CareerGo"
                sx={{
                  bgcolor: "rgba(2, 132, 199, 0.08)",
                  color: "#0284c7",
                  fontWeight: 750,
                  fontSize: "0.8rem",
                  borderRadius: "10px",
                }}
              />
            </Stack>

            {/* 1. HERO SCORECARD: ULTRA-TECH METRICS */}
            <Box
              sx={{
                p: { xs: 3.5, md: 5 },
                borderRadius: "28px",
                bgcolor: "#ffffff",
                boxShadow: "0 20px 45px -15px rgba(2, 132, 199, 0.08), 0 8px 25px -5px rgba(15, 23, 42, 0.04)",
                mb: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle Ambient Top Border Glow */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: 3,
                  background: "linear-gradient(90deg, transparent, #0284c7, #2563eb, transparent)",
                }}
              />

              <Grid container spacing={4} alignItems="center">
                {/* Gauge Score Circle */}
                <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: 170,
                      height: 170,
                      mx: "auto",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {/* Outer Rotating Glow */}
                    <Box
                      sx={{
                        position: "absolute",
                        inset: -6,
                        borderRadius: "50%",
                        background: (evaluation.overallScore ?? 80) >= 80
                          ? "radial-gradient(circle, rgba(16, 185, 129, 0.18) 0%, transparent 70%)"
                          : "radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, transparent 70%)",
                      }}
                    />

                    {/* Circular SVG Ring */}
                    <svg width="170" height="170" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke="#f1f5f9"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        stroke={(evaluation.overallScore ?? 80) >= 80 ? "#10b981" : (evaluation.overallScore ?? 80) >= 65 ? "#0284c7" : "#f59e0b"}
                        strokeWidth="8"
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * (evaluation.overallScore ?? 80)) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                      />
                    </svg>

                    <Box sx={{ position: "absolute", textAlign: "center" }}>
                      <Typography sx={{ fontSize: "2.8rem", fontWeight: 950, color: "#0f172a", lineHeight: 1 }}>
                        {evaluation.overallScore ?? 80}
                      </Typography>
                      <Typography sx={{ fontSize: "0.85rem", fontWeight: 800, color: "#64748b" }}>
                        /100 Điểm
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={(evaluation.overallScore ?? 80) >= 80 ? "SẴN SÀNG NHẬN VIỆC ✓" : "TIỀM NĂNG PHÁT TRIỂN"}
                    sx={{
                      mt: 2,
                      fontWeight: 850,
                      fontSize: "0.78rem",
                      bgcolor: (evaluation.overallScore ?? 80) >= 80 ? "rgba(16, 185, 129, 0.1)" : "rgba(2, 132, 199, 0.1)",
                      color: (evaluation.overallScore ?? 80) >= 80 ? "#059669" : "#0284c7",
                      borderRadius: "10px",
                    }}
                  />
                </Grid>

                {/* Score Summary & Assessment */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{ fontSize: "0.82rem", fontWeight: 800, color: "#0284c7", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.5 }}>
                        Đánh Giá Năng Lực Ứng Viên
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em" }}>
                        Xếp loại: {evaluation.rating || "Rất tốt (80-89)"}
                      </Typography>
                    </Box>

                    <Typography sx={{ color: "#475569", fontSize: "0.98rem", lineHeight: 1.7, fontWeight: 500 }}>
                      {evaluation.summaryFeedback || "Buổi phỏng vấn đạt kết quả rất tích cực. Ứng viên thể hiện tư duy cấu trúc rõ ràng, nắm vững chuyên môn cốt lõi và phản xạ giao tiếp mạch lạc."}
                    </Typography>

                    {/* Metadata Tags */}
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ pt: 1 }}>
                      <Chip
                        icon={<Award size={14} />}
                        label={`Vị trí: ${session?.targetRole || targetRole || "Chuyên môn"}`}
                        sx={{ bgcolor: "#f8fafc", color: "#334155", fontWeight: 750, fontSize: "0.78rem" }}
                      />
                      <Chip
                        icon={<TrendingUp size={14} />}
                        label={`Cấp bậc: ${session?.experienceLevel || experienceLevel}`}
                        sx={{ bgcolor: "#f8fafc", color: "#334155", fontWeight: 750, fontSize: "0.78rem" }}
                      />
                      <Chip
                        icon={<Clock size={14} />}
                        label={`Thời lượng: ${formatTimer(timerSeconds)}`}
                        sx={{ bgcolor: "#f8fafc", color: "#334155", fontWeight: 750, fontSize: "0.78rem" }}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>

            {/* 2. STAR COMPETENCY RADAR & MATRIX (TIÊU CHUẨN STAR CHUYÊN SÂU) */}
            <Box
              sx={{
                p: { xs: 3, md: 4.5 },
                borderRadius: "28px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                mb: 4,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Box>
                  <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: 1 }}>
                    <Target size={20} className="text-sky-600" />
                    Phân Tích Chi Tiết Theo Tiêu Chuẩn STAR
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.3 }}>
                    Đo lường năng lực trả lời câu hỏi hành vi theo 4 trụ cột Situation - Task - Action - Result.
                  </Typography>
                </Box>
              </Stack>

              <Grid container spacing={2.5}>
                {[
                  {
                    key: "situation",
                    letter: "S",
                    title: "Situation (Nêu bối cảnh)",
                    color: "#0284c7",
                    bg: "rgba(2, 132, 199, 0.08)",
                    val: evaluation.starAnalysis?.situation,
                    desc: "Khả năng mô tả bối cảnh dự án, quy mô và bài toán cụ thể.",
                  },
                  {
                    key: "task",
                    letter: "T",
                    title: "Task (Xác định nhiệm vụ)",
                    color: "#6366f1",
                    bg: "rgba(99, 102, 241, 0.08)",
                    val: evaluation.starAnalysis?.task,
                    desc: "Mục tiêu trọng tâm và vai trò trách nhiệm của cá nhân.",
                  },
                  {
                    key: "action",
                    letter: "A",
                    title: "Action (Hành động giải quyết)",
                    color: "#10b981",
                    bg: "rgba(16, 185, 129, 0.08)",
                    val: evaluation.starAnalysis?.action,
                    desc: "Các bước giải pháp kỹ thuật, công nghệ và tư duy thực thi.",
                  },
                  {
                    key: "result",
                    letter: "R",
                    title: "Result (Kết quả & Định lượng)",
                    color: "#f59e0b",
                    bg: "rgba(245, 158, 11, 0.08)",
                    val: evaluation.starAnalysis?.result,
                    desc: "Số liệu đo lường, tác động kinh doanh và bài học rút ra.",
                  },
                ].map((item) => {
                  const percent = extractPercentage(item.val, 80);
                  return (
                    <Grid key={item.key} size={{ xs: 12, sm: 6, lg: 3 }}>
                      <Box
                        sx={{
                          p: 2.8,
                          borderRadius: "20px",
                          bgcolor: "#f8fafc",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "all 0.2s",
                          "&:hover": {
                            bgcolor: "#ffffff",
                            boxShadow: "0 10px 25px rgba(15, 23, 42, 0.06)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        <Box>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: "12px",
                                bgcolor: item.bg,
                                color: item.color,
                                display: "grid",
                                placeItems: "center",
                                fontWeight: 900,
                                fontSize: "1.1rem",
                              }}
                            >
                              {item.letter}
                            </Box>
                            <Typography sx={{ fontWeight: 900, color: item.color, fontSize: "1.15rem" }}>
                              {percent}%
                            </Typography>
                          </Stack>

                          <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "0.92rem", mb: 0.8 }}>
                            {item.title}
                          </Typography>

                          {/* Progress Bar */}
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "#e2e8f0",
                              mb: 1.8,
                              "& .MuiLinearProgress-bar": {
                                bgcolor: item.color,
                                borderRadius: 3,
                              },
                            }}
                          />

                          <Typography sx={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.5, fontWeight: 550 }}>
                            {item.val || item.desc}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>

            {/* 3. STRENGTHS & IMPROVEMENTS (ĐIỂM MẠNH & KẾ HOẠCH NÂNG CAO) */}
            <Grid container spacing={3.5} sx={{ mb: 4 }}>
              {/* Điểm mạnh */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "24px",
                    bgcolor: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.12)",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        bgcolor: "rgba(16, 185, 129, 0.12)",
                        color: "#059669",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <CheckCircle2 size={22} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 850, color: "#065f46", fontSize: "1.05rem" }}>
                        Điểm Mạnh Nổi Bật Của Bạn
                      </Typography>
                      <Typography sx={{ color: "#047857", fontSize: "0.78rem", fontWeight: 600 }}>
                        Các năng lực gây ấn tượng mạnh với hội đồng tuyển dụng
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.5}>
                    {(evaluation.strengths || [
                      "Tư duy cấu trúc hệ thống rõ ràng và rành mạch",
                      "Nắm vững kiến thức công nghệ trọng tâm",
                      "Áp dụng chuẩn chỉ các quy trình phát triển",
                    ]).map((str, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1.8,
                          borderRadius: "14px",
                          bgcolor: "#ffffff",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          boxShadow: "0 2px 8px rgba(16, 185, 129, 0.06)",
                        }}
                      >
                        <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                        <Typography sx={{ color: "#0f172a", fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.5 }}>
                          {str}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Điểm cần cải thiện */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  sx={{
                    p: 3.5,
                    borderRadius: "24px",
                    bgcolor: "rgba(245, 158, 11, 0.05)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    height: "100%",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "12px",
                        bgcolor: "rgba(245, 158, 11, 0.12)",
                        color: "#d97706",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <AlertCircle size={22} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 850, color: "#92400e", fontSize: "1.05rem" }}>
                        Khuyến Nghị Cải Thiện & Nâng Cao
                      </Typography>
                      <Typography sx={{ color: "#b45309", fontSize: "0.78rem", fontWeight: 600 }}>
                        Chiến lược tối ưu câu trả lời để đạt điểm tuyệt đối
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={1.5}>
                    {(evaluation.improvements || [
                      "Bổ sung thêm các chỉ số định lượng (KPI, %, throughput) vào kết quả",
                      "Nhấn mạnh chi tiết hơn về các biện pháp bảo mật và dự phòng rủi ro",
                    ]).map((imp, i) => (
                      <Box
                        key={i}
                        sx={{
                          p: 1.8,
                          borderRadius: "14px",
                          bgcolor: "#ffffff",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          boxShadow: "0 2px 8px rgba(245, 158, 11, 0.06)",
                        }}
                      >
                        <Target size={16} className="text-amber-600 mt-0.5 shrink-0" />
                        <Typography sx={{ color: "#0f172a", fontSize: "0.88rem", fontWeight: 600, lineHeight: 1.5 }}>
                          {imp}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>

            {/* 4. QUESTION FEEDBACK & MODEL ANSWERS (CÂU TRẢ LỜI MẪU ĐIỂM 10) */}
            <Box
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "28px",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
                mb: 4,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2} sx={{ mb: 3.5 }}>
                <Box>
                  <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: 1 }}>
                    <MessageSquare size={20} className="text-sky-600" />
                    Chi Tiết Từng Câu Hỏi & Câu Trả Lời Mẫu Điểm 10
                  </Typography>
                  <Typography sx={{ color: "#64748b", fontSize: "0.85rem", mt: 0.3 }}>
                    Đối chiếu câu trả lời thực tế của bạn với gợi ý chuẩn mực từ chuyên gia tuyển dụng.
                  </Typography>
                </Box>

                {/* Filter Question Tabs */}
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    size="small"
                    onClick={() => setSelectedQuestionTab("all")}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      bgcolor: selectedQuestionTab === "all" ? "#0284c7" : "#f1f5f9",
                      color: selectedQuestionTab === "all" ? "#ffffff" : "#475569",
                      "&:hover": {
                        bgcolor: selectedQuestionTab === "all" ? "#0369a1" : "#e2e8f0",
                      },
                    }}
                  >
                    Tất cả các câu ({evaluation.questionFeedbacks?.length || 0})
                  </Button>
                  {evaluation.questionFeedbacks?.map((_, qIdx) => (
                    <Button
                      key={qIdx}
                      size="small"
                      onClick={() => setSelectedQuestionTab(qIdx)}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        bgcolor: selectedQuestionTab === qIdx ? "#0284c7" : "#f1f5f9",
                        color: selectedQuestionTab === qIdx ? "#ffffff" : "#475569",
                        "&:hover": {
                          bgcolor: selectedQuestionTab === qIdx ? "#0369a1" : "#e2e8f0",
                        },
                      }}
                    >
                      Câu {qIdx + 1}
                    </Button>
                  ))}
                </Stack>
              </Stack>

              <Stack spacing={4}>
                {evaluation.questionFeedbacks
                  ?.filter((_, idx) => selectedQuestionTab === "all" || selectedQuestionTab === idx)
                  .map((q, idx) => {
                    const actualIdx = selectedQuestionTab === "all" ? idx : selectedQuestionTab;
                    const questionScore = typeof q.score === "number" ? q.score : (parseInt(q.score, 10) || 75);
                    const isHigh = questionScore >= 80;
                    const isMed = questionScore >= 60;
                    const cleanedAnswer = cleanCandidateText(q.userAnswer);

                    return (
                      <Box
                        key={actualIdx}
                        sx={{
                          p: { xs: 2.5, md: 3.5 },
                          borderRadius: "22px",
                          bgcolor: "#f8fafc",
                          border: "1px solid rgba(226, 232, 240, 0.8)",
                          transition: "all 0.2s",
                        }}
                      >
                        {/* Header: Question Title + Score Badge */}
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2} sx={{ mb: 2 }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                              <Chip
                                label={`Câu ${actualIdx + 1}`}
                                sx={{
                                  bgcolor: "#0284c7",
                                  color: "#ffffff",
                                  fontWeight: 900,
                                  fontSize: "0.75rem",
                                  borderRadius: "8px",
                                  height: 24,
                                }}
                              />
                            </Box>
                            <Typography sx={{ fontWeight: 850, color: "#0f172a", fontSize: "1.05rem", lineHeight: 1.5 }}>
                              {q.question}
                            </Typography>
                          </Box>

                          {/* Score Pill Guaranteed Never null */}
                          <Box
                            sx={{
                              px: 2,
                              py: 0.8,
                              borderRadius: "14px",
                              bgcolor: isHigh ? "rgba(16, 185, 129, 0.12)" : isMed ? "rgba(245, 158, 11, 0.12)" : "rgba(239, 68, 68, 0.12)",
                              color: isHigh ? "#059669" : isMed ? "#d97706" : "#dc2626",
                              fontWeight: 900,
                              fontSize: "0.95rem",
                              whiteSpace: "nowrap",
                              textAlign: "center",
                            }}
                          >
                            {questionScore}/100 đ
                          </Box>
                        </Stack>

                        {/* 1. Câu trả lời của ứng viên */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            bgcolor: "#ffffff",
                            mb: 2.5,
                            boxShadow: "0 2px 10px rgba(15, 23, 42, 0.02)",
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, color: "#64748b", fontSize: "0.8rem", mb: 0.8, display: "flex", alignItems: "center", gap: 1 }}>
                            <UserCheck size={16} /> Câu trả lời của bạn:
                          </Typography>
                          <Typography sx={{ color: "#1e293b", fontSize: "0.92rem", lineHeight: 1.7, fontStyle: cleanedAnswer ? "normal" : "italic" }}>
                            {cleanedAnswer ? `"${cleanedAnswer}"` : "[Ứng viên không trả lời hoặc bỏ qua câu hỏi này]"}
                          </Typography>
                        </Box>

                        {/* 2. Nhận xét & Đánh giá từ AI */}
                        <Box
                          sx={{
                            p: 2.5,
                            borderRadius: "16px",
                            bgcolor: "rgba(2, 132, 199, 0.04)",
                            border: "1px solid rgba(2, 132, 199, 0.1)",
                            mb: 2.5,
                          }}
                        >
                          <Typography sx={{ fontWeight: 850, color: "#0284c7", fontSize: "0.84rem", mb: 0.8, display: "flex", alignItems: "center", gap: 1 }}>
                            <Brain size={16} /> Nhận xét từ AI Chuyên gia:
                          </Typography>
                          <Typography sx={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.6, fontWeight: 550 }}>
                            {q.comment || "Ứng viên đã trả lời bám sát câu hỏi. Cần bổ sung ví dụ thực tế và giải pháp chi tiết hơn để nâng cao sức thuyết phục."}
                          </Typography>
                        </Box>

                        {/* 3. Câu trả lời mẫu điểm 10 (Model Answer) */}
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: "18px",
                            background: "linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(99, 102, 241, 0.05) 100%)",
                            border: "1px solid rgba(2, 132, 199, 0.2)",
                            position: "relative",
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.2 }}>
                            <Typography sx={{ fontWeight: 900, color: "#0369a1", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: 1 }}>
                              <Sparkles size={18} className="text-amber-500" />
                              🌟 Câu trả lời mẫu điểm 10 (Chuẩn STAR để bạn học hỏi):
                            </Typography>

                            <Tooltip title={copiedIndex === actualIdx ? "Đã sao chép!" : "Sao chép câu trả lời mẫu"}>
                              <IconButton
                                size="small"
                                onClick={() => handleCopyModelAnswer(q.modelAnswer, actualIdx)}
                                sx={{
                                  bgcolor: "#ffffff",
                                  boxShadow: "0 2px 6px rgba(15, 23, 42, 0.08)",
                                  "&:hover": { bgcolor: "#f1f5f9" },
                                }}
                              >
                                {copiedIndex === actualIdx ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} className="text-slate-600" />}
                              </IconButton>
                            </Tooltip>
                          </Stack>

                          <Typography sx={{ color: "#0f172a", fontSize: "0.92rem", lineHeight: 1.75, fontWeight: 500 }}>
                            {q.modelAnswer || "Áp dụng mô hình STAR: Nêu rõ bối cảnh cụ thể (Situation), phân tích nhiệm vụ cốt lõi (Task), giải trình chi tiết các bước xử lý kỹ thuật thực thi (Action), và đưa ra số liệu định lượng về kết quả đạt được (Result)."}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
              </Stack>
            </Box>

            {/* Bottom Actions */}
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                variant="contained"
                onClick={() => {
                  setPhase("setup");
                  setSession(null);
                  setEvaluation(null);
                  setCurrentAnswer("");
                  baseAnswerRef.current = "";
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                startIcon={<RotateCcw size={18} />}
                sx={{
                  px: 6,
                  py: 1.6,
                  borderRadius: "16px",
                  fontWeight: 850,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #0284c7 0%, #2563eb 100%)",
                  boxShadow: "0 10px 25px rgba(2, 132, 199, 0.35)",
                  textTransform: "none",
                  "&:hover": {
                    boxShadow: "0 14px 32px rgba(2, 132, 199, 0.45)",
                  },
                }}
              >
                Luyện Buổi Phỏng Vấn Mới
              </Button>
            </Box>
          </MotionBox>
        )}

        {/* MODAL CẢNH BÁO CÂU CHƯA TRẢ LỜI */}
        <Dialog
          open={validationModalOpen}
          onClose={() => setValidationModalOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "24px",
              p: 1.5,
              boxShadow: "0 24px 50px rgba(15, 23, 42, 0.15)",
            },
          }}
        >
          <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                bgcolor: unansweredList.length === (session?.questions?.length || 0) ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.12)",
                color: unansweredList.length === (session?.questions?.length || 0) ? "#dc2626" : "#d97706",
                display: "grid",
                placeItems: "center",
              }}
            >
              <AlertCircle size={24} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 850, fontSize: "1.15rem", color: "#0f172a" }}>
                {unansweredList.length === (session?.questions?.length || 0)
                  ? "Chưa Có Câu Trả Lời Nào"
                  : "Chưa Hoàn Thành Các Câu Hỏi"}
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "#64748b", fontWeight: 600 }}>
                Kiểm tra trước khi nộp bài cho AI đánh giá
              </Typography>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ pt: 1 }}>
            {unansweredList.length === (session?.questions?.length || 0) ? (
              <Typography sx={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6, mt: 1 }}>
                Bạn chưa nhập hoặc nói câu trả lời cho bất kỳ câu hỏi nào. Để nhận được bảng điểm và nhận xét chuyên sâu theo phương pháp STAR, bạn cần hoàn thành ít nhất một câu hỏi.
              </Typography>
            ) : (
              <>
                <Typography sx={{ color: "#475569", fontSize: "0.92rem", lineHeight: 1.6, mb: 2 }}>
                  Bạn đang để trống <b>{unansweredList.length}</b> câu hỏi. Những câu chưa trả lời sẽ bị chấm 0 điểm và ảnh hưởng trực tiếp đến xếp loại năng lực:
                </Typography>

                <Stack spacing={1.5} sx={{ maxHeight: 240, overflowY: "auto", pr: 0.5 }}>
                  {unansweredList.map((m) => (
                    <Box
                      key={m.index}
                      onClick={() => {
                        setValidationModalOpen(false);
                        setCurrentIndex(m.index - 1);
                        setCurrentAnswer(answers[m.index - 1]?.userAnswer || "");
                        baseAnswerRef.current = answers[m.index - 1]?.userAnswer || "";
                        setShowHint(false);
                      }}
                      sx={{
                        p: 1.8,
                        borderRadius: "14px",
                        bgcolor: "#fff7ed",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: "#ffedd5" },
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, color: "#9a3412", fontSize: "0.85rem", mb: 0.3 }}>
                        Câu {m.index} (Bấm để chuyển tới làm ngay) →
                      </Typography>
                      <Typography sx={{ color: "#475569", fontSize: "0.82rem", lineHeight: 1.4 }} noWrap>
                        {m.question}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2.5, pt: 1, gap: 1.5 }}>
            {unansweredList.length === (session?.questions?.length || 0) ? (
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setValidationModalOpen(false);
                  setCurrentIndex(0);
                  setCurrentAnswer(answers[0]?.userAnswer || "");
                  baseAnswerRef.current = answers[0]?.userAnswer || "";
                }}
                sx={{
                  py: 1.2,
                  borderRadius: "14px",
                  fontWeight: 800,
                  textTransform: "none",
                  bgcolor: "#0284c7",
                  "&:hover": { bgcolor: "#0369a1" },
                }}
              >
                Quay lại trả lời Câu 1
              </Button>
            ) : (
              <>
                <Button
                  variant="text"
                  onClick={() => {
                    const finalAnswers = [...answers];
                    finalAnswers[currentIndex] = {
                      ...finalAnswers[currentIndex],
                      userAnswer: cleanCandidateText(currentAnswer),
                    };
                    executeEvaluation(finalAnswers);
                  }}
                  sx={{
                    borderRadius: "12px",
                    fontWeight: 750,
                    fontSize: "0.82rem",
                    color: "#64748b",
                    textTransform: "none",
                    "&:hover": { color: "#dc2626", bgcolor: "rgba(239, 68, 68, 0.05)" },
                  }}
                >
                  Vẫn nộp bài (0đ câu trống)
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    setValidationModalOpen(false);
                    if (unansweredList.length > 0) {
                      const firstMissing = unansweredList[0].index - 1;
                      setCurrentIndex(firstMissing);
                      setCurrentAnswer(answers[firstMissing]?.userAnswer || "");
                      baseAnswerRef.current = answers[firstMissing]?.userAnswer || "";
                      setShowHint(false);
                    }
                  }}
                  sx={{
                    borderRadius: "14px",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 3,
                    py: 1.1,
                    bgcolor: "#0284c7",
                    "&:hover": { bgcolor: "#0369a1" },
                  }}
                >
                  Quay lại làm tiếp Câu {unansweredList[0]?.index || 1}
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
