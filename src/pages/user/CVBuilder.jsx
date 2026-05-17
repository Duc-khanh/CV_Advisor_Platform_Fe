import React, { useState, useRef, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import {
  Box, Paper, TextField, Button, Stack, Typography,
  Tab, Tabs, IconButton, Chip, Divider, Avatar, Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon, Add as AddIcon,
  Download as DownloadIcon, Save as SaveIcon,
  Person as PersonIcon, Work as WorkIcon,
  School as SchoolIcon, Psychology as SkillIcon,
  Email as EmailIcon, Phone as PhoneIcon,
  LocationOn as LocationIcon, LinkedIn as LinkedInIcon,
  CameraAlt as CameraIcon,
} from '@mui/icons-material';
import UserLayout from '../../components/UserLayout';
import axios from '../../services/axios';
import { useToast } from '../../contexts/ToastContext';

/* ─────────────────────────────────────────────────── */
function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null;
}

const TABS = [
  { label: 'Thông tin', icon: <PersonIcon fontSize="small" /> },
  { label: 'Kinh nghiệm', icon: <WorkIcon fontSize="small" /> },
  { label: 'Học vấn', icon: <SchoolIcon fontSize="small" /> },
  { label: 'Kỹ năng', icon: <SkillIcon fontSize="small" /> },
];

