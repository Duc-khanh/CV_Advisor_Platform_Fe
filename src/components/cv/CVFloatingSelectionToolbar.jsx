import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Bold,
  Italic,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
  Check,
  Wand2,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import api from "../../services/axios";
import { useToast } from "../../contexts/ToastContext";

export default function CVFloatingSelectionToolbar({ containerRef, cvId, onApplyText }) {
  const showToast = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [savedRange, setSavedRange] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiTone, setAiTone] = useState("concise"); // 'concise' | 'star' | 'polish'
  const [formatState, setFormatState] = useState({ bold: false, italic: false });
  const toolbarRef = useRef(null);
  const activeInputRef = useRef(null);
  const inputSelectionRef = useRef({ start: 0, end: 0 });

  // Tính toán vị trí toolbar theo Range Selection hoặc Input/Textarea
  const updateToolbarPosition = () => {
    // Nếu đang mở dialog AI thì giữ nguyên vị trí, không ẩn
    if (aiModalOpen) return;

    try {
      // TRƯỜNG HỢP 1: BÔI ĐEN TRONG FORM NHẬP LIỆU (INPUT / TEXTAREA BẢN CỘT TRÁI "NỘI DUNG")
      const activeEl = document.activeElement;
      const isFormInput =
        activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");

      if (isFormInput) {
        const container = containerRef?.current;
        if (!container || container.contains(activeEl)) {
          const start = activeEl.selectionStart;
          const end = activeEl.selectionEnd;

          if (typeof start === "number" && typeof end === "number" && end > start) {
            const text = activeEl.value.substring(start, end).trim();
            if (text.length > 0) {
              const rect = activeEl.getBoundingClientRect();
              let top = rect.top - 46;
              let left = rect.left + rect.width / 2;
              let placement = "top";

              if (top < 10) {
                top = rect.bottom + 10;
                placement = "bottom";
              }

              const minLeft = 160;
              const maxLeft = window.innerWidth - 160;
              if (left < minLeft) left = minLeft;
              if (left > maxLeft) left = maxLeft;

              activeInputRef.current = activeEl;
              inputSelectionRef.current = { start, end };
              setSelectedText(text);
              setSavedRange(null);
              setPosition({ top, left, placement });
              setFormatState({
                bold: text.startsWith("**") && text.endsWith("**"),
                italic: text.startsWith("*") && text.endsWith("*") && !text.startsWith("**"),
              });
              setIsVisible(true);
              return;
            }
          }
        }
      }

      // TRƯỜNG HỢP 2: BÔI ĐEN TRÊN BẢN XEM TRƯỚC CV (CANVAS BẢN PHẢI)
      activeInputRef.current = null;
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setIsVisible(false);
        return;
      }

      const text = selection.toString().trim();
      if (!text || text.length === 0) {
        setIsVisible(false);
        return;
      }

      // Giới hạn phạm vi: Chỉ hiển thị khi vùng bôi đen nằm trong container (containerRef)
      const container = containerRef?.current;
      if (container) {
        const anchorNode = selection.anchorNode;
        const focusNode = selection.focusNode;
        const anchorEl =
          anchorNode?.nodeType === Node.ELEMENT_NODE
            ? anchorNode
            : anchorNode?.parentElement;
        const focusEl =
          focusNode?.nodeType === Node.ELEMENT_NODE
            ? focusNode
            : focusNode?.parentElement;

        const isInside =
          (anchorEl && container.contains(anchorEl)) ||
          (focusEl && container.contains(focusEl));

        if (!isInside) {
          setIsVisible(false);
          return;
        }
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Chỉ hiển thị nếu vùng chọn có kích thước hợp lệ
      if (rect.width > 0 && rect.height > 0) {
        let top = rect.top - 46;
        let left = rect.left + rect.width / 2;
        let placement = "top";

        if (top < 10) {
          top = rect.bottom + 10;
          placement = "bottom";
        }

        const minLeft = 160;
        const maxLeft = window.innerWidth - 160;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        setPosition({ top, left, placement });
        setSelectedText(text);
        setSavedRange(range.cloneRange());
        setFormatState({
          bold: isBoldActive(),
          italic: isItalicActive(),
        });
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    } catch {
      setIsVisible(false);
    }
  };

  // Lắng nghe sự kiện selection, scroll và resize
  useEffect(() => {
    const handleSelectionChange = () => {
      updateToolbarPosition();
    };

    const handleMouseUp = () => {
      setTimeout(updateToolbarPosition, 10);
    };

    const handleKeyUp = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Shift"].includes(e.key)) {
        setTimeout(updateToolbarPosition, 10);
      }
    };

    const handleScrollOrResize = () => {
      if (!aiModalOpen) {
        updateToolbarPosition();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("select", handleSelectionChange, true);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("select", handleSelectionChange, true);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [containerRef, aiModalOpen]);

  // Helpers kiểm tra trạng thái format hiện tại
  const isItalicActive = () => {
    try {
      const state = document.queryCommandState("italic");
      if (state) return true;
    } catch {}
    try {
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const node = selection.anchorNode;
        const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (el) {
          const style = window.getComputedStyle(el);
          if (style.fontStyle === "italic" || style.fontStyle === "oblique") return true;
        }
        let ancestor = el;
        while (ancestor && ancestor !== document.body) {
          if (ancestor.tagName === "EM" || ancestor.tagName === "I") return true;
          if (ancestor.style && ancestor.style.fontStyle === "italic") return true;
          ancestor = ancestor.parentElement;
        }
      }
    } catch {}
    return false;
  };

  const isBoldActive = () => {
    try {
      const state = document.queryCommandState("bold");
      if (state) return true;
    } catch {}
    try {
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        const node = selection.anchorNode;
        const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
        if (el) {
          const style = window.getComputedStyle(el);
          const fw = parseInt(style.fontWeight, 10);
          if (fw >= 700 || style.fontWeight === "bold" || style.fontWeight === "bolder") {
            let ancestor = el;
            while (ancestor && ancestor !== document.body) {
              if (ancestor.tagName === "STRONG" || ancestor.tagName === "B") return true;
              if (ancestor.style && ancestor.style.fontWeight === "bold") return true;
              ancestor = ancestor.parentElement;
            }
          }
        }
      }
    } catch {}
    return false;
  };

  const unwrapInlineTag = (tags) => {
    try {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      const range = selection.getRangeAt(0);
      let node = range.commonAncestorContainer;
      if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
      while (node && node !== document.body) {
        if (tags.includes(node.tagName.toLowerCase())) {
          const parent = node.parentNode;
          while (node.firstChild) {
            parent.insertBefore(node.firstChild, node);
          }
          parent.removeChild(node);
          return;
        }
        node = node.parentElement;
      }
    } catch (err) {
      console.warn("unwrapInlineTag error:", err);
    }
  };

  // Các lệnh định dạng văn bản trực tiếp
  const executeCommand = (command, value = null) => {
    // XỬ LÝ CHO INPUT / TEXTAREA BẢN PHẦN NỘI DUNG
    if (activeInputRef.current) {
      const el = activeInputRef.current;
      const { start, end } = inputSelectionRef.current;
      const rawText = el.value.substring(start, end);
      let newPiece = rawText;

      if (command === "bold") {
        if (rawText.startsWith("**") && rawText.endsWith("**") && rawText.length >= 4) {
          newPiece = rawText.slice(2, -2);
        } else {
          newPiece = `**${rawText}**`;
        }
      } else if (command === "italic") {
        if (rawText.startsWith("*") && rawText.endsWith("*") && rawText.length >= 2) {
          newPiece = rawText.slice(1, -1);
        } else {
          newPiece = `*${rawText}*`;
        }
      } else if (command === "insertUnorderedList") {
        newPiece = rawText
          .split("\n")
          .map((line) => (line.startsWith("• ") ? line.slice(2) : `• ${line}`))
          .join("\n");
      }

      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      const newValue = before + newPiece + after;
      const appliedToState = onApplyText?.(rawText, newPiece) === true;

      if (!appliedToState) {
        const setter =
          el.tagName === "TEXTAREA"
            ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
            : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

        if (setter) {
          setter.call(el, newValue);
        } else {
          el.value = newValue;
        }

        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }

      inputSelectionRef.current = { start, end: start + newPiece.length };
      try {
        el.setSelectionRange(start, start + newPiece.length);
      } catch {}

      setFormatState({
        bold: newPiece.startsWith("**") && newPiece.endsWith("**"),
        italic: newPiece.startsWith("*") && newPiece.endsWith("*") && !newPiece.startsWith("**"),
      });

      setTimeout(updateToolbarPosition, 10);
      return;
    }

    // 1. Khôi phục selection nếu bị mất focus (Canvas)
    const selection = window.getSelection();
    if (savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }

    // 2. Kiểm tra trạng thái toggle hiện tại
    const currentlyItalic = command === "italic" ? isItalicActive() : false;
    const currentlyBold = command === "bold" ? isBoldActive() : false;

    // 3. Thử execCommand trước
    let success = false;
    try {
      success = document.execCommand(command, false, value);
    } catch {
      success = false;
    }

    // 4. Fallback thủ công nếu execCommand không làm được
    if (!success && savedRange && !savedRange.collapsed) {
      try {
        if (command === "italic") {
          if (currentlyItalic) {
            unwrapInlineTag(["em", "i"]);
          } else {
            const em = document.createElement("em");
            em.style.fontStyle = "italic";
            try {
              savedRange.surroundContents(em);
            } catch {
              const contents = savedRange.extractContents();
              em.appendChild(contents);
              savedRange.insertNode(em);
            }
          }
        } else if (command === "bold") {
          if (currentlyBold) {
            unwrapInlineTag(["strong", "b"]);
          } else {
            const strong = document.createElement("strong");
            strong.style.fontWeight = "bold";
            try {
              savedRange.surroundContents(strong);
            } catch {
              const contents = savedRange.extractContents();
              strong.appendChild(contents);
              savedRange.insertNode(strong);
            }
          }
        }
      } catch (err) {
        console.warn("Fallback formatting error:", err);
      }
    }

    setTimeout(updateToolbarPosition, 10);
  };

  const handleBold = (e) => {
    e.preventDefault();
    executeCommand("bold");
  };

  const handleItalic = (e) => {
    e.preventDefault();
    executeCommand("italic");
  };

  const handleList = (e) => {
    e.preventDefault();
    executeCommand("insertUnorderedList");
  };

  const handleAlignLeft = (e) => {
    e.preventDefault();
    executeCommand("justifyLeft");
  };

  const handleAlignCenter = (e) => {
    e.preventDefault();
    executeCommand("justifyCenter");
  };

  const handleAlignRight = (e) => {
    e.preventDefault();
    executeCommand("justifyRight");
  };

  // Kích hoạt AI Trau chuốt cho đoạn text được bôi đen
  const handleOpenAi = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange());
    }

    setAiModalOpen(true);
    generateAiSuggestions(selectedText, "concise");
  };

  const generateAiSuggestions = async (text, tone) => {
    if (!text?.trim()) {
      showToast("Vui lòng bôi đen nội dung cần AI chỉnh sửa.", "warning");
      return;
    }

    setAiGenerating(true);
    setAiTone(tone);
    setAiResult("");

    try {
      const response = await api.post("/api/user/cvs/ai/rewrite", {
        cvId,
        text: text.trim(),
        tone,
      });
      setAiResult(response.data.rewrittenText || "");
    } catch (error) {
      const message = error?.response?.data?.message || "AI chưa thể xử lý nội dung. Vui lòng thử lại.";
      showToast(message, "error");
    } finally {
      setAiGenerating(false);
    }
  };

  // Thay thế đoạn bôi đen bằng kết quả AI
  const handleApplyAiResult = () => {
    if (!aiResult) return;

    const appliedToState = onApplyText?.(selectedText, aiResult) === true;

    if (!appliedToState && activeInputRef.current) {
      const el = activeInputRef.current;
      const { start, end } = inputSelectionRef.current;
      const before = el.value.substring(0, start);
      const after = el.value.substring(end);
      const newValue = before + aiResult + after;

      const setter =
        el.tagName === "TEXTAREA"
          ? Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
          : Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

      if (setter) {
        setter.call(el, newValue);
      } else {
        el.value = newValue;
      }

      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    } else if (!appliedToState && savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(savedRange);
        document.execCommand("insertText", false, aiResult);
      }
    }
    setAiModalOpen(false);
    setIsVisible(false);
    setPosition(null);
  };

  // Render Modal AI Viết lại đoạn văn
  const renderAiModal = () => (
    <Dialog
      open={aiModalOpen}
      onClose={() => setAiModalOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ p: 0.8, bgcolor: "#eff6ff", borderRadius: "8px", color: "#2563eb", display: "flex" }}>
            <Wand2 size={18} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
              AI Trau Chuốt Đoạn Văn
            </Typography>
            <Typography variant="caption" color="#64748b">
              Viết lại câu từ chuyên nghiệp, chuẩn Action-Verbs và ATS
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={() => setAiModalOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        {/* Đoạn văn gốc */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase" }}>
            Đoạn văn gốc được chọn:
          </Typography>
          <Box
            sx={{
              p: 1.5,
              bgcolor: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              fontSize: "0.85rem",
              color: "#475569",
              fontStyle: "italic",
              mt: 0.5,
            }}
          >
            "{selectedText}"
          </Box>
        </Box>

        {/* Chọn phong cách viết */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" fontWeight={700} color="#64748b" sx={{ textTransform: "uppercase", display: "block", mb: 0.8 }}>
            Chọn phong cách trau chuốt:
          </Typography>
          <Stack direction="row" spacing={1}>
            <button
              type="button"
              onClick={() => generateAiSuggestions(selectedText, "concise")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: aiTone === "concise" ? "1px solid #1D61F2" : "1px solid #cbd5e1",
                backgroundColor: aiTone === "concise" ? "#eff6ff" : "#ffffff",
                color: aiTone === "concise" ? "#1D61F2" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              Ngắn gọn & Súc tích
            </button>
            <button
              type="button"
              onClick={() => generateAiSuggestions(selectedText, "star")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: aiTone === "star" ? "1px solid #1D61F2" : "1px solid #cbd5e1",
                backgroundColor: aiTone === "star" ? "#eff6ff" : "#ffffff",
                color: aiTone === "star" ? "#1D61F2" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              Chuẩn STAR (Đo lường)
            </button>
            <button
              type="button"
              onClick={() => generateAiSuggestions(selectedText, "polish")}
              style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                border: aiTone === "polish" ? "1px solid #1D61F2" : "1px solid #cbd5e1",
                backgroundColor: aiTone === "polish" ? "#eff6ff" : "#ffffff",
                color: aiTone === "polish" ? "#1D61F2" : "#475569",
                transition: "all 0.15s ease",
              }}
            >
              Sửa lỗi & Từ vựng mạnh
            </button>
          </Stack>
        </Box>

        {/* Kết quả AI */}
        <Box>
          <Typography variant="caption" fontWeight={700} color="#1D61F2" sx={{ textTransform: "uppercase" }}>
            Gợi ý từ AI:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "#eff6ff",
              borderRadius: "10px",
              border: "1px solid #bfdbfe",
              fontSize: "0.88rem",
              color: "#1e3a8a",
              lineHeight: 1.6,
              mt: 0.5,
              minHeight: 80,
              display: "flex",
              alignItems: aiGenerating ? "center" : "flex-start",
              justifyContent: aiGenerating ? "center" : "flex-start",
              whiteSpace: "pre-line",
            }}
          >
            {aiGenerating ? (
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CircularProgress size={18} thickness={5} />
                <Typography variant="body2" color="#2563eb" fontWeight={600}>
                  AI đang phân tích và viết lại...
                </Typography>
              </Stack>
            ) : (
              aiResult || "Chưa có gợi ý."
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={() => setAiModalOpen(false)}
          sx={{ textTransform: "none", color: "#64748b", fontWeight: 600 }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          disabled={aiGenerating || !aiResult}
          onClick={handleApplyAiResult}
          startIcon={<Check size={16} />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#1D61F2",
            borderRadius: "8px",
            px: 2.2,
            "&:hover": { bgcolor: "#1752cd" },
          }}
        >
          Áp dụng vào CV
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!isVisible || !position) {
    return aiModalOpen ? renderAiModal() : null;
  }

  return createPortal(
    <>
      {/* Floating Bubble Toolbar (Dark Pill) */}
      <div
        ref={toolbarRef}
        onMouseDown={(e) => {
          e.preventDefault();
        }}
        style={{
          position: "fixed",
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%)",
          zIndex: 999999,
          backgroundColor: "#0f172a",
          color: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 0 1px 1px rgba(255, 255, 255, 0.1)",
          padding: "3px 6px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "2px",
          userSelect: "none",
          whiteSpace: "nowrap",
          pointerEvents: "auto",
          border: "1px solid #1e293b",
          fontFamily: "'Inter', sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* Nút Bold */}
        <ToolbarButton onClick={handleBold} title="In đậm (Bold - Ctrl+B)" active={formatState.bold}>
          <Bold size={14} />
        </ToolbarButton>

        {/* Nút Italic */}
        <ToolbarButton onClick={handleItalic} title="In nghiêng (Italic - Ctrl+I)" active={formatState.italic}>
          <Italic size={14} />
        </ToolbarButton>

        {/* Nút Bullet List */}
        <ToolbarButton onClick={handleList} title="Gạch đầu dòng (Bullet List)">
          <List size={14} />
        </ToolbarButton>

        {/* Divider 1 */}
        <div
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "#334155",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />

        {/* Nút Align Left */}
        <ToolbarButton onClick={handleAlignLeft} title="Căn trái">
          <AlignLeft size={14} />
        </ToolbarButton>

        {/* Nút Align Center */}
        <ToolbarButton onClick={handleAlignCenter} title="Căn giữa">
          <AlignCenter size={14} />
        </ToolbarButton>

        {/* Nút Align Right */}
        <ToolbarButton onClick={handleAlignRight} title="Căn phải">
          <AlignRight size={14} />
        </ToolbarButton>

        {/* Divider 2 */}
        <div
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "#334155",
            margin: "0 4px",
            flexShrink: 0,
          }}
        />

        {/* Nút AI */}
        <ToolbarButton onClick={handleOpenAi} title="AI trau chuốt câu từ" isAi>
          <Sparkles size={13} style={{ color: "#ffffff" }} />
          <span>AI</span>
        </ToolbarButton>

        {/* Mũi tên chỉ hướng caret */}
        {position.placement === "top" ? (
          <div
            style={{
              position: "absolute",
              bottom: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid #0f172a",
              pointerEvents: "none",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: "-6px",
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderBottom: "6px solid #0f172a",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Modal AI */}
      {renderAiModal()}
    </>,
    document.body
  );
}

function ToolbarButton({ onClick, title, active, children, isAi }) {
  const [isHovered, setIsHovered] = useState(false);

  if (isAi) {
    return (
      <button
        type="button"
        onClick={onClick}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={title}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          height: "28px",
          padding: "0 10px",
          borderRadius: "6px",
          backgroundColor: isHovered ? "#1752cd" : "#1D61F2",
          color: "#ffffff",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          fontWeight: 700,
          transition: "background-color 0.15s ease",
          flexShrink: 0,
          outline: "none",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        backgroundColor: active
          ? "#334155"
          : isHovered
          ? "#1e293b"
          : "transparent",
        color: active ? "#38bdf8" : isHovered ? "#ffffff" : "#cbd5e1",
        border: "none",
        cursor: "pointer",
        transition: "all 0.15s ease",
        flexShrink: 0,
        outline: "none",
        padding: 0,
      }}
    >
      {children}
    </button>
  );
}
