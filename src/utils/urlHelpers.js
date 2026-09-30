const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Most application endpoints already start with /api. Normalize an env value
// such as https://example.com/api back to its origin to avoid /api/api paths.
export const API_BASE_URL = configuredApiBaseUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/i, "");

export const isAbsoluteUrl = (url) => {
  return typeof url === "string" && /^(https?:\/\/|blob:|data:)/.test(url);
};

export const getMediaUrl = (url) => {
  if (!url) return "";
  if (isAbsoluteUrl(url)) return url;
  if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
  return `${API_BASE_URL}/${url}`;
};

export const getCvUrl = (fileUrl) => {
  if (!fileUrl) return "";
  if (isAbsoluteUrl(fileUrl)) return fileUrl;
  if (fileUrl.startsWith("/")) return `${API_BASE_URL}${fileUrl}`;
  return `${API_BASE_URL}/uploads/cv/${fileUrl}`;
};
