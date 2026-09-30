import React, { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { Box, Container } from "@mui/material";
import {
  Sparkles,
  Building2,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  TrendingUp,
} from "lucide-react";
import api from "../../services/axios";
import { getMediaUrl } from "../../utils/urlHelpers";

// CSS Infinite Marquee Animation
const marquee = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export default function TopCompaniesSection({ onCompanyClick }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/api/public/companies");
        setCompanies(response.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách công ty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading || companies.length === 0) return null;

  // Duplicate to ensure infinite seamless scrolling loop
  const duplicatedCompanies = [...companies, ...companies];
  const animationDuration = `${Math.max(28, companies.length * 4)}s`;

  return (
    <Box sx={{ py: 8, bgcolor: "#ffffff", position: "relative", overflow: "hidden" }}>
      {/* Background Soft Glow Lighting */}
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-sky-400/5 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
        {/* ===== SECTION HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 border border-sky-200/80 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                Hệ Sinh Thái Doanh Nghiệp Hàng Đầu
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Top Công Ty & Tập Đoàn{" "}
              <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tuyển Dụng Nổi Bật
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-xl leading-relaxed">
              Khám phá môi trường làm việc lý tưởng và cơ hội phát triển cùng các doanh nghiệp công nghệ uy tín nhất toàn quốc.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-extrabold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{companies.length} đối tác doanh nghiệp đã xác thực</span>
          </div>
        </div>

        {/* ===== MARQUEE TICKER WRAPPER WITH FADE MASKS ===== */}
        <div className="relative w-full overflow-hidden py-3">
          {/* Left & Right Smooth Edge Fade Masks */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

          {/* Scrolling Track (pauses smoothly on hover) */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              animation: `${marquee} ${animationDuration} linear infinite`,
              "&:hover": {
                animationPlayState: "paused",
              },
              "& > *": {
                flexShrink: 0,
              },
            }}
          >
            {duplicatedCompanies.map((company, index) => {
              const companyInitial = company.companyName
                ? company.companyName.charAt(0).toUpperCase()
                : "C";
              const rating = company.rating || (4.5 + ((company.companyId * 3) % 5) * 0.1).toFixed(1);

              return (
                <div
                  key={`${company.companyId}-${index}`}
                  onClick={() => onCompanyClick && onCompanyClick(company)}
                  className="group relative p-3.5 sm:p-4 rounded-2xl bg-white shadow-xs hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 cursor-pointer min-w-[270px] sm:min-w-[290px] max-w-[320px] mr-4 flex items-center gap-3.5 overflow-hidden hover:-translate-y-1.5 active:scale-98 select-none"
                >
                  {/* Subtle hover gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-50/60 via-white to-blue-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-0" />

                  {/* Company Logo Box */}
                  <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0 group-hover:scale-105 group-hover:border-sky-200 transition-all duration-300 shadow-2xs z-10">
                    {company.logoUrl ? (
                      <img
                        src={getMediaUrl(company.logoUrl)}
                        alt={company.companyName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="font-black text-sm text-blue-700">
                        {companyInitial}
                      </span>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="min-w-0 flex-1 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-xs sm:text-[13px] text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                        {company.companyName}
                      </h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0" />
                    </div>

                    {/* Rating & Location / Industry */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded-md">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rating}</span>
                      </span>

                      <span className="text-[10px] text-slate-400 font-bold truncate">
                        {company.address ? company.address.split(",").pop().trim() : "Toàn quốc"}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-300 group-hover:text-blue-600 flex items-center justify-center transition-all flex-shrink-0 relative z-10">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </Box>
        </div>
      </Container>
    </Box>
  );
}
