import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, Tab, Table,
  TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Tabs, TextField, Tooltip, Typography,
} from "@mui/material";
import { Add, AutoAwesome, Edit, ManageAccounts, Refresh, Search, Token } from "@mui/icons-material";
import {
  adjustAdminAiCredits, createAdminAiPlan, getAdminAiDashboard, getAdminAiPlans,
  getAdminAiSubscription, getAdminAiUsage, getApiErrorMessage, updateAdminAiPlan,
  updateAdminAiSubscription,
} from "../../../services/ai/aiUsageService";
import { useToast } from "../../../contexts/ToastContext";
import PageState from "../../../shared/components/feedback/PageState";
import { FEATURE_LABELS, formatCurrency, formatDateTime, formatNumber } from "../../ai-usage/formatters";

const emptyPlan = {
  code: "", name: "", monthlyPrice: 0, monthlyCredits: 0, monthlyTokenLimit: 0,
  maxInputTokens: 0, maxOutputTokens: 0, requestsPerMinute: 0, cvEvaluationCredits: 1,
  careerRoadmapCredits: 1, cvRewriteCredits: 1, careerAssistantCredits: 1,
  candidateFitCredits: 1, active: true,
};

const planNumberFields = [
  ["monthlyPrice", "Giá/tháng (VND)"], ["monthlyCredits", "Credit/tháng"],
  ["monthlyTokenLimit", "Token/tháng"], ["maxInputTokens", "Token đầu vào tối đa"],
  ["maxOutputTokens", "Token đầu ra tối đa"], ["requestsPerMinute", "Yêu cầu/phút"],
  ["cvEvaluationCredits", "Credit đánh giá CV"], ["careerRoadmapCredits", "Credit lộ trình"],
  ["cvRewriteCredits", "Credit viết lại CV"], ["careerAssistantCredits", "Credit trợ lý"],
  ["candidateFitCredits", "Credit đánh giá ứng viên"],
];

function StatCard({ title, value, icon, color }) {
  return <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, borderColor: "#e2e8f0" }}><Stack direction="row" justifyContent="space-between"><Box><Typography variant="body2" color="text.secondary">{title}</Typography><Typography variant="h4" fontWeight={900} mt={0.5}>{formatNumber(value)}</Typography></Box><Box sx={{ width: 44, height: 44, borderRadius: 2.5, display: "grid", placeItems: "center", color, bgcolor: `${color}12` }}>{icon}</Box></Stack></Paper>;
}

function PlanDialog({ open, plan, saving, onClose, onSave }) {
  const [form, setForm] = useState(emptyPlan);
  useEffect(() => { if (open) setForm(plan ? { ...emptyPlan, ...plan } : emptyPlan); }, [open, plan]);
  const change = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const submit = () => onSave({ ...form, ...Object.fromEntries(planNumberFields.map(([key]) => [key, Number(form[key]) || 0])) });
  const hasInvalidLimit = ["monthlyTokenLimit", "maxInputTokens", "maxOutputTokens", "requestsPerMinute"]
    .some((key) => Number(form[key]) < 1);
  return <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
    <DialogTitle fontWeight={800}>{plan ? "Chỉnh sửa gói AI" : "Tạo gói AI"}</DialogTitle>
    <DialogContent dividers><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, pt: 0.5 }}>
      <TextField label="Mã gói" value={form.code} disabled={Boolean(plan)} required onChange={(e) => change("code", e.target.value.toUpperCase())} />
      <TextField label="Tên gói" value={form.name} required onChange={(e) => change("name", e.target.value)} />
      {planNumberFields.map(([key, label]) => <TextField key={key} label={label} type="number" value={form[key]} inputProps={{ min: 0 }} onChange={(e) => change(key, e.target.value)} />)}
      <FormControlLabel control={<Switch checked={Boolean(form.active)} onChange={(e) => change("active", e.target.checked)} />} label="Đang hoạt động" />
    </Box></DialogContent>
    <DialogActions sx={{ p: 2 }}><Button onClick={onClose} disabled={saving}>Hủy</Button><Button variant="contained" onClick={submit} disabled={saving || hasInvalidLimit || !form.code.trim() || !form.name.trim()}>{saving ? "Đang lưu..." : "Lưu gói"}</Button></DialogActions>
  </Dialog>;
}

