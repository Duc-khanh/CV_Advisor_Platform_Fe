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
        label="Họ và tên *"
        fullWidth
        size="small"
        value={formData.fullName}
        onChange={updateField("fullName")}
        required
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Email *"
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
            label="Số điện thoại *"
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
        placeholder="Viết ngắn gọn..."
        value={formData.coverLetter}
        onChange={updateField("coverLetter")}
      />

      <Box>
        <FormControlLabel
          control={<Checkbox size="small" checked={formData.agreeTerms} onChange={updateField("agreeTerms")} color="success" />}
          label={<Typography variant="caption">Tôi đồng ý với điều khoản sử dụng</Typography>}
        />
        <FormControlLabel
          control={<Checkbox size="small" checked={formData.allowAiAnalysis} onChange={updateField("allowAiAnalysis")} color="primary" />}
          label={<Typography variant="caption">Cho phép AI phân tích CV</Typography>}
        />
      </Box>

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>Hủy</Button>
        <Button type="submit" variant="contained" disabled={applying}>
          {applying ? "Đang xử lý..." : "Nộp hồ sơ"}
        </Button>
      </Stack>
    </Stack>
  );
}
