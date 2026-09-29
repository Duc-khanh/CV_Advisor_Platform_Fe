import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  AutoAwesome,
  CalendarMonth,
  CheckCircle,
  CheckCircleOutline,
  Close,
  ContentCopy,
  DataUsage,
  FlashOn,
  QrCode2,
  Refresh,
  ShieldOutlined,
  Sync,
  Token,
} from "@mui/icons-material";
import {
  createPaymentOrder,
  getAiPlans,
  getApiErrorMessage,
  getMyAiUsage,
  getPaymentOrderStatus,
  simulatePayment,
} from "../../services/ai/aiUsageService";
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
      <Typography variant="h4" fontWeight={800} mt={0.5}>
        {formatNumber(used)}{" "}
        <Typography component="span" color="text.secondary" fontSize={14}>
          / {formatNumber(limit)}
        </Typography>
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mt: 2, height: 8, borderRadius: 10, bgcolor: "#f1f5f9", "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 10 } }}
      />
      <Typography color="text.secondary" fontSize={12} mt={1}>{progress}% đã sử dụng trong kỳ này</Typography>
    </Paper>
  );
}

function PlanCard({ plan, currentPlan, onUpgrade, loadingPlanCode }) {
  const isCurrent = plan.code === currentPlan?.code;
  const isFree = plan.code === "FREE";
  const currentPrice = Number(currentPlan?.monthlyPrice) || 0;
  const thisPrice = Number(plan.monthlyPrice) || 0;
  const isLowerTier = thisPrice < currentPrice;
  const canUpgrade = !isCurrent && !isFree && !isLowerTier;

  let btnLabel = "Yêu cầu nâng cấp";
  if (isCurrent) btnLabel = "Đang sử dụng";
  else if (isFree) btnLabel = "Gói mặc định";
  else if (isLowerTier) btnLabel = "Gói thấp hơn";

  const isLoadingThis = loadingPlanCode === plan.code;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
        position: "relative",
        borderWidth: isCurrent ? 2 : 1,
        borderColor: isCurrent ? "primary.main" : "#e2e8f0",
        bgcolor: isCurrent ? "#f8fbff" : "white",
        boxShadow: isCurrent ? "0 10px 25px -5px rgba(37, 99, 235, 0.1)" : "none",
      }}
    >
      {isCurrent && (
        <Chip
          label="Gói hiện tại"
          size="small"
          color="primary"
          sx={{ position: "absolute", right: 20, top: 20, fontWeight: 700 }}
        />
      )}
      <Typography variant="h6" fontWeight={800}>{plan.name}</Typography>
      <Typography variant="h4" fontWeight={900} my={1.5}>
        {formatCurrency(plan.monthlyPrice)}
        <Typography component="span" color="text.secondary" fontSize={13}> / tháng</Typography>
      </Typography>
      <Stack spacing={1.2} mb={3}>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.monthlyCredits)} credit</Typography>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.monthlyTokenLimit)} token</Typography>
        <Typography variant="body2"><CheckCircleOutline color="success" sx={{ fontSize: 17, mr: 1, verticalAlign: "middle" }} />{formatNumber(plan.requestsPerMinute)} yêu cầu/phút</Typography>
      </Stack>
      <Button
        fullWidth
        variant={canUpgrade ? "contained" : "outlined"}
        disabled={!canUpgrade || isLoadingThis}
        onClick={() => onUpgrade(plan)}
        startIcon={isLoadingThis ? <CircularProgress size={16} color="inherit" /> : null}
        sx={{
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 2.5,
          py: 1.1,
          boxShadow: canUpgrade ? "0 4px 14px rgba(37, 99, 235, 0.25)" : "none",
        }}
      >
        {isLoadingThis ? "Đang tạo đơn..." : btnLabel}
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

  // Quản lý đơn hàng & Thanh toán tự động
  const [activeOrder, setActiveOrder] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [isPaidSuccess, setIsPaidSuccess] = useState(false);
  const [loadingPlanCode, setLoadingPlanCode] = useState(null);
  const [copiedField, setCopiedField] = useState("");
  const [simulating, setSimulating] = useState(false);

  const pollingRef = useRef(null);

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

  // Tạo đơn hàng thanh toán và mở Modal VietQR
  const handleOpenUpgrade = async (plan) => {
    try {
      setLoadingPlanCode(plan.code);
      const order = await createPaymentOrder({ planCode: plan.code });
      setActiveOrder(order);
      setIsPaidSuccess(false);
      setUpgradeModalOpen(true);
    } catch (err) {
      showToast(getApiErrorMessage(err, "Không thể tạo đơn hàng thanh toán."), "error");
    } finally {
      setLoadingPlanCode(null);
    }
  };

  // POLLING TỰ ĐỘNG: Lắng nghe trạng thái đơn hàng mỗi 2.5 giây
  useEffect(() => {
    if (!upgradeModalOpen || !activeOrder || isPaidSuccess) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await getPaymentOrderStatus(activeOrder.orderCode);
        if (res.status === "SUCCESS") {
          setIsPaidSuccess(true);
          if (pollingRef.current) clearInterval(pollingRef.current);
          showToast(`Thanh toán thành công! Gói ${res.planName || activeOrder.planName} đã được kích hoạt.`, "success");

          // Tự động đóng modal và cập nhật giao diện sau 2 giây
          setTimeout(async () => {
            setUpgradeModalOpen(false);
            setActiveOrder(null);
            await loadData();
          }, 2200);
        }
      } catch (e) {
        // bỏ qua lỗi polling mạng tạm thời
      }
    };

    pollingRef.current = setInterval(checkStatus, 2500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [upgradeModalOpen, activeOrder, isPaidSuccess, loadData, showToast]);

  // Giả lập thanh toán thành công (Dành cho thử nghiệm / Demo)
  const handleSimulatePayment = async () => {
    if (!activeOrder) return;
    try {
      setSimulating(true);
      const res = await simulatePayment(activeOrder.orderCode);
      if (res.status === "SUCCESS") {
        setIsPaidSuccess(true);
        if (pollingRef.current) clearInterval(pollingRef.current);
        showToast(`Mô phỏng thanh toán thành công! Gói ${res.planName} đã được kích hoạt.`, "success");
        setTimeout(async () => {
          setUpgradeModalOpen(false);
          setActiveOrder(null);
          await loadData();
        }, 2000);
      }
    } catch (err) {
      showToast(getApiErrorMessage(err, "Không thể kích hoạt giả lập."), "error");
    } finally {
      setSimulating(false);
    }
  };

  const handleCopy = (text, field) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    showToast("Đã sao chép vào bộ nhớ tạm", "info");
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleCloseModal = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setUpgradeModalOpen(false);
    setActiveOrder(null);
    setIsPaidSuccess(false);
  };

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
        {plans.filter((plan) => plan.active).map((plan) => (
          <PlanCard
            key={plan.id || plan.code}
            plan={plan}
            currentPlan={currentPlan}
            loadingPlanCode={loadingPlanCode}
            onUpgrade={handleOpenUpgrade}
          />
        ))}
      </Box>

      {/* MODAL THANH TOÁN VIETQR & TỰ ĐỘNG CHUYỂN GÓI */}
      <Dialog
        open={upgradeModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3.5,
            maxWidth: 680,
            boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2.5,
            py: 1.8,
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                bgcolor: isPaidSuccess ? "#ecfdf5" : "#eff6ff",
                color: isPaidSuccess ? "#059669" : "#2563eb",
                display: "grid",
                placeItems: "center",
              }}
            >
              {isPaidSuccess ? <CheckCircle sx={{ fontSize: 22 }} /> : <QrCode2 sx={{ fontSize: 22 }} />}
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#1e293b" lineHeight={1.2}>
                {isPaidSuccess
                  ? `Kích hoạt thành công gói ${activeOrder?.planName}!`
                  : `Nâng cấp lên gói ${activeOrder?.planName}`}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isPaidSuccess
                  ? "Hệ thống đã nhận được tiền và kích hoạt hạn mức mới."
                  : "Mở ứng dụng Ngân hàng hoặc MoMo quét mã chuyển khoản."}
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleCloseModal} size="small">
            <Close sx={{ fontSize: 20 }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2.5 }}>
          {isPaidSuccess ? (
            /* MÀN HÌNH CHÚC MỪNG KHI TIỀN VÀO THÀNH CÔNG */
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  display: "grid",
                  placeItems: "center",
                  mx: "auto",
                  mb: 2,
                  boxShadow: "0 8px 20px rgba(5, 150, 105, 0.2)",
                }}
              >
                <CheckCircle sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" fontWeight={900} color="#1e293b" mb={0.5}>
                Thanh toán thành công!
              </Typography>
              <Typography variant="body2" color="text.secondary" maxWidth={400} mx="auto" mb={2.5}>
                Hệ thống MB Bank đã ghi nhận số tiền{" "}
                <strong>{formatCurrency(activeOrder?.amount)}</strong>. Tài khoản của bạn đã được nâng cấp lên gói{" "}
                <strong>{activeOrder?.planName}</strong> với đầy đủ quyền lợi AI!
              </Typography>
              <CircularProgress size={22} sx={{ color: "#059669" }} />
              <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                Đang chuyển về trang tổng quan...
              </Typography>
            </Box>
          ) : (
            /* BỐ CỤC 2 CỘT GỌN GÀNG, BỎ KHOẢNG TRẮNG THỪA */
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "230px 1fr" },
                gap: 2.5,
                alignItems: "start",
              }}
            >
              {/* CỘT TRÁI: ẢNH MÃ QR VIETQR GỌN ĐẸP */}
              <Box sx={{ textAlign: "center" }}>
                {activeOrder?.qrUrl && (
                  <Box
                    component="img"
                    src={activeOrder.qrUrl}
                    alt="Mã VietQR Thanh Toán"
                    sx={{
                      width: "100%",
                      maxWidth: 230,
                      height: "auto",
                      borderRadius: 2.5,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
                      bgcolor: "#ffffff",
                      display: "block",
                      mx: "auto",
                    }}
                  />
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1, fontSize: "0.72rem", lineHeight: 1.3 }}>
                  Quét bằng app Ngân hàng hoặc MoMo. Số tiền & nội dung điền tự động.
                </Typography>
              </Box>

              {/* CỘT PHẢI: BẢNG CHI TIẾT THANH TOÁN (ĐÃ BỎ TEXT LẮNG NGHE, CHẠY NGẦM) */}
              <Box>
                <Box sx={{ mb: 1.5, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    Số tiền cần thanh toán:
                  </Typography>
                  <Typography variant="h5" fontWeight={900} color="#2563eb">
                    {formatCurrency(activeOrder?.amount)}
                    <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      / tháng
                    </Typography>
                  </Typography>
                </Box>

                {/* KHUNG THÔNG TIN CHUYỂN KHOẢN GỌN GÀNG */}
                <Stack spacing={1} sx={{ bgcolor: "#f8fafc", p: 1.8, borderRadius: 2.5, border: "1px solid #e2e8f0" }}>
                  {/* Ngân hàng */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Ngân hàng:</Typography>
                    <Typography variant="body2" fontWeight={700} color="#1e293b" fontSize="0.82rem">{activeOrder?.bankName}</Typography>
                  </Stack>
                  <Divider sx={{ borderColor: "#edf2f7" }} />

                  {/* Số tài khoản */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Số tài khoản:</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" fontWeight={800} color="#1e293b" fontSize="0.85rem">
                        {activeOrder?.accountNo}
                      </Typography>
                      <Tooltip title={copiedField === "stk" ? "Đã chép!" : "Sao chép"}>
                        <IconButton size="small" onClick={() => handleCopy(activeOrder?.accountNo, "stk")}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Divider sx={{ borderColor: "#edf2f7" }} />

                  {/* Chủ tài khoản */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Chủ tài khoản:</Typography>
                    <Typography variant="body2" fontWeight={700} color="#1e293b" fontSize="0.82rem">{activeOrder?.accountName}</Typography>
                  </Stack>
                  <Divider sx={{ borderColor: "#edf2f7" }} />

                  {/* Số tiền */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Số tiền chuyển:</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="body2" fontWeight={800} color="error.main" fontSize="0.85rem">
                        {formatCurrency(activeOrder?.amount)}
                      </Typography>
                      <Tooltip title={copiedField === "amount" ? "Đã chép!" : "Sao chép"}>
                        <IconButton size="small" onClick={() => handleCopy(String(Number(activeOrder?.amount) || 0), "amount")}>
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                  <Divider sx={{ borderColor: "#edf2f7" }} />

                  {/* Nội dung chuyển khoản */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">Nội dung CK:</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Chip
                        label={activeOrder?.transferContent}
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: "#eff6ff", color: "#1d4ed8", fontSize: "0.8rem", letterSpacing: 0.5, height: 24 }}
                      />
                      <Tooltip title={copiedField === "memo" ? "Đã chép!" : "Sao chép"}>
                        <IconButton
                          size="small"
                          onClick={() => handleCopy(activeOrder?.transferContent, "memo")}
                        >
                          <ContentCopy sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          )}
        </DialogContent>

        {!isPaidSuccess && (
          <DialogActions sx={{ px: 2.5, py: 1.5, bgcolor: "#f8fafc", borderTop: "1px solid #f1f5f9", justifyContent: "space-between" }}>
            <Button onClick={handleCloseModal} sx={{ textTransform: "none", fontWeight: 600, color: "text.secondary" }}>
              Đóng
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSimulatePayment}
              disabled={simulating}
              startIcon={simulating ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                px: 2.5,
                py: 0.8,
                borderRadius: 2.5,
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              }}
            >
              {simulating ? "Đang kích hoạt..." : "Tôi đã chuyển khoản (Kích hoạt ngay)"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
}