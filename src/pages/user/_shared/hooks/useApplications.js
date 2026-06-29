/**
 * useApplications Hook - Quản lý logic ứng tuyển
 */

import { useState, useCallback, useEffect } from "react";
import { jobService } from "../../services/user";
import { useToast } from "../../contexts/ToastContext";

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { toast } = useToast();

  // Fetch danh sách ứng tuyển
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = statusFilter !== "ALL" ? { status: statusFilter } : {};
      const data = await jobService.getMyApplications(params);
      setApplications(data.content || data.applications || data || []);
    } catch (err) {
      const message =
        err.response?.data?.message || "Lỗi khi tải danh sách ứng tuyển";
      setError(message);
      toast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  // Nộp đơn ứng tuyển
  const applyJob = useCallback(
    async (jobId, data) => {
      try {
        const result = await jobService.applyJob(jobId, data);
        toast({ type: "success", message: "Ứng tuyển thành công!" });
        await fetchApplications();
        return result;
      } catch (err) {
        const message =
          err.response?.data?.message || "Lỗi khi ứng tuyển công việc";
        toast({ type: "error", message });
        throw err;
      }
    },
    [toast, fetchApplications]
  );

  // Fetch applications on mount and when filter changes
  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    applyJob,
    refetch: fetchApplications,
  };
};
