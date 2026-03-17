import { Routes, Route, Navigate } from "react-router-dom";
import UserHome from "./pages/user/UserHome";
import AdminHome from "./pages/admin/AdminHome";
import HrDashboard from "./pages/hr/HrDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./components/AdminLayout";
import HrJobManagement from "./pages/hr/HrJobManagement";
import CompanyApplications from "./pages/hr/CompanyApplications";
import JobDetail from "./pages/user/JobDetail";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import FavoriteJobs from "./pages/user/FavoriteJobs";
import AppliedJobs from "./pages/User/AppliedJobs";
// import Profile from "../pages/admin/Profile";


export default function App() {
  return (
    <Routes>
      {/* Mặc định vào USER */}
      <Route path="/" element={<Navigate to="/user" />} />

      {/* USER – public */}
      <Route path="/user" element={<UserHome />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminLayout><AdminHome /></AdminLayout>} />
      <Route path="/user/job/:id" element={<JobDetail />} />
<Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/user/favorite-jobs" element={<FavoriteJobs />} />
<Route path="/user/applied-jobs" element={<AppliedJobs />} />
 <Route path="applications" element={<CompanyApplications />} />


{/* <Route path="profile" element={<Profile />} /> */}

      {/* Protected */}
    {/* ADMIN */}
<Route
  path="/admin"
  element={
    <ProtectedRoute role="ADMIN">
      <AdminHome />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute role="ADMIN">
      <UserManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/companies"
  element={
    <ProtectedRoute role="ADMIN">
      <div>Quản lý công ty</div>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/stats"
  element={
    <ProtectedRoute role="ADMIN">
      <div>Thống kê hệ thống</div>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/settings"
  element={
    <ProtectedRoute role="ADMIN">
      <div>Cài đặt hệ thống</div>
    </ProtectedRoute>
  }
/>


     <Route
  path="/hr"
  element={
    <ProtectedRoute role="HR">
      <HrDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/hr/jobs"
  element={
    <ProtectedRoute role="HR">
      <HrJobManagement />
    </ProtectedRoute>
  }
/>

<Route
  path="/hr/applications"
  element={
    <ProtectedRoute role="HR">
      <CompanyApplications />
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}
