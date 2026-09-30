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
      paddingY: "36px",
    };

    const isHidden = (key) => {
      if (Array.isArray(hiddenSections)) {
        return hiddenSections.includes(key);
      }
      return Boolean(hiddenSections?.[key]);
    };

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

        case "education":
          if (!education || education.length === 0) return null;
          return (
            <div key="education">
              <h3 style={sectionHeadingStyle}>Học vấn</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: spacingConfig.itemGap }}>
                {education.map((edu, idx) => (
                  <div key={idx}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h4
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onInput={(e) => onInlineUpdate?.(`education.${idx}.degree`, e.currentTarget.innerText)}
                        style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#0f172a", outline: "none" }}
                        className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                      >
                        {edu.degree || "Bằng cấp / Ngành học"}
                      </h4>
                      {(edu.startDate || edu.endDate) && (
                        <span style={{ fontSize: "11px", color: "#64748b" }}>
                          <InlineEditableText value={edu.startDate} path={`education.${idx}.startDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} /> — <InlineEditableText value={edu.endDate} path={`education.${idx}.endDate`} isEditable={isEditable} onInlineUpdate={onInlineUpdate} />
                        </span>
                      )}
                    </div>
                    <p
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onInput={(e) => onInlineUpdate?.(`education.${idx}.school`, e.currentTarget.innerText)}
                      style={{ margin: "2px 0 0 0", fontSize: "12px", color: primaryColor, outline: "none" }}
                      className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
                    >
                      {edu.school || "Trường đào tạo"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );

        case "skills":
          if (!skills || skills.length === 0) return null;
          return (
            <div key="skills">
              <h3 style={sectionHeadingStyle}>Kỹ năng</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: "#f1f5f9",
                      color: "#334155",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      padding: "4px 9px",
                      borderRadius: "6px",
                      border: "1px solid #e2e8f0",
                      outline: "none",
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
              <h3 style={sectionHeadingStyle}>Dự án nổi bật</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: spacingConfig.itemGap }}>
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

        case "customSections":
          if (!customSections || customSections.length === 0) return null;
          return (
            <div key="customSections" style={{ display: "flex", flexDirection: "column", gap: spacingConfig.itemGap }}>
              {customSections.map((sec, idx) => (
                <div key={idx}>
                  <h3
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.(`customSections.${idx}.title`, e.currentTarget.innerText)}
                    style={{ ...sectionHeadingStyle, outline: "none" }}
                    className="hover:bg-slate-50 focus:bg-blue-50/50"
                  >
                    {sec.title || "Tiêu đề mới"}
                  </h3>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onInput={(e) => onInlineUpdate?.(`customSections.${idx}.content`, e.currentTarget.innerText)}
                    style={{ margin: 0, fontSize: "12.5px", lineHeight: spacingConfig.lineHeight, color: "#334155", whiteSpace: "pre-line", outline: "none" }}
                    className="hover:bg-slate-50 focus:bg-blue-50/50"
                  >
                    <FormattedText text={sec.content || "Nhập nội dung cho mục này..."} />
                  </p>
                </div>
              ))}
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
          fontFamily,
          minHeight: "297mm",
          backgroundColor: "#ffffff",
          padding: `${spacingConfig.paddingY} 40px`,
          color: "#0f172a",
          display: "flex",
          flexDirection: "column",
          gap: spacingConfig.sectionGap,
        }}
      >
        {/* HEADER: Họ Tên & Thông Tin Liên Hệ */}
        <div style={{ textAlign: "center", borderBottom: `2px solid ${primaryColor}`, paddingBottom: "18px" }}>
          {personalInfo.avatarUrl && (
            <img
              src={personalInfo.avatarUrl}
              alt="Avatar"
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 10px auto",
                border: `2px solid ${primaryColor}`,
                display: "block",
              }}
            />
          )}

          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning
            onInput={(e) => onInlineUpdate?.("personalInfo.fullName", e.currentTarget.innerText)}
            style={{
              fontSize: "26px",
              fontWeight: 900,
              color: "#0f172a",
              margin: "0 0 4px 0",
              letterSpacing: "-0.5px",
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
              margin: "0 0 12px 0",
              outline: "none",
            }}
            className="hover:bg-slate-50 focus:bg-blue-50/50 rounded px-1"
          >
            {personalInfo.title || "Vị trí ứng tuyển / Chức danh"}
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "14px",
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
            {personalInfo.linkedin && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Linkedin size={13} color={primaryColor} /> <span contentEditable={isEditable} suppressContentEditableWarning onInput={(e) => onInlineUpdate?.("personalInfo.linkedin", e.currentTarget.innerText)} style={{ outline: "none" }}>{personalInfo.linkedin}</span>
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Sections ordered by sectionOrder */}
        {sectionOrder.map((sectionKey) => renderSection(sectionKey))}
      </div>
    );
  }
);

export default ClassicTemplate;
