import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Paper,
  TextField,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  School,
  TrendingUp,
  Timeline,
  AutoAwesome,
} from "@mui/icons-material";
import UserLayout from "../../components/UserLayout";
import { generateCareerRoadmap } from "../../services/aiService";

const CareerRoadmap = () => {
  const [cvFile, setCvFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

    try {
      // Đọc nội dung file (giả lập - trong thực tế cần xử lý PDF/Word)
      const cvContent = "Nội dung CV sẽ được trích xuất từ file"; // Placeholder
      const currentSkills = "JavaScript, React, Node.js"; // Placeholder từ CV

      // Mock data cho demo - thay thế bằng API call thực tế
      const mockRoadmap = {
        currentSkills: [
          { name: "JavaScript", level: "intermediate" },
          { name: "React", level: "intermediate" },
          { name: "Node.js", level: "beginner" },
          { name: "HTML/CSS", level: "advanced" },
        ],
        learningPath: [
          {
            title: "Tháng 1-2: Nâng cao Frontend Skills",
            description: "Tập trung vào các kỹ năng frontend hiện đại và best practices",
            skills: ["TypeScript", "Next.js", "Tailwind CSS", "Testing (Jest)"],
            duration: "2 tháng"
          },
          {
            title: "Tháng 3-4: Backend Development",
            description: "Học các framework backend và database design",
            skills: ["Express.js", "MongoDB", "REST APIs", "Authentication"],
            duration: "2 tháng"
          },
          {
            title: "Tháng 5-6: DevOps & Deployment",
            description: "Học về deployment, CI/CD và cloud platforms",
            skills: ["Docker", "AWS/GCP", "CI/CD", "Monitoring"],
            duration: "2 tháng"
          }
        ],
        marketTrends: [
          { skill: "React/TypeScript", demand: "Cao", salary: "25-35 triệu/tháng" },
          { skill: "Node.js", demand: "Cao", salary: "20-30 triệu/tháng" },
          { skill: "Cloud (AWS/GCP)", demand: "Rất cao", salary: "30-45 triệu/tháng" },
          { skill: "DevOps", demand: "Cao", salary: "25-40 triệu/tháng" }
        ]
      };

      // Uncomment khi có API thực tế:
      // const result = await generateCareerRoadmap(cvContent, currentSkills, targetRole);
      // setRoadmap(result);

      // Sử dụng mock data tạm thời
      setTimeout(() => {
        setRoadmap(mockRoadmap);
        setIsAnalyzing(false);
      }, 2000); // Giả lập thời gian xử lý

    } catch (err) {
      setError("Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại.");
      console.error("Lỗi phân tích CV:", err);
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setCvFile(null);
    setTargetRole("");
    setRoadmap(null);
    setError("");
  };

  return (
    <UserLayout>
      <Box sx={{ py: 6, bgcolor: "#f8fafc", minHeight: "100vh" }}>
        <Container maxWidth="lg">
          {/* Header Section */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography variant="h3" fontWeight="900" color="primary" mb={2}>
              AI Career Mentor
            </Typography>
            <Typography variant="h6" color="text.secondary" mb={4}>
              Nhận đề xuất lộ trình học tập dựa trên CV của bạn và xu hướng thị trường
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Upload Section */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 4, borderRadius: 3, border: "2px dashed #e2e8f0" }}>
                <Typography variant="h6" fontWeight="700" mb={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CloudUpload color="primary" />
                  Tải lên CV của bạn
                </Typography>

                <Box sx={{ textAlign: "center", mb: 3 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      border: "2px dashed #6366f1",
                      borderRadius: 2,
                      py: 4,
                      px: 6,
                      display: "block",
                      "&:hover": { borderColor: "#4f46e5" }
                    }}
                  >
                    <CloudUpload sx={{ fontSize: 48, color: "#6366f1", mb: 2 }} />
                    <Typography variant="body1" fontWeight="600">
                      Chọn file CV
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, DOC, DOCX (tối đa 5MB)
                    </Typography>
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Box>

                {cvFile && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    Đã tải lên: {cvFile.name}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Vị trí mục tiêu (tùy chọn)"
                  placeholder="VD: Frontend Developer, Data Scientist..."
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  sx={{ mb: 3 }}
                />

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !cvFile}
                    startIcon={isAnalyzing ? <CircularProgress size={20} /> : <AutoAwesome />}
                    sx={{ py: 1.5 }}
                  >
                    {isAnalyzing ? "Đang phân tích..." : "Phân tích CV"}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ py: 1.5 }}
                  >
                    Làm mới
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} md={6}>
              {roadmap ? (
                <Paper sx={{ p: 4, borderRadius: 3, height: "fit-content" }}>
                  <Typography variant="h6" fontWeight="700" mb={3} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Timeline color="primary" />
                    Lộ trình học tập đề xuất
                  </Typography>

                  {/* Current Skills Assessment */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" mb={2}>
                      Đánh giá kỹ năng hiện tại
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                      {roadmap.currentSkills?.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill.name}
                          color={skill.level === "advanced" ? "success" : skill.level === "intermediate" ? "warning" : "error"}
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Learning Roadmap */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" mb={3}>
                      Lộ trình học tập (6 tháng)
                    </Typography>

                    <Stepper orientation="vertical">
                      {roadmap.learningPath?.map((phase, index) => (
                        <Step key={index} active={true}>
                          <StepLabel>
                            <Typography variant="subtitle2" fontWeight="600">
                              {phase.title}
                            </Typography>
                          </StepLabel>
                          <StepContent>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                              {phase.description}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {phase.skills?.map((skill, skillIndex) => (
                                <Chip
                                  key={skillIndex}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                />
                              ))}
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                              Thời gian: {phase.duration}
                            </Typography>
                          </StepContent>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Market Trends */}
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" mb={2} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <TrendingUp color="success" />
                      Xu hướng thị trường
                    </Typography>
                    <Stack spacing={2}>
                      {roadmap.marketTrends?.map((trend, index) => (
                        <Card key={index} variant="outlined" sx={{ bgcolor: "#f8fafc" }}>
                          <CardContent sx={{ py: 2 }}>
                            <Typography variant="body2" fontWeight="600" color="primary">
                              {trend.skill}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Nhu cầu: {trend.demand} • Lương trung bình: {trend.salary}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center", bgcolor: "#f8fafc" }}>
                  <School sx={{ fontSize: 64, color: "#e2e8f0", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" mb={2}>
                    Chưa có kết quả phân tích
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tải lên CV và nhấn "Phân tích CV" để nhận lộ trình học tập cá nhân hóa
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </UserLayout>
  );
};

export default CareerRoadmap;