/* ─────────────────────────────────────────────────── */
export default function CVBuilder() {
  const [tabIndex, setTabIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const showToast = useToast();
  const printRef = useRef(null);
  const [skillInput, setSkillInput] = useState('');

  // Avatar state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  const [cvData, setCvData] = useState({
    personalInfo: { fullName: '', title: '', email: '', phone: '', address: '', linkedin: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  });

  /* ── react-to-print v3: useReactToPrint returns a trigger fn directly ── */
  const handlePrint = useReactToPrint({ contentRef: printRef });

  /* ── Handlers ── */
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setCvData((prev) => ({ ...prev, personalInfo: { ...prev.personalInfo, [name]: value } }));
  };

  const handleSummaryChange = (e) => setCvData((prev) => ({ ...prev, summary: e.target.value }));

  const addArrayItem = (key, item) =>
    setCvData((prev) => ({ ...prev, [key]: [...prev[key], item] }));

  const updateArrayItem = (key, idx, field, value) =>
    setCvData((prev) => {
      const arr = [...prev[key]];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, [key]: arr };
    });

  const removeArrayItem = (key, idx) =>
    setCvData((prev) => {
      const arr = [...prev[key]];
      arr.splice(idx, 1);
      return { ...prev, [key]: arr };
    });

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setCvData((prev) => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
    setSkillInput('');
  };

  const removeSkill = (idx) =>
    setCvData((prev) => {
      const s = [...prev.skills];
      s.splice(idx, 1);
      return { ...prev, skills: s };
    });

  /* ── Avatar upload ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Vui lòng chọn file ảnh (JPG, PNG...)', 'warning');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ── Save CV (multipart: JSON + optional avatar) ── */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append(
        'data',
        new Blob(
          [JSON.stringify({
            fileName: `${cvData.personalInfo.fullName || 'Untitled'}_CV`,
            cvContent: JSON.stringify(cvData),
          })],
          { type: 'application/json' }
        )
      );
      if (avatarFile) formData.append('avatar', avatarFile);

      await axios.post('/api/user/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showToast('CV đã được lưu thành công!', 'success');
    } catch (err) {
      // Fallback: try plain JSON save if backend doesn't support multipart
      try {
        await axios.post('/api/user/cv', {
          fileName: `${cvData.personalInfo.fullName || 'Untitled'}_CV`,
          cvContent: JSON.stringify(cvData),
        });
        showToast('CV đã được lưu thành công!', 'success');
      } catch {
        const msg = err?.response?.data?.message || 'Không thể lưu CV. Vui lòng thử lại.';
        showToast(msg, 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const { personalInfo, summary, experience, education, skills } = cvData;

  /* ══════════════════════════════════════════════════ */
  return (
    <UserLayout>
      {/* ── Header ── */}
      <Box sx={{
        background: 'linear-gradient(135deg,#667eea,#764ba2)',
        px: 4, py: 2.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#fff">✨ CV Builder</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
            Tạo CV chuyên nghiệp – xem trước trực tiếp
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" startIcon={<SaveIcon />} disabled={isSaving} onClick={handleSave}
            sx={{ color:'#fff', borderColor:'rgba(255,255,255,0.5)', textTransform:'none', fontWeight:700,
              '&:hover':{ borderColor:'#fff', bgcolor:'rgba(255,255,255,0.1)' } }}>
            {isSaving ? 'Đang lưu...' : 'Lưu CV'}
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => handlePrint()}
            sx={{ bgcolor:'#fff', color:'#667eea', fontWeight:700, textTransform:'none',
              boxShadow:'0 4px 14px rgba(0,0,0,0.15)', '&:hover':{ bgcolor:'#f0f0ff' } }}>
            Tải PDF
          </Button>
        </Stack>
      </Box>

      {/* ── Split-screen body ── */}
      <Box sx={{ display:'flex', flex:1, overflow:'hidden', height:'calc(100vh - 116px)' }}>

        {/* ───────── LEFT: Form ───────── */}
        <Box sx={{
          width:'50%', overflowY:'auto', bgcolor:'#f8f9ff', borderRight:'1px solid #e0e0f0',
          '&::-webkit-scrollbar':{ width:6 },
          '&::-webkit-scrollbar-thumb':{ bgcolor:'#c7c7e0', borderRadius:3 },
        }}>
          <Box sx={{ p: 3 }}>
            {/* Tabs */}
            <Paper elevation={0} sx={{ mb:3, borderRadius:3, overflow:'hidden', border:'1px solid #e2e8f0' }}>
              <Tabs value={tabIndex} onChange={(_,v) => setTabIndex(v)} variant="fullWidth"
                sx={{
                  '& .MuiTab-root':{ textTransform:'none', fontWeight:600, fontSize:'0.82rem', minHeight:52 },
                  '& .MuiTabs-indicator':{ background:'linear-gradient(90deg,#667eea,#764ba2)', height:3, borderRadius:'3px 3px 0 0' },
                  '& .Mui-selected':{ color:'#667eea !important' },
                }}>
                {TABS.map((t,i) => <Tab key={i} label={t.label} icon={t.icon} iconPosition="start" />)}
              </Tabs>
            </Paper>

            {/* ── Tab 0: Personal Info ── */}
            <TabPanel value={tabIndex} index={0}>
              <Stack spacing={2}>
                {/* Avatar upload */}
                <SectionCard title="Ảnh đại diện">
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Box sx={{ position:'relative' }}>
                      <Avatar
                        src={avatarPreview}
                        sx={{ width:90, height:90, border:'3px solid #667eea', fontSize:'2rem',
                          bgcolor: avatarPreview ? 'transparent' : '#e8eaf6' }}>
                        {!avatarPreview && <PersonIcon sx={{ fontSize:40, color:'#667eea' }} />}
                      </Avatar>
                      <Tooltip title="Thay đổi ảnh">
                        <IconButton size="small" onClick={() => avatarInputRef.current?.click()}
                          sx={{ position:'absolute', bottom:-4, right:-4, bgcolor:'#667eea', color:'#fff',
                            width:28, height:28, '&:hover':{ bgcolor:'#5a6fd6' } }}>
                          <CameraIcon sx={{ fontSize:14 }} />
                        </IconButton>
                      </Tooltip>
                      <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                    </Box>
                    <Box>
                      <Button variant="outlined" size="small" onClick={() => avatarInputRef.current?.click()}
                        sx={{ textTransform:'none', borderColor:'#667eea', color:'#667eea', mb:0.5, display:'block' }}>
                        Chọn ảnh
                      </Button>
                      {avatarFile && (
                        <Typography variant="caption" color="text.secondary">{avatarFile.name}</Typography>
                      )}
                      {!avatarFile && (
                        <Typography variant="caption" color="text.disabled">JPG, PNG – tối đa 5MB</Typography>
                      )}
                      {avatarPreview && (
                        <Button size="small" color="error" sx={{ textTransform:'none', mt:0.5, display:'block', p:0 }}
                          onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}>
                          Xóa ảnh
                        </Button>
                      )}
                    </Box>
                  </Stack>
                </SectionCard>

                <SectionCard title="Thông tin cá nhân">
                  <Stack spacing={2}>
                    <TextField fullWidth label="Họ và tên" name="fullName"
                      value={personalInfo.fullName} onChange={handlePersonalInfoChange} />
                    <TextField fullWidth label="Vị trí ứng tuyển" name="title"
                      value={personalInfo.title} onChange={handlePersonalInfoChange} />
                    <Stack direction="row" spacing={2}>
                      <TextField fullWidth label="Email" type="email" name="email"
                        value={personalInfo.email} onChange={handlePersonalInfoChange} />
                      <TextField fullWidth label="Số điện thoại" name="phone"
                        value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                    </Stack>
                    <TextField fullWidth label="Địa chỉ" name="address"
                      value={personalInfo.address} onChange={handlePersonalInfoChange} />
                    <TextField fullWidth label="LinkedIn / Website" name="linkedin"
                      value={personalInfo.linkedin} onChange={handlePersonalInfoChange} />
                  </Stack>
                </SectionCard>

                <SectionCard title="Mục tiêu nghề nghiệp">
                  <TextField fullWidth multiline rows={4} label="Mô tả ngắn về bản thân..."
                    value={summary} onChange={handleSummaryChange} />
                </SectionCard>
              </Stack>
            </TabPanel>

            {/* ── Tab 1: Experience ── */}
            <TabPanel value={tabIndex} index={1}>
              <Stack spacing={2}>
                {experience.map((exp, idx) => (
                  <SectionCard key={idx} title={`Kinh nghiệm ${idx + 1}`} onDelete={() => removeArrayItem('experience', idx)}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={2}>
                        <TextField fullWidth size="small" label="Vị trí" value={exp.role}
                          onChange={(e) => updateArrayItem('experience', idx, 'role', e.target.value)} />
                        <TextField fullWidth size="small" label="Công ty" value={exp.company}
                          onChange={(e) => updateArrayItem('experience', idx, 'company', e.target.value)} />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField fullWidth size="small" label="Bắt đầu" placeholder="MM/YYYY"
                          value={exp.startDate}
                          onChange={(e) => updateArrayItem('experience', idx, 'startDate', e.target.value)} />
                        <TextField fullWidth size="small" label="Kết thúc" placeholder="MM/YYYY hoặc Hiện tại"
                          value={exp.endDate}
                          onChange={(e) => updateArrayItem('experience', idx, 'endDate', e.target.value)} />
                      </Stack>
                      <TextField fullWidth size="small" multiline rows={3} label="Mô tả công việc"
                        value={exp.description}
                        onChange={(e) => updateArrayItem('experience', idx, 'description', e.target.value)} />
                    </Stack>
                  </SectionCard>
                ))}
                <AddButton label="Thêm kinh nghiệm"
                  onClick={() => addArrayItem('experience', { role:'', company:'', startDate:'', endDate:'', description:'' })} />
              </Stack>
            </TabPanel>

            {/* ── Tab 2: Education ── */}
            <TabPanel value={tabIndex} index={2}>
              <Stack spacing={2}>
                {education.map((edu, idx) => (
                  <SectionCard key={idx} title={`Học vấn ${idx + 1}`} onDelete={() => removeArrayItem('education', idx)}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={2}>
                        <TextField fullWidth size="small" label="Bằng cấp" value={edu.degree}
                          onChange={(e) => updateArrayItem('education', idx, 'degree', e.target.value)} />
                        <TextField fullWidth size="small" label="Trường" value={edu.school}
                          onChange={(e) => updateArrayItem('education', idx, 'school', e.target.value)} />
                      </Stack>
                      <Stack direction="row" spacing={2}>
                        <TextField fullWidth size="small" label="Bắt đầu" placeholder="MM/YYYY"
                          value={edu.startDate}
                          onChange={(e) => updateArrayItem('education', idx, 'startDate', e.target.value)} />
                        <TextField fullWidth size="small" label="Kết thúc" placeholder="MM/YYYY"
                          value={edu.endDate}
                          onChange={(e) => updateArrayItem('education', idx, 'endDate', e.target.value)} />
                      </Stack>
                    </Stack>
                  </SectionCard>
                ))}
                <AddButton label="Thêm học vấn"
                  onClick={() => addArrayItem('education', { degree:'', school:'', startDate:'', endDate:'' })} />
              </Stack>
            </TabPanel>

            {/* ── Tab 3: Skills ── */}
            <TabPanel value={tabIndex} index={3}>
              <SectionCard title="Kỹ năng của bạn">
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <TextField fullWidth size="small" label="Nhập kỹ năng" placeholder="VD: ReactJS, Node.js"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()} />
                    <Button variant="contained" onClick={addSkill}
                      sx={{ textTransform:'none', fontWeight:700, px:3, background:'linear-gradient(135deg,#667eea,#764ba2)' }}>
                      Thêm
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} onDelete={() => removeSkill(idx)}
                        sx={{ background:'linear-gradient(135deg,#667eea22,#764ba222)',
                          border:'1px solid #667eea66', fontWeight:600, color:'#4a3f9f' }} />
                    ))}
                    {skills.length === 0 && (
                      <Typography variant="body2" color="text.disabled" sx={{ fontStyle:'italic' }}>
                        Chưa có kỹ năng nào...
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </SectionCard>
            </TabPanel>
          </Box>
        </Box>

        {/* ───────── RIGHT: CV Preview ───────── */}
        <Box sx={{
          width:'50%', overflowY:'auto', bgcolor:'#eef0f8', p:3,
          '&::-webkit-scrollbar':{ width:6 },
          '&::-webkit-scrollbar-thumb':{ bgcolor:'#c7c7e0', borderRadius:3 },
        }}>
          <Typography variant="caption" fontWeight={700} color="#667eea"
            sx={{ display:'block', mb:1.5, textTransform:'uppercase', letterSpacing:1 }}>
            👁 Xem trước CV
          </Typography>

          <Paper ref={printRef} elevation={4}
            sx={{ borderRadius:3, overflow:'hidden', boxShadow:'0 8px 40px rgba(102,126,234,0.18)', minHeight:700 }}>

            {/* CV Header */}
            <Box sx={{ background:'linear-gradient(135deg,#667eea,#764ba2)', px:4, py:3.5, color:'#fff' }}>
              <Stack direction="row" spacing={2.5} alignItems="center">
                {avatarPreview && (
                  <Avatar src={avatarPreview}
                    sx={{ width:80, height:80, border:'3px solid rgba(255,255,255,0.7)', flexShrink:0 }} />
                )}
                <Box>
                  <Typography variant="h4" fontWeight={900} sx={{ letterSpacing:'-0.5px' }}>
                    {personalInfo.fullName || <span style={{ opacity:0.4 }}>Họ và Tên</span>}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ opacity:0.9, mt:0.25 }}>
                    {personalInfo.title || <span style={{ opacity:0.4 }}>Vị trí ứng tuyển</span>}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1.5} sx={{ mt:1 }}>
                    {personalInfo.email && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <EmailIcon sx={{ fontSize:13, opacity:0.85 }} />
                        <Typography variant="caption" sx={{ opacity:0.9 }}>{personalInfo.email}</Typography>
                      </Stack>
                    )}
                    {personalInfo.phone && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <PhoneIcon sx={{ fontSize:13, opacity:0.85 }} />
                        <Typography variant="caption" sx={{ opacity:0.9 }}>{personalInfo.phone}</Typography>
                      </Stack>
                    )}
                    {personalInfo.address && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LocationIcon sx={{ fontSize:13, opacity:0.85 }} />
                        <Typography variant="caption" sx={{ opacity:0.9 }}>{personalInfo.address}</Typography>
                      </Stack>
                    )}
                    {personalInfo.linkedin && (
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <LinkedInIcon sx={{ fontSize:13, opacity:0.85 }} />
                        <Typography variant="caption" sx={{ opacity:0.9 }}>{personalInfo.linkedin}</Typography>
                      </Stack>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* CV Body */}
            <Box sx={{ px:4, py:3, bgcolor:'#fff' }}>
              <Stack spacing={2.5}>
                {summary && (
                  <CVSection title="Mục tiêu nghề nghiệp">
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight:1.8 }}>
                      {summary}
                    </Typography>
                  </CVSection>
                )}

                {experience.length > 0 && (
                  <CVSection title="Kinh nghiệm làm việc">
                    <Stack spacing={2}>
                      {experience.map((exp, idx) => (
                        <Box key={idx}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="subtitle2" fontWeight={800} color="#1e293b">
                                {exp.role || 'Vị trí'}
                              </Typography>
                              <Typography variant="body2" color="#667eea" fontWeight={600}>
                                {exp.company || 'Công ty'}
                              </Typography>
                            </Box>
                            {(exp.startDate || exp.endDate) && (
                              <Typography variant="caption" color="text.disabled"
                                sx={{ bgcolor:'#f1f5f9', px:1, py:0.25, borderRadius:1, whiteSpace:'nowrap' }}>
                                {exp.startDate} – {exp.endDate}
                              </Typography>
                            )}
                          </Stack>
                          {exp.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt:0.75, lineHeight:1.7 }}>
                              {exp.description}
                            </Typography>
                          )}
                          {idx < experience.length - 1 && <Divider sx={{ mt:2 }} />}
                        </Box>
                      ))}
                    </Stack>
                  </CVSection>
                )}

                {education.length > 0 && (
                  <CVSection title="Học vấn">
                    <Stack spacing={2}>
                      {education.map((edu, idx) => (
                        <Box key={idx}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                              <Typography variant="subtitle2" fontWeight={800} color="#1e293b">
                                {edu.degree || 'Bằng cấp'}
                              </Typography>
                              <Typography variant="body2" color="#667eea" fontWeight={600}>
                                {edu.school || 'Trường'}
                              </Typography>
                            </Box>
                            {(edu.startDate || edu.endDate) && (
                              <Typography variant="caption" color="text.disabled"
                                sx={{ bgcolor:'#f1f5f9', px:1, py:0.25, borderRadius:1, whiteSpace:'nowrap' }}>
                                {edu.startDate} – {edu.endDate}
                              </Typography>
                            )}
                          </Stack>
                          {idx < education.length - 1 && <Divider sx={{ mt:2 }} />}
                        </Box>
                      ))}
                    </Stack>
                  </CVSection>
                )}

                {skills.length > 0 && (
                  <CVSection title="Kỹ năng">
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {skills.map((skill, idx) => (
                        <Chip key={idx} label={skill} size="small"
                          sx={{ fontWeight:600, fontSize:'0.78rem',
                            background:'linear-gradient(135deg,#667eea18,#764ba218)',
                            border:'1px solid #667eea55', color:'#4a3f9f' }} />
                      ))}
                    </Stack>
                  </CVSection>
                )}

                {!summary && experience.length === 0 && education.length === 0 && skills.length === 0 && !personalInfo.fullName && (
                  <Box sx={{ textAlign:'center', py:8, color:'text.disabled' }}>
                    <Typography variant="h3" sx={{ mb:1 }}>📄</Typography>
                    <Typography variant="body2">Điền thông tin bên trái để xem CV của bạn</Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Paper>
        </Box>
      </Box>
    </UserLayout>
  );
}

