import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  CircularProgress,
  Grid,
  IconButton,
  Divider,
  Chip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Person,
  Mail,
  Phone,
  Cake,
  Wc,
  Room,
  Language,
  School,
  Work,
  Code,
  Edit,
  Add,
  Delete,
  CloudUpload,
  CheckCircle,
  FolderOpen,
  ArrowForward,
  AutoAwesome,
  Star,
  Settings,
  Notifications,
  Email,
  Assignment,
  Visibility,
  FilePresent,
  Home,
} from "@mui/icons-material";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { getCurrentUser, updateCurrentUser } from "../../services/user/currentUser";
import { useToast } from "../../contexts/ToastContext";
import { getMediaUrl } from "../../utils/urlHelpers";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";

// Import refactored profile subcomponents
import UserProfileSidebar from "./profile-components/UserProfileSidebar";
import UserProfileOverviewTab from "./profile-components/UserProfileOverviewTab";
import UserProfileItviecTab from "./profile-components/UserProfileItviecTab";
import UserAttachedCvTab from "./profile-components/UserAttachedCvTab";
import UserAppliedJobsTab from "./profile-components/UserAppliedJobsTab";
import UserSavedJobsTab from "./profile-components/UserSavedJobsTab";
import UserProfileCompleteness from "./profile-components/UserProfileCompleteness";

