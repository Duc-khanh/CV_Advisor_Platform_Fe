import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import EmployerHero from "../../components/employer/EmployerHero";
import EmployerAiDemo from "../../components/employer/EmployerAiDemo";
import EmployerFeatures from "../../components/employer/EmployerFeatures";
import EmployerProcess from "../../components/employer/EmployerProcess";
import EmployerPricing from "../../components/employer/EmployerPricing";
import EmployerFAQ from "../../components/employer/EmployerFAQ";
import EmployerRegisterModal from "../../components/employer/EmployerRegisterModal";

const ForEmployers = () => {
  const location = useLocation();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      location.hash === "#employer-register" ||
      location.state?.openRegister
    ) {
      setIsRegisterOpen(true);
    }
  }, [location.hash, location.state]);

  const handleOpenRegister = (planName = "") => {
    setSelectedPlan(planName);
    setIsRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
  };

  return (
    <Box sx={{ width: "100%", overflowX: "hidden", bgcolor: "#ffffff" }}>
      {/* 1. Hero Section công nghệ cao với mô hình vệ tinh & live metrics */}
      <EmployerHero onOpenRegister={() => handleOpenRegister()} />

      {/* 2. Interactive AI Candidate Screening Simulator Demo */}
      <EmployerAiDemo onOpenRegister={() => handleOpenRegister()} />

      {/* 3. Features module với framer-motion hover */}
      <EmployerFeatures />

      {/* 4. Process quy trình tuyển dụng tinh gọn */}
      <EmployerProcess />

      {/* 5. Pricing với toggle Tháng / Năm tiết kiệm 20% */}
      <EmployerPricing onOpenRegister={handleOpenRegister} />

      {/* 6. FAQ Accordion & Hotline hỗ trợ 24/7 */}
      <EmployerFAQ />

      {/* 7. Modal Popup Đăng ký Doanh nghiệp */}
      <EmployerRegisterModal
        open={isRegisterOpen}
        onClose={handleCloseRegister}
        selectedPlan={selectedPlan}
      />
    </Box>
  );
};

export default ForEmployers;
