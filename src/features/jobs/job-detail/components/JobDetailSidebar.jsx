import React from "react";
import { Avatar, Box, Chip, Grid, Link, Stack, Typography } from "@mui/material";
import {
  ChevronRight,
  ContentCopy,
  Event,
  Facebook,
  Flag,
  Language,
  LinkedIn,
  LocationOn,
  People,
  Schedule,
  School,
  Transgender,
  Verified,
  Work,
  Share,
} from "@mui/icons-material";
import { getMediaUrl } from "../../../../utils/urlHelpers";

const iconSx = { color: "#0284c7", fontSize: 18 };

function InfoRows({ items }) {
  return (
    <Stack spacing={2.2}>
      {items.map(({ label, value, icon, badge, link }) => (
        <Stack key={label} direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "12px",
              bgcolor: "rgba(2, 132, 199, 0.08)",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              color="#94a3b8"
              fontWeight={750}
              display="block"
              sx={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.04em" }}
            >
              {label}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.2 }}>
              {link ? (
                <Link
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    fontSize: "0.88rem",
                    fontWeight: 750,
                    color: "#0284c7",
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {value}
                </Link>
              ) : (
                <Typography variant="body2" color="#1e293b" fontWeight={750} sx={{ fontSize: "0.88rem" }}>
                  {value}
                </Typography>
              )}
              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    bgcolor: "#fee2e2",
                    color: "#b91c1c",
                    borderRadius: "6px",
                  }}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

export default function JobDetailSidebar({ job, company, isExpired, onCopyLink }) {
  const deadline = job.expiredAt
    ? new Date(job.expiredAt).toLocaleDateString("vi-VN")
    : "Đang tuyển liên tục";

  const jobItems = [
    { label: "Cấp bậc vị trí", value: job.experienceLevel || "Mid Level", icon: <Work sx={iconSx} /> },
    { label: "Kinh nghiệm", value: "1 - 3 năm", icon: <School sx={iconSx} /> },
    { label: "Hình thức làm việc", value: "Toàn thời gian", icon: <Schedule sx={iconSx} /> },
    { label: "Giới tính", value: "Không yêu cầu", icon: <Transgender sx={iconSx} /> },
    { label: "Số lượng tuyển", value: "3 người", icon: <People sx={iconSx} /> },
    { label: "Hạn nộp hồ sơ", value: deadline, icon: <Event sx={iconSx} />, badge: isExpired ? "Đã hết hạn" : null },
  ];

  const companyItems = [
    { label: "Quy mô nhân sự", value: company.size, icon: <People sx={iconSx} /> },
    { label: "Lĩnh vực hoạt động", value: company.industry, icon: <Work sx={iconSx} /> },
    { label: "Trang web chính thức", value: company.website, icon: <Language sx={iconSx} />, link: true },
    { label: "Địa chỉ văn phòng", value: company.address, icon: <LocationOn sx={iconSx} /> },
  ];

  const currentUrl = encodeURIComponent(window.location.href);
  const socials = [
    {
      label: "Facebook",
      icon: <Facebook sx={{ color: "#1877f2" }} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    },
    {
      label: "LinkedIn",
      icon: <LinkedIn sx={{ color: "#0a66c2" }} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
    },
    {
      label: "Zalo",
      icon: <Share sx={{ color: "#0068ff" }} />,
      href: `https://zalo.me/share?to=&url=${currentUrl}`,
    },
  ];

  return (
    <Grid size={{ xs: 12, lg: 4 }}>
      <Stack spacing={3}>
        {/* Card 1: Thông tin chung về vị trí */}
        <SidebarCard title="Thông tin chung vị trí">
          <InfoRows items={jobItems} />
        </SidebarCard>

        {/* Card 2: Thông tin công ty */}
        <SidebarCard>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar
              src={getMediaUrl(job.companyLogo)}
              variant="rounded"
              sx={{
                width: 52,
                height: 52,
                borderRadius: "14px",
                bgcolor: "#f0fdf4",
                color: "#059669",
                fontSize: "1.3rem",
                fontWeight: 900,
                boxShadow: "0 4px 12px rgba(5, 150, 105, 0.1)",
              }}
            >
              {job.companyName?.charAt(0).toUpperCase() || "C"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={850} color="#0f172a" sx={{ fontSize: "0.95rem" }}>
                Về công ty
              </Typography>
              <Typography
                variant="caption"
                color="#0284c7"
                fontWeight={800}
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}
              >
                {job.companyName} <Verified sx={{ fontSize: 14 }} />
              </Typography>
            </Box>
          </Stack>
          <Typography
            variant="caption"
            color="#64748b"
            display="block"
            sx={{ mb: 2.5, fontStyle: "italic", lineHeight: 1.5 }}
          >
            “{company.slogan}”
          </Typography>
          <InfoRows items={companyItems} />
        </SidebarCard>

        {/* Card 3: Chia sẻ công việc */}
        <SidebarCard title="Chia sẻ tin tuyển dụng">
          <Stack direction="row" spacing={1.5} alignItems="center">
            {socials.map((social) => (
              <Box
                key={social.label}
                component="a"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "14px",
                  bgcolor: "#f8fafc",
                  display: "grid",
                  placeItems: "center",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: "rgba(2, 132, 199, 0.08)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 16px rgba(2, 132, 199, 0.15)",
                  },
                }}
              >
                {social.icon}
              </Box>
            ))}
            <Box
              onClick={onCopyLink}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                bgcolor: "#f8fafc",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: "rgba(2, 132, 199, 0.08)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(2, 132, 199, 0.15)",
                },
              }}
            >
              <ContentCopy sx={{ color: "#64748b", fontSize: 20 }} />
            </Box>
          </Stack>
        </SidebarCard>

        {/* Card 4: Báo cáo tin tuyển dụng */}
        <Box
          sx={{
            p: 2.2,
            borderRadius: "18px",
            bgcolor: "#fff5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            "&:hover": {
              bgcolor: "#fee2e2",
              transform: "translateY(-1px)",
            },
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Flag sx={{ color: "#ef4444", fontSize: 20 }} />
            <Typography variant="body2" fontWeight={800} color="#b91c1c" sx={{ fontSize: "0.85rem" }}>
              Báo cáo tin tuyển dụng không hợp lệ
            </Typography>
          </Stack>
          <ChevronRight sx={{ color: "#b91c1c", fontSize: 18 }} />
        </Box>
      </Stack>
    </Grid>
  );
}

function SidebarCard({ title, children }) {
  return (
    <Box
      sx={{
        p: 3.5,
        borderRadius: "24px",
        bgcolor: "#ffffff",
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
      }}
    >
      {title && (
        <Typography
          variant="subtitle1"
          fontWeight={850}
          color="#0f172a"
          sx={{ mb: 2.5, fontSize: "1.05rem" }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}
