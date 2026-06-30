/**
 * useJobs Hook - Quản lý logic tìm kiếm và lọc công việc
 */

import { useState, useCallback, useEffect } from "react";
import { jobService } from "../../services/user";
import { useToast } from "../../contexts/ToastContext";

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 12,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    location: "",
    jobType: "",
  });
  const [error, setError] = useState(null);
  const { toast } = useToast();

  // Fetch danh sách công việc
  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.listJobs({
        ...searchParams,
        page: page - 1,
        pageSize: pagination.pageSize,
      });
      setJobs(data.content || data.jobs || []);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        total: data.totalElements || data.total || 0,
      }));
    } catch (err) {
      const message =
        err.response?.data?.message || "Lỗi khi tải danh sách công việc";
      setError(message);
      toast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }, [searchParams, pagination.pageSize, toast]);

  // Update search params và reset page
  const updateSearchParams = useCallback((newParams) => {
    setSearchParams((prev) => ({ ...prev, ...newParams }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (newPage) => {
      fetchJobs(newPage);
    },
    [fetchJobs]
  );

  // Fetch jobs khi search params thay đổi
  useEffect(() => {
    fetchJobs(1);
  }, []);

  return {
    jobs,
    loading,
    error,
    pagination,
    searchParams,
    updateSearchParams,
    handlePageChange,
    refetch: fetchJobs,
  };
};
