/**
 * InterviewTable.jsx
 * Bảng danh sách lịch phỏng vấn với các cột cân đối, căn chỉnh chuẩn xác và thẩm mỹ cao.
 */
import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Avatar,
  Chip,
  Tooltip,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  Edit,
  Delete,
  Videocam,
  LocationOn,
  AccessTime,
  RateReview,
} from '@mui/icons-material';
import {
  INTERVIEW_STATUS_LABELS,
  INTERVIEW_STATUS_COLOR,
} from '../../../features/interviews/interviewConstants';
import { formatDateTime } from '../../../features/interviews/interviewHelpers';

const HEAD_CELLS = [
  { id: 'stt',         label: 'STT',                   width: '5%',  minWidth: 50,  align: 'center' },
  { id: 'candidate',   label: 'Ứng viên',              width: '20%', minWidth: 180, align: 'left' },
  { id: 'job',         label: 'Vị trí & Vòng',         width: '22%', minWidth: 200, align: 'left' },
  { id: 'schedule',    label: 'Thời gian & Hình thức', width: '18%', minWidth: 175, align: 'left' },
  { id: 'interviewer', label: 'Người phỏng vấn',       width: '13%', minWidth: 135, align: 'left' },
  { id: 'status',      label: 'Trạng thái',            width: '11%', minWidth: 110, align: 'center' },
  { id: 'result',      label: 'Kết quả',               width: '11%', minWidth: 105, align: 'center' },
  { id: 'actions',     label: 'Thao tác',              width: '10%', minWidth: 105, align: 'center' },
];

