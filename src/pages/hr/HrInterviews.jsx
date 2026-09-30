/**
 * HrInterviews.jsx
 * Trang chính Quản lý Lịch phỏng vấn (Dành cho HR)
 */
import React, { useState, useCallback } from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { EventNote } from '@mui/icons-material';

import HRLayout from '../../layouts/HRLayout';
import { useToast } from '../../contexts/ToastContext';
import { useInterviews } from '../../hooks/interview/useInterviews';

import InterviewStatsBar from '../../components/hr/interviews/InterviewStatsBar';
import InterviewFilterBar from '../../components/hr/interviews/InterviewFilterBar';
import InterviewTable from '../../components/hr/interviews/InterviewTable';
import InterviewCalendarView from '../../components/hr/interviews/InterviewCalendarView';
import InterviewFormModal from '../../components/hr/interviews/InterviewFormModal';
import InterviewFeedbackModal from '../../components/hr/interviews/InterviewFeedbackModal';
import ConfirmDialog from '../../components/dialogs/ConfirmDialog';

export default function HrInterviews() {
  const showToast = useToast();

  const {
    interviews,
    candidates,
    stats,
    totalElements,
    loading,
    saving,
    filters,
    fetchInterviews,
    updateFilter,
    handleCreate,
    handleUpdate,
    handleStatusChange,
    handleFeedback,
    handleDelete,
  } = useInterviews();

  // State giao diện
  const [viewMode, setViewMode] = useState('list'); // "list" | "calendar"
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackInterview, setFeedbackInterview] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);

  // Bộ lọc
  const handleKeywordChange = useCallback(
    (value) => updateFilter('keyword', value),
    [updateFilter]
  );
  const handleStatusFilterChange = useCallback(
    (value) => updateFilter('status', value),
    [updateFilter]
  );
  const handlePageChange = useCallback(
    (newPage) => updateFilter('page', newPage),
    [updateFilter]
  );
  const handleRowsPerPageChange = useCallback(
    (newRows) => {
      updateFilter('size', newRows);
      updateFilter('page', 0);
    },
    [updateFilter]
  );

  // Form Lên lịch
  const openCreateForm = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEditForm = (interview) => {
    setEditingItem(interview);
    setFormOpen(true);
  };

  const handleFormSubmit = async (payload) => {
    try {
      if (editingItem) {
        await handleUpdate(editingItem.id, payload);
        showToast('Cập nhật lịch phỏng vấn thành công!', 'success');
      } else {
        await handleCreate(payload);
        showToast('Tạo lịch phỏng vấn và gửi lời mời thành công!', 'success');
      }
      setFormOpen(false);
      setEditingItem(null);
    } catch (err) {
      showToast(err?.message || 'Thao tác thất bại', 'error');
    }
  };

  // Cập nhật trạng thái
  const handleStatusChangeWrapper = async (id, status) => {
    try {
      await handleStatusChange(id, status);
      showToast('Cập nhật trạng thái phỏng vấn thành công!', 'success');
    } catch (err) {
      showToast(err?.message || 'Cập nhật trạng thái thất bại', 'error');
    }
  };

  // Đánh giá
  const openFeedback = (interview) => {
    setFeedbackInterview(interview);
    setFeedbackOpen(true);
  };

  const handleFeedbackSubmit = async (id, payload) => {
    try {
      await handleFeedback(id, payload);
      showToast('Lưu kết quả đánh giá phỏng vấn thành công!', 'success');
      setFeedbackOpen(false);
      setFeedbackInterview(null);
    } catch (err) {
      showToast(err?.message || 'Lưu đánh giá thất bại', 'error');
    }
  };

  // Hủy / Xóa
  const openDelete = (interview) => {
    setDeletingItem(interview);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    try {
      await handleDelete(deletingItem.id);
      showToast('Đã hủy lịch phỏng vấn thành công.', 'success');
    } catch (err) {
      showToast(err?.message || 'Hủy lịch thất bại', 'error');
    } finally {
      setDeleteOpen(false);
      setDeletingItem(null);
    }
  };

  // Click sự kiện trên lịch
  const handleCalendarEventClick = (interview) => {
    openEditForm(interview);
  };

  return (
    <HRLayout>
      <Box sx={{ pb: 4, width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
        {/* Header tiêu đề */}
        <Stack direction="row" spacing={1.8} alignItems="center" mb={2.5} flexWrap="wrap">
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '13px',
              background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(14,165,233,0.25)',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <EventNote sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#1e293b" lineHeight={1.2}>
              Lịch phỏng vấn & Hẹn gặp
            </Typography>
            <Typography variant="body2" color="#64748b" mt={0.3}>
              Lên lịch hẹn, gửi thư mời phỏng vấn tự động và theo dõi đánh giá kết quả ứng viên
            </Typography>
          </Box>
        </Stack>

        {/* Thẻ thống kê */}
        <InterviewStatsBar stats={stats} loading={loading} />

        {/* Thanh lọc & Nút thao tác */}
        <InterviewFilterBar
          keyword={filters.keyword}
          onKeywordChange={handleKeywordChange}
          status={filters.status}
          onStatusChange={handleStatusFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateClick={openCreateForm}
        />

        {/* Nội dung danh sách / Lịch */}
        {viewMode === 'list' ? (
          <InterviewTable
            interviews={interviews}
            loading={loading}
            total={totalElements}
            page={filters.page}
            rowsPerPage={filters.size ?? 10}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            onEdit={openEditForm}
            onDelete={openDelete}
            onFeedback={openFeedback}
            onStatusChange={handleStatusChangeWrapper}
          />
        ) : (
          <InterviewCalendarView
            interviews={interviews}
            onEventClick={handleCalendarEventClick}
          />
        )}
      </Box>

      {/* Modal tạo mới / sửa */}
      <InterviewFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleFormSubmit}
        editingItem={editingItem}
        candidates={candidates}
        saving={saving}
      />

      {/* Modal đánh giá feedback */}
      <InterviewFeedbackModal
        open={feedbackOpen}
        onClose={() => {
          setFeedbackOpen(false);
          setFeedbackInterview(null);
        }}
        onSubmit={handleFeedbackSubmit}
        interview={feedbackInterview}
        saving={saving}
      />

      {/* Hộp thoại xác nhận hủy */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        type="danger"
        title="Hủy lịch phỏng vấn?"
        message={`Bạn có chắc chắn muốn hủy lịch phỏng vấn của ứng viên "${deletingItem?.candidateName || 'này'}" không? Hành động này sẽ thay đổi trạng thái và không thể hoàn tác.`}
        confirmText="Hủy lịch này"
        cancelText="Giữ lại"
      />
    </HRLayout>
  );
}
