import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Stack,
  Typography,
  Tab,
  Tabs,
  IconButton,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import UserLayout from '../../components/UserLayout';
import axios from '../../services/axios';
import { useToast } from '../../contexts/ToastContext';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function CVBuilder() {
  const [tabIndex, setTabIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();
  const contentRef = useRef(null);

  const [cvData, setCvData] = useState({
    personalInfo: {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: `${cvData.personalInfo.fullName || 'CV'}_${Date.now()}`,
  });

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: value },
    }));
  };

  const handleSummaryChange = (e) => {
    setCvData((prev) => ({ ...prev, summary: e.target.value }));
  };

  const addArrayItem = (key, defaultItem) => {
    setCvData((prev) => ({ ...prev, [key]: [...prev[key], defaultItem] }));
  };

  const updateArrayItem = (key, index, field, value) => {
    setCvData((prev) => {
      const newArray = [...prev[key]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [key]: newArray };
    });
  };

  const removeArrayItem = (key, index) => {
    setCvData((prev) => {
      const newArray = [...prev[key]];
      newArray.splice(index, 1);
      return { ...prev, [key]: newArray };
    });
  };

  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => {
    if (skillInput.trim()) {
      setCvData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setCvData((prev) => {
      const newSkills = [...prev.skills];
      newSkills.splice(index, 1);
      return { ...prev, skills: newSkills };
    });
  };

  const handleSaveToBackend = async () => {
    setIsSaving(true);
    try {
      const request = {
        fileName: `${cvData.personalInfo.fullName || 'Untitled'}_CV`,
        cvContent: JSON.stringify(cvData),
      };
      await axios.post('/api/user/cv', request);
      showToast('CV đã được lưu thành công!', 'success');
    } catch (error) {
      console.error('Lỗi lưu CV:', error);
      showToast('Không thể lưu CV. Vui lòng thử lại.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <UserLayout>
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" fontWeight={800} mb={1}>
          Tạo CV của bạn
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Xây dựng CV chuyên nghiệp với các mẫu được thiết kế sẵn
        </Typography>

        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => reactToPrintFn()}
                  sx={{ textTransform: 'none', fontWeight: 700, py: 1.5 }}
                >
                  Tải PDF
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={isSaving ? null : <SaveIcon />}
                  disabled={isSaving}
                  onClick={handleSaveToBackend}
                  sx={{ textTransform: 'none', fontWeight: 700, py: 1.5 }}
                >
                  {isSaving ? 'Đang lưu...' : 'Lưu CV'}
                </Button>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
                  <Tab label="Thông tin" />
                  <Tab label="Kinh nghiệm" />
                  <Tab label="Học vấn" />
                  <Tab label="Kỹ năng" />
                </Tabs>
              </Box>

              {/* Tab 1: Personal Info */}
              <TabPanel value={tabIndex} index={0}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={cvData.personalInfo.fullName}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="Vị trí ứng tuyển"
                    name="title"
                    value={cvData.personalInfo.title}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    name="email"
                    value={cvData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={cvData.personalInfo.phone}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    name="address"
                    value={cvData.personalInfo.address}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="LinkedIn / Website"
                    name="linkedin"
                    value={cvData.personalInfo.linkedin}
                    onChange={handlePersonalInfoChange}
                  />
                  <TextField
                    fullWidth
                    label="Mục tiêu nghề nghiệp"
                    multiline
                    rows={4}
                    value={cvData.summary}
                    onChange={handleSummaryChange}
                  />
                </Stack>
              </TabPanel>

              {/* Tab 2: Experience */}
              <TabPanel value={tabIndex} index={1}>
                <Stack spacing={2}>
                  {cvData.experience.map((exp, idx) => (
                    <Card key={idx} sx={{ bgcolor: '#f8fafc' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            Kinh nghiệm {idx + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeArrayItem('experience', idx)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                        <Stack spacing={1.5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Vị trí"
                            value={exp.role}
                            onChange={(e) =>
                              updateArrayItem('experience', idx, 'role', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Công ty"
                            value={exp.company}
                            onChange={(e) =>
                              updateArrayItem('experience', idx, 'company', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Ngày bắt đầu"
                            placeholder="MM/YYYY"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateArrayItem('experience', idx, 'startDate', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Ngày kết thúc"
                            placeholder="MM/YYYY hoặc Hiện tại"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateArrayItem('experience', idx, 'endDate', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            multiline
                            rows={3}
                            label="Mô tả công việc"
                            value={exp.description}
                            onChange={(e) =>
                              updateArrayItem('experience', idx, 'description', e.target.value)
                            }
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      addArrayItem('experience', {
                        role: '',
                        company: '',
                        startDate: '',
                        endDate: '',
                        description: '',
                      })
                    }
                    sx={{ textTransform: 'none' }}
                  >
                    Thêm kinh nghiệm
                  </Button>
                </Stack>
              </TabPanel>

              {/* Tab 3: Education */}
              <TabPanel value={tabIndex} index={2}>
                <Stack spacing={2}>
                  {cvData.education.map((edu, idx) => (
                    <Card key={idx} sx={{ bgcolor: '#f8fafc' }}>
                      <CardContent>
                        <Stack direction="row" justifyContent="space-between" mb={2}>
                          <Typography variant="subtitle2" fontWeight={700}>
                            Học vấn {idx + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeArrayItem('education', idx)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                        <Stack spacing={1.5}>
                          <TextField
                            fullWidth
                            size="small"
                            label="Bằng cấp"
                            value={edu.degree}
                            onChange={(e) =>
                              updateArrayItem('education', idx, 'degree', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Trường"
                            value={edu.school}
                            onChange={(e) =>
                              updateArrayItem('education', idx, 'school', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Ngày bắt đầu"
                            placeholder="MM/YYYY"
                            value={edu.startDate}
                            onChange={(e) =>
                              updateArrayItem('education', idx, 'startDate', e.target.value)
                            }
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Ngày kết thúc"
                            placeholder="MM/YYYY"
                            value={edu.endDate}
                            onChange={(e) =>
                              updateArrayItem('education', idx, 'endDate', e.target.value)
                            }
                          />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() =>
                      addArrayItem('education', {
                        degree: '',
                        school: '',
                        startDate: '',
                        endDate: '',
                      })
                    }
                    sx={{ textTransform: 'none' }}
                  >
                    Thêm học vấn
                  </Button>
                </Stack>
              </TabPanel>

              {/* Tab 4: Skills */}
              <TabPanel value={tabIndex} index={3}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nhập kỹ năng"
                      placeholder="VD: ReactJS, Node.js"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button variant="contained" onClick={addSkill} sx={{ textTransform: 'none' }}>
                      Thêm
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {cvData.skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        onDelete={() => removeSkill(idx)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Stack>
              </TabPanel>
            </Paper>
          </Grid>

          {/* Preview Section */}
          <Grid item xs={12} md={6}>
            <Paper
              ref={contentRef}
              sx={{
                p: 4,
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                minHeight: '600px',
              }}
            >
              {/* CV Preview Content */}
              <Stack spacing={3}>
                {/* Header */}
                <Box>
                  <Typography variant="h4" fontWeight={900} color="#1e293b">
                    {cvData.personalInfo.fullName || 'Họ và tên'}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" fontWeight={700}>
                    {cvData.personalInfo.title || 'Vị trí ứng tuyển'}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    {cvData.personalInfo.email && (
                      <Typography variant="body2" color="text.secondary">
                        {cvData.personalInfo.email}
                      </Typography>
                    )}
                    {cvData.personalInfo.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {cvData.personalInfo.phone}
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Divider />

                {/* Summary */}
                {cvData.summary && (
                  <>
                    <Box>
                      <Typography variant="h6" fontWeight={700} mb={1}>
                        Mục tiêu
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cvData.summary}
                      </Typography>
                    </Box>
                    <Divider />
                  </>
                )}

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <>
                    <Box>
                      <Typography variant="h6" fontWeight={700} mb={2}>
                        Kinh nghiệm
                      </Typography>
                      <Stack spacing={2}>
                        {cvData.experience.map((exp, idx) => (
                          <Box key={idx}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {exp.role}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {exp.company}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {' '} | {exp.startDate} - {exp.endDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {exp.description}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <Divider />
                  </>
                )}

                {/* Education */}
                {cvData.education.length > 0 && (
                  <>
                    <Box>
                      <Typography variant="h6" fontWeight={700} mb={2}>
                        Học vấn
                      </Typography>
                      <Stack spacing={2}>
                        {cvData.education.map((edu, idx) => (
                          <Box key={idx}>
                            <Typography variant="subtitle2" fontWeight={700}>
                              {edu.degree}
                            </Typography>
                            <Typography variant="caption" color="primary">
                              {edu.school}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {' '} | {edu.startDate} - {edu.endDate}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                    <Divider />
                  </>
                )}

                {/* Skills */}
                {cvData.skills.length > 0 && (
                  <Box>
                    <Typography variant="h6" fontWeight={700} mb={1}>
                      Kỹ năng
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {cvData.skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small" />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </UserLayout>
  );
}

