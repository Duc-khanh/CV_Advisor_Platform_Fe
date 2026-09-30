import { useCallback, useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, Tab, Table,
  TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
  Tabs, TextField, Tooltip, Typography,
} from "@mui/material";
import { Add, AutoAwesome, Close, Edit, ManageAccounts, Refresh, Search, Token } from "@mui/icons-material";
import {
  adjustAdminAiCredits, createAdminAiPlan, getAdminAiDashboard, getAdminAiPlans,
  getAdminAiSubscription, getAdminAiSubscriptions, getAdminAiUsage, getApiErrorMessage, updateAdminAiPlan,
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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({ planCode: "", status: "ACTIVE", bonusCredits: 0, resetPeriod: false });
  const [creditForm, setCreditForm] = useState({ amount: 0, reason: "" });

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logUserId, setLogUserId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalLogs, setTotalLogs] = useState(0);

  const [subscriptions, setSubscriptions] = useState([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [subSearch, setSubSearch] = useState("");
  const [subPlanFilter, setSubPlanFilter] = useState("");
  const [subPage, setSubPage] = useState(0);
  const [subRowsPerPage, setSubRowsPerPage] = useState(10);
  const [totalSubs, setTotalSubs] = useState(0);

  const loadOverview = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [dashboardData, planData] = await Promise.all([getAdminAiDashboard(), getAdminAiPlans()]);
      setDashboard(dashboardData); setPlans(Array.isArray(planData) ? planData : []);
    } catch (err) { setError(getApiErrorMessage(err, "Không thể tải dữ liệu quản trị AI.")); }
    finally { setLoading(false); }
  }, []);

  const loadSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const data = await getAdminAiSubscriptions({
        ...(subSearch.trim() ? { search: subSearch.trim() } : {}),
        ...(subPlanFilter ? { planCode: subPlanFilter } : {}),
        page: subPage,
        size: subRowsPerPage,
      });
      setSubscriptions(Array.isArray(data?.content) ? data.content : []);
      setTotalSubs(data?.totalElements || 0);
    } catch (err) {
      showToast(getApiErrorMessage(err, "Không thể tải danh sách subscription."), "error");
    } finally {
      setSubsLoading(false);
    }
  }, [subSearch, subPlanFilter, subPage, subRowsPerPage, showToast]);

  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const data = await getAdminAiUsage({ ...(logUserId.trim() ? { userId: logUserId.trim() } : {}), page, size: rowsPerPage });
      setLogs(Array.isArray(data?.content) ? data.content : []); setTotalLogs(data?.totalElements || 0);
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể tải lịch sử sử dụng."), "error"); }
    finally { setLogsLoading(false); }
  }, [logUserId, page, rowsPerPage, showToast]);

  useEffect(() => { loadOverview(); }, [loadOverview]);
  useEffect(() => { if (tab === 0 || tab === 2) loadSubscriptions(); }, [tab, loadSubscriptions]);
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
      setSubscription(data); showToast("Đã cập nhật subscription.", "success"); await Promise.all([loadOverview(), loadSubscriptions()]);
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể cập nhật subscription."), "error"); }
    finally { setSaving(false); }
  };

  const adjustCredits = async () => {
    if (!Number(creditForm.amount) || !creditForm.reason.trim()) return;
    setSaving(true);
    try {
      const data = await adjustAdminAiCredits(userId.trim(), { amount: Number(creditForm.amount), reason: creditForm.reason.trim() });
      setSubscription(data); setCreditForm({ amount: 0, reason: "" }); showToast("Đã điều chỉnh credit.", "success"); await loadSubscriptions();
    } catch (err) { showToast(getApiErrorMessage(err, "Không thể điều chỉnh credit."), "error"); }
    finally { setSaving(false); }
  };

  const openEditDialog = (sub) => {
    setUserId(String(sub.userId));
    setSubscription(sub);
    setSubscriptionForm({
      planCode: sub.planCode || "",
      status: sub.status || "ACTIVE",
      bonusCredits: sub.bonusCredits || 0,
      resetPeriod: false,
    });
    setCreditForm({ amount: 0, reason: "" });
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    if (saving) return;
    setEditDialogOpen(false);
  };

  const renderSubscriptionTable = () => (
    <Stack spacing={2.5}>
        {/* Thanh tìm kiếm & lọc Subscription */}
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems="center" justifyContent="space-between">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flex={1} width="100%">
              <TextField
                size="small"
                placeholder="Tìm theo Email người dùng..."
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setSubPage(0); loadSubscriptions(); } }}
                sx={{ minWidth: 280 }}
              />
              <TextField
                select
                size="small"
                value={subPlanFilter}
                onChange={(e) => { setSubPlanFilter(e.target.value); setSubPage(0); }}
                SelectProps={{ displayEmpty: true }}
                sx={{ minWidth: 160 }}
              >
                <MenuItem value="">Tất cả gói</MenuItem>
                {plans.map((p) => (
                  <MenuItem key={p.code} value={p.code}>{p.name} ({p.code})</MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={() => { setSubPage(0); loadSubscriptions(); }}
              >
                Tìm kiếm
              </Button>
            </Stack>
            <Button
              startIcon={<Refresh />}
              onClick={loadSubscriptions}
              disabled={subsLoading}
            >
              Làm mới
            </Button>
          </Stack>
        </Paper>

        {/* Bảng danh sách tài khoản */}
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 60 }}>STT</TableCell>
                <TableCell>Người dùng</TableCell>
                <TableCell>Gói AI</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Credit khả dụng</TableCell>
                <TableCell>Credit đã dùng</TableCell>
                <TableCell>Token sử dụng</TableCell>
                <TableCell>Thời hạn chu kỳ</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subsLoading ? (
                <TableRow><TableCell colSpan={9}><PageState loading minHeight={160} /></TableCell></TableRow>
              ) : subscriptions.map((sub, index) => (
                <TableRow key={sub.subscriptionId || sub.userId} hover>
                  <TableCell sx={{ width: 60, fontWeight: 600 }}>
                    {subPage * subRowsPerPage + index + 1}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700}>
                      {sub.userEmail || "Người dùng"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={sub.planCode === "PRO" ? "secondary" : sub.planCode === "BASIC" ? "primary" : "default"}
                      label={sub.planName || sub.planCode}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      color={sub.status === "ACTIVE" ? "success" : "default"}
                      label={sub.status}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                      {formatNumber(sub.remainingCredits)} credit
                    </Typography>
                    {sub.bonusCredits > 0 && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        (Thưởng: +{formatNumber(sub.bonusCredits)})
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatNumber(sub.usedCredits)} / {formatNumber(sub.allocatedCredits + sub.bonusCredits)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatNumber((sub.inputTokens || 0) + (sub.outputTokens || 0))}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      / {formatNumber(sub.tokenLimit)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDateTime(sub.periodEnd)}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Chỉnh sửa gói & điều chỉnh credit">
                      <IconButton
                        color="primary"
                        onClick={() => openEditDialog(sub)}
                        size="small"
                        sx={{ bgcolor: "#eff6ff", "&:hover": { bgcolor: "#dbeafe" } }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!subsLoading && !subscriptions.length && (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 5 }}>Không tìm thấy subscription nào.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalSubs}
            page={subPage}
            onPageChange={(_, value) => setSubPage(value)}
            rowsPerPage={subRowsPerPage}
            onRowsPerPageChange={(e) => { setSubRowsPerPage(Number(e.target.value)); setSubPage(0); }}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Số dòng"
          />
        </TableContainer>
      </Stack>
  );

  if (loading) return <PageState loading title="Đang tải dữ liệu AI..." />;
  if (error) return <Alert severity="error" action={<Button color="inherit" onClick={loadOverview}>Thử lại</Button>}>{error}</Alert>;

  return <Box sx={{ maxWidth: 1500, mx: "auto", pb: 3 }}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={2.5}>
      <Box><Stack direction="row" spacing={1} alignItems="center"><AutoAwesome color="primary" /><Typography variant="h4" fontWeight={900}>Quản lý AI</Typography></Stack><Typography color="text.secondary" mt={0.5}>Quản lý hạn mức, gói dịch vụ và lịch sử sử dụng AI.</Typography></Box>
      <Button startIcon={<Refresh />} onClick={loadOverview} sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}>Làm mới</Button>
    </Stack>
    <Paper variant="outlined" sx={{ borderRadius: 3, borderColor: "#e2e8f0", mb: 2.5 }}><Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto"><Tab label="Tổng quan" /><Tab label="Gói AI" /><Tab label="Subscription" /><Tab label="Lịch sử sử dụng" /></Tabs></Paper>

    {tab === 0 && <Stack spacing={3}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", xl: "repeat(5, 1fr)" }, gap: 2 }}>
        <StatCard title="Gói AI" value={dashboard?.plans} icon={<AutoAwesome />} color="#2563eb" />
        <StatCard title="Subscription" value={dashboard?.subscriptions} icon={<ManageAccounts />} color="#7c3aed" />
        <StatCard title="Tổng yêu cầu" value={dashboard?.requests} icon={<Token />} color="#0891b2" />
        <StatCard title="Thành công" value={dashboard?.successfulRequests} icon={<AutoAwesome />} color="#16a34a" />
        <StatCard title="Thất bại" value={dashboard?.failedRequests} icon={<AutoAwesome />} color="#dc2626" />
      </Box>
      {renderSubscriptionTable()}
    </Stack>}

    {tab === 1 && <>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>Danh sách gói</Typography><Button variant="contained" startIcon={<Add />} onClick={() => setPlanDialog({ open: true, plan: null })}>Tạo gói</Button></Stack>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}><Table><TableHead><TableRow><TableCell>Mã / tên gói</TableCell><TableCell>Giá tháng</TableCell><TableCell>Credit</TableCell><TableCell>Token</TableCell><TableCell>RPM</TableCell><TableCell>Trạng thái</TableCell><TableCell align="right">Thao tác</TableCell></TableRow></TableHead><TableBody>
        {plans.map((plan) => <TableRow key={plan.id || plan.code} hover><TableCell><Typography fontWeight={700}>{plan.name}</Typography><Typography variant="caption" color="text.secondary">{plan.code}</Typography></TableCell><TableCell>{formatCurrency(plan.monthlyPrice)}</TableCell><TableCell>{formatNumber(plan.monthlyCredits)}</TableCell><TableCell>{formatNumber(plan.monthlyTokenLimit)}</TableCell><TableCell>{formatNumber(plan.requestsPerMinute)}</TableCell><TableCell><Chip size="small" color={plan.active ? "success" : "default"} label={plan.active ? "Hoạt động" : "Tạm dừng"} /></TableCell><TableCell align="right"><Tooltip title="Chỉnh sửa"><IconButton onClick={() => setPlanDialog({ open: true, plan })}><Edit /></IconButton></Tooltip></TableCell></TableRow>)}
        {!plans.length && <TableRow><TableCell colSpan={7} align="center">Chưa có gói AI.</TableCell></TableRow>}
      </TableBody></Table></TableContainer>
    </>}

    {tab === 2 && renderSubscriptionTable()}

      {/* Modal / Dialog chỉnh sửa gói & điều chỉnh credit */}
      <Dialog
        open={Boolean(editDialogOpen && subscription)}
        onClose={closeEditDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={800}>
                Quản lý AI: {subscription?.userEmail}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Credit hiện có: <strong>{formatNumber(subscription?.remainingCredits)}</strong> credit
              </Typography>
            </Box>
            <IconButton onClick={closeEditDialog} disabled={saving} size="small">
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" }, gap: 3, pt: 1 }}>
            {/* Cập nhật gói */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={800} mb={2} color="primary.main">
                Cập nhật gói cước
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                <TextField
                  select
                  label="Gói"
                  value={subscriptionForm.planCode}
                  onChange={(e) => setSubscriptionForm((old) => ({ ...old, planCode: e.target.value }))}
                >
                  {plans.map((plan) => <MenuItem key={plan.code} value={plan.code}>{plan.name} ({plan.code})</MenuItem>)}
                </TextField>
                <TextField
                  select
                  label="Trạng thái"
                  value={subscriptionForm.status}
                  onChange={(e) => setSubscriptionForm((old) => ({ ...old, status: e.target.value }))}
                >
                  {["ACTIVE", "SUSPENDED", "CANCELLED", "EXPIRED"].map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
                </TextField>
                <TextField
                  type="number"
                  label="Bonus credit"
                  value={subscriptionForm.bonusCredits}
                  inputProps={{ min: 0 }}
                  onChange={(e) => setSubscriptionForm((old) => ({ ...old, bonusCredits: e.target.value }))}
                />
                <FormControlLabel
                  control={<Switch checked={subscriptionForm.resetPeriod} onChange={(e) => setSubscriptionForm((old) => ({ ...old, resetPeriod: e.target.checked }))} />}
                  label="Đặt lại chu kỳ"
                />
              </Box>
              <Button
                sx={{ mt: 2.5 }}
                variant="contained"
                onClick={saveSubscription}
                disabled={saving || Number(subscriptionForm.bonusCredits) < 0}
              >
                {saving ? "Đang lưu..." : "Lưu gói cước"}
              </Button>
            </Paper>

            {/* Điều chỉnh credit */}
            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={800} mb={2} color="primary.main">
                Điều chỉnh credit
              </Typography>
              <Stack spacing={2}>
                <TextField
                  type="number"
                  label="Số credit (+ cộng, - trừ)"
                  value={creditForm.amount}
                  onChange={(e) => setCreditForm((old) => ({ ...old, amount: e.target.value }))}
                />
                <TextField
                  label="Lý do điều chỉnh"
                  value={creditForm.reason}
                  onChange={(e) => setCreditForm((old) => ({ ...old, reason: e.target.value }))}
                  multiline
                  minRows={2}
                />
                <Button
                  variant="outlined"
                  onClick={adjustCredits}
                  disabled={saving || !Number(creditForm.amount) || !creditForm.reason.trim()}
                >
                  {saving ? "Đang xử lý..." : "Xác nhận điều chỉnh"}
                </Button>
              </Stack>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeEditDialog} disabled={saving}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

    {tab === 3 && <>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 2 }}><Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}><TextField size="small" label="Lọc theo User ID" value={logUserId} onChange={(e) => setLogUserId(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { setPage(0); loadLogs(); } }} /><Button startIcon={<Search />} variant="contained" onClick={() => { setPage(0); loadLogs(); }}>Tìm kiếm</Button></Stack></Paper>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}><Table size="small"><TableHead><TableRow><TableCell sx={{ width: 60 }}>STT</TableCell><TableCell>Thời gian</TableCell><TableCell>Người dùng</TableCell><TableCell>Tính năng</TableCell><TableCell>Model</TableCell><TableCell>Credit</TableCell><TableCell>Token</TableCell><TableCell>Trạng thái</TableCell></TableRow></TableHead><TableBody>
        {logsLoading ? <TableRow><TableCell colSpan={8}><PageState loading minHeight={180} /></TableCell></TableRow> : logs.map((log, index) => <TableRow key={log.id} hover><TableCell sx={{ width: 60, fontWeight: 600 }}>{page * rowsPerPage + index + 1}</TableCell><TableCell>{formatDateTime(log.createdAt)}</TableCell><TableCell><Typography variant="body2" fontWeight={700}>{log.email || "Người dùng"}</Typography></TableCell><TableCell>{FEATURE_LABELS[log.feature] || log.feature}</TableCell><TableCell>{log.model || "—"}</TableCell><TableCell>{formatNumber(log.chargedCredits)}</TableCell><TableCell>{formatNumber((log.inputTokens || 0) + (log.outputTokens || 0))}</TableCell><TableCell><Chip size="small" color={log.status === "SUCCESS" ? "success" : "error"} label={log.status} /></TableCell></TableRow>)}
        {!logsLoading && !logs.length && <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6 }}>Chưa có dữ liệu sử dụng.</TableCell></TableRow>}
      </TableBody></Table><TablePagination component="div" count={totalLogs} page={page} onPageChange={(_, value) => setPage(value)} rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }} rowsPerPageOptions={[10, 20, 50]} labelRowsPerPage="Số dòng" /></TableContainer>
    </>}

    <PlanDialog open={planDialog.open} plan={planDialog.plan} saving={saving} onClose={() => setPlanDialog({ open: false, plan: null })} onSave={savePlan} />
  </Box>;
}
