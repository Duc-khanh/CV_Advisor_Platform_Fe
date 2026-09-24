import { useEffect, useState } from "react";
import api from "../../../../services/axios";
import { cvService } from "../../../../services/user";
import { useToast } from "../../../../contexts/ToastContext";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  targetLocation: "",
  coverLetter: "",
  agreeTerms: false,
  allowAiAnalysis: true,
};

export default function useJobApplication({ open, onClose, job, jobId }) {
  const showToast = useToast();
  const [source, setSource] = useState("saved");
  const [file, setFile] = useState(null);
  const [savedCvs, setSavedCvs] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState("");
  const [loadingCvs, setLoadingCvs] = useState(false);
  const [cvError, setCvError] = useState("");
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [applying, setApplying] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    let active = true;

    const loadCvs = async () => {
      setLoadingCvs(true);
      setCvError("");
      try {
        const data = await cvService.getUserCV();
        const list = Array.isArray(data)
          ? data
          : (data?.files || data?.cvs || data?.data || (data ? [data] : []));
        const usable = list.filter((cv) => cv?.cvId != null && cv?.fileUrl);
        if (!active) return;
        setSavedCvs(usable);
        setSelectedCvId((current) => usable.some((cv) => String(cv.cvId) === String(current))
          ? current
          : (usable[0]?.cvId || ""));
        if (usable.length === 0) setSource("upload");
      } catch (error) {
        if (!active) return;
        console.error("Lỗi lấy danh sách CV:", error);
        setSavedCvs([]);
        setSelectedCvId("");
        setSource("upload");
        setCvError("Không thể tải danh sách CV đã lưu. Bạn vẫn có thể tải lên CV mới.");
      } finally {
        if (active) setLoadingCvs(false);
      }
    };

    loadCvs();
    return () => { active = false; };
  }, [open]);

  const close = () => {
    setFeedback(null);
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    const savedCv = savedCvs.find((cv) => String(cv.cvId) === String(selectedCvId));
    if (source === "saved" && !savedCv) return showToast("Vui lòng chọn một CV đã lưu", "warning");
    if (source === "upload" && !file) return showToast("Vui lòng tải lên file CV của bạn", "warning");
    if (!formData.agreeTerms) return showToast("Bạn cần đồng ý với điều khoản để tiếp tục", "warning");

    const payload = new FormData();
    if (source === "saved") payload.append("cvId", savedCv.cvId);
    else payload.append("cv", file);
    ["fullName", "email", "phone", "targetLocation", "coverLetter"].forEach((key) => {
      payload.append(key, formData[key]);
    });

    try {
      setApplying(true);
      await api.post(`/api/user/jobs/apply/${jobId}`, payload);
      if (!formData.allowAiAnalysis) {
        showToast("Ứng tuyển thành công!", "success");
        close();
        setFile(null);
        return;
      }

      setEvaluating(true);
      try {
        let cvForAi = file;
        if (source === "saved") {
          const blob = await cvService.getCVFile(savedCv.cvId);
          cvForAi = new File([blob], savedCv.fileName || "cv.pdf", {
            type: savedCv.mimeType || blob.type || "application/pdf",
          });
        }
        const aiPayload = new FormData();
        aiPayload.append("cv", cvForAi);
        aiPayload.append("jobDescription", `Title: ${job.title}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.candidateRequirements}`);
        const response = await api.post("/api/v1/ai/evaluate-cv", aiPayload);
        setFeedback(response.data);
        showToast("Ứng tuyển thành công!", "success");
      } catch (error) {
        console.error("Lỗi AI:", error);
        showToast("Ứng tuyển thành công nhưng AI chưa thể phân tích CV.", "warning");
        close();
        setFile(null);
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Ứng tuyển thất bại", "error");
    } finally {
      setApplying(false);
      setEvaluating(false);
    }
  };

  return {
    applying, evaluating, feedback, formData, setFormData, submit, close,
    cv: {
      source, onSourceChange: setSource, savedCvs, selectedCvId,
      onSelectedCvChange: setSelectedCvId, file, onFileChange: setFile,
      loading: loadingCvs, error: cvError,
    },
  };
}
