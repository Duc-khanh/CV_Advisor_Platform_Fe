/**
 * useInterviews.js
 * Custom hook quản lý state, search, filter và CRUD cho tính năng Lịch phỏng vấn
 */
import { useState, useEffect, useCallback } from "react";
import {
  getInterviews,
  getInterviewCandidates,
  createInterview,
  updateInterview,
  updateInterviewStatus,
  submitInterviewFeedback,
  deleteInterview,
  getInterviewStats,
} from "../../services/interview/interviewService";

const DEFAULT_FILTERS = {
  page: 0,
  size: 10,
  status: "ALL",
  keyword: "",
  jobId: "",
};

export function useInterviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [stats, setStats] = useState({
    todayCount: 0,
    upcomingCount: 0,
    pendingFeedback: 0,
    completedThisMonth: 0,
  });
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Lấy danh sách phỏng vấn
  const fetchInterviews = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const merged = { ...filters, ...params };
      const apiParams = { ...merged };
      if (apiParams.status === "ALL") delete apiParams.status;
      if (!apiParams.keyword) delete apiParams.keyword;
      if (!apiParams.jobId) delete apiParams.jobId;

      const data = await getInterviews(apiParams);

      if (Array.isArray(data)) {
        setInterviews(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else if (data && data.content) {
        setInterviews(data.content);
        setTotalElements(data.totalElements || data.content.length);
        setTotalPages(data.totalPages || 1);
      } else {
        setInterviews([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("fetchInterviews error:", err);
      setError(err?.response?.data?.message || err?.message || "Không thể tải danh sách phỏng vấn");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Lấy danh sách ứng viên có thể lên lịch
  const fetchCandidates = useCallback(async () => {
    try {
      const data = await getInterviewCandidates();
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("fetchCandidates error:", err);
    }
  }, []);

  // Lấy thống kê
  const fetchStats = useCallback(async () => {
    try {
      const data = await getInterviewStats();
      if (data) {
        setStats(data);
      }
    } catch (err) {
      console.warn("fetchStats error:", err);
    }
  }, []);

  // Khởi chạy khi filter thay đổi
  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  useEffect(() => {
    fetchCandidates();
    fetchStats();
  }, [fetchCandidates, fetchStats]);

  // Cập nhật filter
  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "page" ? { page: 0 } : {}),
    }));
  }, []);

  // Tạo mới
  const handleCreate = async (payload) => {
    try {
      setSaving(true);
      const res = await createInterview(payload);
      await fetchInterviews();
      await fetchStats();
      return res;
    } finally {
      setSaving(false);
    }
  };

  // Cập nhật
  const handleUpdate = async (id, payload) => {
    try {
      setSaving(true);
      const res = await updateInterview(id, payload);
      await fetchInterviews();
      await fetchStats();
      return res;
    } finally {
      setSaving(false);
    }
  };

  // Đổi trạng thái
  const handleStatusChange = async (id, status) => {
    try {
      setSaving(true);
      const res = await updateInterviewStatus(id, status);
      await fetchInterviews();
      await fetchStats();
      return res;
    } finally {
      setSaving(false);
    }
  };

  // Nhập đánh giá
  const handleFeedback = async (id, payload) => {
    try {
      setSaving(true);
      const res = await submitInterviewFeedback(id, payload);
      await fetchInterviews();
      await fetchStats();
      return res;
    } finally {
      setSaving(false);
    }
  };

  // Xóa / Hủy
  const handleDelete = async (id) => {
    try {
      setSaving(true);
      const res = await deleteInterview(id);
      await fetchInterviews();
      await fetchStats();
      return res;
    } finally {
      setSaving(false);
    }
  };

  return {
    interviews,
    candidates,
    stats,
    totalElements,
    totalPages,
    loading,
    saving,
    error,
    filters,
    fetchInterviews,
    fetchCandidates,
    fetchStats,
    updateFilter,
    handleCreate,
    handleUpdate,
    handleStatusChange,
    handleFeedback,
    handleDelete,
  };
}