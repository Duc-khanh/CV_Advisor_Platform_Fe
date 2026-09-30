import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CvSourceSelector from "./CvSourceSelector";

export default function ApplicationForm({
  cv,
  formData,
  onFormChange,
  onCancel,
  applying,
}) {
  const updateField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    onFormChange((current) => ({ ...current, [field]: value }));
  };

  return (
    <Stack spacing={2.5}>
      <CvSourceSelector {...cv} />

      <TextField
        label="Họ và tên"
        fullWidth
        size="small"
        value={formData.fullName}
        onChange={updateField("fullName")}
        required
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            value={formData.email}
            onChange={updateField("email")}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Số điện thoại"
            fullWidth
            size="small"
            value={formData.phone}
            onChange={updateField("phone")}
            required
          />
        </Grid>
      </Grid>

      <TextField
        label="Thư giới thiệu"
        multiline
        rows={3}
        fullWidth
        placeholder="Viết ngắn gọn lý do bạn phù hợp với vị trí này..."
        value={formData.coverLetter}
        onChange={updateField("coverLetter")}
      />

      <Stack spacing={0.5}>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={formData.agreeTerms}
              onChange={updateField("agreeTerms")}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#334155" }}>
              Tôi đồng ý với{" "}
              <Box
                component="a"
                href="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  color: "#2563eb",
                  fontWeight: 700,
                  textDecoration: "underline",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#1d4ed8",
                  },
                }}
              >
                Điều khoản dịch vụ & Chính sách bảo mật
              </Box>
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={formData.allowAiAnalysis}
              onChange={updateField("allowAiAnalysis")}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: "0.85rem", color: "#334155" }}>
              Cho phép AI phân tích mức độ phù hợp của CV
            </Typography>
          }
        />
      </Stack>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ pt: 1 }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 2.5,
          }}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={applying || !formData.agreeTerms}
          sx={{
            textTransform: "none",
            fontWeight: 800,
            borderRadius: 2,
            px: 3,
            bgcolor: "#2563eb",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          {applying ? "Đang xử lý..." : "Nộp hồ sơ"}
        </Button>
      </Stack>
    </Stack>
  );
}
