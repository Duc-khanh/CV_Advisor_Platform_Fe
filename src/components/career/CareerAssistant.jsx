import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert, Box, Button, Chip, CircularProgress, Fab, Grow,
  IconButton, Paper, Stack, TextField, Tooltip, Typography,
} from "@mui/material";
import {
  AddComment, ArrowBack, AttachFile, AutoAwesome, ChatBubbleOutline,
  Close, DeleteOutline, Forum, KeyboardArrowDown, Refresh, Send, SmartToy, WorkOutline,
} from "@mui/icons-material";
import { sendCareerMessage } from "../../services/ai/careerAssistantService";
import { getCurrentUserId } from "../../services/cv/cvAnalysisStorage";

const LEGACY_HISTORY_KEY = "career_assistant_history";
const MAX_HISTORY_SESSIONS = 20;

function getHistoryStorageKey() {
  const userId = getCurrentUserId();
  return userId ? `career_assistant_history_${encodeURIComponent(userId)}` : null;
}

function loadHistory() {
  const storageKey = getHistoryStorageKey();
  if (!storageKey) return [];

  try {
    // The old unscoped key can expose one user's conversations to another.
    // Do not migrate it because its owner cannot be established safely.
    localStorage.removeItem(LEGACY_HISTORY_KEY);
    const saved = localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_HISTORY_SESSIONS) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  const storageKey = getHistoryStorageKey();
  if (!storageKey) return;
  localStorage.setItem(storageKey, JSON.stringify(history.slice(0, MAX_HISTORY_SESSIONS)));
}

const DASHBOARD_ACTIONS = [
  { label: "Phân tích CV của tôi", actionType: "ANALYZE_CV" },
  { label: "Tìm việc phù hợp", actionType: "FIND_MATCHING_JOBS" },
  { label: "Gợi ý cải thiện CV", actionType: "IMPROVE_CV" },
];

const JOB_ACTIONS = [
  { label: "Phân tích công việc này", actionType: "ANALYZE_CURRENT_JOB" },
  { label: "Tôi còn thiếu kỹ năng gì?", actionType: "SKILL_GAP" },
  { label: "Cải thiện CV cho Job này", actionType: "IMPROVE_CV" },
  { label: "Chuẩn bị phỏng vấn", actionType: "INTERVIEW_PREP" },
];

const LIST_SECTIONS = [
  ["strengths", "Điểm mạnh"],
  ["improvements", "Cần cải thiện"],
  ["missingInformation", "Thông tin còn thiếu"],
  ["suggestions", "Gợi ý"],
  ["matchedSkills", "Đã có"],
  ["missingSkills", "Chưa thấy trong hồ sơ"],
  ["unclearSkills", "Cần làm rõ"],
];

function formatHistoryTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - date) / (1000 * 60));
  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24 && date.toDateString() === now.toDateString()) {
    return `Hôm nay, ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
}

function ResultList({ title, items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <Box sx={{ mt: 0.5 }}>
      <Typography variant="caption" fontWeight={800} color="primary.main">{title}</Typography>
      <Stack component="ul" spacing={0.5} sx={{ pl: 2, my: 0.5 }}>
        {items.map((item, index) => (
          <Typography component="li" variant="body2" key={title + "-" + index} sx={{ lineHeight: 1.5, fontSize: "0.85rem" }}>
            {typeof item === "string" ? item : item?.question || JSON.stringify(item)}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function AssistantResult({ response, onAction, onAnalyzeJob }) {
  const data = response?.data || {};
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];
  const questions = Array.isArray(data.questions) ? data.questions : [];

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.65, fontSize: "0.88rem" }}>
        {response.message}
      </Typography>

      {typeof data.score === "number" && (
        <Chip
          label={"Mức phù hợp: " + data.score + "%"}
          color={data.score >= 70 ? "success" : data.score >= 40 ? "warning" : "default"}
          size="small"
          sx={{ alignSelf: "flex-start", fontWeight: 700 }}
        />
      )}

      {data.summary && (
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, fontSize: "0.85rem" }}>
          {data.summary}
        </Typography>
      )}

      {LIST_SECTIONS.map(([key, title]) => (
        <ResultList key={key} title={title} items={data[key]} />
      ))}

      {questions.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="caption" fontWeight={800} color="primary.main">Câu hỏi luyện tập</Typography>
          {questions.map((question, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 1.25, borderRadius: 2, bgcolor: "#f8fafc" }}>
              {question?.category && (
                <Typography variant="caption" color="primary" fontWeight={700}>
                  {question.category}
                </Typography>
              )}
              <Typography variant="body2" sx={{ fontSize: "0.85rem" }}>
                {question?.question || String(question)}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}

      {jobs.map((job) => (
        <Paper key={job.jobId} variant="outlined" sx={{ p: 1.5, borderRadius: 2.5, bgcolor: "#f8fafc" }}>
          <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between" gap={1}>
              <Box>
                <Typography variant="subtitle2" fontWeight={800}>{job.title}</Typography>
                <Typography variant="caption" color="text.secondary">{job.companyName}</Typography>
              </Box>
              {typeof job.matchScore === "number" && (
                <Chip size="small" label={job.matchScore + "%"} color="primary" />
              )}
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {[job.location, job.salaryRange, job.jobType].filter(Boolean).join(" • ")}
            </Typography>
            {Array.isArray(job.matchedSkills) && job.matchedSkills.length > 0 && (
              <Stack direction="row" gap={0.5} flexWrap="wrap">
                {job.matchedSkills.slice(0, 4).map((skill) => (
                  <Chip key={skill} label={skill} size="small" variant="outlined" color="success" />
                ))}
              </Stack>
            )}
            <Stack direction="row" gap={1} pt={0.5}>
              <Button size="small" onClick={() => onAction({ path: "/job/" + job.jobId })}>
                Chi tiết
              </Button>
              <Button size="small" onClick={() => onAnalyzeJob(job.jobId)}>
                Phân tích
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => onAction({ path: "/job/" + job.jobId })}
              >
                Ứng tuyển
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}

      {Array.isArray(response.actions) && response.actions.length > 0 && (
        <Stack direction="row" gap={1} flexWrap="wrap">
          {response.actions.map((action, index) => (
            <Button
              key={action.type + "-" + index}
              size="small"
              variant="outlined"
              onClick={() => onAction(action)}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}

export default function CareerAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(() => Date.now().toString());
  const [historyList, setHistoryList] = useState(loadHistory);
  const [sending, setSending] = useState(false);
  const [lastRequest, setLastRequest] = useState(null);
  const [pendingCv, setPendingCv] = useState(null);
  const [activeCv, setActiveCv] = useState(null);
  const [fileError, setFileError] = useState("");

  const currentJobId = useMemo(() => {
    const match = location.pathname.match(/^\/job\/(\d+)/);
    return match ? Number(match[1]) : null;
  }, [location.pathname]);
  const quickActions = currentJobId ? JOB_ACTIONS : DASHBOARD_ACTIONS;

  useEffect(() => {
    if (!showHistory) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, sending, showHistory]);

  // Synchronize active conversation into history
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const firstUserMsg = messages.find((m) => m.role === "user");
    const rawTitle = firstUserMsg?.content || firstUserMsg?.attachmentName || "Cuộc trò chuyện mới";
    const title = rawTitle.length > 32 ? rawTitle.slice(0, 32) + "..." : rawTitle;

    setHistoryList((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === activeSessionId);
      const sessionObj = {
        id: activeSessionId,
        title,
        updatedAt: Date.now(),
        messages,
        conversationId,
      };
      let nextList;
      if (existingIdx >= 0) {
        nextList = [...prev];
        nextList[existingIdx] = sessionObj;
      } else {
        nextList = [sessionObj, ...prev];
      }
      nextList = nextList.slice(0, MAX_HISTORY_SESSIONS);
      try {
        saveHistory(nextList);
      } catch (err) {
        console.error("Failed to save history", err);
      }
      return nextList;
    });
  }, [messages, activeSessionId, conversationId]);

  const contextFor = (jobId = currentJobId) => ({
    currentPage: jobId ? "job-detail" : location.pathname,
    currentJobId: jobId,
  });

  const submit = async ({
    message,
    actionType = "",
    jobId = currentJobId,
    cvFile,
    resetCvContext,
  } = {}) => {
    const newCv = cvFile || pendingCv;
    const cvForRequest = newCv || activeCv;
    const isNewCv = resetCvContext ?? Boolean(newCv);
    const typedQuestion = (message ?? input).trim();
    const question = typedQuestion || (isNewCv ? "Phân tích CV này" : "");
    const resolvedAction = actionType || (!typedQuestion && isNewCv ? "ANALYZE_CV" : "");
    if ((!question && !resolvedAction) || sending) return;
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }
    const userMessage = {
      role: "user",
      content: question || "Thực hiện thao tác đã chọn",
      attachmentName: isNewCv ? cvForRequest?.name : null,
    };
    const request = {
      message: question,
      actionType: resolvedAction,
      jobId,
      cvFile: cvForRequest,
      resetCvContext: isNewCv,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (isNewCv) {
      setActiveCv(cvForRequest);
      setPendingCv(null);
    }
    setSending(true);
    setLastRequest(request);

    try {
      const response = await sendCareerMessage({
        conversationId,
        message: question,
        actionType: resolvedAction,
        context: contextFor(jobId),
        history: isNewCv
          ? []
          : messages
              .filter(({ role }) => role === "user" || role === "assistant")
              .slice(-8)
              .map(({ role, content }) => ({ role, content })),
        cvFile: cvForRequest,
        resetCvContext: isNewCv,
      });
      setConversationId(response.conversationId);
      setMessages((prev) => [...prev, { role: "assistant", content: response.message, response }]);
    } catch (error) {
      const messageText = error.response?.data?.message || "AI chưa thể phản hồi. Vui lòng thử lại.";
      setMessages((prev) => [...prev, { role: "error", content: messageText }]);
    } finally {
      setSending(false);
    }
  };

  const handleAction = (action) => {
    if (action.type === "UPLOAD_CV") {
      fileInputRef.current?.click();
      return;
    }
    if (action.path) {
      navigate(action.path);
      return;
    }
    if (action.type === "ANALYZE_JOB") {
      submit({ message: "Phân tích công việc này", actionType: "ANALYZE_CURRENT_JOB", jobId: action.jobId });
    }
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFileError("Vui lòng chọn CV dạng PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File CV không được vượt quá 5 MB.");
      return;
    }
    setPendingCv(file);
    setFileError("");
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInput("");
    setLastRequest(null);
    setPendingCv(null);
    setActiveCv(null);
    setFileError("");
    setActiveSessionId(Date.now().toString());
    setShowHistory(false);
  };

  const loadSession = (session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setConversationId(session.conversationId || null);
    setInput("");
    setPendingCv(null);
    // File objects are intentionally not persisted. Never carry a CV from
    // the previously active conversation into a loaded history session.
    setActiveCv(null);
    setLastRequest(null);
    setFileError("");
    setShowHistory(false);
  };

  const deleteSession = (sessionId, e) => {
    e.stopPropagation();
    setHistoryList((prev) => {
      const nextList = prev.filter((s) => s.id !== sessionId);
      try {
        saveHistory(nextList);
      } catch (err) {
        console.error("Failed to delete history item", err);
      }
      return nextList;
    });
    if (activeSessionId === sessionId) {
      startNewChat();
    }
  };

  const clearAllHistory = () => {
    setHistoryList([]);
    try {
      const storageKey = getHistoryStorageKey();
      if (storageKey) localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear career assistant history", error);
    }
    startNewChat();
  };

  const handleOpen = () => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { state: { returnTo: location.pathname } });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      {!open && (
        <Fab
          color="primary"
          aria-label="Mở AI Career Assistant"
          onClick={handleOpen}
          sx={{
            position: "fixed",
            right: { xs: 18, md: 28 },
            bottom: { xs: 18, md: 28 },
            zIndex: 1200,
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
            transition: "transform 0.2s ease",
            outline: "none !important",
            "&:focus": { outline: "none !important" },
            "&:focus-visible": { outline: "none !important" },
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
        >
          <AutoAwesome />
        </Fab>
      )}

      <Grow in={open} timeout={300} style={{ transformOrigin: "bottom right" }}>
        <Paper
          elevation={12}
          sx={{
            position: "fixed",
            bottom: { xs: 12, sm: 24 },
            right: { xs: 12, sm: 28 },
            width: { xs: "calc(100vw - 24px)", sm: 430 },
            height: { xs: "calc(100vh - 36px)", sm: 620 },
            maxHeight: { xs: "94vh", sm: "85vh" },
            borderRadius: { xs: 3.5, sm: 4 },
            display: open ? "flex" : "none",
            flexDirection: "column",
            zIndex: 1300,
            overflow: "hidden",
            border: "1px solid rgba(226, 232, 240, 0.9)",
            boxShadow: "0 18px 48px -10px rgba(15, 23, 42, 0.25), 0 0 1px 1px rgba(0, 0, 0, 0.04)",
            bgcolor: "#ffffff",
            "& button, & .MuiButtonBase-root, & .MuiIconButton-root, & [tabindex]": {
              outline: "none !important",
              "&:focus": { outline: "none !important" },
              "&:focus-visible": { outline: "none !important" },
              "&:active": { outline: "none !important" },
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              px: 2,
              bgcolor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              component="button"
              onClick={() => setShowHistory((prev) => !prev)}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                p: "4px 8px",
                border: "none",
                borderRadius: 2,
                bgcolor: showHistory ? "rgba(25, 118, 210, 0.08)" : "transparent",
                color: showHistory ? "primary.main" : "text.primary",
                cursor: "pointer",
                outline: "none !important",
                "&:focus": { outline: "none !important" },
                "&:focus-visible": { outline: "none !important" },
                "&:active": { outline: "none !important" },
                WebkitTapHighlightColor: "transparent",
                "&:hover": {
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                  color: "primary.main",
                },
                transition: "all 0.15s ease",
              }}
            >
              <Typography
                fontWeight={800}
                sx={{ fontSize: "0.98rem", color: "inherit", lineHeight: 1 }}
              >
                New AI Chat
              </Typography>
              <KeyboardArrowDown
                sx={{
                  fontSize: 18,
                  color: "inherit",
                  transform: showHistory ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              />
            </Box>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <Tooltip title="Cuộc trò chuyện mới">
                <IconButton onClick={startNewChat} size="small" sx={{ color: "text.secondary" }}>
                  <AddComment sx={{ fontSize: 19 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Đóng ô chat">
                <IconButton onClick={() => setOpen(false)} size="small" sx={{ color: "text.secondary" }}>
                  <Close sx={{ fontSize: 19 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Conditional View: History Page or Chat Messages */}
          {showHistory ? (
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                bgcolor: "#ffffff",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* History Top Bar */}
              <Box
                sx={{
                  p: 1.5,
                  px: 2,
                  bgcolor: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => setShowHistory(false)}
                    sx={{ color: "text.secondary", p: 0.5 }}
                    aria-label="Quay lại đoạn chat"
                  >
                    <ArrowBack sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography variant="subtitle2" fontWeight={800} sx={{ fontSize: "0.88rem" }}>
                    Lịch sử trò chuyện ({historyList.length})
                  </Typography>
                </Stack>
              </Box>

              {/* History List */}
              <Box
                sx={{
                  flex: 1,
                  p: 1.75,
                  overflowY: "auto",
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 24px, black calc(100% - 24px), transparent 100%)",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0, 0, 0, 0.12)",
                    borderRadius: "10px",
                  },
                }}
              >
                {historyList.length === 0 ? (
                  <Stack
                    spacing={1.5}
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100%", minHeight: 280, textAlign: "center", color: "text.secondary" }}
                  >
                    <ChatBubbleOutline sx={{ fontSize: 44, color: "#cbd5e1" }} />
                    <Typography variant="body2" fontWeight={700} color="text.secondary">
                      Chưa có lịch sử trò chuyện
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 240, fontSize: "0.78rem" }}>
                      Các cuộc trò chuyện của bạn với AI sẽ được tự động lưu tại đây.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={startNewChat}
                      sx={{ borderRadius: 2, textTransform: "none", mt: 1, fontSize: "0.8rem" }}
                    >
                      Bắt đầu cuộc trò chuyện mới
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={1}>
                    {historyList.map((item) => {
                      const isActive = item.id === activeSessionId;
                      const lastMsg = item.messages?.[item.messages.length - 1];
                      return (
                        <Paper
                          key={item.id}
                          elevation={0}
                          onClick={() => loadSession(item)}
                          sx={{
                            p: 1.5,
                            borderRadius: 2.5,
                            border: "1px solid",
                            borderColor: isActive ? "primary.main" : "#e2e8f0",
                            bgcolor: isActive ? "rgba(25, 118, 210, 0.05)" : "#ffffff",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              borderColor: "primary.light",
                              bgcolor: "rgba(25, 118, 210, 0.06)",
                              transform: "translateY(-1px)",
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={1}>
                            <Stack direction="row" spacing={1.25} sx={{ minWidth: 0, flex: 1 }}>
                              <Box
                                sx={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 2,
                                  bgcolor: isActive ? "primary.main" : "rgba(25, 118, 210, 0.08)",
                                  color: isActive ? "#ffffff" : "primary.main",
                                  display: "grid",
                                  placeItems: "center",
                                  flexShrink: 0,
                                  mt: 0.2,
                                }}
                              >
                                <Forum sx={{ fontSize: 16 }} />
                              </Box>
                              <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={isActive ? 800 : 700}
                                  noWrap
                                  sx={{ fontSize: "0.85rem", color: isActive ? "primary.main" : "text.primary" }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  noWrap
                                  sx={{ display: "block", fontSize: "0.75rem", mt: 0.25 }}
                                >
                                  {lastMsg?.content || "Không có tin nhắn gần đây"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                  sx={{ display: "block", fontSize: "0.68rem", mt: 0.5 }}
                                >
                                  {formatHistoryTime(item.updatedAt)}
                                </Typography>
                              </Box>
                            </Stack>

                            <Tooltip title="Xóa đoạn chat này">
                              <IconButton
                                size="small"
                                onClick={(e) => deleteSession(item.id, e)}
                                sx={{
                                  color: "text.disabled",
                                  p: 0.5,
                                  "&:hover": { color: "error.main" },
                                }}
                              >
                                <DeleteOutline sx={{ fontSize: 17 }} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Paper>
                      );
                    })}

                    {historyList.length > 1 && (
                      <Box sx={{ pt: 1, textAlign: "center" }}>
                        <Button
                          size="small"
                          color="error"
                          onClick={clearAllHistory}
                          sx={{ textTransform: "none", fontSize: "0.75rem" }}
                        >
                          Xóa toàn bộ lịch sử
                        </Button>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>
            </Box>
          ) : (
            <>
              {/* Messages Body */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  bgcolor: "#ffffff",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  maskImage: "linear-gradient(to bottom, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28px, black calc(100% - 28px), transparent 100%)",
                  "&::-webkit-scrollbar": {
                    width: "4px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "transparent",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "rgba(0, 0, 0, 0.12)",
                    borderRadius: "10px",
                  },
                }}
              >
                {messages.length === 0 && (
                  <Stack spacing={2} sx={{ py: 1.5 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: "1px solid #e2e8f0",
                        borderRadius: 3,
                        bgcolor: "#ffffff",
                        textAlign: "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 44,
                          height: 44,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(21, 101, 192, 0.2) 100%)",
                          color: "primary.main",
                          display: "grid",
                          placeItems: "center",
                          mx: "auto",
                          mb: 1.25,
                        }}
                      >
                        <AutoAwesome sx={{ fontSize: 22 }} />
                      </Box>
                      <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                        Chào bạn! Tôi có thể giúp gì cho bạn?
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                        Hỏi về nghề nghiệp, kỹ năng, định hướng hoặc gửi kèm CV để được phân tích chuyên sâu.
                      </Typography>
                    </Paper>

                    <Box>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: "block", mb: 1, px: 0.5 }}>
                        Gợi ý nhanh:
                      </Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {quickActions.map((action) => (
                          <Chip
                            key={action.actionType}
                            icon={<WorkOutline sx={{ fontSize: "15px !important" }} />}
                            label={action.label}
                            clickable
                            variant="outlined"
                            onClick={() => submit({ message: action.label, actionType: action.actionType })}
                            sx={{
                              py: 0.5,
                              borderRadius: 2.5,
                              borderColor: "#cbd5e1",
                              bgcolor: "#ffffff",
                              "&:hover": { bgcolor: "primary.lighter", borderColor: "primary.main" },
                              "& .MuiChip-label": { whiteSpace: "normal", fontSize: "0.78rem" },
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                )}

                {messages.map((message, index) => {
                  if (message.role === "user") {
                    return (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: "flex-end",
                          maxWidth: { xs: "85%", sm: "78%" },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            px: 1.75,
                            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                            color: "#ffffff",
                            borderRadius: "18px 18px 4px 18px",
                            boxShadow: "0 3px 12px rgba(25, 118, 210, 0.2)",
                            wordBreak: "break-word",
                          }}
                        >
                          <Stack spacing={1}>
                            {message.attachmentName && (
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1,
                                  px: 1.25,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color: "#ffffff",
                                  bgcolor: "rgba(255, 255, 255, 0.16)",
                                  border: "1px solid rgba(255, 255, 255, 0.28)",
                                  borderRadius: 2,
                                  backdropFilter: "blur(4px)",
                                }}
                              >
                                <AttachFile sx={{ fontSize: 18 }} />
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography variant="caption" sx={{ display: "block", opacity: 0.85, fontSize: "0.68rem", fontWeight: 700 }}>
                                    CV PDF
                                  </Typography>
                                  <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: "0.82rem" }}>
                                    {message.attachmentName}
                                  </Typography>
                                </Box>
                              </Paper>
                            )}
                            <Typography variant="body2" sx={{ lineHeight: 1.55, fontSize: "0.88rem" }}>
                              {message.content}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Box>
                    );
                  }

                  if (message.role === "error") {
                    return (
                      <Box
                        key={index}
                        sx={{
                          alignSelf: "center",
                          width: "100%",
                          maxWidth: "92%",
                        }}
                      >
                        <Alert
                          severity="error"
                          sx={{ borderRadius: 2.5 }}
                          action={
                            <IconButton color="inherit" size="small" onClick={() => lastRequest && submit(lastRequest)}>
                              <Refresh fontSize="small" />
                            </IconButton>
                          }
                        >
                          {message.content}
                        </Alert>
                      </Box>
                    );
                  }

                  // Assistant message
                  return (
                    <Box
                      key={index}
                      sx={{
                        alignSelf: "flex-start",
                        maxWidth: { xs: "92%", sm: "88%" },
                        display: "flex",
                        gap: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                          color: "white",
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                          boxShadow: "0 2px 6px rgba(25, 118, 210, 0.25)",
                          mt: 0.5,
                        }}
                      >
                        <SmartToy sx={{ fontSize: 16 }} />
                      </Box>

                      <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.75,
                            bgcolor: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "4px 18px 18px 18px",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
                            color: "text.primary",
                          }}
                        >
                          <AssistantResult
                            response={message.response}
                            onAction={handleAction}
                            onAnalyzeJob={(jobId) =>
                              submit({
                                message: "Phân tích công việc này",
                                actionType: "ANALYZE_CURRENT_JOB",
                                jobId,
                              })
                            }
                          />
                        </Paper>
                      </Stack>
                    </Box>
                  );
                })}

                {/* Waiting for AI response loading state */}
                {sending && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{
                      alignSelf: "flex-start",
                      pl: 0.5,
                      py: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)",
                        color: "white",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        boxShadow: "0 2px 6px rgba(25, 118, 210, 0.25)",
                      }}
                    >
                      <SmartToy sx={{ fontSize: 15 }} />
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ fontSize: "0.85rem" }}>
                      AI Career Assistant
                    </Typography>
                    <CircularProgress size={14} thickness={4} color="primary" />
                  </Stack>
                )}

                <div ref={bottomRef} />
              </Box>

              {/* Bottom Chat Input */}
              <Box sx={{ p: 1.25, px: 2, pb: 1.75, bgcolor: "#ffffff" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  hidden
                  onChange={handleFile}
                />
                {fileError && (
                  <Alert severity="error" sx={{ mb: 1, borderRadius: 2 }} onClose={() => setFileError("")}>
                    {fileError}
                  </Alert>
                )}

                {/* Selected pending CV preview (before sending) */}
                {pendingCv && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 0.75,
                      px: 1.25,
                      mb: 1,
                      borderRadius: 2.5,
                      bgcolor: "rgba(25, 118, 210, 0.05)",
                      borderColor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <AttachFile color="primary" sx={{ fontSize: 18 }} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.68rem" }}>
                        CV đính kèm sẵn sàng gửi
                      </Typography>
                      <Typography variant="body2" fontWeight={700} noWrap sx={{ fontSize: "0.82rem", color: "primary.dark" }}>
                        {pendingCv.name}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setPendingCv(null)} aria-label="Bỏ chọn file" sx={{ p: 0.5 }}>
                      <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Paper>
                )}

                {/* Input Bar */}
                <Paper
                  elevation={0}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: "4px 6px",
                    borderRadius: 3.5,
                    border: "1.5px solid #e2e8f0",
                    bgcolor: "#f8fafc",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    "&:focus-within": {
                      borderColor: "primary.main",
                      bgcolor: "#ffffff",
                      boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.12)",
                    },
                  }}
                >
                  <Tooltip title="Chọn CV PDF đính kèm">
                    <IconButton
                      color={pendingCv ? "primary" : "default"}
                      disabled={sending}
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Chọn CV PDF để gửi"
                      size="small"
                      sx={{ p: 0.75 }}
                    >
                      <AttachFile sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Tooltip>

                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder={pendingCv ? "Thêm lời nhắn hoặc nhấn gửi..." : "Hỏi AI về nghề nghiệp, kỹ năng hoặc CV..."}
                    value={input}
                    disabled={sending}
                    multiline
                    maxRows={3}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        submit();
                      }
                    }}
                    InputProps={{
                      disableUnderline: true,
                      sx: { px: 1, fontSize: "0.88rem" },
                    }}
                    inputProps={{ maxLength: 2000 }}
                  />

                  <IconButton
                    color="primary"
                    disabled={sending || (!input.trim() && !pendingCv)}
                    onClick={() => submit()}
                    size="small"
                    sx={{
                      p: 0.85,
                      bgcolor: (!input.trim() && !pendingCv) || sending ? "transparent" : "primary.main",
                      color: (!input.trim() && !pendingCv) || sending ? "text.disabled" : "white",
                      "&:hover": {
                        bgcolor: (!input.trim() && !pendingCv) || sending ? "transparent" : "primary.dark",
                      },
                      transition: "all 0.2s",
                    }}
                  >
                    <Send sx={{ fontSize: 17 }} />
                  </IconButton>
                </Paper>
              </Box>
            </>
          )}
        </Paper>
      </Grow>
    </>
  );
}
