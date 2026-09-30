import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Chip,
  Avatar,
  Tooltip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  DeleteOutline as DeleteIcon,
  CameraAlt as CameraIcon,
  Person as PersonIcon,
  WorkOutline as WorkIcon,
  SchoolOutlined as SchoolIcon,
  PsychologyOutlined as SkillIcon,
  DescriptionOutlined as SummaryIcon,
  FolderOpenOutlined as ProjectIcon,
  NotesOutlined as CustomSectionIcon,
} from "@mui/icons-material";
import { FileText, Layers, Plus } from "lucide-react";
import axios from "../../services/axios";
import { getCurrentUserId } from "../../services/cv/cvAnalysisStorage";
import { useToast } from "../../contexts/ToastContext";
import CVStudioTopBar from "../../components/cv/CVStudioTopBar";
import CVSectionReorder from "../../components/cv/CVSectionReorder";
import CVFloatingSelectionToolbar from "../../components/cv/CVFloatingSelectionToolbar";
import ModernTwoColumnTemplate from "../../components/cv/templates/ModernTwoColumnTemplate";
import ClassicTemplate from "../../components/cv/templates/ClassicTemplate";

const getAutoSaveKey = () => `cv-builder-autosave-${getCurrentUserId() || "guest"}`;

// Dữ liệu khởi tạo mẫu chuẩn tiếng Việt để người dùng dễ hình dung
const INITIAL_CV_DATA = {
  personalInfo: {
    fullName: "Nguyễn Văn An",
    title: "Senior Fullstack Developer",
    email: "an.nguyen@example.com",
    phone: "0987 654 321",
    github: "github.com/annguyen-dev",
    linkedin: "linkedin.com/in/annguyen-dev",
    avatarUrl: "",
  },
  summary:
    "Kỹ sư phần mềm với hơn 3 năm kinh nghiệm phát triển ứng dụng Web quy mô lớn với React.js, Node.js và Spring Boot. Đam mê thiết kế Clean Architecture, tối ưu hóa trải nghiệm người dùng và áp dụng CI/CD tự động hóa.",
  experience: [
    {
      role: "Senior Frontend Developer",
      company: "FPT Software",
      startDate: "06/2023",
      endDate: "Hiện tại",
      description:
        "• Chịu trách nhiệm kiến trúc Frontend hệ thống Enterprise Dashboard phục vụ 100,000+ người dùng.\n• Tối ưu thời gian tải trang ban đầu (FCP) giảm 40% bằng code-splitting và caching.\n• Dẫn dắt và đào tạo 4 junior developers theo chuẩn Clean Code & TypeScript.",
    },
    {
      role: "Fullstack Web Developer",
      company: "VNG Corporation",
      startDate: "01/2021",
      endDate: "05/2023",
      description:
        "• Xây dựng hệ thống thanh toán điện tử tích hợp cổng ZaloPay và VNPay.\n• Thiết kế RESTful APIs với Node.js Express và PostgreSQL, xử lý 1,500 transactions/phút.\n• Triển khai container hóa với Docker và Kubernetes trên hạ tầng AWS.",
    },
  ],
  education: [
    {
      degree: "Kỹ sư Công nghệ Thông tin",
      school: "Đại học Bách Khoa Hà Nội",
      startDate: "2017",
      endDate: "2021",
    },
  ],
  skills: [
    "JavaScript / TypeScript",
    "React.js & Next.js",
    "Node.js (Express/NestJS)",
    "Java Spring Boot",
    "PostgreSQL & MongoDB",
    "Docker & Kubernetes",
    "CI/CD Pipeline",
    "Git & Agile/Scrum",
  ],
  customSections: [],
  projects: [
    {
      name: "E-Commerce Microservices Platform",
      role: "Lead Developer",
      link: "github.com/annguyen/ecommerce-platform",
      description:
        "Hệ thống bán lẻ đa kênh áp dụng kiến trúc Event-driven với Apache Kafka, hỗ trợ thanh toán trực tuyến và gợi ý sản phẩm AI.",
    },
  ],
};

// Hàm đọc cấu hình và dữ liệu đã lưu trong localStorage một cách đồng bộ ngay lập tức
const getInitialStoredState = () => {
  try {
    const raw = localStorage.getItem(getAutoSaveKey());
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        cvData: parsed.cvData ? { ...INITIAL_CV_DATA, ...parsed.cvData } : INITIAL_CV_DATA,
        settings: parsed.settings || {},
      };
    }
  } catch {}
  return { cvData: INITIAL_CV_DATA, settings: {} };
};

