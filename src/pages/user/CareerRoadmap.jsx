import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Paper,
  TextField,
  Alert,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  TrendingUp,
  Timeline,
  AutoAwesome,
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import { evaluateCvFile, generateCareerRoadmap } from "../../services/aiService";

const UploadFormSection = ({ cvFile, targetRole, desiredRoadmap, error, isAnalyzing, onFileUpload, onTargetRoleChange, onDesiredRoadmapChange, onAnalyze, onReset }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <CloudUpload color="primary" />
      Tải lên CV của bạn
    </Typography>

    <Grid container spacing={4} alignItems="flex-start">
      {/* Left: Upload Area */}
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            textAlign: "center",
            p: 3,
            borderRadius: "12px",
            border: "2px dashed #cbd5e1",
            bgcolor: "#f8fafc",
            transition: "all 0.3s ease",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            "&:hover": {
              borderColor: "#4f46e5",
              bgcolor: "#f0f4ff",
            },
          }}
        >
          <Button
            variant="text"
            component="label"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              textTransform: "none",
              "&:hover": { bgcolor: "transparent" },
            }}
          >
            <CloudUpload
              sx={{
                fontSize: 48,
                color: "#4f46e5",
                mb: 1,
              }}
            />
            <Typography variant="body1" fontWeight="600" color="#0f172a">
              Chọn file CV
            </Typography>
            <Typography variant="caption" color="#64748b">
              PDF, DOC, DOCX (tối đa 5MB)
            </Typography>
            <input
              type="file"
              hidden
              accept=".pdf,.doc,.docx"
              onChange={onFileUpload}
            />
          </Button>
        </Box>

        {cvFile && (
          <Alert
            severity="success"
            sx={{
              mt: 2,
              bgcolor: "#dcfce7",
              color: "#166534",
              border: "1px solid #86efac",
              "& .MuiAlert-icon": { color: "#16a34a" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CheckCircle sx={{ fontSize: 20 }} />
              <Typography
                variant="body2"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "300px",
                }}
              >
                Đã tải lên: {cvFile.name}
              </Typography>
            </Box>
          </Alert>
        )}
      </Grid>

      {/* Right: Form Inputs */}
      <Grid item xs={12} md={6}>
        <Stack spacing={2} sx={{ height: "100%", justifyContent: "flex-start" }}>
          <TextField
            fullWidth
            label="Vị trí mục tiêu (tùy chọn)"
            placeholder="VD: Frontend Developer, Data Scientist..."
            value={targetRole}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
          <TextField
            fullWidth
            label="Lộ trình mong muốn"
            placeholder="VD: Fullstack, AI/ML, Product Manager..."
            value={desiredRoadmap}
            onChange={(e) => onDesiredRoadmapChange(e.target.value)}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                bgcolor: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                "& .MuiAlert-icon": { color: "#dc2626" },
              }}
            >
              {error}
            </Alert>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={onAnalyze}
              disabled={isAnalyzing || !cvFile}
              startIcon={isAnalyzing ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
              sx={{
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "600",
                bgcolor: "#4f46e5",
                "&:hover": { bgcolor: "#4338ca" },
                "&:disabled": { bgcolor: "#cbd5e1", color: "#f1f5f9" },
              }}
            >
              {isAnalyzing ? "Đang phân tích..." : "Phân tích CV"}
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={onReset}
              sx={{
                py: 1.5,
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "600",
                borderColor: "#e2e8f0",
                color: "#0f172a",
                "&:hover": { borderColor: "#cbd5e1", bgcolor: "#f8fafc" },
              }}
            >
              Làm mới
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  </Paper>
);

