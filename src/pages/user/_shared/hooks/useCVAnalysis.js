/**
 * useCVAnalysis Hook - Quản lý logic đánh giá CV
 */

import { useState, useCallback } from "react";
import { cvService } from "../../services/user";
import { useToast } from "../../contexts/ToastContext";

export const useCVAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Đánh giá CV
  const evaluateCV = useCallback(
    async (file, targetRole = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await cvService.evaluateCV(file, targetRole);
        setAnalysis(data);
        toast({
          type: "success",
          message: "Đánh giá CV thành công!",
        });
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Lỗi khi đánh giá CV. Vui lòng thử lại.";
        setError(message);
        toast({ type: "error", message });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Phân tích chi tiết CV
  const analyzeCV = useCallback(
    async (file) => {
      setLoading(true);
      setError(null);
      try {
        const data = await cvService.analyzeCV(file);
        setAnalysis(data);
        toast({
          type: "success",
          message: "Phân tích CV thành công!",
        });
        return data;
      } catch (err) {
        const message =
          err.response?.data?.message ||
          "Lỗi khi phân tích CV. Vui lòng thử lại.";
        setError(message);
        toast({ type: "error", message });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  // Reset
  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    loading,
    error,
    evaluateCV,
    analyzeCV,
    reset,
  };
};
