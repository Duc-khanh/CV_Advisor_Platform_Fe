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
} from "lucide-react";

const ModernTwoColumnTemplate = forwardRef(
  (
    {
      data,
      primaryColor = "#1D61F2",
      fontFamily = "Inter, sans-serif",
      spacing = "normal",
      hiddenSections = [],
      sectionOrder = ["summary", "experience", "education", "skills", "projects"],
      isEditable = true,
      onInlineUpdate,
    },
    ref
  ) => {
    if (!data) return null;
    const {
      personalInfo = {},
      summary = "",
      experience = [],
      education = [],
      skills = [],
      projects = [],
      customSections = [],
    } = data;

    // Chuẩn in ấn tối ưu: line-height 1.5, margin giữa các section là 16px
    const spacingConfig = {
      lineHeight: 1.5,
      sectionGap: "16px",
      itemGap: "12px",
      paddingY: "28px",
    };

    const isHidden = (key) => hiddenSections.includes(key);

    // Sidebar items vs Main content items ordered by sectionOrder
    const sidebarSectionKeys = ["education", "skills"].sort(
      (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
    );

    const mainSectionKeys = ["summary", "experience", "projects"].sort(
      (a, b) => sectionOrder.indexOf(a) - sectionOrder.indexOf(b)
    );

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
                      <InlineEditableText value={edu.startDate} path={`education.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> – <InlineEditableText value={edu.endDate} path={`education.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
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
              Kỹ năng chuyên môn
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#334155",
                    border: "1px solid #cbd5e1",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    fontSize: "11px",
                    fontWeight: 600,
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
                        <InlineEditableText value={exp.startDate} path={`experience.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> – <InlineEditableText value={exp.endDate} path={`experience.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
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

      return null;
    };

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          minHeight: "1123px",
          backgroundColor: "#ffffff",
          color: "#1e293b",
          fontFamily: fontFamily,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          margin: "0 auto",
        }}
      >
        {/* Top Header Banner */}
        <div
          style={{
            backgroundColor: primaryColor,
            color: "#ffffff",
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            gap: "28px",
          }}
        >
          {personalInfo.avatarUrl ? (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.fullName || "Avatar"}
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid rgba(255,255,255,0.85)",
                flexShrink: 0,
                backgroundColor: "#ffffff",
              }}
            />
          ) : (
            <div
              style={{
                width: "92px",
                height: "92px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.6)",
                flexShrink: 0,
              }}
            >
              <User size={46} color="#ffffff" />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.("personalInfo.fullName", e.currentTarget.innerText)}
              style={{
                fontSize: "28px",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                margin: 0,
                lineHeight: 1.2,
                color: "#ffffff",
                textTransform: "uppercase",
                outline: "none",
                borderRadius: "4px",
                padding: "2px 4px",
              }}
              className="hover:bg-white/10 focus:bg-white/20 transition-colors"
            >
              {personalInfo.fullName || "Họ và Tên"}
            </h1>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.("personalInfo.title", e.currentTarget.innerText)}
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.9)",
                margin: "6px 0 0 0",
                outline: "none",
                borderRadius: "4px",
                padding: "2px 4px",
              }}
              className="hover:bg-white/10 focus:bg-white/20 transition-colors"
            >
              {personalInfo.title || "Vị trí ứng tuyển / Chức danh"}
            </p>
          </div>
        </div>

        {/* 2-Column Body Layout */}
        <div style={{ display: "flex", flex: 1, width: "100%" }}>
          {/* LEFT SIDEBAR (Width: 270px) */}
          <div
            style={{
              width: "270px",
              backgroundColor: "#f8fafc",
              borderRight: "1px solid #e2e8f0",
              padding: `${spacingConfig.paddingY} 24px`,
              display: "flex",
              flexDirection: "column",
              gap: spacingConfig.sectionGap,
              boxSizing: "border-box",
            }}
          >
            {/* Contact Info (Always fixed in sidebar) */}
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
                Thông tin liên hệ
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "#475569" }}>
                {personalInfo.email && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                    <Mail size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                    <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.email", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Phone size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                    <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.phone", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                    <Github size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                    <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.github", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.github}</span>
                  </div>
                )}
                {personalInfo.address && !personalInfo.github && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <MapPin size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                    <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.address", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.address}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", wordBreak: "break-all" }}>
                    <Linkedin size={14} color={primaryColor} style={{ flexShrink: 0 }} />
                    <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.linkedin", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.linkedin}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Sidebar Sections ordered by sectionOrder */}
            {sidebarSectionKeys.map((key) => renderSidebarSection(key))}
          </div>

          {/* RIGHT CONTENT (Width: flex-1) */}
          <div
            style={{
              flex: 1,
              padding: `${spacingConfig.paddingY} 32px`,
              display: "flex",
              flexDirection: "column",
              gap: spacingConfig.sectionGap,
              boxSizing: "border-box",
            }}
          >
            {/* Dynamic Main Sections ordered by sectionOrder */}
            {mainSectionKeys.map((key) => renderMainSection(key))}
            {customSections.map((section, idx) => (
              <div key={section.id || idx}>
                <h2
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onInput={(e) => onInlineUpdate?.(`customSections.${idx}.title`, e.currentTarget.innerText)}
                  style={{
                    fontSize: "14px",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    color: primaryColor,
                    margin: "0 0 10px 0",
                    borderBottom: `1.5px solid ${primaryColor}30`,
                    paddingBottom: "6px",
                    outline: "none",
                  }}
                  className="hover:bg-slate-50 focus:bg-blue-50/50"
                >
                  {section.title || "Tiêu đề mới"}
                </h2>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onInput={(e) => onInlineUpdate?.(`customSections.${idx}.content`, e.currentTarget.innerText)}
                  style={{ margin: 0, fontSize: "12.5px", lineHeight: spacingConfig.lineHeight, color: "#334155", whiteSpace: "pre-line", outline: "none" }}
                  className="hover:bg-slate-50 focus:bg-blue-50/50"
                >
                  <FormattedText text={section.content || "Nhập nội dung cho mục này..."} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default ModernTwoColumnTemplate;