const EvaluationCard = ({ evaluation, targetRole, desiredRoadmap }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      height: "100%",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Timeline color="primary" />
      Đánh giá CV
    </Typography>

    {evaluation && (
      <>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="700" mb={2} color="#64748b" sx={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
            Điểm số
          </Typography>
          {evaluation.score != null && (
            <Typography
              variant="h3"
              fontWeight="900"
              mb={2}
              color="#4f46e5"
              sx={{ lineHeight: 1 }}
            >
              {evaluation.score}
              <span style={{ fontSize: "0.6em", fontWeight: "600", marginLeft: "4px" }}>/ 100</span>
            </Typography>
          )}
          {evaluation.summary && (
            <Typography variant="body2" color="#64748b" sx={{ lineHeight: 1.6 }}>
              {evaluation.summary}
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box>
          <Typography variant="subtitle2" fontWeight="700" mb={2} color="#64748b" sx={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.5px" }}>
            Mục tiêu của bạn
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" fontWeight="600" color="#64748b">
                Vị trí mục tiêu
              </Typography>
              <Typography variant="body2" color="#0f172a" fontWeight="500" mt={0.5}>
                {targetRole || "Chưa nhập vị trí mục tiêu"}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" fontWeight="600" color="#64748b">
                Lộ trình mong muốn
              </Typography>
              <Typography variant="body2" color="#0f172a" fontWeight="500" mt={0.5}>
                {desiredRoadmap || "AI sẽ đề xuất lộ trình theo mục tiêu của bạn"}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </>
    )}
  </Paper>
);

const SkillGroup = ({ title, skills, color, bgColor, icon }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      bgcolor: bgColor,
    }}
  >
    <Typography variant="subtitle2" fontWeight="700" mb={2} color={color} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {title}
    </Typography>
    <Stack spacing={1.5}>
      {skills.map((skill, index) => (
        <Box
          key={`${title}-${index}`}
          sx={{
            p: 1.5,
            borderRadius: "8px",
            bgcolor: "white",
            border: `1px solid ${color}`,
            color: color,
            fontWeight: "500",
            fontSize: "0.875rem",
            wordBreak: "break-word",
            overflow: "visible",
          }}
        >
          {skill}
        </Box>
      ))}
    </Stack>
  </Box>
);

const SkillAnalysisCard = ({ evaluation }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
      height: "100%",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <AutoAwesome color="primary" />
      Phân tích kỹ năng
    </Typography>

    <Stack spacing={2.5}>
      {evaluation.strengths?.length > 0 && (
        <SkillGroup
          title="Điểm mạnh"
          skills={evaluation.strengths}
          color="#16a34a"
          bgColor="#f0fdf4"
        />
      )}
      {evaluation.weaknesses?.length > 0 && (
        <SkillGroup
          title="Điểm cần cải thiện"
          skills={evaluation.weaknesses}
          color="#f97316"
          bgColor="#fff7ed"
        />
      )}
      {evaluation.missingSkills?.length > 0 && (
        <SkillGroup
          title="Kỹ năng thiếu"
          skills={evaluation.missingSkills}
          color="#dc2626"
          bgColor="#fef2f2"
        />
      )}
    </Stack>
  </Paper>
);

const RoadmapItemCard = ({ phase, index }) => (
  <Card
    variant="outlined"
    sx={{
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      overflow: "hidden",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
        borderColor: "#cbd5e1",
      },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 2,
        }}
      >
        <Box
          sx={{
            minWidth: "32px",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            bgcolor: "#4f46e5",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "700",
            fontSize: "0.875rem",
            flexShrink: 0,
          }}
        >
          {index + 1}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#0f172a">
            {phase.title || phase.name || `Bước ${index + 1}`}
          </Typography>
          {phase.description && (
            <Typography variant="body2" color="#64748b" sx={{ mt: 1, lineHeight: 1.6 }}>
              {phase.description}
            </Typography>
          )}
        </Box>
      </Box>

      {phase.skills?.length > 0 && (
        <Box sx={{ mt: 2.5, mb: 2 }}>
          <Stack spacing={1}>
            {phase.skills.map((skill, skillIndex) => (
              <Box
                key={skillIndex}
                sx={{
                  p: 1,
                  borderRadius: "6px",
                  bgcolor: "#ede9fe",
                  color: "#4f46e5",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  wordBreak: "break-word",
                }}
              >
                {skill}
              </Box>
            ))}
          </Stack>
        </Box>
      )}

      {phase.duration && (
        <Typography
          variant="caption"
          sx={{
            display: "inline-block",
            mt: 1,
            px: 2,
            py: 0.75,
            borderRadius: "6px",
            bgcolor: "#f0f4ff",
            color: "#4f46e5",
            fontWeight: "600",
          }}
        >
          ⏱ {phase.duration}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const RoadmapSection = ({ roadmap }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <Timeline color="primary" />
      Lộ trình học tập đề xuất
    </Typography>

    <Grid container spacing={2.5}>
      {(roadmap.learningPath || roadmap.roadmap || []).map((phase, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <RoadmapItemCard phase={phase} index={index} />
        </Grid>
      ))}

      {!roadmap.learningPath?.length && !roadmap.roadmap?.length && roadmap.summary && (
        <Grid item xs={12}>
          <Typography variant="body2" color="#64748b" sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "12px", borderLeft: "4px solid #4f46e5" }}>
            {roadmap.summary}
          </Typography>
        </Grid>
      )}
    </Grid>
  </Paper>
);

const MarketTrendsSection = ({ roadmap }) => (
  <Paper
    sx={{
      p: 4,
      borderRadius: "20px",
      border: "1px solid #e2e8f0",
      bgcolor: "#ffffff",
      boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    }}
  >
    <Typography
      variant="h6"
      fontWeight="700"
      mb={3}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <TrendingUp color="success" />
      Xu hướng thị trường
    </Typography>

    <Grid container spacing={2.5}>
      {(roadmap.marketTrends || []).map((trend, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card
            variant="outlined"
            sx={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              bgcolor: "#f8fafc",
              height: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#16a34a",
                boxShadow: "0 8px 20px rgba(22, 163, 74, 0.08)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="body2"
                fontWeight="700"
                color="#16a34a"
                mb={1.5}
              >
                {trend.skill || trend.topic}
              </Typography>
              <Stack spacing={0.75}>
                {trend.demand && (
                  <Typography variant="caption" color="#64748b" display="block">
                    <strong>Nhu cầu:</strong> {trend.demand}
                  </Typography>
                )}
                {trend.salary && (
                  <Typography variant="caption" color="#64748b" display="block">
                    <strong>Lương:</strong> {trend.salary}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

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
    if (file && (file.type === "application/pdf" || file.type.includes("word"))) {
      setCvFile(file);
      setError("");
    } else {
      setError("Vui lòng chọn file PDF hoặc Word (.doc, .docx)");
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
    <UserLayout>
      <Box sx={{ py: 6, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight="900"
              color="#4f46e5"
              mb={2}
              sx={{ lineHeight: 1.2 }}
            >
              AI Career Mentor
            </Typography>
            <Typography
              variant="body1"
              color="#64748b"
              mb={4}
              sx={{ fontSize: "1.125rem", fontWeight: "500", maxWidth: "600px", mx: "auto" }}
            >
              Nhận đề xuất lộ trình học tập cá nhân hóa dựa trên CV của bạn và xu hướng thị trường
            </Typography>
          </Box>

          <Stack spacing={4}>
            {/* Upload Form - Full Width */}
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

            {/* Results Section */}
            {evaluation && roadmap && (
              <>
                {/* CV Evaluation & Skills Analysis */}
                <Grid container spacing={4} alignItems="flex-start">
                  <Grid item xs={12} md={4}>
                    <EvaluationCard
                      evaluation={evaluation}
                      targetRole={targetRole}
                      desiredRoadmap={desiredRoadmap}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <SkillAnalysisCard evaluation={evaluation} />
                  </Grid>
                </Grid>

                {/* Roadmap Section */}
                <RoadmapSection roadmap={roadmap} />

                {/* Market Trends */}
                <MarketTrendsSection roadmap={roadmap} />
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </UserLayout>
  );
};

export default CareerRoadmap;
