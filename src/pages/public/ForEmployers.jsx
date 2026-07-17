import React, { useEffect } from "react";
import { Box } from "@mui/material";
import EmployerHero from "../../components/employer/EmployerHero";
import EmployerFeatures from "../../components/employer/EmployerFeatures";
import EmployerProcess from "../../components/employer/EmployerProcess";
import EmployerPricing from "../../components/employer/EmployerPricing";
import EmployerFAQ from "../../components/employer/EmployerFAQ";

const ForEmployers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Box sx={{ mx: { xs: -4, md: -10 } }}> {/* Phá vỡ Container padding của UserLayout để full-width sections */}
        <EmployerHero />
        <EmployerFeatures />
        <EmployerProcess />
        <EmployerPricing />
        <EmployerFAQ />
      </Box>
    );
};

export default ForEmployers;