/* ── Helper components ──────────────────────────────── */
function SectionCard({ title, children, onDelete }) {
  return (
    <Paper elevation={0} sx={{ borderRadius:3, border:'1px solid #e2e8f0', bgcolor:'#fff', overflow:'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between"
        sx={{ px:2.5, py:1.5, background:'linear-gradient(135deg,#f8f9ff,#f0f2ff)', borderBottom:'1px solid #e8eaf6' }}>
        <Typography variant="subtitle2" fontWeight={700} color="#4a3f9f">{title}</Typography>
        {onDelete && (
          <IconButton size="small" color="error" onClick={onDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Stack>
      <Box sx={{ p:2.5 }}>{children}</Box>
    </Paper>
  );
}

function CVSection({ title, children }) {
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb:1.5 }}>
        <Typography variant="subtitle1" fontWeight={800} color="#1e293b"
          sx={{ textTransform:'uppercase', letterSpacing:'0.5px', fontSize:'0.8rem', whiteSpace:'nowrap' }}>
          {title}
        </Typography>
        <Box sx={{ flex:1, height:'2px', background:'linear-gradient(90deg,#667eea,transparent)' }} />
      </Stack>
      {children}
    </Box>
  );
}

function AddButton({ label, onClick }) {
  return (
    <Button fullWidth startIcon={<AddIcon />} onClick={onClick}
      sx={{ textTransform:'none', fontWeight:600, py:1.5,
        border:'2px dashed #c7c7e8', borderRadius:3, color:'#667eea',
        '&:hover':{ bgcolor:'#f0f2ff', borderColor:'#667eea' } }}>
      {label}
    </Button>
  );
}
