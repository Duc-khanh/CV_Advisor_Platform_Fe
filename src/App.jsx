import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import UserHome from "./pages/user/UserHome";
import AdminHome from "./pages/admin/AdminHome";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import HrDashboard from "./pages/hr/HrDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EmployerRegister from "./pages/auth/EmployerRegister";
import ProtectedRoute from "./routes/ProtectedRoute";
import CandidateAreaRoute from "./routes/CandidateAreaRoute";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./layouts/AdminLayout";
import HRLayout from "./layouts/HRLayout";
import HrJobManagement from "./pages/hr/HrJobManagement";
import CompanyApplications from "./pages/hr/CompanyApplications";
import { JobDetailPage } from "./features/jobs/job-detail";
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
import UnderDevelopment from "./components/common/UnderDevelopment";
import { AiUsagePage } from "./features/ai-usage";
import { AdminAiManagementPage } from "./features/admin/ai-management";
import HrInterviews from "./pages/hr/HrInterviews";

export default function App() {
  return (
    <Routes>
      {/* CANDIDATE / PUBLIC ROUTES */}
      <Route path="/" element={<CandidateAreaRoute><UserLayout /></CandidateAreaRoute>}>
        <Route index element={<UserHome />} />
        <Route path="job/:id" element={<JobDetailPage />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="cv-analysis" element={<ProtectedRoute role="USER"><CVAnalysis /></ProtectedRoute>} />
        <Route path="ai-usage" element={<ProtectedRoute role="USER"><AiUsagePage /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute role="USER"><UserProfile /></ProtectedRoute>} />
        <Route path="cv-builder" element={<ProtectedRoute role="USER"><CVBuilder /></ProtectedRoute>} />
        <Route path="career-roadmap" element={<ProtectedRoute role="USER"><CareerRoadmap /></ProtectedRoute>} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="favorite-jobs" element={<ProtectedRoute role="USER"><FavoriteJobs /></ProtectedRoute>} />
        <Route path="applied-jobs" element={<ProtectedRoute role="USER"><AppliedJobs /></ProtectedRoute>} />
        <Route path="applications" element={<Navigate to="/hr/applications" replace />} />
        <Route path="for-employers" element={<ForEmployers />} />
        <Route path="career-guide" element={<CareerGuide />} />
        <Route path="career-guide/:id" element={<CareerGuideDetail />} />
      </Route>

      {/* AUTH ROUTES */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-hr" element={<EmployerRegister />} />
      <Route path="/register/employer" element={<EmployerRegister />} />
      <Route path="/employer-register" element={<EmployerRegister />} />

      {/* ADMIN ROUTES */}
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
      <Route path="/admin" element={<Navigate to="/admin_dashboard" replace />} />
      <Route
        path="/admin/ai"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout><AdminAiManagementPage /></AdminLayout>
          </ProtectedRoute>
        }
      />
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
            <AdminLayout>
              <UnderDevelopment
                featureName="Quản lý Công ty"
                description="Tính năng phê duyệt, quản lý danh sách doanh nghiệp và đối tác tuyển dụng đang được phát triển."
                homeUrl="/admin_dashboard"
                homeLabel="Về trang Admin"
              />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stats"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <AdminStats />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <AdminSettings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/schedules"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <UnderDevelopment
                featureName="Quản lý đặt lịch hẹn"
                description="Tính năng theo dõi và điều phối lịch hẹn phỏng vấn toàn hệ thống đang được phát triển."
                homeUrl="/admin_dashboard"
                homeLabel="Về trang Admin"
              />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/permissions"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <UnderDevelopment
                featureName="Phân quyền hệ thống"
                description="Chức năng quản lý vai trò, nhóm quyền hạn và ma trận truy cập chi tiết đang được xây dựng."
                homeUrl="/admin_dashboard"
                homeLabel="Về trang Admin"
              />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/data"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminLayout>
              <UnderDevelopment
                featureName="Quản lý dữ liệu hệ thống"
                description="Tính năng sao lưu, phục hồi dữ liệu và dọn dẹp bộ nhớ tạm đang được cập nhật."
                homeUrl="/admin_dashboard"
                homeLabel="Về trang Admin"
              />
            </AdminLayout>
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

      {/* HR / RECRUITER ROUTES */}
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
      <Route
        path="/hr/ai-usage"
        element={
          <ProtectedRoute role="HR">
            <HRLayout><AiUsagePage /></HRLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/interviews"
        element={
          <ProtectedRoute role="HR">
            <HrInterviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <ProtectedRoute role="HR">
            <HRLayout>
              <UnderDevelopment
                featureName="Cài đặt doanh nghiệp"
                description="Chức năng chỉnh sửa thông tin công ty, quy trình tuyển dụng và mẫu thư thông báo đang được nâng cấp."
                homeUrl="/hr_dashboard"
                homeLabel="Về HR Dashboard"
              />
            </HRLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/reviews"
        element={
          <ProtectedRoute role="HR">
            <HRLayout>
              <UnderDevelopment
                featureName="Đánh giá & Chấm điểm ứng viên"
                description="Hệ thống chấm điểm bài test chuyên môn và rubric đánh giá ứng viên đang được cập nhật."
                homeUrl="/hr_dashboard"
                homeLabel="Về HR Dashboard"
              />
            </HRLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/notes"
        element={
          <ProtectedRoute role="HR">
            <HRLayout>
              <UnderDevelopment
                featureName="Sổ tay ghi chú tuyển dụng"
                description="Tính năng ghi chú nhanh và lưu trữ nhận xét về ứng viên đang được cập nhật."
                homeUrl="/hr_dashboard"
                homeLabel="Về HR Dashboard"
              />
            </HRLayout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK CATCH-ALL ROUTE (PREVENTS BLANK WHITE SCREEN ON ANY UNKNOWN ROUTE) */}
      <Route
        path="*"
        element={
          <CandidateAreaRoute>
            <UserLayout>
              <UnderDevelopment
                title="Trang đang cập nhật hoặc không tìm thấy"
                featureName="Trang bạn tìm kiếm"
                description="Đường dẫn này hiện chưa khả dụng hoặc đang trong giai đoạn phát triển. Vui lòng quay lại trang chủ!"
                homeUrl="/"
                homeLabel="Về trang chủ"
              />
            </UserLayout>
          </CandidateAreaRoute>
        }
      />
    </Routes>
  );
}