export default function InterviewTable({
  interviews = [],
  loading = false,
  total = 0,
  page = 0,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onFeedback,
}) {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 2.5,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        }}
      >
        <CircularProgress sx={{ color: '#0ea5e9' }} />
      </Paper>
    );
  }

  if (interviews.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2.5,
          border: '1px solid #e2e8f0',
          bgcolor: '#ffffff',
        }}
      >
        <Typography variant="h6" color="#64748b" fontWeight={700} mb={1}>
          Chưa có lịch phỏng vấn nào
        </Typography>
        <Typography variant="body2" color="#94a3b8">
          Hãy nhấn nút "Lên lịch mới" hoặc chuyển đổi bộ lọc tìm kiếm để xem danh sách.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2.5,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        bgcolor: '#ffffff',
      }}
    >
      <Box
        sx={{
          overflowX: 'auto',
          width: '100%',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 3 },
        }}
      >
        <Table sx={{ minWidth: 1050, tableLayout: 'auto' }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              {HEAD_CELLS.map((cell) => (
                <TableCell
                  key={cell.id}
                  align={cell.align}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: '#475569',
                    py: 1.5,
                    px: 1.8,
                    width: cell.width,
                    minWidth: cell.minWidth,
                    whiteSpace: 'nowrap',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {interviews.map((item, index) => {
              const scheduledTime = item.scheduledAt || item.startTime;
              const roundText = item.round || item.roundName || 'Vòng phỏng vấn';
              const interviewType = (item.type || item.interviewType || 'ONLINE').toUpperCase();
              const interviewer = item.interviewer || item.interviewerName || 'Chưa phân công';
              const meetingLink = item.meetingLink || (interviewType === 'ONLINE' ? item.locationOrLink : null);
              const location = item.location || (interviewType !== 'ONLINE' ? item.locationOrLink : 'Tại văn phòng');

              return (
                <TableRow
                  key={item.id}
                  hover
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* STT */}
                  <TableCell align="center" sx={{ py: 1.8, px: 1, color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>

                  {/* Ứng viên */}
                  <TableCell align="left" sx={{ py: 1.8, px: 1.8 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: '#0ea5e9',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {item.candidateName ? item.candidateName.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="#1e293b"
                          noWrap
                          sx={{ maxWidth: 170 }}
                        >
                          {item.candidateName || 'Chưa có tên'}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="#64748b"
                          display="block"
                          noWrap
                          sx={{ maxWidth: 170 }}
                        >
                          {item.candidateEmail || '—'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Vị trí tuyển & Vòng */}
                  <TableCell align="left" sx={{ py: 1.8, px: 1.8 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="#1e293b"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        maxWidth: 240,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.jobTitle || '—'}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="#0284c7"
                      fontWeight={600}
                      sx={{
                        display: 'block',
                        mt: 0.4,
                        maxWidth: 240,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {roundText}
                    </Typography>
                  </TableCell>

                  {/* Thời gian & Hình thức */}
                  <TableCell align="left" sx={{ py: 1.8, px: 1.8, whiteSpace: 'nowrap' }}>
                    <Stack spacing={0.5}>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        <AccessTime sx={{ fontSize: 15, color: '#64748b' }} />
                        <Typography variant="body2" fontWeight={600} color="#334155" fontSize="0.84rem">
                          {formatDateTime(scheduledTime)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.8} alignItems="center">
                        {interviewType === 'ONLINE' ? (
                          <>
                            <Videocam sx={{ fontSize: 16, color: '#2563eb' }} />
                            {meetingLink ? (
                              <Typography
                                component="a"
                                href={meetingLink.startsWith('http') ? meetingLink : `https://${meetingLink}`}
                                target="_blank"
                                rel="noreferrer"
                                variant="caption"
                                sx={{
                                  color: '#2563eb',
                                  textDecoration: 'underline',
                                  fontWeight: 600,
                                  maxWidth: 140,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Tham gia Online
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="#2563eb" fontWeight={600}>
                                Online
                              </Typography>
                            )}
                          </>
                        ) : (
                          <>
                            <LocationOn sx={{ fontSize: 16, color: '#ea580c' }} />
                            <Typography
                              variant="caption"
                              color="#64748b"
                              sx={{
                                maxWidth: 140,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {location}
                            </Typography>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </TableCell>

                  {/* Người phỏng vấn */}
                  <TableCell align="left" sx={{ py: 1.8, px: 1.8, whiteSpace: 'nowrap' }}>
                    <Typography
                      variant="body2"
                      color="#334155"
                      fontWeight={500}
                      fontSize="0.85rem"
                      sx={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {interviewer}
                    </Typography>
                  </TableCell>

                  {/* Trạng thái - Căn giữa cân đối */}
                  <TableCell align="center" sx={{ py: 1.8, px: 1.5, whiteSpace: 'nowrap' }}>
                    <Chip
                      label={INTERVIEW_STATUS_LABELS[item.status] || item.status}
                      color={INTERVIEW_STATUS_COLOR[item.status] || 'default'}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: '0.74rem', borderRadius: 1.5 }}
                    />
                  </TableCell>

                  {/* Kết quả - Căn giữa cân đối */}
                  <TableCell align="center" sx={{ py: 1.8, px: 1.5, whiteSpace: 'nowrap' }}>
                    {item.status === 'COMPLETED' ? (
                      <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Chip
                          label={item.result === 'PASSED' ? 'ĐẠT' : item.result === 'FAILED' ? 'CHƯA ĐẠT' : 'ĐÃ XONG'}
                          size="small"
                          color={item.result === 'PASSED' ? 'success' : item.result === 'FAILED' ? 'error' : 'default'}
                          sx={{ fontWeight: 700, fontSize: '0.72rem' }}
                        />
                        {item.score && (
                          <Typography variant="caption" display="block" color="#64748b" mt={0.3}>
                            Điểm: {item.score}/10
                          </Typography>
                        )}
                      </Box>
                    ) : (
                      <Chip
                        label="Chưa diễn ra"
                        size="small"
                        sx={{
                          bgcolor: '#f1f5f9',
                          color: '#64748b',
                          fontWeight: 600,
                          fontSize: '0.74rem',
                          borderRadius: 1.5,
                        }}
                      />
                    )}
                  </TableCell>

                  {/* Thao tác - Căn giữa cân đối */}
                  <TableCell align="center" sx={{ py: 1.8, px: 1.5, whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      {/* Đánh giá kết quả */}
                      <Tooltip title="Đánh giá kết quả phỏng vấn">
                        <IconButton
                          size="small"
                          onClick={() => onFeedback?.(item)}
                          sx={{ color: '#0284c7', '&:hover': { bgcolor: 'rgba(2,132,199,0.1)' } }}
                        >
                          <RateReview sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Sửa lịch */}
                      <Tooltip title="Chỉnh sửa lịch">
                        <IconButton
                          size="small"
                          onClick={() => onEdit?.(item)}
                          sx={{ color: '#2563eb', '&:hover': { bgcolor: '#eff6ff' } }}
                        >
                          <Edit sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Hủy / Xóa */}
                      <Tooltip title="Hủy / Xóa lịch">
                        <IconButton
                          size="small"
                          onClick={() => onDelete?.(item)}
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>

      {/* Phân trang */}
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => onPageChange?.(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange?.(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 20, 50]}
        labelRowsPerPage="Dòng trên trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`}
        sx={{
          borderTop: '1px solid #e2e8f0',
          '& .MuiTablePagination-toolbar': { minHeight: 46 },
        }}
      />
    </Paper>
  );
}
