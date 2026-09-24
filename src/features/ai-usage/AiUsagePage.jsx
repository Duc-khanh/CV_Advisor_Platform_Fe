import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  AutoAwesome,
  CalendarMonth,
  CheckCircleOutline,
  DataUsage,
  Refresh,
  Token,
} from "@mui/icons-material";
import { getAiPlans, getApiErrorMessage, getMyAiUsage } from "../../services/ai/aiUsageService";
import { useToast } from "../../contexts/ToastContext";
import { formatCurrency, formatDateTime, formatNumber, percentUsed } from "./formatters";

const featureCosts = [
  ["cvEvaluationCredits", "Đánh giá CV"],
  ["careerRoadmapCredits", "Tạo lộ trình nghề nghiệp"],
  ["cvRewriteCredits", "Viết lại CV"],
  ["careerAssistantCredits", "Trợ lý nghề nghiệp"],
  ["candidateFitCredits", "Đánh giá độ phù hợp ứng viên"],
];

function QuotaCard({ icon, title, used, limit, remaining, color }) {
  const progress = percentUsed(used, limit);
  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, borderColor: "#e2e8f0" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2.5}>
        <Box sx={{ width: 46, height: 46, borderRadius: 3, display: "grid", placeItems: "center", color, bgcolor: `${color}12` }}>
          {icon}
        </Box>
        <Chip size="small" label={`Còn ${formatNumber(remaining)}`} sx={{ fontWeight: 700, color, bgcolor: `${color}12` }} />
      </Stack>
      <Typography color="text.secondary" fontSize={14}>{title}</Typography>
      <Typography variant="h4" fontWeight={800} mt={0.5}>{formatNumber(used)} <Typography component="span" color="text.secondary" fontSize={14}>/ {formatNumber(limit)}</Typography></Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 2, height: 8, borderRadius: 10, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 10 } }}
      />
      <Typography color="text.secondary" fontSize={12} mt={1}>{progress}% đã sử dụng trong kỳ này</Typography>
    </Paper>
  );
}

function PlanCard({ plan, current, onUpgrade }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, borderRadius: 4, height: "100%", position: "relative", borderWidth: current ? 2 : 1, borderColor: current ? "primary.main" : "#e2e8f0", bgcolor: current ? "#f8fbff" : "white" }}
    >
      {current && <Chip label="Gói hiện tại" size="small" color="primary" sx={{ position: "absolute", right: 20, top: 20, fontWeight: 700 }} />}
      <Typography variant="h6" fontWeight={800}>{plan.name}</Typography>
      <Typography variant="h4" fontWeight={900} my={1.5}>{formatCurrency(plan.monthlyPrice)}<Typography component="span" color="text.secondary" fontSize={13}> / tháng</Typography></Typography>
      <Stack spacing={1.2} mb={3}>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.monthlyCredits)} credit</Typography>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.monthlyTokenLimit)} token</Typography>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.requestsPerMinute)} yêu cầu/phút</Typography>
      </Stack>
      <Button fullWidth variant={current ? "outlined" : "contained"} disabled={current} onClick={() => onUpgrade(plan)} sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.5 }}>
        {current ? "Đang sử dụng" : "Yêu cầu nâng cấp"}
      </Button>
    </Paper>
  );
}

export default function AiUsagePage() {
  const showToast = useToast();
  const [usage, setUsage] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [usageData, planData] = await Promise.all([getMyAiUsage(), getAiPlans()]);
      setUsage(usageData);
      setPlans(Array.isArray(planData) ? planData : []);
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải hạn mức AI. Vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const currentPlan = useMemo(
    () => plans.find((plan) => plan.code === usage?.planCode),
    [plans, usage?.planCode],
  );

  if (loading) {
    return <Stack spacing={2}><Skeleton height={90} /><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}><Skeleton height={220} /><Skeleton height={220} /></Box><Skeleton height={280} /></Stack>;
  }

  if (error) {
    return <Alert severity="error" action={<Button color="inherit" onClick={loadData}>Thử lại</Button>}>{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", pb: 4 }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} mb={3}>
        <Box>
          <Stack direction="row" spacing={1.2} alignItems="center"><AutoAwesome color="primary" /><Typography variant="h4" fontWeight={900}>Hạn mức AI của tôi</Typography></Stack>
          <Typography color="text.secondary" mt={0.7}>Theo dõi lượt sử dụng, token và quyền lợi trong gói hiện tại.</Typography>
        </Box>
        <Button startIcon={<Refresh />} onClick={loadData} sx={{ alignSelf: { xs: "flex-start", sm: "center" }, textTransform: "none" }}>Làm mới</Button>
      </Stack>

      <Alert severity={usage?.status === "ACTIVE" ? "info" : "warning"} sx={{ mb: 3, borderRadius: 3 }}>
        Gói <strong>{usage?.planName || usage?.planCode || "—"}</strong> · Trạng thái {usage?.status || "—"} · Kỳ mới bắt đầu lúc {formatDateTime(usage?.periodEnd)}
      </Alert>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
        <QuotaCard icon={<DataUsage />} title="Credit AI" used={usage?.usedCredits} limit={(usage?.allocatedCredits || 0) + (usage?.bonusCredits || 0)} remaining={usage?.remainingCredits} color="#2563eb" />
        <QuotaCard icon={<Token />} title="Token AI" used={(usage?.inputTokens || 0) + (usage?.outputTokens || 0)} limit={usage?.tokenLimit} remaining={Math.max(0, (usage?.tokenLimit || 0) - (usage?.inputTokens || 0) - (usage?.outputTokens || 0))} color="#7c3aed" />
      </Box>

      {currentPlan && (
        <Paper variant="outlined" sx={{ mt: 2.5, p: 3, borderRadius: 4, borderColor: "#e2e8f0" }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}><CalendarMonth color="primary" /><Typography variant="h6" fontWeight={800}>Chi phí theo tính năng</Typography></Stack>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }, gap: 1.5 }}>
            {featureCosts.map(([key, label]) => <Box key={key} sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: 2.5 }}><Typography variant="body2" color="text.secondary">{label}</Typography><Typography fontWeight={800} mt={0.5}>{formatNumber(currentPlan[key])} credit/lần</Typography></Box>)}
          </Box>
        </Paper>
      )}

      <Typography variant="h5" fontWeight={900} mt={5} mb={0.5}>Các gói AI</Typography>
      <Typography color="text.secondary" mb={2.5}>Chọn gói phù hợp với nhu cầu sử dụng của bạn.</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {plans.filter((plan) => plan.active).map((plan) => <PlanCard key={plan.id || plan.code} plan={plan} current={plan.code === usage?.planCode} onUpgrade={(selected) => showToast(`Vui lòng liên hệ quản trị viên để nâng cấp lên gói ${selected.name}.`, "info")} />)}
      </Box>
    </Box>
  );
}
