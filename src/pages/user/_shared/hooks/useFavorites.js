/**
 * useFavorites Hook - Quản lý logic danh sách yêu thích
 */

import { useState, useCallback, useEffect } from "react";
import { jobService } from "../../services/user";
import { useToast } from "../../contexts/ToastContext";

export const useFavorites = () => {
  const [favoriteJobs, setFavoriteJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const { toast } = useToast();

  // Fetch danh sách yêu thích
  const fetchFavorites = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getFavoriteJobs();
      const jobs = data.content || data.jobs || data || [];
      setFavoriteJobs(jobs);
      setFavoriteIds(new Set(jobs.map((j) => j.jobId)));
    } catch (err) {
      const message =
        err.response?.data?.message || "Lỗi khi tải danh sách yêu thích";
      setError(message);
      toast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Toggle yêu thích
  const toggleFavorite = useCallback(
    async (jobId) => {
      try {
        if (favoriteIds.has(jobId)) {
          // Remove from favorite
          await jobService.removeFromFavorite(jobId);
          setFavoriteJobs((prev) => prev.filter((j) => j.jobId !== jobId));
          setFavoriteIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(jobId);
            return newSet;
          });
          toast({ type: "success", message: "Đã xóa khỏi danh sách yêu thích" });
        } else {
          // Add to favorite
          await jobService.addToFavorite(jobId);
          setFavoriteIds((prev) => new Set([...prev, jobId]));
          toast({ type: "success", message: "Đã thêm vào danh sách yêu thích" });
        }
      } catch (err) {
        const message = err.response?.data?.message || "Lỗi khi cập nhật yêu thích";
        toast({ type: "error", message });
      }
    },
    [favoriteIds, toast]
  );

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, []);

  return {
    favoriteJobs,
    favoriteIds,
    loading,
    error,
    toggleFavorite,
    isFavorite: (jobId) => favoriteIds.has(jobId),
    refetch: fetchFavorites,
  };
};
