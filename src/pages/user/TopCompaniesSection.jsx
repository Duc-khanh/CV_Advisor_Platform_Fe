import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, Paper, Avatar, Stack } from "@mui/material";
import { Star } from "@mui/icons-material";
import axios from "axios";
import { getMediaUrl } from "../../utils/urlHelpers";

export default function TopCompaniesSection({ onCompanyClick }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/public/companies/top");
        setCompanies(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách top công ty:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  if (loading || companies.length === 0) return null;

  // Display top 5 companies as shown in the screenshot, plus a "Xem tất cả" card
  const displayCompanies = companies.slice(0, 5);

  return (
    <Box sx={{ py: 6, bgcolor: "#ffffff", borderTop: "1px solid #f1f5f9" }}>
      <Container maxWidth="xl">
        <Typography variant="h6" fontWeight={900} color="#0f172a" sx={{ mb: 3 }}>
          Top công ty tuyển dụng
        </Typography>

        <Grid
          container
          spacing={2.5}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
              lg: "repeat(6, 1fr)",
            },
          }}
        >
          {displayCompanies.map((company) => (
            <Grid item key={company.companyId} sx={{ display: "contents" }}>
              <Paper
                elevation={0}
                onClick={() => onCompanyClick(company)}
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  bgcolor: "#ffffff",
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  width: "100%",
                  minWidth: 0,
                  height: 88,
                  overflow: 'hidden',
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
                    width: 44,
                    height: 44,
                    bgcolor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                >
                  {company.companyName.charAt(0).toUpperCase()}
                </Avatar>

                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    fontWeight={800}
                    sx={{
                      fontSize: "0.88rem",
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
            </Grid>
          ))}

          {/* View All Company Card */}
          <Grid item sx={{ display: "contents" }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.25s ease",
                width: "100%",
                minWidth: 0,
                height: 88,
                overflow: 'hidden',
                "&:hover": {
                  borderColor: "#2563eb",
                  boxShadow: "0 8px 24px rgba(37,99,235,0.05)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Typography
                fontWeight={800}
                sx={{
                  fontSize: "0.88rem",
                  color: "#2563eb",
                }}
              >
                Xem tất cả
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
