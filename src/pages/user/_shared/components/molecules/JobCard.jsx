/**
 * JobCard - Card hiển thị thông tin công việc (molecule)
 */

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { getMediaUrl } from "../../../../../utils/urlHelpers";
import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  Business,
} from "@mui/icons-material";
import { JobTypeChip, SalaryDisplay } from "../atoms";

export const JobCard = ({
  job,
  onViewDetail,
  onToggleFavorite,
  isFavorite = false,
  size = "normal",
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        border: "1px solid #e2e8f0",
        "&:hover": {
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        {/* Company Info */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {job.companyLogo && (
            <Box
              component="img"
              src={getMediaUrl(job.companyLogo)}
              alt={job.companyName}
              sx={{
                width: 40,
                height: 40,
                borderRadius: "6px",
                objectFit: "cover",
              }}
            />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="#64748b">
              {job.companyName}
            </Typography>
          </Box>
        </Box>

        {/* Job Title */}
        <Typography
          variant="h6"
          fontWeight="700"
          color="#0f172a"
          mb={1}
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {job.title}
        </Typography>

        {/* Job Meta */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16, color: "#64748b" }} />
            <Typography variant="body2" color="#64748b">
              {job.location}
            </Typography>
          </Box>
          <SalaryDisplay salaryRange={job.salaryRange} />
        </Stack>

        {/* Job Type */}
        <JobTypeChip jobType={job.jobType} size="small" />

        {/* Description */}
        <Typography
          variant="body2"
          color="#64748b"
          sx={{
            mt: 2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            lineHeight: 1.5,
          }}
        >
          {job.description}
        </Typography>
      </CardContent>

      <Divider />

      {/* Actions */}
      <CardActions sx={{ gap: 1, p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          onClick={() => onViewDetail?.(job.jobId)}
          sx={{
            bgcolor: "#2563eb",
            textTransform: "none",
            fontWeight: "600",
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          Xem chi tiết
        </Button>
        <Button
          size="small"
          onClick={() => onToggleFavorite?.(job.jobId)}
          sx={{
            minWidth: 40,
            color: isFavorite ? "#ef4444" : "#cbd5e1",
            "&:hover": { color: "#ef4444" },
          }}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </Button>
      </CardActions>
    </Card>
  );
};
