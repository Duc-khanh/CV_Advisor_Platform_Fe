import React from "react";

export default function InlineEditableText({ value, fallback = "", path, isEditable, onInlineUpdate }) {
  return (
    <span
      contentEditable={isEditable}
      suppressContentEditableWarning
      onInput={(event) => onInlineUpdate?.(path, event.currentTarget.innerText)}
      style={{ outline: "none", borderRadius: "3px" }}
      className="hover:bg-slate-100 focus:bg-blue-50/50"
    >
      {value || fallback}
    </span>
  );
}