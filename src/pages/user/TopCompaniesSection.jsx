import React, { useState, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { Box, Container, Typography, Paper, Avatar, Stack } from "@mui/material";
import { Star } from "@mui/icons-material";
import axios from "axios";
import { getMediaUrl } from "../../utils/urlHelpers";

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
        const response = await axios.get("http://localhost:8080/api/public/companies");
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

  const duplicatedCompanies = [...companies, ...companies];
  const animationDuration = `${Math.max(24, companies.length * 2.5)}s`;

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 3 }}>
          Top công ty tuyển dụng
        </Typography>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            width: "100%",
            pt: 1,
            pb: 1,
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              animation: `${marquee} ${animationDuration} linear infinite`,
              "& > *": {
                flexShrink: 0,
              },
            }}
          >
            {duplicatedCompanies.map((company, index) => (
              <Paper
                key={`${company.companyId}-${index}`}
                elevation={0}
                onClick={() => onCompanyClick(company)}
                sx={{
                  p: 2,
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  minWidth: 240,
                  height: 92,
                  mr: 2,
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#2563eb",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.05)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Avatar
                  src={getMediaUrl(company.logoUrl)}
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                  }}
                >
                  {company.companyName?.charAt(0)?.toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    fontWeight={800}
                    sx={{
                      fontSize: "0.9rem",
                      color: "#0f172a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {company.companyName}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
                    <Star sx={{ fontSize: 15, color: "#f59e0b" }} />
                    <Typography sx={{ fontSize: "0.8rem", fontWeight: 750, color: "#475569" }}>
                      {company.rating}
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
