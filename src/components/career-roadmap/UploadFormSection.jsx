import React from "react";
import { Box, Paper } from "@mui/material";
import FileUploadField from "./FileUploadField";
import FileSuccessAlert from "./FileSuccessAlert";
import TargetRoleInput from "./TargetRoleInput";
import DesiredRoadmapInput from "./DesiredRoadmapInput";
import ErrorAlert from "./ErrorAlert";
import ActionButtons from "./ActionButtons";

const UploadFormSection = ({
  cvFile,
  targetRole,
  desiredRoadmap,
  error,
  isAnalyzing,
  onFileUpload,
  onTargetRoleChange,
  onDesiredRoadmapChange,
  onAnalyze,
  onReset,
}) => (
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      p: { xs: 2, md: 2.5 },
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      boxSizing: "border-box",
      overflow: "hidden",
    }}
  >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "5fr 7fr",
          },
          gap: 2,
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            minHeight: { xs: 'auto', md: 140 },
            p: { xs: 1.5, md: 2 },
            borderRadius: "20px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
        <FileUploadField onFileUpload={onFileUpload} />
        <FileSuccessAlert cvFile={cvFile} />
      </Box>

      <Box
        sx={{
          minWidth: 0,
          minHeight: { xs: 'auto', md: 150 },
          p: { xs: 1.5, md: 2 },
          borderRadius: "20px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TargetRoleInput
          value={targetRole}
          onChange={onTargetRoleChange}
        />

        <DesiredRoadmapInput
          value={desiredRoadmap}
          onChange={onDesiredRoadmapChange}
        />

        <ErrorAlert error={error} />

        <Box sx={{ mt: "auto" }}>
          <ActionButtons
            isAnalyzing={isAnalyzing}
            cvFile={cvFile}
            onAnalyze={onAnalyze}
            onReset={onReset}
          />
        </Box>
      </Box>
    </Box>
  </Paper>
);

export default UploadFormSection;