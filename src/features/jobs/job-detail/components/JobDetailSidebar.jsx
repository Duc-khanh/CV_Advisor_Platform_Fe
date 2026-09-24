import { Avatar, Box, Chip, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import {
  ChevronRight,
  ContentCopy,
  Event,
  Facebook,
  Flag,
  Info,
  Language,
  LinkedIn,
  LocationOn,
  People,
  Schedule,
  School,
  Transgender,
  Verified,
  Work,
} from "@mui/icons-material";
import { AppIconButton } from "../../../../shared/components";
import { getMediaUrl } from "../../../../utils/urlHelpers";

const iconSx = { color: "#64748b", fontSize: 20 };

function InfoRows({ items }) {
  return (
    <Stack spacing={2.5}>
      {items.map(({ label, value, icon, badge, link }) => (
        <Stack key={label} direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#f1f5f9", display: "grid", placeItems: "center", flexShrink: 0 }}>
            {icon}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="#94a3b8" fontWeight={750} display="block">
              {label}
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              {link ? (
                <Link href={value} target="_blank" rel="noopener noreferrer" sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                  {value}
                </Link>
              ) : (
                <Typography variant="body2" color="#334155" fontWeight={700}>{value}</Typography>
              )}
              {badge && <Chip label={badge} size="small" color="error" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 800 }} />}
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
    : "Chưa xác định";
  const jobItems = [
    { label: "Cấp bậc", value: job.experienceLevel || "Mid Level", icon: <Work sx={iconSx} /> },
    { label: "Kinh nghiệm", value: "1 - 3 năm", icon: <School sx={iconSx} /> },
    { label: "Hình thức làm việc", value: "Toàn thời gian", icon: <Schedule sx={iconSx} /> },
    { label: "Giới tính", value: "Không yêu cầu", icon: <Transgender sx={iconSx} /> },
    { label: "Số lượng tuyển", value: "3 người", icon: <People sx={iconSx} /> },
    { label: "Hạn nộp hồ sơ", value: deadline, icon: <Event sx={iconSx} />, badge: isExpired ? "Đã hết hạn" : null },
  ];
  const companyItems = [
    { label: "Quy mô", value: company.size, icon: <People sx={iconSx} /> },
    { label: "Lĩnh vực", value: company.industry, icon: <Work sx={iconSx} /> },
    { label: "Website", value: company.website, icon: <Language sx={iconSx} />, link: true },
    { label: "Địa chỉ", value: company.address, icon: <LocationOn sx={iconSx} /> },
  ];
  const currentUrl = encodeURIComponent(window.location.href);
  const socials = [
    { label: "Chia sẻ lên Facebook", icon: <Facebook sx={{ color: "#1877f2" }} />, href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}` },
    { label: "Chia sẻ lên LinkedIn", icon: <LinkedIn sx={{ color: "#0a66c2" }} />, href: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}` },
    { label: "Chia sẻ lên Zalo", icon: <Info sx={{ color: "#0068ff" }} />, href: `https://zalo.me/share?to=&url=${currentUrl}` },
  ];

  return (
    <GridWrapper>
      <Stack spacing={4}>
        <SidebarCard title="Thông tin công việc"><InfoRows items={jobItems} /></SidebarCard>
        <SidebarCard>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
            <Avatar src={getMediaUrl(job.companyLogo)} variant="rounded" sx={{ width: 48, height: 48, border: "1px solid #e2e8f0" }}>
              {job.companyName?.charAt(0).toUpperCase() || "C"}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={850}>Thông tin công ty</Typography>
              <Typography variant="caption" color="#2563eb" fontWeight={800}>{job.companyName} <Verified sx={{ fontSize: 13 }} /></Typography>
            </Box>
          </Stack>
          <Typography variant="caption" color="#64748b" display="block" sx={{ mb: 3, fontStyle: "italic" }}>“{company.slogan}”</Typography>
          <InfoRows items={companyItems} />
        </SidebarCard>
        <SidebarCard title="Chia sẻ công việc">
          <Stack direction="row" spacing={2}>
            {socials.map((social) => <AppIconButton key={social.label} label={social.label} icon={social.icon} component="a" href={social.href} target="_blank" rel="noopener noreferrer" />)}
            <AppIconButton label="Sao chép liên kết" icon={<ContentCopy sx={{ color: "#64748b" }} />} onClick={onCopyLink} />
          </Stack>
        </SidebarCard>
        <Box sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #fee2e2", bgcolor: "#fff5f5", display: "flex", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.5} alignItems="center"><Flag sx={{ color: "#ef4444" }} /><Typography variant="body2" fontWeight={800} color="#b91c1c">Báo cáo tin tuyển dụng</Typography></Stack>
          <ChevronRight sx={{ color: "#b91c1c" }} />
        </Box>
      </Stack>
    </GridWrapper>
  );
}

function SidebarCard({ title, children }) {
  return <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e2e8f0" }}>{title && <Typography variant="subtitle1" fontWeight={850} sx={{ mb: 2.5 }}>{title}</Typography>}{children}</Paper>;
}

function GridWrapper({ children }) {
  return <Grid size={{ xs: 12, lg: 4 }}>{children}</Grid>;
}
