import React, { useEffect } from "react";
import { Box } from "@mui/material";
import EmployerHero from "../../components/for-employers/EmployerHero";
import EmployerFeatures from "../../components/for-employers/EmployerFeatures";
import EmployerProcess from "../../components/for-employers/EmployerProcess";
import EmployerPricing from "../../components/for-employers/EmployerPricing";
import EmployerFAQ from "../../components/for-employers/EmployerFAQ";
import UserLayout from "../../components/UserLayout";

const ForEmployers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <UserLayout>
      <Box sx={{ mx: { xs: -4, md: -10 } }}> {/* Phá vỡ Container padding của UserLayout để full-width sections */}
        <EmployerHero />
        <EmployerFeatures />
        <EmployerProcess />
        <EmployerPricing />
        <EmployerFAQ />
      </Box>
    </UserLayout>
  );
};

export default ForEmployers;
