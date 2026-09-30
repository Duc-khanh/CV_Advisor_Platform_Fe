import React, { forwardRef } from "react";
import FormattedText from "../FormattedText";
import InlineEditableText from "../InlineEditableText";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  User,
  PlusCircle,
} from "lucide-react";

const ModernTwoColumnTemplate = forwardRef(
  (
    {
      data,
      cvData,
      primaryColor = "#1D61F2",
      fontFamily = "Inter, sans-serif",
      hiddenSections = [],
      sectionOrder = ["summary", "experience", "education", "skills", "projects", "customSections"],
      isEditable = true,
      onInlineUpdate,
    },
    ref
  ) => {
    const cv = data || cvData;
    if (!cv) return null;
    const {
      personalInfo = {},
      summary = "",
      experience = [],
      education = [],
      skills = [],
      projects = [],
      customSections = [],
    } = cv;

    const spacingConfig = {
      lineHeight: 1.5,
      sectionGap: "16px",
      itemGap: "12px",
      paddingY: "28px",
    };

    const isHidden = (key) => {
      if (Array.isArray(hiddenSections)) {
        return hiddenSections.includes(key);
      }
      return Boolean(hiddenSections?.[key]);
    };

    const sidebarSectionKeys = ["education", "skills"].sort(
      (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
    );

    const mainSectionKeys = sectionOrder.filter((k) => !["education", "skills"].includes(k));

    const renderSidebarSection = (key) => {
      if (isHidden(key)) return null;

      if (key === "education" && education.length > 0) {
        return (
          <div key="education">
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 14px 0",
                borderBottom: `2px solid ${primaryColor}25`,
                paddingBottom: "6px",
              }}
            >
              Học vấn
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {education.map((edu, idx) => (
                <div key={idx}>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.(`education.${idx}.degree`, e.currentTarget.innerText)}
                    style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#0f172a", outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-1"
                  >
                    {edu.degree || "Bằng cấp / Ngành học"}
                  </p>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.(`education.${idx}.school`, e.currentTarget.innerText)}
                    style={{ margin: "2px 0 0 0", fontSize: "12px", color: primaryColor, fontWeight: 600, outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-1"
                  >
                    {edu.school || "Trường đào tạo"}
                  </p>
                  {(edu.startDate || edu.endDate) && (
                    <p style={{ margin: "3px 0 0 0", fontSize: "11px", color: "#94a3b8" }}>
                      <InlineEditableText value={edu.startDate} path={`education.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> — <InlineEditableText value={edu.endDate} path={`education.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (key === "skills" && skills.length > 0) {
        return (
          <div key="skills">
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 14px 0",
                borderBottom: `2px solid ${primaryColor}25`,
                paddingBottom: "6px",
              }}
            >
              Kỹ năng
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #cbd5e1",
                    color: "#334155",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "6px",
                    outline: "none",
                  }}
                >
                  <InlineEditableText value={skill} path={`skills.${idx}`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                </span>
              ))}
            </div>
          </div>
        );
      }

      return null;
    };

    const renderMainSection = (key) => {
      if (isHidden(key)) return null;

      if (key === "summary" && summary) {
        return (
          <div key="summary">
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 10px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `1.5px solid ${primaryColor}30`,
                paddingBottom: "6px",
              }}
            >
              <Sparkles size={16} />
              Mục tiêu & Giới thiệu
            </h2>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.("summary", e.currentTarget.innerText)}
              style={{
                fontSize: "12.5px",
                lineHeight: spacingConfig.lineHeight,
                color: "#334155",
                margin: 0,
                whiteSpace: "pre-line",
                outline: "none",
                borderRadius: "4px",
                padding: "2px 4px",
                transition: "background-color 0.15s ease",
              }}
              className="hover:bg-slate-50 focus:bg-blue-50/50 focus:ring-1 focus:ring-blue-400"
            >
              <FormattedText text={summary} />
            </p>
          </div>
        );
      }

      if (key === "experience" && experience.length > 0) {
        return (
          <div key="experience">
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 14px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `1.5px solid ${primaryColor}30`,
                paddingBottom: "6px",
              }}
            >
              <Briefcase size={16} />
              Kinh nghiệm làm việc
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: spacingConfig.itemGap }}>
              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    paddingLeft: "14px",
                    borderLeft: `2px solid ${primaryColor}40`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "4px",
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: primaryColor,
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexWrap: "wrap",
                      gap: "4px",
                    }}
                  >
                    <h4
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onInput={(e) => onInlineUpdate?.(`experience.${idx}.role`, e.currentTarget.innerText)}
                      style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "#0f172a", outline: "none" }}
                      className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                    >
                      {exp.role || "Chức danh / Vị trí"}
                    </h4>
                    {(exp.startDate || exp.endDate) && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          fontWeight: 600,
                          backgroundColor: "#f1f5f9",
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        <InlineEditableText value={exp.startDate} path={`experience.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> — <InlineEditableText value={exp.endDate} path={`experience.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </span>
                    )}
                  </div>

                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.(`experience.${idx}.company`, e.currentTarget.innerText)}
                    style={{ margin: "2px 0 6px 0", fontSize: "12px", color: primaryColor, fontWeight: 600, outline: "none" }}
                    className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                  >
                    {exp.company || "Tên công ty"}
                  </p>

                  {exp.description && (
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onInput={(e) => onInlineUpdate?.(`experience.${idx}.description`, e.currentTarget.innerText)}
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        lineHeight: spacingConfig.lineHeight,
                        color: "#475569",
                        whiteSpace: "pre-line",
                        outline: "none",
                        borderRadius: "4px",
                        padding: "2px 4px",
                      }}
                      className="hover:bg-slate-50 focus:bg-blue-50/50 focus:ring-1 focus:ring-blue-400"
                    >
                      <FormattedText text={exp.description} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (key === "projects" && projects.length > 0) {
        return (
          <div key="projects">
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 14px 0",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderBottom: `1.5px solid ${primaryColor}30`,
                paddingBottom: "6px",
              }}
            >
              <FolderGit2 size={16} />
              Dự án tiêu biểu
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {projects.map((proj, idx) => (
                <div key={idx}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onInput={(e) => onInlineUpdate?.(`projects.${idx}.name`, e.currentTarget.innerText)}
                      style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a", outline: "none" }}
                      className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                    >
                      {proj.name || "Tên dự án"}
                    </h4>
                    {proj.role && (
                      <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.(`projects.${idx}.role`, e.currentTarget.innerText)} style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, outline: "none" }}>
                        <InlineEditableText value={proj.role} path={`projects.${idx}.role`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </span>
                    )}
                  </div>
                  {proj.link && (
                    <p contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.(`projects.${idx}.link`, e.currentTarget.innerText)} style={{ margin: "2px 0", fontSize: "11px", color: primaryColor, outline: "none" }}>
                      <InlineEditableText value={proj.link} path={`projects.${idx}.link`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                    </p>
                  )}
                  {proj.description && (
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onInput={(e) => onInlineUpdate?.(`projects.${idx}.description`, e.currentTarget.innerText)}
                      style={{ margin: "4px 0 0 0", fontSize: "12px", lineHeight: 1.55, color: "#475569", outline: "none" }}
                      className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                    >
                      <FormattedText text={proj.description} />
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (key === "customSections" && customSections.length > 0) {
        return (
          <div key="customSections" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {customSections.map((sec, idx) => (
              <div key={idx}>
                <h2
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: primaryColor,
                    margin: "0 0 10px 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderBottom: `1.5px solid ${primaryColor}30`,
                    paddingBottom: "6px",
                  }}
                >
                  <PlusCircle size={16} />
                  <InlineEditableText
                    value={sec.title || "Mục bổ sung"}
                    path={`customSections.${idx}.title`}
                    isEditable={isEditable}
                    onInlineUpdate={onInlineUpdate}
                  />
                </h2>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onInput={(e) => onInlineUpdate?.(`customSections.${idx}.content`, e.currentTarget.innerText)}
                  style={{
                    margin: 0,
                    fontSize: "12.5px",
                    lineHeight: spacingConfig.lineHeight,
                    color: "#475569",
                    whiteSpace: "pre-line",
                    outline: "none",
                  }}
                  className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                >
                  <FormattedText text={sec.content} />
                </p>
              </div>
            ))}
          </div>
        );
      }

      return null;
    };

    return (
      <div
        ref={ref}
        style={{
          fontFamily,
          minHeight: "297mm",
          backgroundColor: "#ffffff",
          display: "grid",
          gridTemplateColumns: "68mm 1fr",
          color: "#0f172a",
        }}
      >
        {/* SIDEBAR CỘT TRÁI (68mm) */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            borderRight: "1px solid #e2e8f0",
            padding: `${spacingConfig.paddingY} 20px`,
            display: "flex",
            flexDirection: "column",
            gap: spacingConfig.sectionGap,
          }}
        >
          {/* Avatar & Tên trong Sidebar */}
          <div style={{ textAlign: "center", marginBottom: "8px" }}>
            {personalInfo.avatarUrl ? (
              <img
                src={personalInfo.avatarUrl}
                alt="Avatar"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  margin: "0 auto 12px auto",
                  border: `3px solid ${primaryColor}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  margin: "0 auto 12px auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                <User size={36} />
              </div>
            )}
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: primaryColor,
                margin: "0 0 14px 0",
                borderBottom: `2px solid ${primaryColor}25`,
                paddingBottom: "6px",
              }}
            >
              Liên hệ
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "11.5px" }}>
              {personalInfo.email && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#475569" }}>
                  <Mail size={14} color={primaryColor} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.("personalInfo.email", e.currentTarget.innerText)}
                    style={{ wordBreak: "break-all", outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-0.5"
                  >
                    {personalInfo.email}
                  </span>
                </div>
              )}

              {personalInfo.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
                  <Phone size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.("personalInfo.phone", e.currentTarget.innerText)}
                    style={{ outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-0.5"
                  >
                    {personalInfo.phone}
                  </span>
                </div>
              )}

              {personalInfo.github && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
                  <Github size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.("personalInfo.github", e.currentTarget.innerText)}
                    style={{ wordBreak: "break-all", outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-0.5"
                  >
                    {personalInfo.github}
                  </span>
                </div>
              )}

              {personalInfo.linkedin && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#475569" }}>
                  <Linkedin size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.("personalInfo.linkedin", e.currentTarget.innerText)}
                    style={{ wordBreak: "break-all", outline: "none" }}
                    className="hover:bg-slate-100 focus:bg-blue-50/50 rounded px-0.5"
                  >
                    {personalInfo.linkedin}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Các section còn lại trong sidebar (Học vấn, Kỹ năng) sắp xếp theo sectionOrder */}
          {sidebarSectionKeys.map((key) => renderSidebarSection(key))}
        </div>

        {/* MAIN CỘT PHẢI (Nội dung chính) */}
        <div
          style={{
            padding: `${spacingConfig.paddingY} 28px`,
            display: "flex",
            flexDirection: "column",
            gap: spacingConfig.sectionGap,
          }}
        >
          {/* Header Họ tên & Chức danh */}
          <div style={{ borderBottom: `2px solid ${primaryColor}20`, paddingBottom: "16px" }}>
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.("personalInfo.fullName", e.currentTarget.innerText)}
              style={{
                fontSize: "24px",
                fontWeight: 900,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
                outline: "none",
              }}
              className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
            >
              {personalInfo.fullName || "HỌ VÀ TÊN"}
            </h1>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.("personalInfo.title", e.currentTarget.innerText)}
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: primaryColor,
                margin: "4px 0 0 0",
                outline: "none",
              }}
              className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
            >
              {personalInfo.title || "Vị trí ứng tuyển / Chức danh"}
            </p>
          </div>

          {/* Main Sections sắp xếp theo sectionOrder */}
          {mainSectionKeys.map((key) => renderMainSection(key))}
        </div>
      </div>
    );
  }
);

export default ModernTwoColumnTemplate;
