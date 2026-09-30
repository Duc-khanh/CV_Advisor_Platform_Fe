import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { CloudUpload, Description } from "@mui/icons-material";

export default function CvSourceSelector({
  source,
  onSourceChange,
  savedCvs,
  selectedCvId,
  onSelectedCvChange,
  file,
  onFileChange,
  loading,
  error,
}) {
  const chooseSaved = () => {
    onSourceChange("saved");
    onFileChange(null);
    if (!selectedCvId) onSelectedCvChange(savedCvs[0]?.cvId || "");
  };

  const chooseUpload = () => {
    onSourceChange("upload");
    onSelectedCvChange("");
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.25 }}>
        Chọn CV ứng tuyển
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 1.5 }}>
        <Button
          fullWidth
          variant={source === "saved" ? "contained" : "outlined"}
          startIcon={<Description />}
          disabled={loading || savedCvs.length === 0}
          onClick={chooseSaved}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          CV đã tải lên ({savedCvs.length})
        </Button>
        <Button
          fullWidth
          variant={source === "upload" ? "contained" : "outlined"}
          startIcon={<CloudUpload />}
          onClick={chooseUpload}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Tải CV mới
        </Button>
      </Stack>

      {error && <Alert severity="warning" sx={{ mb: 1.5 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={28} />
        </Box>
      ) : source === "saved" ? (
        <RadioGroup
          value={String(selectedCvId)}
          onChange={(event) => onSelectedCvChange(event.target.value)}
          sx={{ gap: 1, maxHeight: 210, overflowY: "auto", pr: 0.5 }}
        >
          {savedCvs.map((cv) => {
            const selected = String(cv.cvId) === String(selectedCvId);
            return (
              <Paper
                key={cv.cvId}
                variant="outlined"
                sx={{
                  borderColor: selected ? "#2563eb" : "#e2e8f0",
                  bgcolor: selected ? "#eff6ff" : "#fff",
                  borderRadius: 2,
                  transition: "0.2s",
                }}
              >
                <FormControlLabel
                  value={String(cv.cvId)}
                  control={<Radio size="small" />}
                  sx={{ m: 0, px: 1.5, py: 1, width: "100%", alignItems: "flex-start" }}
                  label={
                    <Box sx={{ pt: 0.25 }}>
                      <Typography variant="body2" fontWeight={700}>
                        {cv.fileName || "CV của bạn"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {cv.fileSize ? `${(cv.fileSize / 1024 / 1024).toFixed(1)} MB` : "Không rõ dung lượng"}
                        {cv.createdAt ? ` • Tải lên ${new Date(cv.createdAt).toLocaleDateString("vi-VN")}` : ""}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            );
          })}
        </RadioGroup>
      ) : (
        <Box sx={{ border: "2px dashed #2563eb", borderRadius: 2, p: 2, textAlign: "center", bgcolor: "#f0fdf4" }}>
          <CloudUpload sx={{ color: "#2563eb", mb: 1 }} />
          <Typography variant="body2" fontWeight={600}>Tải lên CV (.pdf, .doc, .docx)</Typography>
          <Button variant="outlined" size="small" component="label" sx={{ mt: 1 }}>
            Chọn file
            <input
              hidden
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
          </Button>
          {file && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "#10b981", fontWeight: 600 }}>
              {file.name}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
}