export default function AdminAiManagementPage() {
  const showToast = useToast();
  const [tab, setTab] = useState(0);
  const [dashboard, setDashboard] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [planDialog, setPlanDialog] = useState({ open: false, plan: null });
  const [saving, setSaving] = useState(false);

  const [userId, setUserId] = useState("");
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({ planCode: "", status: "ACTIVE", bonusCredits: 0, resetPeriod: false });
  const [creditForm, setCreditForm] = useState({ amount: 0, reason: "" });

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logUserId, setLogUserId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);

  const loadOverview = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [dashboardData, planData] = await Promise.all([getAdminAiDashboard(), getAdminAiPlans()]);
      setDashboard(dashboardData); setPlans(Array.isArray(planData) ? planData : []);
    } catch (err) { setError(getApiErrorMessage(err, "Không thể tải dữ liệu quản trị AI.")); }
    finally { setLoading(false); }
  }, []);

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const data = await getAdminAiUsage({ ...(logUserId.trim() ? { userId: logUserId.trim() } : {}), page, size: rowsPerPage });
      setLogs(Array.isArray(data?.content) ? data.content : []); setTotalLogs(data?.totalElements || 0);
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể tải lịch sử sử dụng."), "error"); }
    finally { setLogsLoading(false); }
  }, [logUserId, page, rowsPerPage, showToast]);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => { if (tab === 3) loadLogs(); }, [tab, loadLogs]);

  const savePlan = async (payload) => {
    setSaving(true);
    try {
      if (planDialog.plan) await updateAdminAiPlan(planDialog.plan.id, payload); else await createAdminAiPlan(payload);
      showToast(planDialog.plan ? "Đã cập nhật gói AI." : "Đã tạo gói AI.", "success");
      setPlanDialog({ open: false, plan: null }); await loadOverview();
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể lưu gói AI."), "error"); }
    finally { setSaving(false); }
  };

  const findSubscription = async () => {
    if (!userId.trim()) return;
    setSubscriptionLoading(true); setSubscription(null);
    try {
      const data = await getAdminAiSubscription(userId.trim()); setSubscription(data);
      setSubscriptionForm({ planCode: data.planCode || "", status: data.status || "ACTIVE", bonusCredits: data.bonusCredits || 0, resetPeriod: false });
    } catch (err) { showToast(getApiErrorMessage(err, "Không tìm thấy subscription của người dùng."), "error"); }
    finally { setSubscriptionLoading(false); }
  };

  const saveSubscription = async () => {
    setSaving(true);
    try {
      const data = await updateAdminAiSubscription(userId.trim(), { ...subscriptionForm, bonusCredits: Number(subscriptionForm.bonusCredits) || 0 });
      setSubscription(data); showToast("Đã cập nhật subscription.", "success"); await loadOverview();
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể cập nhật subscription."), "error"); }
    finally { setSaving(false); }
  };

  const adjustCredits = async () => {
    if (!Number(creditForm.amount) || !creditForm.reason.trim()) return;
    setSaving(true);
    try {
      const data = await adjustAdminAiCredits(userId.trim(), { amount: Number(creditForm.amount), reason: creditForm.reason.trim() });
      setSubscription(data); setCreditForm({ amount: 0, reason: "" }); showToast("Đã điều chỉnh credit.", "success");
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể điều chỉnh credit."), "error"); }
    finally { setSaving(false); }
  };

  if (loading) return <PageState loading title="Đang tải dữ liệu AI..." />;
  if (error) return <Alert severity="error" action={<Button color="inherit" onClick={loadOverview}>Thử lại</Button>}>{error}</Alert>;

  return <Box sx={{ maxWidth: 1500, mx: "auto", pb: 3 }}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={2.5}>
      <Box><Stack direction="row" spacing={1} alignItems="center"><AutoAwesome color="primary" /><Typography variant="h4" fontWeight={900}>Quản lý AI</Typography></Stack><Typography color="text.secondary" mt={0.5}>Quản lý hạn mức, gói dịch vụ và lịch sử sử dụng AI.</Typography></Box>
      <Button startIcon={<Refresh />} onClick={loadOverview} sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>Làm mới</Button>
    </Stack>
    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", mb: 2.5 }}><Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto"><Tab label="Tổng quan" /><Tab label="Gói AI" /><Tab label="Subscription" /><Tab label="Lịch sử sử dụng" /></Tabs></Paper>

    {tab === 0 && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(5, 1fr)" }, gap: 2 }}>
      <StatCard title="Gói AI" value={dashboard?.plans} icon={<AutoAwesome />} color="#2563eb" />
      <StatCard title="Subscription" value={dashboard?.subscriptions} icon={<ManageAccounts />} color="#7c3aed" />
      <StatCard title="Tổng yêu cầu" value={dashboard?.requests} icon={<Token />} color="#0891b2" />
      <StatCard title="Thành công" value={dashboard?.successfulRequests} icon={<AutoAwesome />} color="#16a34a" />
      <StatCard title="Thất bại" value={dashboard?.failedRequests} icon={<AutoAwesome />} color="#dc2626" />
    </Box>}

    {tab === 1 && <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>Danh sách gói</Typography><Button variant="contained" startIcon={<Add />} onClick={() => setPlanDialog({ open: true, plan: null })}>Tạo gói</Button></Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}><Table><TableHead><TableRow><TableCell>Mã / tên gói</TableCell><TableCell>Giá tháng</TableCell><TableCell>Credit</TableCell><TableCell>Token</TableCell><TableCell>RPM</TableCell><TableCell>Trạng thái</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead><TableBody>
        {plans.map((plan) => <TableRow key={plan.id || plan.code} hover><TableCell><Typography fontWeight={700}>{plan.name}</Typography><Typography variant="caption" color="text.secondary">{plan.code}</Typography></TableCell><TableCell>{formatCurrency(plan.monthlyPrice)}</TableCell><TableCell>{formatNumber(plan.monthlyCredits)}</TableCell><TableCell>{formatNumber(plan.monthlyTokenLimit)}</TableCell><TableCell>{formatNumber(plan.requestsPerMinute)}</TableCell><TableCell><Chip size="small" color={plan.active ? "success" : "default"} label={plan.active ? "Hoạt động" : "Tạm dừng"} /></TableCell><TableCell align="right"><Tooltip title="Chỉnh sửa"><IconButton onClick={() => setPlanDialog({ open: true, plan })}><Edit /></IconButton></Tooltip></TableCell></TableRow>)}
        {!plans.length && <TableRow><TableCell colSpan={7} align="center">Chưa có gói AI.</TableCell></TableRow>}
      </TableBody></Table></TableContainer>
    </>}

    {tab === 2 && <Stack spacing={2.5}>
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Tra cứu theo ID người dùng</Typography><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}><TextField size="small" label="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} onKeyDown={(e) => e.key === "Enter" && findSubscription()} /><Button variant="contained" startIcon={<Search />} onClick={findSubscription} disabled={!userId.trim() || subscriptionLoading}>{subscriptionLoading ? "Đang tìm..." : "Tra cứu"}</Button></Stack></Paper>
      {subscription && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.2fr 0.8fr" }, gap: 2.5 }}>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}><Typography variant="h6" fontWeight={800} mb={2}>Cập nhật subscription</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}><TextField select label="Gói" value={subscriptionForm.planCode} onChange={(e) => setSubscriptionForm((old) => ({ ...old, planCode: e.target.value }))}>{plans.map((plan) => <MenuItem key={plan.code} value={plan.code}>{plan.name} ({plan.code})</MenuItem>)}</TextField><TextField select label="Trạng thái" value={subscriptionForm.status} onChange={(e) => setSubscriptionForm((old) => ({ ...old, status: e.target.value }))}>{["ACTIVE", "SUSPENDED", "CANCELLED", "EXPIRED"].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}</TextField><TextField type="number" label="Bonus credit" value={subscriptionForm.bonusCredits} inputProps={{ min: 0 }} onChange={(e) => setSubscriptionForm((old) => ({ ...old, bonusCredits: e.target.value }))} /><FormControlLabel control={<Switch checked={subscriptionForm.resetPeriod} onChange={(e) => setSubscriptionForm((old) => ({ ...old, resetPeriod: e.target.checked }))} />} label="Đặt lại chu kỳ sử dụng" /></Box><Button sx={{ mt: 2 }} variant="contained" onClick={saveSubscription} disabled={saving || Number(subscriptionForm.bonusCredits) < 0}>Lưu thay đổi</Button></Paper>
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}><Typography variant="h6" fontWeight={800}>Điều chỉnh credit</Typography><Typography color="text.secondary" variant="body2" my={1}>Còn lại: <strong>{formatNumber(subscription.remainingCredits)}</strong> credit</Typography><Stack spacing={2} mt={2}><TextField type="number" label="Số credit (+ cộng, - trừ)" value={creditForm.amount} onChange={(e) => setCreditForm((old) => ({ ...old, amount: e.target.value }))} /><TextField label="Lý do" value={creditForm.reason} onChange={(e) => setCreditForm((old) => ({ ...old, reason: e.target.value }))} multiline minRows={2} /><Button variant="outlined" onClick={adjustCredits} disabled={saving || !Number(creditForm.amount) || !creditForm.reason.trim()}>Xác nhận điều chỉnh</Button></Stack></Paper>
      </Box>}
    </Stack>}

    {tab === 3 && <>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}><TextField size="small" label="Lọc theo User ID" value={logUserId} onChange={(e) => setLogUserId(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setPage(0); loadLogs(); } }} /><Button startIcon={<Search />} variant="contained" onClick={() => { setPage(0); loadLogs(); }}>Tìm kiếm</Button></Stack></Paper>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}><Table size="small"><TableHead><TableRow><TableCell>Thời gian</TableCell><TableCell>Người dùng</TableCell><TableCell>Tính năng</TableCell><TableCell>Model</TableCell><TableCell>Credit</TableCell><TableCell>Token</TableCell><TableCell>Trạng thái</TableCell></TableRow></TableHead><TableBody>
        {logsLoading ? <TableRow><TableCell colSpan={7}><PageState loading minHeight={180} /></TableCell></TableRow> : logs.map((log) => <TableRow key={log.id} hover><TableCell>{formatDateTime(log.createdAt)}</TableCell><TableCell><Typography variant="body2" fontWeight={700}>{log.email || `#${log.userId}`}</Typography><Typography variant="caption" color="text.secondary">ID: {log.userId}</Typography></TableCell><TableCell>{FEATURE_LABELS[log.feature] || log.feature}</TableCell><TableCell>{log.model || "—"}</TableCell><TableCell>{formatNumber(log.chargedCredits)}</TableCell><TableCell>{formatNumber((log.inputTokens || 0) + (log.outputTokens || 0))}</TableCell><TableCell><Chip size="small" color={log.status === "SUCCESS" ? "success" : "error"} label={log.status} /></TableCell></TableRow>)}
        {!logsLoading && !logs.length && <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}>Chưa có dữ liệu sử dụng.</TableCell></TableRow>}
      </TableBody></Table><TablePagination component="div" count={totalLogs} page={page} onPageChange={(_, value) => setPage(value)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} rowsPerPageOptions={[10, 20, 50]} labelRowsPerPage="Số dòng" /></TableContainer>
    </>}

    <PlanDialog open={planDialog.open} plan={planDialog.plan} saving={saving} onClose={() => setPlanDialog({ open: false, plan: null })} onSave={savePlan} />
  </Box>;
}
