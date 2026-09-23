import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import EmployerHero from "../../components/employer/EmployerHero";
import EmployerFeatures from "../../components/employer/EmployerFeatures";
import EmployerProcess from "../../components/employer/EmployerProcess";
import EmployerPricing from "../../components/employer/EmployerPricing";
import EmployerFAQ from "../../components/employer/EmployerFAQ";
import EmployerFooter from "../../components/employer/EmployerFooter";
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
    <Box sx={{ mx: { xs: -4, md: -10 }, mb: -4 }}>
      {/* 1. Hero Section với nút mở modal */}
      <EmployerHero onOpenRegister={() => handleOpenRegister()} />

      {/* 2. Features */}
      <EmployerFeatures />

      {/* 3. Process */}
      <EmployerProcess />

      {/* 4. Pricing với các nút mở modal theo gói */}
      <EmployerPricing onOpenRegister={handleOpenRegister} />

      {/* 5. FAQ */}
      <EmployerFAQ />

      {/* 6. Footer B2B chuẩn thay thế vị trí form cũ */}
      <EmployerFooter onOpenRegister={() => handleOpenRegister()} />

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
