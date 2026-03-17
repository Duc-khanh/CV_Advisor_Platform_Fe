import { Grid } from "@mui/material";
import { People, AssignmentTurnedIn, TrendingUp } from "@mui/icons-material";
import StatCard from "../admin/StatCard";
import HRFeatureSection from "./HRFeatureSection";
import HRQuickActions from "./HRQuickActions";
import HRLayout from "../../components/HRLayout";

export default function HrDashboard() {
  return (
    <HRLayout>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tin đang tuyển" value="12" icon={<AssignmentTurnedIn />} color="#2d6a4f" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Ứng viên mới" value="156" icon={<People />} color="#0077b6" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Lịch phỏng vấn" value="8" icon={<TrendingUp />} color="#f59e0b" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tỷ lệ đạt" value="24%" icon={<TrendingUp />} color="#7209b7" />
        </Grid>
      </Grid>

      <HRFeatureSection />
      <HRQuickActions />
    </HRLayout>
  );
}
