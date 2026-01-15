import { Routes, Route, Navigate } from "react-router-dom";
import UserHome from "./pages/user/UserHome";
import AdminHome from "./pages/admin/AdminHome";
import HrHome from "./pages/hr/HrHome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./components/AdminLayout";


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
<Route path="/admin/users" element={<AdminLayout><UserManagement /></AdminLayout>} />

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
            <HrHome />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
