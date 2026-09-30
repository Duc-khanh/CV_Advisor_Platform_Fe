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
import api from "../../services/axios";
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
import UserInterviewsTab from "./profile-components/UserInterviewsTab";
import UserNotificationsTab from "./profile-components/UserNotificationsTab";
import UserSettingsTab from "./profile-components/UserSettingsTab";
import { getUnreadNotificationCount, NOTIFICATIONS_CHANGED_EVENT } from "../../services/notificationService";
import UserProfileCompleteness from "./profile-components/UserProfileCompleteness";
import UnderDevelopment from "../../components/common/UnderDevelopment";
import AutoFillProfileModal from "./profile-components/AutoFillProfileModal";
import { AiUsagePage } from "../../features/ai-usage";

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
  const [interviewJobsCount, setInterviewJobsCount] = useState(0);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

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
    type: "danger",
    confirmText: "XÃ³a",
    onConfirm: () => {},
  });

  const [openAutoFill, setOpenAutoFill] = useState(false);

  // Forms temporary states
  const [basicForm, setBasicForm] = useState({
    fullName: "",
    headline: "",
    phone: "",
    birthday: "",
    gender: "MALE",
    location: "",
    personalLink: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [bioText, setBioText] = useState("");
  const [skillsText, setSkillsText] = useState("");

  const [eduForm, setEduForm] = useState({ id: "", school: "", degree: "", graduationDate: "" });
  const [expForm, setExpForm] = useState({ id: "", title: "", company: "", startDate: "", endDate: "", description: "" });
  const [projectForm, setProjectForm] = useState({ id: "", name: "", role: "", technologies: "", description: "", link: "" });

  // ===== READ TAB QUERY PARAM FROM URL =====
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // ===== FETCH INITIAL PROFILE & COUNTS =====
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getCurrentUser();
      const data = res.data.data || res.data;

      // Ensure array types
      let parsedEducation = [];
      let parsedExperience = [];
      let parsedProjects = [];
      let parsedSkills = [];

      try {
        parsedEducation = typeof data.education === "string" ? JSON.parse(data.education) : (data.education || []);
      } catch (e) { parsedEducation = []; }

      try {
        parsedExperience = typeof data.experience === "string" ? JSON.parse(data.experience) : (data.experience || []);
      } catch (e) { parsedExperience = []; }

      try {
        parsedProjects = typeof data.projects === "string" ? JSON.parse(data.projects) : (data.projects || []);
      } catch (e) { parsedProjects = []; }

      if (Array.isArray(data.skills)) {
        parsedSkills = data.skills;
      } else if (typeof data.skills === "string") {
        parsedSkills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }

      setUser({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        headline: data.headline || "",
        location: data.location || "",
        bio: data.bio || "",
        birthday: data.birthday ? data.birthday.split("T")[0] : "",
        gender: data.gender || "MALE",
        personalLink: data.personalLink || "",
        skills: parsedSkills,
        education: Array.isArray(parsedEducation) ? parsedEducation : [],
        experience: Array.isArray(parsedExperience) ? parsedExperience : [],
        projects: Array.isArray(parsedProjects) ? parsedProjects : [],
        avatarUrl: data.avatarUrl || data.avatar || "",
        avatar: data.avatar || "",
      });

      // Fetch Applied Jobs Count
      try {
        const appRes = await api.get("/applications/my-applications");
        const appList = appRes.data?.data || appRes.data || [];
        setAppliedJobsCount(Array.isArray(appList) ? appList.length : 0);
      } catch (err) {
        console.error("Lá»—i láº¥y viá»‡c lÃ m Ä‘Ã£ á»©ng tuyá»ƒn:", err);
      }

      // Fetch Saved Jobs Count
      try {
        const favRes = await api.get("/favorite-jobs/my-favorites");
        const favList = favRes.data?.data || favRes.data || [];
        setSavedJobsCount(Array.isArray(favList) ? favList.length : 0);
      } catch (err) {
        console.error("Lá»—i láº¥y danh sÃ¡ch viá»‡c lÃ m Ä‘Ã£ lÆ°u:", err);
      }

      // Fetch Interview Count
      try {
        const intRes = await api.get("/interviews/my-interviews");
        const intList = intRes.data?.data || intRes.data || [];
        setInterviewJobsCount(Array.isArray(intList) ? intList.length : 0);
      } catch (err) {
        console.error("Lá»—i láº¥y danh sÃ¡ch phá»ng váº¥n:", err);
      }

      // Fetch unread notification count
      try {
        const count = await getUnreadNotificationCount();
        setUnreadNotificationCount(count);
      } catch (err) {
        console.error("Lá»—i láº¥y sá»‘ thÃ´ng bÃ¡o chÆ°a Ä‘á»c:", err);
      }
    } catch (err) {
      console.error(err);
      showToast("KhÃ´ng thá»ƒ táº£i thÃ´ng tin ngÆ°á»i dÃ¹ng!", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleNotifUpdate = () => {
      getUnreadNotificationCount()
        .then(count => setUnreadNotificationCount(count))
        .catch(console.error);
    };
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, handleNotifUpdate);
    };
  }, []);

  // ===== UPDATE PROFILE DISPATCHER =====
  const handleUpdateProfile = async (updatedFields, fileToUpload = null) => {
    try {
      setSaving(true);
      const formData = new FormData();
      const currentMerged = { ...user, ...updatedFields };

      if (updatedFields.fullName !== undefined) formData.append("fullName", currentMerged.fullName);
      if (updatedFields.phone !== undefined) formData.append("phone", currentMerged.phone);
      if (updatedFields.headline !== undefined) formData.append("headline", currentMerged.headline);
      if (updatedFields.location !== undefined) formData.append("location", currentMerged.location);
      if (updatedFields.bio !== undefined) formData.append("bio", currentMerged.bio);
      if (updatedFields.birthday !== undefined) formData.append("birthday", currentMerged.birthday);
      if (updatedFields.gender !== undefined) formData.append("gender", currentMerged.gender);
      if (updatedFields.personalLink !== undefined) formData.append("personalLink", currentMerged.personalLink);

      if (updatedFields.skills !== undefined) {
        currentMerged.skills.forEach((s) => formData.append("skills", s));
      }
      if (updatedFields.education !== undefined) {
        formData.append("education", JSON.stringify(currentMerged.education));
      }
      if (updatedFields.experience !== undefined) {
        formData.append("experience", JSON.stringify(currentMerged.experience));
      }
      if (updatedFields.projects !== undefined) {
        formData.append("projects", JSON.stringify(currentMerged.projects));
      }

      if (fileToUpload) {
        formData.append("avatar", fileToUpload);
      }

      const res = await updateCurrentUser(formData);
      const data = res.data.data || res.data;

      setUser((prev) => ({
        ...prev,
        ...currentMerged,
        avatarUrl: data.avatarUrl || data.avatar || prev.avatarUrl,
      }));

      showToast("Cáº­p nháº­t há»“ sÆ¡ thÃ nh cÃ´ng!", "success");
      return true;
    } catch (err) {
      console.error(err);
      showToast("Cáº­p nháº­t tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i!", "error");
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
      birthday: user.birthday,
      gender: user.gender || "MALE",
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
      title: "XÃ¡c nháº­n xÃ³a há»c váº¥n",
      message: "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a má»¥c há»c váº¥n nÃ y khÃ´ng?",
      type: "danger",
      confirmText: "XÃ³a há»c váº¥n",
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
      title: "XÃ¡c nháº­n xÃ³a kinh nghiá»‡m",
      message: "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a má»¥c kinh nghiá»‡m lÃ m viá»‡c nÃ y khÃ´ng?",
      type: "danger",
      confirmText: "XÃ³a kinh nghiá»‡m",
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
      title: "XÃ¡c nháº­n xÃ³a dá»± Ã¡n",
      message: "Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a dá»± Ã¡n nÃ y khÃ´ng?",
      type: "danger",
      confirmText: "XÃ³a dá»± Ã¡n",
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
            setActiveTab={setActiveTab}
          />
        );
      case "ai_usage":
        return <AiUsagePage />;
      case "interviews":
        return (
          <UserInterviewsTab setActiveTab={setActiveTab} />
        );
      case "saved_jobs":
        return <UserSavedJobsTab />;
      case "invites":
        return (
          <UnderDevelopment
            featureName="Lá»i má»i cÃ´ng viá»‡c"
            description="TÃ­nh nÄƒng nháº­n vÃ  quáº£n lÃ½ lá»i má»i phá»ng váº¥n trá»±c tiáº¿p tá»« cÃ¡c nhÃ  tuyá»ƒn dá»¥ng Ä‘ang Ä‘Æ°á»£c hoÃ n thiá»‡n."
            minHeight="55vh"
            showHomeButton={false}
          />
        );
      case "notifications":
        return (
          <UserNotificationsTab
            setActiveTab={setActiveTab}
          />
        );
      case "settings":
      default:
        return (
          <UserSettingsTab
            user={user}
            searchActive={searchActive}
            setSearchActive={setSearchActive}
          />
        );
    }
  };

  const isItviecProfile = activeTab === "profile_itviec";

  return (
    <>
      <Box sx={{ py: 2, bgcolor: "#ffffff", minHeight: "100vh", mx: -4, px: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
              <CircularProgress size={50} thickness={4.5} sx={{ color: "#0284c7" }} />
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
                interviewCount={interviewJobsCount}
                notificationCount={unreadNotificationCount}
              />
            </Grid>

            {/* COLUMN 2: TAB CONTENT */}
            <Grid size={{ xs: 12, md: isItviecProfile ? 6.2 : 9, lg: isItviecProfile ? 6.6 : 9.4 }}>
              {renderTabContent()}
            </Grid>

            {/* COLUMN 3: COMPLETENESS */}
            {isItviecProfile && (
              <Grid size={{ xs: 12, md: 2.8, lg: 2.8 }}>
                <UserProfileCompleteness completionPercent={completionPercent} onAutoFill={() => setOpenAutoFill(true)} />
              </Grid>
            )}
          </Grid>
        )}
      </Box>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT BASIC INFO                            */}
      {/* ======================================================== */}
      <Dialog open={openBasic} onClose={() => setOpenBasic(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chá»‰nh sá»­a thÃ´ng tin cÆ¡ báº£n</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            {/* Avatar upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                src={avatarPreview || getMediaUrl(user.avatarUrl || user.avatar)}
                sx={{ width: 80, height: 80, bgcolor: "#0284c7", fontSize: "2rem" }}
              >
                {basicForm.fullName ? basicForm.fullName.charAt(0).toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2 }}
                >
                  Táº£i áº£nh má»›i
                  <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </Button>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Äá»‹nh dáº¡ng JPG, PNG dung lÆ°á»£ng dÆ°á»›i 5MB
                </Typography>
              </Box>
            </Box>

            <TextField
              fullWidth
              label="Há» vÃ  tÃªn"
              value={basicForm.fullName}
              onChange={(e) => setBasicForm({ ...basicForm, fullName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="TiÃªu Ä‘á» chuyÃªn nghiá»‡p / Vá»‹ trÃ­ hiá»‡n táº¡i"
              value={basicForm.headline}
              placeholder="VÃ­ dá»¥: Senior Java Developer"
              onChange={(e) => setBasicForm({ ...basicForm, headline: e.target.value })}
            />
            <TextField
              fullWidth
              label="Sá»‘ Ä‘iá»‡n thoáº¡i"
              value={basicForm.phone}
              onChange={(e) => setBasicForm({ ...basicForm, phone: e.target.value })}
            />
            <TextField
              fullWidth
              type="date"
              label="NgÃ y sinh"
              InputLabelProps={{ shrink: true }}
              value={basicForm.birthday}
              onChange={(e) => setBasicForm({ ...basicForm, birthday: e.target.value })}
            />
            <FormControl>
              <FormLabel sx={{ fontSize: "0.9rem", fontWeight: 600 }}>Giá»›i tÃ­nh</FormLabel>
              <RadioGroup
                row
                value={basicForm.gender}
                onChange={(e) => setBasicForm({ ...basicForm, gender: e.target.value })}
              >
                <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
                <FormControlLabel value="FEMALE" control={<Radio />} label="Ná»¯" />
                <FormControlLabel value="OTHER" control={<Radio />} label="KhÃ¡c" />
              </RadioGroup>
            </FormControl>
            <TextField
              fullWidth
              label="Äá»‹a Ä‘iá»ƒm / ThÃ nh phá»‘"
              value={basicForm.location}
              placeholder="VÃ­ dá»¥: HÃ  Ná»™i, Viá»‡t Nam"
              onChange={(e) => setBasicForm({ ...basicForm, location: e.target.value })}
            />
            <TextField
              fullWidth
              label="LiÃªn káº¿t cÃ¡ nhÃ¢n (LinkedIn, Portfolio, GitHub)"
              value={basicForm.personalLink}
              placeholder="VÃ­ dá»¥: https://linkedin.com/in/my-profile"
              onChange={(e) => setBasicForm({ ...basicForm, personalLink: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenBasic(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button
            onClick={handleBasicSubmit}
            variant="contained"
            disabled={saving}
            sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}
          >
            LÆ°u thay Ä‘á»•i
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT BIO / GIá»šI THIá»†U                      */}
      {/* ======================================================== */}
      <Dialog open={openBio} onClose={() => setOpenBio(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chá»‰nh sá»­a pháº§n giá»›i thiá»‡u</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            multiline
            rows={5}
            placeholder="Chia sáº» ngáº¯n gá»n vá» kinh nghiá»‡m, tháº¿ máº¡nh chuyÃªn mÃ´n vÃ  Ä‘á»‹nh hÆ°á»›ng nghá» nghiá»‡p cá»§a báº¡n..."
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenBio(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button onClick={handleBioSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}>
            LÆ°u giá»›i thiá»‡u
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: EDIT SKILLS / Ká»¸ NÄ‚NG                      */}
      {/* ======================================================== */}
      <Dialog open={openSkill} onClose={() => setOpenSkill(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chá»‰nh sá»­a ká»¹ nÄƒng chuyÃªn mÃ´n</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Nháº­p cÃ¡c ká»¹ nÄƒng phÃ¢n cÃ¡ch báº±ng dáº¥u pháº©y (,). VÃ­ dá»¥: Java, Spring Boot, MySQL, ReactJS, Docker...
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="Java, Spring Boot, React, Docker..."
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenSkill(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button onClick={handleSkillSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}>
            LÆ°u ká»¹ nÄƒng
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT EDUCATION                         */}
      {/* ======================================================== */}
      <Dialog open={openEdu} onClose={() => setOpenEdu(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{eduForm.id ? "Cáº­p nháº­t há»c váº¥n" : "ThÃªm má»¥c há»c váº¥n"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="TrÆ°á»ng há»c"
              value={eduForm.school}
              placeholder="VÃ­ dá»¥: Äáº¡i há»c BÃ¡ch Khoa HÃ  Ná»™i"
              onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Báº±ng cáº¥p / NgÃ nh há»c"
              value={eduForm.degree}
              placeholder="VÃ­ dá»¥: Cá»­ nhÃ¢n CÃ´ng nghá»‡ thÃ´ng tin"
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="NÄƒm tá»‘t nghiá»‡p"
              value={eduForm.graduationDate}
              placeholder="VÃ­ dá»¥: 2022"
              onChange={(e) => setEduForm({ ...eduForm, graduationDate: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenEdu(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button onClick={handleEduSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}>
            LÆ°u má»¥c há»c váº¥n
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT EXPERIENCE                        */}
      {/* ======================================================== */}
      <Dialog open={openExp} onClose={() => setOpenExp(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{expForm.id ? "Cáº­p nháº­t kinh nghiá»‡m" : "ThÃªm kinh nghiá»‡m lÃ m viá»‡c"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Vá»‹ trÃ­ / Chá»©c danh cÃ´ng viá»‡c"
              value={expForm.title}
              placeholder="VÃ­ dá»¥: Fullstack Developer"
              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="CÃ´ng ty / Tá»• chá»©c"
              value={expForm.company}
              placeholder="VÃ­ dá»¥: CÃ´ng ty TNHH AI Tech"
              onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
              required
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Thá»i gian báº¯t Ä‘áº§u"
                value={expForm.startDate}
                placeholder="VÃ­ dá»¥: 06/2022"
                onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                required
              />
              <TextField
                fullWidth
                label="Thá»i gian káº¿t thÃºc"
                value={expForm.endDate}
                placeholder="VÃ­ dá»¥: Hiá»‡n táº¡i hoáº·c 12/2024"
                onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
              />
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="MÃ´ táº£ cÃ´ng viá»‡c"
              value={expForm.description}
              placeholder="MÃ´ táº£ cá»¥ thá»ƒ nhiá»‡m vá»¥ chÃ­nh, dá»± Ã¡n tham gia vÃ  cÃ´ng nghá»‡ sá»­ dá»¥ng..."
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenExp(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button onClick={handleExpSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}>
            LÆ°u má»¥c kinh nghiá»‡m
          </Button>
        </DialogActions>
      </Dialog>

      {/* ======================================================== */}
      {/* DIALOG MODAL: ADD/EDIT PROJECT                           */}
      {/* ======================================================== */}
      <Dialog open={openProject} onClose={() => setOpenProject(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{projectForm.id ? "Cáº­p nháº­t dá»± Ã¡n" : "ThÃªm dá»± Ã¡n ná»•i báº­t"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="TÃªn dá»± Ã¡n"
              value={projectForm.name}
              placeholder="VÃ­ dá»¥: Há»‡ thá»‘ng Quáº£n lÃ½ CV thÃ´ng minh"
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Vai trÃ² trong dá»± Ã¡n"
              value={projectForm.role}
              placeholder="VÃ­ dá»¥: Backend Lead hoáº·c ThÃ nh viÃªn chÃ­nh"
              onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="CÃ´ng nghá»‡ sá»­ dá»¥ng"
              value={projectForm.technologies}
              placeholder="VÃ­ dá»¥: Spring Boot, React, MySQL, Docker"
              onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="MÃ´ táº£ chi tiáº¿t dá»± Ã¡n"
              value={projectForm.description}
              placeholder="MÃ´ táº£ tÃ³m táº¯t má»¥c tiÃªu, hoáº¡t Ä‘á»™ng chÃ­nh vÃ  cÃ¡c chá»©c nÄƒng ná»•i báº­t cá»§a dá»± Ã¡n..."
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />
            <TextField
              fullWidth
              label="Link dá»± Ã¡n / Github Repository"
              value={projectForm.link}
              placeholder="VÃ­ dá»¥: https://github.com/my-project"
              onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenProject(false)} color="inherit" sx={{ textTransform: "none", fontWeight: 700 }}>
            Há»§y
          </Button>
          <Button onClick={handleProjectSubmit} variant="contained" disabled={saving} sx={{ bgcolor: "#0284c7", "&:hover": { bgcolor: "#0369a1" }, textTransform: "none", fontWeight: 700 }}>
            LÆ°u má»¥c dá»± Ã¡n
          </Button>
        </DialogActions>
      </Dialog>

      <AutoFillProfileModal
        open={openAutoFill}
        onClose={() => setOpenAutoFill(false)}
        onApply={async (parsedData) => {
          const ok = await handleUpdateProfile(parsedData, null);
          if (ok) {
            showToast("ÄÃ£ tá»± Ä‘á»™ng Ä‘iá»n há»“ sÆ¡ tá»« CV thÃ nh cÃ´ng!", "success");
          }
        }}
      />
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