export default function CVBuilder() {
  const initialStored = getInitialStoredState();

  // Dữ liệu nội dung CV
  const [cvData, setCvData] = useState(initialStored.cvData);

  // Cấu hình giao diện và mẫu CV ("modern" | "classic")
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialStored.settings?.selectedTemplate || "modern"
  );
  const [primaryColor, setPrimaryColor] = useState(
    initialStored.settings?.primaryColor || "#1D61F2"
  );
  const [fontFamily, setFontFamily] = useState(
    initialStored.settings?.fontFamily || "Inter, sans-serif"
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeLeftTab, setActiveLeftTab] = useState("content"); // 'content' | 'reorder'
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved"); // 'saving' | 'saved' | 'error'
  const [savedCvId, setSavedCvId] = useState(null);

  // Thứ tự và mảng các khối bị ẩn
  const [sectionOrder, setSectionOrder] = useState(
    initialStored.settings?.sectionOrder || [
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "customSections",
    ]
  );
  const [hiddenSections, setHiddenSections] = useState(
    Array.isArray(initialStored.settings?.hiddenSections)
      ? initialStored.settings.hiddenSections
      : []
  );

  // Trạng thái nhập kỹ năng
  const [skillInput, setSkillInput] = useState("");
  const avatarInputRef = useRef(null);
  const printRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const lastSavedSnapshotRef = useRef("");
  const hasLoadedRef = useRef(false);
  const showToast = useToast();

  const [avatarPreview, setAvatarPreview] = useState(
    initialStored.cvData?.personalInfo?.avatarUrl || null
  );

  // Phím tắt Undo / Redo lịch sử
  const historyRef = useRef([initialStored.cvData]);
  const historyIndexRef = useRef(0);
  const isHistoryActionRef = useRef(false);

  // Xử lý chọn Template: Cập nhật state và lưu ngay vào localStorage
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
    try {
      const key = getAutoSaveKey();
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      const updated = {
        ...existing,
        settings: {
          ...(existing.settings || {}),
          selectedTemplate: templateId,
          primaryColor,
          fontFamily,
          sectionOrder,
          hiddenSections,
        },
      };
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  };

  const handleSelectColor = (color) => {
    setPrimaryColor(color);
    try {
      const key = getAutoSaveKey();
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing.settings = { ...(existing.settings || {}), primaryColor: color };
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  };

  const handleSelectFont = (font) => {
    setFontFamily(font);
    try {
      const key = getAutoSaveKey();
      const existing = JSON.parse(localStorage.getItem(key) || "{}");
      existing.settings = { ...(existing.settings || {}), fontFamily: font };
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {}
  };

  // Tải bản CV mới nhất của User từ Backend API
  useEffect(() => {
    let active = true;

    const loadLatestSavedCv = async () => {
      try {
        const response = await axios.get("/api/user/cvs");
        const latestCv = response.data?.[0];
        if (!active) return;
        if (!latestCv?.cvText) {
          const localDraft = localStorage.getItem(getAutoSaveKey());
          if (localDraft) {
            const draft = JSON.parse(localDraft);
            const settings = draft.settings || {};
            setCvData((prev) => ({ ...prev, ...(draft.cvData || {}) }));
            if (draft.cvData?.personalInfo?.avatarUrl) {
              setAvatarPreview(draft.cvData.personalInfo.avatarUrl);
            }
            if (settings.selectedTemplate) setSelectedTemplate(settings.selectedTemplate);
            if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
            if (settings.fontFamily) setFontFamily(settings.fontFamily);
            if (settings.sectionOrder) setSectionOrder(settings.sectionOrder);
            if (settings.hiddenSections) {
              setHiddenSections(Array.isArray(settings.hiddenSections) ? settings.hiddenSections : []);
            }
          }
          return;
        }

        const parsed = JSON.parse(latestCv.cvText);
        const settings = parsed.settings || {};
        setSavedCvId(latestCv.cvId);
        const loadedCvData = parsed.cvData || parsed;
        setCvData((prev) => ({ ...prev, ...loadedCvData }));
        if (loadedCvData?.personalInfo?.avatarUrl) {
          setAvatarPreview(loadedCvData.personalInfo.avatarUrl);
        }
        if (settings.selectedTemplate) setSelectedTemplate(settings.selectedTemplate);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
        if (settings.fontFamily) setFontFamily(settings.fontFamily);
        if (settings.sectionOrder) setSectionOrder(settings.sectionOrder);
        if (settings.hiddenSections) {
          setHiddenSections(Array.isArray(settings.hiddenSections) ? settings.hiddenSections : []);
        }

        lastSavedSnapshotRef.current = JSON.stringify({
          ...loadedCvData,
          settings,
        });
      } catch {
        const localDraft = localStorage.getItem(getAutoSaveKey());
        if (localDraft) {
          try {
            const draft = JSON.parse(localDraft);
            const settings = draft.settings || {};
            setCvData((prev) => ({ ...prev, ...(draft.cvData || {}) }));
            if (draft.cvData?.personalInfo?.avatarUrl) {
              setAvatarPreview(draft.cvData.personalInfo.avatarUrl);
            }
            if (settings.selectedTemplate) setSelectedTemplate(settings.selectedTemplate);
            if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
            if (settings.fontFamily) setFontFamily(settings.fontFamily);
            if (settings.sectionOrder) setSectionOrder(settings.sectionOrder);
            if (settings.hiddenSections) {
              setHiddenSections(Array.isArray(settings.hiddenSections) ? settings.hiddenSections : []);
            }
          } catch {}
        }
      } finally {
        if (active) {
          hasLoadedRef.current = true;
        }
      }
    };

    loadLatestSavedCv();
    return () => {
      active = false;
    };
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${cvData.personalInfo.fullName || "CV"}_Resume`,
  });

  // Toggle ẩn / hiện khối (lưu dưới dạng mảng các sectionKey bị ẩn)
  const handleToggleHide = (sectionKey) => {
    setHiddenSections((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      if (arr.includes(sectionKey)) {
        return arr.filter((k) => k !== sectionKey);
      } else {
        return [...arr, sectionKey];
      }
    });
  };

  // Cập nhật thứ tự các khối
  const handleReorder = (newOrder) => {
    setSectionOrder(newOrder);
  };

  // Cập nhật thông tin cá nhân
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  // Cập nhật tóm tắt
  const handleSummaryChange = (e) => {
    setCvData((prev) => ({ ...prev, summary: e.target.value }));
  };

  // Quản lý mảng (Experience, Education, Projects, CustomSections)
  const addArrayItem = (key, defaultObj) => {
    setCvData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), defaultObj],
    }));
  };

  const removeArrayItem = (key, index) => {
    setCvData((prev) => {
      const arr = [...(prev[key] || [])];
      arr.splice(index, 1);
      return { ...prev, [key]: arr };
    });
  };

  const updateArrayItem = (key, index, field, value) => {
    setCvData((prev) => {
      const arr = [...(prev[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [key]: arr };
    });
  };

  // Quản lý Kỹ năng (Chips)
  const addSkill = () => {
    if (!skillInput.trim()) return;
    setCvData((prev) => ({
      ...prev,
      skills: [...prev.skills, skillInput.trim()],
    }));
    setSkillInput("");
  };

  const removeSkill = (idx) =>
    setCvData((prev) => {
      const s = [...prev.skills];
      s.splice(idx, 1);
      return { ...prev, skills: s };
    });

  /* Upload Avatar: Chuyển đổi thành Base64 Data URL chuẩn và nén nhẹ với Canvas để lưu vĩnh viễn */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      if (showToast && typeof showToast.warning === "function") {
        showToast.warning("Vui lòng chọn file ảnh (JPG, PNG...)");
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (showToast && typeof showToast.warning === "function") {
        showToast.warning("Dung lượng ảnh tối đa là 5MB");
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Str = event.target?.result;
      if (!base64Str) return;

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);

        setAvatarPreview(optimizedDataUrl);
        setCvData((prev) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, avatarUrl: optimizedDataUrl },
        }));

        if (showToast && typeof showToast.success === "function") {
          showToast.success("Đã tải ảnh lên và lưu vào bản nháp!");
        }
      };
      img.src = base64Str;
    };
    reader.readAsDataURL(file);
  };

  /* Xóa ảnh đại diện */
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, avatarUrl: "" },
    }));
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
    if (showToast && typeof showToast.info === "function") {
      showToast.info("Đã gỡ ảnh đại diện");
    }
  };

  /* Chỉnh sửa nội dung trực tiếp trên bản xem trước (Inline Editing) */
  const handleInlineUpdate = (path, newText) => {
    if (!path) return;
    setCvData((prev) => {
      const cloned = { ...prev };
      const parts = path.split(".");
      if (parts.length === 1) {
        cloned[parts[0]] = newText;
      } else if (parts.length === 2) {
        const [parent, child] = parts;
        if (Array.isArray(cloned[parent])) {
          const list = [...cloned[parent]];
          list[Number(child)] = newText;
          cloned[parent] = list;
        } else {
          cloned[parent] = { ...cloned[parent], [child]: newText };
        }
      } else if (parts.length === 3) {
        const [section, idxStr, field] = parts;
        const idx = parseInt(idxStr, 10);
        if (Array.isArray(cloned[section]) && cloned[section][idx]) {
          const list = [...cloned[section]];
          list[idx] = { ...list[idx], [field]: newText };
          cloned[section] = list;
        }
      }
      return cloned;
    });
  };

  /* Tự động lưu (Auto-save) vào LocalStorage & Backend API */
  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const settings = { selectedTemplate, primaryColor, fontFamily, sectionOrder, hiddenSections };
    const snapshot = JSON.stringify({ ...cvData, settings });
    if (snapshot === lastSavedSnapshotRef.current) return;

    localStorage.setItem(
      getAutoSaveKey(),
      JSON.stringify({ cvData, settings, updatedAt: new Date().toISOString() })
    );
    setAutoSaveStatus("saving");
    clearTimeout(autoSaveTimerRef.current);

    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const payload = {
          fileName: `${cvData.personalInfo.fullName || "Untitled"}_CV`,
          cvText: JSON.stringify({ cvData, settings }),
        };

        if (savedCvId) {
          await axios.put(`/api/user/cvs/${savedCvId}`, payload);
        } else {
          const createRes = await axios.post("/api/user/cvs", payload);
          if (createRes.data?.cvId) {
            setSavedCvId(createRes.data.cvId);
          }
        }
        lastSavedSnapshotRef.current = snapshot;
        setAutoSaveStatus("saved");
      } catch {
        setAutoSaveStatus("local");
      }
    }, 1500);

    return () => clearTimeout(autoSaveTimerRef.current);
  }, [cvData, selectedTemplate, primaryColor, fontFamily, sectionOrder, hiddenSections, savedCvId]);

  // Ghi nhận lịch sử phục vụ Undo / Redo
  useEffect(() => {
    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      return;
    }
    const currentHist = historyRef.current.slice(0, historyIndexRef.current + 1);
    currentHist.push(cvData);
    if (currentHist.length > 25) currentHist.shift();
    historyRef.current = currentHist;
    historyIndexRef.current = currentHist.length - 1;
  }, [cvData]);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      isHistoryActionRef.current = true;
      const target = historyRef.current[historyIndexRef.current];
      setCvData(target);
      if (target?.personalInfo?.avatarUrl) {
        setAvatarPreview(target.personalInfo.avatarUrl);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      isHistoryActionRef.current = true;
      const target = historyRef.current[historyIndexRef.current];
      setCvData(target);
      if (target?.personalInfo?.avatarUrl) {
        setAvatarPreview(target.personalInfo.avatarUrl);
      }
    }
  };

  // Thuộc tính tiện ích
  const personalInfo = cvData.personalInfo || {};
  const experience = cvData.experience || [];
  const education = cvData.education || [];
  const skills = cvData.skills || [];
  const projects = cvData.projects || [];
  const customSections = cvData.customSections || [];

  const isModern = selectedTemplate === "modern" || selectedTemplate === "template-modern";

  return (
    <Box sx={{ bgcolor: "#F4F6F8", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 1. TOP BAR ĐIỀU KHIỂN & CÔNG CỤ */}
      <CVStudioTopBar
        selectedTemplate={selectedTemplate}
        onSelectTemplate={handleSelectTemplate}
        primaryColor={primaryColor}
        onSelectColor={handleSelectColor}
        fontFamily={fontFamily}
        onSelectFont={handleSelectFont}
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        onPrint={handlePrint}
        onDownload={handlePrint}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndexRef.current > 0}
        canRedo={historyIndexRef.current < historyRef.current.length - 1}
        autoSaveStatus={autoSaveStatus}
        activeTab={activeLeftTab}
        setActiveTab={setActiveLeftTab}
      />

      {/* 2. BODY CHÍNH: CỘT NHẬP DỮ LIỆU & BẢN XEM TRƯỚC */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN & SẮP XẾP KHỐI (410px) */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: "100%", md: 410 },
            borderRight: "1px solid #E2E8F0",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 64px)",
            zIndex: 10,
          }}
        >
          {/* Header Chuyển Tab Bên Trái */}
          <Box sx={{ p: 2, borderBottom: "1px solid #e2e8f0" }}>
            <Stack direction="row" spacing={1} sx={{ bgcolor: "#f1f5f9", p: 0.5, borderRadius: "10px" }}>
              <Button
                fullWidth
                size="small"
                startIcon={<FileText size={16} />}
                onClick={() => setActiveLeftTab("content")}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  bgcolor: activeLeftTab === "content" ? "#ffffff" : "transparent",
                  color: activeLeftTab === "content" ? "#1D61F2" : "#64748b",
                  boxShadow: activeLeftTab === "content" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  "&:hover": { bgcolor: activeLeftTab === "content" ? "#ffffff" : "rgba(0,0,0,0.03)" },
                }}
              >
                Nội dung CV
              </Button>
              <Button
                fullWidth
                size="small"
                startIcon={<Layers size={16} />}
                onClick={() => setActiveLeftTab("reorder")}
                sx={{
                  borderRadius: "8px",
                  fontWeight: 800,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  bgcolor: activeLeftTab === "reorder" ? "#ffffff" : "transparent",
                  color: activeLeftTab === "reorder" ? "#1D61F2" : "#64748b",
                  boxShadow: activeLeftTab === "reorder" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  "&:hover": { bgcolor: activeLeftTab === "reorder" ? "#ffffff" : "rgba(0,0,0,0.03)" },
                }}
              >
                Bố cục & Ẩn/Hiện
              </Button>
            </Stack>
          </Box>

          {/* Nội dung danh mục hoặc Kéo thả sắp xếp */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {activeLeftTab === "reorder" ? (
              <CVSectionReorder
                sectionOrder={sectionOrder}
                onReorder={handleReorder}
                setSectionOrder={handleReorder}
                hiddenSections={hiddenSections}
                onToggleHide={handleToggleHide}
              />
            ) : (
              /* TAB NỘI DUNG (ACCORDION CÁC KHỐI) */
              <Stack spacing={1.5}>
                {/* 1. Thông tin cá nhân */}
                <Accordion defaultExpanded elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PersonIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Thông tin cá nhân
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={1.8}>
                      {/* Avatar Upload */}
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ pb: 0.5 }}>
                        <Box sx={{ position: "relative" }}>
                          <Avatar
                            src={avatarPreview || personalInfo.avatarUrl}
                            sx={{
                              width: 68,
                              height: 68,
                              border: `2px solid ${primaryColor}`,
                              bgcolor: "#eff6ff",
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 32, color: primaryColor }} />
                          </Avatar>
                          <Tooltip title="Đổi ảnh đại diện">
                            <IconButton
                              size="small"
                              onClick={() => avatarInputRef.current?.click()}
                              sx={{
                                position: "absolute",
                                bottom: -2,
                                right: -2,
                                bgcolor: primaryColor,
                                color: "#fff",
                                width: 24,
                                height: 24,
                                "&:hover": { bgcolor: "#1752cd" },
                              }}
                            >
                              <CameraIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Tooltip>
                          <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="#334155">
                            Ảnh đại diện
                          </Typography>
                          <Typography variant="caption" color="#94a3b8" sx={{ display: "block", mb: 0.5 }}>
                            Hỗ trợ JPG, PNG (tự động lưu vĩnh viễn)
                          </Typography>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => avatarInputRef.current?.click()}
                              sx={{ textTransform: "none", fontSize: "0.72rem", py: 0.2, px: 1, borderRadius: "6px" }}
                            >
                              Tải ảnh lên
                            </Button>
                            {(avatarPreview || personalInfo.avatarUrl) && (
                              <Button
                                size="small"
                                color="error"
                                onClick={handleRemoveAvatar}
                                sx={{ textTransform: "none", fontSize: "0.72rem", py: 0.2, px: 1 }}
                              >
                                Xóa ảnh
                              </Button>
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      <TextField fullWidth size="small" label="Họ và tên" name="fullName" value={personalInfo.fullName || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Chức danh mong muốn" name="title" value={personalInfo.title || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Email" name="email" value={personalInfo.email || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Số điện thoại" name="phone" value={personalInfo.phone || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="GitHub Profile" name="github" value={personalInfo.github || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="LinkedIn Profile" name="linkedin" value={personalInfo.linkedin || ""} onChange={handlePersonalInfoChange} />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 2. Mục tiêu nghề nghiệp / Giới thiệu */}
                <Accordion defaultExpanded elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SummaryIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Tóm tắt / Mục tiêu nghề nghiệp
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      size="small"
                      placeholder="Viết đoạn văn ngắn 2-4 câu nổi bật kinh nghiệm và mục tiêu làm việc..."
                      value={cvData.summary || ""}
                      onChange={handleSummaryChange}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* 3. Kinh nghiệm làm việc */}
                <Accordion defaultExpanded elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WorkIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Kinh nghiệm làm việc ({experience.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={2}>
                      {experience.map((exp, idx) => (
                        <Box key={idx} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption" fontWeight={800} color="#1D61F2">
                              Kinh nghiệm #{idx + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeArrayItem("experience", idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Stack spacing={1.2}>
                            <TextField fullWidth size="small" label="Chức danh / Vị trí" value={exp.role || ""} onChange={(e) => updateArrayItem("experience", idx, "role", e.target.value)} />
                            <TextField fullWidth size="small" label="Tên công ty" value={exp.company || ""} onChange={(e) => updateArrayItem("experience", idx, "company", e.target.value)} />
                            <Stack direction="row" spacing={1}>
                              <TextField fullWidth size="small" label="Bắt đầu" placeholder="MM/YYYY" value={exp.startDate || ""} onChange={(e) => updateArrayItem("experience", idx, "startDate", e.target.value)} />
                              <TextField fullWidth size="small" label="Kết thúc" placeholder="MM/YYYY hoặc Hiện tại" value={exp.endDate || ""} onChange={(e) => updateArrayItem("experience", idx, "endDate", e.target.value)} />
                            </Stack>
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              minRows={3}
                              label="Mô tả công việc & Thành tích nổi bật"
                              placeholder="• Sử dụng dấu gạch đầu dòng để làm nổi bật thành tích..."
                              value={exp.description || ""}
                              onChange={(e) => updateArrayItem("experience", idx, "description", e.target.value)}
                            />
                          </Stack>
                        </Box>
                      ))}

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        onClick={() => addArrayItem("experience", { role: "", company: "", startDate: "", endDate: "", description: "" })}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#cbd5e1", color: "#1D61F2" }}
                      >
                        Thêm kinh nghiệm
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 4. Học vấn */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SchoolIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Học vấn ({education.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={2}>
                      {education.map((edu, idx) => (
                        <Box key={idx} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption" fontWeight={800} color="#1D61F2">
                              Học vấn #{idx + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeArrayItem("education", idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Stack spacing={1.2}>
                            <TextField fullWidth size="small" label="Bằng cấp / Chuyên ngành" value={edu.degree || ""} onChange={(e) => updateArrayItem("education", idx, "degree", e.target.value)} />
                            <TextField fullWidth size="small" label="Trường đào tạo" value={edu.school || ""} onChange={(e) => updateArrayItem("education", idx, "school", e.target.value)} />
                            <Stack direction="row" spacing={1}>
                              <TextField fullWidth size="small" label="Bắt đầu" placeholder="YYYY" value={edu.startDate || ""} onChange={(e) => updateArrayItem("education", idx, "startDate", e.target.value)} />
                              <TextField fullWidth size="small" label="Kết thúc" placeholder="YYYY" value={edu.endDate || ""} onChange={(e) => updateArrayItem("education", idx, "endDate", e.target.value)} />
                            </Stack>
                          </Stack>
                        </Box>
                      ))}

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        onClick={() => addArrayItem("education", { degree: "", school: "", startDate: "", endDate: "" })}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#cbd5e1", color: "#1D61F2" }}
                      >
                        Thêm học vấn
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 5. Kỹ năng */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SkillIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Kỹ năng ({skills.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Ví dụ: React.js, Docker, Scrum..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addSkill();
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={addSkill}
                          sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#1D61F2" }}
                        >
                          Thêm
                        </Button>
                      </Stack>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, pt: 0.5 }}>
                        {skills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            onDelete={() => removeSkill(idx)}
                            size="small"
                            sx={{ fontWeight: 600, bgcolor: "#eff6ff", color: "#1D61F2", borderColor: "#bfdbfe" }}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 6. Dự án nổi bật */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ProjectIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Dự án nổi bật ({projects.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={2}>
                      {projects.map((proj, idx) => (
                        <Box key={idx} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption" fontWeight={800} color="#1D61F2">
                              Dự án #{idx + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeArrayItem("projects", idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Stack spacing={1.2}>
                            <TextField fullWidth size="small" label="Tên dự án" value={proj.name || ""} onChange={(e) => updateArrayItem("projects", idx, "name", e.target.value)} />
                            <TextField fullWidth size="small" label="Vai trò trong dự án" value={proj.role || ""} onChange={(e) => updateArrayItem("projects", idx, "role", e.target.value)} />
                            <TextField fullWidth size="small" label="Link dự án / Demo / GitHub" value={proj.link || ""} onChange={(e) => updateArrayItem("projects", idx, "link", e.target.value)} />
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              minRows={2}
                              label="Mô tả công nghệ & Kết quả đạt được"
                              value={proj.description || ""}
                              onChange={(e) => updateArrayItem("projects", idx, "description", e.target.value)}
                            />
                          </Stack>
                        </Box>
                      ))}

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        onClick={() => addArrayItem("projects", { name: "", role: "", link: "", description: "" })}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#cbd5e1", color: "#1D61F2" }}
                      >
                        Thêm dự án
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 7. Khối tùy chỉnh thêm */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CustomSectionIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Mục bổ sung ({customSections.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={2}>
                      {customSections.map((sec, idx) => (
                        <Box key={idx} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption" fontWeight={800} color="#1D61F2">
                              Mục #{idx + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeArrayItem("customSections", idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Stack spacing={1.2}>
                            <TextField fullWidth size="small" label="Tiêu đề mục (VD: Chứng chỉ, Giải thưởng)" value={sec.title || ""} onChange={(e) => updateArrayItem("customSections", idx, "title", e.target.value)} />
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              minRows={2}
                              label="Nội dung chi tiết"
                              value={sec.content || ""}
                              onChange={(e) => updateArrayItem("customSections", idx, "content", e.target.value)}
                            />
                          </Stack>
                        </Box>
                      ))}

                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        startIcon={<Plus size={16} />}
                        onClick={() => addArrayItem("customSections", { title: "", content: "" })}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#cbd5e1", color: "#1D61F2" }}
                      >
                        Thêm mục tùy chỉnh
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            )}
          </Box>
        </Paper>

        {/* CỘT PHẢI: KHÔNG GIAN XEM TRƯỚC VÀ IN ẤN CANVAS A4 */}
        <Box
          sx={{
            flex: 1,
            height: "calc(100vh - 64px)",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 2, md: 4 },
            bgcolor: "#f1f5f9",
          }}
        >
          {/* Vùng Canvas A4 với Zoom Level */}
          <Box
            sx={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "top center",
              transition: "transform 0.15s ease-out",
              mb: 8,
            }}
          >
            <Paper
              ref={printRef}
              elevation={4}
              sx={{
                width: "210mm",
                minHeight: "297mm",
                bgcolor: "#ffffff",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                borderRadius: "2px",
                overflow: "hidden",
                boxSizing: "border-box",
                fontFamily: fontFamily,
              }}
            >
              {isModern ? (
                <ModernTwoColumnTemplate
                  data={cvData}
                  cvData={cvData}
                  primaryColor={primaryColor}
                  fontFamily={fontFamily}
                  sectionOrder={sectionOrder}
                  hiddenSections={hiddenSections}
                  onInlineUpdate={handleInlineUpdate}
                />
              ) : (
                <ClassicTemplate
                  data={cvData}
                  cvData={cvData}
                  primaryColor={primaryColor}
                  fontFamily={fontFamily}
                  sectionOrder={sectionOrder}
                  hiddenSections={hiddenSections}
                  onInlineUpdate={handleInlineUpdate}
                />
              )}
            </Paper>
          </Box>

          {/* Thanh công cụ định dạng nổi khi bôi đen văn bản (Floating Selection Toolbar) */}
          <CVFloatingSelectionToolbar />
        </Box>
      </Box>
    </Box>
  );
}