export default function UserProfile() {
  const showToast = useToast();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ===== USER PROFILE STATE =====
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    headline: "",
    location: "",
    bio: "",
    birthday: "",
    gender: "",
    personalLink: "",
    skills: [],
    education: [],
    experience: [],
    projects: [],
    avatarUrl: "",
    avatar: "",
  });

  // ===== TOGGLE SWITCH FOR JOB SEARCH =====
  const [searchActive, setSearchActive] = useState(true);

  // ===== TABS & ACTIVITY COUNTS STATE =====
  const [activeTab, setActiveTab] = useState("overview");
  const [appliedJobsCount, setAppliedJobsCount] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);

  // ===== DIALOG MODALS STATES =====
  const [openBasic, setOpenBasic] = useState(false);
  const [openBio, setOpenBio] = useState(false);
  const [openSkill, setOpenSkill] = useState(false);
  const [openEdu, setOpenEdu] = useState(false);
  const [openExp, setOpenExp] = useState(false);
  const [openProject, setOpenProject] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    type: "info",
    confirmText: "Xác nhận",
    onConfirm: () => {},
  });

  // ===== LOCAL FORMS STATE =====
  const [basicForm, setBasicForm] = useState({
    fullName: "",
    headline: "",
    phone: "",
    email: "",
    birthday: "",
    gender: "",
    location: "",
    personalLink: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [bioText, setBioText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  // Common structure for dynamic arrays
  const [eduForm, setEduForm] = useState({ id: "", school: "", degree: "", graduationDate: "" });
  const [expForm, setExpForm] = useState({ id: "", title: "", company: "", startDate: "", endDate: "", description: "" });
  const [projectForm, setProjectForm] = useState({ id: "", name: "", role: "", technologies: "", description: "", link: "" });

  // ===== LOAD USER DATA & COUNTS =====
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const data = res.data.data || res.data;
        setUser({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          headline: data.headline || "",
          location: data.location || "",
          bio: data.bio || "",
          birthday: data.birthday || "",
          gender: data.gender || "",
          personalLink: data.personalLink || "",
          skills: Array.isArray(data.skills) ? data.skills : [],
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          avatarUrl: data.avatarUrl || data.avatar || "",
          avatar: data.avatar || "",
        });
      } catch (err) {
        console.error("Không lấy được thông tin người dùng:", err);
        showToast("Không thể tải dữ liệu hồ sơ. Vui lòng thử lại sau.", "error");
      } finally {
        setLoading(false);
      }
    };

    const fetchCounts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const appliedRes = await axios.get("http://localhost:8080/api/user/jobs/apply/my-applications", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAppliedJobsCount(appliedRes.data.length);
        } catch (err) {
          console.error("Lỗi lấy số đơn ứng tuyển:", err);
        }

        try {
          const savedRes = await axios.get("http://localhost:8080/api/user/jobs/favorite/all", {
            headers: { Authorization: `Bearer ${token}` }
          });
          setSavedJobsCount(savedRes.data.length);
        } catch (err) {
          console.error("Lỗi lấy số việc làm đã lưu:", err);
        }
      }
    };

    fetchUser();
    fetchCounts();
  }, []);

  // Check URL query parameters on load to set the initial tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // ===== PROFILE SAVE CONTROLLER =====
  const handleUpdateProfile = async (updatedFields, file = null) => {
    setSaving(true);
    const payload = {
      fullName: updatedFields.fullName !== undefined ? updatedFields.fullName : user.fullName,
      email: updatedFields.email !== undefined ? updatedFields.email : user.email,
      phone: updatedFields.phone !== undefined ? updatedFields.phone : user.phone,
      headline: updatedFields.headline !== undefined ? updatedFields.headline : user.headline,
      location: updatedFields.location !== undefined ? updatedFields.location : user.location,
      bio: updatedFields.bio !== undefined ? updatedFields.bio : user.bio,
      birthday: updatedFields.birthday !== undefined ? updatedFields.birthday : user.birthday,
      gender: updatedFields.gender !== undefined ? updatedFields.gender : user.gender,
      personalLink: updatedFields.personalLink !== undefined ? updatedFields.personalLink : user.personalLink,
      skills: updatedFields.skills !== undefined ? updatedFields.skills : user.skills,
      education: updatedFields.education !== undefined ? updatedFields.education : user.education,
      experience: updatedFields.experience !== undefined ? updatedFields.experience : user.experience,
      projects: updatedFields.projects !== undefined ? updatedFields.projects : user.projects,
    };

    try {
      const res = await updateCurrentUser(payload, file);
      const data = res.data.data || res.data;
      setUser({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        headline: data.headline || "",
        location: data.location || "",
        bio: data.bio || "",
        birthday: data.birthday || "",
        gender: data.gender || "",
        personalLink: data.personalLink || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        education: Array.isArray(data.education) ? data.education : [],
        experience: Array.isArray(data.experience) ? data.experience : [],
        projects: Array.isArray(data.projects) ? data.projects : [],
        avatarUrl: data.avatarUrl || data.avatar || "",
        avatar: data.avatar || "",
      });
      showToast("Cập nhật hồ sơ thành công.", "success");
      setAvatarFile(null);
      return true;
    } catch (err) {
      console.error("Cập nhật hồ sơ thất bại:", err);
      showToast(
        err.response?.data?.message || "Không thể cập nhật hồ sơ, vui lòng thử lại.",
        "error"
      );
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ===== DIALOG ACTIONS: BASIC INFO =====
  const openBasicDialog = () => {
    setBasicForm({
      fullName: user.fullName,
      headline: user.headline,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
      gender: user.gender,
      location: user.location,
      personalLink: user.personalLink,
    });
    setAvatarPreview(user.avatarUrl || "");
    setAvatarFile(null);
    setOpenBasic(true);
  };

  const handleBasicSubmit = async () => {
    const success = await handleUpdateProfile(basicForm, avatarFile);
    if (success) setOpenBasic(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // ===== DIALOG ACTIONS: BIO =====
  const openBioDialog = () => {
    setBioText(user.bio);
    setOpenBio(true);
  };

  const handleBioSubmit = async () => {
    const success = await handleUpdateProfile({ bio: bioText });
    if (success) setOpenBio(false);
  };

  // ===== DIALOG ACTIONS: SKILLS =====
  const openSkillDialog = () => {
    setSkillsText(user.skills.join(", "));
    setOpenSkill(true);
  };

  const handleSkillSubmit = async () => {
    const list = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const success = await handleUpdateProfile({ skills: list });
    if (success) setOpenSkill(false);
  };

  // ===== DIALOG ACTIONS: EDUCATION =====
  const openAddEduDialog = () => {
    setEduForm({ id: "", school: "", degree: "", graduationDate: "" });
    setOpenEdu(true);
  };

  const openEditEduDialog = (item) => {
    setEduForm(item);
    setOpenEdu(true);
  };

  const handleEduSubmit = async () => {
    let list = [...user.education];
    if (eduForm.id) {
      list = list.map((item) => (item.id === eduForm.id ? eduForm : item));
    } else {
      const newItem = { ...eduForm, id: Date.now().toString() };
      list.push(newItem);
    }
    const success = await handleUpdateProfile({ education: list });
    if (success) setOpenEdu(false);
  };

  const handleEduDelete = (id) => {
    setConfirmConfig({
      title: "Xác nhận xóa học vấn",
      message: "Bạn có chắc chắn muốn xóa mục học vấn này không?",
      type: "danger",
      confirmText: "Xóa học vấn",
      onConfirm: async () => {
        const list = user.education.filter((item) => item.id !== id);
        await handleUpdateProfile({ education: list });
      }
    });
    setConfirmOpen(true);
  };

  // ===== DIALOG ACTIONS: EXPERIENCE =====
  const openAddExpDialog = () => {
    setExpForm({ id: "", title: "", company: "", startDate: "", endDate: "", description: "" });
    setOpenExp(true);
  };

  const openEditExpDialog = (item) => {
    setExpForm(item);
    setOpenExp(true);
  };

  const handleExpSubmit = async () => {
    let list = [...user.experience];
    if (expForm.id) {
      list = list.map((item) => (item.id === expForm.id ? expForm : item));
    } else {
      const newItem = { ...expForm, id: Date.now().toString() };
      list.push(newItem);
    }
    const success = await handleUpdateProfile({ experience: list });
    if (success) setOpenExp(false);
  };

  const handleExpDelete = (id) => {
    setConfirmConfig({
      title: "Xác nhận xóa kinh nghiệm",
      message: "Bạn có chắc chắn muốn xóa mục kinh nghiệm làm việc này không?",
      type: "danger",
      confirmText: "Xóa kinh nghiệm",
      onConfirm: async () => {
        const list = user.experience.filter((item) => item.id !== id);
        await handleUpdateProfile({ experience: list });
      }
    });
    setConfirmOpen(true);
  };

  // ===== DIALOG ACTIONS: PROJECTS =====
  const openAddProjectDialog = () => {
    setProjectForm({ id: "", name: "", role: "", technologies: "", description: "", link: "" });
    setOpenProject(true);
  };

  const openEditProjectDialog = (item) => {
    setProjectForm(item);
    setOpenProject(true);
  };

  const handleProjectSubmit = async () => {
    let list = [...user.projects];
    if (projectForm.id) {
      list = list.map((item) => (item.id === projectForm.id ? projectForm : item));
    } else {
      const newItem = { ...projectForm, id: Date.now().toString() };
      list.push(newItem);
    }
    const success = await handleUpdateProfile({ projects: list });
    if (success) setOpenProject(false);
  };

  const handleProjectDelete = (id) => {
    setConfirmConfig({
      title: "Xác nhận xóa dự án",
      message: "Bạn có chắc chắn muốn xóa dự án này không?",
      type: "danger",
      confirmText: "Xóa dự án",
      onConfirm: async () => {
        const list = user.projects.filter((item) => item.id !== id);
        await handleUpdateProfile({ projects: list });
      }
    });
    setConfirmOpen(true);
  };

  // ===== CALCULATE PROFILE COMPLETENESS PERCENTAGE =====
  const calculateCompleteness = () => {
    let score = 0;
    let total = 0;
    const weights = [
      { val: user.fullName, w: 10 },
      { val: user.email, w: 10 },
      { val: user.phone, w: 10 },
      { val: user.headline, w: 10 },
      { val: user.location, w: 10 },
      { val: user.bio, w: 10 },
      { val: user.skills && user.skills.length > 0, w: 10 },
      { val: user.education && user.education.length > 0, w: 10 },
      { val: user.experience && user.experience.length > 0, w: 10 },
      { val: user.projects && user.projects.length > 0, w: 10 },
    ];
    weights.forEach((item) => {
      total += item.w;
      if (typeof item.val === "boolean") {
        if (item.val) score += item.w;
      } else {
        if (item.val && item.val.toString().trim() !== "") score += item.w;
      }
    });
    return Math.round((score / total) * 100);
  };

  const completionPercent = calculateCompleteness();

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <UserProfileOverviewTab
            user={user}
            completionPercent={completionPercent}
            setActiveTab={setActiveTab}
            appliedJobsCount={appliedJobsCount}
            savedJobsCount={savedJobsCount}
            inviteCount={0}
          />
        );
      case "attached_cv":
        return <UserAttachedCvTab user={user} />;
      case "profile_itviec":
        return (
          <UserProfileItviecTab
            user={user}
            openBasicDialog={openBasicDialog}
            openBioDialog={openBioDialog}
            openAddProjectDialog={openAddProjectDialog}
            openEditProjectDialog={openEditProjectDialog}
            handleProjectDelete={handleProjectDelete}
            openAddEduDialog={openAddEduDialog}
            openEditEduDialog={openEditEduDialog}
            handleEduDelete={handleEduDelete}
            openAddExpDialog={openAddExpDialog}
            openEditExpDialog={openEditExpDialog}
            handleExpDelete={handleExpDelete}
            openSkillDialog={openSkillDialog}
          />
        );
      case "my_jobs":
        return (
          <UserAppliedJobsTab
            appliedCount={appliedJobsCount}
            savedCount={savedJobsCount}
          />
        );
      case "saved_jobs":
        return <UserSavedJobsTab />;
      case "invites":
      case "email_subscribe":
      case "notifications":
      case "settings":
      default:
        return (
          <Paper
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 1px 3px rgba(15,23,42,0.05)",
              border: "1px solid #e2e8f0",
              textAlign: "center",
              bgcolor: "#ffffff",
              minHeight: "50vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" fontWeight={800} color="#334155" mb={1}>
              Tính năng đang phát triển
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chức năng này đang được cập nhật. Vui lòng quay lại sau!
            </Typography>
          </Paper>
        );
    }
  };

  const isItviecProfile = activeTab === "profile_itviec";

  return (
    <>
      <Box sx={{ py: 2, bgcolor: "#f8fafc", minHeight: "100vh", mx: -4, px: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
              <CircularProgress size={50} thickness={4.5} sx={{ color: "#ef4444" }} />
            </Box>
          ) : (
          <Grid container spacing={3}>
            {/* COLUMN 1: SIDEBAR */}
            <Grid size={{ xs: 12, md: 3, lg: 2.6 }}>
              <UserProfileSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                searchActive={searchActive}
                setSearchActive={setSearchActive}
                appliedJobsCount={appliedJobsCount}
                savedJobsCount={savedJobsCount}
              />
            </Grid>

            {/* COLUMN 2: TAB CONTENT */}
            <Grid size={{ xs: 12, md: isItviecProfile ? 6.2 : 9, lg: isItviecProfile ? 6.6 : 9.4 }}>
              {renderTabContent()}
            </Grid>

            {/* COLUMN 3: COMPLETENESS */}
            {isItviecProfile && (
              <Grid size={{ xs: 12, md: 2.8, lg: 2.8 }}>
                <UserProfileCompleteness completionPercent={completionPercent} />
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT BASIC INFO                            */}
      {/* ======================================================== */}
      <Dialog open={openBasic} onClose={() => setOpenBasic(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chỉnh sửa thông tin cơ bản</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Avatar upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar src={getMediaUrl(avatarPreview)} sx={{ width: 80, height: 80 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Ảnh đại diện
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Chọn ảnh vuông, kích thước khuyên dùng là 200x200px.
                </Typography>
                <Button variant="outlined" component="label" size="small" startIcon={<CloudUpload />} sx={{ textTransform: "none" }}>
                  Tải ảnh lên
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </Button>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Họ và tên"
              value={basicForm.fullName}
              onChange={(e) => setBasicForm({ ...basicForm, fullName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Chức danh hồ sơ"
              value={basicForm.headline}
              placeholder="Ví dụ: Senior Java Developer"
              onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email liên hệ"
              value={basicForm.email}
              onChange={(e) => setBasicForm({ ...basicForm, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Số điện thoại"
              value={basicForm.phone}
              onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
            />
            <TextField
              fullWidth
              label="Ngày sinh"
              value={basicForm.birthday}
              placeholder="Ví dụ: 25/11/1990"
              onChange={(e) => setBasicForm({ ...basicForm, birthday: e.target.value })}
            />
            <FormControl>
              <FormLabel sx={{ fontWeight: 700 }}>Giới tính</FormLabel>
              <RadioGroup
                row
                value={basicForm.gender}
                onChange={(e) => setBasicForm({ ...basicForm, gender: e.target.value })}
              >
                <FormControlLabel value="Nam" control={<Radio />} label="Nam" />
                <FormControlLabel value="Nữ" control={<Radio />} label="Nữ" />
                <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Địa chỉ hiện tại / Nơi làm việc mong muốn"
              value={basicForm.location}
              placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
              onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="Link cá nhân (Github, LinkedIn...)"
              value={basicForm.personalLink}
              placeholder="Ví dụ: https://github.com/my-profile"
              onChange={(e) => setBasicForm({ ...basicForm, personalLink: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenBasic(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleBasicSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT BIO                                   */}
      {/* ======================================================== */}
      <Dialog open={openBio} onClose={() => setOpenBio(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chỉnh sửa giới thiệu bản thân</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={bioText}
            placeholder="Viết đoạn giới thiệu ngắn về điểm mạnh, số năm kinh nghiệm, các sản phẩm tự hào nhất và định hướng nghề nghiệp..."
            onChange={(e) => setBioText(e.target.value)}
            sx={{ pt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenBio(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleBioSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT SKILLS                                */}
      {/* ======================================================== */}
      <Dialog open={openSkill} onClose={() => setOpenSkill(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Quản lý kỹ năng</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Danh sách kỹ năng"
            value={skillsText}
            placeholder="Ví dụ: React, Java, Spring Boot, MySQL, Git"
            helperText="Các kỹ năng cách nhau bởi dấu phẩy (,)"
            onChange={(e) => setSkillsText(e.target.value)}
            sx={{ pt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenSkill(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleSkillSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT EDUCATION                         */}
      {/* ======================================================== */}
      <Dialog open={openEdu} onClose={() => setOpenEdu(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{eduForm.id ? "Cập nhật học vấn" : "Thêm mục học vấn mới"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Trường học"
              value={eduForm.school}
              placeholder="Ví dụ: Đại học Bách Khoa Hà Nội"
              onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Bằng cấp / Ngành học"
              value={eduForm.degree}
              placeholder="Ví dụ: Cử nhân Công nghệ thông tin"
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Năm tốt nghiệp"
              value={eduForm.graduationDate}
              placeholder="Ví dụ: 2022"
              onChange={(e) => setEduForm({ ...eduForm, graduationDate: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenEdu(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleEduSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            Lưu mục học vấn
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT EXPERIENCE                        */}
      {/* ======================================================== */}
      <Dialog open={openExp} onClose={() => setOpenExp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{expForm.id ? "Cập nhật kinh nghiệm" : "Thêm kinh nghiệm làm việc"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Vị trí / Chức danh công việc"
              value={expForm.title}
              placeholder="Ví dụ: Fullstack Developer"
              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Công ty / Tổ chức"
              value={expForm.company}
              placeholder="Ví dụ: Công ty TNHH AI Tech"
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              required
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Thời gian bắt đầu"
                value={expForm.startDate}
                placeholder="Ví dụ: 06/2022"
                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Thời gian kết thúc"
                value={expForm.endDate}
                placeholder="Ví dụ: Hiện tại hoặc 12/2024"
                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả công việc"
              value={expForm.description}
              placeholder="Mô tả cụ thể nhiệm vụ chính, dự án tham gia và công nghệ sử dụng..."
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenExp(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleExpSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            Lưu mục kinh nghiệm
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT PROJECT                           */}
      {/* ======================================================== */}
      <Dialog open={openProject} onClose={() => setOpenProject(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{projectForm.id ? "Cập nhật dự án" : "Thêm dự án nổi bật"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Tên dự án"
              value={projectForm.name}
              placeholder="Ví dụ: Hệ thống Quản lý CV thông minh"
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Vai trò trong dự án"
              value={projectForm.role}
              placeholder="Ví dụ: Backend Lead hoặc Thành viên chính"
              onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Công nghệ sử dụng"
              value={projectForm.technologies}
              placeholder="Ví dụ: Spring Boot, React, MySQL, Docker"
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả chi tiết dự án"
              value={projectForm.description}
              placeholder="Mô tả tóm tắt mục tiêu, hoạt động chính và các chức năng nổi bật của dự án..."
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Link dự án / Github Repository"
              value={projectForm.link}
              placeholder="Ví dụ: https://github.com/my-project"
              onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenProject(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Hủy
          </Button>
          <Button onClick={handleProjectSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#ef4444", "&:hover": { bgcolor: "#dc2626" }, textTransform: "none", fontWeight: 700 }}>
            Lưu mục dự án
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        confirmText={confirmConfig.confirmText}
      />
    </>
  );
}
