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
  Add as AddIcon,
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

// Dữ liệu khởi tạo mẫu để người dùng dễ hình dung
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
        "• Chịu trách nhiệm kiến trúc Frontend hệ thống Enterprise Dashboard phục vụ 100,000+ người dùng.\n• Tối ưu thời gian tải trang ban đầu (FCP) giảm 40% bằng code-splitting và server-side caching.\n• Dẫn dắt và đào tạo 4 junior developers theo chuẩn Clean Code & TypeScript.",
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

export default function CVBuilder() {
  const [activeTab, setActiveTab] = useState("content"); // 'content' | 'reorder'
  const [selectedTemplate, setSelectedTemplate] = useState("modern"); // 'modern' | 'classic'
  const [primaryColor, setPrimaryColor] = useState("#1D61F2");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [savedCvId, setSavedCvId] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("saved");
  const showToast = useToast();

  const printRef = useRef(null);
  const canvasRef = useRef(null);
  const splitViewRef = useRef(null);
  const avatarInputRef = useRef(null);
  const autoSaveTimerRef = useRef(null);
  const hasLoadedRef = useRef(false);
  const lastSavedSnapshotRef = useRef("");

  const [cvData, setCvData] = useState(INITIAL_CV_DATA);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [skillInput, setSkillInput] = useState("");

  // Sắp xếp và ẩn/hiện khối
  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
  ]);
  const [hiddenSections, setHiddenSections] = useState([]);

  // Kích hoạt In / Xuất PDF qua useReactToPrint
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
            if (settings.selectedTemplate) setSelectedTemplate(settings.selectedTemplate);
            if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
            if (settings.fontFamily) setFontFamily(settings.fontFamily);
            if (settings.sectionOrder) setSectionOrder(settings.sectionOrder);
            if (settings.hiddenSections) setHiddenSections(settings.hiddenSections);
          }
          return;
        }

        const parsed = JSON.parse(latestCv.cvText);
        const settings = parsed.settings || {};
        const content = { ...parsed };
        delete content.settings;

        setCvData((prev) => ({ ...prev, ...content }));
        setSavedCvId(latestCv.cvId);
        if (settings.selectedTemplate) setSelectedTemplate(settings.selectedTemplate);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
        if (settings.fontFamily) setFontFamily(settings.fontFamily);
        if (settings.sectionOrder) setSectionOrder(settings.sectionOrder);
        if (settings.hiddenSections) setHiddenSections(settings.hiddenSections);

        const localDraft = localStorage.getItem(getAutoSaveKey());
        if (localDraft) {
          const draft = JSON.parse(localDraft);
          const localSettings = draft.settings || {};
          setCvData((prev) => ({ ...prev, ...(draft.cvData || {}) }));
          if (localSettings.selectedTemplate) setSelectedTemplate(localSettings.selectedTemplate);
          if (localSettings.primaryColor) setPrimaryColor(localSettings.primaryColor);
          if (localSettings.fontFamily) setFontFamily(localSettings.fontFamily);
          if (localSettings.sectionOrder) setSectionOrder(localSettings.sectionOrder);
          if (localSettings.hiddenSections) setHiddenSections(localSettings.hiddenSections);
        }
      } catch (error) {
        if (error?.response?.status !== 404) {
          console.error("Không thể tải CV đã lưu:", error);
        }
      } finally {
        if (active) hasLoadedRef.current = true;
      }
    };

    loadLatestSavedCv();
    return () => { active = false; };
  }, []);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${cvData.personalInfo.fullName || "CV"}_Resume`,
  });

  // Toggle ẩn / hiện khối
  const handleToggleHide = (key) => {
    setHiddenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  /* ── Form Event Handlers ── */
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const handleSummaryChange = (e) =>
    setCvData((prev) => ({ ...prev, summary: e.target.value }));
  const handleApplyAiText = (originalText, rewrittenText) => {
    const source = originalText?.trim();
    if (!source || !rewrittenText) return false;

    let replaced = false;
    const replaceFirstMatch = (value) => {
      if (replaced) return value;
      if (typeof value === "string") {
        const index = value.indexOf(source);
        if (index === -1) return value;
        replaced = true;
        return value.slice(0, index) + rewrittenText + value.slice(index + source.length);
      }
      if (Array.isArray(value)) return value.map(replaceFirstMatch);
      if (value && typeof value === "object") {
        return Object.fromEntries(
          Object.entries(value).map(([key, nestedValue]) => [key, replaceFirstMatch(nestedValue)])
        );
      }
      return value;
    };

    setCvData((prev) => replaceFirstMatch(prev));
    return true;
  };

  const addArrayItem = (key, item) =>
    setCvData((prev) => ({ ...prev, [key]: [...prev[key], item] }));

  const updateArrayItem = (key, idx, field, value) =>
    setCvData((prev) => {
      const arr = [...prev[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
    });

  const removeArrayItem = (key, idx) =>
    setCvData((prev) => {
      const arr = [...prev[key]];
      arr.splice(idx, 1);
      return { ...prev, [key]: arr };
    });

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

  /* ── Upload Avatar ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn file ảnh (JPG, PNG...)", "warning");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, avatarUrl: previewUrl },
    }));
  };

  /* ── Lưu CV ── */
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
          cvText: snapshot,
        };
        const response = savedCvId
          ? await axios.put(`/api/user/cvs/${savedCvId}`, payload)
          : await axios.post("/api/user/cvs", payload);

        setSavedCvId(response.data.cvId);
        lastSavedSnapshotRef.current = snapshot;
        setAutoSaveStatus("saved");
      } catch (error) {
        console.error("Không thể tự động lưu CV:", error);
        setAutoSaveStatus("local");
      }
    }, 1500);

    return () => clearTimeout(autoSaveTimerRef.current);
  }, [cvData, selectedTemplate, primaryColor, fontFamily, sectionOrder, hiddenSections, savedCvId]);
  const { personalInfo, summary, experience, education, skills, projects = [], customSections = [] } = cvData;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "calc(100vh - 65px)", bgcolor: "#ffffff", overflow: "hidden" }}>
      {/* 1. TOP ACTION BAR (Global Settings Only) */}
      <CVStudioTopBar
        selectedTemplate={selectedTemplate}
        onSelectTemplate={setSelectedTemplate}
        primaryColor={primaryColor}
        onSelectColor={setPrimaryColor}
        fontFamily={fontFamily}
        onSelectFont={setFontFamily}
        autoSaveStatus={autoSaveStatus}
        onDownload={handlePrint}
      />

      {/* 2. SPLIT VIEW BODY */}
      <Box ref={splitViewRef} sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ================= CỘT TRÁI: CONTROLLER (380px) ================= */}
        <Box
          sx={{
            width: "380px",
            minWidth: "380px",
            bgcolor: "#ffffff",
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* TABS CHUYỂN ĐỔI: NỘI DUNG vs SẮP XẾP KHỐI */}
          <Box
            sx={{
              p: 1.5,
              borderBottom: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              display: "flex",
              gap: 1,
            }}
          >
            <Button
              fullWidth
              size="small"
              onClick={() => setActiveTab("content")}
              startIcon={<FileText size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "8px",
                py: 0.9,
                bgcolor: activeTab === "content" ? "#ffffff" : "transparent",
                color: activeTab === "content" ? "#1D61F2" : "#64748b",
                boxShadow: activeTab === "content" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                border: activeTab === "content" ? "1px solid #cbd5e1" : "1px solid transparent",
                "&:hover": {
                  bgcolor: activeTab === "content" ? "#ffffff" : "#f1f5f9",
                },
              }}
            >
              Nội dung
            </Button>

            <Button
              fullWidth
              size="small"
              onClick={() => setActiveTab("reorder")}
              startIcon={<Layers size={16} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.85rem",
                borderRadius: "8px",
                py: 0.9,
                bgcolor: activeTab === "reorder" ? "#ffffff" : "transparent",
                color: activeTab === "reorder" ? "#1D61F2" : "#64748b",
                boxShadow: activeTab === "reorder" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                border: activeTab === "reorder" ? "1px solid #cbd5e1" : "1px solid transparent",
                "&:hover": {
                  bgcolor: activeTab === "reorder" ? "#ffffff" : "#f1f5f9",
                },
              }}
            >
              Sắp xếp khối
            </Button>
          </Box>

          {/* NỘI DUNG CUỘN ĐỘC LẬP */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 3 },
            }}
          >
            {activeTab === "reorder" ? (
              <CVSectionReorder
                sectionOrder={sectionOrder}
                onReorder={setSectionOrder}
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
                          <Typography variant="caption" color="#94a3b8">
                            Hỗ trợ JPG, PNG (tối đa 5MB)
                          </Typography>
                        </Box>
                      </Stack>

                      <TextField fullWidth size="small" label="Họ và tên" name="fullName" value={personalInfo.fullName} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Vị trí ứng tuyển" name="title" value={personalInfo.title} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Email" type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="Số điện thoại" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="GitHub (link / username)" name="github" placeholder="github.com/username" value={personalInfo.github || ""} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth size="small" label="LinkedIn / Portfolio" name="linkedin" value={personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 2. Mục tiêu nghề nghiệp */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <SummaryIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Mục tiêu nghề nghiệp
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Mô tả tóm tắt kỹ năng nổi bật, kinh nghiệm cốt lõi và định hướng phát triển sự nghiệp..."
                      value={summary}
                      onChange={handleSummaryChange}
                    />
                  </AccordionDetails>
                </Accordion>

                {/* 3. Kinh nghiệm làm việc */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
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
                            <TextField fullWidth size="small" label="Vị trí / Chức danh" value={exp.role} onChange={(e) => updateArrayItem("experience", idx, "role", e.target.value)} />
                            <TextField fullWidth size="small" label="Tên công ty" value={exp.company} onChange={(e) => updateArrayItem("experience", idx, "company", e.target.value)} />
                            <Stack direction="row" spacing={1}>
                              <TextField fullWidth size="small" label="Bắt đầu" placeholder="MM/YYYY" value={exp.startDate} onChange={(e) => updateArrayItem("experience", idx, "startDate", e.target.value)} />
                              <TextField fullWidth size="small" label="Kết thúc" placeholder="MM/YYYY hoặc Hiện tại" value={exp.endDate} onChange={(e) => updateArrayItem("experience", idx, "endDate", e.target.value)} />
                            </Stack>
                            <TextField fullWidth size="small" multiline rows={3} label="Mô tả công việc & kết quả" value={exp.description} onChange={(e) => updateArrayItem("experience", idx, "description", e.target.value)} />
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
                            <TextField fullWidth size="small" label="Bằng cấp / Chuyên ngành" value={edu.degree} onChange={(e) => updateArrayItem("education", idx, "degree", e.target.value)} />
                            <TextField fullWidth size="small" label="Trường đào tạo" value={edu.school} onChange={(e) => updateArrayItem("education", idx, "school", e.target.value)} />
                            <Stack direction="row" spacing={1}>
                              <TextField fullWidth size="small" label="Bắt đầu" placeholder="YYYY" value={edu.startDate} onChange={(e) => updateArrayItem("education", idx, "startDate", e.target.value)} />
                              <TextField fullWidth size="small" label="Kết thúc" placeholder="YYYY" value={edu.endDate} onChange={(e) => updateArrayItem("education", idx, "endDate", e.target.value)} />
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
                          placeholder="VD: React.js, Docker, Java..."
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={addSkill}
                          sx={{ textTransform: "none", fontWeight: 700, bgcolor: "#1D61F2", "&:hover": { bgcolor: "#1752cd" } }}
                        >
                          Thêm
                        </Button>
                      </Stack>

                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                        {skills.map((skill, idx) => (
                          <Chip
                            key={idx}
                            label={skill}
                            onDelete={() => removeSkill(idx)}
                            size="small"
                            sx={{
                              bgcolor: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#1e40af",
                              fontWeight: 600,
                            }}
                          />
                        ))}
                      </Box>
                    </Stack>
                  </AccordionDetails>
                </Accordion>

                {/* 6. Dự án tiêu biểu */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ProjectIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Dự án tiêu biểu ({projects.length})
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
                            <TextField fullWidth size="small" label="Tên dự án" value={proj.name} onChange={(e) => updateArrayItem("projects", idx, "name", e.target.value)} />
                            <TextField fullWidth size="small" label="Vai trò" value={proj.role} onChange={(e) => updateArrayItem("projects", idx, "role", e.target.value)} />
                            <TextField fullWidth size="small" label="Link / Github" value={proj.link} onChange={(e) => updateArrayItem("projects", idx, "link", e.target.value)} />
                            <TextField fullWidth size="small" multiline rows={2} label="Mô tả dự án & công nghệ" value={proj.description} onChange={(e) => updateArrayItem("projects", idx, "description", e.target.value)} />
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

                {/* Khối nội dung tùy chỉnh */}
                <Accordion elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "10px !important", "&:before": { display: "none" } }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CustomSectionIcon sx={{ color: "#1D61F2", fontSize: 20 }} />
                      <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
                        Nội dung tùy chỉnh ({customSections.length})
                      </Typography>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={2}>
                      {customSections.map((section, idx) => (
                        <Box key={section.id || idx} sx={{ p: 1.5, border: "1px solid #e2e8f0", borderRadius: "8px", bgcolor: "#f8fafc" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="caption" fontWeight={800} color="#1D61F2">
                              Mục tùy chỉnh #{idx + 1}
                            </Typography>
                            <IconButton size="small" color="error" onClick={() => removeArrayItem("customSections", idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                          <Stack spacing={1.2}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Tiêu đề"
                              placeholder="VD: Chứng chỉ, Giải thưởng, Ngoại ngữ..."
                              value={section.title}
                              onChange={(e) => updateArrayItem("customSections", idx, "title", e.target.value)}
                            />
                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              minRows={3}
                              label="Nội dung"
                              value={section.content}
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
                        onClick={() => addArrayItem("customSections", { id: `${Date.now()}-${Math.random()}`, title: "", content: "" })}
                        sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px", borderColor: "#cbd5e1", color: "#1D61F2" }}
                      >
                        Thêm mục nội dung
                      </Button>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              </Stack>
            )}
          </Box>
        </Box>

        {/* ================= CỘT PHẢI: INTERACTIVE CANVAS PREVIEW ================= */}
        <Box
          ref={canvasRef}
          sx={{
            flex: 1,
            bgcolor: "#f1f5f9",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: { xs: 2, sm: 3, md: 4 },
            position: "relative",
            "&::-webkit-scrollbar": { width: 8 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "#cbd5e1", borderRadius: 4 },
          }}
        >
          {/* Floating Bubble Toolbar khi bôi đen văn bản trong phạm vi tờ CV hoặc Form nhập liệu */}
          <CVFloatingSelectionToolbar
            containerRef={splitViewRef}
            cvId={savedCvId}
            onApplyText={handleApplyAiText}
          />

          {/* Khung Trang Giấy A4 Tỷ Lệ Chuẩn (width: 794px, min-height: 1123px) */}
          <Paper
            elevation={4}
            sx={{
              width: "794px",
              minHeight: "1123px",
              bgcolor: "#ffffff",
              borderRadius: "4px",
              boxShadow: "0 12px 48px rgba(15, 23, 42, 0.12)",
              overflow: "hidden",
              boxSizing: "border-box",
              mb: 6,
            }}
          >
            {selectedTemplate === "modern" ? (
              <ModernTwoColumnTemplate
                ref={printRef}
                data={cvData}
                primaryColor={primaryColor}
                fontFamily={fontFamily}
                hiddenSections={hiddenSections}
                sectionOrder={sectionOrder}
                isEditable={true}
                onInlineUpdate={handleInlineUpdate}
              />
            ) : (
              <ClassicTemplate
                ref={printRef}
                data={cvData}
                primaryColor={primaryColor}
                fontFamily={fontFamily}
                hiddenSections={hiddenSections}
                sectionOrder={sectionOrder}
                isEditable={true}
                onInlineUpdate={handleInlineUpdate}
              />
            )}
          </Paper>
        </Box>
      </Box>


    </Box>
  );
}
