import React from 'react';
import { Grid, Box } from '@mui/material';
import { Users, UserPlus, AlertCircle, DollarSign } from 'lucide-react';
import StatCard from './StatCard'; // Import component MUI bạn vừa tạo
import AdminFeatureSection from './AdminFeatureSection';
import AdminQuickActions from './AdminQuickActions';

const AdminHome = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Top Stats - Sử dụng Grid của MUI để quản lý layout */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tổng Người dùng" 
            value="1,250" 
            icon={<Users size={24} />} 
            color="#3b82f6" // Mã màu xanh (blue-500)
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Tuyển dụng mới" 
            value="45" 
            icon={<UserPlus size={24} />} 
            color="#10b981" // Mã màu xanh lá (emerald-500)
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Báo cáo lỗi" 
            value="12" 
            icon={<AlertCircle size={24} />} 
            color="#f43f5e" // Mã màu hồng đỏ (rose-500)
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="Doanh thu" 
            value="$12,400" 
            icon={<DollarSign size={24} />} 
            color="#f59e0b" // Mã màu cam (orange-500)
          />
        </Grid>
      </Grid>

      {/* Các Section bên dưới */}
      <AdminFeatureSection />
      <AdminQuickActions />
    </Box>
  );
};

export default AdminHome;