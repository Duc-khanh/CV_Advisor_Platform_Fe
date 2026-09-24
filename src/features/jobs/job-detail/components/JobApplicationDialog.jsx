import { Box, CircularProgress, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import { AppIconButton } from "../../../../shared/components";
import useJobApplication from "../hooks/useJobApplication";
import ApplicationAiResult from "./ApplicationAiResult";
import ApplicationForm from "./ApplicationForm";

export default function JobApplicationDialog({ open, onClose, job, jobId }) {
  const application = useJobApplication({ open, onClose, job, jobId });

  return (
    <Dialog
      open={open}
      onClose={application.close}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: application.submit,
        sx: { borderRadius: 3, maxHeight: "95vh" },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h6" fontWeight={700} component="span">
          Ứng tuyển <Box component="span" sx={{ color: "primary.main" }}>{job.title}</Box>
        </Typography>
        <AppIconButton label="Đóng form ứng tuyển" icon={<Close />} onClick={application.close} />
      </DialogTitle>

      <DialogContent dividers sx={{ p: { xs: 3, md: 4 } }}>
        {application.evaluating ? (
          <Box sx={{ py: 6, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6" fontWeight={600}>Đang ứng tuyển và phân tích CV...</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
              Hệ thống AI đang đánh giá mức độ phù hợp. Vui lòng đợi trong giây lát.
            </Typography>
          </Box>
        ) : application.feedback ? (
          <ApplicationAiResult feedback={application.feedback} onDone={application.close} />
        ) : (
          <ApplicationForm
            cv={application.cv}
            formData={application.formData}
            onFormChange={application.setFormData}
            onCancel={application.close}
            applying={application.applying}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
