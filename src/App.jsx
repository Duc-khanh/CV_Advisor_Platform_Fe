import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import UserHome from "./pages/user/UserHome";
import AdminHome from "./pages/admin/AdminHome";
import HrDashboard from "./pages/hr/HrDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./layouts/AdminLayout";
import HrJobManagement from "./pages/hr/HrJobManagement";
import CompanyApplications from "./pages/hr/CompanyApplications";
import JobDetail from "./pages/user/JobDetail";
import SearchResults from "./pages/user/SearchResults";
import PrivacyPolicy from "./pages/user/PrivacyPolicy";
import FavoriteJobs from "./pages/user/FavoriteJobs";
import AppliedJobs from "./pages/user/AppliedJobs";
import CVAnalysis from "./pages/user/CVAnalysis";
import UserProfile from "./pages/user/UserProfile";
import CVBuilder from "./pages/user/CVBuilder";
import CareerRoadmap from "./pages/user/CareerRoadmap";
import ForEmployers from "./pages/public/ForEmployers";
import CareerGuide from "./pages/user/CareerGuide";
import CareerGuideDetail from "./pages/user/CareerGuideDetail";
import ArticleManagement from "./pages/admin/ArticleManagement";
import HrManagement from "./pages/admin/HrManagement";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="job/:id" element={<JobDetail />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="cv-analysis" element={<ProtectedRoute><CVAnalysis /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="cv-builder" element={<ProtectedRoute><CVBuilder /></ProtectedRoute>} />
        <Route path="career-roadmap" element={<ProtectedRoute><CareerRoadmap /></ProtectedRoute>} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="favorite-jobs" element={<FavoriteJobs />} />
        <Route path="applied-jobs" element={<AppliedJobs />} />
        <Route path="applications" element={<CompanyApplications />} />
        <Route path="for-employers" element={<ForEmployers />} />
        <Route path="career-guide" element={<CareerGuide />} />
        <Route path="career-guide/:id" element={<CareerGuideDetail />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/admin_dashboard"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <AdminHome />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin_dashboard" replace /> } />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/hrs"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <HrManagement />
            </AdminLayout>
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
        path="/admin/articles"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <ArticleManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr_dashboard"
        element={
          <ProtectedRoute role="HR">
            <HrDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/hr" element={<Navigate to="/hr_dashboard" replace />} />
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
