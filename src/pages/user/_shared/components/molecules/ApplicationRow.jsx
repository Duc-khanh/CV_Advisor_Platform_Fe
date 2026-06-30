/**
 * ApplicationRow - Hàng hiển thị thông tin ứng tuyển (molecule)
 */

import React from "react";
import { TableRow, TableCell, Box, Typography, Button, Stack } from "@mui/material";
import { ApplicationStatusBadge } from "../atoms";

export const ApplicationRow = ({
  application,
  job,
  onViewDetail,
  onCancel,
}) => {
  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "#f8fafc" },
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <TableCell sx={{ py: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight="600" color="#0f172a">
            {job?.title || "Công việc"}
          </Typography>
          <Typography variant="caption" color="#64748b">
            {job?.companyName}
          </Typography>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Typography variant="body2" color="#64748b">
          {new Date(application.applyDate).toLocaleDateString("vi-VN")}
        </Typography>
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <ApplicationStatusBadge status={application.status} />
      </TableCell>

      <TableCell sx={{ py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onViewDetail?.(application.jobId)}
            sx={{
              textTransform: "none",
              borderColor: "#e2e8f0",
              color: "#0f172a",
              fontSize: "0.75rem",
            }}
          >
            Chi tiết
          </Button>
          {application.status === "PENDING" && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onCancel?.(application.applicationId)}
              sx={{
                textTransform: "none",
                fontSize: "0.75rem",
              }}
            >
              Hủy
            </Button>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
};
