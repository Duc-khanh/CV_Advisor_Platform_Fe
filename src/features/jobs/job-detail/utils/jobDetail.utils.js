export function calculateRemainingDays(expiredAt) {
  if (!expiredAt) return null;
  return Math.ceil((new Date(expiredAt) - new Date()) / (1000 * 60 * 60 * 24));
}

export function calculateDaysAgo(createdAt) {
  if (!createdAt) return "Đăng 2 ngày trước";
  const now = new Date();
  const created = new Date(createdAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const createdDay = new Date(created.getFullYear(), created.getMonth(), created.getDate());
  const days = Math.floor((today - createdDay) / (1000 * 60 * 60 * 24));
  return days <= 0 ? "Đăng hôm nay" : `Đăng ${days} ngày trước`;
}

export function getJobTags(title = "") {
  const normalized = title.toLowerCase();
  if (normalized.includes("java")) return ["Java", "Spring Boot", "MySQL", "REST API", "Git", "SQL"];
  if (["react", "frontend", "front-end", "javascript"].some((term) => normalized.includes(term))) {
    return ["React", "JavaScript", "TypeScript", "HTML5/CSS3", "REST API", "Git"];
  }
  if (["node", "backend", "back-end"].some((term) => normalized.includes(term))) {
    return ["Node.js", "Express", "MongoDB", "REST API", "Docker", "Git"];
  }
  if (["design", "thiết kế", "figma", "ui/ux"].some((term) => normalized.includes(term))) {
    return ["Figma", "UI/UX", "Adobe Photoshop", "Illustrator", "Creative"];
  }
  if (["marketing", "seo", "quảng cáo"].some((term) => normalized.includes(term))) {
    return ["SEO", "Google Ads", "Content Marketing", "Social Media", "Analytics"];
  }
  if (["kinh doanh", "sale", "bán hàng"].some((term) => normalized.includes(term))) {
    return ["Kỹ năng giao tiếp", "Đàm phán", "Tư vấn khách hàng", "Microsoft Office", "Giải quyết vấn đề"];
  }
  return ["Kỹ năng giao tiếp", "Làm việc nhóm", "Giải quyết vấn đề", "Chủ động", "Thích ứng nhanh"];
}

export function getCompanyDetails(companyName, location) {
  const domain = companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, "") : "company";
  return {
    slogan: "Nền tảng công nghệ và đào tạo nguồn nhân lực chất lượng cao hàng đầu.",
    size: "50 - 150 nhân viên",
    industry: "Giáo dục / Công nghệ thông tin",
    website: `https://${domain}.vn`,
    address: `Tòa nhà ${companyName || "Company Building"}, ${location || "Hà Nội, Việt Nam"}`,
  };
}
