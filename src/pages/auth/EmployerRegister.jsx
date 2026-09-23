import React, { useEffect } from "react";
import { Box } from "@mui/material";
import EmployerRegisterSection from "../../components/employer/EmployerRegisterSection";
import CandidateHeader from "../user/CandidateHeader";
import UserFooter from "../user/UserFooter";

export default function EmployerRegister() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CandidateHeader />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <EmployerRegisterSection />
      </Box>
      <UserFooter />
    </Box>
  );
}
