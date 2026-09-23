import React, { forwardRef } from "react";
import FormattedText from "../FormattedText";
import InlineEditableText from "../InlineEditableText";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
} from "lucide-react";

const ClassicTemplate = forwardRef(
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
      paddingY: "36px",
    };

    const isHidden = (key) => hiddenSections.includes(key);

    const sectionHeadingStyle = {
      fontSize: "13.5px",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "1px",
      color: primaryColor,
      borderBottom: "1px solid #cbd5e1",
      paddingBottom: "5px",
      margin: "0 0 12px 0",
    };

    const renderSection = (sectionKey) => {
      if (isHidden(sectionKey)) return null;

      switch (sectionKey) {
        case "summary":
          if (!summary) return null;
          return (
            <div key="summary">
              <h3 style={sectionHeadingStyle}>Mục tiêu nghề nghiệp</h3>
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
                }}
                className="hover:bg-slate-50 focus:bg-blue-50/50 focus:ring-1 focus:ring-blue-400"
              >
                <FormattedText text={summary} />
              </p>
            </div>
          );

        case "experience":
          if (!experience || experience.length === 0) return null;
          return (
            <div key="experience">
              <h3 style={sectionHeadingStyle}>Kinh nghiệm làm việc</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: spacingConfig.itemGap }}>
                {experience.map((exp, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onInput={(e) => onInlineUpdate?.(`experience.${idx}.role`, e.currentTarget.innerText)}
                        style={{ margin: 0, fontSize: "13.5px", fontWeight: 700, color: "#0f172a", outline: "none" }}
                        className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                      >
                        {exp.role || "Chức danh"}
                      </h4>
                      {(exp.startDate || exp.endDate) && (
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
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

        case "education":
          if (!education || education.length === 0) return null;
          return (
            <div key="education">
              <h3 style={sectionHeadingStyle}>Học vấn</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                        <InlineEditableText value={edu.degree} fallback="Bằng cấp / Ngành học" path={`education.${idx}.degree`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: primaryColor, fontWeight: 600 }}>
                        <InlineEditableText value={edu.school} fallback="Trường đào tạo" path={`education.${idx}.school`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </p>
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                        <InlineEditableText value={edu.startDate} path={`education.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> – <InlineEditableText value={edu.endDate} path={`education.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        case "skills":
          if (!skills || skills.length === 0) return null;
          return (
            <div key="skills">
              <h3 style={sectionHeadingStyle}>Kỹ năng chuyên môn</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      border: `1px solid ${primaryColor}40`,
                      backgroundColor: `${primaryColor}08`,
                      color: primaryColor,
                      fontWeight: 600,
                      fontSize: "11.5px",
                      borderRadius: "6px",
                      padding: "4px 10px",
                    }}
                  >
                    <InlineEditableText value={skill} path={`skills.${idx}`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                  </span>
                ))}
              </div>
            </div>
          );

        case "projects":
          if (!projects || projects.length === 0) return null;
          return (
            <div key="projects">
              <h3 style={sectionHeadingStyle}>Dự án tiêu biểu</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>
                        <InlineEditableText value={proj.name} fallback="Tên dự án" path={`projects.${idx}.name`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </h4>
                      {proj.role && (
                        <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 600 }}>
                          <InlineEditableText value={proj.role} path={`projects.${idx}.role`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                        </span>
                      )}
                    </div>
                    {proj.link && (
                      <p style={{ margin: "2px 0", fontSize: "11px", color: primaryColor }}>
                        <InlineEditableText value={proj.link} path={`projects.${idx}.link`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                      </p>
                    )}
                    {proj.description && (
                      <p contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.(`projects.${idx}.description`, e.currentTarget.innerText)} style={{ margin: "3px 0 0 0", fontSize: "12px", lineHeight: 1.55, color: "#475569", outline: "none" }}>
                        <FormattedText text={proj.description} />
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div
        ref={ref}
        style={{
          width: "794px",
          minHeight: "1123px",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          fontFamily: fontFamily,
          padding: `${spacingConfig.paddingY} 52px`,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: spacingConfig.sectionGap,
          margin: "0 auto",
        }}
      >
        {/* Header Section (Centered Classic) */}
        <div style={{ textAlign: "center", borderBottom: `2.5px solid ${primaryColor}`, paddingBottom: "20px" }}>
          {personalInfo.avatarUrl && (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.fullName || "Avatar"}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 12px auto",
                display: "block",
                border: `2px solid ${primaryColor}`,
              }}
            />
          )}

          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning
            onInput={(e) => onInlineUpdate?.("personalInfo.fullName", e.currentTarget.innerText)}
            style={{
              fontSize: "30px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#0f172a",
              margin: 0,
              outline: "none",
              borderRadius: "4px",
              padding: "2px 4px",
            }}
            className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
          >
            {personalInfo.fullName || "Họ và Tên"}
          </h1>

          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onInput={(e) => onInlineUpdate?.("personalInfo.title", e.currentTarget.innerText)}
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: primaryColor,
              margin: "6px 0 12px 0",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              outline: "none",
              borderRadius: "4px",
              padding: "2px 4px",
            }}
            className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
          >
            {personalInfo.title || "Vị trí ứng tuyển / Chức danh"}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
              fontSize: "12px",
              color: "#475569",
            }}
          >
            {personalInfo.email && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Mail size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.email", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Phone size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.phone", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.github && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Github size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.github", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.github}</span>
              </span>
            )}
            {personalInfo.address && !personalInfo.github && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <MapPin size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.address", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.address}</span>
              </span>
            )}
            {personalInfo.linkedin && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Linkedin size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.linkedin", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.linkedin}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Sections ordered by sectionOrder */}
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
        {customSections.map((section, idx) => (
          <div key={section.id || idx}>
            <h3
              contentEditable={isEditable}
              suppressContentEditableWarning
              onInput={(e) => onInlineUpdate?.(`customSections.${idx}.title`, e.currentTarget.innerText)}
              style={{ ...sectionHeadingStyle, outline: "none" }}
              className="hover:bg-slate-50 focus:bg-blue-50/50"
            >
              {section.title || "Tiêu đề mới"}
            </h3>
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
    );
  }
);

export default ClassicTemplate;
