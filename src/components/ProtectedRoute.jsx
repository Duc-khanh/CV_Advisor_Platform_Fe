import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Token không đúng role
    if (role && decoded.role !== role) {
      return <Navigate to="/user" replace />;
    }

    return children;
  } catch (err) {
    // Token lỗi / hết hạn
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
}
