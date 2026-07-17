import React, { useState } from "react";
import { Box, Container, Stack, Grid } from "@mui/material";
import { evaluateCvFile, generateCareerRoadmap } from "../../services/ai/aiService";
import {
  HeaderSection,
  UploadFormSection,
  EvaluationCard,
  SkillAnalysisCard,
  RoadmapSection,
  MarketTrendsSection,
} from "../../components/roadmap";

const CareerRoadmap = () => {
  const [cvFile, setCvFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [desiredRoadmap, setDesiredRoadmap] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setCvFile(file);
      setError("");
    } else {
      setError("Vui lòng chọn file CV định dạng PDF");
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      setError("Vui lòng tải lên CV của bạn");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setEvaluation(null);
    setRoadmap(null);

    try {
      const evaluationResult = await evaluateCvFile(cvFile, targetRole.trim());
      setEvaluation(evaluationResult);

      const roadmapResult = await generateCareerRoadmap(cvFile, targetRole.trim(), desiredRoadmap.trim());
      setRoadmap(roadmapResult);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.";
      setError(message);
      console.error("Lỗi phân tích CV:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCvFile(null);
    setTargetRole("");
    setDesiredRoadmap("");
    setEvaluation(null);
    setRoadmap(null);
    setError("");
  };

  return (
    <Box sx={{ py: 6, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <HeaderSection />

          <Stack spacing={4}>
            <UploadFormSection
              cvFile={cvFile}
              targetRole={targetRole}
              desiredRoadmap={desiredRoadmap}
              error={error}
              isAnalyzing={isAnalyzing}
              onFileUpload={handleFileUpload}
              onTargetRoleChange={setTargetRole}
              onDesiredRoadmapChange={setDesiredRoadmap}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
            />

            {evaluation && roadmap && (
              <>
                <Grid container spacing={4} alignItems="flex-start">
                  <Grid item xs={12} md={5}>
                    <EvaluationCard
                      evaluation={evaluation}
                      targetRole={targetRole}
                      desiredRoadmap={desiredRoadmap}
                    />
                  </Grid>
                  <Grid item xs={12} md={7}>
                    <SkillAnalysisCard evaluation={evaluation} />
                  </Grid>
                </Grid>

                <RoadmapSection roadmap={roadmap} />
                <MarketTrendsSection roadmap={roadmap} />
              </>
            )}
          </Stack>
        </Container>
      </Box>
    );
};

export default CareerRoadmap;
