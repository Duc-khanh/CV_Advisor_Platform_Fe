import React, { useState } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  PlusCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Box, Typography, Stack, IconButton, Tooltip } from "@mui/material";

export const SECTION_METADATA = {
  summary: {
    title: "Tóm tắt / Giới thiệu",
    icon: <Sparkles size={16} />,
    canHide: true,
  },
  experience: {
    title: "Kinh nghiệm làm việc",
    icon: <Briefcase size={16} />,
    canHide: true,
  },
  education: {
    title: "Học vấn",
    icon: <GraduationCap size={16} />,
    canHide: true,
  },
  skills: {
    title: "Kỹ năng chuyên môn",
    icon: <Sparkles size={16} />,
    canHide: true,
  },
  projects: {
    title: "Dự án nổi bật",
    icon: <FolderGit2 size={16} />,
    canHide: true,
  },
  customSections: {
    title: "Mục bổ sung",
    icon: <PlusCircle size={16} />,
    canHide: true,
  },
};

export default function CVSectionReorder({
  sectionOrder = ["summary", "experience", "education", "skills", "projects", "customSections"],
  onReorder,
  setSectionOrder,
  hiddenSections = [],
  onToggleHide,
}) {
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);

  const handleReorderCallback = (newOrder) => {
    if (typeof onReorder === "function") {
      onReorder(newOrder);
    } else if (typeof setSectionOrder === "function") {
      setSectionOrder(newOrder);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== index) {
      setDragOverIdx(index);
    }
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) {
      setDraggedIdx(null);
      setDragOverIdx(null);
      return;
    }
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, removed);
    handleReorderCallback(newOrder);
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const moveItem = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;
    const newOrder = [...sectionOrder];
    const [removed] = newOrder.splice(index, 1);
    newOrder.splice(targetIdx, 0, removed);
    handleReorderCallback(newOrder);
  };

  const checkIsHidden = (key) => {
    if (Array.isArray(hiddenSections)) {
      return hiddenSections.includes(key);
    }
    return Boolean(hiddenSections?.[key]);
  };

  return (
    <Box sx={{ p: 1.5 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={800} color="#0f172a">
          Sắp xếp thứ tự các khối
        </Typography>
        <Typography variant="caption" color="#64748b">
          Kéo thả hoặc bấm nút mũi tên để di chuyển các khối trên CV. Bấm icon mắt để ẩn/hiện.
        </Typography>
      </Box>

      {/* Thông tin cá nhân cố định ở đầu */}
      <Box
        sx={{
          p: 1.5,
          mb: 1.5,
          bgcolor: "#f1f5f9",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{ color: "#1D61F2", display: "flex" }}>
            <User size={18} />
          </Box>
          <Typography variant="body2" fontWeight={700} color="#334155">
            Thông tin cá nhân (Cố định ở đầu)
          </Typography>
        </Stack>
        <Typography variant="caption" color="#94a3b8" fontWeight={600}>
          Mặc định
        </Typography>
      </Box>

      {/* Danh sách kéo thả & đổi vị trí */}
      <Stack spacing={1}>
        {sectionOrder.map((sectionKey, index) => {
          const meta = SECTION_METADATA[sectionKey] || {
            title: sectionKey,
            icon: null,
            canHide: true,
          };
          const isHidden = checkIsHidden(sectionKey);
          const isBeingDragged = draggedIdx === index;
          const isDragTarget = dragOverIdx === index && draggedIdx !== index;

          return (
            <Box
              key={sectionKey}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              sx={{
                borderRadius: "10px",
                bgcolor: isHidden ? "#f8fafc" : "#ffffff",
                border: isDragTarget
                  ? "2px solid #1D61F2"
                  : isHidden
                  ? "1px dashed #cbd5e1"
                  : "1px solid #e2e8f0",
                boxShadow: isBeingDragged
                  ? "0 12px 24px rgba(0,0,0,0.15)"
                  : isHidden
                  ? "none"
                  : "0 1px 3px rgba(0,0,0,0.04)",
                opacity: isBeingDragged ? 0.4 : 1,
                transform: isDragTarget ? "scale(1.02)" : "scale(1)",
                transition: "transform 0.15s ease, border-color 0.15s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: "10px 12px",
                cursor: "grab",
                userSelect: "none",
                "&:hover": {
                  borderColor: "#1D61F2",
                  bgcolor: isHidden ? "#f8fafc" : "#fbfdff",
                },
              }}
            >
              {/* Tay nắm kéo thả & tên khối */}
              <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
                <Box
                  sx={{
                    color: "#94a3b8",
                    display: "flex",
                    cursor: "grab",
                    p: 0.2,
                    borderRadius: "4px",
                    "&:hover": { color: "#1D61F2", bgcolor: "#eff6ff" },
                  }}
                >
                  <GripVertical size={18} />
                </Box>
                <Box sx={{ color: isHidden ? "#94a3b8" : "#1D61F2", display: "flex", flexShrink: 0 }}>
                  {meta.icon}
                </Box>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: isHidden ? "#94a3b8" : "#1e293b",
                    textDecoration: isHidden ? "line-through" : "none",
                  }}
                >
                  {meta.title}
                </Typography>
              </Stack>

              {/* Cụm điều khiển: Nút Lên, Xuống, Ẩn/Hiện */}
              <Stack direction="row" spacing={0.3} alignItems="center">
                <Tooltip title="Di chuyển lên trên">
                  <span>
                    <IconButton
                      size="small"
                      disabled={index === 0}
                      onClick={() => moveItem(index, -1)}
                      sx={{
                        p: 0.6,
                        color: "#64748b",
                        "&:hover": { color: "#1D61F2", bgcolor: "#eff6ff" },
                        "&:disabled": { opacity: 0.3 },
                      }}
                    >
                      <ChevronUp size={16} />
                    </IconButton>
                  </span>
                </Tooltip>

                <Tooltip title="Di chuyển xuống dưới">
                  <span>
                    <IconButton
                      size="small"
                      disabled={index === sectionOrder.length - 1}
                      onClick={() => moveItem(index, 1)}
                      sx={{
                        p: 0.6,
                        color: "#64748b",
                        "&:hover": { color: "#1D61F2", bgcolor: "#eff6ff" },
                        "&:disabled": { opacity: 0.3 },
                      }}
                    >
                      <ChevronDown size={16} />
                    </IconButton>
                  </span>
                </Tooltip>

                {meta.canHide && (
                  <Tooltip title={isHidden ? "Hiện khối này trên CV" : "Ẩn khối này trên CV"}>
                    <IconButton
                      size="small"
                      onClick={() => onToggleHide && onToggleHide(sectionKey)}
                      sx={{
                        p: 0.6,
                        color: isHidden ? "#94a3b8" : "#64748b",
                        "&:hover": {
                          color: "#1D61F2",
                          bgcolor: "#eff6ff",
                        },
                      }}
                    >
                      {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </IconButton>
                  </Tooltip>
                )}
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
